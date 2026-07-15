create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('admin', 'trainer', 'user');
exception
  when duplicate_object then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  role user_role not null default 'user',
  password_hash text,
  google_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_role_idx on users(role);
create index if not exists users_google_id_idx on users(google_id);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_tokens_user_id_idx on password_reset_tokens(user_id);
create index if not exists password_reset_tokens_valid_idx
  on password_reset_tokens(token_hash, expires_at)
  where used_at is null;
