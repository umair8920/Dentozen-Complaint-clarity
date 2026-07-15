import crypto from "node:crypto";
import { deleteCookie, getCookie, getRequestUrl, setCookie } from "@tanstack/start-server-core";

import { getEnv } from "../config/env";
import { getUserFromToken, AuthService } from "../services/auth.service";

const GOOGLE_STATE_COOKIE = "cc_google_oauth_state";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function authCookieName() {
  return getEnv().authCookieName;
}

function setAuthCookie(token: string) {
  setCookie(authCookieName(), token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export const AuthController = {
  async signup(input: { name: string; email: string; password: string; role?: "user" }) {
    const result = await AuthService.signup(input);
    setAuthCookie(result.token);
    return { user: result.user };
  },

  async login(input: { email: string; password: string }) {
    const result = await AuthService.login(input);
    setAuthCookie(result.token);
    return { user: result.user };
  },

  async logout() {
    deleteCookie(authCookieName(), { path: "/" });
    return { ok: true };
  },

  async me() {
    const user = await getUserFromToken(getCookie(authCookieName()));
    return { user };
  },

  async forgotPassword(input: { email: string }) {
    const requestUrl = getRequestUrl();
    await AuthService.requestPasswordReset({
      email: input.email,
      origin: `${requestUrl.protocol}//${requestUrl.host}`,
    });
    return { ok: true };
  },

  async resetPassword(input: { token: string; password: string }) {
    const result = await AuthService.resetPassword(input);
    setAuthCookie(result.token);
    return { user: result.user };
  },

  async googleAuthUrl(input: { redirectUri: string }) {
    const state = crypto.randomBytes(24).toString("hex");
    setCookie(GOOGLE_STATE_COOKIE, state, {
      ...cookieOptions,
      maxAge: 60 * 10,
    });

    return { url: await AuthService.getGoogleAuthUrl({ redirectUri: input.redirectUri, state }) };
  },

  async googleCallback(input: { code: string; state: string; redirectUri: string }) {
    const expectedState = getCookie(GOOGLE_STATE_COOKIE);
    deleteCookie(GOOGLE_STATE_COOKIE, { path: "/" });

    if (!expectedState || expectedState !== input.state) {
      throw new Error("Google sign-in state is invalid.");
    }

    const result = await AuthService.loginWithGoogle({
      code: input.code,
      redirectUri: input.redirectUri,
    });
    setAuthCookie(result.token);
    return { user: result.user };
  },
};
