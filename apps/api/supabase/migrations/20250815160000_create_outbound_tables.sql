-- Outbound communications tables (Twilio/Vapi logging)

create type public.outbound_channel as enum (
  'sms',
  'voicemail',
  'phone',
  'email',
  'postcard',
  'handwritten'
);

create table if not exists public.outbound_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  channel public.outbound_channel not null,
  to_contact text,
  status text not null default 'queued',
  cost_cents integer,
  payload jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_outbound_events_user on public.outbound_events(user_id);
create index if not exists idx_outbound_events_channel on public.outbound_events(channel);

create or replace function public.outbound_events_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_outbound_events_updated_at on public.outbound_events;
create trigger trg_outbound_events_updated_at
before update on public.outbound_events
for each row execute function public.outbound_events_set_updated_at();

-- RLS
alter table public.outbound_events enable row level security;

drop policy if exists select_own_outbound on public.outbound_events;
create policy select_own_outbound on public.outbound_events
for select using (auth.uid() = user_id);

drop policy if exists insert_own_outbound on public.outbound_events;
create policy insert_own_outbound on public.outbound_events
for insert with check (auth.uid() = user_id);

-- service role will manage webhook inserts/updates

