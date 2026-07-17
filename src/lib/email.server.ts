import nodemailer from "nodemailer";

import { getServerConfig } from "./config.server";
import { decodeSelection, selectionSummary } from "./package-selection";
import { ITEMS } from "./pricing";
import { toPriceItems } from "./service-content";

type ContactEmailInput = {
  name: string;
  practice?: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
};

type BookingEmailInput = {
  fullName: string;
  email: string;
  telephone: string;
  nameOfPractice: string;
  serviceRequired: string;
  bookingDates: string;
  bookingTime: string;
  delegates?: string;
  paymentLink: string;
  packageSelection?: string;
  packageSummary?: string;
  packageTotal?: string;
  bookingReference?: string;
  bookingScope?: string;
  fulfilmentType?: string;
  bookingDetails?: Record<
    string,
    string | number | boolean | null | Record<string, string | number | boolean | null>
  >;
};

type PackageQuoteInput = {
  name: string;
  email: string;
  selection: string;
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

async function getPackagePriceItems() {
  try {
    const { ServiceContentService } = await import("../../server/services/service-content.service");
    const { items } = await ServiceContentService.listPublic("build-your-package");
    return toPriceItems(items, ITEMS);
  } catch (error) {
    console.error("Falling back to static package pricing for email summary.", error);
    return ITEMS;
  }
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

export async function sendBookingEmail(input: BookingEmailInput) {
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
  const fromName = config.smtpFromName || "Website Booking Form";
  const delegatesLine = input.delegates?.trim() ? input.delegates.trim() : "Not provided";
  const packageSelection = input.packageSelection?.trim()
    ? decodeSelection(input.packageSelection)
    : {};
  const packagePriceItems = await getPackagePriceItems();
  const packageSummary =
    input.packageSummary?.trim() || selectionSummary(packageSelection, packagePriceItems);
  const packageTotalLine = input.packageTotal?.trim() ? input.packageTotal.trim() : "";
  const packageBlock = packageSummary.trim()
    ? `\n\n${packageSummary}${packageTotalLine ? `\n${packageTotalLine}` : ""}`
    : "";
  const bookingDetails = Object.entries(input.bookingDetails ?? {})
    .filter(([, value]) => value !== "" && value !== null && value !== undefined)
    .map(([key, value]) => `${humaniseKey(key)}: ${formatDetailValue(value)}`);
  const bookingDetailsText = bookingDetails.length
    ? ["", "Service-specific details:", ...bookingDetails].join("\n")
    : "";
  const bookingDetailsHtml = bookingDetails.length
    ? `<h3>Service-specific details</h3><ul>${bookingDetails
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join("")}</ul>`
    : "";

  await transporter.sendMail({
    to: toEmail,
    from: `"${fromName}" <${fromEmail}>`,
    replyTo: input.email,
    subject: `New booking request: ${input.serviceRequired}`,
    text: [
      "New booking request",
      "",
      `Reference: ${input.bookingReference || "Pending"}`,
      `Full name: ${input.fullName}`,
      `Email: ${input.email}`,
      `Telephone: ${input.telephone}`,
      `Name of practice: ${input.nameOfPractice}`,
      `Service required: ${input.serviceRequired}`,
      `Scope: ${input.bookingScope || "practice"}`,
      `Fulfilment: ${input.fulfilmentType || "onsite"}`,
      `Preferred dates: ${input.bookingDates}`,
      `Timing of booking: ${input.bookingTime}`,
      `Delegates: ${delegatesLine}`,
      `Payment link: ${input.paymentLink}`,
      packageBlock ? `Package selection:${packageBlock}` : "",
      bookingDetailsText,
    ].join("\n"),
    html: `
      <h2>New booking request</h2>
      <p><strong>Reference:</strong> ${escapeHtml(input.bookingReference || "Pending")}</p>
      <p><strong>Full name:</strong> ${escapeHtml(input.fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Telephone:</strong> ${escapeHtml(input.telephone)}</p>
      <p><strong>Name of practice:</strong> ${escapeHtml(input.nameOfPractice)}</p>
      <p><strong>Service required:</strong> ${escapeHtml(input.serviceRequired)}</p>
      <p><strong>Scope:</strong> ${escapeHtml(input.bookingScope || "practice")}</p>
      <p><strong>Fulfilment:</strong> ${escapeHtml(input.fulfilmentType || "onsite")}</p>
      <p><strong>Preferred dates:</strong></p>
      <p>${escapeHtml(input.bookingDates).replace(/\n/g, "<br />")}</p>
      <p><strong>Timing of booking:</strong> ${escapeHtml(input.bookingTime)}</p>
      <p><strong>Delegates:</strong> ${escapeHtml(delegatesLine)}</p>
      <p><strong>Payment link:</strong> <a href="${escapeHtml(input.paymentLink)}">${escapeHtml(input.paymentLink)}</a></p>
      ${
        packageSummary.trim()
          ? `<p><strong>Package selection:</strong></p><pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(packageSummary)}${packageTotalLine ? `\n${escapeHtml(packageTotalLine)}` : ""}</pre>`
          : ""
      }
      ${bookingDetailsHtml}
    `,
  });
}

function humaniseKey(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatDetailValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (typeof value === "object" && value) {
    return Object.values(value).filter(Boolean).join(", ");
  }
  return String(value);
}

export async function sendPackageQuoteEmail(input: PackageQuoteInput) {
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
  const selectionData = decodeSelection(input.selection);
  const summary = selectionSummary(selectionData, await getPackagePriceItems());

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
      "If you'd like to proceed, reply to this email and we'll help you next.",
    ].join("\n"),
    html: `
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>Thanks for using the package calculator.</p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(summary)}</pre>
      <p>If you'd like to proceed, reply to this email and we'll help you next.</p>
    `,
  });
}
