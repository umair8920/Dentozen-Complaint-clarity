import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { ITEMS, formatGBP, type Category } from "@/lib/pricing";
import { encodeSelection } from "@/lib/package-selection";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Individual Services — SDC&T" },
      {
        name: "description",
        content:
          "Transparent pricing for dental compliance services: risk assessments, training, Direct 365 services, RPA and resources.",
      },
      { property: "og:title", content: "Pricing — SDC&T" },
      { property: "og:description", content: "À la carte pricing for every compliance service." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: PricingPage,
});

const CATEGORIES: Category[] = [
  "Risk Assessments",
  "Training",
  "Direct 365 Services",
  "RPA",
  "Resources",
];

function PricingPage() {
  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Pick and choose — or mix them all"
            description="Every service we offer, with transparent pricing. Mix and match any of these in our Build Your Package tool."
            center
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full gradient-purple-orange text-white">
              <Link to="/build-your-package" search={{ selection: undefined }}>
                Build Your Package
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-2">
              <Link to="/book">Book a service</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {CATEGORIES.map((cat) => {
            const items = ITEMS.filter((i) => i.category === cat);
            return (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/\s+/g, "-")}
                className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
              >
                <div className="gradient-teal-purple px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">{cat}</h2>
                  {cat === "Direct 365 Services" && (
                    <p className="text-xs text-white/90">
                      All prices shown ex-VAT. PAT uses tiered pricing: £1.88/item up to 40, then
                      £0.80/item.
                    </p>
                  )}
                </div>
                <ul className="divide-y divide-border">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="font-semibold">{it.name}</div>
                        {it.description && (
                          <div className="text-xs text-muted-foreground">{it.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {it.tbd ? (
                            <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                              [PRICE]
                            </span>
                          ) : (
                            <div className="font-extrabold text-magenta">
                              {it.priceLabel ?? formatGBP(it.price)}
                              {it.exVat ? (
                                <span className="ml-1 text-xs font-medium text-muted-foreground">
                                  +VAT
                                </span>
                              ) : null}
                            </div>
                          )}
                        </div>
                        <Button asChild size="sm" variant="outline" className="rounded-full">
                          <Link
                            to="/build-your-package"
                            search={{ selection: encodeSelection({ [it.id]: 1 }) }}
                          >
                            Add
                          </Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="rounded-3xl border border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground">
            <strong className="text-foreground">Free Resources</strong> — downloadable guides &amp;
            checklists, free with email sign-up. See the{" "}
            <Link to="/resources" className="underline">
              Resources page
            </Link>
            .
            <br />
            <strong className="text-foreground">Paid Resources</strong> — additional resources at
            varying prices; configured on the Resources page.
          </div>
        </div>
      </section>

      <CTASection />
    </SiteLayout>
  );
}
