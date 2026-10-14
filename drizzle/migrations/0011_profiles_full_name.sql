alter table public.profiles add column if not exists full_name text;
create or replace function public.handle_new_user()
 returns trigger language plpgsql security definer set search_path to 'public'
as $function$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(left(trim(new.raw_user_meta_data->>'full_name'), 120), ''));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $function$;