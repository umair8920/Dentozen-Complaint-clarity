import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters.").max(100);

export const authUserSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  password: z.string().min(1, "Password is required."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "Reset token is missing."),
  password: passwordSchema,
});

export const googleUrlSchema = z.object({
  redirectUri: z.string().url(),
});

export const googleCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
  redirectUri: z.string().url(),
});

export const signup = createServerFn({ method: "POST" })
  .validator(authUserSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.signup({ ...data, role: "user" });
  });

export const login = createServerFn({ method: "POST" })
  .validator(loginSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.login(data);
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const { AuthController } = await import("../../../server/controllers/auth.controller");
  return AuthController.logout();
});

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const { AuthController } = await import("../../../server/controllers/auth.controller");
  return AuthController.me();
});

export const forgotPassword = createServerFn({ method: "POST" })
  .validator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.forgotPassword(data);
  });

export const resetPassword = createServerFn({ method: "POST" })
  .validator(resetPasswordSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.resetPassword(data);
  });

export const getGoogleAuthUrl = createServerFn({ method: "POST" })
  .validator(googleUrlSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.googleAuthUrl(data);
  });

export const completeGoogleLogin = createServerFn({ method: "POST" })
  .validator(googleCallbackSchema)
  .handler(async ({ data }) => {
    const { AuthController } = await import("../../../server/controllers/auth.controller");
    return AuthController.googleCallback(data);
  });
