-- Enhance campaigns table with additional fields for better campaign management

-- Add new columns to campaigns table
alter table public.campaigns 
add column if not exists description text,
add column if not exists template_id uuid references public.campaign_templates(id),
add column if not exists scheduled_at timestamptz,
add column if not exists total_records integer not null default 0,
add column if not exists sent_count integer not null default 0,
add column if not exists delivered_count integer not null default 0,
add column if not exists failed_count integer not null default 0,
add column if not exists responded_count integer not null default 0,
add column if not exists campaign_type text not null default 'manual' check (campaign_type in ('manual', 'scheduled', 'automated')),
add column if not exists priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
add column if not exists settings jsonb default '{}';

-- Add indexes for new fields
create index if not exists idx_campaigns_template on public.campaigns(template_id);
create index if not exists idx_campaigns_scheduled on public.campaigns(scheduled_at);
create index if not exists idx_campaigns_type on public.campaigns(campaign_type);
create index if not exists idx_campaigns_priority on public.campaigns(priority);

-- Update the channels column to be more structured
comment on column public.campaigns.channels is 'JSON object with channel-specific settings: {"voice": {...}, "sms": {...}, "email": {...}}';

-- Note: We cannot use jsonb_object_keys in check constraints, so we'll validate this in the application layer
