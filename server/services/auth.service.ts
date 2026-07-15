import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getEnv, requireEnv } from "../config/env";
import { PasswordResetTokenModel } from "../models/PasswordResetToken";
import { type PublicUser, UserModel, type UserRole } from "../models/User";
import { sendPasswordResetEmail, sendWelcomeEmail } from "./mail.service";

type JwtPayload = {
  sub: string;
  role: UserRole;
};

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signSession(user: PublicUser) {
  return jwt.sign({ sub: user.id, role: user.role } satisfies JwtPayload, requireEnv("jwtSecret"), {
    expiresIn: "7d",
  });
}

export async function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, requireEnv("jwtSecret")) as JwtPayload;
    const user = await UserModel.findById(payload.sub);
    return user ? UserModel.toPublicUser(user) : null;
  } catch {
    return null;
  }
}

export const AuthService = {
  async signup(input: { name: string; email: string; password: string; role?: UserRole }) {
    const existing = await UserModel.findByEmail(input.email);
    if (existing) {
      throw new Error("An account already exists for this email.");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await UserModel.create({
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role ?? "user",
    });
    const publicUser = UserModel.toPublicUser(user);

    await sendWelcomeEmail(publicUser);

    return { user: publicUser, token: signSession(publicUser) };
  },

  async login(input: { email: string; password: string }) {
    const user = await UserModel.findByEmail(input.email);
    if (user?.status === "inactive") {
      throw new Error("Account suspended. Please contact the team.");
    }

    if (!user?.password_hash) {
      throw new Error("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password_hash);
    if (!passwordMatches) {
      throw new Error("Invalid email or password.");
    }

    const publicUser = UserModel.toPublicUser(user);
    return { user: publicUser, token: signSession(publicUser) };
  },

  async requestPasswordReset(input: { email: string; origin?: string }) {
    const user = await UserModel.findByEmail(input.email);
    if (!user) {
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetTokenModel.create({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
    });

    const baseUrl = input.origin || getEnv().appUrl;
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl: `${baseUrl.replace(/\/$/, "")}/reset-password?token=${token}`,
    });
  },

  async resetPassword(input: { token: string; password: string }) {
    const resetToken = await PasswordResetTokenModel.findValid(hashToken(input.token));
    if (!resetToken) {
      throw new Error("This reset link is invalid or has expired.");
    }

    const user = await UserModel.findById(resetToken.user_id);
    if (!user) {
      throw new Error("This reset link is invalid or has expired.");
    }

    if (user.status === "inactive") {
      throw new Error("Account suspended. Please contact the team.");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    await UserModel.updatePassword(resetToken.user_id, passwordHash);
    await PasswordResetTokenModel.markUsed(resetToken.id);
    const updatedUser = await UserModel.findById(resetToken.user_id);
    const publicUser = UserModel.toPublicUser(updatedUser ?? user);

    return { user: publicUser, token: signSession(publicUser) };
  },

  async getGoogleAuthUrl(input: { redirectUri: string; state: string }) {
    const params = new URLSearchParams({
      client_id: requireEnv("googleClientId"),
      redirect_uri: getEnv().googleRedirectUri || input.redirectUri,
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
      state: input.state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async loginWithGoogle(input: { code: string; redirectUri: string }) {
    const redirectUri = getEnv().googleRedirectUri || input.redirectUri;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: input.code,
        client_id: requireEnv("googleClientId"),
        client_secret: requireEnv("googleClientSecret"),
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Google sign-in failed.");
    }

    const tokens = (await tokenResponse.json()) as { access_token?: string };
    if (!tokens.access_token) {
      throw new Error("Google did not return an access token.");
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileResponse.ok) {
      throw new Error("Could not read Google profile.");
    }

    const profile = (await profileResponse.json()) as {
      id: string;
      email: string;
      name?: string;
      verified_email?: boolean;
    };

    if (!profile.email) {
      throw new Error("Google account does not include an email address.");
    }

    let user =
      (await UserModel.findByGoogleId(profile.id)) ?? (await UserModel.findByEmail(profile.email));

    if (user?.status === "inactive") {
      throw new Error("Account suspended. Please contact the team.");
    }

    if (user && !user.google_id) {
      user = await UserModel.attachGoogleId(user.id, profile.id);
    }

    if (!user) {
      user = await UserModel.create({
        email: profile.email,
        name: profile.name || profile.email.split("@")[0],
        googleId: profile.id,
        role: "user",
      });
      await sendWelcomeEmail(UserModel.toPublicUser(user));
    }

    const publicUser = UserModel.toPublicUser(user);
    return { user: publicUser, token: signSession(publicUser) };
  },
};
