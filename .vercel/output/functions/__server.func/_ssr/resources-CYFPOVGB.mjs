import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DaFApg4Y.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { I as Input } from "./input-BUo8v9Y4.mjs";
import { I as ITEMS, f as formatGBP } from "./pricing-C4iJdPBP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as FileText, D as Download, k as BookOpen } from "../_libs/lucide-react.mjs";
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
const FREE_RESOURCES = [{
  title: "CQC Inspection Checklist",
  desc: "A printable checklist used by inspected practices."
}, {
  title: "Quarterly Compliance Calendar",
  desc: "When to do what — at a glance."
}, {
  title: "New Practice Setup Guide",
  desc: "Step-by-step for opening a squat practice."
}];
const PAID_RESOURCES = [
  // { title: "Policies & Procedures Pack", price: 199, desc: "Full pack ready to adopt." },
];
function ResourcesPage() {
  const [email, setEmail] = reactExports.useState("");
  const logbooks = ITEMS.filter((i) => i.id.startsWith("log-"));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Resources", title: "Tools, logbooks and free guides", description: "Everything you need to keep your practice running smoothly between visits." }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: "Free resources", description: "Drop in your email and we'll send these straight over." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 lg:grid-cols-3", children: FREE_RESOURCES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col rounded-3xl border border-border bg-background p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-11 w-11 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-bold", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: r.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          if (!email) return toast.error("Add your email");
          toast.success(`We'll email "${r.title}" to ${email}`);
        }, className: "mt-5 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "you@practice.co.uk", value: email, onChange: (e) => setEmail(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", className: "shrink-0 rounded-full gradient-purple-orange text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 h-4 w-4" }),
            " Get"
          ] })
        ] })
      ] }, r.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: "Compliance logbooks", description: "Practical, role-specific logbooks — £49.99 each." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4", children: logbooks.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-background shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-28 ${["gradient-teal-purple", "gradient-purple-orange", "gradient-orange-gold", "gradient-blue-teal"][i % 4]} flex items-end p-4`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-7 w-7 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: b.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-magenta font-extrabold", children: formatGBP(b.price) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => toast.success(`${b.name} added — checkout opens via Calendly`), className: "mt-4 w-full rounded-full gradient-purple-orange text-white", children: "Buy" })
        ] })
      ] }, b.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { title: "Paid resources", description: "Curated guides and templates with their own prices." }),
      PAID_RESOURCES.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center text-muted-foreground", children: [
        "More paid resources coming soon. ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
          "Configure items in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "src/routes/resources.tsx" }),
          " → ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "PAID_RESOURCES" }),
          "."
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid gap-5 lg:grid-cols-3", children: PAID_RESOURCES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-background p-6 shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: r.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: r.desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-2xl font-extrabold text-magenta", children: formatGBP(r.price) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 w-full rounded-full gradient-purple-orange text-white", children: "Buy" })
      ] }, r.title)) })
    ] }) })
  ] });
}
export {
  ResourcesPage as component
};
