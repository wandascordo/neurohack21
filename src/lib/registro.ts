// Registro Diario de 21 Días: configuración por día + acceso a datos (daily_logs, challenge_feedback).
// Los enunciados salen de SEMANAS (src/lib/reto.ts), la misma fuente que usa el libro.
import { supabase } from "@/integrations/supabase/client";
import { SEMANAS, type RetoGrupo } from "@/lib/reto";
import { contenidoDia } from "@/lib/registro-contenido";

export type Opcion = { id: string; label: string };
export type Pregunta =
  | { id: string; tipo: "chips"; enunciado: string; opciones: Opcion[]; maxSelect?: number; opcional?: boolean }
  | { id: string; tipo: "options"; enunciado: string; opciones: Opcion[]; placeholder?: string | undefined; opcional?: boolean }
  | { id: string; tipo: "text"; enunciado: string; placeholder?: string | undefined; opcional?: boolean }
  | { id: string; tipo: "check"; enunciado: string; opcional?: boolean };
export type ItemPractica = { id: string; titulo: string; desc?: string | undefined };
export type Extra = { id: string; seccion: string; titulo: string; desc?: string | undefined; pregunta?: Pregunta };
export type Referencia =
  | { tipo: "nota"; key: string; titulo: string }
  | { tipo: "respuesta"; dia: number; preguntaId: string; titulo: string }
  | { tipo: "dias"; dias: number[]; titulo: string };
export type DiaConfig = {
  n: number;
  practica: ItemPractica[];
  extras: Extra[];
  preguntas: Pregunta[];
  referencias?: Referencia[] | undefined;
  practicaNota?: string | undefined;
  reflexionNota?: string | undefined;
  enlacePlan?: boolean | undefined;
  autoevaluacion?: { texto: string; boton: string; moment: "cierre_semana1" | "cierre_semana2" | "dia21" } | undefined;
};

export const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const limpio = (s: string) => s.replace(/\*\*|\*/g, "").replace(/\{([^}]+)\}/g, "$1").trim();
const sinTiempo = (s: string) => s.replace(/\s*\([^)]*min\)\s*$/i, "").trim();
const pad = (n: number) => String(n).padStart(2, "0");
const opciones = (labels: string[]): Opcion[] => labels.map((label) => ({ id: slug(label), label }));

// Descripciones del libro para los ítems de práctica que no traen nota propia (Días 1 y 2).
const DESC_BASE: Record<string, string> = {
  escaneo_corporal:
    "Recorrer mentalmente el cuerpo de la cabeza a los pies, prestando atención a la tensión acumulada en cada zona sin intentar cambiarla, solo notándola.",
  respiracion_de_coherencia_cardiaca: "Inhalar 5 segundos por nariz, exhalar 5 segundos por la boca.",
  visualizacion_dirigida: "Vos mismo ya enfocado, mandíbula relajada, respiración lenta.",
};

function grupos(n: number): RetoGrupo[] {
  for (const s of Object.values(SEMANAS)) {
    const d = s.diasLista.find((x) => x.n === n);
    if (d) return d.grupos;
  }
  return [];
}

function porDefecto(n: number): DiaConfig {
  const g = grupos(n);
  const pc = g.find((x) => x.label.startsWith("Práctica corporal"));
  const practica = (pc?.items ?? []).map((it) => {
    const titulo = sinTiempo(limpio(it.text));
    const id = slug(titulo);
    return { id, titulo, desc: it.note ? limpio(it.note) : DESC_BASE[id] };
  });
  const ex = g.find((x) => x.label.startsWith("Ejercicio adicional") || x.label.startsWith("Aplicación práctica"));
  const seccion = ex ? sinTiempo(ex.label) : "";
  const extras: Extra[] = ex
    ? [{ id: `d${pad(n)}.extra`, seccion, titulo: seccion, desc: ex.items.map((i) => limpio(i.text) + (i.note ? ` ${limpio(i.note)}` : "")).join(" ") }]
    : [];
  const rf = g.find((x) => x.label.startsWith("Reflexión"));
  const enunciado = (rf?.items ?? []).map((i) => limpio(i.text)).join(" ");
  const preguntas: Pregunta[] = enunciado ? [{ id: `d${pad(n)}.r1`, tipo: "text", enunciado, placeholder: "Escribí acá tu reflexión." }] : [];
  return { n, practica, extras, preguntas };
}

const OVERRIDES: Record<number, Partial<DiaConfig>> = {
  8: {
    preguntas: [
      {
        id: "d08.r1",
        tipo: "chips",
        enunciado: "¿Qué es lo que más me molesta de alguien cercano?",
        opciones: opciones([
          "Critica o juzga", "Se queja de todo", "No escucha", "Controla o quiere tener razón", "Se hace la víctima",
          "No cumple lo que dice", "Presume o se cree superior", "Es egoísta", "Busca ser el centro de atención",
          "Se enoja con facilidad", "Es frío/a o distante",
        ]),
      },
      {
        id: "d08.r2",
        tipo: "options",
        enunciado: "¿Hay algo de eso que yo mismo hago o temo hacer?",
        opciones: opciones(["Sí, a veces lo hago", "Sí, temo hacerlo", "Todavía no lo sé", "No, nada de eso"]),
        placeholder: "Si querés, escribí qué notás sin corregirte.",
      },
    ],
  },
};

export function diaConfig(n: number): DiaConfig {
  return contenidoDia(n) ?? { ...porDefecto(n), ...OVERRIDES[n] };
}

// ---------- Respuestas ----------
export type Respuesta = { selected?: string[] | string | null; other?: string; note?: string; text?: string; done?: boolean };
export type Respuestas = Record<string, Respuesta>;

