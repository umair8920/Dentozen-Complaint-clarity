import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Check, ChevronDown, Mail, Minus, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ITEMS, formatGBP, type Category } from "@/lib/pricing";
import {
  decodeSelection,
  encodeSelection,
  selectionToLines,
  type PackageSelection,
} from "@/lib/package-selection";
import { packageQuoteSchema, submitPackageQuote } from "@/lib/api/package.functions";

export const Route = createFileRoute("/build-your-package")({
  validateSearch: (search: Record<string, unknown>) => ({
    selection: typeof search.selection === "string" ? search.selection : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Build Your Package - Live Compliance Calculator - SDC&T" },
      {
        name: "description",
        content:
          "Build a bespoke compliance package for your dental practice and see the price live. Email yourself a quote or book and pay.",
      },
      { property: "og:title", content: "Build Your Package - SDC&T" },
      {
        property: "og:description",
        content: "Interactive dental compliance calculator with live pricing.",
      },
      { property: "og:url", content: "/build-your-package" },
    ],
    links: [{ rel: "canonical", href: "/build-your-package" }],
  }),
  component: BuilderPage,
});

const CATEGORIES: Category[] = [
  "Packages",
  "Risk Assessments",
  "Training",
  "Direct 365 Services",
  "RPA",
  "Resources",
];

