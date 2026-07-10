import { n as nodemailer } from "../_libs/nodemailer.mjs";
import process from "node:process";
import { d as decodeSelection, s as selectionSummary } from "./package-selection-C_2R5Iwn.mjs";
import "events";
import "url";
import "fs";
import "http";
import "https";
import "zlib";
import "net";
import "dns";
import "os";
import "path";
import "tls";
import "child_process";
import "../_libs/react.mjs";
import "util";
import "stream";
import "crypto";
import "./pricing-D5FjTA98.mjs";
function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    contactFormToEmail: process.env.CONTACT_FORM_TO_EMAIL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpSecure: process.env.SMTP_SECURE,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromEmail: process.env.SMTP_FROM_EMAIL,
    smtpFromName: process.env.SMTP_FROM_NAME
  };
}
function getRequiredEnvValue(value, key) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
async function sendContactEmail(input) {
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
      pass: getRequiredEnvValue(config.smtpPass, "SMTP_PASS")
    }
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
      input.message
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
    `
  });
}
async function sendBookingEmail(input) {
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
      pass: getRequiredEnvValue(config.smtpPass, "SMTP_PASS")
    }
  });
  const toEmail = getRequiredEnvValue(config.contactFormToEmail, "CONTACT_FORM_TO_EMAIL");
  const fromEmail = getRequiredEnvValue(config.smtpFromEmail, "SMTP_FROM_EMAIL");
  const fromName = config.smtpFromName || "Website Booking Form";
  const delegatesLine = input.delegates?.trim() ? input.delegates.trim() : "Not provided";
  const packageSelection = input.packageSelection?.trim() ? decodeSelection(input.packageSelection) : {};
  const packageSummary = input.packageSummary?.trim() || selectionSummary(packageSelection);
  const packageTotalLine = input.packageTotal?.trim() ? input.packageTotal.trim() : "";
  const packageBlock = packageSummary.trim() ? `

${packageSummary}${packageTotalLine ? `
${packageTotalLine}` : ""}` : "";
  await transporter.sendMail({
    to: toEmail,
    from: `"${fromName}" <${fromEmail}>`,
    replyTo: input.email,
    subject: `New booking request: ${input.serviceRequired}`,
    text: [
      "New booking request",
      "",
      `Full name: ${input.fullName}`,
      `Email: ${input.email}`,
      `Telephone: ${input.telephone}`,
      `Name of practice: ${input.nameOfPractice}`,
      `Service required: ${input.serviceRequired}`,
      `Preferred dates: ${input.bookingDates}`,
      `Timing of booking: ${input.bookingTime}`,
      `Delegates: ${delegatesLine}`,
      `Payment link: ${input.paymentLink}`,
      packageBlock ? `Package selection:${packageBlock}` : ""
    ].join("\n"),
    html: `
      <h2>New booking request</h2>
      <p><strong>Full name:</strong> ${escapeHtml(input.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Telephone:</strong> ${escapeHtml(input.telephone)}</p>
      <p><strong>Name of practice:</strong> ${escapeHtml(input.nameOfPractice)}</p>
      <p><strong>Service required:</strong> ${escapeHtml(input.serviceRequired)}</p>
      <p><strong>Preferred dates:</strong></p>
      <p>${escapeHtml(input.bookingDates).replace(/\n/g, "<br />")}</p>
      <p><strong>Timing of booking:</strong> ${escapeHtml(input.bookingTime)}</p>
      <p><strong>Delegates:</strong> ${escapeHtml(delegatesLine)}</p>
      <p><strong>Payment link:</strong> <a href="${escapeHtml(input.paymentLink)}">${escapeHtml(input.paymentLink)}</a></p>
      ${packageSummary.trim() ? `<p><strong>Package selection:</strong></p><pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(packageSummary)}${packageTotalLine ? `
${escapeHtml(packageTotalLine)}` : ""}</pre>` : ""}
    `
  });
}
async function sendPackageQuoteEmail(input) {
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
      pass: getRequiredEnvValue(config.smtpPass, "SMTP_PASS")
    }
  });
  const toEmail = getRequiredEnvValue(config.contactFormToEmail, "CONTACT_FORM_TO_EMAIL");
  const fromEmail = getRequiredEnvValue(config.smtpFromEmail, "SMTP_FROM_EMAIL");
  const selectionData = decodeSelection(input.selection);
  const summary = selectionSummary(selectionData);
  await transporter.sendMail({
    to: input.email,
    bcc: toEmail,
    from: `"${config.smtpFromName || "Website Quote Form"}" <${fromEmail}>`,
    replyTo: toEmail,
    subject: "Your package quote",
    text: [
      `Hi ${input.name},`,
      "",
      "Thanks for using the package calculator.",
      "",
      summary,
      "",
      "If you'd like to proceed, reply to this email and we'll help you next."
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Thanks for using the package calculator.</p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(summary)}</pre>
      <p>If you'd like to proceed, reply to this email and we'll help you next.</p>
    `
  });
}
export {
  sendBookingEmail,
  sendContactEmail,
  sendPackageQuoteEmail
};
