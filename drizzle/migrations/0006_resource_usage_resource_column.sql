ALTER TABLE public.resource_usage_events ADD COLUMN IF NOT EXISTS resource text;
ALTER TABLE public.resource_usage_events ALTER COLUMN resource_type SET DEFAULT 'recurso';
ALTER TABLE public.resource_usage_events ALTER COLUMN resource_name SET DEFAULT '';
DROP POLICY IF EXISTS "Own read" ON public.resource_usage_events;
CREATE POLICY "Admin read" ON public.resource_usage_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));