function BuilderPage() {
  const search = Route.useSearch();
  const [sel, setSel] = useState<PackageSelection>(() => decodeSelection(search.selection));
  const [openCats, setOpenCats] = useState<Record<Category, boolean>>({
    Packages: true,
    "Risk Assessments": true,
    Training: false,
    "Direct 365 Services": false,
    RPA: false,
    Resources: false,
  });
  const [vatInclusive, setVatInclusive] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  useEffect(() => {
    setSel(decodeSelection(search.selection));
  }, [search.selection]);

  const lines = useMemo(() => selectionToLines(sel), [sel]);

  const subTotal = lines.reduce((s, l) => s + l.subTotal, 0);
  const vatTotal = lines.reduce((s, l) => s + l.vat, 0);
  const grand = subTotal + (vatInclusive ? vatTotal : 0);

  const raIds = ["ra-fire", "ra-legionella", "ra-hs", "ra-disability"];
  const hasAll4 = raIds.every((id) => (sel[id] ?? 0) > 0);

  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: s[id] ? 0 : 1 }));
  const setQty = (id: string, q: number) => setSel((s) => ({ ...s, [id]: Math.max(0, q) }));

  const swapForBundle = () => {
    setSel((s) => {
      const next = { ...s };
      raIds.forEach((id) => {
        next[id] = 0;
      });
      next["ra-bundle"] = 1;
      return next;
    });
    toast.success("Swapped to the 4 risk assessment bundle - nice saving!");
  };

  const emailQuote = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = packageQuoteSchema.safeParse({
      name,
      email,
      selection: encodeSelection(sel),
    });

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }

    if (lines.length === 0) {
      return toast.error("Pick at least one item first.");
    }

    try {
      setIsSendingQuote(true);
      await submitPackageQuote({ data: parsed.data });
      toast.success(`Quote sent to ${email}.`);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't send your quote right now. Please try again in a moment.");
    } finally {
      setIsSendingQuote(false);
    }
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta">
            Bespoke calculator
          </span>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Build your compliance package
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pick what you need. Watch the total update live. Email yourself a quote or book and pay.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {hasAll4 && (
              <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-orange" />
                  <div className="text-sm">
                    <strong>Save with the 4-risk-assessment bundle</strong> - you&apos;ve selected
                    all four risk assessments individually. Swap for the bundle.
                  </div>
                </div>
                <Button
                  onClick={swapForBundle}
                  className="rounded-full gradient-orange-gold text-white"
                >
                  Swap for bundle
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-sm">
              <Label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={vatInclusive}
                  onChange={(e) => setVatInclusive(e.target.checked)}
                  className="h-4 w-4 accent-magenta"
                />
                Show VAT-inclusive total (Direct 365 items are +VAT)
              </Label>
            </div>

            {CATEGORIES.map((cat) => {
              const items = ITEMS.filter((i) => i.category === cat);
              const open = openCats[cat];

              return (
                <div
                  key={cat}
                  className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft"
                >
                  <button
                    onClick={() => setOpenCats((s) => ({ ...s, [cat]: !s[cat] }))}
                    className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
                  >
                    <h2 className="text-lg font-bold">{cat}</h2>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <ul className="divide-y divide-border border-t border-border">
                      {items.map((it) => {
                        const qty = sel[it.id] ?? 0;
                        const active = qty > 0;

                        return (
                          <li
                            key={it.id}
                            className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${
                              active ? "bg-muted/40" : ""
                            }`}
                          >
                            <div className="flex-1">
                              <div className="font-semibold">{it.name}</div>
                              {it.description && (
                                <div className="text-xs text-muted-foreground">
                                  {it.description}
                                </div>
                              )}
                              <div className="mt-1 text-xs text-muted-foreground">
                                {it.tbd ? "[PRICE]" : (it.priceLabel ?? formatGBP(it.price))}
                                {it.exVat && " +VAT"}
                                {it.allowQuantity && it.unit ? ` / ${it.unit}` : ""}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {it.allowQuantity ? (
                                <div className="flex items-center rounded-full border border-border">
                                  <button
                                    onClick={() => setQty(it.id, qty - 1)}
                                    aria-label="Decrease"
                                    className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    value={qty}
                                    onChange={(e) =>
                                      setQty(it.id, parseInt(e.target.value || "0", 10))
                                    }
                                    className="w-14 bg-transparent text-center text-sm font-semibold focus:outline-none"
                                  />
                                  <button
                                    onClick={() => setQty(it.id, qty + 1)}
                                    aria-label="Increase"
                                    className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => toggle(it.id)}
                                  variant={active ? "default" : "outline"}
                                  className={`rounded-full ${active ? "gradient-purple-orange text-white" : ""}`}
                                >
                                  {active ? (
                                    <>
                                      <Check className="mr-1 h-4 w-4" /> Added
                                    </>
                                  ) : (
                                    "Add"
                                  )}
                                </Button>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-card">
              <div className="gradient-teal-purple px-6 py-4 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Your package
                </div>
                <div className="mt-1 text-3xl font-extrabold">{formatGBP(grand)}</div>
                <div className="text-xs text-white/80">
                  {vatInclusive
                    ? "VAT inclusive where applicable"
                    : "Ex-VAT - VAT applies to Direct 365 items"}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-4">
                {lines.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No items selected yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {lines.map(({ item, qty, subTotal }) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {qty > 1 ? `${qty} x ` : ""}
                            {item.name}
                          </div>
                          {item.exVat && (
                            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                              +VAT
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{formatGBP(subTotal)}</span>
                          <button
                            onClick={() => setQty(item.id, 0)}
                            aria-label="Remove"
                            className="rounded-full p-1 text-muted-foreground hover:bg-background hover:text-destructive"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2 border-t border-border bg-surface p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatGBP(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (Direct 365)</span>
                  <span className="font-semibold">{formatGBP(vatTotal)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base">
                  <span className="font-bold">
                    Total {vatInclusive ? "(inc. VAT)" : "(ex. VAT)"}
                  </span>
                  <span className="font-extrabold text-magenta">{formatGBP(grand)}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-border p-4">
                <Button
                  asChild
                  className="w-full rounded-full gradient-purple-orange text-white"
                  disabled={lines.length === 0}
                >
                  <Link to="/book" search={{ selection: encodeSelection(sel) }}>
                    <Calendar className="mr-2 h-4 w-4" /> Book &amp; Pay
                  </Link>
                </Button>
                <form onSubmit={emailQuote} className="space-y-2">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full rounded-full border-2"
                    disabled={isSendingQuote}
                  >
                    <Mail className="mr-2 h-4 w-4" />{" "}
                    {isSendingQuote ? "Sending..." : "Email me this quote"}
                  </Button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="sticky bottom-0 z-30 border-t border-border bg-background p-3 shadow-card lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Total {vatInclusive ? "(inc.)" : "(ex.)"}
            </div>
            <div className="text-lg font-extrabold text-magenta">{formatGBP(grand)}</div>
          </div>
          <Button
            asChild
            className="rounded-full gradient-purple-orange text-white"
            disabled={lines.length === 0}
          >
            <Link to="/book" search={{ selection: encodeSelection(sel) }}>
              Book & Pay
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
