import { MODULO4 } from "./modulo4";
import { MODULO5 } from "./modulo5";

export type Enlace = { text: string; to: string };

export type Block =
  | { type: "p"; text: string; lead?: string; links?: Enlace[] }
  | { type: "h"; text: string }
  | { type: "sumario"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "ejemplo"; title?: string; text: string; extra?: string; links?: Enlace[] }
  | { type: "cierre"; items: string[]; ejercicio?: string; ejercicioExtra?: string; ejercicioLinks?: Enlace[] }
  | { type: "pasos"; items: { title: string; paragraphs: string[] }[] }
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

const MODULO2: Block[] = [
  {
    type: "sumario",
    items: [
      `Qué significa "las neuronas que se disparan juntas, se conectan juntas"`,
      `Cómo se forman (y se rompen) los hábitos mentales`,
      `El rol de la repetición consciente en el cambio de circuitos`,
      `Neuroplasticidad y el argumento de Dispenza: una lectura cuidadosa`,
    ],
  },
  { type: "h", text: `Qué significa "las neuronas que se disparan juntas, se conectan juntas"` },
  { type: "p", text: `En 1949, el neuropsicólogo canadiense Donald Hebb propuso, en su libro The Organization of Behavior, un principio que cambió para siempre la forma de entender el aprendizaje: cuando una neurona activa repetidamente a otra, la conexión entre ambas se fortalece. Ese principio, conocido como el postulado de Hebb, fue resumido años después por la neurocientífica Carla Shatz en la frase que hoy es casi un lugar común: "las neuronas que se disparan juntas, se conectan juntas".` },
  { type: "p", text: `Es importante entender qué significa esto en términos concretos, más allá de la frase pegadiza. Cada vez que dos neuronas se activan de forma simultánea o en secuencia cercana, ocurre un cambio bioquímico real en la sinapsis (el punto de conexión entre ambas) que hace que la próxima vez sea más fácil que se activen juntas de nuevo. Ese mecanismo, hoy respaldado por décadas de investigación en potenciación a largo plazo (LTP, por sus siglas en inglés), es la base biológica de absolutamente todo lo que aprendés: desde andar en bicicleta hasta el patrón de pensamiento que te lleva a revisar el celular apenas sentís un mínimo de incomodidad.` },
  { type: "ejemplo", text: `Pensá en la primera vez que manejaste un auto. Cada movimiento (mirar el espejo, pisar el embrague, girar el volante) requería atención consciente y esfuerzo. Con la repetición, esas acciones se automatizaron: hoy las hacés sin pensar. Eso es la neuroplasticidad en acción, un circuito que se volvió tan eficiente que ya no necesita supervisión consciente. El problema es que este mismo mecanismo que te permitió automatizar el manejo es el que automatizó también el gesto de agarrar el celular cada vez que sentís un microsegundo de aburrimiento. El cerebro no distingue entre un hábito que te sirve y uno que te perjudica: fortalece por igual lo que repetís.` },
  { type: "h", text: `Cómo se forman (y se rompen) los hábitos mentales` },
  { type: "p", text: `Un hábito, visto desde la neurociencia, no es más que un circuito Hebbiano suficientemente entrenado como para activarse de forma automática ante una señal (un disparador) sin pasar por una decisión consciente. Esto explica por qué es tan difícil "decidir" dejar de distraerte: para cuando te das cuenta de que ya estás mirando el teléfono, el circuito ya se activó y ya ejecutó buena parte de la secuencia. La decisión consciente llegó tarde.` },
  { type: "p", text: `Acá aparece la otra cara de la neuroplasticidad, tan importante como la primera: los circuitos que dejan de usarse se debilitan. Este principio se conoce en neurociencia como "use it or lose it" (lo que no usás, lo perdés), y significa que un circuito de distracción muy entrenado no desaparece de un día para el otro, pero sí pierde fuerza progresivamente cuando dejás de alimentarlo y, al mismo tiempo, fortalecés un circuito alternativo de manera consistente.` },
  { type: "p", text: `Es la razón por la que este libro interactivo no te va a pedir que "elimines" la distracción de un día para el otro mediante pura fuerza de voluntad, sino que instales, día tras día, un circuito competidor: el de notar la distracción apenas aparece y redirigir la atención de forma consciente. Cada vez que hacés ese gesto (notar y redirigir), estás debilitando levemente el circuito viejo y fortaleciendo uno nuevo. Es un proceso gradual, no un interruptor de on/off, y por eso el reto está diseñado en 21 días y no en uno solo.` },
  { type: "h", text: `El rol de la repetición consciente en el cambio de circuitos` },
  { type: "p", text: `Hay un matiz clave que separa la neuroplasticidad "que te pasa" de la neuroplasticidad que podés dirigir de forma intencional: el nivel de atención con el que repetís algo. La investigación en aprendizaje motor y cognitivo muestra que la repetición mecánica, sin atención plena, produce cambios sinápticos mucho más débiles que la repetición hecha con atención consciente y con feedback sobre el propio desempeño. En otras palabras, no alcanza con "hacer" el ejercicio de foco de forma automática y distraída, la calidad de la atención con la que lo hacés es parte del mecanismo de cambio.` },
  { type: "p", text: `Esto es exactamente lo que Joe Dispenza enfatiza cuando habla de "estar presente" durante la práctica: no como un concepto espiritual abstracto, sino como una condición necesaria para que la repetición efectivamente reconfigure el circuito. Si hacés el ejercicio de meditación del reto pensando en la lista de tareas del día, la práctica pierde buena parte de su efecto neuroplástico. La presencia consciente durante el ejercicio no es un detalle estético, es parte del mecanismo.` },
  { type: "ejemplo", text: `Compará dos personas que hacen el mismo ejercicio de respiración de 5 minutos. La primera lo hace mientras repasa mentalmente su lista de pendientes. La segunda lo hace prestando atención real a cada inhalación y exhalación, notando cuándo la mente se va y trayéndola de vuelta. Ambas "cumplieron" con el ejercicio, pero solo la segunda está entrenando activamente el circuito de atención dirigida. Por eso, en cada práctica diaria del reto vas a encontrar una instrucción específica de "dónde poner la atención", no solo "qué hacer".` },
  { type: "h", text: `Neuroplasticidad y el argumento de Dispenza: una lectura cuidadosa` },
  { type: "p", text: `Es importante que este punto quede claro, porque es donde más se presta a confusión. Joe Dispenza sostiene, apoyándose en el principio Hebbiano, que repetir un mismo pensamiento y una misma emoción de forma sostenida en el tiempo refuerza el circuito neuronal asociado, hasta el punto de que ese patrón se vuelve el "estado por defecto" de una persona, lo que él describe como estar "programado" para sentir siempre lo mismo. La base neurocientífica de esa idea (que la repetición fortalece circuitos y que los circuitos fortalecidos se activan con más facilidad) es sólida y está bien establecida en la literatura.` },
  { type: "p", text: `Donde conviene ser precisos es en no confundir esta base con afirmaciones más amplias sobre epigenética y manifestación que a veces se le atribuyen a Dispenza y que exceden lo que la evidencia actual puede sostener con el mismo nivel de certeza. Este libro interactivo toma de su trabajo lo que está bien respaldado (el poder de la repetición consciente y de la regulación emocional para reconfigurar patrones automáticos) y lo aplica de forma acotada al objetivo concreto de recuperar el foco, sin extender esas conclusiones más allá de lo que la ciencia puede confirmar hoy.` },
  {
    type: "cierre",
    items: [
      `Cada repetición, consciente o no, fortalece un circuito neuronal específico. El cerebro no distingue entre hábitos útiles y perjudiciales, solo refuerza lo que se repite.`,
      `Los circuitos que no se usan se debilitan con el tiempo, lo que hace posible reemplazar un patrón de distracción por uno de foco, de forma gradual.`,
      `La calidad de la atención durante la repetición es parte del mecanismo de cambio, no un detalle secundario.`,
      `El reto de 21 días trabaja con este principio de forma directa: cada ejercicio diario está diseñado para hacerse con atención consciente, no en piloto automático.`,
    ],
    ejercicio: `Elegí un momento del día de hoy en el que normalmente actuás en piloto automático (agarrar el celular al despertar, por ejemplo). Hacelo una sola vez, pero con atención plena a cada movimiento: notá el impulso antes de actuar, notá la sensación en el cuerpo, notá el momento exacto en que la mano se mueve. No hace falta que cambies la acción todavía, solo que la observes con conciencia completa. Registrá qué notaste. Este ejercicio es la semilla de la técnica que vas a usar todos los días a partir del Día 1.`,
  },
];

