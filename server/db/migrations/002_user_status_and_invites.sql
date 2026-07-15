alter table users
  add column if not exists status text not null default 'active',
  add column if not exists invited_at timestamptz;

update users set status = 'active' where status is null;

do $$ begin
  alter table users
    add constraint users_status_check check (status in ('active', 'inactive'));
exception
  when duplicate_object then null;
end $$;

create index if not exists users_status_idx on users(status);
create index if not exists users_created_at_idx on users(created_at desc);
