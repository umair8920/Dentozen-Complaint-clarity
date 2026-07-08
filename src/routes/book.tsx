import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE } from "@/lib/site-config";
import { Calendar, CreditCard, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Now — SDC&T" },
      { name: "description", content: "Book and pay for dental compliance services securely via our Calendly booking." },
      { property: "og:title", content: "Book Now — SDC&T" },
      { property: "og:description", content: "Book and pay for dental compliance services." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

function BookPage() {
  useEffect(() => {
    // Lazy-inject Calendly assets
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://assets.calendly.com/assets/external/widget.js";
    js.async = true;
    document.body.appendChild(js);
    return () => {
      document.head.removeChild(css);
      document.body.removeChild(js);
    };
  }, []);

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Book Now" title="Pick a time that works for you" description="Choose a service, pick a slot and pay securely — it takes 2 minutes." />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Calendar, label: "Live availability" },
              { icon: CreditCard, label: "Secure online payment" },
              { icon: ShieldCheck, label: "Confirmation by email" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white"><Icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-background p-3 shadow-card sm:p-6">
          <div
            className="calendly-inline-widget rounded-2xl overflow-hidden"
            data-url={SITE.calendlyUrl}
            style={{ minWidth: 320, height: 720 }}
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Booking widget not loading? Visit{" "}
            <a href={SITE.calendlyUrl} target="_blank" rel="noreferrer" className="underline">{SITE.calendlyUrl}</a>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
