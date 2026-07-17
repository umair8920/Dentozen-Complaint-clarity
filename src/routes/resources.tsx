import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Check, Download, FileText, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITEMS, formatGBP } from "@/lib/pricing";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import { addBookingCartItem } from "@/lib/booking-cart";
import { encodeSelection } from "@/lib/package-selection";
import { toResourceCards } from "@/lib/service-content";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources - Compliance Logbooks & Guides - SDC&T" },
      {
        name: "description",
        content:
          "Free dental compliance guides, paid resources and logbooks (Reception, Dental Nurse, Lead Nurse, Practice Manager).",
      },
      { property: "og:title", content: "Resources - Compliance Logbooks & Guides - SDC&T" },
      {
        property: "og:description",
        content: "Compliance logbooks and resources for UK dental practices.",
      },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  loader: async () => {
    try {
      return await getPublicServiceItems({ data: { section: "resources" } });
    } catch (error) {
      console.error("Database-backed resources could not load; using static fallback.", error);
      return null;
    }
  },
  component: ResourcesPage,
});

const FREE_RESOURCES = [
  { title: "CQC Inspection Checklist", desc: "A printable checklist used by inspected practices." },
  { title: "Quarterly Compliance Calendar", desc: "When to do what - at a glance." },
  { title: "New Practice Setup Guide", desc: "Step-by-step for opening a squat practice." },
];

// Configurable: add items here with their own prices.
const PAID_RESOURCES: { title: string; price: number; desc: string }[] = [
  // { title: "Policies & Procedures Pack", price: 199, desc: "Full pack ready to adopt." },
];

function ResourcesPage() {
  const resourceContent = Route.useLoaderData();
  const [email, setEmail] = useState("");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const fallbackLogbooks = ITEMS.filter((item) => item.id.startsWith("log-"));
  const logbooks = toResourceCards(resourceContent?.items, fallbackLogbooks);

  const addLogbook = (logbook: (typeof logbooks)[number]) => {
    const result = addBookingCartItem(
      {
        serviceKey: logbook.id,
        serviceLabel: logbook.name,
        serviceSource: "resources",
        paymentLink: "/resources",
        packageSelection: encodeSelection({ [logbook.id]: 1 }),
        packageSummary: [
          logbook.name,
          logbook.description,
          `Price: ${logbook.priceLabel ?? formatGBP(logbook.price)}${logbook.exVat ? " +VAT" : ""}`,
        ]
          .filter(Boolean)
          .join("\n"),
        unitPrice: logbook.price,
        vatAmount: logbook.exVat ? logbook.price * 0.2 : 0,
        quantity: 1,
      },
      { incrementExisting: logbook.allowQuantity },
    );
    if (result.added) {
      setRecentlyAdded(logbook.id);
      window.setTimeout(
        () => setRecentlyAdded((current) => (current === logbook.id ? null : current)),
        1600,
      );
    }
    toast.success(
      result.added
        ? `${logbook.name} added to your booking cart.`
        : `${logbook.name} is already in your booking cart.`,
    );
  };

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Resources"
            title="Tools, logbooks and free guides"
            description="Everything you need to keep your practice running smoothly between visits."
          />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Free resources"
            description="Drop in your email and we'll send these straight over."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {FREE_RESOURCES.map((r) => (
              <div
                key={r.title}
                className="flex flex-col rounded-3xl border border-border bg-background p-6 shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-teal-purple text-white">
                  <FileText className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) return toast.error("Add your email");
                    toast.success(`We'll email "${r.title}" to ${email}`);
                  }}
                  className="mt-5 flex gap-2"
                >
                  <Input
                    type="email"
                    placeholder="you@practice.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="shrink-0 rounded-full gradient-purple-orange text-white"
                  >
                    <Download className="mr-1 h-4 w-4" /> Get
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Compliance logbooks"
            description="Practical, role-specific logbooks. Add what you need and complete everything through the booking cart."
          />
          {logbooks.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
              No compliance logbooks are currently available.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {logbooks.map((b) => (
                <div
                  key={b.id}
                  className="group overflow-hidden rounded-3xl border border-border bg-background shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className={`flex h-28 items-end p-4 ${b.gradient}`}>
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex min-h-48 flex-col p-5">
                    <h3 className="font-bold">{b.name}</h3>
                    {b.description ? (
                      <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
                    ) : null}
                    <div className="mt-2 font-extrabold text-magenta">
                      {b.priceLabel ?? formatGBP(b.price)}
                      {b.exVat ? (
                        <span className="ml-1 text-xs font-medium text-muted-foreground">+VAT</span>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      onClick={() => addLogbook(b)}
                      className="mt-auto w-full rounded-full gradient-purple-orange text-white"
                    >
                      {recentlyAdded === b.id ? (
                        <>
                          <Check className="h-4 w-4" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" /> Add to cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {logbooks.length > 0 ? (
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="rounded-full border-2">
                <Link to="/book">
                  <ShoppingCart className="h-4 w-4" /> View booking cart
                </Link>
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Paid resources"
            description="Curated guides and templates with their own prices."
          />
          {PAID_RESOURCES.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center text-muted-foreground">
              More paid resources coming soon.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {PAID_RESOURCES.map((r) => (
                <div
                  key={r.title}
                  className="rounded-3xl border border-border bg-background p-6 shadow-soft"
                >
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-3 text-2xl font-extrabold text-magenta">
                    {formatGBP(r.price)}
                  </div>
                  <Button className="mt-4 w-full rounded-full gradient-purple-orange text-white">
                    Buy
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
