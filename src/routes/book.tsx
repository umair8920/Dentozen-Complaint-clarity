import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/SiteLayout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BOOKING_SERVICES, getBookingService } from "@/lib/booking";
import { bookingFormSchema, submitBookingForm } from "@/lib/api/booking.functions";
import { decodeSelection, selectionSummary, selectionToLines } from "@/lib/package-selection";
import { SITE } from "@/lib/site-config";

type BookSearch = {
  service?: string;
  selection?: string;
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
    selection: typeof search.selection === "string" ? search.selection : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book Now - SDC&T" },
      {
        name: "description",
        content:
          "Submit a provisional booking request for dental compliance services and receive confirmation by email.",
      },
      { property: "og:title", content: "Book Now - SDC&T" },
      { property: "og:description", content: "Request a booking for dental compliance services." },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const INITIAL_FORM = {
  fullName: "",
  email: "",
  telephone: "",
  nameOfPractice: "",
  serviceRequired: BOOKING_SERVICES[0].value,
  bookingDates: "",
  bookingTime: "",
  delegates: "",
  paymentLink: getBookingService(BOOKING_SERVICES[0].value)?.paymentLink ?? "",
};

function BookPage() {
  const search = Route.useSearch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isCalculatorFlow = Boolean(search.selection) && !search.service;
  const packageSelection = useMemo(() => decodeSelection(search.selection), [search.selection]);
  const packageLines = useMemo(() => selectionToLines(packageSelection), [packageSelection]);
  const packageSummary = useMemo(() => selectionSummary(packageSelection), [packageSelection]);

  const selectedService = useMemo(() => {
    if (isCalculatorFlow) {
      return undefined;
    }

    return getBookingService(form.serviceRequired) ?? BOOKING_SERVICES[0];
  }, [form.serviceRequired, isCalculatorFlow]);

  const paymentLinkValue = isCalculatorFlow
    ? "/build-your-package"
    : (selectedService?.paymentLink ?? BOOKING_SERVICES[0].paymentLink);

  useEffect(() => {
    if (isCalculatorFlow) {
      setForm((current) => ({
        ...current,
        serviceRequired: "Package enquiry",
        paymentLink: "/build-your-package",
      }));
      return;
    }

    if (!search.service) {
      return;
    }

    const nextService = getBookingService(search.service);
    if (!nextService) {
      return;
    }

    setForm((current) => ({
      ...current,
      serviceRequired: nextService.value,
      paymentLink: nextService.paymentLink,
      delegates: nextService.requiresDelegates ? current.delegates : "",
    }));
  }, [search.service, isCalculatorFlow]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = bookingFormSchema.safeParse({
      ...form,
      paymentLink: paymentLinkValue,
      packageSelection: search.selection ?? "",
      packageSummary: packageSummary,
    });

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }

    try {
      setIsSubmitting(true);
      await submitBookingForm({ data: parsed.data });
      setIsSubmitted(true);
      toast.success("Thanks - your provisional booking request has been sent.");
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      toast.error("We couldn't send your booking request right now. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Book Now"
            title="Request your provisional booking"
            description="Choose a service, add your preferred dates, and we'll email confirmation within 3 to 5 working days."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Calendar, label: "Preferred dates and timing" },
              { icon: CreditCard, label: "Service-based payment link" },
              { icon: ShieldCheck, label: "Provisional booking by email" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-teal-purple text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_1fr]">
          {isSubmitted ? (
            <div className="rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8 lg:col-span-2">
              <div className="mx-auto max-w-2xl rounded-3xl gradient-teal-purple p-8 text-white shadow-glow">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                    <CheckCircle2 className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                      Thank you
                    </div>
                    <h3 className="mt-1 text-2xl font-extrabold">
                      Thank you for making the booking
                    </h3>
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/90">
                  Please note this is a provisional booking. We will send a confirmation email
                  within 3 to 5 working days.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full bg-white text-teal hover:bg-white/90"
                  >
                    Make another booking
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-border bg-background p-6 shadow-soft sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {packageLines.length > 0 ? (
                    <div className="sm:col-span-2 rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Package selected from calculator
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                        {packageSummary}
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      disabled={isSubmitting}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="telephone">Telephone *</Label>
                    <Input
                      id="telephone"
                      required
                      disabled={isSubmitting}
                      value={form.telephone}
                      onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameOfPractice">Name of Practice *</Label>
                    <Input
                      id="nameOfPractice"
                      required
                      disabled={isSubmitting}
                      value={form.nameOfPractice}
                      onChange={(e) => setForm({ ...form, nameOfPractice: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  {!isCalculatorFlow ? (
                    <div className="sm:col-span-2">
                      <Label htmlFor="serviceRequired">Service required *</Label>
                      <select
                        id="serviceRequired"
                        required
                        disabled={isSubmitting}
                        value={form.serviceRequired}
                        onChange={(e) => {
                          const nextService =
                            getBookingService(e.target.value) ?? BOOKING_SERVICES[0];
                          setForm({
                            ...form,
                            serviceRequired: nextService.value,
                            paymentLink: nextService.paymentLink,
                            delegates: nextService.requiresDelegates ? form.delegates : "",
                          });
                        }}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {BOOKING_SERVICES.map((service) => (
                          <option key={service.value} value={service.value}>
                            {service.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input type="hidden" name="serviceRequired" value="Package enquiry" />
                  )}
                  <div className="sm:col-span-2">
                    <Label htmlFor="bookingDates">
                      Dates you would like the booking (please provide 2-3 dates) *
                    </Label>
                    <Textarea
                      id="bookingDates"
                      required
                      rows={4}
                      disabled={isSubmitting}
                      value={form.bookingDates}
                      onChange={(e) => setForm({ ...form, bookingDates: e.target.value })}
                      className="mt-1"
                      placeholder="Example: 14 August 2026, 16 August 2026, or 18 August 2026"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookingTime">Timing of Booking *</Label>
                    <Input
                      id="bookingTime"
                      required
                      disabled={isSubmitting}
                      value={form.bookingTime}
                      onChange={(e) => setForm({ ...form, bookingTime: e.target.value })}
                      className="mt-1"
                      placeholder="e.g. Morning, afternoon, or 10:00 to 13:00"
                    />
                  </div>
                  {selectedService?.requiresDelegates ? (
                    <div>
                      <Label htmlFor="delegates">Number of delegates *</Label>
                      <Input
                        id="delegates"
                        required={selectedService.requiresDelegates}
                        disabled={isSubmitting}
                        value={form.delegates}
                        onChange={(e) => setForm({ ...form, delegates: e.target.value })}
                        className="mt-1"
                        inputMode="numeric"
                        placeholder="e.g. 8"
                      />
                    </div>
                  ) : null}
                  <div className="sm:col-span-2">
                    <Label htmlFor="paymentLink">Payment link for this service</Label>
                    <Input
                      id="paymentLink"
                      readOnly
                      value={paymentLinkValue}
                      className="mt-1 bg-muted/40"
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      This link changes with the selected flow and will also be included in the
                      booking email.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 w-full rounded-full gradient-purple-orange text-white sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Submit booking request"}
                </Button>
              </form>

              <aside className="space-y-4">
                <div className="rounded-3xl border border-border bg-background p-6 shadow-soft">
                  <h3 className="text-lg font-bold">What happens next</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-teal-purple text-white">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      We review your preferred dates and service.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-purple-orange text-white">
                        <Mail className="h-4 w-4" />
                      </span>
                      We send a confirmation email within 3 to 5 working days.
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-xl gradient-orange-gold text-white">
                        <Phone className="h-4 w-4" />
                      </span>
                      Need help before submitting? Call us on {SITE.phone}.
                    </li>
                  </ul>
                </div>
                <div className="rounded-3xl gradient-blue-teal p-6 text-white shadow-soft">
                  <h3 className="text-lg font-bold">Service-based payment link</h3>
                  <p className="mt-1 text-sm text-white/90">
                    {isCalculatorFlow
                      ? "This is a package enquiry, so we hide service selection and keep the next step focused on your package."
                      : "Choose a service to see the matching link. We&apos;ve kept it visible so the next step is obvious."}
                  </p>
                  <div className="mt-4 rounded-2xl bg-white/15 p-4 text-sm backdrop-blur">
                    <div className="font-semibold">
                      {isCalculatorFlow ? "Package enquiry" : selectedService?.label}
                    </div>
                    <div className="mt-1 break-all text-white/85">{paymentLinkValue}</div>
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
