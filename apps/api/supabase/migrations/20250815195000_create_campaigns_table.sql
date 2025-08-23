-- Campaigns table for tracking outbound marketing campaigns

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  channels jsonb not null default '{}',
  record_ids text[] not null default '{}',
  status text not null default 'pending',
  results jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_campaigns_user on public.campaigns(user_id);
create index if not exists idx_campaigns_status on public.campaigns(status);

create or replace function public.campaigns_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_campaigns_updated_at on public.campaigns;
create trigger trg_campaigns_updated_at
before update on public.campaigns
for each row execute function public.campaigns_set_updated_at();

alter table public.campaigns enable row level security;

drop policy if exists select_own_campaigns on public.campaigns;
create policy select_own_campaigns on public.campaigns
for select using (auth.uid() = user_id);

drop policy if exists modify_own_campaigns on public.campaigns;
create policy modify_own_campaigns on public.campaigns
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
