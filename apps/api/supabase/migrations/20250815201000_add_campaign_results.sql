-- Campaign results table for tracking individual campaign execution results

create table if not exists public.campaign_results (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  record_id text not null,
  channel text not null check (channel in ('voice', 'sms', 'email')),
  status text not null check (status in ('pending', 'sent', 'delivered', 'failed', 'responded')),
  sent_at timestamptz,
  delivered_at timestamptz,
  response_data jsonb default '{}',
  error_message text,
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_campaign_results_campaign on public.campaign_results(campaign_id);
create index if not exists idx_campaign_results_status on public.campaign_results(status);
create index if not exists idx_campaign_results_channel on public.campaign_results(channel);
create index if not exists idx_campaign_results_record on public.campaign_results(record_id);

-- Updated timestamp trigger
create or replace function public.campaign_results_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_campaign_results_updated_at on public.campaign_results;
create trigger trg_campaign_results_updated_at
before update on public.campaign_results
for each row execute function public.campaign_results_set_updated_at();

-- Enable RLS
alter table public.campaign_results enable row level security;

-- RLS policies (users can only see results from their own campaigns)
drop policy if exists select_own_campaign_results on public.campaign_results;
create policy select_own_campaign_results on public.campaign_results
for select using (
  exists (
    select 1 from public.campaigns 
    where campaigns.id = campaign_results.campaign_id 
    and campaigns.user_id = auth.uid()
  )
);

drop policy if exists modify_own_campaign_results on public.campaign_results;
create policy modify_own_campaign_results on public.campaign_results
for all using (
  exists (
    select 1 from public.campaigns 
    where campaigns.id = campaign_results.campaign_id 
    and campaigns.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.campaigns 
    where campaigns.id = campaign_results.campaign_id 
    and campaigns.user_id = auth.uid()
  )
);
