import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBookingSelection, submitDashboardBooking } from "@/lib/api/user-bookings.functions";
import { getCurrentUser } from "@/lib/api/auth.functions";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import {
  EMPTY_CHECKOUT_DRAFT,
  addBookingCartItem,
  bookingCartCount,
  bookingCartTotals,
  clearCheckoutDraft,
  loadBookingCart,
  loadCheckoutDraft,
  loadCheckoutProgress,
  removeBookingCartItem,
  saveAuthReturnPath,
  saveCheckoutDraft,
  saveCheckoutProgress,
  subscribeToBookingCart,
  updateBookingCartQuantity,
  type BookingCartItem,
  type BookingCheckoutDraft,
} from "@/lib/booking-cart";
import { getBookingService } from "@/lib/booking";
import { decodeSelection, selectionSummary, selectionToLines } from "@/lib/package-selection";
import { ITEMS, formatGBP } from "@/lib/pricing";
import { toPackageCards, toPriceItems, type PackageCardContent } from "@/lib/service-content";
import { combinedBookingProfile, serviceBookingProfile } from "@/lib/service-booking";

type BookSearch = {
  service?: string;
  package?: string;
  selection?: string;
};

const checkoutSchema = z.object({
  contactName: z.string().trim().min(2, "Enter your full name.").max(100),
  contactEmail: z.string().trim().email("Enter a valid email address.").max(255),
  telephone: z.string().trim().min(5, "Enter a valid telephone number.").max(40),
  contactRole: z.string().trim().max(100),
  practiceName: z.string().trim().max(150),
  firstDate: z.string(),
  secondDate: z.string(),
  thirdDate: z.string(),
  bookingTime: z.string().trim().max(120),
  delegates: z.string().trim().max(40),
  privacyAccepted: z.boolean(),
});

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
    package: typeof search.package === "string" ? search.package : undefined,
    selection: typeof search.selection === "string" ? search.selection : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Booking Cart - SDC&T" },
      {
        name: "description",
        content:
          "Review your selected dental compliance services and complete your booking details.",
      },
      { property: "og:title", content: "Booking Cart - SDC&T" },
      {
        property: "og:description",
        content: "Review services, enter practice details, and securely confirm your booking.",
      },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  loader: async () => {
    const [packages, builder] = await Promise.all([
      getPublicServiceItems({ data: { section: "packages" } }),
      getPublicServiceItems({ data: { section: "build-your-package" } }),
    ]);

    return { packages: packages.items, builder: builder.items };
  },
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { packages, builder } = Route.useLoaderData();
  const [cart, setCart] = useState<BookingCartItem[]>([]);
  const [draft, setDraft] = useState<BookingCheckoutDraft>(EMPTY_CHECKOUT_DRAFT);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>["user"]>(null);
  const inboundHandled = useRef(false);

  const packageCards = useMemo(() => toPackageCards(packages), [packages]);
  const priceItems = useMemo(() => toPriceItems(builder, ITEMS), [builder]);
  const totals = useMemo(() => bookingCartTotals(cart), [cart]);
  const itemCount = bookingCartCount(cart);
  const bookingProfile = useMemo(() => combinedBookingProfile(cart), [cart]);
  const requiresAppointment = bookingProfile.needsPreferredDates;
  const needsDelegates = bookingProfile.needsTeamDetails;

  useEffect(() => {
    const refresh = () => setCart(loadBookingCart());
    refresh();
    setDraft(loadCheckoutDraft());
    setIsHydrated(true);
    return subscribeToBookingCart(refresh);
  }, []);

  useEffect(() => {
    if (!isHydrated || inboundHandled.current) {
      return;
    }
    inboundHandled.current = true;

    const inbound = buildInboundCartItem({
      search,
      packages: packageCards,
      priceItems,
    });
    if (!inbound) {
      return;
    }

    const result = addBookingCartItem(inbound);
    toast.success(
      result.added
        ? `${inbound.serviceLabel} added to your booking cart.`
        : `${inbound.serviceLabel} is already in your booking cart.`,
    );
    void navigate({
      to: "/book",
      search: { service: undefined, package: undefined, selection: undefined },
      replace: true,
    });
  }, [isHydrated, navigate, packageCards, priceItems, search]);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((result) => {
        if (!active) {
          return;
        }
        setUser(result.user);
        if (result.user?.role === "user") {
          setDraft((current) => ({
            ...current,
            contactName: current.contactName || result.user?.name || "",
            contactEmail: current.contactEmail || result.user?.email || "",
          }));
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setIsCheckingAuth(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveCheckoutDraft(draft);
    }
  }, [draft, isHydrated]);

  const updateDraft = (patch: Partial<BookingCheckoutDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const confirmBooking = async (event: React.FormEvent) => {
    event.preventDefault();

    if (cart.length === 0) {
      toast.error("Your booking cart is empty.");
      return;
    }

    const parsed = checkoutSchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    if (bookingProfile.needsPractice && draft.practiceName.trim().length < 2) {
      toast.error("Enter the dental practice or business name.");
      return;
    }
    if (bookingProfile.needsPractice && !draft.contactRole.trim()) {
      toast.error("Tell us your role at the practice.");
      return;
    }
    if (bookingProfile.needsPractice && !draft.practiceNation.trim()) {
      toast.error("Select the UK nation where the practice site is located.");
      return;
    }
    if (
      bookingProfile.needsSiteAddress &&
      (!draft.addressLine1.trim() || !draft.townCity.trim() || !draft.postcode.trim())
    ) {
      toast.error("Enter the full service-site address, including postcode.");
      return;
    }
    if (
      bookingProfile.needsDeliveryAddress &&
      (!draft.deliveryName.trim() ||
        !draft.deliveryAddressLine1.trim() ||
        !draft.deliveryTownCity.trim() ||
        !draft.deliveryPostcode.trim())
    ) {
      toast.error("Enter the delivery name and full delivery address.");
      return;
    }
    if (needsDelegates && !draft.delegates.trim()) {
      toast.error("Enter the number of delegates for your training booking.");
      return;
    }
    if (needsDelegates && (!/^\d+$/.test(draft.delegates) || Number(draft.delegates) < 1)) {
      toast.error("Enter a valid number of training delegates.");
      return;
    }
    if (
      bookingProfile.needsRadiationDetails &&
      (!/^\d+$/.test(draft.xrayEquipmentCount) || Number(draft.xrayEquipmentCount) < 1)
    ) {
      toast.error("Enter the number of dental X-ray units covered by the RPA service.");
      return;
    }
    if (!draft.privacyAccepted) {
      toast.error(
        "Confirm that the booking details can be used to arrange and manage the service.",
      );
      return;
    }

    const selectedDates = [draft.firstDate, draft.secondDate, draft.thirdDate].filter(Boolean);
    if (requiresAppointment) {
      if (selectedDates.length === 0) {
        toast.error("Choose at least one preferred date.");
        return;
      }
      if (!draft.bookingTime.trim()) {
        toast.error("Tell us your preferred appointment time.");
        return;
      }

      const minimumDate = localDateInputValue(new Date());
      if (selectedDates.some((date) => date < minimumDate)) {
        toast.error("Preferred dates cannot be in the past.");
        return;
      }
      if (new Set(selectedDates).size !== selectedDates.length) {
        toast.error("Choose different dates for each appointment option.");
        return;
      }
    }

    saveCheckoutDraft(draft);

    if (!user) {
      saveAuthReturnPath("/book");
      toast.message("Your cart and booking details are saved. Sign in to confirm.");
      await navigate({ to: "/login", search: { next: "/book" } });
      return;
    }

    if (user.role !== "user") {
      toast.error("Please use a customer account to place a booking.");
      return;
    }

    try {
      setIsSubmitting(true);
      const progress = loadCheckoutProgress();
      const bookingDates = selectedDates.join(", ");

      for (const item of cart) {
        let bookingId = progress[item.id];
        if (!bookingId) {
          const selection = selectionForSubmission(item, priceItems);
          const result = await createBookingSelection({ data: selection });
          bookingId = result.booking.id;
          progress[item.id] = bookingId;
          saveCheckoutProgress(progress);
        }

        const itemProfile = serviceBookingProfile(item);
        await submitDashboardBooking({
          data: {
            bookingId,
            contactName: draft.contactName,
            contactEmail: draft.contactEmail,
            telephone: draft.telephone,
            practiceName: itemProfile.needsPractice ? draft.practiceName : "",
            bookingDates: itemProfile.needsPreferredDates ? bookingDates : "",
            bookingTime: itemProfile.needsPreferredDates ? draft.bookingTime : "",
            delegates: itemProfile.needsTeamDetails ? draft.delegates : "",
            bookingScope: itemProfile.scope,
            fulfilmentType: itemProfile.fulfilmentType,
            bookingDetails: bookingDetailsForItem(draft, itemProfile),
          },
        });

        delete progress[item.id];
        saveCheckoutProgress(progress);
        removeBookingCartItem(item.id);
      }

      clearCheckoutDraft();
      toast.success(
        cart.length === 1
          ? "Your booking request has been sent."
          : `${cart.length} booking requests have been sent.`,
      );
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "We could not complete the booking. Your remaining items are still saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const minimumDate = localDateInputValue(new Date());
  const totalWithVat = totals.subtotal + totals.vat;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Booking cart"
            title="Review once. Book everything smoothly."
            description="Your selections and booking details stay saved in this browser while you browse, sign in, or create an account."
          />
          <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { number: "1", label: "Review selections" },
              { number: "2", label: "Add booking details" },
              { number: "3", label: "Sign in & confirm" },
            ].map((step) => (
              <div
                key={step.number}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 shadow-soft"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full gradient-teal-purple text-sm font-extrabold text-white">
                  {step.number}
                </span>
                <span className="text-sm font-semibold">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-3xl shadow-soft">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-xl font-extrabold">Your selections</h2>
                    <p className="text-sm text-muted-foreground">
                      {itemCount} {itemCount === 1 ? "item" : "items"} saved
                    </p>
                  </div>
                  <ShoppingBag className="h-6 w-6 text-magenta" />
                </div>

                {!isHydrated ? (
                  <div className="grid min-h-48 place-items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-magenta" />
                  </div>
                ) : cart.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
                      <ShoppingBag className="h-6 w-6" />
                    </span>
                    <h2 className="mt-4 text-xl font-extrabold">Your booking cart is empty</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                      Add individual services from pricing, choose a ready-made package, or create a
                      bespoke package with the calculator.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button asChild className="rounded-full gradient-purple-orange text-white">
                        <Link to="/pricing">Browse pricing</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full border-2">
                        <Link to="/packages">View packages</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-full border-2">
                        <Link to="/build-your-package" search={{ selection: undefined }}>
                          Build Your own Package
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {cart.map((item) => (
                      <li key={item.id} className="p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold">{item.serviceLabel}</h3>
                              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold capitalize text-muted-foreground">
                                {sourceLabel(item.serviceSource)}
                              </span>
                            </div>
                            {item.packageSummary ? (
                              <details className="mt-2 text-sm text-muted-foreground">
                                <summary className="cursor-pointer font-semibold text-magenta">
                                  View selection details
                                </summary>
                                <div className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap rounded-2xl bg-muted/50 p-3 text-xs leading-5">
                                  {item.packageSummary}
                                </div>
                              </details>
                            ) : null}
                          </div>
                          <div className="flex items-center justify-between gap-4 sm:justify-end">
                            {cartItemAllowsQuantity(item) ? (
                              <div className="flex items-center rounded-full border border-border">
                                <button
                                  type="button"
                                  aria-label={`Decrease ${item.serviceLabel} quantity`}
                                  className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                                  onClick={() =>
                                    updateBookingCartQuantity(item.id, item.quantity - 1)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Increase ${item.serviceLabel} quantity`}
                                  className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                                  onClick={() =>
                                    updateBookingCartQuantity(item.id, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            ) : null}
                            <div className="min-w-20 text-right">
                              <div className="font-extrabold text-magenta">
                                {item.unitPrice === null
                                  ? "Quote"
                                  : formatGBP((item.unitPrice + item.vatAmount) * item.quantity)}
                              </div>
                              {item.vatAmount > 0 ? (
                                <div className="text-[10px] text-muted-foreground">inc. VAT</div>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove ${item.serviceLabel}`}
                              className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeBookingCartItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {cart.length > 0 ? (
              <form id="booking-checkout-form" onSubmit={confirmBooking}>
                <Card className="rounded-3xl shadow-soft">
                  <CardContent className="p-5 sm:p-7">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-purple-orange text-white">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-extrabold">Booking details</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          These details apply to every item in this booking cart and are saved
                          automatically.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <CheckoutField label="Full name" id="contact-name">
                        <Input
                          id="contact-name"
                          autoComplete="name"
                          value={draft.contactName}
                          onChange={(event) => updateDraft({ contactName: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      <CheckoutField label="Email address" id="contact-email">
                        <Input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          value={draft.contactEmail}
                          onChange={(event) => updateDraft({ contactEmail: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      <CheckoutField label="Telephone" id="telephone">
                        <Input
                          id="telephone"
                          type="tel"
                          autoComplete="tel"
                          value={draft.telephone}
                          onChange={(event) => updateDraft({ telephone: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      <CheckoutField
                        label="Your role"
                        id="contact-role"
                        optional={!bookingProfile.needsPractice}
                      >
                        <Input
                          id="contact-role"
                          placeholder="Practice manager, principal dentist, owner..."
                          value={draft.contactRole}
                          onChange={(event) => updateDraft({ contactRole: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      <CheckoutField
                        label="Practice or business name"
                        id="practice-name"
                        optional={!bookingProfile.needsPractice}
                      >
                        <Input
                          id="practice-name"
                          autoComplete="organization"
                          value={draft.practiceName}
                          onChange={(event) => updateDraft({ practiceName: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      {bookingProfile.needsPractice ? (
                        <>
                          <CheckoutField label="UK nation" id="practice-nation">
                            <select
                              id="practice-nation"
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                              value={draft.practiceNation}
                              onChange={(event) =>
                                updateDraft({ practiceNation: event.target.value })
                              }
                              disabled={isSubmitting}
                            >
                              <option value="">Select one</option>
                              <option value="england">England</option>
                              <option value="scotland">Scotland</option>
                              <option value="wales">Wales</option>
                              <option value="northern-ireland">Northern Ireland</option>
                            </select>
                          </CheckoutField>
                          <CheckoutField
                            label="Practice legal structure"
                            id="practice-type"
                            optional
                          >
                            <Input
                              id="practice-type"
                              placeholder="Limited company, partnership, sole trader..."
                              value={draft.practiceType}
                              onChange={(event) =>
                                updateDraft({ practiceType: event.target.value })
                              }
                              disabled={isSubmitting}
                            />
                          </CheckoutField>
                        </>
                      ) : null}
                    </div>

                    {bookingProfile.needsSiteAddress ? (
                      <div className="mt-6">
                        <h3 className="font-bold">Service location</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Use the exact dental-practice site where the visit or covered service
                          applies. Each additional site should be booked separately.
                        </p>
                        <AddressFields
                          prefix="site"
                          values={{
                            line1: draft.addressLine1,
                            line2: draft.addressLine2,
                            townCity: draft.townCity,
                            county: draft.county,
                            postcode: draft.postcode,
                          }}
                          disabled={isSubmitting}
                          onChange={(patch) =>
                            updateDraft({
                              addressLine1: patch.line1 ?? draft.addressLine1,
                              addressLine2: patch.line2 ?? draft.addressLine2,
                              townCity: patch.townCity ?? draft.townCity,
                              county: patch.county ?? draft.county,
                              postcode: patch.postcode ?? draft.postcode,
                            })
                          }
                        />
                      </div>
                    ) : null}

                    {bookingProfile.needsDeliveryAddress ? (
                      <div className="mt-6">
                        <h3 className="font-bold">Delivery details</h3>
                        <div className="mt-3">
                          <CheckoutField label="Recipient name" id="delivery-name">
                            <Input
                              id="delivery-name"
                              value={draft.deliveryName}
                              onChange={(event) =>
                                updateDraft({ deliveryName: event.target.value })
                              }
                              disabled={isSubmitting}
                            />
                          </CheckoutField>
                        </div>
                        <AddressFields
                          prefix="delivery"
                          values={{
                            line1: draft.deliveryAddressLine1,
                            line2: draft.deliveryAddressLine2,
                            townCity: draft.deliveryTownCity,
                            county: draft.deliveryCounty,
                            postcode: draft.deliveryPostcode,
                          }}
                          disabled={isSubmitting}
                          onChange={(patch) =>
                            updateDraft({
                              deliveryAddressLine1: patch.line1 ?? draft.deliveryAddressLine1,
                              deliveryAddressLine2: patch.line2 ?? draft.deliveryAddressLine2,
                              deliveryTownCity: patch.townCity ?? draft.deliveryTownCity,
                              deliveryCounty: patch.county ?? draft.deliveryCounty,
                              deliveryPostcode: patch.postcode ?? draft.deliveryPostcode,
                            })
                          }
                        />
                      </div>
                    ) : null}

                    {bookingProfile.needsTeamDetails ? (
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <CheckoutField label="Number of delegates" id="delegates">
                          <Input
                            id="delegates"
                            type="number"
                            min={1}
                            value={draft.delegates}
                            onChange={(event) => updateDraft({ delegates: event.target.value })}
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                        <CheckoutField label="Total practice team size" id="team-size" optional>
                          <Input
                            id="team-size"
                            type="number"
                            min={1}
                            value={draft.teamSize}
                            onChange={(event) => updateDraft({ teamSize: event.target.value })}
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                        <CheckoutField label="Preferred delivery" id="delivery-mode" optional>
                          <Input
                            id="delivery-mode"
                            placeholder="In-practice, online, or flexible"
                            value={draft.deliveryMode}
                            onChange={(event) => updateDraft({ deliveryMode: event.target.value })}
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                      </div>
                    ) : null}

                    {bookingProfile.needsEquipmentDetails ? (
                      <div className="mt-6">
                        <CheckoutField
                          label="Equipment and quantities at this site"
                          id="equipment-summary"
                          optional
                        >
                          <Textarea
                            id="equipment-summary"
                            placeholder="For example: 2 autoclaves, 1 compressor, 84 PAT items, 14 emergency lights, 8 extinguishers..."
                            value={draft.equipmentSummary}
                            onChange={(event) =>
                              updateDraft({ equipmentSummary: event.target.value })
                            }
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                      </div>
                    ) : null}

                    {bookingProfile.needsRadiationDetails ? (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <CheckoutField label="Number of dental X-ray units" id="xray-count">
                          <Input
                            id="xray-count"
                            type="number"
                            min={1}
                            value={draft.xrayEquipmentCount}
                            onChange={(event) =>
                              updateDraft({ xrayEquipmentCount: event.target.value })
                            }
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                        <CheckoutField
                          label="Current RPA expiry or start date"
                          id="rpa-expiry"
                          optional
                        >
                          <Input
                            id="rpa-expiry"
                            type="date"
                            value={draft.currentRpaExpiry}
                            onChange={(event) =>
                              updateDraft({ currentRpaExpiry: event.target.value })
                            }
                            disabled={isSubmitting}
                          />
                        </CheckoutField>
                      </div>
                    ) : null}

                    {requiresAppointment ? (
                      <>
                        <div className="mt-6">
                          <h3 className="font-bold">Preferred appointment options</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Add up to three suitable dates. Resource-only items do not use these
                            appointment details.
                          </p>
                          <div className="mt-3 grid gap-4 sm:grid-cols-3">
                            <CheckoutField label="First choice" id="first-date">
                              <Input
                                id="first-date"
                                type="date"
                                min={minimumDate}
                                value={draft.firstDate}
                                onChange={(event) => updateDraft({ firstDate: event.target.value })}
                                disabled={isSubmitting}
                              />
                            </CheckoutField>
                            <CheckoutField label="Second choice" id="second-date" optional>
                              <Input
                                id="second-date"
                                type="date"
                                min={minimumDate}
                                value={draft.secondDate}
                                onChange={(event) =>
                                  updateDraft({ secondDate: event.target.value })
                                }
                                disabled={isSubmitting}
                              />
                            </CheckoutField>
                            <CheckoutField label="Third choice" id="third-date" optional>
                              <Input
                                id="third-date"
                                type="date"
                                min={minimumDate}
                                value={draft.thirdDate}
                                onChange={(event) => updateDraft({ thirdDate: event.target.value })}
                                disabled={isSubmitting}
                              />
                            </CheckoutField>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4">
                          <CheckoutField label="Preferred time" id="booking-time">
                            <Input
                              id="booking-time"
                              placeholder="Morning, afternoon, or 10:00–13:00"
                              value={draft.bookingTime}
                              onChange={(event) => updateDraft({ bookingTime: event.target.value })}
                              disabled={isSubmitting}
                            />
                          </CheckoutField>
                        </div>
                      </>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-teal/25 bg-teal/5 p-4 text-sm">
                        <div className="font-semibold">No appointment details needed</div>
                        <p className="mt-1 text-muted-foreground">
                          Your cart only contains compliance resources, so you can continue without
                          selecting dates or times.
                        </p>
                      </div>
                    )}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <CheckoutField
                        label="Site access or parking notes"
                        id="access-notes"
                        optional
                      >
                        <Textarea
                          id="access-notes"
                          value={draft.accessNotes}
                          onChange={(event) => updateDraft({ accessNotes: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                      <CheckoutField
                        label="Accessibility or reasonable adjustments"
                        id="accessibility-needs"
                        optional
                      >
                        <Textarea
                          id="accessibility-needs"
                          value={draft.accessibilityNeeds}
                          onChange={(event) =>
                            updateDraft({ accessibilityNeeds: event.target.value })
                          }
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                    </div>
                    <div className="mt-4">
                      <CheckoutField
                        label="Anything else we should know"
                        id="additional-notes"
                        optional
                      >
                        <Textarea
                          id="additional-notes"
                          value={draft.additionalNotes}
                          onChange={(event) => updateDraft({ additionalNotes: event.target.value })}
                          disabled={isSubmitting}
                        />
                      </CheckoutField>
                    </div>
                    <label className="mt-5 flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                      <Checkbox
                        checked={draft.privacyAccepted}
                        onCheckedChange={(checked) =>
                          updateDraft({ privacyAccepted: checked === true })
                        }
                        disabled={isSubmitting}
                      />
                      <span>
                        I confirm these details are accurate and may be used to arrange, deliver,
                        evidence and manage the selected compliance services.
                      </span>
                    </label>
                  </CardContent>
                </Card>
              </form>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden rounded-3xl shadow-card">
              <div className="gradient-teal-purple p-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Booking summary
                </div>
                <div className="mt-2 text-3xl font-extrabold">
                  {totals.hasQuoteOnlyItem && totalWithVat === 0
                    ? "Quote required"
                    : formatGBP(totalWithVat)}
                </div>
                <div className="mt-1 text-xs text-white/80">
                  {totals.hasQuoteOnlyItem
                    ? "Final pricing will be confirmed for quote-only items."
                    : "Estimated total, including VAT where applicable."}
                </div>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-semibold">{itemCount}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatGBP(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">VAT</span>
                    <span className="font-semibold">{formatGBP(totals.vat)}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex items-start gap-3">
                    {user ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    ) : (
                      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-magenta" />
                    )}
                    <div>
                      <div className="text-sm font-bold">
                        {isCheckingAuth
                          ? "Checking your account…"
                          : user
                            ? `Signed in as ${user.name}`
                            : "Sign in only when you are ready"}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="booking-checkout-form"
                  disabled={cart.length === 0 || isSubmitting || isCheckingAuth}
                  className="h-12 w-full rounded-full gradient-purple-orange text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Confirming booking…
                    </>
                  ) : user ? (
                    <>
                      Confirm booking <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Continue securely <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button asChild variant="ghost" className="w-full rounded-full">
                  <Link to="/pricing">
                    <ArrowLeft className="h-4 w-4" /> Continue browsing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function CheckoutField({
  label,
  id,
  optional = false,
  children,
}: {
  label: string;
  id: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
        ) : (
          <span className="text-magenta"> *</span>
        )}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function AddressFields({
  prefix,
  values,
  disabled,
  onChange,
}: {
  prefix: string;
  values: {
    line1: string;
    line2: string;
    townCity: string;
    county: string;
    postcode: string;
  };
  disabled: boolean;
  onChange: (patch: Partial<typeof values>) => void;
}) {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <CheckoutField label="Address line 1" id={`${prefix}-address-1`}>
          <Input
            id={`${prefix}-address-1`}
            autoComplete={prefix === "delivery" ? "shipping address-line1" : "street-address"}
            value={values.line1}
            onChange={(event) => onChange({ line1: event.target.value })}
            disabled={disabled}
          />
        </CheckoutField>
      </div>
      <div className="sm:col-span-2">
        <CheckoutField label="Address line 2" id={`${prefix}-address-2`} optional>
          <Input
            id={`${prefix}-address-2`}
            value={values.line2}
            onChange={(event) => onChange({ line2: event.target.value })}
            disabled={disabled}
          />
        </CheckoutField>
      </div>
      <CheckoutField label="Town or city" id={`${prefix}-town`}>
        <Input
          id={`${prefix}-town`}
          autoComplete={prefix === "delivery" ? "shipping address-level2" : "address-level2"}
          value={values.townCity}
          onChange={(event) => onChange({ townCity: event.target.value })}
          disabled={disabled}
        />
      </CheckoutField>
      <CheckoutField label="County" id={`${prefix}-county`} optional>
        <Input
          id={`${prefix}-county`}
          value={values.county}
          onChange={(event) => onChange({ county: event.target.value })}
          disabled={disabled}
        />
      </CheckoutField>
      <CheckoutField label="Postcode" id={`${prefix}-postcode`}>
        <Input
          id={`${prefix}-postcode`}
          autoComplete={prefix === "delivery" ? "shipping postal-code" : "postal-code"}
          value={values.postcode}
          onChange={(event) => onChange({ postcode: event.target.value.toUpperCase() })}
          disabled={disabled}
        />
      </CheckoutField>
    </div>
  );
}

function buildInboundCartItem(input: {
  search: BookSearch;
  packages: PackageCardContent[];
  priceItems: typeof ITEMS;
}): Omit<BookingCartItem, "id" | "addedAt"> | null {
  if (input.search.selection) {
    const decoded = decodeSelection(input.search.selection);
    const lines = selectionToLines(decoded, input.priceItems);
    if (lines.length === 0) {
      return null;
    }

    return {
      serviceKey: "custom-package",
      serviceLabel: "Custom compliance package",
      serviceSource: "build-your-package",
      paymentLink: "/build-your-package",
      packageSelection: input.search.selection,
      packageSummary: selectionSummary(decoded, input.priceItems),
      unitPrice: lines.reduce((sum, line) => sum + line.subTotal, 0),
      vatAmount: lines.reduce((sum, line) => sum + line.vat, 0),
      quantity: 1,
    };
  }

  if (input.search.package) {
    const selectedPackage = input.packages.find((item) => item.id === input.search.package);
    if (!selectedPackage) {
      return null;
    }

    return {
      serviceKey: selectedPackage.id,
      serviceLabel: selectedPackage.name,
      serviceSource: "packages",
      paymentLink: "/packages",
      packageSelection: selectedPackage.id,
      packageSummary: `${selectedPackage.name}\n${selectedPackage.tagline}\nPrice: £${selectedPackage.price}`,
      unitPrice: Number(selectedPackage.price),
      vatAmount: 0,
      quantity: 1,
    };
  }

  if (input.search.service) {
    const service = getBookingService(input.search.service);
    if (!service) {
      return null;
    }

    return {
      serviceKey: service.value,
      serviceLabel: service.label,
      serviceSource: sourceFromPaymentLink(service.paymentLink),
      paymentLink: service.paymentLink,
      packageSelection: "",
      packageSummary: "",
      unitPrice: null,
      vatAmount: 0,
      quantity: 1,
    };
  }

  return null;
}

function selectionForSubmission(item: BookingCartItem, priceItems: typeof ITEMS) {
  let packageSelection = item.packageSelection;
  let packageSummary = item.packageSummary;

  if (item.quantity > 1 && item.serviceSource === "pricing") {
    const selection = decodeSelection(item.packageSelection);
    const multiplied = Object.fromEntries(
      Object.entries(selection).map(([key, quantity]) => [key, quantity * item.quantity]),
    );
    packageSelection = encodeURIComponent(JSON.stringify(multiplied));
    packageSummary = selectionSummary(multiplied, priceItems);
  } else if (item.quantity > 1) {
    packageSummary = `${item.packageSummary}\nQuantity: ${item.quantity}`.trim();
  }

  return {
    serviceKey: item.serviceKey,
    serviceLabel: item.quantity > 1 ? `${item.serviceLabel} × ${item.quantity}` : item.serviceLabel,
    serviceSource: item.serviceSource,
    paymentLink: item.paymentLink,
    packageSelection,
    packageSummary,
  };
}

function sourceFromPaymentLink(paymentLink: string) {
  if (paymentLink.includes("pricing")) return "pricing";
  if (paymentLink.includes("packages")) return "packages";
  if (paymentLink.includes("build-your-package")) return "build-your-package";
  return "direct";
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    pricing: "Individual service",
    "build-your-package": "Custom package",
    packages: "Ready-made package",
    resources: "Compliance resource",
    direct: "Consultation",
  };

  return labels[source] ?? source;
}

function bookingDetailsForItem(
  draft: BookingCheckoutDraft,
  profile: ReturnType<typeof serviceBookingProfile>,
) {
  return {
    contactRole: draft.contactRole,
    practiceType: draft.practiceType,
    practiceNation: draft.practiceNation,
    siteAddress: profile.needsSiteAddress
      ? {
          line1: draft.addressLine1,
          line2: draft.addressLine2,
          townCity: draft.townCity,
          county: draft.county,
          postcode: draft.postcode,
        }
      : null,
    deliveryAddress: profile.needsDeliveryAddress
      ? {
          recipient: draft.deliveryName,
          line1: draft.deliveryAddressLine1,
          line2: draft.deliveryAddressLine2,
          townCity: draft.deliveryTownCity,
          county: draft.deliveryCounty,
          postcode: draft.deliveryPostcode,
        }
      : null,
    teamSize: profile.needsTeamDetails ? draft.teamSize : null,
    delegates: profile.needsTeamDetails ? draft.delegates : null,
    requestedDeliveryMode: profile.needsTeamDetails ? draft.deliveryMode : null,
    equipmentSummary: profile.needsEquipmentDetails ? draft.equipmentSummary : null,
    xrayEquipmentCount: profile.needsRadiationDetails ? draft.xrayEquipmentCount : null,
    currentRpaExpiry: profile.needsRadiationDetails ? draft.currentRpaExpiry : null,
    accessNotes: draft.accessNotes,
    accessibilityNeeds: draft.accessibilityNeeds,
    additionalNotes: draft.additionalNotes,
    privacyAcceptedAt: new Date().toISOString(),
  };
}

function cartItemAllowsQuantity(item: BookingCartItem) {
  return (
    item.serviceSource === "resources" ||
    item.serviceKey === "d365-pat" ||
    item.serviceKey.endsWith("-extra")
  );
}

function localDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
