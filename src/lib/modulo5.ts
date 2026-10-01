import type { Block } from "./libro";

export const MODULO5: Block[] = [
  {
    type: "sumario",
    items: [
      "La sombra como fuente de distracción emocional",
      "Arquetipos y patrones que sabotean el enfoque",
      "El diario de introspección como herramienta de individuación",
      "Ejercicios base",
      "Cómo se combina esto con el pilar Dispenza",
    ],
  },
  { type: "h", text: "La sombra como fuente de distracción emocional" },
  { type: "p", text: "En el Módulo 3 introdujimos el concepto de sombra: la parte de la personalidad que contiene impulsos, rasgos o emociones que no reconocemos como propios y que, por eso mismo, permanecen activos desde el inconsciente sin que podamos regularlos de forma directa. Carl Jung fue muy claro en un punto que conviene subrayar acá: la sombra no es \"lo malo\" de una persona, es simplemente lo que esa persona no logró integrar conscientemente, y puede incluir tanto rasgos que consideramos negativos (envidia, enojo, necesidad de control) como cualidades positivas que reprimimos por vergüenza o por mandatos familiares (creatividad, asertividad, ambición)." },
  { type: "p", text: "Aplicado al foco, la sombra actúa muchas veces como un generador silencioso de distracción emocional. Cuando hay un contenido inconsciente que genera malestar (miedo, culpa, vergüenza) y ese contenido se activa aunque sea levemente al enfrentar una tarea determinada, la mente busca automáticamente algo que la aleje de esa incomodidad. La distracción, en estos casos, no es el problema en sí, es el síntoma visible de un conflicto que está ocurriendo en un nivel que no vemos directamente." },
  { type: "p", text: "Una persona que necesita revisar sus finanzas y en cambio se encuentra ordenando el escritorio, respondiendo mensajes sin urgencia real o mirando el celular, probablemente no tiene un problema de organización. Es más probable que exista una emoción de fondo (miedo a un número que confirme algo que no quiere ver, vergüenza por decisiones pasadas) que la tarea de las finanzas activa sin que la persona lo note conscientemente. La mente encuentra la distracción como una salida más cómoda que enfrentar esa emoción." },
  { type: "h", text: "Arquetipos y patrones que sabotean el enfoque" },
  { type: "p", text: "Jung también describió los arquetipos, patrones universales de comportamiento y significado que se repiten a lo largo de la historia humana y las culturas, y que operan como moldes psicológicos heredados. No hace falta profundizar en la totalidad de la teoría arquetípica para este libro interactivo, pero sí vale la pena señalar cómo algunos de estos patrones suelen manifestarse como saboteadores concretos del foco." },
  {
    type: "bullets",
    items: [
      "El patrón del \"Niño Herido\" puede aparecer como la necesidad constante de aprobación externa, que lleva a revisar notificaciones de forma compulsiva en busca de validación.",
      "El patrón del \"Perfeccionista\" (relacionado con lo que Jung llamaría una sombra proyectada del propio juicio interno) puede aparecer como la procrastinación frente a tareas que se perciben como una prueba de valor personal, evitar empezar es una forma de evitar el riesgo de \"no ser suficientemente bueno\".",
      "El patrón del \"Cuidador\" puede llevar a interrumpir el propio trabajo constantemente para atender pedidos ajenos, porque el valor propio quedó asociado inconscientemente a estar siempre disponible para otros.",
    ],
  },
  { type: "p", text: "Estos patrones no son diagnósticos ni categorías cerradas, son lentes de lectura. Lo importante no es encasillarte en uno, sino usarlos como preguntas: ¿qué necesidad más profunda podría estar cumpliendo mi distracción en este momento particular?" },
  { type: "h", text: "El diario de introspección como herramienta de individuación" },
  { type: "p", text: "Jung usaba el término individuación para describir el proceso de integrar conscientemente los contenidos de la sombra y volverse una persona más completa y auténtica. Una de las herramientas más simples y con mayor respaldo empírico independiente para este tipo de trabajo introspectivo es la escritura expresiva." },
  { type: "p", text: "El psicólogo James Pennebaker, en un estudio pionero de 1986 replicado cientos de veces desde entonces, encontró que escribir sobre pensamientos y emociones profundas durante 15 a 20 minutos al día, unos pocos días seguidos, se asocia con mejoras medibles en bienestar psicológico, memoria de trabajo y regulación del estrés. La explicación que propone Pennebaker es que mantener una emoción o un pensamiento sin expresar consume recursos cognitivos de forma constante (monitorear el tema, evitar que aparezca en la conversación, contenerlo), y que ponerlo en palabras libera esos recursos y permite organizar la experiencia de una forma más manejable." },
  { type: "p", text: "Esto conecta directamente con el trabajo junguiano: escribir sobre lo que uno evita, sin juzgarlo ni corregirlo, es una forma concreta y accesible de empezar a iluminar contenidos que hasta ese momento operaban desde el inconsciente. No hace falta interpretación simbólica compleja para que el ejercicio funcione, el solo hecho de nombrar lo que se evita ya reduce parte de su carga. Cada uno de los ejercicios de este módulo va a tener su espacio propio en tu Registro Diario, así que no necesitás llevar nada en paralelo.", links: [{ text: "Registro Diario", to: "/registro-diario" }] },
  { type: "h", text: "Ejercicios base" },
  {
    type: "pasos",
    items: [
      { title: "Escritura de sombra", paragraphs: ["Consiste en responder por escrito, sin filtro ni corrección, preguntas como: \"¿qué es lo que más me molesta de tal persona?\" o \"¿qué parte de mí no quiero que los demás vean?\". Las respuestas suelen señalar, de forma indirecta, contenidos de la propia sombra proyectados hacia afuera. Jung sostenía que lo que más nos irrita de otra persona con frecuencia es un espejo de algo que no toleramos en nosotros mismos."] },
      { title: "Diálogo interno", paragraphs: ["Consiste en escribir una conversación imaginaria entre \"vos\" y la parte de vos que genera la distracción, dándole voz a esa parte en primera persona. Por ejemplo: \"Yo, la parte que te hace revisar el celular todo el tiempo, existo porque...\" Este ejercicio, inspirado en técnicas de escritura terapéutica, ayuda a des-identificarse del impulso automático y a mirarlo con más curiosidad que juicio."] },
      { title: "Símbolos personales", paragraphs: ["Consiste en prestar atención a imágenes recurrentes que aparecen en sueños, distracciones o pensamientos espontáneos (un lugar, un objeto, un animal) y anotarlas sin buscar de inmediato una interpretación cerrada. Jung trabajaba mucho con símbolos como puentes entre el consciente y el inconsciente, no como códigos con un significado fijo y universal, sino como material personal a explorar con el tiempo."] },
    ],
  },
  { type: "ejemplo", text: "Sofía, antes de sentarse a escribir una propuesta comercial importante, nota que se distrae constantemente revisando Instagram. En lugar de forzarse a concentrarse mediante pura disciplina, escribe cinco minutos de diálogo interno: \"Yo, la parte que te hace mirar Instagram antes de escribir la propuesta, existo porque me da miedo que la rechacen y prefiero no enterarme\". Ese solo ejercicio, sin necesidad de resolver el miedo por completo, ya reduce buena parte de la carga inconsciente que estaba alimentando la distracción, y hace mucho más fácil sentarse después a trabajar con la respiración de coherencia cardíaca del Módulo 4." },
  { type: "h", text: "Cómo se combina esto con el pilar Dispenza" },
  { type: "p", text: "Vale la pena remarcar la secuencia práctica: el trabajo junguiano de este módulo no reemplaza la regulación corporal del Módulo 4, la completa. Un orden que funciona bien para la mayoría de las personas es primero regular el cuerpo (respiración, escaneo corporal) para poder acceder a la introspección desde un estado menos reactivo, y recién después hacer el ejercicio de escritura, porque escribir sobre contenidos incómodos con el sistema nervioso ya activado suele derivar en rumiación en lugar de reflexión genuina." },
  {
    type: "cierre",
    items: [
      "La distracción muchas veces no es el problema en sí, es el síntoma visible de un contenido inconsciente (un miedo, una vergüenza, una necesidad no reconocida) que la mente evita mirar de frente.",
      "Los patrones arquetípicos (el Niño Herido, el Perfeccionista, el Cuidador, entre otros) son lentes útiles para preguntarse qué necesidad más profunda podría estar cumpliendo una distracción recurrente.",
      "La escritura expresiva tiene respaldo científico sólido para reducir la carga cognitiva de contenidos emocionales no procesados, y funciona como una vía práctica y accesible de trabajo junguiano.",
      "El orden recomendado es regular primero el cuerpo, y recién después hacer el trabajo de introspección escrita, para evitar caer en rumiación.",
    ],
    ejercicio: "Elegí la tarea que identificaste en el Módulo 3 como la que más postergás. Después de tu secuencia de regulación corporal (Módulo 4), escribí cinco minutos de diálogo interno dándole voz en primera persona a la parte de vos que te lleva a postergarla. No busques resolver nada ni llegar a una conclusión ordenada, dejá que el ejercicio sea exploratorio. Guardalo en tu Registro Diario, vas a volver sobre este mismo material en la Semana 2 del reto.",
    ejercicioLinks: [{ text: "Registro Diario", to: "/registro-diario" }],
  },
];
