import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SiteLayout, B as Button, a as SITE } from "./SiteLayout-DFRuNn3D.mjs";
import { S as SectionHeading } from "./SectionHeading-DRuNnOmD.mjs";
import { I as Input } from "./input-DslMqq2N.mjs";
import { L as Label, c as createSsrRpc } from "./createSsrRpc-Cb4-_oij.mjs";
import { T as Textarea } from "./textarea-B5n9wo2o.mjs";
import { b as createServerFn } from "./server-BkGTo3Rc.mjs";
import { d as decodeSelection, a as selectionToLines, s as selectionSummary } from "./package-selection-C_2R5Iwn.mjs";
import { a as Route$2 } from "./router-DxHWs9qb.mjs";
import "../_libs/seroval.mjs";
import { l as Calendar, p as CreditCard, S as ShieldCheck, q as CircleCheck, i as Sparkles, b as Mail, P as Phone } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, l as literalType, Z as ZodIssueCode } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
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
import "./pricing-D5FjTA98.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const BOOKING_SERVICES = [
  { value: "mock-inspection", label: "Mock Inspection", paymentLink: "/services" },
  { value: "due-diligence", label: "Due Diligence", paymentLink: "/services" },
  { value: "managed-service", label: "Managed Service", paymentLink: "/services" },
  { value: "new-practice-setup", label: "New Practice Setup", paymentLink: "/squat-practices" },
  {
    value: "training-session",
    label: "Training Session",
    paymentLink: "/pricing",
    requiresDelegates: true
  },
  { value: "packages", label: "Packages", paymentLink: "/packages" },
  { value: "other", label: "Other", paymentLink: "/contact" }
];
function getBookingService(value) {
  return BOOKING_SERVICES.find((service) => service.value === value);
}
const bookingFormSchema = objectType({
  fullName: stringType().trim().min(1, "Full name is required").max(100),
  email: stringType().trim().email("Invalid email").max(255),
  telephone: stringType().trim().min(1, "Telephone is required").max(40),
  nameOfPractice: stringType().trim().min(1, "Name of practice is required").max(150),
  serviceRequired: stringType().trim().min(1, "Service is required").max(80),
  bookingDates: stringType().trim().min(1, "Please provide 2-3 preferred dates").max(500),
  bookingTime: stringType().trim().min(1, "Timing of booking is required").max(120),
  delegates: stringType().trim().max(40).optional().or(literalType("")),
  paymentLink: stringType().trim().min(1).max(255),
  packageSelection: stringType().trim().optional().or(literalType("")),
  packageSummary: stringType().trim().optional().or(literalType(""))
}).superRefine((data, ctx) => {
  if (data.serviceRequired === "training-session" && !data.delegates?.trim()) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      path: ["delegates"],
      message: "Please state the number of delegates for the training session"
    });
  }
});
const submitBookingForm = createServerFn({
  method: "POST"
}).validator(bookingFormSchema).handler(createSsrRpc("f772fefa96478c6a8f9bf5816d29d6b432d9650f9f42958d1ff9b17bdfc3422b"));
const INITIAL_FORM = {
  fullName: "",
  email: "",
  telephone: "",
  nameOfPractice: "",
  serviceRequired: BOOKING_SERVICES[0].value,
  bookingDates: "",
  bookingTime: "",
  delegates: "",
  paymentLink: getBookingService(BOOKING_SERVICES[0].value)?.paymentLink ?? ""
};
function BookPage() {
  const search = Route$2.useSearch();
  const [form, setForm] = reactExports.useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [isSubmitted, setIsSubmitted] = reactExports.useState(false);
  const isCalculatorFlow = Boolean(search.selection) && !search.service;
  const packageSelection = reactExports.useMemo(() => decodeSelection(search.selection), [search.selection]);
  const packageLines = reactExports.useMemo(() => selectionToLines(packageSelection), [packageSelection]);
  const packageSummary = reactExports.useMemo(() => selectionSummary(packageSelection), [packageSelection]);
  const selectedService = reactExports.useMemo(() => {
    if (isCalculatorFlow) {
      return void 0;
    }
    return getBookingService(form.serviceRequired) ?? BOOKING_SERVICES[0];
  }, [form.serviceRequired, isCalculatorFlow]);
  const paymentLinkValue = isCalculatorFlow ? "/build-your-package" : selectedService?.paymentLink ?? BOOKING_SERVICES[0].paymentLink;
  reactExports.useEffect(() => {
    if (isCalculatorFlow) {
      setForm((current) => ({
        ...current,
        serviceRequired: "Package enquiry",
        paymentLink: "/build-your-package"
      }));
      return;
    }
    if (!search.service) {
      return;
    }
    const nextService = getBookingService(search.service);
    if (!nextService) {
      return;
    }
    setForm((current) => ({
      ...current,
      serviceRequired: nextService.value,
      paymentLink: nextService.paymentLink,
      delegates: nextService.requiresDelegates ? current.delegates : ""
    }));
  }, [search.service, isCalculatorFlow]);
  const onSubmit = async (e) => {
    e.preventDefault();
    const parsed = bookingFormSchema.safeParse({
      ...form,
      paymentLink: paymentLinkValue,
      packageSelection: search.selection ?? "",
      packageSummary
    });
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    try {
      setIsSubmitting(true);
      await submitBookingForm({
        data: parsed.data
      });
      setIsSubmitted(true);
      toast.success("Thanks - your provisional booking request has been sent.");
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't send your booking request right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeading, { eyebrow: "Book Now", title: "Request your provisional booking", description: "Choose a service, add your preferred dates, and we'll email confirmation within 3 to 5 working days." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-3 sm:grid-cols-3", children: [{
        icon: Calendar,
        label: "Preferred dates and timing"
      }, {
        icon: CreditCard,
        label: "Service-based payment link"
      }, {
        icon: ShieldCheck,
        label: "Provisional booking by email"
      }].map(({
        icon: Icon,
        label
      }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-border bg-background p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: label })
      ] }, label)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "px-4 py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]", children: isSubmitted ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8 lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl rounded-3xl gradient-teal-purple p-8 text-white shadow-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-white/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-white/75", children: "Thank you" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-2xl font-extrabold", children: "Thank you for making the booking" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xl text-sm leading-6 text-white/90", children: "Please note this is a provisional booking. We will send a confirmation email within 3 to 5 working days." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setIsSubmitted(false), className: "rounded-full bg-white text-teal hover:bg-white/90", children: "Make another booking" }) })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          packageLines.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2 rounded-2xl border border-border bg-muted/30 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Package selected from calculator" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 whitespace-pre-wrap text-sm text-foreground", children: packageSummary })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fullName", children: "Full Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "fullName", required: true, disabled: isSubmitting, value: form.fullName, onChange: (e) => setForm({
              ...form,
              fullName: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email Address *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", required: true, disabled: isSubmitting, value: form.email, onChange: (e) => setForm({
              ...form,
              email: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "telephone", children: "Telephone *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "telephone", required: true, disabled: isSubmitting, value: form.telephone, onChange: (e) => setForm({
              ...form,
              telephone: e.target.value
            }), className: "mt-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nameOfPractice", children: "Name of Practice *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nameOfPractice", required: true, disabled: isSubmitting, value: form.nameOfPractice, onChange: (e) => setForm({
              ...form,
              nameOfPractice: e.target.value
            }), className: "mt-1" })
          ] }),
          !isCalculatorFlow ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "serviceRequired", children: "Service required *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { id: "serviceRequired", required: true, disabled: isSubmitting, value: form.serviceRequired, onChange: (e) => {
              const nextService = getBookingService(e.target.value) ?? BOOKING_SERVICES[0];
              setForm({
                ...form,
                serviceRequired: nextService.value,
                paymentLink: nextService.paymentLink,
                delegates: nextService.requiresDelegates ? form.delegates : ""
              });
            }, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", children: BOOKING_SERVICES.map((service) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: service.value, children: service.label }, service.value)) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "serviceRequired", value: "Package enquiry" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bookingDates", children: "Dates you would like the booking (please provide 2-3 dates) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "bookingDates", required: true, rows: 4, disabled: isSubmitting, value: form.bookingDates, onChange: (e) => setForm({
              ...form,
              bookingDates: e.target.value
            }), className: "mt-1", placeholder: "Example: 14 August 2026, 16 August 2026, or 18 August 2026" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bookingTime", children: "Timing of Booking *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "bookingTime", required: true, disabled: isSubmitting, value: form.bookingTime, onChange: (e) => setForm({
              ...form,
              bookingTime: e.target.value
            }), className: "mt-1", placeholder: "e.g. Morning, afternoon, or 10:00 to 13:00" })
          ] }),
          selectedService?.requiresDelegates ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delegates", children: "Number of delegates *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "delegates", required: selectedService.requiresDelegates, disabled: isSubmitting, value: form.delegates, onChange: (e) => setForm({
              ...form,
              delegates: e.target.value
            }), className: "mt-1", inputMode: "numeric", placeholder: "e.g. 8" })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "paymentLink", children: "Payment link for this service" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "paymentLink", readOnly: true, value: paymentLinkValue, className: "mt-1 bg-muted/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "This link changes with the selected flow and will also be included in the booking email." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isSubmitting, className: "mt-5 w-full rounded-full gradient-purple-orange text-white sm:w-auto", children: isSubmitting ? "Sending..." : "Submit booking request" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-background p-6 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "What happens next" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-teal-purple text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }) }),
              "We review your preferred dates and service."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-purple-orange text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }) }),
              "We send a confirmation email within 3 to 5 working days."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-orange-gold text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
              "Need help before submitting? Call us on ",
              SITE.phone,
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl gradient-blue-teal p-6 text-white shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Service-based payment link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-white/90", children: isCalculatorFlow ? "This is a package enquiry, so we hide service selection and keep the next step focused on your package." : "Choose a service to see the matching link. We&apos;ve kept it visible so the next step is obvious." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-2xl bg-white/15 p-4 text-sm backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: isCalculatorFlow ? "Package enquiry" : selectedService?.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 break-all text-white/85", children: paymentLinkValue })
          ] })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  BookPage as component
};
