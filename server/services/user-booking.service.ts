import { UserBookingModel } from "../models/UserBooking";
import { TrainerScheduleModel } from "../models/TrainerSchedule";
import { UserModel, type PublicUser } from "../models/User";

type CreateSelectionInput = {
  user: PublicUser;
  serviceKey: string;
  serviceLabel: string;
  serviceSource?: string;
  paymentLink?: string;
  packageSelection?: string;
  packageSummary?: string;
};

type SubmitBookingInput = {
  user: PublicUser;
  bookingId: string;
  contactName: string;
  contactEmail: string;
  telephone: string;
  practiceName: string;
  bookingDates: string;
  bookingTime: string;
  delegates?: string;
};

type BookingIdInput = {
  user: PublicUser;
  bookingId: string;
};

const CANCELLATION_WINDOW_MS = 72 * 60 * 60 * 1000;

function bookingStartDate(bookingDates: string | null, bookingTime: string | null) {
  const firstDate = bookingDates
    ?.split(",")
    .map((date) => date.trim())
    .find(Boolean);

  if (!firstDate) {
    return null;
  }

  const timeMatch = bookingTime?.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  const timePart = timeMatch ? `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}:00` : "00:00:00";
  const date = new Date(`${firstDate}T${timePart}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

async function assignTrainer(serviceKey: string) {
  const trainers = await UserModel.activeTrainers();
  if (trainers.length === 0) {
    return { trainerId: null, method: null };
  }

  if (trainers.length === 1) {
    return { trainerId: trainers[0].id, method: "single_trainer_auto" };
  }

  const assigned = await TrainerScheduleModel.assignmentsForService(serviceKey);
  const candidates = assigned.length
    ? trainers.filter((trainer) =>
        assigned.some((assignment) => assignment.trainer_id === trainer.id),
      )
    : trainers;
  const workload = await UserBookingModel.workloadByTrainerIds(
    candidates.map((trainer) => trainer.id),
  );
  const [leastBusy] = [...candidates].sort(
    (a, b) => (workload.get(a.id) ?? 0) - (workload.get(b.id) ?? 0),
  );

  return {
    trainerId: leastBusy?.id ?? null,
    method: assigned.length ? "service_match_least_busy" : "fallback_least_busy",
  };
}

export const UserBookingService = {
  async listForUser(user: PublicUser) {
    return (await UserBookingModel.listByUser(user.id)).map(UserBookingModel.toPublicBooking);
  },

  async createSelection(input: CreateSelectionInput) {
    const booking = await UserBookingModel.create({
      userId: input.user.id,
      serviceKey: input.serviceKey,
      serviceLabel: input.serviceLabel,
      serviceSource: input.serviceSource,
      paymentLink: input.paymentLink,
      packageSelection: input.packageSelection,
      packageSummary: input.packageSummary,
    });

    return UserBookingModel.toPublicBooking(booking);
  },

  async submit(input: SubmitBookingInput) {
    const existing = await UserBookingModel.findByIdForUser(input.bookingId, input.user.id);
    if (!existing) {
      throw new Error("Booking selection not found.");
    }
    if (existing.status !== "selected") {
      throw new Error("Booked appointments cannot be changed from the user dashboard.");
    }

    const assignment = await assignTrainer(existing.service_key);
    const booking = await UserBookingModel.submit({
      id: input.bookingId,
      userId: input.user.id,
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      telephone: input.telephone,
      practiceName: input.practiceName,
      bookingDates: input.bookingDates,
      bookingTime: input.bookingTime,
      delegates: input.delegates,
      assignedTrainerId: assignment.trainerId,
      assignmentMethod: assignment.method,
    });

    if (!booking) {
      throw new Error("Booking could not be submitted.");
    }

    const { sendBookingEmail } = await import("../../src/lib/email.server");
    const fullUser = await UserModel.findById(input.user.id);

    await sendBookingEmail({
      fullName: input.contactName || fullUser?.name || input.user.name,
      email: input.contactEmail || fullUser?.email || input.user.email,
      telephone: input.telephone,
      nameOfPractice: input.practiceName,
      serviceRequired: booking.service_label,
      bookingDates: input.bookingDates,
      bookingTime: input.bookingTime,
      delegates: input.delegates ?? "",
      paymentLink: booking.payment_link,
      packageSelection: booking.package_selection,
      packageSummary: booking.package_summary,
    });

    return UserBookingModel.toPublicBooking(booking);
  },

  async deletePending(input: BookingIdInput) {
    const existing = await UserBookingModel.findByIdForUser(input.bookingId, input.user.id);
    if (!existing) {
      throw new Error("Booking selection not found.");
    }
    if (existing.status !== "selected") {
      throw new Error("Only pending booking selections can be deleted.");
    }

    const deleted = await UserBookingModel.deletePending(input.bookingId, input.user.id);
    if (!deleted) {
      throw new Error("Booking selection could not be deleted.");
    }

    return { ok: true };
  },

  async cancelBooked(input: BookingIdInput) {
    const existing = await UserBookingModel.findByIdForUser(input.bookingId, input.user.id);
    if (!existing) {
      throw new Error("Booking not found.");
    }
    if (existing.status !== "booked") {
      throw new Error("Only booked appointments can be cancelled.");
    }

    const appointmentDate = bookingStartDate(existing.booking_dates, existing.booking_time);
    if (!appointmentDate) {
      throw new Error(
        "This booking cannot be cancelled online because the booking date is unclear.",
      );
    }

    const cancellationDeadline = appointmentDate.getTime() - CANCELLATION_WINDOW_MS;
    if (Date.now() >= cancellationDeadline) {
      throw new Error(
        "This appointment can no longer be cancelled online because less than 72 hours remain.",
      );
    }

    const cancelled = await UserBookingModel.cancelBooked(input.bookingId, input.user.id);
    if (!cancelled) {
      throw new Error("Booking could not be cancelled.");
    }

    return UserBookingModel.toPublicBooking(cancelled);
  },
};
