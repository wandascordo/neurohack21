
create type public.app_role as enum ('admin', 'user');
create type public.access_status as enum ('activo', 'pendiente', 'revocado');
create type public.assessment_moment as enum ('pre_dia1', 'cierre_semana1', 'cierre_semana2', 'dia21');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users see own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create table public.profiles (
  id uuid primary key,
  email text,
  purchased_at timestamptz,
  first_login_at timestamptz,
  access_status public.access_status not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "Admin updates profiles" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create or replace function public.mark_first_login()
returns void language sql security definer set search_path = public as $$
  update public.profiles set first_login_at = now(), updated_at = now()
  where id = auth.uid() and first_login_at is null;
$$;
grant execute on function public.mark_first_login() to authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  day_number int not null check (day_number between 1 and 21),
  logged_at timestamptz not null default now(),
  body_scan boolean not null default false,
  coherence_breathing boolean not null default false,
  guided_visualization boolean not null default false,
  arrival_tags text[] not null default '{}',
  arrival_other text,
  reflection text,
  focus_level int check (focus_level between 1 and 10),
  missed_practice boolean not null default false,
  how_resumed text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_number)
);

create table public.focus_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  moment public.assessment_moment not null,
  answers int[] not null check (array_length(answers, 1) = 10 and 1 <= all(answers) and 5 >= all(answers)),
  total_score int generated always as (answers[1]+answers[2]+answers[3]+answers[4]+answers[5]+answers[6]+answers[7]+answers[8]+answers[9]+answers[10]) stored,
  assessed_at timestamptz not null default now(),
  unique (user_id, moment)
);

create table public.implementation_intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  if_situation text not null,
  then_action text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table public.maintenance_rituals (
  user_id uuid primary key default auth.uid(),
  ritual text not null default '',
  updated_at timestamptz not null default now()
);

create table public.resource_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  resource_type text not null check (resource_type in ('kit_emergencia','guion_copiado','glosario_busqueda')),
  resource_name text not null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.daily_logs, public.focus_assessments, public.implementation_intentions, public.maintenance_rituals to authenticated;
grant select, insert on public.resource_usage_events to authenticated;
grant all on public.daily_logs, public.focus_assessments, public.implementation_intentions, public.maintenance_rituals, public.resource_usage_events to service_role;

alter table public.daily_logs enable row level security;
alter table public.focus_assessments enable row level security;
alter table public.implementation_intentions enable row level security;
alter table public.maintenance_rituals enable row level security;
alter table public.resource_usage_events enable row level security;

create policy "Own rows" on public.daily_logs for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admin read" on public.daily_logs for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Own rows" on public.focus_assessments for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admin read" on public.focus_assessments for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Own rows" on public.implementation_intentions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admin read" on public.implementation_intentions for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Own rows" on public.maintenance_rituals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Admin read" on public.maintenance_rituals for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Own insert" on public.resource_usage_events for insert to authenticated with check (user_id = auth.uid());
create policy "Own read" on public.resource_usage_events for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create or replace function public.limit_intentions()
returns trigger language plpgsql set search_path = public as $$
begin
  if (select count(*) from public.implementation_intentions where user_id = new.user_id) >= 5 then
    raise exception 'Máximo 5 intenciones de implementación';
  end if;
  return new;
end; $$;
create trigger limit_intentions before insert on public.implementation_intentions
  for each row execute function public.limit_intentions();
