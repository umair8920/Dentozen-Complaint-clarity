import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { S as SiteLayout, B as Button, a as SITE } from "./SiteLayout-DFRuNn3D.mjs";
import { I as Input } from "./input-DslMqq2N.mjs";
import { L as Label, c as createSsrRpc } from "./createSsrRpc-Cb4-_oij.mjs";
import { T as Textarea } from "./textarea-B5n9wo2o.mjs";
import { b as createServerFn } from "./server-BkGTo3Rc.mjs";
import "../_libs/seroval.mjs";
import { b as Mail, P as Phone, c as MapPin, l as Calendar } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, l as literalType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const contactFormSchema = objectType({
  name: stringType().trim().min(1, "Name is required").max(100),
  practice: stringType().trim().max(150).optional().or(literalType("")),
  email: stringType().trim().email("Invalid email").max(255),
  phone: stringType().trim().max(40).optional().or(literalType("")),
  interest: stringType().max(80),
  message: stringType().trim().min(1, "Message is required").max(1e3)
});
const submitContactForm = createServerFn({
  method: "POST"
}).validator(contactFormSchema).handler(createSsrRpc("51496c6ca2b5055341948a46205d4083f7301883d1e1b16d00d2abd04c02d91c"));
const INTERESTS = ["Packages", "Mock Inspection", "Due Diligence", "Managed Service", "New Practice Setup", "Other"];
const INITIAL_FORM = {
  name: "",
  practice: "",
  email: "",
  phone: "",
  interest: INTERESTS[0],
  message: ""
};
function ContactPage() {
  const [form, setForm] = reactExports.useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    try {
      setIsSubmitting(true);
      await submitContactForm({
        data: parsed.data
      });
      toast.success("Thanks - we'll be in touch within one working day.");
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't send your message right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Contact", title: "Talk to a dental compliance specialist", description: "We'll get back within one working day - or book a call directly." }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-16 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Your name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", required: true, disabled: isSubmitting, value: form.name, onChange: (e) => setForm({
              ...form,
              name: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "practice", children: "Practice name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "practice", disabled: isSubmitting, value: form.practice, onChange: (e) => setForm({
              ...form,
              practice: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, disabled: isSubmitting, value: form.email, onChange: (e) => setForm({
              ...form,
              email: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", disabled: isSubmitting, value: form.phone, onChange: (e) => setForm({
              ...form,
              phone: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "interest", children: "What are you interested in?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "interest", disabled: isSubmitting, value: form.interest, onChange: (e) => setForm({
              ...form,
              interest: e.target.value
            }), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", children: INTERESTS.map((interest) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: interest }, interest)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", children: "Message *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", required: true, rows: 5, disabled: isSubmitting, value: form.message, onChange: (e) => setForm({
              ...form,
              message: e.target.value
            }), className: "mt-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isSubmitting, className: "mt-5 w-full rounded-full gradient-purple-orange text-white sm:w-auto", children: isSubmitting ? "Sending..." : "Send message" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-background p-6 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Direct contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }) }),
              SITE.email
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
              SITE.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl gradient-orange-gold text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }) }),
              SITE.location
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl gradient-blue-teal p-6 text-white shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Prefer to book?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-white/90", children: "Grab a slot in our calendar - it takes 2 minutes." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4 rounded-full bg-white text-teal hover:bg-white/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/book", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
            " Book a call"
          ] }) })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ContactPage as component
};
