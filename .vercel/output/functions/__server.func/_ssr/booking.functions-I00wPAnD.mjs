import { c as createServerRpc } from "./createServerRpc-DC83_W0b.mjs";
import { b as createServerFn } from "./server-BkGTo3Rc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, l as literalType, Z as ZodIssueCode } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const bookingFormSchema = objectType({
  fullName: stringType().trim().min(1, "Full name is required").max(100),
  email: stringType().trim().email("Invalid email").max(255),
  telephone: stringType().trim().min(1, "Telephone is required").max(40),
  nameOfPractice: stringType().trim().min(1, "Name of practice is required").max(150),
  serviceRequired: stringType().trim().min(1, "Service is required").max(80),
  bookingDates: stringType().trim().min(1, "Please provide 2-3 preferred dates").max(500),
  bookingTime: stringType().trim().min(1, "Timing of booking is required").max(120),
  delegates: stringType().trim().max(40).optional().or(literalType("")),
  paymentLink: stringType().trim().min(1).max(255),
  packageSelection: stringType().trim().optional().or(literalType("")),
  packageSummary: stringType().trim().optional().or(literalType(""))
}).superRefine((data, ctx) => {
  if (data.serviceRequired === "training-session" && !data.delegates?.trim()) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["delegates"],
      message: "Please state the number of delegates for the training session"
    });
  }
});
const submitBookingForm_createServerFn_handler = createServerRpc({
  id: "f772fefa96478c6a8f9bf5816d29d6b432d9650f9f42958d1ff9b17bdfc3422b",
  name: "submitBookingForm",
  filename: "src/lib/api/booking.functions.ts"
}, (opts) => submitBookingForm.__executeServer(opts));
const submitBookingForm = createServerFn({
  method: "POST"
}).validator(bookingFormSchema).handler(submitBookingForm_createServerFn_handler, async ({
  data
}) => {
  const {
    sendBookingEmail
  } = await import("./email.server-BM1A1EI4.mjs");
  await sendBookingEmail(data);
  return {
    ok: true
  };
});
export {
  submitBookingForm_createServerFn_handler
};
