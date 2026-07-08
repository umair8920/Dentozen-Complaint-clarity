import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as Play, g as Star } from "../_libs/lucide-react.mjs";
const VIDEOS = [
  { name: "Dr A. Patel", practice: "Bright Smile Dental, Manchester", embed: "" },
  { name: "Dr S. Khan", practice: "City Dental Studio, Leeds", embed: "" },
  { name: "L. Roberts (Practice Manager)", practice: "Riverside Dental, Bristol", embed: "" },
  { name: "Dr H. Singh", practice: "Modern Dental Care, Birmingham", embed: "" }
];
const TEXT_REVIEWS = [
  { quote: "Made our CQC inspection a non-event. Worth every penny.", author: "Practice Owner, London" },
  { quote: "One company, all our certificates in one place — finally.", author: "Practice Manager, Glasgow" }
];
function VideoReviews() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta", children: "What our clients say" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl", children: "Trusted by dental practices across the UK" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: VIDEOS.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[9/12] overflow-hidden rounded-2xl bg-ink shadow-soft", children: v.embed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "iframe",
        {
          src: v.embed,
          title: `${v.name} testimonial`,
          className: "absolute inset-0 h-full w-full",
          allow: "accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-purple-orange opacity-80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-white/95 p-4 shadow-glow transition-transform group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-6 w-6 fill-magenta text-magenta" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 right-3 text-xs text-white/80", children: "Video coming soon" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground", children: v.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: v.practice })
      ] })
    ] }, v.name)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-4 sm:grid-cols-2", children: TEXT_REVIEWS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "rounded-2xl border border-border bg-background p-6 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 text-gold", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-gold" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-foreground", children: [
        "“",
        r.quote,
        "”"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-3 text-sm text-muted-foreground", children: [
        "— ",
        r.author
      ] })
    ] }, r.author)) })
  ] }) });
}
export {
  VideoReviews as V
};
