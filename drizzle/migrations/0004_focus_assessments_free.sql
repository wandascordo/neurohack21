ALTER TABLE public.focus_assessments ALTER COLUMN moment DROP NOT NULL;
ALTER TABLE public.focus_assessments ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
DROP POLICY IF EXISTS "Own rows" ON public.focus_assessments;
CREATE POLICY "Own select" ON public.focus_assessments FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Own insert" ON public.focus_assessments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND array_length(answers,1) = 10 AND total_score BETWEEN 10 AND 50);
CREATE POLICY "Own delete" ON public.focus_assessments FOR DELETE TO authenticated USING (user_id = auth.uid());
REVOKE UPDATE ON public.focus_assessments FROM authenticated;