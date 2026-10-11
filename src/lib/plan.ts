// Mi plan de mantenimiento: opciones sugeridas (contenido editable) + acceso a datos
// (maintenance_rituals para el ritual mínimo, implementation_intentions para las intenciones).
import { supabase } from "@/integrations/supabase/client";
import { slug, type Opcion } from "@/lib/registro";

const ops = (labels: string[]): Opcion[] => labels.map((label) => ({ id: slug(label), label }));

// ---------- Contenido ----------
export const RITUAL_PRACTICAS = ops(["Escaneo corporal", "Respiración de coherencia cardíaca", "Visualización dirigida"]);
export const RITUAL_CUANDO = ops(["Al despertar", "Antes de mi primer bloque de trabajo", "Después del almuerzo", "Antes de dormir"]);

export const SITUACIONES_M7 = ops([
  "Siento el impulso de revisar el celular",
  "Me interrumpen mientras trabajo",
  "Empiezo a postergar una tarea",
  "Noto tensión en la mandíbula o los hombros",
  "Me siento abrumado/a",
]);
export const ACCIONES = ops([
  "Hago tres respiraciones lentas",
  "Vuelvo a la tarea y trabajo cinco minutos",
  "Dejo el celular fuera de mi vista",
  "Hago un escaneo corporal breve",
  "Anoto qué me distrajo",
]);
export type Contexto = "trabajo" | "estudio" | "relaciones";
export const CONTEXTOS: { id: Contexto; label: string }[] = [
  { id: "trabajo", label: "Trabajo" },
  { id: "estudio", label: "Estudio" },
  { id: "relaciones", label: "Relaciones" },
];
export const SITUACIONES_M8: Record<Contexto, Opcion[]> = {
  trabajo: ops(["Se acumulan mails o mensajes", "Empieza una reunión", "Me interrumpe un compañero/a"]),
  estudio: ops(["Me siento a estudiar y me distraigo", "Se me acumulan las tareas pendientes", "Abro el material y lo dejo"]),
  relaciones: ops(["Estoy en una conversación y me voy mentalmente", "Suena el celular en medio de una charla", "Noto que no estoy presente"]),
};

export const MAX_INTENCIONES = { 7: 3, 8: 1 } as const;

// ---------- Helpers ----------
export const minus = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
export const labelDe = (lista: Opcion[], id: string | null | undefined) => lista.find((o) => o.id === id)?.label ?? null;
export const parte = (lista: Opcion[], id: string | null | undefined, otro: string | null | undefined) => {
  const t = otro?.trim() ? otro.trim() : labelDe(lista, id);
  return t ? minus(t) : null;
};
export const frase = (si: string, entonces: string) => `“Si ${si}, entonces ${entonces}”.`;
export const situacionesDe = (mod: 7 | 8, ctx: Contexto | null) => (mod === 7 ? SITUACIONES_M7 : ctx ? SITUACIONES_M8[ctx] : []);

// ---------- Ritual ----------
export type Ritual = { ritual_practice_id: string | null; ritual_practice_other: string | null; ritual_when_id: string | null; ritual_when_other: string | null };
export const RITUAL_VACIO: Ritual = { ritual_practice_id: null, ritual_practice_other: null, ritual_when_id: null, ritual_when_other: null };

export const ritualQuery = {
  queryKey: ["maintenance-ritual"] as const,
  queryFn: async (): Promise<Ritual> => {
    const { data, error } = await supabase
      .from("maintenance_rituals")
      .select("ritual_practice_id, ritual_practice_other, ritual_when_id, ritual_when_other")
      .maybeSingle();
    if (error) throw error;
    return data ?? RITUAL_VACIO;
  },
};

export const ritualPractica = (r: Ritual) => (r.ritual_practice_other?.trim() || labelDe(RITUAL_PRACTICAS, r.ritual_practice_id)) ?? null;
export const ritualCuando = (r: Ritual) => (r.ritual_when_other?.trim() || labelDe(RITUAL_CUANDO, r.ritual_when_id)) ?? null;

export async function guardarRitual(r: Ritual) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sin sesión");
  const p = ritualPractica(r);
  const c = ritualCuando(r);
  const texto = [p, c ? minus(c) : null].filter(Boolean).join(", ");
  const { error } = await supabase.from("maintenance_rituals").upsert(
    {
      user_id: u.user.id,
      ritual: texto,
      ritual_practice_id: r.ritual_practice_id,
      ritual_practice_other: r.ritual_practice_other?.trim() ? r.ritual_practice_other : null,
      ritual_when_id: r.ritual_when_id,
      ritual_when_other: r.ritual_when_other?.trim() ? r.ritual_when_other : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

// ---------- Intenciones ----------
export type Intencion = {
  id: string;
  source_module: number;
  context: Contexto | null;
  if_option_id: string | null;
  if_other: string | null;
  then_option_id: string | null;
  then_other: string | null;
  position: number;
};

export const intencionesQuery = {
  queryKey: ["implementation-intentions"] as const,
  queryFn: async (): Promise<Intencion[]> => {
    const { data, error } = await supabase
      .from("implementation_intentions")
      .select("id, source_module, context, if_option_id, if_other, then_option_id, then_other, position")
      .order("position")
      .order("created_at");
    if (error) throw error;
    return (data ?? []) as Intencion[];
  },
};

export const fraseDe = (i: Pick<Intencion, "source_module" | "context" | "if_option_id" | "if_other" | "then_option_id" | "then_other">) => {
  const si = parte(situacionesDe(i.source_module as 7 | 8, i.context), i.if_option_id, i.if_other);
  const en = parte(ACCIONES, i.then_option_id, i.then_other);
  return si && en ? frase(si, en) : null;
};

export type BorradorIntencion = Omit<Intencion, "id" | "position"> & { id: string | null; position: number };

export async function guardarIntencion(b: BorradorIntencion): Promise<string> {
  const si = parte(situacionesDe(b.source_module as 7 | 8, b.context), b.if_option_id, b.if_other);
  const en = parte(ACCIONES, b.then_option_id, b.then_other);
  if (!si || !en) throw new Error("Incompleta");
  const fila = {
    source_module: b.source_module,
    context: b.context,
    if_option_id: b.if_other?.trim() ? null : b.if_option_id,
    if_other: b.if_other?.trim() ? b.if_other : null,
    then_option_id: b.then_other?.trim() ? null : b.then_option_id,
    then_other: b.then_other?.trim() ? b.then_other : null,
    if_situation: si,
    then_action: en,
    position: b.position,
  };
  if (b.id) {
    const { error } = await supabase.from("implementation_intentions").update(fila).eq("id", b.id);
    if (error) throw error;
    return b.id;
  }
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sin sesión");
  const { data, error } = await supabase.from("implementation_intentions").insert({ ...fila, user_id: u.user.id }).select("id").single();
  if (error) throw error;
  return data.id;
}

export async function eliminarIntencion(id: string) {
  const { error } = await supabase.from("implementation_intentions").delete().eq("id", id);
  if (error) throw error;
}
