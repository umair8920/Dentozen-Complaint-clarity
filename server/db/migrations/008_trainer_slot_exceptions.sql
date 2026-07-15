create table if not exists trainer_slot_exceptions (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references users(id) on delete cascade,
  slot_id uuid not null references trainer_availability_slots(id) on delete cascade,
  exception_date date not null,
  reason text not null default '',
  created_at timestamptz not null default now(),
  unique (trainer_id, slot_id, exception_date)
);

create index if not exists trainer_slot_exceptions_trainer_date_idx
  on trainer_slot_exceptions(trainer_id, exception_date);
