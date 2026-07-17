# Booking, Service Lifecycle, and Trainer Assignment Schema

> The current implementation also includes the structured lifecycle fields introduced in
> `014_booking_service_lifecycle.sql`. Preferred dates are customer options; confirmed appointment
> times are stored separately.

This document explains the database schema used when a user books an appointment and that appointment is assigned to a trainer.

The schema is built around five main areas:

1. Users and roles
2. User booking requests
3. Trainer service assignments
4. Trainer availability
5. Booking-to-trainer assignment flow

## 1. Users

All users, trainers, and admins are stored in the `users` table.

```sql
users
```

| Column          | Type          | Purpose                                                |
| --------------- | ------------- | ------------------------------------------------------ |
| `id`            | `uuid`        | Primary key for the user.                              |
| `email`         | `text`        | Unique email address used for login and communication. |
| `name`          | `text`        | User display name.                                     |
| `role`          | `user_role`   | Defines access level: `admin`, `trainer`, or `user`.   |
| `status`        | `text`        | Account state: `active` or `inactive`.                 |
| `password_hash` | `text`        | Password hash for email/password login.                |
| `google_id`     | `text`        | Google account identifier for Google login.            |
| `invited_at`    | `timestamptz` | When the user was invited by an admin.                 |
| `created_at`    | `timestamptz` | When the user record was created.                      |
| `updated_at`    | `timestamptz` | When the user record was last updated.                 |

### User Roles

| Role      | Meaning                                                            |
| --------- | ------------------------------------------------------------------ |
| `user`    | A customer who can select and book services.                       |
| `trainer` | A staff member who can receive assigned appointments.              |
| `admin`   | A staff member who can manage users, services, and system content. |

Only users with `role = 'trainer'` and `status = 'active'` are considered for automatic booking assignment.

## 2. Booking Requests

The main appointment table is:

```sql
user_booking_requests
```

This table stores both pending service selections and submitted appointments.

| Column                | Type                  | Purpose                                                                                          |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `id`                  | `uuid`                | Primary key for the booking request.                                                             |
| `user_id`             | `uuid`                | The customer who created the booking. References `users(id)`.                                    |
| `service_key`         | `text`                | Stable service identifier, for example `mock-inspection` or `training-session`.                  |
| `service_label`       | `text`                | Human-readable service name shown in the dashboard and emails.                                   |
| `service_source`      | `text`                | Where the booking came from, such as `direct`, `services`, `pricing`, or package flow.           |
| `payment_link`        | `text`                | Link used for payment or booking continuation. Defaults to `/book`.                              |
| `package_selection`   | `text`                | Raw package selection details, if the booking came from a package builder.                       |
| `package_summary`     | `text`                | Human-readable summary of selected package items.                                                |
| `status`              | `user_booking_status` | Current booking state: `selected`, `booked`, or `cancelled`.                                     |
| `contact_name`        | `text`                | Contact name entered during final booking.                                                       |
| `contact_email`       | `text`                | Contact email entered during final booking.                                                      |
| `telephone`           | `text`                | Contact phone number.                                                                            |
| `practice_name`       | `text`                | Practice or business name for the appointment.                                                   |
| `booking_dates`       | `text`                | Preferred appointment dates. The app currently stores these as comma-separated text.             |
| `booking_time`        | `text`                | Preferred appointment time.                                                                      |
| `delegates`           | `text`                | Number of delegates, mainly used for training sessions.                                          |
| `booking_reference`   | `text`                | Customer-facing unique reference such as `CC-12AB34CD56`.                                        |
| `booking_scope`       | `text`                | `individual`, `team`, `practice`, or `resource`.                                                 |
| `fulfilment_type`     | `text`                | `onsite`, `remote`, `delivery`, `subscription`, or `mixed`.                                      |
| `workflow_status`     | `text`                | Operational lifecycle from selection through completion/cancellation.                            |
| `booking_details`     | `jsonb`               | Structured service-specific intake such as addresses, assets, delegates, RPA details, and notes. |
| `preferred_dates`     | `date[]`              | Normalized customer date options retained alongside the legacy text field.                       |
| `confirmed_start`     | `timestamptz`         | Actual confirmed service/appointment start.                                                      |
| `confirmed_end`       | `timestamptz`         | Actual confirmed service/appointment end.                                                        |
| `completed_at`        | `timestamptz`         | When the service was completed.                                                                  |
| `next_due_date`       | `date`                | Next review, renewal, examination, or service date when known.                                   |
| `certificate_sent_at` | `timestamptz`         | When the resulting evidence/certificate was sent.                                                |
| `supplier_name`       | `text`                | Internal or external delivery partner.                                                           |
| `legacy_import`       | `jsonb`               | Raw spreadsheet/import values retained where source data is ambiguous.                           |
| `submitted_at`        | `timestamptz`         | When the user submitted the appointment form.                                                    |
| `cancelled_at`        | `timestamptz`         | When the booking was cancelled.                                                                  |
| `assigned_trainer_id` | `uuid`                | Trainer assigned to the booking. References `users(id)`.                                         |
| `assigned_at`         | `timestamptz`         | When the trainer was assigned.                                                                   |
| `assignment_method`   | `text`                | Explains how the trainer was selected.                                                           |
| `created_at`          | `timestamptz`         | When the booking row was created.                                                                |
| `updated_at`          | `timestamptz`         | When the booking row was last updated.                                                           |

