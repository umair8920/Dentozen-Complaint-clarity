import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SiteLayout, B as Button } from "./SiteLayout-DaFApg4Y.mjs";
import { I as Input } from "./input-BUo8v9Y4.mjs";
import { L as Label } from "./label-Btq378GK.mjs";
import { I as ITEMS, f as formatGBP, p as patPrice } from "./pricing-C4iJdPBP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as Sparkles, m as ChevronDown, n as Minus, o as Plus, C as Check, X, l as Calendar, b as Mail } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const CATEGORIES = ["Packages", "Risk Assessments", "Training", "Direct 365 Services", "RPA", "Resources"];
function lineTotal(it, qty) {
  if (it.tiered && it.id === "d365-pat") return patPrice(qty);
  return it.price * qty;
}
function BuilderPage() {
  const [sel, setSel] = reactExports.useState({});
  const [openCats, setOpenCats] = reactExports.useState({
    "Packages": true,
    "Risk Assessments": true,
    "Training": false,
    "Direct 365 Services": false,
    "RPA": false,
    "Resources": false
  });
  const [vatInclusive, setVatInclusive] = reactExports.useState(false);
  const [email, setEmail] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const lines = reactExports.useMemo(() => {
    return Object.entries(sel).filter(([, q]) => q > 0).map(([id, qty]) => {
      const it = ITEMS.find((i) => i.id === id);
      const sub = lineTotal(it, qty);
      const vat = it.exVat ? sub * 0.2 : 0;
      return {
        it,
        qty,
        sub,
        vat
      };
    });
  }, [sel]);
  const subTotal = lines.reduce((s, l) => s + l.sub, 0);
  const vatTotal = lines.reduce((s, l) => s + l.vat, 0);
  const grand = subTotal + (vatInclusive ? vatTotal : 0);
  const raIds = ["ra-fire", "ra-legionella", "ra-hs", "ra-disability"];
  const hasAll4 = raIds.every((id) => (sel[id] ?? 0) > 0);
  const toggle = (id) => setSel((s) => ({
    ...s,
    [id]: s[id] ? 0 : 1
  }));
  const setQty = (id, q) => setSel((s) => ({
    ...s,
    [id]: Math.max(0, q)
  }));
  const swapForBundle = () => {
    setSel((s) => {
      const next = {
        ...s
      };
      raIds.forEach((id) => next[id] = 0);
      next["ra-bundle"] = 1;
      return next;
    });
    toast.success("Swapped to the £1,200 bundle — nice saving!");
  };
  const emailQuote = (e) => {
    e.preventDefault();
    if (!email || !name) return toast.error("Please add your name and email.");
    if (lines.length === 0) return toast.error("Pick at least one item first.");
    toast.success(`Quote sent to ${email}.`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta", children: "Bespoke calculator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-3 text-3xl font-extrabold sm:text-4xl", children: "Build your compliance package" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-muted-foreground", children: "Pick what you need. Watch the total update live. Email yourself a quote or book and pay." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-10 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 lg:col-span-2", children: [
        hasAll4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-start justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mt-0.5 h-5 w-5 text-orange" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Save with the £1,200 bundle" }),
              " — you've selected all four risk assessments individually (£1,400). Swap for the bundle."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: swapForBundle, className: "rounded-full gradient-orange-gold text-white", children: "Swap for bundle" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex cursor-pointer items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: vatInclusive, onChange: (e) => setVatInclusive(e.target.checked), className: "h-4 w-4 accent-magenta" }),
          "Show VAT-inclusive total (Direct 365 items are +VAT)"
        ] }) }),
        CATEGORIES.map((cat) => {
          const items = ITEMS.filter((i) => i.category === cat);
          const open = openCats[cat];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-background shadow-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenCats((s) => ({
              ...s,
              [cat]: !s[cat]
            })), className: "flex w-full items-center justify-between gap-3 px-6 py-4 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: cat }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-5 w-5 transition-transform ${open ? "rotate-180" : ""}` })
            ] }),
            open && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border border-t border-border", children: items.map((it) => {
              const qty = sel[it.id] ?? 0;
              const active = qty > 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${active ? "bg-muted/40" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: it.name }),
                  it.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: it.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
                    it.tbd ? "[PRICE]" : it.priceLabel ?? formatGBP(it.price),
                    it.exVat && " +VAT",
                    it.allowQuantity && it.unit ? ` / ${it.unit}` : ""
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: it.allowQuantity ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center rounded-full border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(it.id, qty - 1), "aria-label": "Decrease", className: "grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, value: qty, onChange: (e) => setQty(it.id, parseInt(e.target.value || "0", 10)), className: "w-14 bg-transparent text-center text-sm font-semibold focus:outline-none" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(it.id, qty + 1), "aria-label": "Increase", className: "grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => toggle(it.id), variant: active ? "default" : "outline", className: `rounded-full ${active ? "gradient-purple-orange text-white" : ""}`, children: active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-4 w-4" }),
                  " Added"
                ] }) : "Add" }) })
              ] }, it.id);
            }) })
          ] }, cat);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:sticky lg:top-24 lg:h-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-background shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gradient-teal-purple px-6 py-4 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wider text-white/80", children: "Your package" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-3xl font-extrabold", children: formatGBP(grand) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/80", children: vatInclusive ? "VAT inclusive where applicable" : "Ex-VAT — VAT applies to Direct 365 items" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto p-4", children: lines.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No items selected yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: lines.map(({
          it,
          qty,
          sub
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate font-medium", children: [
              qty > 1 ? `${qty}× ` : "",
              it.name
            ] }),
            it.exVat && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground", children: "+VAT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatGBP(sub) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty(it.id, 0), "aria-label": "Remove", className: "rounded-full p-1 text-muted-foreground hover:bg-background hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
          ] })
        ] }, it.id)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t border-border bg-surface p-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatGBP(subTotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "VAT (Direct 365)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatGBP(vatTotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
              "Total ",
              vatInclusive ? "(inc. VAT)" : "(ex. VAT)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-magenta", children: formatGBP(grand) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t border-border p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full rounded-full gradient-purple-orange text-white", disabled: lines.length === 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
            " Book & Pay"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: emailQuote, className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Your name", value: name, onChange: (e) => setName(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", placeholder: "Your email", value: email, onChange: (e) => setEmail(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", variant: "outline", className: "w-full rounded-full border-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-2 h-4 w-4" }),
              " Email me this quote"
            ] })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky bottom-0 z-30 border-t border-border bg-background p-3 shadow-card lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] uppercase tracking-wide text-muted-foreground", children: [
          "Total ",
          vatInclusive ? "(inc.)" : "(ex.)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-extrabold text-magenta", children: formatGBP(grand) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "rounded-full gradient-purple-orange text-white", disabled: lines.length === 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/book", children: "Book & Pay" }) })
    ] }) })
  ] });
}
export {
  BuilderPage as component
};
