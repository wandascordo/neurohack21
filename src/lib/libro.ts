export type Block =
  | { type: "p"; text: string; lead?: string }
  | { type: "h"; text: string }
  | { type: "ejemplo"; text: string }
  | { type: "cierre"; items: string[] }
  | { type: "ejercicio"; title?: string; text: string };

export type Pagina =
  | { slug: string; kind: "parte"; eyebrow: string; titulo: string; firstSlug: string }
  | { slug: string; kind: "modulo"; eyebrow: string; titulo: string; blocks: Block[] }
  | { slug: string; kind: "reto"; eyebrow: string; titulo: string };

const pend: Block[] = [{ type: "p", text: "El texto de esta sección se incorporará próximamente." }];

const PROLOGO = [
  `Son las 7 de la mañana. Agarrás el celular "solo para ver la hora" y cuarenta minutos después seguís scrolleando, sin saber muy bien cómo llegaste hasta ahí. Te sentás a trabajar en algo importante y a los cinco minutos ya estás revisando el mail, después una notificación, después un pensamiento que te lleva a otro, y otro más. Al final del día sentís que hiciste mucho, pero avanzaste poco. Si esto te suena familiar, no estás roto. Tu cerebro está haciendo exactamente lo que fue entrenado para hacer.`,
  `Vivimos en la era más distractiva de la historia humana. No es una frase hecha: es un hecho neurológico. Cada notificación, cada pestaña abierta, cada micro estímulo compite por el mismo recurso limitado, tu atención, y cada vez que cedés terreno, tu cerebro fortalece un poco más el circuito de la distracción. La buena noticia es que ese mismo mecanismo que te desconcentra es el que te puede reconcentrar. El cerebro no distingue demasiado entre repetir un hábito que te perjudica y repetir uno que te ayuda: simplemente refuerza lo que practicás una y otra vez. Ese principio, que en neurociencia se conoce desde hace décadas como la base de la plasticidad neuronal, es el corazón de este libro interactivo.`,
  `Durante los últimos años estudié en profundidad dos corrientes que, a primera vista, parecen hablar idiomas distintos. Por un lado, el trabajo de Joe Dispenza, que traduce la neurociencia y la epigenética a un lenguaje práctico: cómo el cuerpo queda "programado" para repetir emociones familiares, y cómo se puede entrenar la mente para salir de ese piloto automático. Por otro lado, la obra de Carl Jung, que un siglo antes ya hablaba de algo muy parecido desde la psicología profunda: cuánto de lo que hacemos está gobernado por contenidos inconscientes, por una "sombra" que no vemos pero que dirige buena parte de nuestro comportamiento, incluida nuestra dificultad para sostener el foco.`,
  `Lo que descubrí es que estos dos mapas, uno más biológico y otro más simbólico, describen el mismo territorio desde ángulos distintos. Y cuando los combinás, pasa algo interesante: no solo entendés por qué te distraés, entendés también qué parte tuya se beneficia de esa distracción. Porque acá va una verdad incómoda que vas a encontrar varias veces en este libro interactivo: la falta de foco casi nunca es un problema de fuerza de voluntad. Es un problema de patrones, patrones emocionales que el cuerpo repite sin que la mente se dé cuenta, y patrones inconscientes que la mente no quiere del todo mirar.`,
  `Este libro interactivo nació de una pregunta simple: ¿qué pasaría si tomáramos lo mejor de ambos enfoques, la disciplina práctica y medible de la neurociencia aplicada, y la profundidad introspectiva de la psicología junguiana, y los organizáramos en un proceso de 21 días? No 21 días como una cifra mágica, sino como una ventana de tiempo razonable, respaldada por investigación sobre formación de hábitos, para empezar a instalar un nuevo circuito de atención y sostenerlo el tiempo suficiente como para que deje de sentirse forzado.`,
  `Lo que vas a lograr en estos 21 días no es convertirte en una máquina de productividad ni eliminar mágicamente cada distracción de tu vida. Vas a lograr algo más profundo y más duradero: reconocer el momento exacto en que tu atención se fuga, entender qué la dispara (a nivel corporal y a nivel inconsciente), y tener un método concreto, día por día, para traerla de vuelta. Vas a pasar de sentir que el foco te pasa a vos, a sentir que vos elegís dónde ponerlo.`,
  `Una advertencia honesta, porque este libro interactivo no te va a mentir para venderte una promesa fácil: esto no es magia, ni un mantra que repetís una vez y listo. Es entrenamiento. Como cualquier músculo, la atención se fortalece con repetición y se debilita con abandono. Las prácticas que vas a encontrar acá están diseñadas para hacerse todos los días, con constancia, no con perfección. Vas a tener días mejores y días en los que te cueste más. Eso también es parte del proceso, y en el Módulo 6 vas a entender por qué esos tropiezos no arruinan el reto, sino que son parte de cómo el cerebro consolida el cambio.`,
  `Cada módulo de este libro interactivo combina tres capas: la explicación neurocientífica de qué está pasando en tu cerebro, la mirada simbólica de qué puede estar pasando en tu inconsciente, y un ejercicio concreto para registrar ese mismo día, directamente acá adentro. No vas a encontrar teoría sin práctica, ni práctica sin fundamento. Todo lo que te propongo está pensado para que, al llegar al Día 21, no te quede una idea más sobre neurociencia, sino un método instalado que podés sostener el resto de tu vida.`,
  `Si llegaste hasta acá es porque algo en vos ya sabe que el problema no es la falta de tiempo, ni la falta de disciplina. Es la falta de un método que hable el idioma de tu cerebro y de tu inconsciente al mismo tiempo. Ese método empieza en la próxima pantalla.`,
  `Bienvenido a Neurohack 21.`,
].map((text): Block => ({ type: "p", text }));

