import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { CTASection } from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { ITEMS, formatGBP } from "@/lib/pricing";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import { categoryNames, toPriceItems } from "@/lib/service-content";
import { encodeSelection, selectionSummary } from "@/lib/package-selection";
import { addBookingCartItem } from "@/lib/booking-cart";

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
  loader: async () => getPublicServiceItems({ data: { section: "pricing" } }),
  component: PricingPage,
});

function PricingPage() {
  const { items, categories } = Route.useLoaderData();
  const priceItems = toPriceItems(
    items,
    ITEMS.filter((item) => item.category !== "Packages"),
  );
  const visibleCategories = categoryNames(categories, priceItems);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  const addItem = (item: (typeof priceItems)[number]) => {
    const selection = { [item.id]: 1 };
    addBookingCartItem(
      {
        serviceKey: item.id,
        serviceLabel: item.name,
        serviceSource: "pricing",
        paymentLink: "/pricing",
        packageSelection: encodeSelection(selection),
        packageSummary: selectionSummary(selection, priceItems),
        unitPrice: item.tbd ? null : item.price,
        vatAmount: item.exVat && !item.tbd ? item.price * 0.2 : 0,
        quantity: 1,
      },
      { incrementExisting: item.allowQuantity === true },
    );
    setRecentlyAdded(item.id);
    window.setTimeout(
      () => setRecentlyAdded((current) => (current === item.id ? null : current)),
      1600,
    );
    toast.success(`${item.name} added to your booking cart.`);
  };

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Pricing"
            title="Pick and choose — or mix them all"
            description="Every service we offer, with transparent pricing. Mix and match any of these in our Build Your own Package tool."
            center
          />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full gradient-purple-orange text-white">
              <Link to="/build-your-package" search={{ selection: undefined }}>
                Build Your own Package
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-2">
              <Link to="/book">
                <ShoppingCart className="h-4 w-4" /> View booking cart
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {visibleCategories.map((cat) => {
            const items = priceItems.filter((i) => i.category === cat);
            const category = categories.find((item) => item.name === cat);
            const hasVatOrTieredPricing = items.some((item) => item.exVat || item.tiered);
            const categoryNote =
              category?.pricingNote ||
              (hasVatOrTieredPricing
                ? "All prices shown ex-VAT. PAT uses tiered pricing: £1.88/item up to 40, then £0.80/item."
                : "");
            return (
              <div
                key={cat}
                id={cat.toLowerCase().replace(/\s+/g, "-")}
                className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
              >
                <div className="gradient-teal-purple px-6 py-4 text-white">
                  <h2 className="text-xl font-bold">{cat}</h2>
                  {categoryNote ? <p className="text-xs text-white/90">{categoryNote}</p> : null}
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
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => addItem(it)}
                        >
                          {recentlyAdded === it.id ? (
                            <>
                              <Check className="h-4 w-4" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4" /> Add
                            </>
                          )}
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