### Booking Status

The enum `user_booking_status` has these values:

| Status      | Meaning                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| `selected`  | The user selected a service, but has not submitted appointment details yet.         |
| `booked`    | The user submitted appointment details and the system attempted trainer assignment. |
| `cancelled` | The user cancelled a booked appointment.                                            |

### Important Relationships

```text
users.id 1 -> many user_booking_requests.user_id
users.id 1 -> many user_booking_requests.assigned_trainer_id
```

A customer owns the booking through `user_id`.

A trainer is assigned through `assigned_trainer_id`.

If the customer account is deleted, their booking requests are deleted because `user_id` uses `on delete cascade`.

If the assigned trainer is deleted, the booking remains, but `assigned_trainer_id` becomes `null` because it uses `on delete set null`.

## 3. Trainer Service Assignments

The table below defines which trainers are preferred for which services:

```sql
trainer_service_assignments
```

| Column          | Type          | Purpose                                                                    |
| --------------- | ------------- | -------------------------------------------------------------------------- |
| `id`            | `uuid`        | Primary key for the assignment row.                                        |
| `trainer_id`    | `uuid`        | Trainer assigned to handle a service. References `users(id)`.              |
| `service_key`   | `text`        | Stable service identifier. Must match `user_booking_requests.service_key`. |
| `service_label` | `text`        | Human-readable service name.                                               |
| `active`        | `boolean`     | Whether this trainer can currently receive this service.                   |
| `created_at`    | `timestamptz` | When the assignment was created.                                           |
| `updated_at`    | `timestamptz` | When the assignment was last updated.                                      |

There is a unique rule on:

```text
(trainer_id, service_key)
```

This prevents duplicate service assignment rows for the same trainer and service.

### Relationship

```text
users.id 1 -> many trainer_service_assignments.trainer_id
trainer_service_assignments.service_key -> user_booking_requests.service_key
```

The `service_key` relationship is logical rather than a database foreign key. Both tables store the same service key text so the assignment service can match bookings to trainers.

## 4. Trainer Availability

Trainer availability is split into working days, time slots, holidays, and one-off slot exceptions.

### Trainer Availability Rules

```sql
trainer_availability_rules
```

This table says whether a trainer works on each weekday.

| Column       | Type          | Purpose                                               |
| ------------ | ------------- | ----------------------------------------------------- |
| `id`         | `uuid`        | Primary key.                                          |
| `trainer_id` | `uuid`        | Trainer this rule belongs to. References `users(id)`. |
| `weekday`    | `integer`     | Day of week, from `0` to `6`.                         |
| `is_working` | `boolean`     | Whether the trainer works that weekday.               |
| `created_at` | `timestamptz` | When the rule was created.                            |
| `updated_at` | `timestamptz` | When the rule was last updated.                       |

