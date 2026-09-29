ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz;
CREATE OR REPLACE FUNCTION public.complete_onboarding()
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  update public.profiles set onboarding_completed_at = now(), updated_at = now()
  where id = auth.uid() and onboarding_completed_at is null;
$$;
REVOKE EXECUTE ON FUNCTION public.complete_onboarding() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.complete_onboarding() TO authenticated;