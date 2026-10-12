import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { ResultadoCard, type RegistroFoco } from "@/components/autoevaluacion/ResultadoCard";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/tracker")({
  validateSearch: (s: Record<string, unknown>): { sel?: string } => (typeof s["sel"] === "string" ? { sel: s["sel"] } : {}),
  head: () => meta("Tracker Visual de tu Progreso", "Mirá cómo evolucionan los puntajes de tus autoevaluaciones de foco."),
  component: Tracker,
});

const btnSec = "flex h-fit flex-row items-center justify-center self-stretch overflow-hidden rounded-full bg-carbon-10/10 px-6 py-4 text-base font-semibold uppercase leading-none text-carbon";

// Geometría del gráfico (px), tomada de Figma.
const H = 307; // alto del área de trazado
const TOP = 21; // y del valor 50
const PX = 6.6; // px por punto
const yDe = (v: number) => TOP + (50 - v) * PX;
const GUIAS = [70, 137, 220]; // límites entre rangos (tras 43, 33 y 20)
const TICKS = [50, 45, 40, 35, 30, 25, 20, 15, 10];
const VISIBLES = 6;

function fechaCorta(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Curva monótona (Fritsch–Carlson) que pasa por todos los puntos sin sobrepasarlos. */
function curva(pts: [number, number][]) {
  const n = pts.length;
  if (n < 2) return "";
  const X = pts.map((q) => q[0]), Y = pts.map((q) => q[1]);
  const at = (arr: number[], i: number) => arr[i] ?? 0;
  const d = X.slice(0, -1).map((_, i) => (at(Y, i + 1) - at(Y, i)) / (at(X, i + 1) - at(X, i)));
  const m = X.map((_, i) => (i === 0 ? at(d, 0) : i === n - 1 ? at(d, n - 2) : at(d, i - 1) * at(d, i) <= 0 ? 0 : (at(d, i - 1) + at(d, i)) / 2));
  for (let i = 0; i < n - 1; i++) {
    const di = at(d, i);
    if (di === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = at(m, i) / di, b = at(m, i + 1) / di, q = a * a + b * b;
    if (q > 9) { const t = 3 / Math.sqrt(q); m[i] = t * a * di; m[i + 1] = t * b * di; }
  }
  let path = `M ${at(X, 0)} ${at(Y, 0)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = (at(X, i + 1) - at(X, i)) / 3;
    path += ` C ${at(X, i) + h} ${at(Y, i) + at(m, i) * h} ${at(X, i + 1) - h} ${at(Y, i + 1) - at(m, i + 1) * h} ${at(X, i + 1)} ${at(Y, i + 1)}`;
  }
  return path;
}

function Tracker() {
  const { sel: selInicial } = Route.useSearch();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["focus-assessments"],
    staleTime: 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("focus_assessments")
        .select("id, answers, total_score, assessed_at")
        .order("assessed_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RegistroFoco[];
    },
  });
  const lista = data ?? [];
  const [sel, setSel] = useState<string | undefined>(selInicial);
  const actual = lista.find((r) => r.id === sel) ?? lista[lista.length - 1];
  const vacio = !isLoading && lista.length === 0;

  return (
    <BookScreen fill>
      <TopBar />
      <div className="flex self-stretch justify-center py-2.5">
        <div className="rounded-full bg-carbon-10/10 px-4 py-2">
          <p className="text-base font-semibold leading-none text-salvia">Tracker Visual de tu Progreso</p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-1 flex-col gap-5 self-stretch">
        <h1 className="pb-2.5 text-center text-[22px] font-normal leading-[1.1] tracking-[-1px] text-carbon">Tu progreso en puntajes de tu autoevaluación de foco</h1>
        <Grafico lista={lista} selId={actual?.id} onSel={setSel} />
        {vacio && (
          <div className="flex flex-col gap-2 self-stretch rounded-[10px] bg-carbon/[0.03] p-3">
            <p className="text-sm tracking-tight text-piedra">Sin autoevaluaciones registradas aún</p>
            <p className="text-base leading-[1.2] tracking-tight text-carbon">Acá vas a ver tu progreso a medida que vayas completando las autoevaluaciones de foco del reto</p>
          </div>
        )}
        {actual && (
          <ResultadoCard r={actual} onClick={() => navigate({ to: "/autoevaluacion", search: { id: actual.id, from: "tracker" } })} />
        )}
      </div>
      <Link to="/autoevaluacion" className={`mt-10 ${vacio ? `${btnPrimary} self-stretch` : btnSec}`}>Realizar autoevaluación de foco</Link>
    </BookScreen>
  );
}

function Grafico({ lista, selId, onSel }: { lista: RegistroFoco[]; selId?: string; onSel: (id: string) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(325);
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAncho(el.clientWidth));
    ro.observe(el);
    setAncho(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const n = lista.length;
  const columnas = n === 0 ? 4 : n;
  const slot = ancho / Math.min(Math.max(columnas, 1), VISIBLES);
  const W = Math.max(ancho, slot * columnas);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [n, W]);

  const puntos = useMemo(() => lista.map((r, i) => [slot * (i + 0.5), yDe(r.total_score)] as [number, number]), [lista, slot]);
  const linea = n ? curva([[0, yDe(Math.max(10, (lista[0]?.total_score ?? 12) - 2))], ...puntos]) : "";
  const ultimo = puntos[n - 1];
  const area = ultimo ? `${linea} L ${ultimo[0]} ${H} L 0 ${H} Z` : "";
  const etiquetas = n ? lista.map((r) => fechaCorta(r.assessed_at)) : ["Día 0", "Día 7", "Día 14", "Día 21"];

  return (
    <div className="flex self-stretch overflow-hidden rounded-[10px] border border-carbon-10/10">
      <div className="relative w-[33px] shrink-0 border-r border-carbon-10/10" style={{ height: H + 34 }}>
        {TICKS.map((t) => (
          <p key={t} className="absolute inset-x-0 -translate-y-1/2 text-center text-[10px] font-medium tracking-tight text-piedra" style={{ top: yDe(t) }}>{t}</p>
        ))}
        <div className="absolute inset-x-0 border-t border-carbon-10/10" style={{ top: H }} />
      </div>
      <div ref={scroller} className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none]">
        <div style={{ width: W }}>
          <svg width={W} height={H} className="block bg-carbon/[0.02]" role="img" aria-label="Evolución de tus puntajes de foco">
            <defs>
              <linearGradient id="tracker-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-salvia)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--color-salvia)" stopOpacity="0.03" />
              </linearGradient>
            </defs>
            {GUIAS.map((y) => (
              <line key={y} x1={0} x2={W} y1={y} y2={y} strokeDasharray="4 4" strokeWidth={1} className="stroke-carbon-10/20" />
            ))}
            {n > 0 && <path d={area} fill="url(#tracker-area)" />}
            {n > 0 && <path d={linea} fill="none" strokeWidth={1} className="stroke-salvia" />}
            {puntos.map(([x, y], i) => {
              const r = lista[i]!; const activo = r.id === selId;
              return (
                <g key={r.id} onClick={() => onSel(r.id)} className="cursor-pointer" role="button" aria-label={`${r.total_score} puntos, ${fechaCorta(r.assessed_at)}`}>
                  <circle cx={x} cy={y} r={18} fill="transparent" />
                  <circle cx={x} cy={y} r={activo ? 6 : 3.5} strokeWidth={2} className="fill-salvia stroke-tiza" style={{ filter: "drop-shadow(3px 3px 5px rgb(29 29 29 / 0.1))" }} />
                </g>
              );
            })}
          </svg>
          <div className="flex h-[34px] border-t border-carbon-10/10">
            {etiquetas.map((e, i) => (
              <p key={i} className="flex shrink-0 items-center justify-center text-[10px] font-medium tracking-tight text-piedra" style={{ width: slot }}>{e}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
