import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DFRuNn3D.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { C as CTASection } from "./CTASection-CmVQTogD.mjs";
import { I as ITEMS, f as formatGBP } from "./pricing-D5FjTA98.mjs";
import { e as encodeSelection } from "./package-selection-C_2R5Iwn.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
const CATEGORIES = ["Risk Assessments", "Training", "Direct 365 Services", "RPA", "Resources"];
function PricingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Pricing", title: "Pick and choose — or mix them all", description: "Every service we offer, with transparent pricing. Mix and match any of these in our Build Your Package tool.", center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-full gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/build-your-package", children: "Build Your Package" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "rounded-full border-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/book", children: "Book a service" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-10", children: [
      CATEGORIES.map((cat) => {
        const items = ITEMS.filter((i) => i.category === cat);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { id: cat.toLowerCase().replace(/\s+/g, "-"), className: "overflow-hidden rounded-3xl border border-border bg-background shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gradient-teal-purple px-6 py-4 text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: cat }),
            cat === "Direct 365 Services" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/90", children: "All prices shown ex-VAT. PAT uses tiered pricing: £1.88/item up to 40, then £0.80/item." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: it.name }),
              it.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: it.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: it.tbd ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground", children: "[PRICE]" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-extrabold text-magenta", children: [
                it.priceLabel ?? formatGBP(it.price),
                it.exVat ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-medium text-muted-foreground", children: "+VAT" }) : null
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", className: "rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/build-your-package", search: {
                selection: encodeSelection({
                  [it.id]: 1
                })
              }, children: "Add" }) })
            ] })
          ] }, it.id)) })
        ] }, cat);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Free Resources" }),
        " — downloadable guides & checklists, free with email sign-up. See the",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/resources", className: "underline", children: "Resources page" }),
        ".",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Paid Resources" }),
        " — additional resources at varying prices; configured on the Resources page."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTASection, {})
  ] });
}
export {
  PricingPage as component
};
