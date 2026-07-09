import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DuV9z--U.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { C as CTASection } from "./CTASection-Y2MO9v9G.mjs";
import { V as VideoReviews } from "./VideoReviews-B4BjruYa.mjs";
import { P as PACKAGES } from "./pricing-C4iJdPBP.mjs";
import "../_libs/sonner.mjs";
import { S as ShieldCheck, r as Calculator, A as ArrowRight, C as Check, q as FolderHeart, F as FileCheckCorner, a as Stethoscope, h as ClipboardCheck, B as Building2, i as Sparkles, G as GraduationCap } from "../_libs/lucide-react.mjs";
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
const TRUST = [{
  icon: ShieldCheck,
  label: "CQC-ready"
}, {
  icon: FolderHeart,
  label: "All compliance under one roof"
}, {
  icon: FileCheckCorner,
  label: "Never misplace a certificate again"
}, {
  icon: Stethoscope,
  label: "Dental-specific expertise"
}];
const SERVICES = [{
  icon: ClipboardCheck,
  title: "CQC Mock Inspections",
  desc: "Full pre-inspection review with detailed report and action-plan support.",
  to: "/services"
}, {
  icon: Building2,
  title: "Due Diligence",
  desc: "Compliance review before you buy a practice — know exactly what you're getting.",
  to: "/services"
}, {
  icon: Sparkles,
  title: "Smart Managed Service",
  desc: "We manage your compliance entirely. Quarterly visits, one provider, zero stress.",
  to: "/services"
}, {
  icon: Stethoscope,
  title: "New Practice Setup",
  desc: "Open compliant from day one — CQC registration, policies, RPA and more.",
  to: "/squat-practices"
}, {
  icon: FileCheckCorner,
  title: "CQC Registration",
  desc: "Standalone CQC registration support for new and changing practices.",
  to: "/services"
}, {
  icon: GraduationCap,
  title: "Risk Assessments & Training",
  desc: "Fire, Legionella, H&S, BLS, Cross Infection — done by dental specialists.",
  to: "/pricing"
}];
function HomePage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-hero opacity-95" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,_oklch(1_0_0_/_0.25),_transparent_60%)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-center gap-12 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7 animate-fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
            " CQC compliance, simplified"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl", children: "Stress-free CQC compliance for your dental practice." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-xl text-lg text-white/90", children: "From mock inspections to fully managed compliance — one company, all your certificates, total peace of mind." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "rounded-full bg-white text-magenta hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/build-your-package", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calculator, { className: "mr-2 h-4 w-4" }),
              " Build Your Package"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", className: "rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book", children: [
              "Book a Call ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-md rounded-3xl bg-white/95 p-6 shadow-glow backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl gradient-teal-purple p-3 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-magenta", children: "Inspection-ready" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Your compliance dashboard" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-5 space-y-3 text-sm", children: ["Risk assessments complete", "BLS & Cross Infection training booked", "All certificates filed centrally", "Quarterly upkeep scheduled"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-6 w-6 place-items-center rounded-full gradient-orange-gold text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
            t
          ] }, t)) })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8", children: TRUST.map(({
      icon: Icon,
      label
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: label })
    ] }, label)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "What we do", title: "Everything your practice needs to stay compliant", description: "Pick a single service, a tiered package, or hand the whole thing over to us.", center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: SERVICES.map(({
        icon: Icon,
        title,
        desc,
        to
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "group rounded-3xl border border-border bg-background p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-grid h-12 w-12 place-items-center rounded-2xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-magenta", children: [
          "Learn more ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
        ] })
      ] }, title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Packages", title: "Three ways to get compliant — fast", center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 lg:grid-cols-3", children: PACKAGES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative overflow-hidden rounded-3xl border border-border bg-background shadow-soft ${p.popular ? "lg:-translate-y-2 shadow-card" : ""}`, children: [
        p.popular && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-4 top-4 rounded-full gradient-orange-gold px-3 py-1 text-xs font-bold text-white", children: "Most Popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${p.gradient} h-2 w-full` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-4xl font-extrabold text-gradient", children: [
            "£",
            p.price
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: p.tagline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-5 w-full rounded-full gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/packages", children: "View package" }) })
        ] })
      ] }, p.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "rounded-full border-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/packages", children: [
        "Compare packages ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "One provider", title: "One company. Every certificate. Zero juggling.", description: "Most practices juggle 5+ suppliers for compliance. We bundle it all together — so nothing gets misplaced and there's a single number to call." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-3", children: ["All certificates filed in one place", "A single point of contact for every service", "Quarterly upkeep visits, never forgotten", "Dental-specific — not generic compliance"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 grid h-6 w-6 place-items-center rounded-full gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t })
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-3xl gradient-hero opacity-20 blur-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative grid grid-cols-2 gap-4", children: ["Fire", "Legionella", "PAT", "BLS", "RPA", "Mock Insp."].map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border border-border bg-background p-5 shadow-soft ${i % 3 === 0 ? "translate-y-2" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1.5 w-10 rounded-full ${["gradient-teal-purple", "gradient-purple-orange", "gradient-orange-gold", "gradient-blue-teal", "gradient-teal-purple", "gradient-purple-orange"][i]}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-semibold", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Certified & filed" })
        ] }, label)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 pb-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/build-your-package", className: "group block overflow-hidden rounded-3xl gradient-blue-teal p-8 text-white shadow-glow sm:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider", children: "Bespoke calculator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-2xl font-extrabold sm:text-3xl", children: "Build your own compliance package — see the price live." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-xl text-white/85", children: "Pick the services you need. We'll handle the rest." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-teal", children: [
        "Open the calculator ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VideoReviews, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CTASection, {})
  ] });
}
export {
  HomePage as component
};
