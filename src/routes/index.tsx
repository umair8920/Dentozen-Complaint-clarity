import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { VideoReviews } from "@/components/VideoReviews";
import { PACKAGES } from "@/lib/pricing";
import {
  ShieldCheck,
  ClipboardCheck,
  FileCheck2,
  FolderHeart,
  Sparkles,
  ArrowRight,
  Calculator,
  Building2,
  Stethoscope,
  GraduationCap,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Dental Compliance & Training — Stress-free CQC compliance" },
      {
        name: "description",
        content:
          "From mock inspections to fully managed compliance — one company, all your certificates, total peace of mind. For UK dental practices.",
      },
      { property: "og:title", content: "Smart Dental Compliance & Training" },
      {
        property: "og:description",
        content: "Stress-free CQC compliance for your dental practice.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const TRUST = [
  { icon: ShieldCheck, label: "CQC-ready" },
  { icon: FolderHeart, label: "All compliance under one roof" },
  { icon: FileCheck2, label: "Never misplace a certificate again" },
  { icon: Stethoscope, label: "Dental-specific expertise" },
];

const SERVICES = [
  {
    icon: ClipboardCheck,
    title: "CQC Mock Inspections",
    desc: "Full pre-inspection review with detailed report and action-plan support.",
    to: "/pricing",
  },
  {
    icon: Building2,
    title: "Due Diligence",
    desc: "Compliance review before you buy a practice — know exactly what you're getting.",
    to: "/pricing",
  },
  {
    icon: Sparkles,
    title: "Smart Managed Service",
    desc: "We manage your compliance entirely. Quarterly visits, one provider, zero stress.",
    to: "/packages",
  },
  {
    icon: Stethoscope,
    title: "New Practice Setup",
    desc: "Open compliant from day one — CQC registration, policies, RPA and more.",
    to: "/squat-practices",
  },
  {
    icon: FileCheck2,
    title: "CQC Registration",
    desc: "Standalone CQC registration support for new and changing practices.",
    to: "/pricing",
  },
  {
    icon: GraduationCap,
    title: "Risk Assessments & Training",
    desc: "Fire, Legionella, H&S, BLS, Cross Infection — done by dental specialists.",
    to: "/pricing",
  },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_oklch(1_0_0_/_0.25),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" /> CQC compliance, simplified
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Stress-free CQC compliance for your dental practice.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white/90">
                From mock inspections to fully managed compliance — one company, all your
                certificates, total peace of mind.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white text-magenta hover:bg-white/90"
                >
                  <Link to="/build-your-package" search={{ selection: undefined }}>
                    <Calculator className="mr-2 h-4 w-4" /> Build Your own Package
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10"
                >
                  <Link to="/book" search={{ service: "consultation" }}>
                    Book a Call <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white/95 p-6 shadow-glow backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl gradient-teal-purple p-3 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-magenta">
                      Inspection-ready
                    </div>
                    <div className="font-semibold">Your compliance dashboard</div>
                  </div>
                </div>
                <ul className="mt-5 space-y-3 text-sm">
                  {[
                    "Risk assessments complete",
                    "BLS & Cross Infection training booked",
                    "All certificates filed centrally",
                    "Quarterly upkeep scheduled",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full gradient-orange-gold text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What we do"
            title="Everything your practice needs to stay compliant"
            description="Pick a single service, a tiered package, or hand the whole thing over to us."
            center
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc, to }) => (
              <Link
                key={title}
                to={to}
                className="group rounded-3xl border border-border bg-background p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="inline-grid h-12 w-12 place-items-center rounded-2xl gradient-teal-purple text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-magenta">
                  Learn more{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES PREVIEW */}
      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Packages" title="Three ways to get compliant — fast" center />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <div
                key={p.id}
                className={`relative overflow-hidden rounded-3xl border border-border bg-background shadow-soft ${p.popular ? "lg:-translate-y-2 shadow-card" : ""}`}
              >
                {p.popular && (
                  <div className="absolute right-4 top-4 rounded-full gradient-orange-gold px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className={`${p.gradient} h-2 w-full`} />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="mt-2 text-4xl font-extrabold text-gradient">£{p.price}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                  <Button
                    asChild
                    className="mt-5 w-full rounded-full gradient-purple-orange text-white"
                  >
                    <Link to="/packages">View package</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full border-2">
              <Link to="/packages">
                Compare packages <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* WHY ONE COMPANY */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="One provider"
              title="One company. Every certificate. Zero juggling."
              description="Most practices juggle 5+ suppliers for compliance. We bundle it all together — so nothing gets misplaced and there's a single number to call."
            />
            <ul className="mt-6 space-y-3">
              {[
                "All certificates filed in one place",
                "A single point of contact for every service",
                "Quarterly upkeep visits, never forgotten",
                "Dental-specific — not generic compliance",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 place-items-center rounded-full gradient-teal-purple text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-hero opacity-20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {["Fire", "Legionella", "PAT", "BLS", "RPA", "Mock Insp."].map((label, i) => (
                <div
                  key={label}
                  className={`rounded-2xl border border-border bg-background p-5 shadow-soft ${i % 3 === 0 ? "translate-y-2" : ""}`}
                >
                  <div
                    className={`h-1.5 w-10 rounded-full ${["gradient-teal-purple", "gradient-purple-orange", "gradient-orange-gold", "gradient-blue-teal", "gradient-teal-purple", "gradient-purple-orange"][i]}`}
                  />
                  <div className="mt-3 font-semibold">{label}</div>
                  <div className="text-xs text-muted-foreground">Certified & filed</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR TEASER */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/build-your-package"
            search={{ selection: undefined }}
            className="group block overflow-hidden rounded-3xl gradient-blue-teal p-8 text-white shadow-glow sm:p-12"
          >
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                  Bespoke calculator
                </span>
                <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                  Build your own compliance package — see the price live.
                </h3>
                <p className="mt-2 max-w-xl text-white/85">
                  Pick the services you need. We'll handle the rest.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-teal">
                Open the calculator{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <VideoReviews />
      <CTASection />
    </SiteLayout>
  );
}
