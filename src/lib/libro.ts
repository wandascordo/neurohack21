export type Block =
  | { type: "p"; text: string; lead?: string }
  | { type: "h"; text: string }
  | { type: "sumario"; items: string[] }
  | { type: "ejemplo"; title?: string; text: string; links?: { text: string; to: string }[] }
  | { type: "cierre"; items: string[]; ejercicio?: string }
  | { type: "lista"; intro: string; items: string[]; outro: string }
  | { type: "ejercicio"; title?: string; text: string };

export type Pagina =
  | { slug: string; kind: "parte"; eyebrow: string; titulo: string; firstSlug: string }
  | { slug: string; kind: "modulo"; eyebrow: string; titulo: string; tiempo?: string; blocks: Block[] }
  | { slug: string; kind: "reto"; eyebrow: string; titulo: string };

const pend: Block[] = [{ type: "p", text: "El texto de esta sección se incorporará próximamente." }];

const PROLOGO = [
  `Son las 7 de la mañana. Agarrás el celular "solo para ver la hora" y cuarenta minutos después seguís scrolleando, sin saber muy bien cómo llegaste hasta ahí. Te sentás a trabajar en algo importante y a los cinco minutos ya estás revisando el mail, después una notificación, después un pensamiento que te lleva a otro, y otro más. Al final del día sentís que hiciste mucho, pero avanzaste poco. Si esto te suena familiar, no estás roto. Tu cerebro está haciendo exactamente lo que fue entrenado para hacer.`,
  `Vivimos en la era más distractiva de la historia humana. No es una frase hecha: es un hecho neurológico. Cada notificación, cada pestaña abierta, cada micro estímulo compite por el mismo recurso limitado, tu atención, y cada vez que cedés terreno, tu cerebro fortalece un poco más el circuito de la distracción. La buena noticia es que ese mismo mecanismo que te desconcentra es el que te puede reconcentrar. El cerebro no distingue demasiado entre repetir un hábito que te perjudica y repetir uno que te ayuda: simplemente refuerza lo que practicás una y otra vez. Ese principio, que en neurociencia se conoce desde hace décadas como la base de la plasticidad neuronal, es el corazón de este libro interactivo.`,
  `Durante los últimos años se han estudiado dos corrientes que, a primera vista, parecen hablar idiomas distintos. Por un lado, el trabajo de Joe Dispenza, que traduce la neurociencia y la epigenética a un lenguaje práctico: cómo el cuerpo queda "programado" para repetir emociones familiares, y cómo se puede entrenar la mente para salir de ese piloto automático. Por otro lado, la obra de Carl Jung, que un siglo antes ya hablaba de algo muy parecido desde la psicología profunda: cuánto de lo que hacemos está gobernado por contenidos inconscientes, por una "sombra" que no vemos pero que dirige buena parte de nuestro comportamiento, incluida nuestra dificultad para sostener el foco.`,
  `Estos dos mapas, uno más biológico y otro más simbólico, describen el mismo territorio desde ángulos distintos. Y cuando los combinás, pasa algo interesante: no solo entendés por qué te distraés, entendés también qué parte tuya se beneficia de esa distracción. Porque acá va una verdad incómoda que vas a encontrar varias veces en este libro interactivo: la falta de foco casi nunca es un problema de fuerza de voluntad. Es un problema de patrones, patrones emocionales que el cuerpo repite sin que la mente se dé cuenta, y patrones inconscientes que la mente no quiere del todo mirar.`,
  `Este libro interactivo nació de una pregunta simple: ¿qué pasaría si tomáramos lo mejor de ambos enfoques, la disciplina práctica y medible de la neurociencia aplicada, y la profundidad introspectiva de la psicología junguiana, y los organizáramos en un proceso de 21 días? No 21 días como una cifra mágica, sino como una ventana de tiempo razonable, respaldada por investigación sobre formación de hábitos, para empezar a instalar un nuevo circuito de atención y sostenerlo el tiempo suficiente como para que deje de sentirse forzado.`,
  `Lo que vas a lograr en estos 21 días no es convertirte en una máquina de productividad ni eliminar mágicamente cada distracción de tu vida. Vas a lograr algo más profundo y más duradero: reconocer el momento exacto en que tu atención se fuga, entender qué la dispara (a nivel corporal y a nivel inconsciente), y tener un método concreto, día por día, para traerla de vuelta. Vas a pasar de sentir que el foco te pasa a vos, a sentir que vos elegís dónde ponerlo.`,
  `Una advertencia honesta, porque este libro interactivo no te va a mentir para venderte una promesa fácil: esto no es magia, ni un mantra que repetís una vez y listo. Es entrenamiento. Como cualquier músculo, la atención se fortalece con repetición y se debilita con abandono. Las prácticas que vas a encontrar acá están diseñadas para hacerse todos los días, con constancia, no con perfección. Vas a tener días mejores y días en los que te cueste más. Eso también es parte del proceso, y en el Módulo 6 vas a entender por qué esos tropiezos no arruinan el reto, sino que son parte de cómo el cerebro consolida el cambio.`,
  `Si llegaste hasta acá es porque algo en vos ya sabe que el problema no es la falta de tiempo, ni la falta de disciplina. Es la falta de un método que hable el idioma de tu cerebro y de tu inconsciente al mismo tiempo. Ese método empieza en la próxima pantalla.`,
  `Bienvenido a Neurohack 21.`,
].map((text): Block => ({ type: "p", text }));

