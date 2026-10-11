// Configuración del prompt 3. El Día 8 conserva su configuración Figma en registro.ts.
import type { DiaConfig, Pregunta, Opcion, Referencia } from "./registro";

const opciones = (pairs: string[]): Opcion[] => pairs.map((s) => { const [id = "", label = ""] = s.split("|"); return { id, label }; });
const otro = "otro|Otro (opcional)";
function q(n: number, k: number, tipo: "chips", enunciado: string, pairs?: string[], opcional?: boolean): Extract<Pregunta, { tipo: "chips" }>;
function q(n: number, k: number, tipo: "options" | "text", enunciado: string, pairs?: string[], opcional?: boolean): Pregunta;
function q(n: number, k: number, tipo: "chips" | "options" | "text", enunciado: string, pairs: string[] = [], opcional = false): Pregunta {
  const id = `d${String(n).padStart(2, "0")}.r${k}`;
  if (tipo === "text") return { id, tipo, enunciado, opcional, placeholder: "Escribí acá tu reflexión." };
  return { id, tipo, enunciado, opciones: opciones(pairs), opcional };
}
const completa = [
  "Escaneo corporal (2 minutos)",
  "Respiración de coherencia cardíaca (3 a 5 minutos: inhalar 5 segundos por la nariz, exhalar 5 segundos)",
  "Visualización dirigida (1 a 3 minutos)",
];
const breve = ["Respiración de coherencia cardíaca", "Visualización breve"];
const nota = (key: string, titulo: string): Referencia => ({ tipo: "nota", key, titulo });
const respiracionNota = "Si notás que te cuesta sostener la respiración pautada, está bien acortar a 2 minutos, la constancia importa más que la duración.";
const dias: Record<number, { preguntas: Pregunta[]; practica?: string[]; practicaNota?: string; referencias?: Referencia[]; extra?: { titulo: string; desc?: string; opciones?: string[] }; autoevaluacion?: string; reflexionNota?: string; plan?: boolean }> = {
  1: {
    practica: ["Escaneo corporal (2 minutos)", "Respiración de coherencia cardíaca (3 minutos)", "Lo hice antes de mi primer bloque de trabajo del día"],
    referencias: [nota("m1_registro", "Mi registro de 24 horas · Módulo 1")],
    preguntas: [q(1, 1, "chips", "¿En qué momento del día aparece con más frecuencia el patrón de distracción que más se repitió?", ["manana_temprano|Mañana temprano", "media_manana|Media mañana", "despues_de_almorzar|Después de almorzar", "media_tarde|Media tarde", "noche|Noche", "al_empezar_una_tarea|Al empezar una tarea", "cuando_se_pone_dificil|Cuando la tarea se pone difícil", otro])],
  },
  2: { practica: [completa[0] ?? "", completa[1] ?? "", "Visualización dirigida (1 minuto): vos mismo ya enfocado, mandíbula relajada, respiración lenta"], preguntas: [
    q(2, 1, "chips", "¿Cómo se siente en el cuerpo el momento exacto antes de distraerte?", ["tension_mandibula|Tensión en la mandíbula", "tension_hombros|Tensión en los hombros", "inquietud_piernas|Inquietud en las piernas", "opresion_pecho|Opresión en el pecho", "estomago_cerrado|Estómago cerrado", "calor|Calor", "cansancio|Cansancio", "aburrimiento|Aburrimiento", "ganas_de_moverme|Ganas de moverme", otro]),
    q(2, 2, "text", "Describí con detalle sensorial cómo se siente en el cuerpo el momento exacto antes de distraerte (tensión, inquietud, aburrimiento). No analices todavía, solo describí la sensación física.", [], true),
  ] },
  3: { preguntas: [{ ...q(3, 1, "chips", "¿Qué disparador externo (notificación, ruido, persona) precede más seguido a tu distracción? Anotá los tres disparadores más frecuentes de estos primeros tres días.", ["notificaciones|Notificaciones del celular", "mensajes|Mensajes", "redes_sociales|Redes sociales", "correo|Correo electrónico", "ruido|Ruido del entorno", "personas|Interrupciones de otras personas", "pestanas|Pestañas abiertas", "desorden|Desorden en el escritorio", "pensamientos|Mis propios pensamientos", otro]), maxSelect: 3 }],
    extra: { titulo: "Diseñá tu entorno de trabajo para hoy eliminando uno de esos tres disparadores.", opciones: ["celular_otra_habitacion|Dejé el celular en otra habitación", "notificaciones_apagadas|Apagué las notificaciones", "pestanas_cerradas|Cerré pestañas y aplicaciones", "escritorio_ordenado|Ordené mi escritorio", "ruido_reducido|Reduje el ruido", otro] },
  },
  4: { practica: ["Escaneo corporal (prestá especial atención a la mandíbula y los hombros)", completa[1] ?? "", completa[2] ?? ""], referencias: [nota("m3_tarea", "La tarea que más postergo · Módulo 3"), nota("m3_pregunta", "Lo que estoy evitando sentir · Módulo 3")], preguntas: [
    q(4, 1, "chips", "Retomá la pregunta del Módulo 3: si postergar esta tarea me estuviera protegiendo de sentir algo incómodo, ¿qué sería?", ["aburrimiento|Aburrimiento", "miedo_a_fallar|Miedo a fallar", "verguenza|Vergüenza", "ansiedad|Ansiedad", "no_ser_suficiente|Sensación de no ser suficiente", "incertidumbre|Incertidumbre", "cansancio|Cansancio", otro]),
    q(4, 2, "text", "Escribí sobre la misma tarea que identificaste entonces (la tenés anotada en Mis Notas), sumando cualquier detalle nuevo que haya aparecido esta semana.", [], true),
  ] },
  5: { practicaNota: respiracionNota, preguntas: [
    q(5, 1, "options", "¿Lograste notar la distracción y redirigir la atención sin actuar sobre ella?", ["si_lo_logre|Sí, lo logré", "estuve_cerca|Estuve cerca", "todavia_no|Todavía no me pasó"]),
    q(5, 2, "text", "Elegí un momento de esta semana en el que lograste notar la distracción y redirigir la atención sin llegar a actuar sobre ella (revisar el celular, abrir otra pestaña). Describilo. Si todavía no te pasó, describí el momento en que estuviste más cerca de lograrlo."),
  ] },
  6: { practica: [...completa, "La hice en un horario distinto al habitual"], referencias: [{ tipo: "dias", dias: [1, 2, 3, 4, 5], titulo: "Reflexiones de los Días 1 a 5" }], preguntas: [
    q(6, 1, "chips", "Repasá lo que escribiste en los días 1 a 5, en tu Registro Diario o donde lo hayas anotado. ¿Qué patrón se repite con más claridad?", ["revisar_celular|Revisar el celular", "abrir_pestana|Abrir otra pestaña", "postergar_tarea_dificil|Postergar la tarea difícil", "buscar_comida|Buscar algo para comer o tomar", "cambiar_de_tarea|Cambiar de tarea", "perfeccionismo|Perfeccionismo al empezar", "pensamientos|Pensamientos que me sacan del foco", otro]), q(6, 2, "text", "Escribilo en una sola frase."),
  ] },
  7: { preguntas: [q(7, 1, "text", "¿Qué cambió, aunque sea levemente, en tu capacidad de notar la distracción a tiempo?"), q(7, 2, "text", "¿Qué no cambió todavía, y está bien que no haya cambiado?")], autoevaluacion: "Repetí la misma autoevaluación de foco que hiciste antes del Día 1 y comparala. No busques un salto enorme, buscá cualquier diferencia, por mínima que sea." },
  9: { preguntas: [q(9, 1, "text", "Diálogo interno. Escribí una conversación en primera persona con la parte de vos que genera tu distracción principal, empezando con: “Yo, la parte que te hace [tu patrón principal], existo porque…”. Dejá que la escritura fluya sin corregirte. Anotalo donde te resulte más cómodo (papel, notas del celular o Mis Notas) y guardalo, porque en el Día 11 vas a retomarlo.")] },
  10: { practicaNota: "Si ayer faltaste o te salteaste algún día, no reiniciás el proceso: seguís donde estabas.", preguntas: [
    q(10, 1, "chips", "¿Qué tipo de imagen recurrente apareció esta semana en sueños, pensamientos espontáneos o momentos de distracción?", ["lugar|Un lugar", "objeto|Un objeto", "escena|Una escena", "persona|Una persona", "animal|Un animal", "agua|Agua", "camino_o_puerta|Un camino o una puerta", "fuego_o_luz|Fuego o luz", otro]), q(10, 2, "text", "Símbolos personales. Anotá cualquier imagen recurrente que haya aparecido esta semana en sueños, pensamientos espontáneos o momentos de distracción (un lugar, un objeto, una escena). No la interpretes todavía, solo registrala."),
  ] },
  11: { referencias: [{ tipo: "respuesta", dia: 9, preguntaId: "d09.r1", titulo: "Diálogo interno · Día 9" }, nota("m5_dialogo", "Mi diálogo interno · Módulo 5")], preguntas: [q(11, 1, "text", "Volvé al diálogo interno del Día 9 y agregale una segunda voz: la parte de vos que sí quiere sostener el foco. Escribí un intercambio breve entre ambas partes, sin forzar una resolución.")] },
  12: { preguntas: [q(12, 1, "options", "Pensá en el patrón arquetípico del Módulo 5 (Niño Herido, Perfeccionista, Cuidador, u otro que reconozcas) que más se parece a tu propio patrón de distracción.", ["nino_herido|Niño Herido", "perfeccionista|Perfeccionista", "cuidador|Cuidador", otro]), q(12, 2, "text", "Escribí un ejemplo concreto de esta semana donde ese patrón se activó.")] },
  13: { practica: [...completa, "La hice de memoria, sin releer las instrucciones"], preguntas: [q(13, 1, "options", "¿Qué parte del trabajo de esta semana (la escritura de sombra, el diálogo interno, los símbolos) te generó más resistencia a hacerla?", ["escritura_de_sombra|La escritura de sombra", "dialogo_interno|El diálogo interno", "simbolos|Los símbolos personales", "ninguna|Ninguna en particular"]), q(13, 2, "text", "¿Qué creés que señala esa resistencia?", [], true)], reflexionNota: "Esa resistencia suele señalar justamente el material más relevante para vos." },
  14: { preguntas: [q(14, 1, "chips", "¿Qué contenido inconsciente aparece de forma más consistente detrás de tu distracción principal?", ["miedo|Miedo", "verguenza|Vergüenza", "necesidad_no_reconocida|Una necesidad no reconocida", otro]), q(14, 2, "text", "Cierre de semana. Repasá todo lo escrito en los días 8 a 13."), q(14, 3, "text", "Registrá en una frase qué tan distinta se siente tu relación con la distracción ahora, comparado con el Día 1.")], autoevaluacion: "Repetí la autoevaluación de foco y comparala con la de la Semana 1." },
  15: { referencias: [nota("m3_tarea", "La tarea que más postergo · Módulo 3")], extra: { titulo: "Elegí la tarea que más solés postergar y hacé el primer bloque de trabajo del día directamente sobre ella, inmediatamente después de la práctica corporal." }, preguntas: [q(15, 1, "text", "¿Cómo fue empezar esa tarea hoy, comparado con lo que anotaste en Mis Notas cuando hiciste el ejercicio del Módulo 3?")] },
  16: { extra: { titulo: "Apliqué la pausa de “notar y redirigir” en una situación real, sin la secuencia completa de regulación." }, preguntas: [q(16, 1, "chips", "¿En qué situación?", ["reunion|Una reunión", "conversacion|Una conversación", "tarea_domestica|Una tarea doméstica", "trabajo|Trabajo", "estudio|Estudio", otro]), q(16, 2, "text", "Describí esa situación y qué hiciste distinto a como hubieras reaccionado hace tres semanas.")] },
  17: { extra: { titulo: "Sostuve un bloque de trabajo de al menos 25 minutos sin revisar el celular, usando solo la práctica corporal como preparación." }, preguntas: [q(17, 1, "chips", "¿Qué impulso apareció durante esos 25 minutos?", ["revisar_celular|Revisar el celular", "abrir_pestana|Abrir otra pestaña", "levantarme|Levantarme", "revisar_mensajes|Revisar mensajes", "pensar_en_otra_tarea|Pensar en otra tarea", "comer_o_tomar|Comer o tomar algo", otro]), q(17, 2, "options", "¿Cómo lo manejaste?", ["note_y_redirigi|Lo noté y redirigí la atención", "cedi_y_volvi|Cedí un momento y volví", "cedi_y_no_volvi|Cedí y no volví al bloque"])] },
  18: { extra: { titulo: "Elegí conscientemente no aplicar ninguna técnica en un momento de distracción y observá qué pasa.", desc: "Este ejercicio busca que notes la diferencia entre actuar con conciencia y dejarte llevar por el piloto automático, sin culpa en ninguno de los dos casos." }, preguntas: [q(18, 1, "text", "¿Qué diferencia notaste entre este momento sin intervención y los momentos donde sí aplicaste el método?")] },
  19: { extra: { titulo: "Aplicá el método completo (regulación + introspección breve) en una situación de estrés real del día, no solo en el bloque de trabajo habitual." }, preguntas: [q(19, 1, "text", "¿Cómo cambió tu capacidad de sostener el foco bajo estrés, comparado con el Día 1?")] },
  20: { preguntas: [q(20, 1, "chips", "¿Cuáles de todos los ejercicios del reto te resultaron más efectivos y te gustaría sostener después del día 21?", ["escaneo_corporal|Escaneo corporal", "respiracion|Respiración de coherencia", "visualizacion|Visualización", "escritura_de_sombra|Escritura de sombra", "dialogo_interno|Diálogo interno", "simbolos|Símbolos personales", otro]), q(20, 2, "text", "Empezá a esbozar tu propio sistema de mantenimiento.")], plan: true },
  21: { preguntas: [q(21, 1, "text", "¿Qué cambió realmente en estos 21 días?"), q(21, 2, "text", "¿Qué frase escribiste en el Módulo 6 sobre tus expectativas, y qué tan cerca estás de eso hoy?"), q(21, 3, "text", "¿Qué te llevás para seguir sosteniendo después de hoy?")], reflexionNota: "Podés volcar esta comparación en el gráfico de progreso del Tracker Visual de 21 Días.", autoevaluacion: "Repetí la autoevaluación de foco por última vez y compará las cuatro mediciones (inicial, Semana 1, Semana 2, hoy). Guardá esta comparación, porque la vas a usar como punto de partida para tu plan de mantenimiento." },
};

export function contenidoDia(n: number): DiaConfig | undefined {
  const d = dias[n];
  if (!d) return;
  const pref = `d${String(n).padStart(2, "0")}`;
  const titulos = d.practica ?? (n >= 15 && n <= 20 ? breve : completa);
  return {
    n,
    practica: titulos.map((titulo, i) => ({ id: `${pref}.p${i + 1}`, titulo })),
    preguntas: d.preguntas,
    extras: d.extra ? [{ id: `${pref}.extra`, seccion: n < 15 ? "Ejercicio adicional" : "Aplicación práctica", titulo: d.extra.titulo, desc: d.extra.desc, ...(d.extra.opciones ? { pregunta: { id: `${pref}.extra`, tipo: "chips" as const, enunciado: d.extra.titulo, opciones: opciones(d.extra.opciones) } } : {}) }] : [],
    practicaNota: d.practicaNota,
    referencias: d.referencias,
    reflexionNota: d.reflexionNota,
    enlacePlan: d.plan,
    autoevaluacion: d.autoevaluacion ? { texto: d.autoevaluacion, boton: "Hacer la autoevaluación de foco", moment: n === 7 ? "cierre_semana1" : n === 14 ? "cierre_semana2" : "dia21" } : undefined,
  };
}
