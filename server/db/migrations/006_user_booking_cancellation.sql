alter type user_booking_status add value if not exists 'cancelled';

alter table user_booking_requests
  add column if not exists cancelled_at timestamptz;