export function textoRespuesta(p: Pregunta, r?: Respuesta): string[] {
  if (!r) return [];
  if (p.tipo === "text") return r.text?.trim() ? [r.text.trim()] : [];
  if (p.tipo === "check") return r.done ? ["Lo hice"] : [];
  const ids = Array.isArray(r.selected) ? r.selected : typeof r.selected === "string" ? [r.selected] : [];
  const labels = ids.filter((id) => id !== "otro").map((id) => p.opciones.find((o) => o.id === id)?.label).filter((s): s is string => !!s);
  if (r.other?.trim()) labels.push(r.other.trim());
  const out = labels.length ? [labels.join(", ")] : [];
  if (r.note?.trim()) out.push(r.note.trim());
  return out;
}

export function tieneRespuesta(p: Pregunta, r?: Respuesta): boolean {
  if (!r) return false;
  if (p.tipo === "chips") {
    const sel = Array.isArray(r.selected) ? r.selected : [];
    // Día 8 conserva el campo Otro y su completitud original.
    if (p.id.startsWith("d08.")) return sel.length > 0 || !!r.other?.trim();
    return sel.length > 0 && (!p.maxSelect || sel.length <= p.maxSelect) && sel.every((id) => p.opciones.some((o) => o.id === id));
  }
  if (p.tipo === "options") return (typeof r.selected === "string" && p.opciones.some((o) => o.id === r.selected)) || (p.id.startsWith("d08.") && !!r.note?.trim());
  if (p.tipo === "text") return !!r.text?.trim();
  return !!r.done;
}

// Reglas de completitud: editá acá qué se exige para guardar un día como completo.
export const COMPLETION_RULES = {
  practicaCompleta: true, // todos los ítems de Práctica corporal tildados
  extrasCompletos: true, // ejercicio adicional / aplicación práctica tildados
  reflexionCompleta: true, // cada pregunta no opcional con al menos una respuesta
  focoRequerido: true, // calificación de foco elegida
};

export type Borrador = { logged_on: string; practice_items: string[]; responses: Respuestas; focus: number | null };
export type Faltante = "practica" | "extras" | "reflexion" | "foco";

export function faltantes(cfg: DiaConfig, b: Borrador): Faltante[] {
  const f: Faltante[] = [];
  if (COMPLETION_RULES.practicaCompleta && !cfg.practica.every((i) => b.practice_items.includes(i.id))) f.push("practica");
  if (COMPLETION_RULES.extrasCompletos && !cfg.extras.every((e) => e.pregunta ? tieneRespuesta(e.pregunta, b.responses[e.id]) : b.practice_items.includes(e.id))) f.push("extras");
  if (COMPLETION_RULES.reflexionCompleta && !cfg.preguntas.every((p) => p.opcional || tieneRespuesta(p, b.responses[p.id]))) f.push("reflexion");
  if (COMPLETION_RULES.focoRequerido && !b.focus) f.push("foco");
  return f;
}

export const FALTANTE_LABEL: Record<Faltante, string> = {
  practica: "práctica corporal",
  extras: "ejercicio del día",
  reflexion: "reflexión escrita",
  foco: "calificación de foco",
};

// ---------- Fechas (siempre fecha local del dispositivo) ----------
export function hoyLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[(m ?? 1) - 1]} de ${y}`;
}

// ---------- Datos ----------
export type LogDia = {
  day_number: number;
  status: "draft" | "completed";
  logged_on: string;
  practice_items: string[];
  responses: Respuestas;
  focus_level: number | null;
};

export async function cargarLogs(): Promise<LogDia[]> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("day_number, status, logged_on, practice_items, responses, focus_level")
    .order("day_number");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    day_number: r.day_number,
    status: r.status === "completed" ? "completed" : "draft",
    logged_on: r.logged_on,
    practice_items: Array.isArray(r.practice_items) ? (r.practice_items as string[]) : [],
    responses: (r.responses && typeof r.responses === "object" && !Array.isArray(r.responses) ? r.responses : {}) as Respuestas,
    focus_level: r.focus_level,
  }));
}

export function diaActual(logs: LogDia[]): number {
  for (let n = 1; n <= 21; n++) if (!logs.some((l) => l.day_number === n && l.status === "completed")) return n;
  return 22; // reto completo
}

export async function guardarDia(n: number, b: Borrador, status: "draft" | "completed") {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sin sesión");
  const cfg = diaConfig(n);
  const { error } = await supabase.from("daily_logs").upsert(
    {
      user_id: u.user.id,
      day_number: n,
      status,
      logged_on: b.logged_on,
      practice_items: [...b.practice_items, ...cfg.extras.filter((e) => e.pregunta && tieneRespuesta(e.pregunta, b.responses[e.id]) && !b.practice_items.includes(e.id)).map((e) => e.id)],
      practica_completa: cfg.practica.length > 0 && cfg.practica.every((i) => b.practice_items.includes(i.id)),
      responses: b.responses as never,
      focus_level: b.focus,
    },
    { onConflict: "user_id,day_number" },
  );
  if (error) throw error;
}

export async function cargarFeedback(): Promise<number | null> {
  const { data } = await supabase.from("challenge_feedback").select("rating").maybeSingle();
  return data?.rating ?? null;
}

export async function guardarFeedback(rating: number) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sin sesión");
  const { error } = await supabase
    .from("challenge_feedback")
    .upsert({ user_id: u.user.id, rating, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}

export const INSTRUCTIVO_PDF = "/downloads/instructivo-registro-diario.pdf";

export const logsQuery = { queryKey: ["registro-logs"], queryFn: cargarLogs };

export function estadoDe(n: number, logs: LogDia[]): "completado" | "actual" | "pendiente" {
  if (logs.some((l) => l.day_number === n && l.status === "completed")) return "completado";
  return n === diaActual(logs) ? "actual" : "pendiente";
}