const MODULO3: Block[] = [
  {"type": "sumario", "items": ["Por qué este libro interactivo combina dos enfoques distintos", "El aporte de Dispenza: cuerpo, emoción y \"vivir en el pasado\"", "El aporte de Jung: inconsciente, sombra e individuación", "Por qué combinar ambos enfoques potencia los resultados", "Las diferencias de lenguaje y cómo se complementan"]},
  {"type": "h", "text": "Por qué este libro interactivo combina dos enfoques distintos"},
  {"type": "p", "text": "Hasta acá vimos que el cerebro se reconfigura por repetición (neuroplasticidad) y que la falta de foco tiene un correlato neurológico concreto (la Default Mode Network compitiendo con la red de atención). Ahora viene una pregunta más profunda: ¿por qué a algunas personas les cuesta mucho más que a otras sostener el foco, incluso haciendo los mismos ejercicios de regulación corporal? La respuesta, muchas veces, no está solo en el circuito neuronal, está en el contenido psicológico que ese circuito sostiene. Y ahí es donde la neurociencia sola se queda corta, y donde la psicología profunda de Carl Jung aporta una pieza que Dispenza no desarrolla con la misma profundidad."},
  {"type": "p", "text": "Este módulo no busca fusionar dos teorías en una sola, ni pretender que Dispenza y Jung \"dijeron lo mismo\". Busca algo más útil: mostrar que ambos describen, desde lenguajes distintos (uno biológico, uno simbólico), un mismo fenómeno central, la dificultad de un ser humano para sostener su atención en el presente cuando hay patrones automáticos, corporales o inconscientes, tirando en otra dirección."},
  {"type": "h", "text": "El aporte de Dispenza: cuerpo, emoción y \"vivir en el pasado\""},
  {"type": "p", "text": "La idea central que este libro interactivo toma del trabajo de Joe Dispenza es la siguiente: las emociones repetidas con frecuencia terminan condicionando al cuerpo a \"esperar\" esa misma emoción, incluso sin un estímulo presente que la justifique. Dispenza describe esto como vivir emocionalmente anclado en el pasado, el cuerpo reacciona a partir de patrones aprendidos, no de lo que realmente está pasando ahora."},
  {"type": "p", "text": "Aplicado al foco, esto explica un fenómeno muy común: personas que se sientan a trabajar y sienten ansiedad, inquietud o el impulso de \"hacer otra cosa\" sin que haya ningún estímulo externo que lo justifique en ese momento. El cuerpo está reaccionando a un estado emocional aprendido (por ejemplo, la ansiedad crónica de sentir que \"hay que estar siempre disponible\"), no a la tarea que tienen adelante. La propuesta práctica de Dispenza es clara: para cambiar el patrón, hay que cambiar primero el estado del cuerpo, y desde ahí, entrenar una nueva forma de estar presente."},
  {"type": "h", "text": "El aporte de Jung: inconsciente, sombra e individuación"},
  {"type": "p", "text": "Casi un siglo antes de que la neurociencia pudiera medir la actividad de la Default Mode Network, Carl Jung ya sostenía que buena parte de nuestro comportamiento está gobernado por contenidos que no vemos conscientemente. Uno de los conceptos centrales de su obra es la sombra: la parte de nuestra personalidad que contiene impulsos, deseos o rasgos que rechazamos o no reconocemos como propios, y que, precisamente por estar reprimidos, actúan desde el inconsciente sin que podamos regularlos de forma directa."},
  {"type": "p", "text": "Jung sostenía que ignorar la sombra no la hace desaparecer, la vuelve más activa desde el subsuelo psíquico, muchas veces proyectada hacia afuera (atribuyéndosela a otros) o expresada en comportamientos autosaboteadores que la persona no logra explicarse del todo. El proceso de reconocerla e integrarla conscientemente es lo que Jung llamó individuación: el camino hacia convertirse en una persona más completa y auténtica."},
  {"type": "p", "text": "Aplicado al foco, esta idea abre una pregunta incómoda pero muy útil: ¿qué parte de mí se beneficia de estar distraído? Para muchas personas, la distracción constante cumple una función psicológica que no es evidente a simple vista: evitar el contacto con un pensamiento incómodo, postergar una decisión que da miedo, o llenar un vacío emocional que aparece apenas hay silencio. Jung diría que ese impulso a distraerse no es simplemente un \"mal hábito\", es una manifestación de algo que la mente consciente prefiere no mirar de frente."},
  {"type": "h", "text": "Por qué combinar ambos enfoques potencia los resultados"},
  {"type": "p", "text": "Acá está el punto central de este módulo: Dispenza te da una vía de entrada corporal y neurológica (regular el estado del sistema nervioso para poder estar presente), mientras que Jung te da una vía de entrada psicológica y simbólica (entender qué contenido inconsciente está siendo evitado a través de esa falta de presencia). Trabajar solamente el cuerpo, sin mirar qué se está evitando, muchas veces produce resultados temporales, la persona logra concentrarse unos días y después \"misteriosamente\" vuelve al patrón viejo. Trabajar solamente la introspección, sin regular el cuerpo, produce el efecto contrario, mucha claridad mental sobre el propio patrón, pero sin la capacidad fisiológica de sostener la atención cuando el patrón se activa."},
  {"type": "ejemplo", "text": "Pensá en alguien que se distrae sistemáticamente cada vez que tiene que escribir un texto que expone su opinión públicamente (un informe, un posteo, un proyecto). Puede entrenar la respiración y la meditación durante semanas y mejorar su regulación general, pero si la distracción está funcionando como una forma de evitar el miedo inconsciente al juicio ajeno (un contenido de sombra muy común), esa persona va a seguir encontrando \"excusas\" para no sentarse a escribir, aunque su sistema nervioso esté más regulado que antes. En cambio, si además de regular el cuerpo empieza a hacerse la pregunta junguiana (\"¿qué estoy evitando sentir cuando pospongo esto?\"), tiene una oportunidad real de identificar el patrón de fondo y trabajarlo directamente, no solo gestionar sus síntomas.", "extra": "Por eso cada semana del reto (que vas a ver en detalle en la Parte III) combina un ejercicio de base corporal con un ejercicio de introspección escrita. No son dos actividades separadas, son dos entradas al mismo problema."},
  {"type": "h", "text": "Las diferencias de lenguaje y cómo se complementan"},
  {"type": "p", "text": "Vale la pena ser honestos sobre algo: Dispenza y Jung no son intercambiables, y este libro interactivo no pretende decir que lo son. Dispenza trabaja con un marco más cercano a la neurociencia aplicada y la fisiología (el sistema nervioso, la epigenética, la meditación activa), mientras que Jung trabaja con un marco simbólico y psicoanalítico (arquetipos, sombra, individuación) que no siempre es verificable con los mismos métodos empíricos que la neurociencia moderna. Uno describe mecanismos medibles, el otro describe patrones de sentido."},
  {"type": "p", "text": "La razón por la que este libro interactivo los pone a dialogar no es forzar una equivalencia científica entre ambos, sino reconocer que un ser humano no es solo un sistema nervioso a regular, ni solo un conjunto de contenidos inconscientes a interpretar, es ambas cosas al mismo tiempo. Un método que solo mira el cuerpo, o solo mira el significado, deja afuera la mitad del problema. Esa es la apuesta central de Neurohack 21: dos mapas, leídos juntos, del mismo territorio."},
  {"type": "cierre", "items": ["La falta de foco tiene una capa corporal y neurológica (lo que trabaja Dispenza) y una capa psicológica e inconsciente (lo que trabaja Jung).", "Regular solo el cuerpo, sin mirar qué se evita, suele dar resultados temporales. Mirar solo el patrón inconsciente, sin regular el cuerpo, da claridad sin sostén fisiológico.", "La pregunta clave que vas a repetir durante el reto no es solo \"¿cómo me concentro?\", sino también \"¿qué parte de mí se beneficia de no hacerlo?\".", "Ambos marcos se usan acá de forma acotada y honesta, sin forzar equivalencias que no corresponden entre neurociencia y psicología simbólica."], "ejercicio": "Pensá en la tarea que más postergás últimamente, la que \"siempre encontrás una excusa\" para no hacer. Sin juzgarte, registrá una respuesta honesta a esta pregunta: si postergar esta tarea me estuviera protegiendo de sentir algo incómodo, ¿qué sería? No busques la respuesta \"correcta\", dejá que aparezca lo primero que se te ocurra, aunque parezca ilógico. Esa respuesta va a ser un primer indicio del tipo de contenido que vas a trabajar con las herramientas junguianas del Módulo 5."},
];

