delete from admin_service_items
where section = 'services';

update admin_service_items
set
  description = '',
  updated_at = now()
where section = 'packages'
  and metadata ? 'tagline';

alter table admin_service_items
  drop constraint if exists admin_service_items_section_check;

alter table admin_service_items
  add constraint admin_service_items_section_check
  check (section in ('pricing', 'build-your-package', 'packages', 'package-comparison'));
