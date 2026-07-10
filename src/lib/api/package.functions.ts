import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const packageQuoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  selection: z.string().trim().min(1, "Please select at least one item"),
});

export const submitPackageQuote = createServerFn({ method: "POST" })
  .validator(packageQuoteSchema)
  .handler(async ({ data }) => {
    const { sendPackageQuoteEmail } = await import("../email.server");

    await sendPackageQuoteEmail(data);

    return { ok: true };
  });
