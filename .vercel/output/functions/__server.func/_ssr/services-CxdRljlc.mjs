import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DaFApg4Y.mjs";
import { C as CTASection } from "./CTASection-CTA2ED-o.mjs";
import "../_libs/sonner.mjs";
import { h as ClipboardCheck, B as Building2, i as Sparkles, a as Stethoscope, F as FileCheckCorner, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const SERVICES = [{
  id: "mock-inspection",
  icon: ClipboardCheck,
  gradient: "gradient-teal-purple",
  title: "CQC Mock Inspections",
  body: "A full mock inspection just before your CQC inspection, with a detailed report and help implementing every action plan — so you walk into the real thing ready and confident.",
  cta: "Book a mock inspection"
}, {
  id: "due-diligence",
  icon: Building2,
  gradient: "gradient-purple-orange",
  title: "Due Diligence Mock Inspection",
  body: "Buying a dental practice? We carry out a full compliance due diligence review before you purchase — so you know exactly what you're buying and what it takes to make it compliant.",
  cta: "Enquire about due diligence"
}, {
  id: "managed",
  icon: Sparkles,
  gradient: "gradient-orange-gold",
  title: "Smart Managed Service",
  body: "We take over your compliance entirely. Quarterly visits to keep policies, procedures and every certificate up to date. Bundle every service with one provider — nothing gets misplaced. Your fully managed compliance partner.",
  cta: "Enquire about managed service",
  badge: "Fully managed · subscription"
}, {
  id: "new-practice",
  icon: Stethoscope,
  gradient: "gradient-blue-teal",
  title: "Compliance Setup for New Practices",
  body: "Opening a new dental practice? We get you compliant from day one — CQC registration, policies and procedures, RPA service, risk assessments, the lot.",
  cta: "Set up my new practice"
}, {
  id: "cqc-registration",
  icon: FileCheckCorner,
  gradient: "gradient-teal-purple",
  title: "CQC Registration Service",
  body: "Standalone CQC registration support for new practices and for practices going through ownership or structural changes.",
  cta: "Start CQC registration"
}];
function ServicesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-hero opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-4 py-20 text-white sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur", children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl", children: "Bespoke & managed compliance services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-white/90", children: "Pick a one-off service or hand your entire compliance over to our team." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl space-y-6", children: [
      SERVICES.map(({
        id,
        icon: Icon,
        gradient,
        title,
        body,
        cta,
        badge
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id, className: "group grid items-start gap-6 rounded-3xl border border-border bg-background p-6 shadow-soft transition hover:shadow-card sm:p-8 lg:grid-cols-[auto_1fr_auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `grid h-14 w-14 place-items-center rounded-2xl ${gradient} text-white`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          badge && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-magenta", children: badge }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-2xl font-bold", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: body })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-full gradient-purple-orange text-white lg:self-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book", children: [
          cta,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] }) })
      ] }, id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-3xl gradient-blue-teal p-8 text-center text-white sm:p-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-extrabold sm:text-3xl", children: "Not sure what you need?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-white/90", children: "Build your own package or book a free call with our team." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-full bg-white text-teal hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/build-your-package", children: "Build Your Package" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/book", children: "Book a free call" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTASection, {})
  ] });
}
export {
  ServicesPage as component
};
