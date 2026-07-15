import { query } from "../db/pool";

export type PasswordResetTokenRecord = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  used_at: Date | null;
  created_at: Date;
};

export const PasswordResetTokenModel = {
  async create(input: { userId: string; tokenHash: string; expiresAt: Date }) {
    await query(
      `insert into password_reset_tokens (user_id, token_hash, expires_at)
       values ($1, $2, $3)`,
      [input.userId, input.tokenHash, input.expiresAt],
    );
  },

  async findValid(tokenHash: string) {
    const result = await query<PasswordResetTokenRecord>(
      `select * from password_reset_tokens
       where token_hash = $1 and used_at is null and expires_at > now()
       limit 1`,
      [tokenHash],
    );
    return result.rows[0] ?? null;
  },

  async markUsed(id: string) {
    await query("update password_reset_tokens set used_at = now() where id = $1", [id]);
  },
};
