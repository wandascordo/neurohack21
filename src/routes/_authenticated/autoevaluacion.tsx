import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { supabase } from "@/integrations/supabase/client";
import { AFIRMACIONES, OPCIONES, puntaje, rango, fechaLarga, hora } from "@/lib/autoevaluacion";
import focoIcon from "@/assets/menu-foco.png.asset.json";
import backIcon from "@/assets/menu-back.png.asset.json";
import chevron from "@/assets/ob-chevron.png.asset.json";
import closeX from "@/assets/close-x.png.asset.json";

export const Route = createFileRoute("/_authenticated/autoevaluacion")({
  head: () => meta("Autoevaluación de Foco", "Medí cómo cambia tu foco a lo largo del reto."),
  component: Autoevaluacion,
});

type Registro = { id: string; answers: number[]; total_score: number; created_at: string };
type Vista =
  | { v: "intro" }
  | { v: "preguntas" }
  | { v: "resultado"; answers: number[] }
  | { v: "lista" }
  | { v: "detalle"; r: Registro };

const btnSec = "flex h-fit flex-row items-center justify-center self-stretch overflow-hidden rounded-full bg-carbon-10/10 px-6 py-4 text-base font-semibold uppercase leading-none text-carbon";

function MaskIcon({ url, className }: { url: string; className: string }) {
  const m = `url(${url}) center / contain no-repeat`;
  return <span aria-hidden className={`block shrink-0 ${className}`} style={{ mask: m, WebkitMask: m }} />;
}

function Chip() {
  return (
    <div className="flex self-stretch justify-center py-2.5">
      <div className="rounded-full bg-carbon-10/10 px-4 py-2">
        <p className="text-base font-semibold leading-none text-salvia">Autoevaluación de Foco</p>
      </div>
    </div>
  );
}

function Volver({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1 py-1">
      <MaskIcon url={backIcon.url} className="h-5 w-5 bg-piedra" />
      <span className="text-sm tracking-tight text-carbon">Volver</span>
    </button>
  );
}

function useResultados() {
  return useQuery({
    queryKey: ["focus-assessments"],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("focus_assessments")
        .select("id, answers, total_score, created_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Registro[];
    },
  });
}

function Autoevaluacion() {
  const [vista, setVista] = useState<Vista>({ v: "intro" });
  return (
    <BookScreen fill>
      <TopBar />
      <Chip />
      {vista.v === "intro" && <Intro setVista={setVista} />}
      {vista.v === "preguntas" && <Preguntas onExit={() => setVista({ v: "intro" })} onDone={(a) => setVista({ v: "resultado", answers: a })} />}
      {vista.v === "resultado" && <ResultadoNuevo answers={vista.answers} onSaved={() => setVista({ v: "lista" })} />}
      {vista.v === "lista" && <Lista onBack={() => setVista({ v: "intro" })} onOpen={(r) => setVista({ v: "detalle", r })} />}
      {vista.v === "detalle" && <Detalle r={vista.r} onBack={() => setVista({ v: "lista" })} />}
    </BookScreen>
  );
}

function Intro({ setVista }: { setVista: (v: Vista) => void }) {
  const { data } = useResultados();
  return (
    <div className="flex flex-1 flex-col gap-2.5 self-stretch">
      <div className="flex flex-1 flex-col justify-center gap-5 px-2.5 py-[50px]">
        <MaskIcon url={focoIcon.url} className="h-10 w-10 bg-salvia" />
        <div className="flex flex-col gap-3.5">
          <p className="text-[28px] leading-[1.1] tracking-[-1.5px] text-carbon">Leé cada afirmación y calificala, según qué tan seguido te pasó durante la última semana</p>
          <p className="text-base tracking-tight text-piedra">No pienses demasiado cada respuesta, marcá lo primero que sientas que es cierto.</p>
        </div>
      </div>
      <button type="button" onClick={() => setVista({ v: "preguntas" })} className={`${btnPrimary} self-stretch`}>Realizar autoevaluación</button>
      {data && data.length > 0 && (
        <button type="button" onClick={() => setVista({ v: "lista" })} className={btnSec}>Mis resultados</button>
      )}
    </div>
  );
}

