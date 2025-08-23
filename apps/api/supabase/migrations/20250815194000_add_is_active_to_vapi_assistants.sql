-- Add is_active field to vapi_assistants table

alter table public.vapi_assistants 
add column if not exists is_active boolean not null default true;
