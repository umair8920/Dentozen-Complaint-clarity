import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const bookingFormSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required").max(100),
    email: z.string().trim().email("Invalid email").max(255),
    telephone: z.string().trim().min(1, "Telephone is required").max(40),
    nameOfPractice: z.string().trim().min(1, "Name of practice is required").max(150),
    serviceRequired: z.string().trim().min(1, "Service is required").max(80),
    bookingDates: z.string().trim().min(1, "Please provide 2-3 preferred dates").max(500),
    bookingTime: z.string().trim().min(1, "Timing of booking is required").max(120),
    delegates: z.string().trim().max(40).optional().or(z.literal("")),
    paymentLink: z.string().trim().min(1).max(255),
    packageSelection: z.string().trim().optional().or(z.literal("")),
    packageSummary: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.serviceRequired === "training-session" && !data.delegates?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["delegates"],
        message: "Please state the number of delegates for the training session",
      });
    }
  });

export const submitBookingForm = createServerFn({ method: "POST" })
  .validator(bookingFormSchema)
  .handler(async ({ data }) => {
    const { sendBookingEmail } = await import("../email.server");

    await sendBookingEmail(data);

    return { ok: true };
  });