Weekday values:

| Value | Day       |
| ----- | --------- |
| `0`   | Sunday    |
| `1`   | Monday    |
| `2`   | Tuesday   |
| `3`   | Wednesday |
| `4`   | Thursday  |
| `5`   | Friday    |
| `6`   | Saturday  |

There is one rule per trainer per weekday:

```text
unique (trainer_id, weekday)
```

### Trainer Availability Slots

```sql
trainer_availability_slots
```

This table stores the actual time windows when the trainer can work.

| Column       | Type          | Purpose                                               |
| ------------ | ------------- | ----------------------------------------------------- |
| `id`         | `uuid`        | Primary key.                                          |
| `trainer_id` | `uuid`        | Trainer this slot belongs to. References `users(id)`. |
| `weekday`    | `integer`     | Day of week, from `0` to `6`.                         |
| `start_time` | `time`        | Slot start time.                                      |
| `end_time`   | `time`        | Slot end time.                                        |
| `created_at` | `timestamptz` | When the slot was created.                            |
| `updated_at` | `timestamptz` | When the slot was last updated.                       |

The database enforces:

```text
start_time < end_time
```

The application also prevents overlapping slots for the same trainer and weekday.

### Trainer Holidays

```sql
trainer_holidays
```

This table blocks a whole date for a trainer.

| Column         | Type          | Purpose                                             |
| -------------- | ------------- | --------------------------------------------------- |
| `id`           | `uuid`        | Primary key.                                        |
| `trainer_id`   | `uuid`        | Trainer taking the holiday. References `users(id)`. |
| `holiday_date` | `date`        | Date the trainer is unavailable.                    |
| `note`         | `text`        | Optional reason or note.                            |
| `created_at`   | `timestamptz` | When the holiday was added.                         |

There can only be one holiday record per trainer per date:

```text
unique (trainer_id, holiday_date)
```

### Trainer Slot Exceptions

```sql
trainer_slot_exceptions
```

This table blocks one normal availability slot on a specific date.

| Column           | Type          | Purpose                                                                       |
| ---------------- | ------------- | ----------------------------------------------------------------------------- |
| `id`             | `uuid`        | Primary key.                                                                  |
| `trainer_id`     | `uuid`        | Trainer this exception belongs to. References `users(id)`.                    |
| `slot_id`        | `uuid`        | Availability slot being blocked. References `trainer_availability_slots(id)`. |
| `exception_date` | `date`        | Date when this slot is unavailable.                                           |
| `reason`         | `text`        | Optional reason.                                                              |
| `created_at`     | `timestamptz` | When the exception was added.                                                 |

There can only be one exception per trainer, slot, and date:

```text
unique (trainer_id, slot_id, exception_date)
```

## 5. Complete Booking Flow

### Step 1: User Selects a Service

When a user selects a service, the app creates a row in `user_booking_requests` with:

```text
status = 'selected'
```

At this point the row contains service information, but not full appointment details.

Example fields saved:

```text
user_id
service_key
service_label
service_source
payment_link
package_selection
package_summary
status = selected
```

### Step 2: User Submits Appointment Details

When the user completes the booking form, the app updates the same row.

It saves:

```text
contact_name
contact_email
telephone
practice_name
booking_dates
booking_time
delegates
submitted_at
```

The booking status changes to:

```text
status = 'booked'
```

### Step 3: System Finds Candidate Trainers

The assignment service first loads active trainers:

```sql
select *
from users
where role = 'trainer'
  and status = 'active'
order by created_at asc;
```

If there are no active trainers, the booking is still submitted, but:

```text
assigned_trainer_id = null
assignment_method = null
```

### Step 4: Assignment Rules Are Applied

The trainer assignment logic works like this:

| Situation                                                            | Result                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------ |
| No active trainers exist                                             | No trainer is assigned.                                      |
| Exactly one active trainer exists                                    | That trainer is assigned automatically.                      |
| Multiple active trainers exist and service-specific matches exist    | The system only considers trainers assigned to that service. |
| Multiple active trainers exist and no service-specific matches exist | The system considers all active trainers.                    |

Service-specific matches come from:

```sql
trainer_service_assignments
```

Only rows where `active = true` are used.

### Step 5: Least-Busy Trainer Is Selected

When there is more than one candidate trainer, the system checks workload over the last 90 days.

Workload is counted from booked appointments:

```sql
select assigned_trainer_id, count(*) as total
from user_booking_requests
where assigned_trainer_id = any(candidate_trainer_ids)
  and status = 'booked'
  and coalesce(submitted_at, created_at) >= now() - interval '90 days'
group by assigned_trainer_id;
```

The trainer with the lowest count is selected.

### Step 6: Assignment Is Saved on the Booking

The booking row is updated with:

```text
assigned_trainer_id
assigned_at
assignment_method
```

Possible `assignment_method` values:

| Method                     | Meaning                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `single_trainer_auto`      | Only one active trainer existed, so the system assigned that trainer.                                                  |
| `service_match_least_busy` | Multiple trainers existed, service-specific trainer matches existed, and the least-busy matching trainer was selected. |
| `fallback_least_busy`      | Multiple trainers existed, no service-specific match existed, and the least-busy active trainer was selected.          |
| `null`                     | No trainer was available for assignment.                                                                               |

## 6. Cancellation Flow

A user can cancel a booked appointment only if:

1. The booking exists.
2. The booking belongs to the user.
3. The booking status is `booked`.
4. The appointment date can be understood from `booking_dates` and `booking_time`.
5. At least 72 hours remain before the appointment start time.

When cancelled, the booking is updated:

```text
status = 'cancelled'
cancelled_at = now()
updated_at = now()
```

The trainer assignment remains on the row so trainer dashboards can still show cancelled appointments.

## 7. Entity Relationship Summary

```text
users
  id
  role: admin | trainer | user
  status: active | inactive

user_booking_requests
  user_id             -> users.id
  assigned_trainer_id -> users.id
  service_key
  status: selected | booked | cancelled

trainer_service_assignments
  trainer_id  -> users.id
  service_key -> matches user_booking_requests.service_key

trainer_availability_rules
  trainer_id -> users.id

trainer_availability_slots
  trainer_id -> users.id

trainer_holidays
  trainer_id -> users.id

trainer_slot_exceptions
  trainer_id -> users.id
  slot_id    -> trainer_availability_slots.id
```

## 8. Practical Example

Suppose a user books `Basic Life Support Training`.

1. The user selects the service.
2. A `user_booking_requests` row is created with `status = 'selected'`.
3. The user enters practice name, preferred dates, preferred time, and delegates.
4. The booking is submitted and status becomes `booked`.
5. The system checks active trainers.
6. The system checks `trainer_service_assignments` for trainers assigned to the selected `service_key`.
7. If multiple trainers match, the system chooses the one with the lowest number of booked appointments in the last 90 days.
8. The booking stores the selected trainer in `assigned_trainer_id`.
9. The trainer sees the appointment in their dashboard because it is assigned to them.

## 9. Notes for Future Improvements

The current schema works, but these improvements may be useful later:

| Area                     | Suggested Improvement                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Booking dates            | Replace comma-separated `booking_dates` text with a child table like `booking_preferred_dates`.                              |
| Booking time             | Store preferred time as a real `time` column instead of text.                                                                |
| Appointment confirmation | Add a confirmed appointment date/time once admin or trainer confirms one of the preferred options.                           |
| Assignment history       | Add `booking_assignment_history` if reassignment auditing is needed.                                                         |
| Availability enforcement | Use availability tables during automatic assignment if the booking date/time should be matched to real trainer availability. |
| Service catalog          | Add a normalized `services` table if service keys need stronger referential integrity.                                       |
