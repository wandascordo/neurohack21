// Mis notas: ejercicios de cierre de los Módulos 1 a 5 (tabla module_notes, una fila por campo).
import { supabase } from "@/integrations/supabase/client";
import { MESES } from "@/lib/registro";

export type CampoNota =
  | { key: string; tipo: "text"; etiqueta?: string; placeholder?: string; rows?: number }
  | { key: string; tipo: "rating"; etiqueta: string };

export type NotaModulo = { n: number; titulo: string; consigna: string[]; campos: CampoNota[] };

const PIE = "Podés anotarlo en un papel, en las notas del celular o directamente acá.";

export const NOTAS: NotaModulo[] = [
  {
    n: 1,
    titulo: "Mi registro de 24 horas",
    consigna: [
      "Durante 24 horas, sin cambiar todavía ningún hábito, anotá cada vez que notes que “volviste” de una distracción (el celular, un pensamiento, una notificación): la hora y qué te distrajo.",
      "Podés ir anotándolo en un papel o en las notas del celular y pasarlo acá después. No juzgues el resultado, solo observá.",
    ],
    campos: [{ key: "m1_registro", tipo: "text", placeholder: "10:40 AM, revisé el celular sin motivo" }],
  },
  {
    n: 2,
    titulo: "Mi momento en piloto automático",
    consigna: [
      "Elegí un momento del día en el que normalmente actuás en piloto automático (agarrar el celular al despertar, por ejemplo). Hacelo una sola vez, con atención plena a cada movimiento: notá el impulso antes de actuar, la sensación en el cuerpo y el momento exacto en que la mano se mueve. No hace falta que cambies la acción, solo que la observes.",
      PIE,
    ],
    campos: [{ key: "m2_observacion", tipo: "text", etiqueta: "¿Qué notaste?", placeholder: "El impulso, la sensación en el cuerpo, el momento en que la mano se mueve..." }],
  },
  {
    n: 3,
    titulo: "La tarea que más postergo",
    consigna: [
      "Pensá en la tarea que más postergás últimamente, la que “siempre encontrás una excusa” para no hacer. Sin juzgarte, anotá cuál es y respondé con honestidad la pregunta de abajo. No busques la respuesta “correcta”: dejá que aparezca lo primero que se te ocurra, aunque parezca ilógico.",
      PIE,
    ],
    campos: [
      { key: "m3_tarea", tipo: "text", etiqueta: "¿Cuál es la tarea?", placeholder: "Ej: Responder el mail de un cliente", rows: 2 },
      { key: "m3_pregunta", tipo: "text", etiqueta: "Si postergar esta tarea me estuviera protegiendo de sentir algo incómodo, ¿qué sería?" },
    ],
  },
  {
    n: 4,
    titulo: "Mi primera secuencia completa",
    consigna: [
      "Antes de tu próximo bloque de trabajo, probá la secuencia completa: un minuto de escaneo corporal, tres minutos de respiración de coherencia cardíaca (5 segundos de inhalación, 5 de exhalación) y un minuto de visualización dirigida de vos mismo ya enfocado. Después, calificá qué tan presente te sentiste durante los primeros diez minutos de trabajo, comparado con un día en el que empezás a trabajar sin esta preparación.",
      PIE,
    ],
    campos: [
      { key: "m4_presencia", tipo: "rating", etiqueta: "¿Qué tan presente te sentiste durante los primeros diez minutos de trabajo?" },
      { key: "m4_comentario", tipo: "text", etiqueta: "Comparado con un día sin esta preparación, ¿qué notaste?" },
    ],
  },
  {
    n: 5,
    titulo: "Mi diálogo interno",
    consigna: [
      "Elegí la tarea que identificaste en el Módulo 3 como la que más postergás. Después de tu secuencia de regulación corporal, escribí cinco minutos de diálogo interno dándole voz, en primera persona, a la parte de vos que te lleva a postergarla. No busques resolver nada ni llegar a una conclusión ordenada: dejá que el ejercicio sea exploratorio.",
      PIE,
    ],
    campos: [{ key: "m5_dialogo", tipo: "text", etiqueta: "Tu diálogo interno", placeholder: "Yo soy la parte de vos que posterga. Lo que quiero decirte es...", rows: 12 }],
  },
];

export type FilaNota = { module_number: number; field_key: string; value_text: string | null; value_number: number | null; updated_at: string };

export const notasQuery = {
  queryKey: ["module-notes"] as const,
  queryFn: async (): Promise<FilaNota[]> => {
    const { data, error } = await supabase.from("module_notes").select("module_number, field_key, value_text, value_number, updated_at");
    if (error) throw error;
    return data ?? [];
  },
};

export const tieneContenido = (f: FilaNota) => !!f.value_text?.trim() || f.value_number != null;

export function editadoEl(filas: FilaNota[], n: number): string | null {
  const con = filas.filter((f) => f.module_number === n && tieneContenido(f));
  if (!con.length) return null;
  const max = con.reduce((a, f) => (f.updated_at > a ? f.updated_at : a), con[0]!.updated_at);
  const d = new Date(max);
  return `Editado el ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

export async function guardarNota(n: number, key: string, valor: { text?: string | null; number?: number | null }) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sin sesión");
  const text = valor.text?.trim() ? valor.text : null;
  const { error } = await supabase.from("module_notes").upsert(
    { user_id: u.user.id, module_number: n, field_key: key, value_text: text, value_number: valor.number ?? null, updated_at: new Date().toISOString() },
    { onConflict: "user_id,module_number,field_key" },
  );
  if (error) throw error;
}
