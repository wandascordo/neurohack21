// Contenido de la Parte III (exports de Figma «Parte III – Recapitulando / Semana 1-3»).
// Marcado de texto: **negrita**, *cursiva*, {Texto del enlace} (ver RETO_LINKS).

export const RETO_LINKS: Record<string, "/registro-diario" | "/autoevaluacion" | "/tracker"> = {
  "Registro Diario": "/registro-diario",
  "Autoevaluación de Foco": "/autoevaluacion",
  "Tracker Visual de 21 Días": "/tracker",
};

export type RetoItem = { text: string; note?: string };
export type RetoGrupo = { label: string; items: RetoItem[] };
export type RetoDia = { n: number; grupos: RetoGrupo[]; autoevaluacion?: boolean };
export type Semana = {
  numero: 1 | 2 | 3;
  dias: string;
  objetivo: string[];
  recordatorio?: string;
  diasLista: RetoDia[];
};

const ESC = { text: "Escaneo corporal" };
const RESP = { text: "Respiración de coherencia cardíaca" };
const VIS = { text: "Visualización dirigida" };
const CIERRE: RetoGrupo = { label: "Cierre (1 min)", items: [{ text: "Calificá tu foco del 1 al 10." }] };
const PC = (label = "Práctica corporal (8-10 min)", items: RetoItem[] = [ESC, RESP, VIS]): RetoGrupo => ({ label, items });
const BREVE = (label = "Práctica corporal, versión breve (4-5 min)") => PC(label, [RESP, VIS]);
const RECORDATORIO = "Recordá que si faltaste ayer o te salteaste algún día, no reiniciás el proceso, seguís desde donde estabas.";

