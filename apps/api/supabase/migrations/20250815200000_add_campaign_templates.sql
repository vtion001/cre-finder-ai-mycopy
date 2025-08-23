-- Campaign templates table for storing reusable campaign content

create table if not exists public.campaign_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  channel text not null check (channel in ('voice', 'sms', 'email')),
  content jsonb not null,
  variables jsonb default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_campaign_templates_user on public.campaign_templates(user_id);
create index if not exists idx_campaign_templates_channel on public.campaign_templates(channel);
create index if not exists idx_campaign_templates_active on public.campaign_templates(is_active);

-- Updated timestamp trigger
create or replace function public.campaign_templates_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_campaign_templates_updated_at on public.campaign_templates;
create trigger trg_campaign_templates_updated_at
before update on public.campaign_templates
for each row execute function public.campaign_templates_set_updated_at();

-- Enable RLS
alter table public.campaign_templates enable row level security;

-- RLS policies
drop policy if exists select_own_templates on public.campaign_templates;
create policy select_own_templates on public.campaign_templates
for select using (auth.uid() = user_id);

drop policy if exists modify_own_templates on public.campaign_templates;
create policy modify_own_templates on public.campaign_templates
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
