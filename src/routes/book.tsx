import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/SectionHeading";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBookingSelection } from "@/lib/api/user-bookings.functions";
import { getCurrentUser } from "@/lib/api/auth.functions";
import { getPublicServiceItems } from "@/lib/api/service-content.functions";
import { getBookingService } from "@/lib/booking";
import { decodeSelection, selectionSummary } from "@/lib/package-selection";
import { ITEMS } from "@/lib/pricing";
import { savePendingBookingSelection } from "@/lib/pending-booking";
import {
  toPackageCards,
  toPriceItems,
  toServiceCards,
  type PackageCardContent,
  type ServiceCardContent,
} from "@/lib/service-content";

type BookSearch = {
  service?: string;
  package?: string;
  selection?: string;
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    service: typeof search.service === "string" ? search.service : undefined,
    package: typeof search.package === "string" ? search.package : undefined,
    selection: typeof search.selection === "string" ? search.selection : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Continue Booking - SDC&T" },
      {
        name: "description",
        content:
          "Continue your selected dental compliance booking through the secure dashboard portal.",
      },
      { property: "og:title", content: "Continue Booking - SDC&T" },
      {
        property: "og:description",
        content: "Save your selected service or package and complete booking details securely.",
      },
      { property: "og:url", content: "/book" },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  loader: async () => {
    const [services, packages, builder] = await Promise.all([
      getPublicServiceItems({ data: { section: "services" } }),
      getPublicServiceItems({ data: { section: "packages" } }),
      getPublicServiceItems({ data: { section: "build-your-package" } }),
    ]);

    return { services: services.items, packages: packages.items, builder: builder.items };
  },
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { services, packages, builder } = Route.useLoaderData();
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const hasHandledSelection = useRef(false);

  const selection = useMemo(
    () =>
      buildPendingSelection({
        search,
        services: toServiceCards(services),
        packages: toPackageCards(packages),
        priceItems: toPriceItems(builder, ITEMS),
      }),
    [builder, packages, search, services],
  );

  useEffect(() => {
    async function handleBookingGate() {
      if (hasHandledSelection.current) {
        return;
      }
      hasHandledSelection.current = true;

      if (!selection) {
        setIsChecking(false);
        return;
      }

      try {
        setIsChecking(true);
        const current = await getCurrentUser();
        if (!current.user) {
          savePendingBookingSelection(selection);
          setIsAuthed(false);
          return;
        }

        if (current.user.role !== "user") {
          toast.error("Please use a user account to add bookings.");
          await navigate({ to: "/dashboard" });
          return;
        }

        setIsAuthed(true);
        setIsSaving(true);
        await createBookingSelection({ data: selection });
        toast.success("Selection added to your dashboard.");
        await navigate({ to: "/dashboard" });
      } catch (error) {
        savePendingBookingSelection(selection);
        toast.error(error instanceof Error ? error.message : "Please login to continue booking.");
        setIsAuthed(false);
      } finally {
        setIsChecking(false);
        setIsSaving(false);
      }
    }

    void handleBookingGate();
  }, [navigate, selection]);

  const saveAndContinue = () => {
    if (!selection) {
      return;
    }

    savePendingBookingSelection(selection);
  };

  return (
    <SiteLayout>
      <section className="bg-surface px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Secure booking portal"
            title="Continue your booking in the dashboard"
            description="Your selected service is saved to a secure account first. From there you can add practice details, choose preferred dates, and track booking history."
            center
          />
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-2xl shadow-soft">
            <CardContent className="p-6 sm:p-8">
              {selection ? (
                <>
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-teal-purple text-white">
                      {isChecking || isSaving ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : isAuthed ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <LockKeyhole className="h-6 w-6" />
                      )}
                    </span>
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight">
                        {selection.serviceLabel}
                      </h1>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Source: {sourceLabel(selection.serviceSource)}
                      </p>
                    </div>
                  </div>

                  {selection.packageSummary ? (
                    <div className="mt-6 whitespace-pre-wrap rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                      {selection.packageSummary}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                      This selection will appear in your dashboard as a pending booking.
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Choose a service first</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This page only continues a selected package, service, or calculator quote. Pick
                    one from the public pages and it will be added to your dashboard.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild className="rounded-full gradient-purple-orange text-white">
                      <Link to="/services">View services</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full border-2">
                      <Link to="/packages">View packages</Link>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full border-2">
                      <Link to="/build-your-package" search={{ selection: undefined }}>
                        Build package
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: UserPlus, label: "Login or signup" },
                  { icon: CalendarDays, label: "Choose dates" },
                  { icon: CheckCircle2, label: "Track history" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl gradient-purple-orange text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft">
            <CardContent className="p-6 sm:p-8">
              {!selection ? (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <CheckCircle2 className="mx-auto h-8 w-8 text-teal" />
                    <h2 className="mt-3 text-xl font-extrabold">No booking was created</h2>
                  </div>
                </div>
              ) : isChecking || isSaving ? (
                <div className="grid min-h-72 place-items-center text-center">
                  <div>
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-magenta" />
                    <p className="mt-3 text-sm font-semibold">
                      {isSaving ? "Adding this to your dashboard..." : "Checking your account..."}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-extrabold">Login required</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We saved your current selection in this browser. Login, signup, or continue with
                    Google and it will be added to your user dashboard automatically.
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button
                      asChild
                      className="w-full rounded-full gradient-purple-orange text-white"
                      onClick={saveAndContinue}
                    >
                      <Link to="/login">
                        Login <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full border-2"
                      onClick={saveAndContinue}
                    >
                      <Link to="/signup">
                        Create account <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}

function buildPendingSelection(input: {
  search: BookSearch;
  services: ServiceCardContent[];
  packages: PackageCardContent[];
  priceItems: typeof ITEMS;
}) {
  if (input.search.selection) {
    const decoded = decodeSelection(input.search.selection);
    if (Object.keys(decoded).length === 0) {
      return null;
    }

    return {
      serviceKey: "custom-package",
      serviceLabel: "Custom package",
      serviceSource: "build-your-package",
      paymentLink: "/build-your-package",
      packageSelection: input.search.selection,
      packageSummary: selectionSummary(decoded, input.priceItems),
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
      packageSelection: input.search.package,
      packageSummary: `${selectedPackage.name}\n${selectedPackage.tagline}\nPrice: £${selectedPackage.price}`,
    };
  }

  if (input.search.service) {
    const dbService = input.services.find((item) => item.bookingService === input.search.service);
    const staticService = getBookingService(input.search.service);
    if (!dbService && (!staticService || staticService.value === "other")) {
      return null;
    }

    const paymentLink = staticService?.paymentLink ?? "/services";
    return {
      serviceKey: input.search.service,
      serviceLabel: dbService?.title ?? staticService?.label ?? "Selected service",
      serviceSource: sourceFromPaymentLink(paymentLink),
      paymentLink,
      packageSelection: "",
      packageSummary: dbService?.body ?? "",
    };
  }

  return null;
}

function sourceFromPaymentLink(paymentLink: string) {
  if (paymentLink.includes("pricing")) return "pricing";
  if (paymentLink.includes("packages")) return "packages";
  if (paymentLink.includes("build-your-package")) return "build-your-package";
  if (paymentLink.includes("services")) return "services";
  return "direct";
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    services: "/services",
    pricing: "/pricing",
    "build-your-package": "/build-your-package",
    packages: "/packages",
    direct: "Direct booking",
  };

  return labels[source] ?? source;
}
