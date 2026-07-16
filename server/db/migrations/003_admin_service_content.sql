create table if not exists admin_service_items (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('pricing', 'build-your-package', 'packages')),
  title text not null,
  description text not null default '',
  price numeric(10, 2),
  status text not null default 'active' check (status in ('active', 'draft')),
  display_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_service_items_section_idx on admin_service_items(section, display_order);

insert into admin_service_items (section, title, description, price, display_order, metadata)
values
  ('packages', 'Essential Compliance Package', 'Meet fundamental safety and compliance requirements.', 199, 10, '{"route":"/packages","popular":false}'),
  ('packages', 'Safety & Training Package', 'Prioritise staff training and equipment safety.', 299, 20, '{"route":"/packages","popular":true}'),
  ('packages', 'Complete Compliance & Safety Package', 'Full-service solution for workplace safety.', 399, 30, '{"route":"/packages","popular":false}'),
  ('pricing', '4x Risk Assessments Bundle', 'Fire, Legionella, Health & Safety, Disability.', 1200, 10, '{"route":"/pricing","category":"Risk Assessments"}'),
  ('pricing', 'Basic Life Support (BLS)', 'Dental team training service.', 499, 20, '{"route":"/pricing","category":"Training"}'),
  ('pricing', 'Emergency Lights - up to 20', 'Direct 365 service, price shown ex VAT.', 95, 30, '{"route":"/pricing","category":"Direct 365 Services","exVat":true}'),
  ('pricing', 'Complete RPA Service - Monthly', 'Monthly RPA service.', 30, 40, '{"route":"/pricing","category":"RPA","unit":"month"}'),
  ('pricing', 'Reception Logbook', 'Paid resource item.', 49.99, 50, '{"route":"/pricing","category":"Resources"}'),
  ('build-your-package', 'Packages', 'Calculator category for package bundles.', null, 10, '{"route":"/build-your-package","category":"Packages"}'),
  ('build-your-package', 'Risk Assessments', 'Calculator category for risk assessment services.', null, 20, '{"route":"/build-your-package","category":"Risk Assessments"}'),
  ('build-your-package', 'Training', 'Calculator category for dental training.', null, 30, '{"route":"/build-your-package","category":"Training"}'),
  ('build-your-package', 'Direct 365 Services', 'Calculator category for Direct 365 items and VAT handling.', null, 40, '{"route":"/build-your-package","category":"Direct 365 Services"}')
on conflict do nothing;
