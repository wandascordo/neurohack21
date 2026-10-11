ALTER TABLE public.daily_logs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS logged_on date NOT NULL DEFAULT current_date,
  ADD COLUMN IF NOT EXISTS practice_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS practica_completa boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE public.daily_logs
  ADD CONSTRAINT daily_logs_status_check CHECK (status IN ('draft','completed'));
COMMENT ON COLUMN public.daily_logs.focus_level IS 'Calificación de foco 1-10 (focus_rating)';
COMMENT ON COLUMN public.daily_logs.logged_on IS 'Fecha local del dispositivo; la app la envía siempre, el default es solo respaldo';

CREATE OR REPLACE FUNCTION public.validate_daily_log()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    IF NEW.day_number > 1 AND NOT EXISTS (
      SELECT 1 FROM public.daily_logs
      WHERE user_id = NEW.user_id AND day_number = NEW.day_number - 1 AND status = 'completed'
    ) THEN
      RAISE EXCEPTION 'Completá primero el día %', NEW.day_number - 1;
    END IF;
    NEW.completed_at := coalesce(NEW.completed_at, now());
  ELSE
    NEW.completed_at := NULL;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS validate_daily_log ON public.daily_logs;
CREATE TRIGGER validate_daily_log BEFORE INSERT OR UPDATE ON public.daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_daily_log();

CREATE TABLE public.challenge_feedback (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.challenge_feedback TO authenticated;
GRANT ALL ON public.challenge_feedback TO service_role;
ALTER TABLE public.challenge_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own feedback" ON public.challenge_feedback FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS touch_challenge_feedback ON public.challenge_feedback;
CREATE TRIGGER touch_challenge_feedback BEFORE UPDATE ON public.challenge_feedback
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();