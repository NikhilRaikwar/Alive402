create extension if not exists pgcrypto;

create table if not exists alive402_providers (
  id text primary key,
  name text not null,
  recipient text not null,
  network text not null default 'hedera:testnet',
  asset text not null default '0.0.429274',
  amount text not null default '1000',
  created_at timestamptz not null default now()
);

create table if not exists alive402_campaigns (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references alive402_providers(id) on delete cascade,
  action text not null,
  promotional_calls integer not null default 1 check (promotional_calls > 0),
  active boolean not null default true,
  unique(provider_id, action)
);

create table if not exists alive402_enrollments (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null,
  action text not null,
  nullifier numeric(78, 0) not null,
  granted integer not null check (granted >= 0),
  consumed integer not null default 0 check (consumed >= 0 and consumed <= granted),
  verified_at timestamptz not null default now(),
  unique (provider_id, action, nullifier)
);

create table if not exists alive402_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references alive402_enrollments(id) on delete cascade,
  token_hash char(64) not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists alive402_runs (
  id uuid primary key,
  provider_id text not null,
  mode text not null check (mode in ('promotion', 'x402', 'denied')),
  decision text not null,
  prompt text,
  transaction text,
  amount text,
  created_at timestamptz not null default now()
);

create table if not exists alive402_payments (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references alive402_runs(id) on delete cascade,
  payment_hash char(64) unique,
  amount text not null,
  asset text not null,
  facilitator text not null,
  status text not null,
  transaction text,
  created_at timestamptz not null default now()
);

create or replace function consume_alive402_promotion(enrollment_id_input uuid)
returns boolean language plpgsql security invoker set search_path = public as $$
begin
  update alive402_enrollments
  set consumed = consumed + 1
  where id = enrollment_id_input and consumed < granted;
  return found;
end;
$$;

revoke all on function consume_alive402_promotion(uuid) from public, anon, authenticated;
grant execute on function consume_alive402_promotion(uuid) to service_role;

alter table alive402_enrollments enable row level security;
alter table alive402_sessions enable row level security;
alter table alive402_runs enable row level security;
alter table alive402_providers enable row level security;
alter table alive402_campaigns enable row level security;
alter table alive402_payments enable row level security;

revoke all on table alive402_providers, alive402_campaigns, alive402_enrollments,
  alive402_sessions, alive402_runs, alive402_payments from anon, authenticated;

-- Alive402 uses the service role exclusively on the server. No public table policies are created.
create index if not exists alive402_sessions_token_idx on alive402_sessions(token_hash, expires_at);
create index if not exists alive402_runs_provider_time_idx on alive402_runs(provider_id, created_at desc);

insert into alive402_providers(id, name, recipient)
values ('alive402-demo', 'Alive402 Research API', 'CONFIGURE_IN_ENV')
on conflict (id) do nothing;

insert into alive402_campaigns(provider_id, action, promotional_calls)
values ('alive402-demo', 'alive402-demo-v1', 1)
on conflict (provider_id, action) do nothing;
