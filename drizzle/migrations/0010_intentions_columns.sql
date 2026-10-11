ALTER TABLE public.implementation_intentions
  ADD COLUMN IF NOT EXISTS source_module smallint NOT NULL DEFAULT 7 CHECK (source_module IN (7,8)),
  ADD COLUMN IF NOT EXISTS context text CHECK (context IN ('trabajo','estudio','relaciones')),
  ADD COLUMN IF NOT EXISTS if_option_id text,
  ADD COLUMN IF NOT EXISTS if_other text,
  ADD COLUMN IF NOT EXISTS then_option_id text,
  ADD COLUMN IF NOT EXISTS then_other text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.limit_intentions() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
begin
  if new.source_module = 7 and (select count(*) from implementation_intentions
      where user_id = new.user_id and source_module = 7 and id <> new.id) >= 3 then
    raise exception 'Máximo 3 intenciones del Módulo 7';
  end if;
  if new.source_module = 8 and (select count(*) from implementation_intentions
      where user_id = new.user_id and source_module = 8 and id <> new.id) >= 1 then
    raise exception 'Máximo 1 intención del Módulo 8';
  end if;
  if new.source_module = 8 and new.context is null then
    raise exception 'Elegí un contexto';
  end if;
  return new;
end $$;
DROP TRIGGER IF EXISTS limit_intentions ON public.implementation_intentions;
CREATE TRIGGER limit_intentions BEFORE INSERT OR UPDATE ON public.implementation_intentions
  FOR EACH ROW EXECUTE FUNCTION public.limit_intentions();
DROP TRIGGER IF EXISTS touch_intentions ON public.implementation_intentions;
CREATE TRIGGER touch_intentions BEFORE UPDATE ON public.implementation_intentions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();