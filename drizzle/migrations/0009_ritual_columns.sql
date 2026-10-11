ALTER TABLE public.maintenance_rituals
  ADD COLUMN IF NOT EXISTS ritual_practice_id text,
  ADD COLUMN IF NOT EXISTS ritual_practice_other text,
  ADD COLUMN IF NOT EXISTS ritual_when_id text,
  ADD COLUMN IF NOT EXISTS ritual_when_other text;
CREATE UNIQUE INDEX IF NOT EXISTS maintenance_rituals_user_uidx ON public.maintenance_rituals(user_id);