import crypto from "node:crypto";

import { getEnv } from "../config/env";
import { PasswordResetTokenModel } from "../models/PasswordResetToken";
import { UserModel, type UserRole } from "../models/User";
import { sendUserInviteEmail } from "./mail.service";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function displayNameFromEmail(email: string) {
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function sendInviteSetupEmail(input: {
  user: { id: string; email: string; name: string; role: UserRole };
  origin?: string;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await PasswordResetTokenModel.create({
    userId: input.user.id,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const baseUrl = input.origin || getEnv().appUrl;
  await sendUserInviteEmail({
    email: input.user.email,
    name: input.user.name,
    role: input.user.role,
    setupUrl: `${baseUrl.replace(/\/$/, "")}/reset-password?token=${token}`,
    expiresAt,
  });

  return expiresAt;
}

export const AdminService = {
  async getOverview() {
    const [stats, recent] = await Promise.all([UserModel.stats(), UserModel.recentSignups(8)]);

    return {
      stats,
      recentSignups: recent.map(UserModel.toPublicUser),
    };
  },

  async listUsers(input: {
    page: number;
    pageSize: number;
    search?: string;
    role?: UserRole | "all";
    status?: "active" | "inactive" | "all";
  }) {
    const pageSize = Math.min(Math.max(input.pageSize, 1), 15);
    const page = Math.max(input.page, 1);
    const result = await UserModel.list({ ...input, page, pageSize });

    return {
      users: result.users.map(UserModel.toPublicUser),
      pagination: {
        page,
        pageSize,
        total: result.total,
        totalPages: Math.max(Math.ceil(result.total / pageSize), 1),
      },
      stats: await UserModel.stats(),
    };
  },

  async updateUserStatus(input: { userId: string; status: "active" | "inactive" }) {
    const user = await UserModel.updateStatus(input.userId, input.status);
    if (!user) {
      throw new Error("User not found.");
    }
    return UserModel.toPublicUser(user);
  },

  async updateUserRole(input: { userId: string; role: UserRole }) {
    const user = await UserModel.updateRole(input.userId, input.role);
    if (!user) {
      throw new Error("User not found.");
    }
    return UserModel.toPublicUser(user);
  },

  async inviteUser(input: { email: string; role: UserRole; origin?: string }) {
    const email = input.email.toLowerCase();
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error("A user already exists with this email.");
    }

    const user = await UserModel.create({
      email,
      name: displayNameFromEmail(email),
      role: input.role,
      status: "active",
      invitedAt: new Date(),
    });

    await sendInviteSetupEmail({ user, origin: input.origin });

    return UserModel.toPublicUser(user);
  },

  async resendInvite(input: { userId: string; origin?: string }) {
    const user = await UserModel.findById(input.userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.invited_at) {
      throw new Error("This user was not created through an invite.");
    }

    if (user.password_hash) {
      throw new Error("This invite has already been accepted.");
    }

    await sendInviteSetupEmail({ user, origin: input.origin });
    return UserModel.toPublicUser(user);
  },
};
