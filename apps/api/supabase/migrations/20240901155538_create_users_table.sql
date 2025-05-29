-- create users table
create table public.users (
    id uuid primary key,
    email text unique not null,
    full_name text,
    phone_number text,
    avatar_url text,
    locale text DEFAULT 'en'::text,
    timezone text,
    time_format numeric default '24'::numeric,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint fk_auth_user foreign key (id) references auth.users (id) on delete cascade
);

ALTER TABLE public.users ADD COLUMN role TEXT;

-- enable row level security (rls)
alter table public.users enable row level security;

-- create a trigger to update the updated_at column
create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger users_updated_at
before update on public.users
for each row
execute function update_updated_at();

-- create a policy to allow users to read their own profile
create policy select_own_profile on public.users for
select using (auth.uid () = id);

-- create a policy to allow users to update their own profile
create policy update_own_profile on public.users
for update
    using (auth.uid () = id);

create policy select_own_avatar on "storage"."objects" as permissive for
select to authenticated using (
        (
            (bucket_id = 'avatars'::text)
            AND (
                (auth.uid ())::text = (storage.foldername (name)) [1]
            )
        )
    );

create policy insert_own_avatar on "storage"."objects" as permissive for insert to authenticated
with
    check (
        (
            (bucket_id = 'avatars'::text)
            AND (
                (auth.uid ())::text = (storage.foldername (name)) [1]
            )
        )
    );

create policy update_own_avatar on "storage"."objects" as permissive
for update
    to authenticated using (
        (
            (bucket_id = 'avatars'::text)
            AND (
                (auth.uid ())::text = (storage.foldername (name)) [1]
            )
        )
    );

create policy delete_own_avatar on "storage"."objects" as permissive for delete to authenticated using (
    (
        (bucket_id = 'avatars'::text)
        AND (
            (auth.uid ())::text = (storage.foldername (name)) [1]
        )
    )
);