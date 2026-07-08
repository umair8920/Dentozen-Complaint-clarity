import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DaFApg4Y.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { C as CTASection } from "./CTASection-CTA2ED-o.mjs";
import { P as PACKAGES, C as COMPARISON_ROWS } from "./pricing-C4iJdPBP.mjs";
import "../_libs/sonner.mjs";
import { C as Check, X } from "../_libs/lucide-react.mjs";
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
function PackagesPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Packages", title: "Pick the package that fits your practice", description: "All packages include filing of certificates and a single point of contact. Need something different? Build your own bespoke package.", center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 lg:grid-cols-3", children: PACKAGES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative overflow-hidden rounded-3xl border bg-background shadow-soft ${p.popular ? "border-magenta lg:-translate-y-3 shadow-card" : "border-border"}`, children: [
        p.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-4 z-10 rounded-full gradient-orange-gold px-3 py-1 text-xs font-bold text-white", children: "Most Popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${p.gradient} px-6 py-8 text-white`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-5xl font-extrabold", children: [
            "£",
            p.price
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/90", children: p.tagline })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: p.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f })
          ] }, f)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6 w-full rounded-full gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/book", children: "Choose this package" }) })
        ] })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: "Compare packages at a glance", center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 overflow-x-auto rounded-3xl border border-border bg-background shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-surface text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-4 font-semibold", children: "Feature" }),
          PACKAGES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "px-6 py-4 text-center font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: p.name.split(" ").slice(0, 2).join(" ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-normal text-muted-foreground", children: [
              "£",
              p.price
            ] })
          ] }, p.id))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: COMPARISON_ROWS.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: row.label }),
          row.pkgs.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-center", children: v ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mx-auto h-5 w-5 text-teal" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mx-auto h-5 w-5 text-muted-foreground/40" }) }, i))
        ] }, row.label)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTASection, { title: "Need something more bespoke?", subtitle: "Build your own package with our live calculator or book a free call." })
  ] });
}
export {
  PackagesPage as component
};
