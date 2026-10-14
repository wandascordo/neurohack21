CREATE OR REPLACE FUNCTION public.limit_intentions()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
begin
  if new.source_module in (7, 8) and (select count(*) from implementation_intentions
      where user_id = new.user_id and source_module = new.source_module and id <> new.id) >= 10 then
    raise exception 'Máximo 10 intenciones por módulo';
  end if;
  if new.source_module = 8 and new.context is null then
    raise exception 'Elegí un contexto';
  end if;
  return new;
end $function$;