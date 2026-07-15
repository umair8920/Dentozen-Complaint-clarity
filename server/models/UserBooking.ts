import { query } from "../db/pool";

export type UserBookingStatus = "selected" | "booked" | "cancelled";

export type UserBookingRecord = {
  id: string;
  user_id: string;
  service_key: string;
  service_label: string;
  service_source: string;
  payment_link: string;
  package_selection: string;
  package_summary: string;
  status: UserBookingStatus;
  contact_name: string | null;
  contact_email: string | null;
  telephone: string | null;
  practice_name: string | null;
  booking_dates: string | null;
  booking_time: string | null;
  delegates: string | null;
  submitted_at: Date | null;
  cancelled_at: Date | null;
  assigned_trainer_id: string | null;
  assigned_at: Date | null;
  assignment_method: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateUserBookingInput = {
  userId: string;
  serviceKey: string;
  serviceLabel: string;
  serviceSource?: string;
  paymentLink?: string;
  packageSelection?: string;
  packageSummary?: string;
};

export type SubmitUserBookingInput = {
  id: string;
  userId: string;
  contactName: string;
  contactEmail: string;
  telephone: string;
  practiceName: string;
  bookingDates: string;
  bookingTime: string;
  delegates?: string;
  assignedTrainerId?: string | null;
  assignmentMethod?: string | null;
};

function toPublicBooking(booking: UserBookingRecord) {
  return {
    id: booking.id,
    serviceKey: booking.service_key,
    serviceLabel: booking.service_label,
    serviceSource: booking.service_source,
    paymentLink: booking.payment_link,
    packageSelection: booking.package_selection,
    packageSummary: booking.package_summary,
    status: booking.status,
    contactName: booking.contact_name,
    contactEmail: booking.contact_email,
    telephone: booking.telephone,
    practiceName: booking.practice_name,
    bookingDates: booking.booking_dates,
    bookingTime: booking.booking_time,
    delegates: booking.delegates,
    submittedAt: booking.submitted_at?.toISOString() ?? null,
    cancelledAt: booking.cancelled_at?.toISOString() ?? null,
    assignedTrainerId: booking.assigned_trainer_id,
    assignedAt: booking.assigned_at?.toISOString() ?? null,
    assignmentMethod: booking.assignment_method,
    createdAt: booking.created_at.toISOString(),
  };
}

export const UserBookingModel = {
  toPublicBooking,

  async create(input: CreateUserBookingInput) {
    const result = await query<UserBookingRecord>(
      `insert into user_booking_requests
        (user_id, service_key, service_label, service_source, payment_link, package_selection, package_summary)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning *`,
      [
        input.userId,
        input.serviceKey,
        input.serviceLabel,
        input.serviceSource ?? "direct",
        input.paymentLink ?? "/book",
        input.packageSelection ?? "",
        input.packageSummary ?? "",
      ],
    );
    return result.rows[0];
  },

  async listByUser(userId: string) {
    const result = await query<UserBookingRecord>(
      `select * from user_booking_requests
       where user_id = $1
       order by created_at desc`,
      [userId],
    );
    return result.rows;
  },

  async findByIdForUser(id: string, userId: string) {
    const result = await query<UserBookingRecord>(
      `select * from user_booking_requests
       where id = $1 and user_id = $2
       limit 1`,
      [id, userId],
    );
    return result.rows[0] ?? null;
  },

  async submit(input: SubmitUserBookingInput) {
    const result = await query<UserBookingRecord>(
      `update user_booking_requests
       set status = 'booked',
           contact_name = $3,
           contact_email = $4,
           telephone = $5,
           practice_name = $6,
           booking_dates = $7,
           booking_time = $8,
           delegates = $9,
           assigned_trainer_id = $10,
           assigned_at = case when $10::uuid is null then assigned_at else now() end,
           assignment_method = $11,
           submitted_at = now(),
           updated_at = now()
       where id = $1 and user_id = $2
       returning *`,
      [
        input.id,
        input.userId,
        input.contactName,
        input.contactEmail,
        input.telephone,
        input.practiceName,
        input.bookingDates,
        input.bookingTime,
        input.delegates ?? "",
        input.assignedTrainerId ?? null,
        input.assignmentMethod ?? null,
      ],
    );
    return result.rows[0] ?? null;
  },

  async workloadByTrainerIds(trainerIds: string[]) {
    if (trainerIds.length === 0) {
      return new Map<string, number>();
    }

    const result = await query<{ assigned_trainer_id: string; total: string }>(
      `select assigned_trainer_id, count(*)::text as total
       from user_booking_requests
       where assigned_trainer_id = any($1::uuid[])
         and status = 'booked'
         and coalesce(submitted_at, created_at) >= now() - interval '90 days'
       group by assigned_trainer_id`,
      [trainerIds],
    );

    return new Map(result.rows.map((row) => [row.assigned_trainer_id, Number(row.total)]));
  },

  async listByTrainer(trainerId: string) {
    const result = await query<UserBookingRecord & { user_name: string; user_email: string }>(
      `select user_booking_requests.*, users.name as user_name, users.email as user_email
       from user_booking_requests
       join users on users.id = user_booking_requests.user_id
       where user_booking_requests.assigned_trainer_id = $1
         and user_booking_requests.status in ('booked', 'cancelled')
       order by user_booking_requests.submitted_at desc nulls last, user_booking_requests.created_at desc`,
      [trainerId],
    );

    return result.rows.map((booking) => ({
      ...toPublicBooking(booking),
      userName: booking.user_name,
      userEmail: booking.user_email,
    }));
  },

  async deletePending(id: string, userId: string) {
    const result = await query<UserBookingRecord>(
      `delete from user_booking_requests
       where id = $1 and user_id = $2 and status = 'selected'
       returning *`,
      [id, userId],
    );
    return result.rows[0] ?? null;
  },

  async cancelBooked(id: string, userId: string) {
    const result = await query<UserBookingRecord>(
      `update user_booking_requests
       set status = 'cancelled',
           cancelled_at = now(),
           updated_at = now()
       where id = $1 and user_id = $2 and status = 'booked'
       returning *`,
      [id, userId],
    );
    return result.rows[0] ?? null;
  },
};
