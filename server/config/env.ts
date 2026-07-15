import process from "node:process";

export function getEnv() {
  return {
    appUrl: process.env.APP_URL ?? "http://localhost:5173",
    authCookieName: process.env.AUTH_COOKIE_NAME ?? "cc_auth",
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpFromName: process.env.SMTP_FROM_NAME,
  };
}

export function requireEnv(key: keyof ReturnType<typeof getEnv>) {
  const value = getEnv()[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${String(key)}`);
  }
  return value;
}
