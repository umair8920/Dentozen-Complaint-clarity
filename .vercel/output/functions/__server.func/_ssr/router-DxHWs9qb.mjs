import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
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
const appCss = "/assets/styles-15EI11Yo.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-extrabold text-gradient", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-full gradient-purple-orange px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-full gradient-purple-orange px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Smart Dental Compliance & Training — Stress-free CQC compliance" },
      { name: "description", content: "UK dental practice CQC compliance, mock inspections, training and managed compliance — all under one roof." },
      { name: "author", content: "Smart Dental Compliance & Training" },
      { property: "og:site_name", content: "Smart Dental Compliance & Training" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$c.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$a = () => import("./squat-practices-BeT_sKX5.mjs");
const Route$b = createFileRoute("/squat-practices")({
  head: () => ({
    meta: [{
      title: "Squat Practices — CQC registration & compliance from day one — SDC&T"
    }, {
      name: "description",
      content: "Opening a new dental clinic? We handle CQC registration, policies, RPA and full compliance setup so you can open your doors compliant — and help you appeal if rejected."
    }, {
      property: "og:title",
      content: "Squat Practices — SDC&T"
    }, {
      property: "og:description",
      content: "We get new dental clinics CQC-registered and compliant from day one."
    }, {
      property: "og:url",
      content: "/squat-practices"
    }],
    links: [{
      rel: "canonical",
      href: "/squat-practices"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const BASE_URL = "";
const Route$a = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/packages", changefreq: "monthly", priority: "0.9" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/squat-practices", changefreq: "monthly", priority: "0.9" },
          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/build-your-package", changefreq: "monthly", priority: "0.9" },
          { path: "/resources", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "yearly", priority: "0.6" },
          { path: "/contact", changefreq: "yearly", priority: "0.7" },
          { path: "/book", changefreq: "monthly", priority: "0.8" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" }
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
        });
      }
    }
  }
});
const $$splitComponentImporter$9 = () => import("./services-C-Bvczo1.mjs");
const Route$9 = createFileRoute("/services")({
  head: () => ({
    meta: [{
      title: "Services — SDC&T"
    }, {
      name: "description",
      content: "CQC mock inspections, due diligence, fully managed compliance, new practice setup and CQC registration for UK dental practices."
    }, {
      property: "og:title",
      content: "Services — SDC&T"
    }, {
      property: "og:description",
      content: "Bespoke and managed compliance services for UK dental practices."
    }, {
      property: "og:url",
      content: "/services"
    }],
    links: [{
      rel: "canonical",
      href: "/services"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./resources-Bd-ZLL95.mjs");
const Route$8 = createFileRoute("/resources")({
  head: () => ({
    meta: [{
      title: "Resources - Compliance Logbooks & Guides - SDC&T"
    }, {
      name: "description",
      content: "Free dental compliance guides, paid resources and logbooks (Reception, Dental Nurse, Lead Nurse, Practice Manager)."
    }, {
      property: "og:title",
      content: "Resources - Compliance Logbooks & Guides - SDC&T"
    }, {
      property: "og:description",
      content: "Compliance logbooks and resources for UK dental practices."
    }, {
      property: "og:url",
      content: "/resources"
    }],
    links: [{
      rel: "canonical",
      href: "/resources"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./privacy-BVqBysqI.mjs");
const Route$7 = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy - SDC&T"
    }, {
      name: "description",
      content: "How Smart Dental Compliance & Training collects, uses and protects your personal data under UK GDPR."
    }, {
      property: "og:title",
      content: "Privacy Policy - SDC&T"
    }, {
      property: "og:url",
      content: "/privacy"
    }],
    links: [{
      rel: "canonical",
      href: "/privacy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./pricing-DzuHhlda.mjs");
const Route$6 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Pricing — Individual Services — SDC&T"
    }, {
      name: "description",
      content: "Transparent pricing for dental compliance services: risk assessments, training, Direct 365 services, RPA and resources."
    }, {
      property: "og:title",
      content: "Pricing — SDC&T"
    }, {
      property: "og:description",
      content: "À la carte pricing for every compliance service."
    }, {
      property: "og:url",
      content: "/pricing"
    }],
    links: [{
      rel: "canonical",
      href: "/pricing"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./packages-Xq4xnZbo.mjs");
const Route$5 = createFileRoute("/packages")({
  head: () => ({
    meta: [{
      title: "Compliance Packages — SDC&T"
    }, {
      name: "description",
      content: "Three dental compliance packages: Essential £199, Safety & Training £299, Complete £399. Choose, book and pay."
    }, {
      property: "og:title",
      content: "Compliance Packages — SDC&T"
    }, {
      property: "og:description",
      content: "Tiered CQC compliance packages for UK dental practices."
    }, {
      property: "og:url",
      content: "/packages"
    }],
    links: [{
      rel: "canonical",
      href: "/packages"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-DmaTgp9u.mjs");
const Route$4 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact - SDC&T"
    }, {
      name: "description",
      content: "Get in touch with Smart Dental Compliance & Training. Contact form, phone, email, and direct booking."
    }, {
      property: "og:title",
      content: "Contact - SDC&T"
    }, {
      property: "og:description",
      content: "Contact Smart Dental Compliance & Training."
    }, {
      property: "og:url",
      content: "/contact"
    }],
    links: [{
      rel: "canonical",
      href: "/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./build-your-package-D7_2fb6v.mjs");
const Route$3 = createFileRoute("/build-your-package")({
  validateSearch: (search) => ({
    selection: typeof search.selection === "string" ? search.selection : void 0
  }),
  head: () => ({
    meta: [{
      title: "Build Your Package - Live Compliance Calculator - SDC&T"
    }, {
      name: "description",
      content: "Build a bespoke compliance package for your dental practice and see the price live. Email yourself a quote or book and pay."
    }, {
      property: "og:title",
      content: "Build Your Package - SDC&T"
    }, {
      property: "og:description",
      content: "Interactive dental compliance calculator with live pricing."
    }, {
      property: "og:url",
      content: "/build-your-package"
    }],
    links: [{
      rel: "canonical",
      href: "/build-your-package"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./book-DQAJ-yDi.mjs");
const Route$2 = createFileRoute("/book")({
  validateSearch: (search) => ({
    service: typeof search.service === "string" ? search.service : void 0,
    selection: typeof search.selection === "string" ? search.selection : void 0
  }),
  head: () => ({
    meta: [{
      title: "Book Now - SDC&T"
    }, {
      name: "description",
      content: "Submit a provisional booking request for dental compliance services and receive confirmation by email."
    }, {
      property: "og:title",
      content: "Book Now - SDC&T"
    }, {
      property: "og:description",
      content: "Request a booking for dental compliance services."
    }, {
      property: "og:url",
      content: "/book"
    }],
    links: [{
      rel: "canonical",
      href: "/book"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-CgbnpKir.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Smart Dental Compliance & Training"
    }, {
      name: "description",
      content: "Dental-specific compliance experts based in the UK. Everything under one roof — never misplace a certificate again."
    }, {
      property: "og:title",
      content: "About — SDC&T"
    }, {
      property: "og:description",
      content: "About Smart Dental Compliance & Training."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-3ARrpi06.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Smart Dental Compliance & Training — Stress-free CQC compliance"
    }, {
      name: "description",
      content: "From mock inspections to fully managed compliance — one company, all your certificates, total peace of mind. For UK dental practices."
    }, {
      property: "og:title",
      content: "Smart Dental Compliance & Training"
    }, {
      property: "og:description",
      content: "Stress-free CQC compliance for your dental practice."
    }, {
      property: "og:url",
      content: "/"
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SquatPracticesRoute = Route$b.update({
  id: "/squat-practices",
  path: "/squat-practices",
  getParentRoute: () => Route$c
});
const SitemapDotxmlRoute = Route$a.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$c
});
const ServicesRoute = Route$9.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$c
});
const ResourcesRoute = Route$8.update({
  id: "/resources",
  path: "/resources",
  getParentRoute: () => Route$c
});
const PrivacyRoute = Route$7.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$c
});
const PricingRoute = Route$6.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$c
});
const PackagesRoute = Route$5.update({
  id: "/packages",
  path: "/packages",
  getParentRoute: () => Route$c
});
const ContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$c
});
const BuildYourPackageRoute = Route$3.update({
  id: "/build-your-package",
  path: "/build-your-package",
  getParentRoute: () => Route$c
});
const BookRoute = Route$2.update({
  id: "/book",
  path: "/book",
  getParentRoute: () => Route$c
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$c
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  BookRoute,
  BuildYourPackageRoute,
  ContactRoute,
  PackagesRoute,
  PricingRoute,
  PrivacyRoute,
  ResourcesRoute,
  ServicesRoute,
  SitemapDotxmlRoute,
  SquatPracticesRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  Route$2 as a,
  router as r
};
