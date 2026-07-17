alter table user_booking_requests
  add column if not exists booking_reference text,
  add column if not exists booking_scope text not null default 'practice',
  add column if not exists fulfilment_type text not null default 'onsite',
  add column if not exists workflow_status text not null default 'selected',
  add column if not exists booking_details jsonb not null default '{}'::jsonb,
  add column if not exists preferred_dates date[] not null default '{}'::date[],
  add column if not exists confirmed_start timestamptz,
  add column if not exists confirmed_end timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists next_due_date date,
  add column if not exists certificate_sent_at timestamptz,
  add column if not exists supplier_name text,
  add column if not exists legacy_import jsonb not null default '{}'::jsonb;

update user_booking_requests
set booking_reference = 'CC-' || upper(substr(replace(id::text, '-', ''), 1, 10))
where booking_reference is null;

alter table user_booking_requests
  alter column booking_reference set default (
    'CC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
  ),
  alter column booking_reference set not null;

create unique index if not exists user_booking_requests_booking_reference_idx
  on user_booking_requests(booking_reference);

create index if not exists user_booking_requests_workflow_due_idx
  on user_booking_requests(workflow_status, next_due_date);

create index if not exists user_booking_requests_preferred_dates_idx
  on user_booking_requests using gin(preferred_dates);

update user_booking_requests
set
  workflow_status = case
    when status = 'selected' then 'selected'
    when status = 'cancelled' then 'cancelled'
    else 'submitted'
  end,
  preferred_dates = coalesce(
    (
      select array_agg(value::date order by ordinal)
      from unnest(string_to_array(coalesce(booking_dates, ''), ',')) with ordinality as dates(value, ordinal)
      where btrim(value) ~ '^\d{4}-\d{2}-\d{2}$'
    ),
    '{}'::date[]
  );

alter table user_booking_requests enable row level security;

comment on column user_booking_requests.workflow_status is
  'Operational lifecycle: selected, submitted, triage, quoted, confirmed, in_progress, completed, cancelled.';
comment on column user_booking_requests.booking_details is
  'Service-specific intake data such as site address, delegates, equipment counts, RPA details and access notes.';
comment on column user_booking_requests.legacy_import is
  'Raw source values and import provenance for spreadsheet/history migration without losing ambiguous data.';
