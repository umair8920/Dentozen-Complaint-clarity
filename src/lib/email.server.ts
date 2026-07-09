import nodemailer from "nodemailer";

import { getServerConfig } from "./config.server";

type ContactEmailInput = {
  name: string;
  practice?: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

function getRequiredEnvValue(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContactEmail(input: ContactEmailInput) {
  const config = getServerConfig();
  const smtpPort = Number(getRequiredEnvValue(config.smtpPort, "SMTP_PORT"));

  if (Number.isNaN(smtpPort)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  const transporter = nodemailer.createTransport({
    host: getRequiredEnvValue(config.smtpHost, "SMTP_HOST"),
    port: smtpPort,
    secure: config.smtpSecure === "true",
    auth: {
      user: getRequiredEnvValue(config.smtpUser, "SMTP_USER"),
      pass: getRequiredEnvValue(config.smtpPass, "SMTP_PASS"),
    },
  });

  const toEmail = getRequiredEnvValue(config.contactFormToEmail, "CONTACT_FORM_TO_EMAIL");
  const fromEmail = getRequiredEnvValue(config.smtpFromEmail, "SMTP_FROM_EMAIL");
  const fromName = config.smtpFromName || "Website Contact Form";
  const practiceLine = input.practice?.trim() ? input.practice.trim() : "Not provided";
  const phoneLine = input.phone?.trim() ? input.phone.trim() : "Not provided";

  await transporter.sendMail({
    to: toEmail,
    from: `"${fromName}" <${fromEmail}>`,
    replyTo: input.email,
    subject: `New contact form enquiry: ${input.interest}`,
    text: [
      "New contact form enquiry",
      "",
      `Name: ${input.name}`,
      `Practice: ${practiceLine}`,
      `Email: ${input.email}`,
      `Phone: ${phoneLine}`,
      `Interest: ${input.interest}`,
      "",
      "Message:",
      input.message,
    ].join("\n"),
    html: `
      <h2>New contact form enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Practice:</strong> ${escapeHtml(practiceLine)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phoneLine)}</p>
      <p><strong>Interest:</strong> ${escapeHtml(input.interest)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
    `,
  });
}
