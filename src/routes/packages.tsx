import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import { toPackageCards, toPackageComparisonRows } from "@/lib/service-content";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Compliance Packages — SDC&T" },
      {
        name: "description",
        content:
          "Three dental compliance packages: Essential £199, Safety & Training £299, Complete £399. Choose, book and pay.",
      },
      { property: "og:title", content: "Compliance Packages — SDC&T" },
      {
        property: "og:description",
        content: "Tiered CQC compliance packages for UK dental practices.",
      },
      { property: "og:url", content: "/packages" },
    ],
    links: [{ rel: "canonical", href: "/packages" }],
  }),
  loader: async () => {
    const [packages, comparison] = await Promise.all([
      getPublicServiceItems({ data: { section: "packages" } }),
      getPublicServiceItems({ data: { section: "package-comparison" } }),
    ]);

    return { packages: packages.items, comparison: comparison.items };
  },
  component: PackagesPage,
});

function PackagesPage() {
  const { packages: packageItems, comparison } = Route.useLoaderData();
  const packages = toPackageCards(packageItems);
  const comparisonRows = toPackageComparisonRows(
    comparison,
    packages.map((item) => item.id),
  );

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Packages"
            title="Pick the package that fits your practice"
            description="All packages include filing of certificates and a single point of contact. Need something different? Build your own bespoke package."
            center
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`relative overflow-hidden rounded-3xl border bg-background shadow-soft ${p.popular ? "border-magenta lg:-translate-y-3 shadow-card" : "border-border"}`}
              >
                {p.popular && (
                  <div className="absolute right-4 top-4 z-10 rounded-full gradient-orange-gold px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className={`${p.gradient} px-6 py-8 text-white`}>
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="mt-3 text-5xl font-extrabold">£{p.price}</div>
                  <p className="mt-2 text-sm text-white/90">{p.tagline}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full gradient-teal-purple text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-6 w-full rounded-full gradient-purple-orange text-white"
                  >
                    <Link to="/book" search={{ package: p.id }}>
                      Choose this package
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Compare packages at a glance" center />
          <div className="mt-10 overflow-x-auto rounded-3xl border border-border bg-background shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-left">
                  <th className="px-6 py-4 font-semibold">Feature</th>
                  {packages.map((p) => (
                    <th key={p.id} className="px-6 py-4 text-center font-semibold">
                      <div>{p.name.split(" ").slice(0, 2).join(" ")}</div>
                      <div className="text-xs font-normal text-muted-foreground">£{p.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-6 py-4">{row.label}</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center">
                        {row.includedPackageIds.includes(pkg.id) ? (
                          <Check className="mx-auto h-5 w-5 text-teal" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/40" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CTASection
        title="Need something more bespoke?"
        subtitle="Build your own package with our live calculator or book a free call."
      />
    </SiteLayout>
  );
}