const mod = (n: number, parte: string, titulo: string): Pagina => ({
  slug: `modulo-${n}`, kind: "modulo", eyebrow: `${parte} / Módulo ${n}`, titulo, blocks: pend,
});

export const LIBRO: Pagina[] = [
  { slug: "prologo", kind: "modulo", eyebrow: "Introducción", titulo: "Prólogo", tiempo: "4 min.", blocks: PROLOGO },
  { slug: "parte-1", kind: "parte", eyebrow: "Parte I", titulo: "El cerebro distraído", firstSlug: "modulo-1" },
  { slug: "modulo-1", kind: "modulo", eyebrow: "Parte I / Módulo 1", titulo: "La ciencia de la atención perdida", tiempo: "7 min.", blocks: MODULO1 },
  { slug: "modulo-2", kind: "modulo", eyebrow: "Parte I / Módulo 2", titulo: "Neuroplasticidad, la puerta del cambio", tiempo: "6 min.", blocks: MODULO2 },
  { slug: "modulo-3", kind: "modulo", eyebrow: "Parte I / Módulo 3", titulo: "Dos mapas para un mismo territorio", tiempo: "6 min.", blocks: MODULO3 },
  { slug: "parte-2", kind: "parte", eyebrow: "Parte II", titulo: "Los dos pilares del método", firstSlug: "modulo-4" },
  { slug: "modulo-4", kind: "modulo", eyebrow: "Parte II / Módulo 4", titulo: "El pilar Dispenza. Cambiar el estado para cambiar la mente", tiempo: "7 min.", blocks: MODULO4 },
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
  return { slug: p.slug, label: `Módulo ${n}: ${n === 4 ? "El pilar Dispenza" : p.titulo}` };
}
