-- Vapi assistants table

create table if not exists public.vapi_assistants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  vapi_assistant_id text,
  model_parameters jsonb default '{}',
  voice_parameters jsonb default '{}',
  first_message text,
  system_prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vapi_assistants_user on public.vapi_assistants(user_id);

create or replace function public.vapi_assistants_set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_vapi_assistants_updated_at on public.vapi_assistants;
create trigger trg_vapi_assistants_updated_at
before update on public.vapi_assistants
for each row execute function public.vapi_assistants_set_updated_at();

alter table public.vapi_assistants enable row level security;

drop policy if exists select_own_vapi_assistants on public.vapi_assistants;
create policy select_own_vapi_assistants on public.vapi_assistants
for select using (auth.uid() = user_id);

drop policy if exists modify_own_vapi_assistants on public.vapi_assistants;
create policy modify_own_vapi_assistants on public.vapi_assistants
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


