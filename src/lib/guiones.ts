export type Guion = { situacion: string; texto: string };
export type CategoriaGuiones = {
  id: "trabajo" | "hogar" | "social" | "yo";
  tab: string;
  categoria: string;
  titulo: string;
  subtitulo?: string;
  copiable: boolean;
  guiones: Guion[];
};

export const GUIONES: CategoriaGuiones[] = [
  {
    id: "trabajo",
    tab: "Trabajo",
    categoria: "Trabajo",
    titulo: "Jefe o clientes",
    copiable: true,
    guiones: [
      { situacion: "Cuando empezás un horario de bloques protegidos:", texto: "Hola [nombre], te cuento que a partir de esta semana voy a tener bloques de trabajo enfocado en el horario de [franja horaria], durante los cuales voy a responder mensajes con algo más de demora. Fuera de ese horario estoy con disponibilidad normal. Cualquier urgencia real, avisame por [medio elegido] y lo veo enseguida." },
      { situacion: "Cuando alguien te escribe durante tu bloque protegido:", texto: "¡Hola! Estoy en un bloque de trabajo concentrado hasta las [hora], te respondo apenas termine. Si es urgente de verdad, decímelo y lo priorizo." },
      { situacion: "Cuando entregás algo y no querés que la disponibilidad se vuelva permanente:", texto: "Te dejo esto listo. Como comentario aparte, estos días voy a estar con menos disponibilidad para calls, priorizando tiempo de producción, cualquier cosa por escrito la veo con gusto." },
      { situacion: "Cuando te invitan a una reunión que podría ser un mensaje:", texto: "Antes de coordinar la reunión, ¿te parece si probamos resolverlo por escrito? Si después de eso queda algo pendiente, la armamos sin problema. Estoy tratando de proteger algunos bloques de trabajo profundo esta semana." },
      { situacion: "Cuando volvés de un bloque protegido y hay varios mensajes esperando:", texto: "Ya salí de mi bloque de foco, estoy revisando todo lo que llegó y te respondo enseguida por orden de urgencia." },
      { situacion: "Cuando un jefe o cliente te pide disponibilidad constante:", texto: "Puedo comprometerme a responder dentro de [plazo] en horario laboral. Fuera de los bloques de foco protegido, cualquier urgencia real la vemos apenas la marques como tal." },
    ],
  },
  {
    id: "hogar",
    tab: "Hogar",
    categoria: "Hogar",
    titulo: "Familia o convivientes",
    copiable: true,
    guiones: [
      { situacion: "Para pedir un bloque de foco en casa:", texto: "Necesito una hora de foco total para [tarea]. Si no es una emergencia, ¿podemos hablarlo cuando termine? Te aviso apenas salgo." },
      { situacion: "Para cuando alguien interrumpe seguido sin mala intención:", texto: "Sé que no es tu intención distraerme, pero necesito que estas interrupciones esperen a que salga de mi bloque de trabajo. Te prometo que después estoy 100% presente." },
      { situacion: "Para avisar antes de empezar el bloque, no en medio de la interrupción:", texto: "En un rato me pongo con mi bloque de foco de [horario]. Si necesitás algo, decímelo ahora o dejámelo anotado, así lo veo apenas termine." },
      { situacion: "Para cuando compartís espacio con otra persona que también necesita concentrarse:", texto: "¿Te parece si los dos respetamos este horario como bloque de silencio? A mí me ayuda muchísimo y creo que a vos también." },
      { situacion: "Para pedir disculpas sin sobre-explicar, si te salió cortante en el momento:", texto: "Antes te respondí medio seco, no fue por vos, estaba en medio de un bloque de foco. Ahora sí, contame." },
      { situacion: "Para cerrar el bloque y volver a estar disponible de verdad:", texto: "Ya terminé mi bloque de foco, ahora sí estoy 100% acá con vos." },
    ],
  },
  {
    id: "social",
    tab: "Social",
    categoria: "Social",
    titulo: "Redes sociales o grupos",
    copiable: true,
    guiones: [
      { situacion: "Mensaje de estado o respuesta automática:", texto: "Estoy en horario de foco protegido. Leo todo apenas termine, no hace falta reenviar ni marcar como urgente salvo que lo sea de verdad." },
      { situacion: "Para salir de un grupo o silenciarlo sin generar mal ambiente:", texto: "Voy a silenciar este grupo durante mis horarios de trabajo, no es nada personal, es parte de un método que estoy sosteniendo para mejorar mi concentración. Sigo al tanto de lo importante igual." },
      { situacion: "Para avisar que vas a tener menos actividad en redes por un tiempo:", texto: "Ando reduciendo el tiempo en redes durante esta etapa, así que si no reacciono a algo tuyo no es indiferencia, es una pausa que me estoy dando a propósito." },
      { situacion: "Para responder a alguien que insiste con \"¿por qué no contestás?\":", texto: "Perdón la demora, ando con horarios de foco protegido y dejo el celular de lado en esos bloques. Ya te leo con más calma." },
      { situacion: "Para pedirle a un grupo que agrupe las consultas en vez de mandarlas sueltas:", texto: "Para poder responder mejor, ¿les parece si las consultas las mandamos juntas en un mismo horario del día? Así puedo darles una respuesta más completa." },
      { situacion: "Para cuando volvés a estar disponible después de un bloque:", texto: "Ya estoy de vuelta, leo todo lo que se acumuló y respondo en un rato." },
    ],
  },
  {
    id: "yo",
    tab: "Yo mismo",
    categoria: "Yo mismo",
    titulo: "Guiones para vos",
    subtitulo: "(no se envían a nadie)",
    copiable: false,
    guiones: [
      { situacion: "Cuando aparece la culpa por poner un límite:", texto: "Proteger mi foco no es estar menos disponible para los demás, es estar más presente cuando sí estoy. Un límite claro hoy es una mejor versión mía mañana." },
      { situacion: "Cuando sentís que estás \"abandonando\" a alguien por tomarte el bloque:", texto: "No estoy abandonando a nadie, estoy organizando mi atención para poder darle a cada cosa lo que necesita, incluida esta persona." },
      { situacion: "Cuando el impulso de responder todo al instante aparece:", texto: "Responder rápido no es lo mismo que responder bien. Puedo tomarme el tiempo del bloque y de todas formas ser alguien confiable." },
      { situacion: "Cuando comparás tu ritmo con el de alguien que \"siempre está disponible\":", texto: "No sé qué le cuesta a esa disponibilidad constante. Yo elegí un ritmo que puedo sostener sin quemarme, y eso también es una forma de cuidar a los demás a largo plazo." },
      { situacion: "Cuando un bloque protegido no salió perfecto:", texto: "No hace falta que el bloque sea perfecto para que haya valido la pena. Cualquier minuto de foco real suma al circuito que estoy entrenando." },
      { situacion: "Antes de empezar el bloque, como recordatorio de intención:", texto: "Este tiempo es mío para enfocarme. Todo lo demás va a seguir estando ahí cuando termine." },
    ],
  },
];
