import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./SiteLayout-DFRuNn3D.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
function CTASection({
  title = "Ready to get compliant?",
  subtitle = "Book a free call or build your bespoke compliance package in minutes."
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl overflow-hidden rounded-3xl gradient-hero p-10 text-white shadow-glow sm:p-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-extrabold tracking-tight sm:text-4xl", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-xl text-white/90", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "rounded-full bg-white text-magenta hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book", children: [
        "Book Now ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", children: "Contact us" }) })
    ] })
  ] }) }) });
}
export {
  CTASection as C
};
