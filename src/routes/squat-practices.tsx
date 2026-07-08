import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { VideoReviews } from "@/components/VideoReviews";
import { CTASection } from "@/components/CTASection";
import { ShieldCheck, FileCheck2, GraduationCap, HeartHandshake, Lightbulb, Stethoscope, AlertTriangle, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/squat-practices")({
  head: () => ({
    meta: [
      { title: "Squat Practices — CQC registration & compliance from day one — SDC&T" },
      { name: "description", content: "Opening a new dental clinic? We handle CQC registration, policies, RPA and full compliance setup so you can open your doors compliant — and help you appeal if rejected." },
      { property: "og:title", content: "Squat Practices — SDC&T" },
      { property: "og:description", content: "We get new dental clinics CQC-registered and compliant from day one." },
      { property: "og:url", content: "/squat-practices" },
    ],
    links: [{ rel: "canonical", href: "/squat-practices" }],
  }),
  component: SquatPage,
});

const CHECKLIST = [
  { icon: FileCheck2, label: "CQC registration" },
  { icon: ShieldCheck, label: "Policies & procedures" },
  { icon: Stethoscope, label: "RPA service" },
  { icon: Lightbulb, label: "Risk assessments" },
  { icon: GraduationCap, label: "Training (BLS, Cross Infection, etc.)" },
  { icon: HeartHandshake, label: "Equipment testing (PAT, PVI)" },
  { icon: ShieldCheck, label: "Ongoing managed compliance" },
];

function SquatPage() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">New dental clinics</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold sm:text-5xl lg:text-6xl">Opening a squat practice? We'll get you CQC-registered and compliant from day one.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">Setting up a brand-new dental clinic is daunting — we handle the compliance so you can focus on opening your doors.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-magenta hover:bg-white/90"><Link to="/book">Book a Free Consultation <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-white bg-transparent text-white hover:bg-white/10"><Link to="/contact">Get in touch</Link></Button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading eyebrow="Who this is for" title="Building a new dental clinic from the ground up?" description="A squat practice is a brand-new clinic, set up from scratch. We specialise in helping first-time owners and seasoned principals get everything in place — properly, the first time." center />
        </div>
      </section>

      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="CQC registration" title="We guide you through the entire process" description="Preparing the application, registered manager support, policies and procedures, RPA, risk assessments — everything needed to get registered correctly first time." />
            <Button asChild className="mt-6 rounded-full gradient-purple-orange text-white"><Link to="/book">Start my registration</Link></Button>
          </div>
          <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
            <h3 className="text-lg font-bold">What we prepare for you</h3>
            <ul className="mt-4 space-y-3">
              {["CQC application & supporting evidence","Registered Manager support","Statement of Purpose","Full policies & procedures pack","RPA appointment & service","Fire, Legionella, H&S, Disability risk assessments"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full gradient-teal-purple text-white"><Check className="h-3 w-3" /></span>{t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CQC rejected appeal */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl gradient-purple-orange p-8 text-white shadow-glow sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur"><AlertTriangle className="h-7 w-7" /></span>
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">CQC application rejected? Don't panic — we can help you turn it around.</h2>
              <p className="mt-2 text-white/90">We'll review the reasons for rejection, fix the shortfalls, and help you appeal or re-apply so you get registered.</p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-white text-magenta hover:bg-white/90"><Link to="/book">Get help appealing</Link></Button>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Squat setup" title="What a new practice needs — and how we deliver it" center />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHECKLIST.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-background p-5 shadow-soft">
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white"><Icon className="h-5 w-5" /></span>
                <div className="mt-4 font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <SectionHeading eyebrow="Why start with us" title="Everything under one roof, from day one" description="Dental-specific expertise, a single point of contact, and ongoing support after you open via our Smart Managed Service." center />
        </div>
      </section>

      <VideoReviews />
      <CTASection title="Book your free squat practice consultation" subtitle="A 30-minute call to map out exactly what your new clinic needs." />
    </SiteLayout>
  );
}
