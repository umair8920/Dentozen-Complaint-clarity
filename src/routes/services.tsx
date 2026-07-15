import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileCheck2,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { CTASection } from "@/components/CTASection";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import { toServiceCards } from "@/lib/service-content";

const ICONS = {
  ClipboardCheck,
  Building2,
  Sparkles,
  Stethoscope,
  FileCheck2,
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - SDC&T" },
      {
        name: "description",
        content:
          "CQC mock inspections, due diligence, fully managed compliance, new practice setup and CQC registration for UK dental practices.",
      },
      { property: "og:title", content: "Services - SDC&T" },
      {
        property: "og:description",
        content: "Bespoke and managed compliance services for UK dental practices.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  loader: async () => getPublicServiceItems({ data: { section: "services" } }),
  component: ServicesPage,
});

function ServicesPage() {
  const { items } = Route.useLoaderData();
  const services = toServiceCards(items);

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-white sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            Services
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Bespoke & managed compliance services
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Pick a one-off service or hand your entire compliance over to our team.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          {services.map(({ id, icon, gradient, title, body, cta, badge, bookingService }) => {
            const Icon = ICONS[icon as keyof typeof ICONS] ?? FileCheck2;

            return (
              <div
                key={id}
                id={id}
                className="group grid items-start gap-6 rounded-3xl border border-border bg-background p-6 shadow-soft transition hover:shadow-card sm:p-8 lg:grid-cols-[auto_1fr_auto]"
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${gradient} text-white`}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  {badge && (
                    <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-magenta">
                      {badge}
                    </span>
                  )}
                  <h2 className="mt-1 text-2xl font-bold">{title}</h2>
                  <p className="mt-2 text-muted-foreground">{body}</p>
                </div>
                <Button
                  asChild
                  className="rounded-full gradient-purple-orange text-white lg:self-center"
                >
                  <Link to="/book" search={{ service: bookingService }}>
                    {cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            );
          })}

          <div className="mt-8 rounded-3xl gradient-blue-teal p-8 text-center text-white sm:p-12">
            <h3 className="text-2xl font-extrabold sm:text-3xl">Not sure what you need?</h3>
            <p className="mt-2 text-white/90">
              Build your own package or book a free call with our team.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full bg-white text-teal hover:bg-white/90">
                <Link to="/build-your-package" search={{ selection: undefined }}>
                  Build Your Package
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10"
              >
                <Link to="/contact">Book a free call</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </SiteLayout>
  );
}
