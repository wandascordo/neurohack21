import type { DiaConfig } from "@/lib/registro";

const practicas = [
  { match: /^Escaneo corporal/i, titulo: "Escaneo corporal", desc: "Recorrer mentalmente el cuerpo de la cabeza a los pies, prestando atención a la tensión acumulada en cada zona sin intentar cambiarla, solo notándola." },
  { match: /^Respiración de coherencia/i, titulo: "Respiración de coherencia cardíaca", desc: "Inhalar 5 segundos por nariz.\nExhalar 5 segundos por la boca." },
  { match: /^Visualización/i, titulo: "Visualización dirigida", desc: "Vos mismo/a ya enfocado, mandíbula relajada, respiración lenta." },
];
const notas: Record<number, string> = {
  4: "Hoy prestá especial atención a la mandíbula y los hombros.",
  5: "Si te cuesta sostener la respiración pautada, está bien acortar a 2 minutos.",
  6: "Hoy en un horario distinto al habitual, para notar si el estado de partida cambia según el momento del día.",
  13: "Intentá hacerla de memoria, sin releer las instrucciones.",
  14: "Intentá hacerla de memoria, sin releer las instrucciones.",
  15: "A partir de hoy, sin escaneo corporal hasta el día 21.",
  21: "Secuencia completa",
};
const adicionales: Record<number, string> = {
  3: "Diseñá tu entorno de trabajo para hoy eliminando uno de esos tres disparadores. Por ejemplo, dejar el celular en otra habitación durante el bloque principal de foco.",
  15: "Elegí la tarea que más solés postergar y hacé el primer bloque de trabajo del día directamente sobre ella, inmediatamente después de la práctica corporal.",
  16: "Notá una situación real del día (una reunión, una conversación, una tarea doméstica) donde apliques la pausa de ”notar y redirigir” sin necesidad de la secuencia completa de regulación.",
  17: "Probá sostener un bloque de trabajo de al menos 25 minutos sin revisar el celular, usando únicamente la práctica corporal como preparación previa.",
  18: "Elegí conscientemente no aplicar ninguna técnica en un momento de distracción y observá qué pasa. Este ejercicio busca que notes la diferencia entre actuar con conciencia y dejarte llevar por el piloto automático, sin culpa en ninguno de los dos casos.",
  19: "Aplicá el método completo (regulación + introspección breve) en una situación de estrés real del día, no solo en el bloque de trabajo habitual.",
};

/** Presentation corrections preserve every saved ID and completion requirement. */
export function presentacionDia(cfg: DiaConfig): DiaConfig {
  return {
    ...cfg,
    practica: cfg.practica.map((item) => {
      const display = practicas.find((p) => p.match.test(item.titulo));
      return display ? { ...item, titulo: display.titulo, desc: display.desc } : item;
    }),
    practicaNota: notas[cfg.n] ?? cfg.practicaNota,
    extras: cfg.extras.map((extra) => adicionales[cfg.n] ? { ...extra, seccion: "Ejercicio adicional", titulo: adicionales[cfg.n] ?? extra.titulo, desc: undefined } : extra),
  };
}