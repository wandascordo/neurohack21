CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_order_id text NOT NULL UNIQUE,
  email text NOT NULL CHECK (email = lower(btrim(email))),
  first_name text,
  last_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','refunded','error')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX purchases_email_idx ON public.purchases(email);
GRANT SELECT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read purchases" ON public.purchases FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX access_requests_email_idx ON public.access_requests(email, requested_at DESC);
GRANT ALL ON public.access_requests TO service_role;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ADD COLUMN account_completed_at timestamptz;
UPDATE public.profiles p SET account_completed_at = coalesce(u.email_confirmed_at, u.created_at)
FROM auth.users u WHERE u.id = p.id AND u.encrypted_password IS NOT NULL AND u.encrypted_password <> '';

CREATE OR REPLACE FUNCTION public.complete_account(_full_name text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  UPDATE public.profiles
     SET full_name = nullif(left(btrim(coalesce(_full_name,'')), 120), ''),
         account_completed_at = coalesce(account_completed_at, now()),
         updated_at = now()
   WHERE id = auth.uid();
END $$;
REVOKE ALL ON FUNCTION public.complete_account(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.complete_account(text) TO authenticated;