import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { meta } from "@/components/Placeholder";
import { CheckLleno, CheckVacio, Pill } from "@/components/registro/RegistroUI";
import { Chip, Encabezado, Guardado, IrAlModulo, Volver, inputBox } from "@/components/registro/PlanUI";
import { RITUAL_CUANDO, RITUAL_PRACTICAS, guardarRitual, ritualQuery, type Ritual } from "@/lib/plan";

export const Route = createFileRoute("/_authenticated/registro-diario_/plan_/ritual")({
  head: () => meta("Mi ritual mínimo · Mi plan de mantenimiento", "Una práctica breve para sostener después del Día 21."),
  component: RitualPage,
});

function RitualPage() {
  const { data } = useQuery(ritualQuery);
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch animate-fade-in">
        <Volver to="/registro-diario/plan" />
        <Encabezado eyebrow="Módulo 7" titulo="Mi ritual mínimo" sub="Una práctica de no más de dos minutos, que puedas sostener incluso en los días difíciles." />
        {data && <Form inicial={data} />}
        <IrAlModulo n={7} />
      </div>
    </BookScreen>
  );
}

type Q = "practica" | "cuando";

function Form({ inicial }: { inicial: Ritual }) {
  const qc = useQueryClient();
  const [r, setR] = useState<Ritual>(inicial);
  const [ok, setOk] = useState<Record<Q, boolean>>({ practica: false, cuando: false });
  const timer = useRef<number | undefined>(undefined);
  const okTimers = useRef<Record<Q, number | undefined>>({ practica: undefined, cuando: undefined });
  const pendiente = useRef<{ r: Ritual; q: Q } | null>(null);

  const persistir = async (next: Ritual, q: Q) => {
    try {
      await guardarRitual(next);
      pendiente.current = null;
      void qc.invalidateQueries({ queryKey: ritualQuery.queryKey });
      setOk((o) => ({ ...o, [q]: true }));
      window.clearTimeout(okTimers.current[q]);
      okTimers.current[q] = window.setTimeout(() => setOk((o) => ({ ...o, [q]: false })), 2500);
    } catch {
      /* silencioso */
    }
  };
  const flush = () => {
    window.clearTimeout(timer.current);
    if (pendiente.current) void persistir(pendiente.current.r, pendiente.current.q);
  };
  useEffect(() => () => flush(), []);

  const cambiar = (next: Ritual, q: Q, inmediato: boolean) => {
    setR(next);
    window.clearTimeout(timer.current);
    if (inmediato) void persistir(next, q);
    else {
      pendiente.current = { r: next, q };
      timer.current = window.setTimeout(flush, 800);
    }
  };

  const titulo = (t: string, q: Q) => (
    <div className="flex flex-row items-center gap-2.5">
      <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{t}</p>
      <Guardado visible={ok[q]} />
    </div>
  );

  return (
    <div className="flex flex-col gap-10 self-stretch">
      <div className="flex flex-col gap-2.5 self-stretch">
        {titulo("¿Qué práctica elegís?", "practica")}
        <div className="flex flex-col">
          {RITUAL_PRACTICAS.map((o) => {
            const on = r.ritual_practice_id === o.id && !r.ritual_practice_other?.trim();
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                onClick={() => cambiar({ ...r, ritual_practice_id: on ? null : o.id, ritual_practice_other: null }, "practica", true)}
                className="flex flex-row items-center gap-2.5 border-b border-carbon-10/10 px-1 py-2.5 text-left"
              >
                {on ? <CheckLleno /> : <CheckVacio />}
                <span className="flex-1 text-base tracking-tight text-carbon">{o.label}</span>
              </button>
            );
          })}
        </div>
        <input
          value={r.ritual_practice_other ?? ""}
          onChange={(e) => cambiar({ ...r, ritual_practice_other: e.target.value, ritual_practice_id: null }, "practica", false)}
          onBlur={flush}
          placeholder="Otro (opcional)"
          className={inputBox}
        />
      </div>
      <div className="flex flex-col gap-2.5 self-stretch">
        {titulo("¿Cuándo la vas a hacer?", "cuando")}
        <div className="flex flex-row flex-wrap gap-1 py-1">
          {RITUAL_CUANDO.map((o) => {
            const on = r.ritual_when_id === o.id && !r.ritual_when_other?.trim();
            return (
              <Chip key={o.id} on={on} onClick={() => cambiar({ ...r, ritual_when_id: on ? null : o.id, ritual_when_other: null }, "cuando", true)}>
                {o.label}
              </Chip>
            );
          })}
        </div>
        <input
          value={r.ritual_when_other ?? ""}
          onChange={(e) => cambiar({ ...r, ritual_when_other: e.target.value, ritual_when_id: null }, "cuando", false)}
          onBlur={flush}
          placeholder="Otro (opcional)"
          className={inputBox}
        />
      </div>
    </div>
  );
}
