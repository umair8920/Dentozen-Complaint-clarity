import { c as createServerRpc } from "./createServerRpc-DC83_W0b.mjs";
import { b as createServerFn } from "./server-BkGTo3Rc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, l as literalType } from "../_libs/zod.mjs";
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
const contactFormSchema = objectType({
  name: stringType().trim().min(1, "Name is required").max(100),
  practice: stringType().trim().max(150).optional().or(literalType("")),
  email: stringType().trim().email("Invalid email").max(255),
  phone: stringType().trim().max(40).optional().or(literalType("")),
  interest: stringType().max(80),
  message: stringType().trim().min(1, "Message is required").max(1e3)
});
const submitContactForm_createServerFn_handler = createServerRpc({
  id: "51496c6ca2b5055341948a46205d4083f7301883d1e1b16d00d2abd04c02d91c",
  name: "submitContactForm",
  filename: "src/lib/api/contact.functions.ts"
}, (opts) => submitContactForm.__executeServer(opts));
const submitContactForm = createServerFn({
  method: "POST"
}).validator(contactFormSchema).handler(submitContactForm_createServerFn_handler, async ({
  data
}) => {
  const {
    sendContactEmail
  } = await import("./email.server-BM1A1EI4.mjs");
  await sendContactEmail(data);
  return {
    ok: true
  };
});
export {
  submitContactForm_createServerFn_handler
};
