import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Filter,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/AuthLayout";
import { AdminShell, type AdminNavItem } from "@/components/admin/AdminShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAdminOverview,
  getAdminServiceItems,
  getAdminUsers,
  createAdminServiceItem,
  deleteAdminServiceItem,
  inviteAdminUser,
  resendAdminInvite,
  updateAdminServiceItem,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUsersQueryInput,
  type ServiceSectionInput,
} from "@/lib/api/admin.functions";
import { getDashboard } from "@/lib/api/dashboard.functions";
import {
  cancelBookedAppointment,
  deletePendingBooking,
  getUserBookings,
  submitDashboardBooking,
} from "@/lib/api/user-bookings.functions";
import {
  createTrainerHoliday,
  createTrainerSlot,
  createTrainerSlotException,
  deleteTrainerHoliday,
  deleteTrainerSlot,
  deleteTrainerSlotException,
  getTrainerDashboard,
  setTrainerWorkingDay,
  updateTrainerSlot,
} from "@/lib/api/trainer.functions";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await getDashboard();
        if (!result.user || !result.dashboard) {
          await navigate({ to: "/login" });
          return;
        }
        setData(result);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Dashboard could not load.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadDashboard();
  }, [navigate]);

  if (isLoading || !data?.user || !data.dashboard) {
    return (
      <AuthLayout>
        <div className="grid min-h-[60vh] place-items-center px-4">
          <div className="text-center">
            <Activity className="mx-auto h-8 w-8 animate-pulse text-magenta" />
            <p className="mt-3 text-sm text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const { user } = data;

  if (user.role === "admin") {
    return <AdminDashboard admin={user} />;
  }

  if (user.role === "user") {
    return <UserDashboard user={user} />;
  }

  if (user.role === "trainer") {
    return <TrainerDashboard trainer={user} />;
  }

  return null;
}

type PublicUser = NonNullable<Awaited<ReturnType<typeof getDashboard>>["user"]>;
type UserBooking = Awaited<ReturnType<typeof getUserBookings>>["bookings"][number];

function UserDashboard({ user }: { user: PublicUser }) {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingForms, setBookingForms] = useState<
    Record<
      string,
      {
        contactName: string;
        contactEmail: string;
        telephone: string;
        practiceName: string;
        firstDate: string;
        secondDate: string;
        thirdDate: string;
        bookingTime: string;
        delegates: string;
      }
    >
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<UserBooking | null>(null);
  const [bookingAction, setBookingAction] = useState<{
    type: "delete" | "cancel";
    booking: UserBooking;
  } | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadBookings = async () => {
    const result = await getUserBookings();
    setBookings(result.bookings);
  };

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        await loadBookings();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Bookings could not load.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const pendingBookings = bookings.filter((booking) => booking.status === "selected");
  const bookedBookings = bookings.filter((booking) => booking.status === "booked");
  const stats = [
    { label: "Selected services", value: String(pendingBookings.length), icon: ShieldCheck },
    { label: "Booked appointments", value: String(bookedBookings.length), icon: CalendarDays },
    { label: "Service history", value: String(bookings.length), icon: Clock },
  ];

  const formForBooking = (booking: UserBooking) =>
    bookingForms[booking.id] ?? defaultBookingForm(user, booking);

  const updateBookingForm = (
    booking: UserBooking,
    patch: Partial<{
      contactName: string;
      contactEmail: string;
      telephone: string;
      practiceName: string;
      firstDate: string;
      secondDate: string;
      thirdDate: string;
      bookingTime: string;
      delegates: string;
    }>,
  ) => {
    setBookingForms((current) => ({
      ...current,
      [booking.id]: { ...defaultBookingForm(user, booking), ...current[booking.id], ...patch },
    }));
  };

  const onSubmitBooking = async (booking: UserBooking) => {
    const form = formForBooking(booking);
    const bookingDates = [form?.firstDate, form?.secondDate, form?.thirdDate]
      .filter(Boolean)
      .join(", ");

    try {
      setSubmittingId(booking.id);
      await submitDashboardBooking({
        data: {
          bookingId: booking.id,
          contactName: form?.contactName ?? user.name,
          contactEmail: form?.contactEmail ?? user.email,
          telephone: form?.telephone ?? "",
          practiceName: form?.practiceName ?? "",
          bookingDates,
          bookingTime: form?.bookingTime ?? "",
          delegates: form?.delegates ?? "",
        },
      });
      toast.success(booking.status === "booked" ? "Booking updated." : "Booking request sent.");
      await loadBookings();
      setEditingBooking(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking could not be submitted.");
    } finally {
      setSubmittingId(null);
    }
  };

  const onDeletePending = async (booking: UserBooking) => {
    try {
      setActionId(booking.id);
      await deletePendingBooking({ data: { bookingId: booking.id } });
      toast.success("Pending booking deleted.");
      setBookingAction(null);
      await loadBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking could not be deleted.");
    } finally {
      setActionId(null);
    }
  };

  const onCancelBooked = async (booking: UserBooking) => {
    try {
      setActionId(booking.id);
      await cancelBookedAppointment({ data: { bookingId: booking.id } });
      toast.success("Appointment cancelled.");
      setBookingAction(null);
      await loadBookings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Appointment could not be cancelled.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <AuthLayout>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ label, value, icon: Icon }, index) => (
              <Card key={label} className="rounded-2xl shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-gradient">{value}</span>
                    <span
                      className={[
                        "grid h-11 w-11 place-items-center rounded-xl text-white",
                        index === 0
                          ? "gradient-teal-purple"
                          : index === 1
                            ? "gradient-purple-orange"
                            : "gradient-orange-gold",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-2xl shadow-soft">
            <CardHeader>
              <CardTitle>Service booking history</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid min-h-40 place-items-center">
                  <Activity className="h-6 w-6 animate-pulse text-magenta" />
                </div>
              ) : bookings.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Preferred dates</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Practice</TableHead>
                      <TableHead>Selected</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.serviceLabel}</TableCell>
                        <TableCell>{sourceLabel(booking.serviceSource)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full capitalize">
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{booking.bookingDates ?? "Pending"}</TableCell>
                        <TableCell>{booking.bookingTime ?? "Pending"}</TableCell>
                        <TableCell>{booking.practiceName ?? "Pending"}</TableCell>
                        <TableCell>{formatDate(booking.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            {booking.status === "selected" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="rounded-full gradient-purple-orange text-white"
                                  onClick={() => setEditingBooking(booking)}
                                >
                                  Book now
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => setBookingAction({ type: "delete", booking })}
                                >
                                  Delete
                                </Button>
                              </>
                            ) : booking.status === "booked" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                                disabled={!canCancelBooking(booking)}
                                onClick={() => setBookingAction({ type: "cancel", booking })}
                              >
                                Cancel
                              </Button>
                            ) : (
                              <span className="text-sm text-muted-foreground">No action</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                  <p className="font-semibold">No services selected yet.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a service, package, or custom package from the public pages to start a
                    booking.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <BookingDetailsDialog
        user={user}
        booking={editingBooking}
        form={editingBooking ? formForBooking(editingBooking) : null}
        isSubmitting={Boolean(editingBooking && submittingId === editingBooking.id)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBooking(null);
          }
        }}
        onChange={(patch) => {
          if (editingBooking) {
            updateBookingForm(editingBooking, patch);
          }
        }}
        onSubmit={() => {
          if (editingBooking) {
            void onSubmitBooking(editingBooking);
          }
        }}
      />
      <AlertDialog
        open={Boolean(bookingAction)}
        onOpenChange={(open) => {
          if (!open && !actionId) {
            setBookingAction(null);
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bookingAction?.type === "delete" ? "Delete pending booking?" : "Cancel appointment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bookingAction?.type === "delete"
                ? `This will permanently delete "${bookingAction.booking.serviceLabel}" from your pending bookings.`
                : `This will cancel "${bookingAction?.booking.serviceLabel}" if more than 72 hours remain before the appointment.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(actionId)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={Boolean(actionId)}
              onClick={(event) => {
                event.preventDefault();
                if (!bookingAction) {
                  return;
                }
                if (bookingAction.type === "delete") {
                  void onDeletePending(bookingAction.booking);
                  return;
                }
                void onCancelBooked(bookingAction.booking);
              }}
              className={
                bookingAction?.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {actionId
                ? "Working..."
                : bookingAction?.type === "delete"
                  ? "Delete"
                  : "Cancel appointment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthLayout>
  );
}

type UserBookingForm = {
  contactName: string;
  contactEmail: string;
  telephone: string;
  practiceName: string;
  firstDate: string;
  secondDate: string;
  thirdDate: string;
  bookingTime: string;
  delegates: string;
};

function defaultBookingForm(user: PublicUser, booking?: UserBooking): UserBookingForm {
  const dates = splitBookingDates(booking?.bookingDates);
  return {
    contactName: booking?.contactName || user.name,
    contactEmail: booking?.contactEmail || user.email,
    telephone: booking?.telephone ?? "",
    practiceName: booking?.practiceName ?? "",
    firstDate: dates[0] ?? "",
    secondDate: dates[1] ?? "",
    thirdDate: dates[2] ?? "",
    bookingTime: booking?.bookingTime ?? "",
    delegates: booking?.delegates ?? "",
  };
}

function splitBookingDates(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((date) => date.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function firstBookingDate(booking: UserBooking) {
  const firstDate = splitBookingDates(booking.bookingDates)[0];
  if (!firstDate) {
    return null;
  }

  const timeMatch = booking.bookingTime?.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  const timePart = timeMatch ? `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}:00` : "00:00:00";
  const date = new Date(`${firstDate}T${timePart}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function canCancelBooking(booking: UserBooking) {
  const date = firstBookingDate(booking);
  if (!date) {
    return false;
  }

  return Date.now() < date.getTime() - 72 * 60 * 60 * 1000;
}

function BookingDetailsDialog({
  user,
  booking,
  form,
  isSubmitting,
  onOpenChange,
  onChange,
  onSubmit,
}: {
  user: PublicUser;
  booking: UserBooking | null;
  form: UserBookingForm | null;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (patch: Partial<UserBookingForm>) => void;
  onSubmit: () => void;
}) {
  if (!booking || !form) {
    return null;
  }

  return (
    <Dialog open={Boolean(booking)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-magenta" />
            Book appointment
          </DialogTitle>
          <DialogDescription>
            {booking.serviceLabel} from {sourceLabel(booking.serviceSource)}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {booking.packageSummary ? (
            <div className="max-h-48 overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              {booking.packageSummary}
            </div>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${booking.id}-name`}>Full name</Label>
              <Input
                id={`${booking.id}-name`}
                className="mt-1"
                value={form.contactName}
                onChange={(event) => onChange({ contactName: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${booking.id}-email`}>Email address</Label>
              <Input
                id={`${booking.id}-email`}
                type="email"
                className="mt-1"
                value={form.contactEmail}
                onChange={(event) => onChange({ contactEmail: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${booking.id}-phone`}>Telephone</Label>
              <Input
                id={`${booking.id}-phone`}
                className="mt-1"
                value={form.telephone}
                onChange={(event) => onChange({ telephone: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${booking.id}-practice`}>Name of practice</Label>
              <Input
                id={`${booking.id}-practice`}
                className="mt-1"
                value={form.practiceName}
                onChange={(event) => onChange({ practiceName: event.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label htmlFor={`${booking.id}-date-1`}>Preferred date</Label>
              <Input
                id={`${booking.id}-date-1`}
                type="date"
                className="mt-1"
                value={form.firstDate}
                onChange={(event) => onChange({ firstDate: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${booking.id}-date-2`}>Second option</Label>
              <Input
                id={`${booking.id}-date-2`}
                type="date"
                className="mt-1"
                value={form.secondDate}
                onChange={(event) => onChange({ secondDate: event.target.value })}
              />
            </div>
            <div>
              <Label htmlFor={`${booking.id}-date-3`}>Third option</Label>
              <Input
                id={`${booking.id}-date-3`}
                type="date"
                className="mt-1"
                value={form.thirdDate}
                onChange={(event) => onChange({ thirdDate: event.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor={`${booking.id}-time`}>Preferred time</Label>
            <Input
              id={`${booking.id}-time`}
              className="mt-1"
              placeholder="Morning, afternoon, or 10:00 to 13:00"
              value={form.bookingTime}
              onChange={(event) => onChange({ bookingTime: event.target.value })}
            />
          </div>
          {booking.serviceKey === "training-session" ? (
            <div>
              <Label htmlFor={`${booking.id}-delegates`}>Number of delegates</Label>
              <Input
                id={`${booking.id}-delegates`}
                className="mt-1"
                inputMode="numeric"
                value={form.delegates}
                onChange={(event) => onChange({ delegates: event.target.value })}
              />
            </div>
          ) : null}
          <div className="rounded-2xl border border-border bg-background p-4 text-sm">
            <div className="font-semibold">{user.name}</div>
            <div className="mt-1 break-all text-muted-foreground">{user.email}</div>
          </div>
          <Button
            disabled={isSubmitting}
            className="w-full rounded-full gradient-purple-orange text-white sm:w-auto"
            onClick={onSubmit}
          >
            {isSubmitting ? "Saving..." : "Book appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    services: "/services",
    pricing: "/pricing",
    "build-your-package": "/build-your-package",
    packages: "/packages",
    direct: "Direct",
  };

  return labels[source] ?? source;
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function timeToMinutes(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function minutesToTime(totalMinutes: number) {
  const normalized = Math.max(0, Math.min(totalMinutes, 24 * 60 - 1));
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function suggestedNextSlot(slots: TrainerAvailability["slots"]) {
  if (slots.length === 0) {
    return { startTime: "09:00", endTime: "10:30" };
  }

  const latestSlot = [...slots].sort(
    (a, b) => timeToMinutes(b.endTime) - timeToMinutes(a.endTime),
  )[0];
  const duration = Math.max(
    15,
    timeToMinutes(latestSlot.endTime) - timeToMinutes(latestSlot.startTime),
  );
  const start = timeToMinutes(latestSlot.endTime) + 30;
  const end = start + duration;

  return {
    startTime: minutesToTime(start),
    endTime: minutesToTime(end),
  };
}

function calendarDaysForMonth(monthDate: Date) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const cursor = new Date(start);
  cursor.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() + index);
    return date;
  });
}

type TrainerTab = "dashboard" | "appointments" | "availability";
type TrainerDashboardData = Awaited<ReturnType<typeof getTrainerDashboard>>;
type TrainerAppointment = TrainerDashboardData["appointments"][number];
type TrainerAvailability = TrainerDashboardData["availability"];

const WEEKDAYS = [
  { value: 0, short: "Sun", label: "Sunday" },
  { value: 1, short: "Mon", label: "Monday" },
  { value: 2, short: "Tue", label: "Tuesday" },
  { value: 3, short: "Wed", label: "Wednesday" },
  { value: 4, short: "Thu", label: "Thursday" },
  { value: 5, short: "Fri", label: "Friday" },
  { value: 6, short: "Sat", label: "Saturday" },
];

const TRAINER_NAV_ITEMS: AdminNavItem<TrainerTab>[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
  { id: "availability", label: "Availability", icon: CalendarDays },
];

function TrainerDashboard({ trainer }: { trainer: PublicUser }) {
  const [activeTab, setActiveTab] = useState<TrainerTab>("dashboard");
  const [data, setData] = useState<TrainerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const loadTrainerData = async () => {
    const result = await getTrainerDashboard();
    setData(result);
  };

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        await loadTrainerData();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Trainer dashboard could not load.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const runScheduleAction = async (key: string, action: () => Promise<unknown>) => {
    try {
      setActionKey(key);
      await action();
      await loadTrainerData();
      toast.success("Schedule updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Schedule could not be updated.");
    } finally {
      setActionKey(null);
    }
  };

  return (
    <AdminShell
      admin={trainer}
      activeTab={activeTab}
      title={
        activeTab === "dashboard"
          ? "Trainer Overview"
          : activeTab === "appointments"
            ? "Appointments"
            : "Availability"
      }
      sectionLabel="Trainer"
      navItems={TRAINER_NAV_ITEMS}
      onTabChange={setActiveTab}
    >
      {isLoading || !data ? (
        <div className="grid min-h-[50vh] place-items-center">
          <Activity className="h-8 w-8 animate-pulse text-magenta" />
        </div>
      ) : activeTab === "dashboard" ? (
        <TrainerOverview data={data} />
      ) : activeTab === "appointments" ? (
        <TrainerAppointments appointments={data.appointments} />
      ) : (
        <TrainerAvailabilityPanel
          availability={data.availability}
          actionKey={actionKey}
          onSetWorkingDay={(weekday, isWorking) =>
            runScheduleAction(`rule-${weekday}`, () =>
              setTrainerWorkingDay({ data: { weekday, isWorking } }),
            )
          }
          onCreateSlot={(weekday, startTime, endTime) =>
            runScheduleAction(`slot-${weekday}`, () =>
              createTrainerSlot({ data: { weekday, startTime, endTime } }),
            )
          }
          onUpdateSlot={(slotId, startTime, endTime) =>
            runScheduleAction(`update-slot-${slotId}`, () =>
              updateTrainerSlot({ data: { slotId, startTime, endTime } }),
            )
          }
          onDeleteSlot={(slotId) =>
            runScheduleAction(`delete-slot-${slotId}`, () =>
              deleteTrainerSlot({ data: { slotId } }),
            )
          }
          onCreateHoliday={(date, note) =>
            runScheduleAction("holiday-create", () =>
              createTrainerHoliday({ data: { date, note } }),
            )
          }
          onDeleteHoliday={(holidayId) =>
            runScheduleAction(`delete-holiday-${holidayId}`, () =>
              deleteTrainerHoliday({ data: { holidayId } }),
            )
          }
          onCreateSlotException={(slotId, date, reason) =>
            runScheduleAction(`slot-exception-${slotId}-${date}`, () =>
              createTrainerSlotException({ data: { slotId, date, reason } }),
            )
          }
          onDeleteSlotException={(exceptionId) =>
            runScheduleAction(`delete-slot-exception-${exceptionId}`, () =>
              deleteTrainerSlotException({ data: { exceptionId } }),
            )
          }
        />
      )}
    </AdminShell>
  );
}

function TrainerOverview({ data }: { data: TrainerDashboardData }) {
  const booked = data.appointments.filter((appointment) => appointment.status === "booked");
  const cancelled = data.appointments.filter((appointment) => appointment.status === "cancelled");
  const workingDays = data.availability.rules.filter((rule) => rule.isWorking).length;
  const cards = [
    { label: "Booked appointments", value: booked.length, icon: CalendarCheck },
    { label: "Cancelled", value: cancelled.length, icon: CalendarOff },
    { label: "Working days", value: workingDays, icon: CalendarDays },
    { label: "Weekly slots", value: data.availability.slots.length, icon: Clock },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }, index) => (
          <Card key={label} className="rounded-2xl shadow-soft">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-gradient">{value}</p>
              </div>
              <span
                className={[
                  "grid h-12 w-12 place-items-center rounded-xl text-white",
                  index === 0
                    ? "gradient-teal-purple"
                    : index === 1
                      ? "gradient-purple-orange"
                      : "gradient-blue-teal",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <TrainerAppointments appointments={data.appointments.slice(0, 6)} compact />
    </div>
  );
}

function TrainerAppointments({
  appointments,
  compact = false,
}: {
  appointments: TrainerAppointment[];
  compact?: boolean;
}) {
  return (
    <Card className="rounded-2xl shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-magenta" />
          {compact ? "Recent appointments" : "Assigned appointments"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Practice</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="font-semibold">
                      {appointment.contactName || appointment.userName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {appointment.contactEmail || appointment.userEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{appointment.serviceLabel}</div>
                    <div className="text-xs text-muted-foreground">
                      {sourceLabel(appointment.serviceSource)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {splitBookingDates(appointment.bookingDates).join(", ") || "-"}
                  </TableCell>
                  <TableCell>{appointment.bookingTime || "-"}</TableCell>
                  <TableCell>{appointment.practiceName || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={[
                        "rounded-full capitalize",
                        appointment.status === "booked"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No appointments assigned yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function TrainerAvailabilityPanel({
  availability,
  actionKey,
  onSetWorkingDay,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot,
  onCreateHoliday,
  onDeleteHoliday,
  onCreateSlotException,
  onDeleteSlotException,
}: {
  availability: TrainerAvailability;
  actionKey: string | null;
  onSetWorkingDay: (weekday: number, isWorking: boolean) => Promise<void>;
  onCreateSlot: (weekday: number, startTime: string, endTime: string) => Promise<void>;
  onUpdateSlot: (slotId: string, startTime: string, endTime: string) => Promise<void>;
  onDeleteSlot: (slotId: string) => Promise<void>;
  onCreateHoliday: (date: string, note: string) => Promise<void>;
  onDeleteHoliday: (holidayId: string) => Promise<void>;
  onCreateSlotException: (slotId: string, date: string, reason: string) => Promise<void>;
  onDeleteSlotException: (exceptionId: string) => Promise<void>;
}) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [manageDay, setManageDay] = useState<number | null>(null);
  const [slotModal, setSlotModal] = useState<{
    date: string;
    label: string;
    slot: TrainerAvailability["slots"][number];
    exception: TrainerAvailability["exceptions"][number] | null;
  } | null>(null);
  const [exceptionReason, setExceptionReason] = useState("");

  const slotsByDay = WEEKDAYS.reduce<Record<number, TrainerAvailability["slots"]>>(
    (accumulator, day) => {
      accumulator[day.value] = availability.slots.filter((slot) => slot.weekday === day.value);
      return accumulator;
    },
    {},
  );

  const ruleForDay = (weekday: number) =>
    availability.rules.find((rule) => rule.weekday === weekday)?.isWorking ?? false;

  const monthDays = calendarDaysForMonth(visibleMonth);
  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(visibleMonth);

  const exceptionForSlotDate = (slotId: string, date: string) =>
    availability.exceptions.find(
      (exception) => exception.slotId === slotId && exception.date === date,
    ) ?? null;

  const openSlotModal = (
    event: React.MouseEvent,
    date: Date,
    slot: TrainerAvailability["slots"][number],
  ) => {
    event.stopPropagation();
    const key = dateKey(date);
    const label = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
    const exception = exceptionForSlotDate(slot.id, key);
    setExceptionReason(exception?.reason ?? "");
    setSlotModal({ date: key, label, slot, exception });
  };

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden rounded-2xl border-border bg-background shadow-soft">
        <CardHeader className="border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold sm:text-3xl">{monthLabel}</h2>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
                  onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border bg-background hover:bg-muted"
                  onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => {
                const nextToday = new Date();
                setVisibleMonth(new Date(nextToday.getFullYear(), nextToday.getMonth(), 1));
              }}
            >
              Today
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {WEEKDAYS.map((day) => {
              const isWorking = ruleForDay(day.value);

              return (
                <div key={day.value} className="space-y-2 px-2 py-3 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground sm:text-xs">
                    {day.short}
                  </div>
                  <div className="flex flex-col items-center gap-2 xl:flex-row xl:justify-center">
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={isWorking}
                        disabled={actionKey === `rule-${day.value}`}
                        onChange={(event) => onSetWorkingDay(day.value, event.target.checked)}
                      />
                      Active
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 rounded-full px-2 text-[11px]"
                      onClick={() => setManageDay(day.value)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add slot
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7">
            {monthDays.map((day) => {
              const key = dateKey(day);
              const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
              const isToday = key === dateKey(today);
              const isWorking = ruleForDay(day.getDay());
              const holiday = availability.holidays.find((item) => item.date === key);
              const slots = slotsByDay[day.getDay()] ?? [];
              const visibleSlots = isWorking && !holiday ? slots : [];

              return (
                <div
                  key={key}
                  className={[
                    "min-h-32 border-b border-r border-border p-2 sm:min-h-40 sm:p-3",
                    isOutsideMonth ? "bg-muted/20 text-muted-foreground/60" : "bg-background",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={[
                        "grid h-7 w-7 place-items-center rounded-full text-sm font-bold",
                        isToday ? "gradient-teal-purple text-white" : "",
                      ].join(" ")}
                    >
                      {day.getDate()}
                    </span>
                    {holiday ? (
                      <CalendarOff className="h-4 w-4 text-destructive" />
                    ) : isWorking ? (
                      <CalendarCheck className="h-4 w-4 text-emerald-600" />
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {holiday ? (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700">
                        {holiday.note || "Holiday"}
                      </div>
                    ) : visibleSlots.length ? (
                      visibleSlots.slice(0, 3).map((slot) => {
                        const exception = exceptionForSlotDate(slot.id, key);
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            className={[
                              "block w-full truncate rounded-lg border px-2 py-1.5 text-left text-xs font-semibold transition hover:shadow-sm",
                              exception
                                ? "border-amber-200 bg-amber-50 text-amber-700 line-through"
                                : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100",
                            ].join(" ")}
                            onClick={(event) => openSlotModal(event, day, slot)}
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        );
                      })
                    ) : (
                      <div
                        className={[
                          "rounded-lg border px-2 py-1.5 text-xs font-semibold",
                          isWorking
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-border bg-muted text-muted-foreground",
                        ].join(" ")}
                      >
                        {isWorking ? "No slots" : "Closed"}
                      </div>
                    )}
                    {!holiday && visibleSlots.length > 3 ? (
                      <div className="text-xs font-semibold text-muted-foreground">
                        +{visibleSlots.length - 3} more
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant={holiday ? "outline" : "ghost"}
                      size="sm"
                      className={[
                        "mt-2 h-7 w-full rounded-full px-2 text-[11px]",
                        holiday
                          ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700"
                          : "text-destructive hover:bg-destructive/10 hover:text-destructive",
                      ].join(" ")}
                      disabled={
                        holiday
                          ? actionKey === `delete-holiday-${holiday.id}`
                          : actionKey === "holiday-create"
                      }
                      onClick={() =>
                        holiday ? onDeleteHoliday(holiday.id) : onCreateHoliday(key, "Unavailable")
                      }
                    >
                      {holiday ? "Restore availability" : "Unavailable day"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        <Card className="rounded-2xl shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-magenta" />
              Assigned services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {availability.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-xl border border-border p-3 text-sm font-semibold"
              >
                {assignment.serviceLabel}
              </div>
            ))}
            {availability.assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No service-specific assignments yet. Current automatic assignment will still route
                bookings to the available trainer.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(slotModal)} onOpenChange={(open) => !open && setSlotModal(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {slotModal?.exception ? "Restore slot" : "Mark slot unavailable"}
            </DialogTitle>
            <DialogDescription>
              {slotModal?.label} - {slotModal?.slot.startTime} to {slotModal?.slot.endTime}
            </DialogDescription>
          </DialogHeader>
          {slotModal ? (
            <div className="space-y-4">
              {slotModal.exception ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  This slot is unavailable for this date.
                  {slotModal.exception.reason ? ` Reason: ${slotModal.exception.reason}` : ""}
                </div>
              ) : (
                <div>
                  <Label htmlFor="slot-exception-reason">Reason</Label>
                  <Input
                    id="slot-exception-reason"
                    className="mt-1"
                    value={exceptionReason}
                    onChange={(event) => setExceptionReason(event.target.value)}
                    placeholder="Training, personal leave, clinic conflict"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setSlotModal(null)}
                >
                  Cancel
                </Button>
                {slotModal.exception ? (
                  <Button
                    className="rounded-full gradient-teal-purple text-white"
                    disabled={actionKey === `delete-slot-exception-${slotModal.exception.id}`}
                    onClick={async () => {
                      await onDeleteSlotException(slotModal.exception!.id);
                      setSlotModal(null);
                    }}
                  >
                    Restore availability
                  </Button>
                ) : (
                  <Button
                    className="rounded-full gradient-purple-orange text-white"
                    disabled={actionKey === `slot-exception-${slotModal.slot.id}-${slotModal.date}`}
                    onClick={async () => {
                      await onCreateSlotException(
                        slotModal.slot.id,
                        slotModal.date,
                        exceptionReason,
                      );
                      setSlotModal(null);
                    }}
                  >
                    Mark unavailable
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <TrainerSlotManagerDialog
        weekday={manageDay}
        slots={manageDay == null ? [] : (slotsByDay[manageDay] ?? [])}
        actionKey={actionKey}
        onOpenChange={(open) => !open && setManageDay(null)}
        onCreateSlot={onCreateSlot}
        onUpdateSlot={onUpdateSlot}
        onDeleteSlot={onDeleteSlot}
      />
    </div>
  );
}

function TrainerSlotManagerDialog({
  weekday,
  slots,
  actionKey,
  onOpenChange,
  onCreateSlot,
  onUpdateSlot,
  onDeleteSlot,
}: {
  weekday: number | null;
  slots: TrainerAvailability["slots"];
  actionKey: string | null;
  onOpenChange: (open: boolean) => void;
  onCreateSlot: (weekday: number, startTime: string, endTime: string) => Promise<void>;
  onUpdateSlot: (slotId: string, startTime: string, endTime: string) => Promise<void>;
  onDeleteSlot: (slotId: string) => Promise<void>;
}) {
  const [newSlot, setNewSlot] = useState({ startTime: "09:00", endTime: "10:00" });
  const [slotEdits, setSlotEdits] = useState<
    Record<string, { startTime: string; endTime: string }>
  >({});
  const open = weekday != null;
  const day = weekday == null ? null : WEEKDAYS[weekday];

  useEffect(() => {
    setNewSlot(suggestedNextSlot(slots));
    setSlotEdits(
      Object.fromEntries(
        slots.map((slot) => [
          slot.id,
          {
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        ]),
      ),
    );
  }, [slots]);

  const submitCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (weekday == null) {
      return;
    }
    await onCreateSlot(weekday, newSlot.startTime, newSlot.endTime);
  };

  const submitUpdate = async (slot: TrainerAvailability["slots"][number]) => {
    const edit = slotEdits[slot.id] ?? {
      startTime: slot.startTime,
      endTime: slot.endTime,
    };
    await onUpdateSlot(slot.id, edit.startTime, edit.endTime);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{day ? `${day.label} slots` : "Slots"}</DialogTitle>
          <DialogDescription>
            Create, edit, or remove recurring slots for this calendar day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <h3 className="font-bold">Create slot</h3>
            <form className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={submitCreate}>
              <div>
                <Label htmlFor="new-slot-start">Start time</Label>
                <Input
                  id="new-slot-start"
                  type="time"
                  className="mt-1"
                  value={newSlot.startTime}
                  onChange={(event) => setNewSlot({ ...newSlot, startTime: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="new-slot-end">End time</Label>
                <Input
                  id="new-slot-end"
                  type="time"
                  className="mt-1"
                  value={newSlot.endTime}
                  onChange={(event) => setNewSlot({ ...newSlot, endTime: event.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="self-end rounded-full gradient-purple-orange text-white"
                disabled={weekday == null || actionKey === `slot-${weekday}`}
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold">Existing slots</h3>
            {slots.map((slot) => {
              const edit = slotEdits[slot.id] ?? {
                startTime: slot.startTime,
                endTime: slot.endTime,
              };

              return (
                <div key={slot.id} className="rounded-2xl border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
                    <div>
                      <Label htmlFor={`${slot.id}-start`}>Start time</Label>
                      <Input
                        id={`${slot.id}-start`}
                        type="time"
                        className="mt-1"
                        value={edit.startTime}
                        onChange={(event) =>
                          setSlotEdits((current) => ({
                            ...current,
                            [slot.id]: { ...edit, startTime: event.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${slot.id}-end`}>End time</Label>
                      <Input
                        id={`${slot.id}-end`}
                        type="time"
                        className="mt-1"
                        value={edit.endTime}
                        onChange={(event) =>
                          setSlotEdits((current) => ({
                            ...current,
                            [slot.id]: { ...edit, endTime: event.target.value },
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      disabled={actionKey === `update-slot-${slot.id}`}
                      onClick={() => submitUpdate(slot)}
                    >
                      <Edit className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={actionKey === `delete-slot-${slot.id}`}
                      onClick={() => onDeleteSlot(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
            {slots.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                No slots created for this day yet.
              </p>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type AdminTab = "dashboard" | "users" | "services";
type AdminUsersQuery = AdminUsersQueryInput;
type ServiceItem = Awaited<ReturnType<typeof getAdminServiceItems>>["items"][number];
const INITIAL_ADMIN_USERS_QUERY: AdminUsersQuery = {
  page: 1,
  pageSize: 15,
  search: "",
  role: "all",
  status: "all",
};
const ADMIN_NAV_ITEMS: AdminNavItem<AdminTab>[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "services", label: "Services", icon: Settings2 },
];
const SERVICE_SECTIONS: { id: ServiceSectionInput; label: string; route: string }[] = [
  { id: "services", label: "Services", route: "/services" },
  { id: "pricing", label: "Pricing", route: "/pricing" },
  { id: "build-your-package", label: "Build Package", route: "/build-your-package" },
  { id: "packages", label: "Packages", route: "/packages" },
];
const SERVICE_ICON_OPTIONS = [
  { value: "ClipboardCheck", label: "Checklist" },
  { value: "Building2", label: "Building" },
  { value: "Sparkles", label: "Managed service" },
  { value: "Stethoscope", label: "Clinical setup" },
  { value: "FileCheck2", label: "Registration" },
];
const GRADIENT_OPTIONS = [
  { value: "gradient-teal-purple", label: "Teal to purple" },
  { value: "gradient-purple-orange", label: "Purple to orange" },
  { value: "gradient-orange-gold", label: "Orange to gold" },
  { value: "gradient-blue-teal", label: "Blue to teal" },
];
const PRICING_CATEGORY_OPTIONS = [
  "Packages",
  "Risk Assessments",
  "Training",
  "Direct 365 Services",
  "RPA",
  "Resources",
];
const UNIT_OPTIONS = ["", "each", "month", "year", "item", "service"];

function AdminDashboard({ admin }: { admin: PublicUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getAdminOverview>> | null>(
    null,
  );
  const [usersData, setUsersData] = useState<Awaited<ReturnType<typeof getAdminUsers>> | null>(
    null,
  );
  const [serviceData, setServiceData] = useState<Awaited<
    ReturnType<typeof getAdminServiceItems>
  > | null>(null);
  const [query, setQuery] = useState<AdminUsersQuery>(INITIAL_ADMIN_USERS_QUERY);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "user" as PublicUser["role"] });
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);

  const loadOverview = async () => {
    const result = await getAdminOverview();
    setOverview(result);
  };

  const loadUsers = async (nextQuery = query) => {
    const result = await getAdminUsers({ data: nextQuery });
    setUsersData(result);
  };

  const loadServices = async () => {
    const result = await getAdminServiceItems({ data: {} });
    setServiceData(result);
  };

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const [overviewResult, usersResult, serviceResult] = await Promise.all([
          getAdminOverview(),
          getAdminUsers({ data: INITIAL_ADMIN_USERS_QUERY }),
          getAdminServiceItems({ data: {} }),
        ]);
        setOverview(overviewResult);
        setUsersData(usersResult);
        setServiceData(serviceResult);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Admin dashboard could not load.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const refreshAdminData = async (nextQuery = query) => {
    await Promise.all([loadOverview(), loadUsers(nextQuery)]);
  };

  const updateQuery = async (patch: Partial<AdminUsersQuery>) => {
    const nextQuery = { ...query, ...patch };
    setQuery(nextQuery);
    await loadUsers(nextQuery);
  };

  const onInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsInviting(true);
      await inviteAdminUser({ data: inviteForm });
      toast.success("Invite sent.");
      setInviteOpen(false);
      setInviteForm({ email: "", role: "user" });
      await refreshAdminData({ ...query, page: 1 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invite could not be sent.");
    } finally {
      setIsInviting(false);
    }
  };

  const onRoleChange = async (userId: string, role: PublicUser["role"]) => {
    try {
      await updateAdminUserRole({ data: { userId, role } });
      toast.success("Role updated.");
      await refreshAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Role could not be updated.");
    }
  };

  const onStatusChange = async (userId: string, status: PublicUser["status"]) => {
    try {
      await updateAdminUserStatus({ data: { userId, status } });
      toast.success(status === "active" ? "User activated." : "User inactivated.");
      await refreshAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Status could not be updated.");
    }
  };

  const onResendInvite = async (userId: string) => {
    try {
      await resendAdminInvite({ data: { userId } });
      toast.success("Invite resent.");
      await refreshAdminData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invite could not be resent.");
    }
  };

  return (
    <AdminShell
      admin={admin}
      activeTab={activeTab}
      title={
        activeTab === "dashboard"
          ? "Analytics"
          : activeTab === "users"
            ? "User Management"
            : "Services"
      }
      navItems={ADMIN_NAV_ITEMS}
      onTabChange={setActiveTab}
    >
      {isLoading ? (
        <div className="grid min-h-[50vh] place-items-center">
          <Activity className="h-8 w-8 animate-pulse text-magenta" />
        </div>
      ) : activeTab === "dashboard" ? (
        <AdminAnalytics overview={overview} />
      ) : activeTab === "users" ? (
        <AdminUsers
          usersData={usersData}
          query={query}
          onQueryChange={updateQuery}
          onInviteOpen={() => setInviteOpen(true)}
          onRoleChange={onRoleChange}
          onStatusChange={onStatusChange}
          onResendInvite={onResendInvite}
        />
      ) : (
        <AdminServices serviceData={serviceData} onRefresh={loadServices} />
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Send a password setup link to a new admin, trainer, or user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onInvite} className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                className="mt-1"
                value={inviteForm.email}
                onChange={(event) => setInviteForm({ ...inviteForm, email: event.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={inviteForm.role}
                onChange={(event) =>
                  setInviteForm({ ...inviteForm, role: event.target.value as PublicUser["role"] })
                }
              >
                <option value="user">User</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={isInviting}
              className="w-full rounded-full gradient-purple-orange text-white"
            >
              {isInviting ? "Sending..." : "Send invite"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function AdminAnalytics({
  overview,
}: {
  overview: Awaited<ReturnType<typeof getAdminOverview>> | null;
}) {
  const stats = overview?.stats;
  const cards = [
    { label: "Users", value: stats?.totalUsers ?? 0, icon: Users },
    { label: "Trainers", value: stats?.trainers ?? 0, icon: ShieldCheck },
    { label: "Inactive", value: stats?.inactive ?? 0, icon: Activity },
    { label: "Pending Invites", value: stats?.pendingInvites ?? 0, icon: Mail },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }, index) => (
          <Card key={label} className="rounded-2xl shadow-soft">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-gradient">{value}</p>
              </div>
              <span
                className={[
                  "grid h-12 w-12 place-items-center rounded-xl text-white",
                  index === 0
                    ? "gradient-teal-purple"
                    : index === 1
                      ? "gradient-blue-teal"
                      : "gradient-purple-orange",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-magenta" />
            Recent new signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overview?.recentSignups.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminUsers({
  usersData,
  query,
  onQueryChange,
  onInviteOpen,
  onRoleChange,
  onStatusChange,
  onResendInvite,
}: {
  usersData: Awaited<ReturnType<typeof getAdminUsers>> | null;
  query: AdminUsersQuery;
  onQueryChange: (patch: Partial<AdminUsersQuery>) => Promise<void>;
  onInviteOpen: () => void;
  onRoleChange: (userId: string, role: PublicUser["role"]) => Promise<void>;
  onStatusChange: (userId: string, status: PublicUser["status"]) => Promise<void>;
  onResendInvite: (userId: string) => Promise<void>;
}) {
  const stats = usersData?.stats;
  const [resendingInviteId, setResendingInviteId] = useState<string | null>(null);

  const resendInvite = async (userId: string) => {
    try {
      setResendingInviteId(userId);
      await onResendInvite(userId);
    } finally {
      setResendingInviteId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Users", value: stats?.totalUsers ?? 0, icon: Users },
          { label: "Trainers", value: stats?.trainers ?? 0, icon: ShieldCheck },
          { label: "Inactive", value: stats?.inactive ?? 0, icon: Activity },
          { label: "Pending Invites", value: stats?.pendingInvites ?? 0, icon: Mail },
        ].map(({ label, value, icon: Icon }, index) => (
          <Card key={label} className="rounded-2xl shadow-soft">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-2 text-3xl font-extrabold text-gradient">{value}</p>
              </div>
              <span
                className={[
                  "grid h-12 w-12 place-items-center rounded-xl text-white",
                  index === 0
                    ? "gradient-teal-purple"
                    : index === 1
                      ? "gradient-blue-teal"
                      : "gradient-purple-orange",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-3 md:grid-cols-[1fr_160px_160px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query.search ?? ""}
                  onChange={(event) => void onQueryChange({ search: event.target.value, page: 1 })}
                  placeholder="Search users"
                  className="pl-9"
                />
              </div>
              <select
                value={query.role}
                onChange={(event) =>
                  void onQueryChange({
                    role: event.target.value as AdminUsersQuery["role"],
                    page: 1,
                  })
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All roles</option>
                <option value="admin">Admin</option>
                <option value="trainer">Trainer</option>
                <option value="user">User</option>
              </select>
              <select
                value={query.status}
                onChange={(event) =>
                  void onQueryChange({
                    status: event.target.value as AdminUsersQuery["status"],
                    page: 1,
                  })
                }
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                className="rounded-full gradient-purple-orange text-white"
                onClick={onInviteOpen}
              >
                <Plus className="h-4 w-4" />
                Create user
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-0">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-5">Account</TableHead>
                <TableHead className="w-[170px]">Role</TableHead>
                <TableHead className="w-[190px]">Account access</TableHead>
                <TableHead className="w-[260px]">Invite progress</TableHead>
                <TableHead className="w-[150px] pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersData?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full gradient-teal-purple text-sm font-bold text-white">
                        {userInitials(user)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{user.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      onChange={(event) =>
                        void onRoleChange(user.id, event.target.value as PublicUser["role"])
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize"
                    >
                      <option value="admin">Admin</option>
                      <option value="trainer">Trainer</option>
                      <option value="user">User</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-start gap-2">
                      <StatusBadge status={user.status} />
                      <Button
                        size="sm"
                        variant={user.status === "active" ? "outline" : "default"}
                        className={
                          user.status === "active"
                            ? "h-8 rounded-full border-2 px-3 text-xs"
                            : "h-8 rounded-full px-3 text-xs gradient-teal-purple text-white"
                        }
                        onClick={() =>
                          void onStatusChange(
                            user.id,
                            user.status === "active" ? "inactive" : "active",
                          )
                        }
                      >
                        {user.status === "active" ? "Inactivate" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <InviteStatusBadge user={user} />
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        {user.invitedAt ? <div>Sent: {formatDateTime(user.invitedAt)}</div> : null}
                        {user.inviteExpiresAt && user.inviteStatus !== "accepted" ? (
                          <div>Expires: {formatDateTime(user.inviteExpiresAt)}</div>
                        ) : null}
                        {user.inviteStatus === "accepted" ? <div>Password created</div> : null}
                        {user.inviteStatus === "not_invited" ? <div>No invite required</div> : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    {canResendInvite(user) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-full border-2 px-3 text-xs"
                        disabled={resendingInviteId === user.id}
                        onClick={() => void resendInvite(user.id)}
                      >
                        <Send className="h-3.5 w-3.5" />
                        {resendingInviteId === user.id ? "Sending..." : "Resend"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">No action</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {usersData?.pagination.page ?? 1} of {usersData?.pagination.totalPages ?? 1}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-full border-2"
                disabled={(usersData?.pagination.page ?? 1) <= 1}
                onClick={() => void onQueryChange({ page: Math.max(query.page - 1, 1) })}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-2"
                disabled={
                  (usersData?.pagination.page ?? 1) >= (usersData?.pagination.totalPages ?? 1)
                }
                onClick={() => void onQueryChange({ page: query.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: PublicUser["status"] }) {
  return (
    <Badge
      variant="outline"
      className={[
        "rounded-full capitalize",
        status === "active"
          ? "border-teal/30 bg-teal/10 text-teal"
          : "border-destructive/30 bg-destructive/10 text-destructive",
      ].join(" ")}
    >
      {status}
    </Badge>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function userInitials(user: Pick<PublicUser, "name" | "email">) {
  const source = user.name.trim() || user.email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function canResendInvite(user: PublicUser) {
  return user.inviteStatus === "pending" || user.inviteStatus === "expired";
}

function InviteStatusBadge({ user }: { user: PublicUser }) {
  const styles = {
    accepted: "border-teal/30 bg-teal/10 text-teal",
    pending: "border-gold/40 bg-gold/10 text-orange",
    expired: "border-destructive/30 bg-destructive/10 text-destructive",
    not_invited: "border-border bg-muted text-muted-foreground",
  } satisfies Record<PublicUser["inviteStatus"], string>;

  const labels = {
    accepted: "Accepted",
    pending: "Pending",
    expired: "Expired",
    not_invited: "Direct signup",
  } satisfies Record<PublicUser["inviteStatus"], string>;

  return (
    <Badge variant="outline" className={["rounded-full", styles[user.inviteStatus]].join(" ")}>
      {labels[user.inviteStatus]}
    </Badge>
  );
}

function AdminServices({
  serviceData,
  onRefresh,
}: {
  serviceData: Awaited<ReturnType<typeof getAdminServiceItems>> | null;
  onRefresh: () => Promise<void>;
}) {
  const [activeSection, setActiveSection] = useState<ServiceSectionInput>("services");
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    status: "active" as "active" | "draft",
    displayOrder: "0",
    itemId: "",
    icon: "FileCheck2",
    gradient: "gradient-teal-purple",
    cta: "",
    bookingService: "",
    badge: "",
    category: "Resources",
    unit: "",
    priceLabel: "",
    allowQuantity: false,
    exVat: false,
    tbd: false,
    tiered: false,
    tagline: "",
    popular: false,
    features: "",
    metadata: "{}",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isServicesSection = activeSection === "services";
  const isPricingLikeSection =
    activeSection === "pricing" || activeSection === "build-your-package";
  const isPackagesSection = activeSection === "packages";

  const parseMetadata = (metadataJson: string) =>
    JSON.parse(metadataJson.trim() || "{}") as Record<string, unknown>;

  const stringMetadata = (metadata: Record<string, unknown>, key: string, fallback = "") =>
    typeof metadata[key] === "string" ? metadata[key] : fallback;

  const booleanMetadata = (metadata: Record<string, unknown>, key: string) =>
    metadata[key] === true;

  const metadataFromForm = () => {
    const metadata = parseMetadata(form.metadata);
    const setString = (key: string, value: string) => {
      if (value.trim()) {
        metadata[key] = value.trim();
      } else {
        delete metadata[key];
      }
    };
    const setBoolean = (key: string, value: boolean) => {
      if (value) {
        metadata[key] = true;
      } else {
        delete metadata[key];
      }
    };

    setString("itemId", form.itemId);

    if (isServicesSection) {
      setString("icon", form.icon);
      setString("gradient", form.gradient);
      setString("cta", form.cta);
      setString("bookingService", form.bookingService);
      setString("badge", form.badge);
    }

    if (isPricingLikeSection) {
      setString("category", form.category);
      setString("unit", form.unit);
      setString("priceLabel", form.priceLabel);
      setBoolean("allowQuantity", form.allowQuantity);
      setBoolean("exVat", form.exVat);
      setBoolean("tbd", form.tbd);
      setBoolean("tiered", form.tiered);
    }

    if (isPackagesSection) {
      setString("tagline", form.tagline);
      setString("gradient", form.gradient);
      setBoolean("popular", form.popular);
      const features = form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean);
      if (features.length > 0) {
        metadata.features = features;
      } else {
        delete metadata.features;
      }
    }

    return metadata;
  };

  const openCreate = () => {
    setEditingItem(null);
    setForm({
      title: "",
      description: "",
      price: "",
      status: "active",
      displayOrder: "0",
      itemId: "",
      icon: "FileCheck2",
      gradient: "gradient-teal-purple",
      cta: "",
      bookingService: "",
      badge: "",
      category: activeSection === "build-your-package" ? "Packages" : "Resources",
      unit: "",
      priceLabel: "",
      allowQuantity: false,
      exVat: false,
      tbd: false,
      tiered: false,
      tagline: "",
      popular: false,
      features: "",
      metadata: JSON.stringify({ route: `/${activeSection}` }, null, 2),
    });
    setModalOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    const metadata = item.metadata;
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      price: item.price == null ? "" : String(item.price),
      status: item.status,
      displayOrder: String(item.displayOrder),
      itemId: stringMetadata(metadata, "itemId", item.contentKey ?? ""),
      icon: stringMetadata(metadata, "icon", "FileCheck2"),
      gradient: stringMetadata(metadata, "gradient", "gradient-teal-purple"),
      cta: stringMetadata(metadata, "cta"),
      bookingService: stringMetadata(metadata, "bookingService"),
      badge: stringMetadata(metadata, "badge"),
      category: stringMetadata(metadata, "category", "Resources"),
      unit: stringMetadata(metadata, "unit"),
      priceLabel: stringMetadata(metadata, "priceLabel"),
      allowQuantity: booleanMetadata(metadata, "allowQuantity"),
      exVat: booleanMetadata(metadata, "exVat"),
      tbd: booleanMetadata(metadata, "tbd"),
      tiered: booleanMetadata(metadata, "tiered"),
      tagline: stringMetadata(metadata, "tagline", item.description),
      popular: booleanMetadata(metadata, "popular"),
      features: Array.isArray(metadata.features)
        ? metadata.features.filter((feature) => typeof feature === "string").join("\n")
        : "",
      metadata: item.metadataJson,
    });
    setModalOpen(true);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let metadata: Record<string, unknown>;
    try {
      metadata = metadataFromForm();
    } catch {
      toast.error("Metadata must be valid JSON.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: form.price.trim() ? Number(form.price) : null,
      status: form.status,
      displayOrder: Number(form.displayOrder || 0),
      metadataJson: JSON.stringify(metadata, null, 2),
    };

    try {
      setIsSaving(true);
      if (editingItem) {
        await updateAdminServiceItem({ data: { id: editingItem.id, ...payload } });
        toast.success("Service item updated.");
      } else {
        await createAdminServiceItem({ data: { section: activeSection, ...payload } });
        toast.success("Service item created.");
      }
      setModalOpen(false);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Service item could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeletingId(deleteTarget.id);
      await deleteAdminServiceItem({ data: { id: deleteTarget.id } });
      toast.success("Service item deleted.");
      setDeleteTarget(null);
      await onRefresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Service item could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  const activeItems = serviceData?.items.filter((item) => item.section === activeSection) ?? [];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        {SERVICE_SECTIONS.map((section, index) => (
          <Card key={section.id} className="rounded-2xl shadow-soft">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{section.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-gradient">
                  {serviceData?.stats[section.id] ?? 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{section.route}</p>
              </div>
              <span
                className={[
                  "grid h-12 w-12 place-items-center rounded-xl text-white",
                  index === 0
                    ? "gradient-teal-purple"
                    : index === 1
                      ? "gradient-purple-orange"
                      : index === 2
                        ? "gradient-blue-teal"
                        : "gradient-orange-gold",
                ].join(" ")}
              >
                <Settings2 className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft">
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Editable route content</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage content shown for services, pricing, package builder and packages.
            </p>
          </div>
          <Button className="rounded-full gradient-purple-orange text-white" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Create new
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex gap-2 overflow-x-auto">
            {SERVICE_SECTIONS.map((section) => (
              <button
                key={section.id}
                className={[
                  "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
                  activeSection === section.id
                    ? "gradient-purple-orange text-white"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted",
                ].join(" ")}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-semibold">{item.title}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell>{item.price == null ? "-" : `£${item.price}`}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full capitalize">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.displayOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => openEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={deletingId === item.id}
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit item" : "Create new item"}</DialogTitle>
            <DialogDescription>
              Changes are saved in the database for the selected admin content section.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="service-title">Title</Label>
              <Input
                id="service-title"
                className="mt-1"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="service-description">Description</Label>
              <textarea
                id="service-description"
                className="mt-1 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="service-price">Price</Label>
                <Input
                  id="service-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1"
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: event.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="service-status">Status</Label>
                <select
                  id="service-status"
                  className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value as "active" | "draft" })
                  }
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <Label htmlFor="service-order">Order</Label>
                <Input
                  id="service-order"
                  type="number"
                  min="0"
                  className="mt-1"
                  value={form.displayOrder}
                  onChange={(event) => setForm({ ...form, displayOrder: event.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="service-item-id">Item ID</Label>
              <Input
                id="service-item-id"
                className="mt-1"
                placeholder="Example: due-diligence"
                value={form.itemId}
                onChange={(event) => setForm({ ...form, itemId: event.target.value })}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Stable internal name used by links and package selections.
              </p>
            </div>
            {isServicesSection && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div>
                  <h4 className="font-semibold">Service display settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Controls how this service card appears on the public services page.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="service-icon">Icon</Label>
                    <select
                      id="service-icon"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.icon}
                      onChange={(event) => setForm({ ...form, icon: event.target.value })}
                    >
                      {SERVICE_ICON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="service-gradient">Color style</Label>
                    <select
                      id="service-gradient"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.gradient}
                      onChange={(event) => setForm({ ...form, gradient: event.target.value })}
                    >
                      {GRADIENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="service-cta">Button text</Label>
                    <Input
                      id="service-cta"
                      className="mt-1"
                      placeholder="Example: Enquire about due diligence"
                      value={form.cta}
                      onChange={(event) => setForm({ ...form, cta: event.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-booking">Booking option</Label>
                    <Input
                      id="service-booking"
                      className="mt-1"
                      placeholder="Example: due-diligence"
                      value={form.bookingService}
                      onChange={(event) => setForm({ ...form, bookingService: event.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="service-badge">Badge</Label>
                    <Input
                      id="service-badge"
                      className="mt-1"
                      placeholder="Example: Fully managed subscription"
                      value={form.badge}
                      onChange={(event) => setForm({ ...form, badge: event.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
            {isPricingLikeSection && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div>
                  <h4 className="font-semibold">Pricing and calculator behavior</h4>
                  <p className="text-xs text-muted-foreground">
                    Controls where this item appears and how price/quantity are handled.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="service-category">Category</Label>
                    <select
                      id="service-category"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.category}
                      onChange={(event) => setForm({ ...form, category: event.target.value })}
                    >
                      {PRICING_CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="service-unit">Unit</Label>
                    <select
                      id="service-unit"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.unit}
                      onChange={(event) => setForm({ ...form, unit: event.target.value })}
                    >
                      {UNIT_OPTIONS.map((unit) => (
                        <option key={unit || "none"} value={unit}>
                          {unit || "None"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="service-price-label">Price label override</Label>
                    <Input
                      id="service-price-label"
                      className="mt-1"
                      placeholder="Example: £30/mo"
                      value={form.priceLabel}
                      onChange={(event) => setForm({ ...form, priceLabel: event.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-magenta"
                      checked={form.allowQuantity}
                      onChange={(event) =>
                        setForm({ ...form, allowQuantity: event.target.checked })
                      }
                    />
                    Allow quantity
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-magenta"
                      checked={form.exVat}
                      onChange={(event) => setForm({ ...form, exVat: event.target.checked })}
                    />
                    Price is +VAT
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-magenta"
                      checked={form.tbd}
                      onChange={(event) => setForm({ ...form, tbd: event.target.checked })}
                    />
                    Show as [PRICE]
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-magenta"
                      checked={form.tiered}
                      onChange={(event) => setForm({ ...form, tiered: event.target.checked })}
                    />
                    Tiered pricing
                  </label>
                </div>
              </div>
            )}
            {isPackagesSection && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <div>
                  <h4 className="font-semibold">Package display settings</h4>
                  <p className="text-xs text-muted-foreground">
                    Controls the package card, badge, and feature list.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="package-gradient">Color style</Label>
                    <select
                      id="package-gradient"
                      className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={form.gradient}
                      onChange={(event) => setForm({ ...form, gradient: event.target.value })}
                    >
                      {GRADIENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm sm:mt-6">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-magenta"
                      checked={form.popular}
                      onChange={(event) => setForm({ ...form, popular: event.target.checked })}
                    />
                    Mark as most popular
                  </label>
                  <div className="sm:col-span-2">
                    <Label htmlFor="package-tagline">Tagline</Label>
                    <Input
                      id="package-tagline"
                      className="mt-1"
                      value={form.tagline}
                      onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="package-features">Features</Label>
                    <textarea
                      id="package-features"
                      className="mt-1 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.features}
                      onChange={(event) => setForm({ ...form, features: event.target.value })}
                      placeholder="One feature per line"
                    />
                  </div>
                </div>
              </div>
            )}
            <details className="rounded-2xl border border-dashed border-border bg-background p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Advanced metadata JSON
              </summary>
              <p className="mt-2 text-xs text-muted-foreground">
                Use this only for custom fields. The friendly fields above will update the matching
                metadata keys when saved.
              </p>
              <textarea
                id="service-metadata"
                className="mt-3 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
                value={form.metadata}
                onChange={(event) => setForm({ ...form, metadata: event.target.value })}
              />
            </details>
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-full gradient-purple-orange text-white"
            >
              {isSaving ? "Saving..." : "Save item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <SharedDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete service content?"
        itemName={deleteTarget?.title ?? ""}
        isDeleting={Boolean(deleteTarget && deletingId === deleteTarget.id)}
        onOpenChange={(open) => {
          if (deletingId) {
            return;
          }
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void onDelete()}
      />
    </div>
  );
}

function SharedDeleteDialog({
  open,
  title,
  itemName,
  isDeleting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  itemName: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {itemName ? `"${itemName}"` : "this item"} from the
            database. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
