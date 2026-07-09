import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, submitContactForm } from "@/lib/api/contact.functions";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - SDC&T" },
      { name: "description", content: "Get in touch with Smart Dental Compliance & Training. Contact form, phone, email, and direct booking." },
      { property: "og:title", content: "Contact - SDC&T" },
      { property: "og:description", content: "Contact Smart Dental Compliance & Training." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const INTERESTS = ["Packages", "Mock Inspection", "Due Diligence", "Managed Service", "New Practice Setup", "Other"];

const INITIAL_FORM = {
  name: "",
  practice: "",
  email: "",
  phone: "",
  interest: INTERESTS[0],
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactFormSchema.safeParse(form);
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }

    try {
      setIsSubmitting(true);
      await submitContactForm({ data: parsed.data });
      toast.success("Thanks - we'll be in touch within one working day.");
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't send your message right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Contact" title="Talk to a dental compliance specialist" description="We'll get back within one working day - or book a call directly." />
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Your name *</Label>
                <Input
                  id="name"
                  required
                  disabled={isSubmitting}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="practice">Practice name</Label>
                <Input
                  id="practice"
                  disabled={isSubmitting}
                  value={form.practice}
                  onChange={(e) => setForm({ ...form, practice: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  disabled={isSubmitting}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="interest">What are you interested in?</Label>
                <select
                  id="interest"
                  disabled={isSubmitting}
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {INTERESTS.map((interest) => (
                    <option key={interest}>{interest}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  disabled={isSubmitting}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-5 w-full rounded-full gradient-purple-orange text-white sm:w-auto">
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
              <h3 className="text-lg font-bold">Direct contact</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl gradient-teal-purple text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  {SITE.email}
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl gradient-purple-orange text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  {SITE.phone}
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl gradient-orange-gold text-white">
                    <MapPin className="h-4 w-4" />
                  </span>
                  {SITE.location}
                </li>
              </ul>
            </div>
            <div className="rounded-3xl gradient-blue-teal p-6 text-white shadow-soft">
              <h3 className="text-lg font-bold">Prefer to book?</h3>
              <p className="mt-1 text-sm text-white/90">Grab a slot in our calendar - it takes 2 minutes.</p>
              <Button asChild className="mt-4 rounded-full bg-white text-teal hover:bg-white/90">
                <Link to="/book">
                  <Calendar className="mr-2 h-4 w-4" /> Book a call
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
