ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_read_slug text;
CREATE OR REPLACE FUNCTION public.set_last_read(_slug text)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.profiles SET last_read_slug = left(_slug, 64), updated_at = now() WHERE id = auth.uid();
$$;
REVOKE ALL ON FUNCTION public.set_last_read(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_last_read(text) TO authenticated;