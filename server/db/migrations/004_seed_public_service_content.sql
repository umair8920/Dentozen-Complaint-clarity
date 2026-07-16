alter table admin_service_items
  add column if not exists content_key text;

create unique index if not exists admin_service_items_section_content_key_idx
  on admin_service_items(section, content_key)
  where content_key is not null;

delete from admin_service_items
where section in ('pricing', 'build-your-package', 'packages');

insert into admin_service_items
  (section, content_key, title, description, price, status, display_order, metadata)
values
  ('packages', 'pkg-essential', 'Essential Compliance Package', '', 199, 'active', 10, '{"itemId":"pkg-essential","tagline":"Meet your fundamental safety and compliance requirements.","gradient":"gradient-blue-teal","popular":false,"features":["Fire, Legionella, Health & Safety, Disability Risk Assessments","PAT Testing","Emergency Lighting","Fire Extinguisher Service","Autoclave PVI Testing","Compressor PVI Testing"]}'),
  ('packages', 'pkg-safety', 'Safety & Training Package', '', 299, 'active', 20, '{"itemId":"pkg-safety","tagline":"Prioritise staff training and equipment safety.","gradient":"gradient-teal-purple","popular":true,"features":["Fire, Legionella, Health & Safety, Disability Risk Assessments","PAT Testing","Emergency Lighting","Fire Extinguisher Service","Autoclave PVI Testing","Compressor PVI Testing","Cross Infection Training","Medical Emergency & BLS Training"]}'),
  ('packages', 'pkg-complete', 'Complete Compliance & Safety Package', '', 399, 'active', 30, '{"itemId":"pkg-complete","tagline":"Our full-service solution for total workplace safety.","gradient":"gradient-purple-orange","popular":false,"features":["Fire, Legionella, Health & Safety, Disability Risk Assessments","PAT Testing","Emergency Lighting","Fire Extinguisher Service","Autoclave PVI Testing","Compressor PVI Testing","RPA Service","Annual Mock Inspection"]}'),

  ('pricing', 'ra-bundle', '4x Risk Assessments (Bundle)', 'Fire, Legionella, H&S, Disability', 1200, 'active', 10, '{"itemId":"ra-bundle","category":"Risk Assessments"}'),
  ('pricing', 'ra-fire', 'Fire Risk Assessment', '', 350, 'active', 20, '{"itemId":"ra-fire","category":"Risk Assessments"}'),
  ('pricing', 'ra-legionella', 'Legionella Risk Assessment', '', 350, 'active', 30, '{"itemId":"ra-legionella","category":"Risk Assessments"}'),
  ('pricing', 'ra-hs', 'Health & Safety Risk Assessment', '', 350, 'active', 40, '{"itemId":"ra-hs","category":"Risk Assessments"}'),
  ('pricing', 'ra-disability', 'Disability Access Assessment', '', 350, 'active', 50, '{"itemId":"ra-disability","category":"Risk Assessments"}'),
  ('pricing', 'tr-bls', 'Basic Life Support (BLS)', '', 499, 'active', 60, '{"itemId":"tr-bls","category":"Training"}'),
  ('pricing', 'tr-ils', 'Immediate Life Support (ILS)', '', 750, 'active', 70, '{"itemId":"tr-ils","category":"Training"}'),
  ('pricing', 'tr-complaints', 'Complaints Handling', '', 399, 'active', 80, '{"itemId":"tr-complaints","category":"Training"}'),
  ('pricing', 'tr-ci-house', 'Cross Infection (in house)', '', 399, 'active', 90, '{"itemId":"tr-ci-house","category":"Training"}'),
  ('pricing', 'tr-ci-online', 'Cross Infection (online)', '', 350, 'active', 100, '{"itemId":"tr-ci-online","category":"Training"}'),
  ('pricing', 'tr-safeguarding', 'Safeguarding Level 1 & 2', '', 399, 'active', 110, '{"itemId":"tr-safeguarding","category":"Training"}'),
  ('pricing', 'd365-emlights', 'Emergency Lights - up to 20', '', 95, 'active', 120, '{"itemId":"d365-emlights","category":"Direct 365 Services","exVat":true}'),
  ('pricing', 'd365-emlights-extra', 'Additional Emergency Light test', '', 4.95, 'active', 130, '{"itemId":"d365-emlights-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('pricing', 'd365-extinguishers', 'Fire Extinguishers - 10 serviced', '', 67, 'active', 140, '{"itemId":"d365-extinguishers","category":"Direct 365 Services","exVat":true}'),
  ('pricing', 'd365-extinguishers-extra', 'Additional Extinguisher service', '', 3.95, 'active', 150, '{"itemId":"d365-extinguishers-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('pricing', 'd365-firealarm', 'Fire Alarm Servicing - up to 20 devices', '', 165, 'active', 160, '{"itemId":"d365-firealarm","category":"Direct 365 Services","exVat":true}'),
  ('pricing', 'd365-firealarm-extra', 'Additional Fire Alarm device test', '', 8, 'active', 170, '{"itemId":"d365-firealarm-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('pricing', 'd365-pat', 'PAT Testing (qty)', 'GBP 1.88/item up to 40, then GBP 0.80/item', 1.88, 'active', 180, '{"itemId":"d365-pat","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"item","tiered":true}'),
  ('pricing', 'd365-inspection', 'Independent Inspection', '', 0, 'active', 190, '{"itemId":"d365-inspection","category":"Direct 365 Services","exVat":true,"tbd":true}'),
  ('pricing', 'd365-pvi', 'PVI - 1x Autoclave & 1x Compressor', '', 268.8, 'active', 200, '{"itemId":"d365-pvi","category":"Direct 365 Services","exVat":true}'),
  ('pricing', 'rpa-month', 'Complete RPA Service - Monthly', '', 30, 'active', 210, '{"itemId":"rpa-month","category":"RPA","unit":"month","priceLabel":"\u00a330/mo"}'),
  ('pricing', 'rpa-year', 'Complete RPA Service - Annual', '', 360, 'active', 220, '{"itemId":"rpa-year","category":"RPA","unit":"year","priceLabel":"\u00a3360/yr"}'),
  ('pricing', 'log-reception', 'Reception Logbook', '', 49.99, 'active', 230, '{"itemId":"log-reception","category":"Resources","allowQuantity":true}'),
  ('pricing', 'log-nurse', 'Dental Nurse Logbook', '', 49.99, 'active', 240, '{"itemId":"log-nurse","category":"Resources","allowQuantity":true}'),
  ('pricing', 'log-lead-nurse', 'Lead Nurse Logbook', '', 49.99, 'active', 250, '{"itemId":"log-lead-nurse","category":"Resources","allowQuantity":true}'),
  ('pricing', 'log-manager', 'Practice Manager Logbook', '', 49.99, 'active', 260, '{"itemId":"log-manager","category":"Resources","allowQuantity":true}'),

  ('build-your-package', 'pkg-essential', 'Essential Compliance Package', '', 199, 'active', 10, '{"itemId":"pkg-essential","category":"Packages"}'),
  ('build-your-package', 'pkg-safety', 'Safety & Training Package', '', 299, 'active', 20, '{"itemId":"pkg-safety","category":"Packages"}'),
  ('build-your-package', 'pkg-complete', 'Complete Compliance & Safety Package', '', 399, 'active', 30, '{"itemId":"pkg-complete","category":"Packages"}'),
  ('build-your-package', 'ra-bundle', '4x Risk Assessments (Bundle)', 'Fire, Legionella, H&S, Disability', 1200, 'active', 40, '{"itemId":"ra-bundle","category":"Risk Assessments"}'),
  ('build-your-package', 'ra-fire', 'Fire Risk Assessment', '', 350, 'active', 50, '{"itemId":"ra-fire","category":"Risk Assessments"}'),
  ('build-your-package', 'ra-legionella', 'Legionella Risk Assessment', '', 350, 'active', 60, '{"itemId":"ra-legionella","category":"Risk Assessments"}'),
  ('build-your-package', 'ra-hs', 'Health & Safety Risk Assessment', '', 350, 'active', 70, '{"itemId":"ra-hs","category":"Risk Assessments"}'),
  ('build-your-package', 'ra-disability', 'Disability Access Assessment', '', 350, 'active', 80, '{"itemId":"ra-disability","category":"Risk Assessments"}'),
  ('build-your-package', 'tr-bls', 'Basic Life Support (BLS)', '', 499, 'active', 90, '{"itemId":"tr-bls","category":"Training"}'),
  ('build-your-package', 'tr-ils', 'Immediate Life Support (ILS)', '', 750, 'active', 100, '{"itemId":"tr-ils","category":"Training"}'),
  ('build-your-package', 'tr-complaints', 'Complaints Handling', '', 399, 'active', 110, '{"itemId":"tr-complaints","category":"Training"}'),
  ('build-your-package', 'tr-ci-house', 'Cross Infection (in house)', '', 399, 'active', 120, '{"itemId":"tr-ci-house","category":"Training"}'),
  ('build-your-package', 'tr-ci-online', 'Cross Infection (online)', '', 350, 'active', 130, '{"itemId":"tr-ci-online","category":"Training"}'),
  ('build-your-package', 'tr-safeguarding', 'Safeguarding Level 1 & 2', '', 399, 'active', 140, '{"itemId":"tr-safeguarding","category":"Training"}'),
  ('build-your-package', 'd365-emlights', 'Emergency Lights - up to 20', '', 95, 'active', 150, '{"itemId":"d365-emlights","category":"Direct 365 Services","exVat":true}'),
  ('build-your-package', 'd365-emlights-extra', 'Additional Emergency Light test', '', 4.95, 'active', 160, '{"itemId":"d365-emlights-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('build-your-package', 'd365-extinguishers', 'Fire Extinguishers - 10 serviced', '', 67, 'active', 170, '{"itemId":"d365-extinguishers","category":"Direct 365 Services","exVat":true}'),
  ('build-your-package', 'd365-extinguishers-extra', 'Additional Extinguisher service', '', 3.95, 'active', 180, '{"itemId":"d365-extinguishers-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('build-your-package', 'd365-firealarm', 'Fire Alarm Servicing - up to 20 devices', '', 165, 'active', 190, '{"itemId":"d365-firealarm","category":"Direct 365 Services","exVat":true}'),
  ('build-your-package', 'd365-firealarm-extra', 'Additional Fire Alarm device test', '', 8, 'active', 200, '{"itemId":"d365-firealarm-extra","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"each"}'),
  ('build-your-package', 'd365-pat', 'PAT Testing (qty)', 'GBP 1.88/item up to 40, then GBP 0.80/item', 1.88, 'active', 210, '{"itemId":"d365-pat","category":"Direct 365 Services","exVat":true,"allowQuantity":true,"unit":"item","tiered":true}'),
  ('build-your-package', 'd365-inspection', 'Independent Inspection', '', 0, 'active', 220, '{"itemId":"d365-inspection","category":"Direct 365 Services","exVat":true,"tbd":true}'),
  ('build-your-package', 'd365-pvi', 'PVI - 1x Autoclave & 1x Compressor', '', 268.8, 'active', 230, '{"itemId":"d365-pvi","category":"Direct 365 Services","exVat":true}'),
  ('build-your-package', 'rpa-month', 'Complete RPA Service - Monthly', '', 30, 'active', 240, '{"itemId":"rpa-month","category":"RPA","unit":"month","priceLabel":"\u00a330/mo"}'),
  ('build-your-package', 'rpa-year', 'Complete RPA Service - Annual', '', 360, 'active', 250, '{"itemId":"rpa-year","category":"RPA","unit":"year","priceLabel":"\u00a3360/yr"}'),
  ('build-your-package', 'log-reception', 'Reception Logbook', '', 49.99, 'active', 260, '{"itemId":"log-reception","category":"Resources","allowQuantity":true}'),
  ('build-your-package', 'log-nurse', 'Dental Nurse Logbook', '', 49.99, 'active', 270, '{"itemId":"log-nurse","category":"Resources","allowQuantity":true}'),
  ('build-your-package', 'log-lead-nurse', 'Lead Nurse Logbook', '', 49.99, 'active', 280, '{"itemId":"log-lead-nurse","category":"Resources","allowQuantity":true}'),
  ('build-your-package', 'log-manager', 'Practice Manager Logbook', '', 49.99, 'active', 290, '{"itemId":"log-manager","category":"Resources","allowQuantity":true}');
