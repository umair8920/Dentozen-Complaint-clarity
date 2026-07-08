import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout, a as SITE } from "./SiteLayout-DaFApg4Y.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import "../_libs/sonner.mjs";
import { l as Calendar, p as CreditCard, S as ShieldCheck } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function BookPage() {
  reactExports.useEffect(() => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://assets.calendly.com/assets/external/widget.js";
    js.async = true;
    document.body.appendChild(js);
    return () => {
      document.head.removeChild(css);
      document.body.removeChild(js);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Book Now", title: "Pick a time that works for you", description: "Choose a service, pick a slot and pay securely — it takes 2 minutes." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-3", children: [{
        icon: Calendar,
        label: "Live availability"
      }, {
        icon: CreditCard,
        label: "Secure online payment"
      }, {
        icon: ShieldCheck,
        label: "Confirmation by email"
      }].map(({
        icon: Icon,
        label
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: label })
      ] }, label)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl rounded-3xl border border-border bg-background p-3 shadow-card sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "calendly-inline-widget rounded-2xl overflow-hidden", "data-url": SITE.calendlyUrl, style: {
        minWidth: 320,
        height: 720
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: [
        "Booking widget not loading? Visit",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: SITE.calendlyUrl, target: "_blank", rel: "noreferrer", className: "underline", children: SITE.calendlyUrl }),
        "."
      ] })
    ] }) })
  ] });
}
export {
  BookPage as component
};
