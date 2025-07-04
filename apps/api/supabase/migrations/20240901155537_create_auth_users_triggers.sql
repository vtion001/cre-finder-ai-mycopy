create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
    insert into public.users (id, email, full_name, phone_number, role)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'phone_number',
        COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role, 'investor'::public.user_role)
    );
    return new;
end;
$$;

-- trigger the function every time a user is created
create or replace trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();