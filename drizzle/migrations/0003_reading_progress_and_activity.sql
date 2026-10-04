ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_read_anchor text,
  ADD COLUMN IF NOT EXISTS last_read_anchor_label text,
  ADD COLUMN IF NOT EXISTS last_read_at timestamptz;

CREATE TABLE public.reading_progress (
  user_id uuid NOT NULL DEFAULT auth.uid(),
  slug text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, slug)
);
GRANT SELECT, INSERT, UPDATE ON public.reading_progress TO authenticated;
GRANT ALL ON public.reading_progress TO service_role;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress" ON public.reading_progress FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admin read progress" ON public.reading_progress FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.user_activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  event_type text NOT NULL,
  slug text,
  anchor text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX user_activity_events_user_created_idx ON public.user_activity_events (user_id, created_at DESC);
GRANT SELECT, INSERT ON public.user_activity_events TO authenticated;
GRANT ALL ON public.user_activity_events TO service_role;
ALTER TABLE public.user_activity_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own insert events" ON public.user_activity_events FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Own or admin read events" ON public.user_activity_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP FUNCTION IF EXISTS public.set_last_read(text);
CREATE FUNCTION public.set_last_read(_slug text, _anchor text DEFAULT NULL, _anchor_label text DEFAULT NULL)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  UPDATE public.profiles
  SET last_read_slug = left(_slug, 64),
      last_read_anchor = left(_anchor, 120),
      last_read_anchor_label = left(_anchor_label, 200),
      last_read_at = now(),
      updated_at = now()
  WHERE id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.set_last_read(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_last_read(text, text, text) TO authenticated;