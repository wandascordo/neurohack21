import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/boton-anti-distraccion")({
  head: () => meta("Botón Anti-Distracción", "Una guía de rescate de 3 pasos para cuando sentís el impulso de distraerte."),
  component: BotonAntiDistraccion,
});

const btnGris =
  "flex h-fit shrink-0 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full bg-carbon-10/10 px-6 py-4 text-base font-semibold uppercase leading-none text-carbon";

type Paso = { n: number; titulo: string; cuerpo: ReactNode; pie: string; seg: number };
const PASOS: Paso[] = [
  { n: 1, titulo: "Respirar", seg: 30, pie: "30 segundos", cuerpo: <>Realizá tres respiraciones de <strong className="font-semibold">5 segundos de inhalación</strong> y <strong className="font-semibold">5 de exhalación</strong>. Nada más.</> },
  { n: 2, titulo: "Nombrar", seg: 10, pie: "10 segundos", cuerpo: <>Preguntate en silencio: <strong className="font-semibold">¿qué estoy evitando sentir en este momento?</strong> No busques la respuesta perfecta, dejá que aparezca la primera palabra.</> },
  { n: 3, titulo: "Decidir", seg: 5, pie: "5 segundos", cuerpo: <>Con el cuerpo un poco más regulado y la pregunta hecha, elegí conscientemente: <strong className="font-semibold">¿vuelvo a la tarea, o me tomo 2 minutos de pausa?</strong> Cualquiera de las dos está bien, siempre que sea una decisión y no un arrastre automático.</> },
];

/** El aro es acumulado: representa el avance sobre la duración total del ejercicio (30 + 10 + 5 = 45 s). */
const TOTAL = PASOS.reduce((a, b) => a + b.seg, 0);

function Etiqueta() {
  return (
    <div className="flex flex-col items-center self-stretch h-fit py-2.5">
      <div className="flex select-none flex-col gap-2.5 items-center w-fit h-fit bg-carbon-10/10 rounded-full py-2 px-4">
        <p className="text-base font-semibold text-center text-salvia leading-none self-stretch h-fit">Botón Anti-Distracción</p>
      </div>
    </div>
  );
}

/** Progreso por hora real: sigue correcto aunque la pantalla se apague. */
function useProgreso(inicio: number | null, seg: number) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    if (inicio == null) return;
    let raf = 0;
    const tick = () => {
      setAhora(Date.now());
      if (Date.now() - inicio < seg * 1000) raf = requestAnimationFrame(tick);
    };
    tick();
    const vis = () => setAhora(Date.now());
    document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", vis); };
  }, [inicio, seg]);
  if (inicio == null) return 0;
  return Math.min(1, Math.max(0, (ahora - inicio) / (seg * 1000)));
}

function Aro({ p }: { p: number }) {
  const r = 154, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="160" cy="160" r={r} fill="none" strokeWidth="12" className="stroke-carbon-10/10" />
      <circle cx="160" cy="160" r={r} fill="none" strokeWidth="12" className="stroke-salvia"
        strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform="rotate(90 160 160)" />
    </svg>
  );
}

function Puntos({ activo }: { activo: number }) {
  return (
    <div className="flex flex-row gap-1 justify-center items-center self-stretch h-fit py-2.5 px-1" aria-hidden>
      {[1, 2, 3].map((i) => <div key={i} className={`w-1 h-1 rounded-full ${i === activo ? "bg-salvia" : "bg-carbon-10/10"}`} />)}
    </div>
  );
}

function PantallaAro({ p, chico, titulo, cuerpo, pie, punto, boton, primario, onBoton }: {
  p: number; chico: string; titulo: string; cuerpo: ReactNode; pie: string; punto: number; boton: string; primario: boolean; onBoton: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 items-center self-stretch flex-1 animate-fade-in">
      <div className="flex flex-col justify-center items-center self-stretch flex-1">
        <div className="relative flex h-80 w-80 shrink-0 items-center justify-center">
          <Aro p={p} />
          <div className="relative flex flex-col gap-2.5 items-center px-7">
            <p className="text-base font-normal text-center text-piedra tracking-tight">{chico}</p>
            <p className="text-[28px] font-normal text-center text-carbon leading-[1.1] tracking-[-1.50px]">{titulo}</p>
            <p className="text-sm text-center text-carbon tracking-tight">{cuerpo}</p>
            <p className="text-xs font-normal text-center text-piedra tracking-tight">{pie}</p>
          </div>
        </div>
      </div>
      <Puntos activo={punto} />
      <button type="button" onClick={onBoton} className={`${primario ? btnPrimary : btnGris} self-stretch transition-colors`}>{boton}</button>
    </div>
  );
}

