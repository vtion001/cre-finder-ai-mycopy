-- Integration configs per user (dev-only storage of provider credentials)

create table if not exists public.integration_configs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

create index if not exists idx_integration_configs_user on public.integration_configs(user_id);

create or replace function public.integration_configs_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_integration_configs_updated_at on public.integration_configs;
create trigger trg_integration_configs_updated_at
before update on public.integration_configs
for each row execute function public.integration_configs_set_updated_at();

alter table public.integration_configs enable row level security;

drop policy if exists select_own_integration_configs on public.integration_configs;
create policy select_own_integration_configs on public.integration_configs
for select using (auth.uid() = user_id);

drop policy if exists upsert_own_integration_configs on public.integration_configs;
create policy upsert_own_integration_configs on public.integration_configs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


