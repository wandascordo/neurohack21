import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import closeX from "@/assets/close-x.png.asset.json";

const ESCALA = ["Casi nunca", "Rara vez", "A veces", "Seguido", "Casi siempre"];
const AFIRMACIONES = [
  "Me siento a hacer algo importante y, sin darme cuenta, ya estoy haciendo otra cosa. (puntaje invertido)",
  "Cuando noto que me distraje, puedo identificar qué me distrajo.",
  "Puedo sostener un bloque de trabajo de al menos 20 minutos sin revisar el celular.",
  "Cuando algo me genera incomodidad, tiendo a posponerlo buscando cualquier otra tarea. (puntaje invertido)",
  "Después de una interrupción, puedo retomar lo que estaba haciendo sin que me cueste demasiado.",
  "Soy consciente de la tensión en mi cuerpo (mandíbula, hombros) mientras trabajo.",
  "Reviso el celular o las notificaciones aunque no haya sonado ninguna alerta. (puntaje invertido)",
  "Puedo estar presente en una conversación sin que mi mente se vaya a otra parte.",
  "Cuando algo me distrae, logro notarlo y volver a lo que estaba haciendo en menos de un minuto.",
  "Al final del día, siento que dirigí mi atención donde yo quise, más que donde el entorno la llevó.",
];
const MOMENTOS = ["Antes del Día 1", "Cierre Semana 1 (Día 7)", "Cierre Semana 2 (Día 14)", "Cierre del reto (Día 21)"];

const p = "self-stretch text-left text-base font-normal tracking-tight text-piedra";
const cell = "border border-carbon-10/10 px-1.5 py-1 text-left text-[10px] font-normal tracking-tight whitespace-nowrap";

export function InstructivoLink() {
  const [open, setOpen] = useState(false);
  const scrollY = useRef(0);

  function abrir() {
    scrollY.current = window.scrollY;
    setOpen(true);
  }
  function cerrar() {
    setOpen(false);
  }

  return (
    <>
      <p className="text-base font-normal tracking-tight text-piedra">
        Para quien prefiera lápiz y papel:{" "}
        <button type="button" onClick={abrir} className="underline underline-offset-2 hover:text-carbon">ver instructivo</button>.
      </p>
      <Dialog open={open} onOpenChange={(o) => !o && cerrar()}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            window.scrollTo({ top: scrollY.current, behavior: "instant" as ScrollBehavior });
          }}
          className="flex max-h-[calc(100svh-2.5rem)] w-[calc(100%-30px)] max-w-[370px] flex-col gap-5 overflow-hidden rounded-[20px] border border-carbon-10/10 bg-white px-5 pb-[30px] pt-5 font-rethink-sans shadow-[3px_3px_10px_0px_rgb(29_29_29_/_0.1)] sm:rounded-[20px] [&>button:last-child]:hidden"
        >
          <div className="w-fit rounded-full bg-carbon-10/10 px-4 py-2">
            <p className="text-center text-base font-semibold leading-none text-salvia">Autoevaluación de Foco</p>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto py-2.5">
            <div className="flex flex-col gap-1 self-stretch">
              <DialogTitle className="text-left text-[22px] font-normal leading-[1.1] tracking-[-1.00px] text-carbon">Sobre la Autoevaluación de Foco</DialogTitle>
              <p className="text-left text-lg font-normal leading-[1.1] tracking-tight text-carbon">(para quien prefiera lápiz y papel)</p>
            </div>
            <DialogDescription className={p}>La Autoevaluación de Foco es la herramienta de medición que vas a usar cuatro veces a lo largo del reto: antes del Día 1, al cierre de la Semana 1, al cierre de la Semana 2, y al cierre del Día 21. Es la misma evaluación las cuatro veces, para que las respuestas sean comparables entre sí.</DialogDescription>
            <p className={p}>Consiste en diez afirmaciones cortas que calificás del 1 al 5, según qué tan seguido te pasó durante la última semana (o, si es tu primera vez haciéndola, durante un período reciente típico):</p>
            <div className="flex flex-col gap-0.5 self-stretch rounded-[10px] bg-carbon/3 p-2.5">
              {ESCALA.map((t, i) => (
                <div key={t} className="flex flex-row items-center gap-1 p-1">
                  <span className="w-3 text-center text-sm font-bold tracking-tight text-salvia">{i + 1}</span>
                  <span className="text-base font-semibold tracking-tight text-salvia">=</span>
                  <span className="flex-1 text-base font-semibold tracking-tight text-salvia">{t}</span>
                </div>
              ))}
            </div>
            <p className={p}>
              La recomendación de este libro interactivo es que la hagas directamente desde el recurso{" "}
              <Link to="/autoevaluacion" className="underline underline-offset-2 hover:text-carbon">Autoevaluación de Foco</Link>{" "}
              en el menú: ahí las diez afirmaciones aparecen una por una, la app calcula tu puntaje automáticamente (invirtiendo el valor de las que están redactadas al revés) y te muestra tu resultado al instante, junto con qué significa tu rango. Además, guarda cada una de tus cuatro mediciones en tu Tracker Visual, para que las puedas comparar sin anotar nada por tu cuenta.
            </p>
            <p className={p}>Si preferís de todas formas hacerla con lápiz y papel antes de cargarla, estas son las diez afirmaciones:</p>
            <ol className="flex flex-col self-stretch">
              {AFIRMACIONES.map((a, i) => (
                <li key={a} className="flex gap-1 border-b border-carbon-10/10 p-2.5 text-base font-semibold tracking-tight text-piedra">
                  <span>{i + 1}.</span>
                  <span className="flex-1">{a}</span>
                </li>
              ))}
            </ol>
            <p className={p}>Para los ítems invertidos (1, 4 y 7), invertí el valor antes de sumar: si pusiste 5, contá 1; si pusiste 4, contá 2; si pusiste 3, dejalo en 3; si pusiste 2, contá 4; si pusiste 1, contá 5. Sumá los diez valores para obtener un puntaje de 10 a 50.</p>
            <table className="w-full shrink-0 border-collapse self-stretch">
              <thead>
                <tr className="bg-carbon/3 text-piedra">
                  <th className={cell}>Momento</th>
                  <th className={`${cell} w-[56px]`}>Fecha</th>
                  <th className={`${cell} text-center`}>Puntaje (10-50)</th>
                </tr>
              </thead>
              <tbody>
                {MOMENTOS.map((m) => (
                  <tr key={m} className="text-carbon">
                    <td className={cell}>{m}</td>
                    <td className={cell} />
                    <td className={cell} />
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={p}>Este no es un test clínico ni un diagnóstico, es una herramienta de autopercepción diseñada para este libro interactivo, pensada para que el cambio que vayas logrando quede reflejado en algo más concreto que "me siento mejor" o "me siento igual".</p>
            <p className={p}>Una nota importante antes de que hagas tu primera medición: no busques que el número suba en línea recta cada semana. Es normal, y hasta esperable, que en la Semana 2 el puntaje se mantenga estable o incluso baje levemente, porque estás mirando de frente contenidos que antes evitabas (Módulo 5), y eso a veces genera más conciencia del problema antes de que aparezca la mejora. Lo que importa es la tendencia general entre la primera y la última medición, no cada salto semanal por separado.</p>
            <button type="button" onClick={cerrar} className="flex shrink-0 items-center justify-center self-stretch rounded-full bg-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-tiza">Listo</button>
          </div>
          <button type="button" onClick={cerrar} aria-label="Cerrar" className="absolute right-[17px] top-[17px] z-10">
            <img className="h-6 w-6" src={closeX.url} alt="" />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