function Preguntas({ onExit, onDone }: { onExit: () => void; onDone: (a: number[]) => void }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [flash, setFlash] = useState<number | null>(null);
  const elegir = (v: number) => {
    if (flash !== null) return;
    const next = [...answers];
    next[i] = v;
    setAnswers(next);
    setFlash(v);
    setTimeout(() => {
      setFlash(null);
      if (i === 9) onDone(next);
      else setI(i + 1);
    }, 350);
  };
  return (
    <div className="flex flex-1 flex-col justify-between gap-8 self-stretch px-2.5 pb-[30px] pt-2.5">
      <div className="flex items-center justify-between">
        <Volver onClick={() => (i === 0 ? onExit() : setI(i - 1))} />
        <span className="rounded-full border border-piedra px-2.5 py-1 text-xs tracking-tight text-piedra">{i + 1}/10</span>
      </div>
      <p className="text-center text-[28px] leading-[1.1] tracking-[-1.5px] text-carbon">"{AFIRMACIONES[i]}"</p>
      <div className="flex justify-center gap-1 py-2.5">
        {AFIRMACIONES.map((_, k) => (
          <span key={k} className={`h-1 w-1 rounded-full ${k === i ? "bg-salvia" : "bg-carbon-10/10"}`} />
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {OPCIONES.map((o, k) => {
          const v = k + 1;
          const sel = flash === v || (flash === null && answers[i] === v);
          return (
            <button key={o} type="button" onClick={() => elegir(v)}
              className={`rounded-full border border-salvia px-6 py-4 text-base font-semibold uppercase leading-none transition-colors ${sel ? "bg-salvia text-tiza" : "text-salvia"}`}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Arco({ score }: { score: number }) {
  const d = "M 7.5 147 A 139.5 139.5 0 0 1 286.5 147";
  return (
    <svg viewBox="0 0 294 147" className="absolute left-1/2 top-[38px] h-[147px] w-[294px] -translate-x-1/2" aria-hidden>
      <path d={d} fill="none" strokeWidth="15" pathLength={100} className="stroke-carbon-10/10" />
      <path d={d} fill="none" strokeWidth="15" pathLength={100} strokeDasharray={`${(score / 50) * 100} 100`} className="stroke-salvia" />
    </svg>
  );
}

function ResultadoVista({ score, fecha, children }: { score: number; fecha?: string; children: React.ReactNode }) {
  const r = rango(score);
  return (
    <div className="flex flex-1 flex-col justify-between gap-10 self-stretch py-5">
      <div className="flex flex-col gap-10">
        {fecha && <p className="-mb-6 text-center text-sm tracking-tight text-piedra">{fecha}</p>}
        <div className="relative flex flex-col items-center gap-2.5 px-5 pb-5 pt-[100px]">
          <Arco score={score} />
          <p className="relative text-center text-carbon"><span className="text-5xl leading-none tracking-tight">{score}</span><span className="text-lg text-piedra">/50</span></p>
          <p className="relative text-base font-semibold leading-none text-piedra">{fecha ? "Tu puntaje" : "Tu puntaje de hoy"}</p>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
          <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{r.titular}</p>
          <p className="text-base tracking-tight text-carbon">{r.cuerpo}</p>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <p className="rounded-[10px] bg-carbon/[0.03] p-3.5 text-xs tracking-tight text-piedra">
          Este no es un test clínico ni un diagnóstico, es una herramienta de autopercepción pensada para que el cambio que vayas logrando quede reflejado en algo más concreto que <em>“me siento mejor”</em> o <em>“me siento igual”</em>.
        </p>
        {children}
      </div>
    </div>
  );
}

function ResultadoNuevo({ answers, onSaved }: { answers: number[]; onSaved: () => void }) {
  const score = puntaje(answers);
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const guardar = async () => {
    setSaving(true);
    const { error } = await supabase.from("focus_assessments").insert({ answers, total_score: score });
    setSaving(false);
    if (error) { toast("No pudimos guardar tu resultado. Probá de nuevo."); return; }
    await qc.invalidateQueries({ queryKey: ["focus-assessments"] });
    onSaved();
  };
  return (
    <ResultadoVista score={score}>
      <button type="button" disabled={saving} onClick={guardar} className={`${btnPrimary} self-stretch disabled:opacity-60`}>Guardar resultado</button>
    </ResultadoVista>
  );
}

function Lista({ onBack, onOpen }: { onBack: () => void; onOpen: (r: Registro) => void }) {
  const { data } = useResultados();
  return (
    <div className="flex flex-col gap-5 self-stretch pb-28">
      <Volver onClick={onBack} />
      <h1 className="text-[28px] leading-[1.1] tracking-[-1.5px] text-carbon">Mis resultados</h1>
      <div className="flex flex-col gap-2.5">
        {(data ?? []).map((r) => (
          <button key={r.id} type="button" onClick={() => onOpen(r)} className="flex flex-col gap-1 rounded-[20px] border border-carbon-10/10 bg-tiza p-2.5 text-left">
            <div className="flex items-center gap-2.5 p-1">
              <p className="flex-1 text-sm tracking-tight text-piedra">{fechaLarga(r.created_at)} – {hora(r.created_at)} hs</p>
              <MaskIcon url={chevron.url} className="h-6 w-6 bg-piedra" />
            </div>
            <div className="flex flex-col gap-2.5 rounded-[10px] bg-carbon/[0.03] p-3.5">
              <div className="flex items-center gap-2.5">
                <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{r.total_score} puntos</p>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-carbon-10/10">
                  <div className="h-full rounded-full bg-salvia" style={{ width: `${(r.total_score / 50) * 100}%` }} />
                </div>
              </div>
              <p className="text-xs tracking-tight text-carbon">{rango(r.total_score).titular}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[400px] bg-gradient-to-t from-tiza from-60% to-transparent px-5 pb-10 pt-10">
        <Link to="/tracker" className={`${btnPrimary} w-full`}>Ir al tracker visual</Link>
      </div>
    </div>
  );
}

function Detalle({ r, onBack }: { r: Registro; onBack: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();
  const eliminar = async () => {
    setBusy(true);
    const { error } = await supabase.from("focus_assessments").delete().eq("id", r.id);
    setBusy(false);
    if (error) { toast("No pudimos eliminar el resultado. Probá de nuevo."); return; }
    setOpen(false);
    await qc.invalidateQueries({ queryKey: ["focus-assessments"] });
    toast("Resultado eliminado");
    onBack();
  };
  return (
    <>
      <div className="self-stretch"><Volver onClick={onBack} /></div>
      <ResultadoVista score={r.total_score} fecha={`${fechaLarga(r.created_at)} – ${hora(r.created_at)} hs`}>
        <button type="button" onClick={() => setOpen(true)} className={btnSec}>Eliminar resultado</button>
      </ResultadoVista>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-tiza/40 px-4 backdrop-blur-md" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal className="flex w-full max-w-[370px] flex-col gap-5 rounded-[20px] bg-blanco p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="self-end">
              <MaskIcon url={closeX.url} className="h-6 w-6 bg-piedra" />
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-piedra">Eliminar resultado</p>
              <p className="text-xl leading-tight tracking-tight text-carbon">¿Querés eliminar el resultado de tu autoevaluación del {fechaLarga(r.created_at)} a las {hora(r.created_at)}hs?</p>
              <p className="text-base tracking-tight text-piedra">Una vez eliminado, no podrás volver a recuperarlo.</p>
            </div>
            <div className="flex flex-col gap-2.5 pt-3">
              <button type="button" disabled={busy} onClick={eliminar} className={`${btnPrimary} disabled:opacity-60`}>Sí, eliminar resultado</button>
              <button type="button" onClick={() => setOpen(false)} className={btnSec}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
