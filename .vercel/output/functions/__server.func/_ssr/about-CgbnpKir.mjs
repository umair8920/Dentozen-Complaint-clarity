import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DFRuNn3D.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { C as CTASection } from "./CTASection-CmVQTogD.mjs";
import "../_libs/sonner.mjs";
import { S as ShieldCheck, r as FolderHeart, H as HeartHandshake, a as Stethoscope } from "../_libs/lucide-react.mjs";
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
function AboutPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-hero opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-5xl px-4 py-24 text-white sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur", children: "About us" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-extrabold sm:text-5xl", children: "We take the stress of CQC compliance off your shoulders." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-2xl text-lg text-white/90", children: "Smart Dental Compliance & Training is a UK team of dental-specific compliance experts. We work with practice owners, managers, and people buying practices to keep everything safe, compliant, and inspection-ready — without the juggling." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Our promise", title: "Everything under one roof. Forever filed. Fully managed if you want it.", description: "No more scattered certificates, missed renewals, or five different suppliers to chase. We're the single phone call you need." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6 rounded-full gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/book", children: "Book a call" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: [{
        icon: ShieldCheck,
        title: "Dental-specific",
        body: "We only work with dental practices."
      }, {
        icon: FolderHeart,
        title: "All in one place",
        body: "Every certificate, filed and findable."
      }, {
        icon: HeartHandshake,
        title: "One point of contact",
        body: "A single number, a real human."
      }, {
        icon: Stethoscope,
        title: "Inspection-ready",
        body: "We get you CQC-ready, not just compliant."
      }].map(({
        icon: Icon,
        title,
        body
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-background p-5 shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-bold", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: body })
      ] }, title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTASection, {})
  ] });
}
export {
  AboutPage as component
};