const COMO_USAR: Block[] = [
  { type: "p", text: "Antes de arrancar el reto, es importante que entiendas la lógica del método para sacarle el máximo provecho." },
  { type: "p", lead: "El enfoque del método.", text: "Cada semana del reto tiene un objetivo neurológico específico (desprogramar, reprogramar, integrar) y combina dos tipos de práctica diaria: un ejercicio de base dispenziana (regulación del cuerpo y el estado emocional) y un ejercicio de base junguiana (exploración del inconsciente a través de la escritura y la reflexión). No son alternativas, son complementarias: una trabaja el sistema nervioso, la otra trabaja el significado." },
  { type: "p", lead: "Qué vas a necesitar.", text: "Tu cuenta de Neurohack 21 (donde queda guardado todo tu progreso), y entre 15 y 25 minutos diarios en un espacio donde no te interrumpan. Nada más. El Registro Diario y el resto de las herramientas ya están integrados en la app, no necesitás imprimir ni preparar nada por tu cuenta." },
  { type: "p", text: "Si en algún momento querés tener a mano solo lo esencial, sin repasar toda la teoría, el Kit de Emergencia Anti-Distracción está siempre disponible desde el menú principal para esos momentos puntuales." },
  { type: "p", lead: "Cómo medir tu progreso.", text: "Antes de empezar el Día 1, te voy a pedir que completes una breve Autoevaluación de Foco de tu nivel actual (la vas a encontrar al cierre del Módulo 6). Vas a repetir esa misma evaluación al cierre de cada semana, y la app va a guardar automáticamente los cuatro resultados para que el cambio no quede solo en cómo te sentís, sino en algo que puedas ver, comparar y sostener en tu Tracker Visual." },
];

const mod = (n: number, parte: string, titulo: string): Pagina => ({
  slug: `modulo-${n}`, kind: "modulo", eyebrow: `${parte} / Módulo ${n}`, titulo, blocks: pend,
});

export const LIBRO: Pagina[] = [
  { slug: "prologo", kind: "modulo", eyebrow: "Introducción", titulo: "Prólogo", blocks: PROLOGO },
  { slug: "como-usar", kind: "modulo", eyebrow: "Introducción", titulo: "Cómo usar este libro interactivo", blocks: COMO_USAR },
  { slug: "parte-1", kind: "parte", eyebrow: "Parte I", titulo: "El cerebro distraído", firstSlug: "modulo-1" },
  mod(1, "Parte I", "La ciencia de la atención perdida"),
  mod(2, "Parte I", "Neuroplasticidad, la puerta del cambio"),
  mod(3, "Parte I", "Dos mapas para un mismo territorio"),
  { slug: "parte-2", kind: "parte", eyebrow: "Parte II", titulo: "Los dos pilares del método", firstSlug: "modulo-4" },
  mod(4, "Parte II", "El pilar Dispenza"),
  mod(5, "Parte II", "El pilar Jung"),
  mod(6, "Parte II", "El diseño del reto"),
  { slug: "parte-3", kind: "parte", eyebrow: "Parte III", titulo: "El reto Neurohack 21", firstSlug: "reto" },
  { slug: "reto", kind: "reto", eyebrow: "Parte III", titulo: "El reto de 21 días" },
  { slug: "parte-4", kind: "parte", eyebrow: "Parte IV", titulo: "Sostener el cambio", firstSlug: "modulo-7" },
  mod(7, "Parte IV", "Qué hacer después del día 21"),
  mod(8, "Parte IV", "Foco en el mundo real"),
  { slug: "conclusiones", kind: "modulo", eyebrow: "Parte Final", titulo: "Conclusiones", blocks: pend },
  { slug: "bibliografia", kind: "modulo", eyebrow: "Bibliografía", titulo: "Bibliografía", blocks: pend },
];

export type IndiceGrupo = { titulo: string; slug?: string; items: { slug: string; label: string }[] };

export const INDICE: IndiceGrupo[] = [
  { titulo: "Introducción", items: [{ slug: "prologo", label: "Prólogo" }, { slug: "como-usar", label: "Cómo usar este libro interactivo" }] },
  { titulo: "Parte I: El cerebro distraído", slug: "parte-1", items: [1, 2, 3].map(itemMod) },
  { titulo: "Parte II: Los dos pilares del método", slug: "parte-2", items: [4, 5, 6].map(itemMod) },
  { titulo: "Parte III: El reto Neurohack 21", slug: "parte-3", items: [] },
  { titulo: "Parte IV: Sostener el cambio", slug: "parte-4", items: [7, 8].map(itemMod) },
  { titulo: "Conclusiones", slug: "conclusiones", items: [] },
  { titulo: "Bibliografía", slug: "bibliografia", items: [] },
];

function itemMod(n: number) {
  const p = LIBRO.find((x) => x.slug === `modulo-${n}`)!;
  return { slug: p.slug, label: `Módulo ${n}: ${p.titulo}` };
}
