import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function SectionHeading({
  eyebrow,
  title,
  description,
  center = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: center ? "mx-auto max-w-2xl text-center" : "max-w-2xl", children: [
    eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta", children: eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl", children: title }),
    description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground sm:text-lg", children: description })
  ] });
}
export {
  SectionHeading as S
};
