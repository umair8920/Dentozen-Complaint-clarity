import { c as createServerRpc } from "./createServerRpc-DC83_W0b.mjs";
import { b as createServerFn } from "./server-BkGTo3Rc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const packageQuoteSchema = objectType({
  name: stringType().trim().min(1, "Name is required").max(100),
  email: stringType().trim().email("Invalid email").max(255),
  selection: stringType().trim().min(1, "Please select at least one item")
});
const submitPackageQuote_createServerFn_handler = createServerRpc({
  id: "bf20422b8d4d52c0bf2cfb138cd71deb959abbfacab80465d4c17a5819b4e4f2",
  name: "submitPackageQuote",
  filename: "src/lib/api/package.functions.ts"
}, (opts) => submitPackageQuote.__executeServer(opts));
const submitPackageQuote = createServerFn({
  method: "POST"
}).validator(packageQuoteSchema).handler(submitPackageQuote_createServerFn_handler, async ({
  data
}) => {
  const {
    sendPackageQuoteEmail
  } = await import("./email.server-BM1A1EI4.mjs");
  await sendPackageQuoteEmail(data);
  return {
    ok: true
  };
});
export {
  submitPackageQuote_createServerFn_handler
};