export const SEMANAS: Record<1 | 2 | 3, Semana> = {
  1: {
    numero: 1,
    dias: "Días 1 a 7",
    objetivo: [
      "Interrumpir el piloto automático de la distracción y entrenar la capacidad de observarlo sin actuar todavía sobre él. El peso principal está en la regulación corporal (Módulo 4) y en el registro consciente de patrones (el ejercicio que empezaste en el Módulo 1).",
      "No se espera un cambio de conducta todavía, se espera conciencia.",
    ],
    diasLista: [
      { n: 1, grupos: [
        PC("Práctica corporal (5 min)", [
          { text: "Escaneo corporal (2 min)", note: "Recorrer mentalmente el cuerpo de la cabeza a los pies, prestando atención a la tensión acumulada en cada zona sin intentar cambiarla, solo notándola." },
          { text: "Respiración de coherencia cardíaca (3 min)", note: "Inhalar 5 segundos por nariz, exhalar 5 segundos por la boca." },
        ]),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Respondé por escrito, sin corregirte: **¿qué es lo que más me molesta de alguien cercano?**" },
          { text: "Después preguntate: **¿hay algo de eso que yo mismo hago o temo hacer?**" },
        ] },
        CIERRE,
      ] },
      { n: 2, grupos: [
        PC("Práctica corporal (6 min)", [ESC, RESP, { text: "Agregá **visualización dirigida** al final (1 min)", note: "Vos mismo ya enfocado, mandíbula relajada, respiración lenta." }]),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Describí con detalle sensorial **cómo se siente en el cuerpo el momento exacto antes de distraerte** (tensión, inquietud, aburrimiento).", note: "No analices todavía, solo describí la sensación física." },
        ] },
        CIERRE,
      ] },
      { n: 3, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Qué disparador externo (notificación, ruido, persona) precede más seguido a tu distracción?", note: "Anotá los tres disparadores más frecuentes de estos primeros tres días." },
        ] },
        { label: "Ejercicio adicional (2 min)", items: [
          { text: "Diseñá tu entorno de trabajo para hoy eliminando uno de esos tres disparadores.", note: "Por ejemplo, dejar el celular en otra habitación durante el bloque principal de foco." },
        ] },
        CIERRE,
      ] },
      { n: 4, grupos: [
        PC(undefined, [{ text: "Escaneo corporal", note: "Hoy, durante el escaneo corporal, prestá especial atención a la mandíbula y los hombros." }, RESP, VIS]),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Retomá la pregunta del Módulo 3: si postergar esta tarea me estuviera protegiendo de sentir algo incómodo, ¿qué sería?", note: "Escribí sobre la misma tarea que identificaste entonces, sumando cualquier detalle nuevo que haya aparecido esta semana." },
        ] },
        CIERRE,
      ] },
      { n: 5, grupos: [
        PC(undefined, [ESC, { text: "Respiración de coherencia cardíaca", note: "Si notás que te cuesta sostener la respiración pautada, está bien acortar a 2 minutos, la constancia importa más que la duración." }, VIS]),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Elegí un momento de esta semana en el que lograste notar la distracción y redirigir la atención sin llegar a actuar sobre ella (revisar el celular, abrir otra pestaña). Describilo.", note: "Si todavía no te pasó, describí el momento en que estuviste más cerca de lograrlo." },
        ] },
        CIERRE,
      ] },
      { n: 6, grupos: [
        PC("Práctica corporal (8-10 min) **en un horario distinto al habitual**, para notar si el estado de partida cambia según el momento del día."),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Repasá tus notas de los días 1 a 5 en tu {Registro Diario}. ¿Qué patrón se repite con más claridad?", note: "Escribilo en una sola frase." },
        ] },
        CIERRE,
      ] },
      { n: 7, autoevaluacion: true, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Respondé: ¿qué cambió, aunque sea levemente, en tu capacidad de notar la distracción a tiempo? ¿Qué no cambió todavía, y está bien que no haya cambiado?" },
        ] },
        { label: "Cierre (1 min)", items: [
          { text: "Repetí la {Autoevaluación de Foco}.", note: "No busques un salto enorme, buscá cualquier diferencia, por mínima que sea, en la frecuencia con la que notás tu propia distracción." },
        ] },
      ] },
    ],
  },
  2: {
    numero: 2,
    dias: "Días 8 a 14",
    objetivo: [
      "Empezar a instalar activamente el circuito nuevo, sumando el trabajo de introspección junguiana (Módulo 5) sobre la base de calma corporal ya entrenada en la Semana 1.",
      "Acá se trabaja más directamente sobre los contenidos inconscientes que sostienen la distracción.",
    ],
    recordatorio: RECORDATORIO,
    diasLista: [
      { n: 8, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Respondé por escrito, sin corregirte: ¿qué es lo que más me molesta de alguien cercano?" },
          { text: "Después preguntate: ¿hay algo de eso que yo mismo hago o temo hacer?" },
        ] },
        CIERRE,
      ] },
      { n: 9, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Diálogo interno. Escribí una conversación en primera persona con la parte de vos que genera tu distracción principal, empezando con: *”Yo, la parte que te hace [tu patrón principal], existo porque…”*", note: "Dejá que la escritura fluya sin corregirte." },
        ] },
        CIERRE,
      ] },
      { n: 10, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Símbolos personales. Anotá cualquier imagen recurrente que haya aparecido esta semana en sueños, pensamientos espontáneos o momentos de distracción (un lugar, un objeto, una escena).", note: "No la interpretes todavía, solo registrala." },
        ] },
        CIERRE,
      ] },
      { n: 11, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Volvé al diálogo interno del Día 9 y agregale una segunda voz: la parte de vos que sí quiere sostener el foco.", note: "Escribí un intercambio breve entre ambas partes, sin forzar una resolución." },
        ] },
        CIERRE,
      ] },
      { n: 12, grupos: [
        PC(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Pensá en el patrón arquetípico del Módulo 5 (Niño Herido, Perfeccionista, Cuidador, u otro que reconozcas) que más se parece a tu propio patrón de distracción.", note: "Escribí un ejemplo concreto de esta semana donde ese patrón se activó." },
        ] },
        CIERRE,
      ] },
      { n: 13, grupos: [
        PC("Práctica corporal (8-10 min), reduciendo la guía paso a paso. **Intentá hacerla de memoria**, sin releer las instrucciones."),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Qué parte del trabajo de esta semana (la escritura de sombra, el diálogo interno, los símbolos) te generó más resistencia a hacerla?", note: "Esa resistencia suele señalar justamente el material más relevante para vos." },
        ] },
        CIERRE,
      ] },
      { n: 14, autoevaluacion: true, grupos: [
        PC("Práctica corporal (8-10 min), reduciendo la guía paso a paso. **Intentá hacerla de memoria**, sin releer las instrucciones."),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Cierre de semana. Repasá todo lo escrito en los días 8 a 13. ¿Qué contenido inconsciente (miedo, vergüenza, necesidad no reconocida) aparece de forma más consistente detrás de tu distracción principal?" },
        ] },
        { label: "Cierre (1 min)", items: [
          { text: "Repetí la {Autoevaluación de Foco}." },
          { text: "Además, registrá en una frase qué tan distinta se siente tu relación con la distracción ahora, comparado con el Día 1." },
        ] },
      ] },
    ],
  },
  3: {
    numero: 3,
    dias: "Días 15 a 21",
    objetivo: [
      "Aplicar lo entrenado en contextos reales, con menos andamiaje guiado, fortaleciendo la autorregulación con pasos más breves y explícitos.",
      "Esta semana es puente hacia el Módulo 7, donde vas a diseñar tu sistema de mantenimiento posterior al reto.",
    ],
    recordatorio: RECORDATORIO,
    diasLista: [
      { n: 15, grupos: [
        BREVE("Práctica corporal, versión breve (4-5 min): **sin escaneo corporal**."),
        { label: "Aplicación práctica (2 min)", items: [
          { text: "Elegí la tarea que más solés postergar y hacé el primer bloque de trabajo del día directamente sobre ella, inmediatamente después de la práctica corporal." },
        ] },
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Cómo fue empezar esa tarea hoy, comparado con cómo la describiste en el Módulo 3?" },
        ] },
        CIERRE,
      ] },
      { n: 16, grupos: [
        BREVE(),
        { label: "Aplicación práctica (2 min)", items: [
          { text: "Notá una situación real del día (una reunión, una conversación, una tarea doméstica) donde apliques la pausa de ”notar y redirigir” sin necesidad de la secuencia completa de regulación." },
        ] },
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Describí esa situación y qué hiciste distinto a como hubieras reaccionado hace tres semanas." },
        ] },
        CIERRE,
      ] },
      { n: 17, grupos: [
        BREVE(),
        { label: "Aplicación práctica (2 min)", items: [
          { text: "Probá sostener un bloque de trabajo de al menos 25 minutos sin revisar el celular, usando únicamente la práctica corporal como preparación previa." },
        ] },
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Qué impulso apareció durante esos 25 minutos, y cómo lo manejaste?" },
        ] },
        CIERRE,
      ] },
      { n: 18, grupos: [
        BREVE(),
        { label: "Aplicación práctica (2 min)", items: [
          { text: "Elegí conscientemente no aplicar ninguna técnica en un momento de distracción y observá qué pasa.", note: "Este ejercicio busca que notes la diferencia entre actuar con conciencia y dejarte llevar por el piloto automático, sin culpa en ninguno de los dos casos." },
        ] },
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Qué diferencia notaste entre este momento sin intervención y los momentos donde sí aplicaste el método?" },
        ] },
        CIERRE,
      ] },
      { n: 19, grupos: [
        BREVE(),
        { label: "Aplicación práctica (2 min)", items: [
          { text: "Aplicá el método completo (regulación + introspección breve) en una situación de estrés real del día, no solo en el bloque de trabajo habitual." },
        ] },
        { label: "Reflexión escrita (5 min)", items: [
          { text: "¿Cómo cambió tu capacidad de sostener el foco bajo estrés, comparado con el Día 1?" },
        ] },
        CIERRE,
      ] },
      { n: 20, grupos: [
        BREVE(),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Empezá a esbozar tu propio sistema de mantenimiento: ¿cuáles de todos los ejercicios del reto (escaneo corporal, respiración, visualización, escritura de sombra, diálogo interno) te resultaron más efectivos y te gustaría sostener después del día 21?" },
        ] },
        CIERRE,
      ] },
      { n: 21, autoevaluacion: true, grupos: [
        PC("Práctica corporal, secuencia completa (8-10 min)"),
        { label: "Reflexión escrita (5 min)", items: [
          { text: "Cierre final. Respondé: ¿qué cambió realmente en estos 21 días? ¿Qué frase registraste en el Módulo 6 sobre tus expectativas, y qué tan cerca estás de eso hoy? ¿Qué te llevás para seguir sosteniendo después de hoy?" },
        ] },
        { label: "Cierre (1 min)", items: [
          { text: "Repetí la {Autoevaluación de Foco} por última vez.", note: "Vas a ver esta comparación gráfica reflejada automáticamente en tu {Tracker Visual de 21 Días}. Guardá esta comparación en mente, porque en el Módulo 7 vas a usarla como punto de partida para diseñar tu plan de sostenimiento." },
        ] },
      ] },
    ],
  },
};
