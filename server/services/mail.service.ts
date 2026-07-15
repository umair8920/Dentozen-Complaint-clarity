import nodemailer from "nodemailer";

import { getEnv, requireEnv } from "../config/env";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTransporter() {
  const env = getEnv();
  const smtpPort = Number(requireEnv("smtpPort"));

  if (Number.isNaN(smtpPort)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  return nodemailer.createTransport({
    host: requireEnv("smtpHost"),
    port: smtpPort,
    secure: env.smtpSecure === "true",
    auth: {
      user: requireEnv("smtpUser"),
      pass: requireEnv("smtpPass"),
    },
  });
}

export async function sendWelcomeEmail(input: { email: string; name: string }) {
  const env = getEnv();
  const fromEmail = requireEnv("smtpFromEmail");
  const fromName = env.smtpFromName || "Smart Dental Compliance & Training";

  await getTransporter().sendMail({
    to: input.email,
    from: `"${fromName}" <${fromEmail}>`,
    subject: "Welcome to Smart Dental Compliance & Training",
    text: [
      `Hi ${input.name},`,
      "",
      "Welcome to Smart Dental Compliance & Training.",
      "Your account is ready, and you can now access your dashboard.",
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Welcome to Smart Dental Compliance &amp; Training.</p>
      <p>Your account is ready, and you can now access your dashboard.</p>
    `,
  });
}

export async function sendPasswordResetEmail(input: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  const env = getEnv();
  const fromEmail = requireEnv("smtpFromEmail");
  const fromName = env.smtpFromName || "Smart Dental Compliance & Training";

  await getTransporter().sendMail({
    to: input.email,
    from: `"${fromName}" <${fromEmail}>`,
    subject: "Reset your password",
    text: [
      `Hi ${input.name},`,
      "",
      "Use the link below to reset your password. This link expires in one hour.",
      input.resetUrl,
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Use the link below to reset your password. This link expires in one hour.</p>
      <p><a href="${escapeHtml(input.resetUrl)}">Reset your password</a></p>
    `,
  });
}

export async function sendUserInviteEmail(input: {
  email: string;
  name: string;
  role: string;
  setupUrl: string;
  expiresAt: Date;
}) {
  const env = getEnv();
  const fromEmail = requireEnv("smtpFromEmail");
  const fromName = env.smtpFromName || "Smart Dental Compliance & Training";
  const expiryText = input.expiresAt.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

  await getTransporter().sendMail({
    to: input.email,
    from: `"${fromName}" <${fromEmail}>`,
    subject: "Your Smart Dental Compliance account is ready",
    text: [
      `Hi ${input.name},`,
      "",
      `You have been invited as ${input.role}.`,
      "Use the link below to create your password and access your dashboard.",
      `This invite link is valid for 7 days and expires on ${expiryText} UTC.`,
      input.setupUrl,
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>You have been invited as <strong>${escapeHtml(input.role)}</strong>.</p>
      <p>Use the link below to create your password and access your dashboard.</p>
      <p>This invite link is valid for <strong>7 days</strong> and expires on <strong>${escapeHtml(expiryText)} UTC</strong>.</p>
      <p><a href="${escapeHtml(input.setupUrl)}">Create your password</a></p>
    `,
  });
}
