CREATE TABLE public.module_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  module_number smallint NOT NULL CHECK (module_number BETWEEN 1 AND 5),
  field_key text NOT NULL CHECK (field_key IN ('m1_registro','m2_observacion','m3_tarea','m3_pregunta','m4_presencia','m4_comentario','m5_dialogo')),
  value_text text,
  value_number smallint CHECK (value_number BETWEEN 1 AND 10),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_number, field_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.module_notes TO authenticated;
GRANT ALL ON public.module_notes TO service_role;
ALTER TABLE public.module_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own notes" ON public.module_notes FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER touch_module_notes BEFORE UPDATE ON public.module_notes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();