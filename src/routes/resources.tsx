import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITEMS, formatGBP } from "@/lib/pricing";
import { Download, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Compliance Logbooks & Guides — SDC&T" },
      { name: "description", content: "Free dental compliance guides, paid resources and logbooks (Reception, Dental Nurse, Lead Nurse, Practice Manager)." },
      { property: "og:title", content: "Resources — SDC&T" },
      { property: "og:description", content: "Compliance logbooks and resources for UK dental practices." },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

const FREE_RESOURCES = [
  { title: "CQC Inspection Checklist", desc: "A printable checklist used by inspected practices." },
  { title: "Quarterly Compliance Calendar", desc: "When to do what — at a glance." },
  { title: "New Practice Setup Guide", desc: "Step-by-step for opening a squat practice." },
];

// Configurable: add items here with their own prices.
const PAID_RESOURCES: { title: string; price: number; desc: string }[] = [
  // { title: "Policies & Procedures Pack", price: 199, desc: "Full pack ready to adopt." },
];

function ResourcesPage() {
  const [email, setEmail] = useState("");
  const logbooks = ITEMS.filter((i) => i.id.startsWith("log-"));

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Resources" title="Tools, logbooks and free guides" description="Everything you need to keep your practice running smoothly between visits." />
        </div>
      </section>

      {/* Free */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Free resources" description="Drop in your email and we'll send these straight over." />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {FREE_RESOURCES.map((r) => (
              <div key={r.title} className="flex flex-col rounded-3xl border border-border bg-background p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-teal-purple text-white"><FileText className="h-5 w-5" /></span>
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <form onSubmit={(e) => { e.preventDefault(); if (!email) return toast.error("Add your email"); toast.success(`We'll email "${r.title}" to ${email}`); }} className="mt-5 flex gap-2">
                  <Input type="email" placeholder="you@practice.co.uk" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="submit" className="shrink-0 rounded-full gradient-purple-orange text-white"><Download className="mr-1 h-4 w-4" /> Get</Button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logbooks */}
      <section className="bg-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Compliance logbooks" description="Practical, role-specific logbooks — £49.99 each." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {logbooks.map((b, i) => (
              <div key={b.id} className="overflow-hidden rounded-3xl border border-border bg-background shadow-soft">
                <div className={`h-28 ${["gradient-teal-purple","gradient-purple-orange","gradient-orange-gold","gradient-blue-teal"][i % 4]} flex items-end p-4`}>
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold">{b.name}</h3>
                  <div className="mt-1 text-magenta font-extrabold">{formatGBP(b.price)}</div>
                  <Button onClick={() => toast.success(`${b.name} added — checkout opens via Calendly`)} className="mt-4 w-full rounded-full gradient-purple-orange text-white">Buy</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="Paid resources" description="Curated guides and templates with their own prices." />
          {PAID_RESOURCES.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/40 p-10 text-center text-muted-foreground">
              More paid resources coming soon. <span className="text-foreground">Configure items in <code>src/routes/resources.tsx</code> → <code>PAID_RESOURCES</code>.</span>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {PAID_RESOURCES.map((r) => (
                <div key={r.title} className="rounded-3xl border border-border bg-background p-6 shadow-soft">
                  <h3 className="text-lg font-bold">{r.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  <div className="mt-3 text-2xl font-extrabold text-magenta">{formatGBP(r.price)}</div>
                  <Button className="mt-4 w-full rounded-full gradient-purple-orange text-white">Buy</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
