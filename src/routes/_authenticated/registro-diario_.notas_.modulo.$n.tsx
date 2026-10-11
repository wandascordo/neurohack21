import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { meta } from "@/components/Placeholder";
import { Pill } from "@/components/registro/RegistroUI";
import { AreaGuardado, Encabezado, IrAlModulo, Volver } from "@/components/registro/PlanUI";
import { NOTAS, guardarNota, notasQuery, type CampoNota, type FilaNota } from "@/lib/notas";

export const Route = createFileRoute("/_authenticated/registro-diario_/notas_/modulo/$n")({
  beforeLoad: ({ params }) => {
    const n = Number(params.n);
    if (!Number.isInteger(n) || n < 1 || n > 5) throw redirect({ to: "/registro-diario/notas" });
  },
  head: ({ params }) => meta(`Módulo ${params.n} · Mis notas`, "Tu ejercicio de cierre de módulo."),
  component: NotaDetalle,
});

function NotaDetalle() {
  const n = Number(Route.useParams().n);
  const m = NOTAS.find((x) => x.n === n)!;
  const { data: filas } = useQuery(notasQuery);
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch animate-fade-in">
        <Volver to="/registro-diario/notas" />
        <Encabezado eyebrow={`Módulo ${n}`} titulo={m.titulo} />
        <div className="flex flex-col gap-3.5 self-stretch">
          {m.consigna.map((p, i) => (
            <p key={i} className="text-base tracking-tight text-piedra">{p}</p>
          ))}
        </div>
        {filas && (
          <div className="flex flex-col gap-5 self-stretch">
            {m.campos.map((c) => (
              <Campo key={c.key} n={n} c={c} fila={filas.find((f) => f.module_number === n && f.field_key === c.key)} />
            ))}
          </div>
        )}
        <IrAlModulo n={n} />
      </div>
    </BookScreen>
  );
}

const etiquetaCls = "text-lg font-semibold leading-[1.1] tracking-tight text-carbon";

function Campo({ n, c, fila }: { n: number; c: CampoNota; fila?: FilaNota | undefined }) {
  const qc = useQueryClient();
  const [texto, setTexto] = useState(fila?.value_text ?? "");
  const [num, setNum] = useState<number | null>(fila?.value_number ?? null);
  const [pendiente, setPendiente] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef<string | null>(null);

  const persistir = async (v: { text?: string | null; number?: number | null }) => {
    try {
      await guardarNota(n, c.key, v);
      latest.current = null;
      setPendiente(false);
      void qc.invalidateQueries({ queryKey: notasQuery.queryKey });
    } catch {
      /* silencioso: se reintenta en el próximo cambio */
    }
  };
  const flush = () => {
    window.clearTimeout(timer.current);
    if (latest.current !== null) void persistir({ text: latest.current });
  };
  useEffect(() => () => flush(), []); // guarda lo pendiente al salir

  if (c.tipo === "rating") {
    return (
      <div className="flex flex-col gap-2.5 self-stretch">
        <p className={etiquetaCls}>{c.etiqueta}</p>
        <div className="flex flex-row items-center justify-between self-stretch py-2.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={num === v}
              onClick={() => {
                const next = num === v ? null : v;
                setNum(next);
                void persistir({ number: next });
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold leading-none ${num === v ? "bg-salvia text-tiza" : "bg-carbon/[0.04] text-piedra"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5 self-stretch">
      {c.etiqueta && <p className={etiquetaCls}>{c.etiqueta}</p>}
      <AreaGuardado
        value={texto}
        placeholder={c.placeholder}
        rows={c.rows ?? 5}
        guardado={!pendiente && !!texto.trim()}
        onChange={(v) => {
          setTexto(v);
          setPendiente(true);
          latest.current = v;
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(flush, 800);
        }}
        onBlur={flush}
      />
    </div>
  );
}
