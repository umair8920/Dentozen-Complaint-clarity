alter table admin_service_items
  drop constraint if exists admin_service_items_section_check;

alter table admin_service_items
  add constraint admin_service_items_section_check
  check (
    section in (
      'pricing',
      'build-your-package',
      'packages',
      'package-comparison',
      'resources'
    )
  );

-- Logbooks now have one source of truth on the Resources page instead of being duplicated
-- across pricing and the package calculator.
delete from admin_service_items
where section in ('pricing', 'build-your-package')
  and coalesce(metadata->>'itemId', content_key, '') in (
    'log-reception',
    'log-nurse',
    'log-lead-nurse',
    'log-manager'
  );

insert into admin_service_items
  (section, content_key, title, description, price, status, display_order, metadata)
values
  (
    'resources',
    'log-reception',
    'Reception Logbook',
    '',
    49.99,
    'active',
    10,
    '{"itemId":"log-reception","resourceType":"logbook","allowQuantity":true,"gradient":"gradient-teal-purple"}'
  ),
  (
    'resources',
    'log-nurse',
    'Dental Nurse Logbook',
    '',
    49.99,
    'active',
    20,
    '{"itemId":"log-nurse","resourceType":"logbook","allowQuantity":true,"gradient":"gradient-purple-orange"}'
  ),
  (
    'resources',
    'log-lead-nurse',
    'Lead Nurse Logbook',
    '',
    49.99,
    'active',
    30,
    '{"itemId":"log-lead-nurse","resourceType":"logbook","allowQuantity":true,"gradient":"gradient-orange-gold"}'
  ),
  (
    'resources',
    'log-manager',
    'Practice Manager Logbook',
    '',
    49.99,
    'active',
    40,
    '{"itemId":"log-manager","resourceType":"logbook","allowQuantity":true,"gradient":"gradient-blue-teal"}'
  )
on conflict (section, content_key) where content_key is not null do nothing;
