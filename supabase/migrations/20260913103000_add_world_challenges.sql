-- One five-minute World signal per IDKit request. Only its Poseidon hash is stored.
create table if not exists alive402_world_challenges (
  signal_hash text primary key,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table alive402_world_challenges enable row level security;
revoke all on table alive402_world_challenges from anon, authenticated;

create or replace function consume_alive402_world_challenge(signal_hash_input text)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
begin
  update alive402_world_challenges
  set consumed_at = now()
  where signal_hash = lower(signal_hash_input)
    and consumed_at is null
    and expires_at > now();
  return found;
end;
$$;

revoke all on function consume_alive402_world_challenge(text) from public, anon, authenticated;
grant execute on function consume_alive402_world_challenge(text) to service_role;

create index if not exists alive402_world_challenges_expiry_idx
  on alive402_world_challenges(expires_at)
  where consumed_at is null;
