import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  practice: z.string().trim().max(150).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  interest: z.string().max(80),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .validator(contactFormSchema)
  .handler(async ({ data }) => {
    const { sendContactEmail } = await import("../email.server");

    await sendContactEmail(data);

    return { ok: true };
  });
