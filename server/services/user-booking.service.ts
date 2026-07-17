import { UserBookingModel, type BookingDetails } from "../models/UserBooking";
import { TrainerScheduleModel } from "../models/TrainerSchedule";
import { UserModel, type PublicUser } from "../models/User";
import { serviceBookingProfile, serviceNeedsTrainer } from "../../src/lib/service-booking";

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
  bookingScope?: "individual" | "team" | "practice" | "resource";
  fulfilmentType?: "onsite" | "remote" | "delivery" | "subscription" | "mixed";
  bookingDetails?: BookingDetails;
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

    const profile = serviceBookingProfile({
      serviceKey: existing.service_key,
      serviceSource: existing.service_source,
      packageSelection: existing.package_selection,
    });
    const preferredDates = input.bookingDates
      .split(",")
      .map((date) => date.trim())
      .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date));

    if (profile.needsPreferredDates && preferredDates.length === 0) {
      throw new Error("Choose at least one preferred date for this service.");
    }
    if (profile.needsPreferredDates && !input.bookingTime.trim()) {
      throw new Error("Choose a preferred time for this service.");
    }
    if (profile.needsTeamDetails && !input.delegates?.trim()) {
      throw new Error("Enter the number of delegates for this team training service.");
    }

    const assignment = serviceNeedsTrainer({
      serviceKey: existing.service_key,
      serviceSource: existing.service_source,
      packageSelection: existing.package_selection,
    })
      ? await assignTrainer(existing.service_key)
      : { trainerId: null, method: null };
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
      bookingScope: input.bookingScope ?? profile.scope,
      fulfilmentType: input.fulfilmentType ?? profile.fulfilmentType,
      bookingDetails: input.bookingDetails,
      preferredDates,
      assignedTrainerId: assignment.trainerId,
      assignmentMethod: assignment.method,
    });

    if (!booking) {
      throw new Error("Booking could not be submitted.");
    }

    const { sendBookingEmail } = await import("../../src/lib/email.server");
    const fullUser = await UserModel.findById(input.user.id);

    try {
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
        bookingReference: booking.booking_reference,
        bookingScope: booking.booking_scope,
        fulfilmentType: booking.fulfilment_type,
        bookingDetails: booking.booking_details,
      });
    } catch (error) {
      // The booking is already committed. Do not make a mail-provider outage look like a failed
      // booking and encourage the customer to submit a duplicate request.
      console.error("Booking email could not be sent.", error);
    }

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

    const appointmentDate =
      existing.confirmed_start ??
      (existing.workflow_status === "confirmed"
        ? bookingStartDate(existing.booking_dates, existing.booking_time)
        : null);
    if (!appointmentDate) {
      const cancelled = await UserBookingModel.cancelBooked(input.bookingId, input.user.id);
      if (!cancelled) {
        throw new Error("Booking could not be cancelled.");
      }
      return UserBookingModel.toPublicBooking(cancelled);
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
