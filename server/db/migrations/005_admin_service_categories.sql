create table if not exists admin_service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_service_categories_name_not_blank check (length(btrim(name)) > 0)
);

create unique index if not exists admin_service_categories_name_unique_idx
  on admin_service_categories (lower(name));

create index if not exists admin_service_categories_order_idx
  on admin_service_categories (display_order, name);

with default_categories(name, display_order) as (
  values
    ('Packages', 10),
    ('Risk Assessments', 20),
    ('Training', 30),
    ('Direct 365 Services', 40),
    ('RPA', 50),
    ('Resources', 60)
)
insert into admin_service_categories (name, display_order)
select d.name, d.display_order
from default_categories d
where not exists (
  select 1
  from admin_service_categories c
  where lower(c.name) = lower(d.name)
);

with item_categories as (
  select
    metadata->>'category' as name,
    min(display_order) + 1000 as display_order
  from admin_service_items
  where section in ('pricing', 'build-your-package')
    and nullif(btrim(metadata->>'category'), '') is not null
  group by metadata->>'category'
)
insert into admin_service_categories (name, display_order)
select i.name, i.display_order
from item_categories i
where not exists (
  select 1
  from admin_service_categories c
  where lower(c.name) = lower(i.name)
);
