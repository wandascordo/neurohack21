export const AFIRMACIONES = [
  "Me siento a hacer algo importante y, sin darme cuenta, ya estoy haciendo otra cosa.",
  "Cuando noto que me distraje, puedo identificar qué me distrajo.",
  "Puedo sostener un bloque de trabajo de al menos 20 minutos sin revisar el celular.",
  "Cuando algo me genera incomodidad, tiendo a posponerlo buscando cualquier otra tarea.",
  "Después de una interrupción, puedo retomar lo que estaba haciendo sin que me cueste demasiado.",
  "Soy consciente de la tensión en mi cuerpo (mandíbula, hombros) mientras trabajo.",
  "Reviso el celular o las notificaciones aunque no haya sonado ninguna alerta.",
  "Puedo estar presente en una conversación sin que mi mente se vaya a otra parte.",
  "Cuando algo me distrae, logro notarlo y volver a lo que estaba haciendo en menos de un minuto.",
  "Al final del día, siento que dirigí mi atención donde yo quise, más que donde el entorno la llevó.",
];
export const OPCIONES = ["Casi nunca", "Rara vez", "A veces", "Seguido", "Casi siempre"];
const INVERTIDAS = new Set([0, 3, 6]);

export function puntaje(answers: number[]) {
  return answers.reduce((s, v, i) => s + (INVERTIDAS.has(i) ? 6 - v : v), 0);
}

export function rango(score: number) {
  if (score <= 20) return { titular: "Tu atención está siendo capturada por el entorno la mayor parte del tiempo.", cuerpo: "Es un dato sobre hoy, no una etiqueta. Con práctica sostenida este número puede moverse, y cualquier cambio que notes cuenta." };
  if (score <= 33) return { titular: "Tenés momentos de foco real, pero conviven con patrones de distracción bastante arraigados.", cuerpo: "Ya tenés una base para trabajar. Notar cuándo aparece la distracción y volver, una y otra vez, es lo que va fortaleciendo el circuito nuevo." };
  if (score <= 43) return { titular: "Tu capacidad de dirigir la atención es sólida, con margen de mejora concreto en situaciones puntuales.", cuerpo: "Esas situaciones suelen aparecer con el estrés, la tecnología y las tareas que evitás, y son el mejor lugar para seguir practicando." };
  return { titular: "Tu foco ya es una habilidad bien entrenada.", cuerpo: "Es una habilidad que se mantiene con práctica, así que vale la pena seguir cuidándola. Una buena forma es profundizar el trabajo de introspección del Módulo 5." };
}

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export function fechaLarga(iso: string) {
  const d = new Date(iso);
  return `${DIAS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}
export function hora(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