function PasoView({ paso, autoInicio, onSiguiente }: { paso: Paso; autoInicio: boolean; onSiguiente: () => void }) {
  const [inicio, setInicio] = useState<number | null>(autoInicio ? Date.now() : null);
  const fr = useProgreso(inicio, paso.seg);
  const corriendo = inicio != null && fr < 1;
  const sinIniciar = inicio == null;
  // El aro es acumulado: arranca donde terminó el paso anterior.
  const base = PASOS.slice(0, paso.n - 1).reduce((a, b) => a + b.seg, 0);
  const p = (base + fr * paso.seg) / TOTAL;
  return (
    <PantallaAro p={p} chico={`Paso ${paso.n}`} titulo={paso.titulo} cuerpo={paso.cuerpo} pie={paso.pie} punto={paso.n}
      boton={sinIniciar ? "Iniciar" : "Siguiente"} primario={!corriendo}
      onBoton={() => (sinIniciar ? setInicio(Date.now()) : onSiguiente())} />
  );
}

function BotonAntiDistraccion() {
  const [pantalla, setPantalla] = useState(0); // 0 inicio, 1-3 pasos, 4 cierre
  const registrado = useRef(false);

  useEffect(() => {
    if (pantalla !== 4 || registrado.current) return;
    registrado.current = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        await supabase.from("resource_usage_events").insert({
          user_id: data.user.id, resource: "boton-anti-distraccion",
          resource_type: "recurso", resource_name: "boton-anti-distraccion",
        });
      } catch { /* silencioso */ }
    })();
  }, [pantalla]);

  return (
    <BookScreen fill>
      <TopBar />
      <Etiqueta />
      {pantalla === 0 && (
        <div className="flex flex-col gap-10 items-center self-stretch flex-1 animate-fade-in pb-2.5">
          <div className="relative flex flex-1 items-center justify-center self-stretch overflow-hidden -mx-5 min-h-[560px]">
            {[240, 320, 400, 480, 560].map((s, i) => (
              <div key={s} className="absolute rounded-full border-2 border-salvia animate-anillo"
                style={{ width: s, height: s, opacity: [0.4, 0.3, 0.2, 0.1, 0.05][i], animationDelay: `${i * 0.25}s` }} />
            ))}
            <button type="button" onClick={() => { registrado.current = false; setPantalla(1); }}
              className="relative flex h-[180px] w-[180px] items-center justify-center rounded-full bg-salvia px-6 py-4">
              <span className="text-lg font-semibold text-center text-tiza leading-[1.1] tracking-tight">Botón<br />Anti-Distracción</span>
            </button>
          </div>
          <p className="text-base font-normal text-center text-salvia tracking-tight self-stretch px-2.5">
            Usalo cuando sientas:<br /><em>“Tengo el impulso de distraerme ahora mismo”</em>
          </p>
        </div>
      )}
      {pantalla >= 1 && pantalla <= 3 && (
        <PasoView key={pantalla} paso={PASOS[pantalla - 1]!} autoInicio={pantalla > 1} onSiguiente={() => setPantalla(pantalla + 1)} />
      )}
      {pantalla === 4 && (
        <PantallaAro p={1} chico="Ejercicio completado" titulo="Listo"
          cuerpo="Respiraste, nombraste lo que estabas evitando y elegiste. Esta vez el impulso no decidió por vos."
          pie="Podés volver cuando lo necesites" punto={3} boton="Finalizar" primario onBoton={() => setPantalla(0)} />
      )}
    </BookScreen>
  );
}
