alter table admin_service_items
  drop constraint if exists admin_service_items_section_check;

alter table admin_service_items
  add constraint admin_service_items_section_check
  check (section in ('pricing', 'build-your-package', 'packages', 'package-comparison'));

alter table admin_service_categories
  add column if not exists pricing_note text not null default '',
  add column if not exists builder_note text not null default '';

update admin_service_categories
set
  pricing_note = 'All prices shown ex-VAT. PAT uses tiered pricing: £1.88/item up to 40, then £0.80/item.',
  builder_note = 'Items marked +VAT are shown ex-VAT in the calculator and can be included in the VAT total.'
where name = 'Direct 365 Services'
  and pricing_note = ''
  and builder_note = '';

insert into admin_service_items
  (section, content_key, title, description, price, status, display_order, metadata)
values
  ('package-comparison', 'risk-assessments', 'Fire, Legionella, H&S, Disability Risk Assessments', '', null, 'active', 10, '{"includedPackageIds":["pkg-essential","pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'pat-testing', 'PAT Testing', '', null, 'active', 20, '{"includedPackageIds":["pkg-essential","pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'emergency-lighting', 'Emergency Lighting', '', null, 'active', 30, '{"includedPackageIds":["pkg-essential","pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'fire-extinguisher-service', 'Fire Extinguisher Service', '', null, 'active', 40, '{"includedPackageIds":["pkg-essential","pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'pvi-testing', 'Autoclave & Compressor PVI Testing', '', null, 'active', 50, '{"includedPackageIds":["pkg-essential","pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'cross-infection-training', 'Cross Infection Training', '', null, 'active', 60, '{"includedPackageIds":["pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'medical-emergency-bls', 'Medical Emergency & BLS Training', '', null, 'active', 70, '{"includedPackageIds":["pkg-safety","pkg-complete"]}'),
  ('package-comparison', 'rpa-service', 'RPA Service', '', null, 'active', 80, '{"includedPackageIds":["pkg-complete"]}'),
  ('package-comparison', 'annual-mock-inspection', 'Annual Mock Inspection', '', null, 'active', 90, '{"includedPackageIds":["pkg-complete"]}')
on conflict (section, content_key) where content_key is not null do update
set
  title = excluded.title,
  description = excluded.description,
  status = excluded.status,
  display_order = excluded.display_order,
  metadata = excluded.metadata,
  updated_at = now();
