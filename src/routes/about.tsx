import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { ShieldCheck, FolderHeart, HeartHandshake, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Smart Dental Compliance & Training" },
      {
        name: "description",
        content:
          "Dental-specific compliance experts based in the UK. Everything under one roof — never misplace a certificate again.",
      },
      { property: "og:title", content: "About — SDC&T" },
      { property: "og:description", content: "About Smart Dental Compliance & Training." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative mx-auto max-w-5xl px-4 py-24 text-white sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
            About us
          </span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
            We take the stress of CQC compliance off your shoulders.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">
            Smart Dental Compliance &amp; Training is a UK team of dental-specific compliance
            experts. We work with practice owners, managers, and people buying practices to keep
            everything safe, compliant, and inspection-ready — without the juggling.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our promise"
              title="Everything under one roof. Forever filed. Fully managed if you want it."
              description="No more scattered certificates, missed renewals, or five different suppliers to chase. We're the single phone call you need."
            />
            <Button asChild className="mt-6 rounded-full gradient-purple-orange text-white">
              <Link to="/book">Book a call</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Dental-specific",
                body: "We only work with dental practices.",
              },
              {
                icon: FolderHeart,
                title: "All in one place",
                body: "Every certificate, filed and findable.",
              },
              {
                icon: HeartHandshake,
                title: "One point of contact",
                body: "A single number, a real human.",
              },
              {
                icon: Stethoscope,
                title: "Inspection-ready",
                body: "We get you CQC-ready, not just compliant.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background p-5 shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-3 font-bold">{title}</div>
                <div className="text-sm text-muted-foreground">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </SiteLayout>
  );
}
