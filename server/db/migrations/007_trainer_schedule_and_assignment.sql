alter table user_booking_requests
  add column if not exists assigned_trainer_id uuid references users(id) on delete set null,
  add column if not exists assigned_at timestamptz,
  add column if not exists assignment_method text;

create index if not exists user_booking_requests_assigned_trainer_idx
  on user_booking_requests(assigned_trainer_id, status, submitted_at desc);

create table if not exists trainer_service_assignments (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references users(id) on delete cascade,
  service_key text not null,
  service_label text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trainer_id, service_key)
);

create table if not exists trainer_availability_rules (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references users(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  is_working boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trainer_id, weekday)
);

create table if not exists trainer_availability_slots (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references users(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_time < end_time)
);

create index if not exists trainer_availability_slots_trainer_weekday_idx
  on trainer_availability_slots(trainer_id, weekday, start_time);

create table if not exists trainer_holidays (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references users(id) on delete cascade,
  holiday_date date not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (trainer_id, holiday_date)
);
