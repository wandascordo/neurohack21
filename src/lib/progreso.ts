import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { LIBRO } from "@/lib/libro";

/** Páginas que cuentan para el progreso de lectura (sin portadas de Parte ni Bibliografía). */
export const PAGINAS_LECTURA = LIBRO.filter((p) => p.kind === "modulo" || p.kind === "reto").map((p) => p.slug);

export type Progreso = {
  slug: string | null;
  anchor: string | null;
  anchorLabel: string | null;
  completadas: string[];
  pct: number;
};

export async function fetchProgreso(): Promise<Progreso | null> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const [{ data: prof }, { data: rows }] = await Promise.all([
    supabase.from("profiles").select("last_read_slug, last_read_anchor, last_read_anchor_label").eq("id", u.user.id).maybeSingle(),
    supabase.from("reading_progress").select("slug").eq("user_id", u.user.id),
  ]);
  const completadas = (rows ?? []).map((r) => r.slug).filter((s) => PAGINAS_LECTURA.includes(s));
  const slug = prof?.last_read_slug && LIBRO.some((p) => p.slug === prof.last_read_slug) ? prof.last_read_slug : null;
  return {
    slug,
    anchor: slug ? prof?.last_read_anchor ?? null : null,
    anchorLabel: slug ? prof?.last_read_anchor_label ?? null : null,
    completadas,
    pct: Math.round((completadas.length / PAGINAS_LECTURA.length) * 100),
  };
}

/** Registra una acción del usuario (no bloquea la interfaz). */
export function logEvent(event_type: string, data: { slug?: string | undefined; anchor?: string | undefined; metadata?: Record<string, Json> } = {}) {
  supabase
    .from("user_activity_events")
    .insert({ event_type, slug: data.slug ?? null, anchor: data.anchor ?? null, metadata: data.metadata ?? {} })
    .then(({ error }) => { if (error) console.warn("logEvent", error.message); });
}

export async function guardarPosicion(slug: string, anchor: string | null, anchorLabel: string | null) {
  const args: { _slug: string; _anchor?: string; _anchor_label?: string } = { _slug: slug };
  if (anchor) args._anchor = anchor;
  if (anchorLabel) args._anchor_label = anchorLabel;
  const { error } = await supabase.rpc("set_last_read", args);
  if (error) console.warn("set_last_read", error.message);
}

export async function marcarCompletada(slug: string) {
  if (!PAGINAS_LECTURA.includes(slug)) return;
  const { error } = await supabase.from("reading_progress").upsert({ slug }, { onConflict: "user_id,slug", ignoreDuplicates: true });
  if (error) console.warn("reading_progress", error.message);
  else logEvent("seccion_completada", { slug });
}