PROLOGO.splice(7, 0, {
  type: "lista",
  intro: "Cada módulo de este libro interactivo combina tres capas:",
  items: [
    "La explicación neurocientífica de qué está pasando en tu cerebro,",
    "La mirada simbólica de qué puede estar pasando en tu inconsciente, y",
    "Un ejercicio concreto para registrar ese mismo día, directamente acá adentro.",
  ],
  outro: "No vas a encontrar teoría sin práctica, ni práctica sin fundamento. Todo lo está pensado para que, al llegar al Día 21, no te quede una idea más sobre neurociencia, sino un método instalado que podés sostener el resto de tu vida.",
});

const MODULO1: Block[] = [
  {
    type: "sumario",
    items: [
      `Qué es el foco a nivel neurológico`,
      `La Default Mode Network y el "modo automático"`,
      `Dopamina, notificaciones y la economía de la atención`,
      `El costo real de la interrupción`,
      `Por qué esto no es un problema de voluntad`,
    ],
  },
  { type: "h", text: `Qué es el foco a nivel neurológico` },
  { type: "p", text: `Cuando hablamos de "foco", en realidad estamos hablando de un fenómeno neurológico muy concreto: la capacidad del cerebro de sostener la activación de una red específica (la red de atención ejecutiva) mientras suprime otra red que compite por los mismos recursos (la red neuronal por defecto, o Default Mode Network, DMN). No es una metáfora. Son dos sistemas cerebrales distintos que literalmente se turnan el protagonismo, y cuál de los dos domina en un momento dado determina si estás presente en lo que hacés o si tu mente "se fue a otro lado".` },
  { type: "p", text: `Durante décadas se pensó que la DMN era simplemente el estado de "reposo" del cerebro, la red que se activa cuando no estás haciendo nada en particular. Investigaciones más recientes en neuroimagen mostraron algo más interesante: los lapsos de atención se asocian con incrementos de activación dentro de esta misma red, y estudios con registro neuronal de altísima precisión temporal encontraron que cuando necesitamos concentrarnos, esta red interfiere con la activación de otras neuronas especializadas cuando no logra desactivarse lo suficiente. Dicho en criollo: no es que "te distraigas" por débil o por indisciplinado. Es que una red cerebral entera, diseñada para la introspección y el pensamiento espontáneo, no bajó el volumen cuando necesitabas que lo hiciera.` },
  { type: "p", text: `Esto tiene una implicancia directa para el reto que vas a hacer: entrenar el foco no es "esforzarte más". Es aprender a reconocer cuándo se activa esa red de fondo y desarrollar la capacidad de bajarla a voluntad. Eso es exactamente lo que trabajan las prácticas de regulación corporal que vas a incorporar desde el Día 1.` },
  { type: "h", text: `La Default Mode Network y el "modo automático"` },
  { type: "p", text: `Pensá en la DMN como el modo automático de un auto: se activa solo, sin que decidas conscientemente encenderlo, cada vez que no hay una tarea externa que exija tu atención completa. Repasás el pasado, anticipás el futuro, rumiás una conversación incómoda, planificás qué vas a cocinar. Todo eso es sano y necesario, es el sistema que te permite tener sentido de identidad y proyectarte en el tiempo.` },
  { type: "p", text: `El problema aparece cuando ese modo automático se activa en el momento equivocado: mientras estás tratando de escribir un informe, leer un libro o simplemente escuchar a alguien. Ahí es cuando "te fuiste" sin darte cuenta. Y acá viene el dato que probablemente más te va a sorprender de este módulo.` },
  { type: "p", text: `La investigadora Gloria Mark, de la Universidad de California en Irvine, lleva más de veinte años midiendo objetivamente cuánto tiempo sostiene una persona la atención en una pantalla antes de cambiar de foco, usando registros de actividad reales, no encuestas de autopercepción. En 2004 el promedio era de dos minutos y medio antes de cambiar de pantalla. Desde 2016 en adelante, ese promedio cayó a 47 segundos, y la mediana (el punto medio de todas las mediciones) es de 40 segundos, lo que significa que la mitad de las veces sostenemos el foco todavía menos tiempo.` },
  { type: "p", text: `Es importante leer este dato con precisión, sin exagerarlo: no significa que tu cerebro tenga un límite biológico de 47 segundos, ni que sea imposible leer un párrafo largo sin distraerte. Significa que, en el entorno actual de estímulos constantes, el patrón de cambio de atención se volvió mucho más frecuente que hace veinte años, y ese patrón es justamente lo que este reto busca revertir: no cuánto "podés" concentrarte en el mejor de los casos, sino con qué frecuencia elegís hacerlo en el día a día.` },
  { type: "h", text: `Dopamina, notificaciones y la economía de la atención` },
  { type: "p", text: `La dopamina no es, como se suele simplificar, "la molécula del placer". Es, sobre todo, la molécula de la anticipación: se libera cuando el cerebro predice que algo relevante o novedoso está por pasar, más que cuando ese algo efectivamente ocurre. Una notificación en el celular es un disparador casi perfecto de este mecanismo: no sabés qué contiene hasta que la mirás, y esa incertidumbre es justamente lo que mantiene activa la anticipación.` },
  { type: "p", text: `Cada vez que revisás el teléfono "solo un segundo" y ese segundo se convierte en cinco minutos, no es una falla de carácter. Es un circuito de recompensa haciendo exactamente lo que la evolución lo entrenó para hacer: orientarse hacia lo novedoso. El problema es que ese circuito no distingue entre una alerta genuinamente importante y un like en una foto. Trata a ambas con el mismo nivel de urgencia neuroquímica.` },
  { type: "ejemplo", text: `Pensá en la última vez que te sentaste a hacer algo que requería concentración y dejaste el celular "a la vista, pero en silencio". La sola presencia visual del dispositivo, aunque no vibre ni suene, ya consume una porción de tus recursos atencionales, porque una parte de tu cerebro está monitoreando pasivamente la posibilidad de una notificación. Es una de las razones por las que en el Módulo 4 vas a trabajar con un protocolo concreto de "diseño del entorno" antes de cada sesión de foco: no se trata de tener más fuerza de voluntad, se trata de reducir la cantidad de disparadores dopaminérgicos disponibles mientras entrenás el circuito nuevo.` },
  { type: "h", text: `El costo real de la interrupción` },
  { type: "p", text: `Hay un segundo dato, tan importante como el anterior, que rara vez se menciona junto con las estadísticas de atención: el problema no es solo con qué frecuencia te distraés, sino cuánto cuesta volver. La misma línea de investigación de Gloria Mark documentó que, luego de una interrupción, el cerebro puede tardar hasta 25 minutos en recuperar el nivel de foco previo a esa interrupción.` },
  { type: "p", text: `Esto cambia por completo la manera de pensar el problema. Si revisás el celular seis veces en una hora de trabajo, no perdiste seis veces "un segundo". Potencialmente perdiste la posibilidad entera de entrar en un estado de concentración profunda durante esa hora, porque cada interrupción reinicia el proceso de reingreso al foco antes de que llegue a completarse.` },
  { type: "ejemplo", text: `Muchas personas dicen "trabajo mejor con música de fondo y el chat abierto, así respondo rápido y sigo". Lo que en realidad está pasando, según esta evidencia, es que cada respuesta rápida tiene un costo invisible mucho mayor a los segundos que toma escribirla. El reto de 21 días no te va a pedir que elimines toda comunicación de tu vida, pero sí que empieces a identificar, en tu Registro Diario, cuántas veces por sesión te interrumpís (o te interrumpen) y qué tan largo es el "regreso" a la tarea. Ese simple acto de registro, sin cambiar nada más todavía, ya empieza a entrenar la conciencia metacognitiva que necesitás para el resto del método.`, links: [{ text: `Registro Diario`, to: "/registro-diario" }] },
  { type: "h", text: `Por qué esto no es un problema de voluntad` },
  { type: "p", text: `Es tentador leer todo lo anterior y sacar la conclusión de "tengo que tener más disciplina". Pero la neurociencia de la atención sugiere algo distinto: la fuerza de voluntad es un recurso limitado y fluctuante, mientras que los circuitos neuronales entrenados son estables y automáticos. Por eso la persona que "no tiene fuerza de voluntad" para dejar el celular en la mesa, muchas veces sí la tiene para sostener otras rutinas exigentes en otras áreas de su vida. No es un rasgo de carácter fijo, es un circuito específico, fortalecido por miles de repeticiones diarias durante años.` },
  { type: "p", text: `La buena noticia, y acá es donde este módulo conecta con el resto del libro interactivo, es que si un circuito se fortalece por repetición, también se puede debilitar y reemplazar por repetición. Ese es exactamente el mecanismo que vas a activar durante los 21 días: no vas a "obligar" a tu cerebro a concentrarse mediante el esfuerzo puro, vas a diseñar condiciones y prácticas diarias que, repetidas con constancia, instalen un circuito nuevo.` },
  {
    type: "cierre",
    items: [
      `El foco es un fenómeno de dos redes cerebrales en competencia, no un rasgo fijo de personalidad.`,
      `La frecuencia con la que cambiamos de atención se disparó en las últimas dos décadas, no porque el cerebro humano cambió biológicamente, sino porque el entorno de estímulos cambió radicalmente.`,
      `Cada interrupción tiene un costo de reingreso mucho mayor a lo que sentimos conscientemente.`,
      `El problema no es de voluntad, es de circuitos entrenados, y los circuitos se pueden reentrenar.`,
    ],
    ejercicio: `Durante las próximas 24 horas, sin cambiar todavía ningún hábito, llevá un registro simple: cada vez que notes que "volviste" de una distracción (el celular, un pensamiento, una notificación), anotá la hora y qué te distrajo. No juzgues el resultado, solo observá. Este registro va a ser tu línea base real, la que vas a comparar al cierre de cada semana del reto.`,
  },
];

const mod = (n: number, parte: string, titulo: string): Pagina => ({
  slug: `modulo-${n}`, kind: "modulo", eyebrow: `${parte} / Módulo ${n}`, titulo, blocks: pend,
});

export const LIBRO: Pagina[] = [
  { slug: "prologo", kind: "modulo", eyebrow: "Introducción", titulo: "Prólogo", tiempo: "4 min.", blocks: PROLOGO },
  { slug: "parte-1", kind: "parte", eyebrow: "Parte I", titulo: "El cerebro distraído", firstSlug: "modulo-1" },
  { slug: "modulo-1", kind: "modulo", eyebrow: "Parte I / Módulo 1", titulo: "La ciencia de la atención perdida", tiempo: "7 min.", blocks: MODULO1 },
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
  { titulo: "Introducción", items: [{ slug: "prologo", label: "Prólogo" }] },
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
