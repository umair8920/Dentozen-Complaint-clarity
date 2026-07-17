import { getCookie } from "@tanstack/start-server-core";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getEnv } from "../../../server/config/env";
import { getUserFromToken } from "../../../server/services/auth.service";

const bookingSelectionSchema = z.object({
  serviceKey: z.string().trim().min(1).max(120),
  serviceLabel: z.string().trim().min(1).max(255),
  serviceSource: z.string().trim().min(1).max(80).default("direct"),
  paymentLink: z.string().trim().min(1).max(255).default("/book"),
  packageSelection: z.string().trim().max(5000).default(""),
  packageSummary: z.string().trim().max(5000).default(""),
});

const bookingDetailScalarSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
const bookingDetailValueSchema = z.union([
  bookingDetailScalarSchema,
  z.record(z.string(), bookingDetailScalarSchema),
]);

const submitDashboardBookingSchema = z.object({
  bookingId: z.string().uuid(),
  contactName: z.string().trim().min(1, "Full name is required.").max(100),
  contactEmail: z.string().trim().email("Enter a valid email address.").max(255),
  telephone: z.string().trim().min(1, "Telephone is required.").max(40),
  practiceName: z.string().trim().max(150).default(""),
  bookingDates: z.string().trim().max(500).default(""),
  bookingTime: z.string().trim().max(120).default(""),
  delegates: z.string().trim().max(40).optional().or(z.literal("")),
  bookingScope: z.enum(["individual", "team", "practice", "resource"]).optional(),
  fulfilmentType: z.enum(["onsite", "remote", "delivery", "subscription", "mixed"]).optional(),
  bookingDetails: z.record(z.string(), bookingDetailValueSchema).optional().default({}),
});

const bookingIdSchema = z.object({
  bookingId: z.string().uuid(),
});

async function requireCurrentUser() {
  const user = await getUserFromToken(getCookie(getEnv().authCookieName));
  if (!user) {
    throw new Error("Please login to continue.");
  }
  if (user.role !== "user") {
    throw new Error("Bookings can only be added to a user dashboard.");
  }
  return user;
}

export const getUserBookings = createServerFn({ method: "GET" }).handler(async () => {
  const user = await requireCurrentUser();
  const { UserBookingService } = await import("../../../server/services/user-booking.service");
  return { bookings: await UserBookingService.listForUser(user) };
});

export const createBookingSelection = createServerFn({ method: "POST" })
  .validator(bookingSelectionSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser();
    const { UserBookingService } = await import("../../../server/services/user-booking.service");
    return { booking: await UserBookingService.createSelection({ user, ...data }) };
  });

export const submitDashboardBooking = createServerFn({ method: "POST" })
  .validator(submitDashboardBookingSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser();
    const { UserBookingService } = await import("../../../server/services/user-booking.service");
    return { booking: await UserBookingService.submit({ user, ...data }) };
  });

export const deletePendingBooking = createServerFn({ method: "POST" })
  .validator(bookingIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser();
    const { UserBookingService } = await import("../../../server/services/user-booking.service");
    return UserBookingService.deletePending({ user, bookingId: data.bookingId });
  });

export const cancelBookedAppointment = createServerFn({ method: "POST" })
  .validator(bookingIdSchema)
  .handler(async ({ data }) => {
    const user = await requireCurrentUser();
    const { UserBookingService } = await import("../../../server/services/user-booking.service");
    return { booking: await UserBookingService.cancelBooked({ user, bookingId: data.bookingId }) };
  });

export type PendingBookingSelection = z.infer<typeof bookingSelectionSchema>;
