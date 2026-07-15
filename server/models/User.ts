import { query } from "../db/pool";

export type UserRole = "admin" | "trainer" | "user";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "inactive";
  password_hash: string | null;
  google_id: string | null;
  invited_at: Date | null;
  invite_token_expires_at?: Date | null;
  invite_token_used_at?: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "inactive";
  inviteStatus: "not_invited" | "pending" | "accepted" | "expired";
  invitedAt: string | null;
  inviteExpiresAt: string | null;
};

function toPublicUser(user: UserRecord): PublicUser {
  const inviteStatus = (() => {
    if (!user.invited_at) return "not_invited";
    if (user.password_hash) return "accepted";
    if (user.invite_token_expires_at && user.invite_token_expires_at <= new Date())
      return "expired";
    return "pending";
  })();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    inviteStatus,
    invitedAt: user.invited_at?.toISOString() ?? null,
    inviteExpiresAt: user.invite_token_expires_at?.toISOString() ?? null,
  };
}

export const UserModel = {
  toPublicUser,

  async findByEmail(email: string) {
    const result = await query<UserRecord>("select * from users where email = $1 limit 1", [
      email.toLowerCase(),
    ]);
    return result.rows[0] ?? null;
  },

  async findById(id: string) {
    const result = await query<UserRecord>("select * from users where id = $1 limit 1", [id]);
    return result.rows[0] ?? null;
  },

  async findByGoogleId(googleId: string) {
    const result = await query<UserRecord>("select * from users where google_id = $1 limit 1", [
      googleId,
    ]);
    return result.rows[0] ?? null;
  },

  async create(input: {
    email: string;
    name: string;
    passwordHash?: string;
    role?: UserRole;
    googleId?: string;
    status?: "active" | "inactive";
    invitedAt?: Date;
  }) {
    const result = await query<UserRecord>(
      `insert into users (email, name, password_hash, role, google_id, status, invited_at)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        input.email.toLowerCase(),
        input.name,
        input.passwordHash ?? null,
        input.role ?? "user",
        input.googleId ?? null,
        input.status ?? "active",
        input.invitedAt ?? null,
      ],
    );
    return result.rows[0];
  },

  async attachGoogleId(id: string, googleId: string) {
    const result = await query<UserRecord>(
      `update users
       set google_id = $2, updated_at = now()
       where id = $1
       returning *`,
      [id, googleId],
    );
    return result.rows[0];
  },

  async updatePassword(id: string, passwordHash: string) {
    await query("update users set password_hash = $2, updated_at = now() where id = $1", [
      id,
      passwordHash,
    ]);
  },

  async updateStatus(id: string, status: "active" | "inactive") {
    const result = await query<UserRecord>(
      `update users
       set status = $2, updated_at = now()
       where id = $1
       returning *`,
      [id, status],
    );
    return result.rows[0] ?? null;
  },

  async updateRole(id: string, role: UserRole) {
    const result = await query<UserRecord>(
      `update users
       set role = $2, updated_at = now()
       where id = $1
       returning *`,
      [id, role],
    );
    return result.rows[0] ?? null;
  },

  async list(input: {
    page: number;
    pageSize: number;
    search?: string;
    role?: UserRole | "all";
    status?: "active" | "inactive" | "all";
  }) {
    const where: string[] = [];
    const params: unknown[] = [];

    if (input.search?.trim()) {
      params.push(`%${input.search.trim().toLowerCase()}%`);
      where.push(`(lower(email) like $${params.length} or lower(name) like $${params.length})`);
    }

    if (input.role && input.role !== "all") {
      params.push(input.role);
      where.push(`role = $${params.length}`);
    }

    if (input.status && input.status !== "all") {
      params.push(input.status);
      where.push(`status = $${params.length}`);
    }

    const whereSql = where.length ? `where ${where.join(" and ")}` : "";
    const offset = (input.page - 1) * input.pageSize;

    const totalResult = await query<{ total: string }>(
      `select count(*)::text as total from users ${whereSql}`,
      params,
    );

    params.push(input.pageSize, offset);
    const rowsResult = await query<UserRecord>(
      `select users.*,
        invite_token.expires_at as invite_token_expires_at,
        invite_token.used_at as invite_token_used_at
       from users
       left join lateral (
         select expires_at, used_at
         from password_reset_tokens
         where password_reset_tokens.user_id = users.id
         order by created_at desc
         limit 1
       ) invite_token on true
       ${whereSql}
       order by users.created_at desc
       limit $${params.length - 1} offset $${params.length}`,
      params,
    );

    return {
      users: rowsResult.rows,
      total: Number(totalResult.rows[0]?.total ?? 0),
    };
  },

  async stats() {
    const result = await query<{
      total_users: string;
      trainers: string;
      inactive: string;
      admins: string;
      pending_invites: string;
    }>(
      `select
        count(*)::text as total_users,
        count(*) filter (where role = 'trainer')::text as trainers,
        count(*) filter (where status = 'inactive')::text as inactive,
        count(*) filter (where role = 'admin')::text as admins,
        count(*) filter (where invited_at is not null and password_hash is null)::text as pending_invites
       from users`,
    );

    return {
      totalUsers: Number(result.rows[0]?.total_users ?? 0),
      trainers: Number(result.rows[0]?.trainers ?? 0),
      inactive: Number(result.rows[0]?.inactive ?? 0),
      admins: Number(result.rows[0]?.admins ?? 0),
      pendingInvites: Number(result.rows[0]?.pending_invites ?? 0),
    };
  },

  async recentSignups(limit = 8) {
    const result = await query<UserRecord>(
      `select * from users
       order by created_at desc
       limit $1`,
      [limit],
    );
    return result.rows;
  },

  async activeTrainers() {
    const result = await query<UserRecord>(
      `select * from users
       where role = 'trainer' and status = 'active'
       order by created_at asc`,
    );
    return result.rows;
  },
};
