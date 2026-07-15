do $$ begin
  create type user_booking_status as enum ('selected', 'booked');
exception
  when duplicate_object then null;
end $$;

create table if not exists user_booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  service_key text not null,
  service_label text not null,
  service_source text not null default 'direct',
  payment_link text not null default '/book',
  package_selection text not null default '',
  package_summary text not null default '',
  status user_booking_status not null default 'selected',
  contact_name text,
  contact_email text,
  telephone text,
  practice_name text,
  booking_dates text,
  booking_time text,
  delegates text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_booking_requests_user_id_idx
  on user_booking_requests(user_id, created_at desc);

create index if not exists user_booking_requests_status_idx
  on user_booking_requests(status);
