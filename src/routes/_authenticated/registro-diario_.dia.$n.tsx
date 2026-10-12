import { createFileRoute, Link, redirect, useBlocker, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import backIcon from "@/assets/menu-back.png.asset.json";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { CheckLleno, CheckVacio, CirculoDia, Pill } from "@/components/registro/RegistroUI";
import { AutoevaluacionDia, ReferenciasDia } from "@/components/registro/ReferenciasDia";
import { Button } from "@/components/ui/button";
import { EscalaFoco } from "@/components/registro/EscalaFoco";
import { presentacionDia } from "@/lib/registro-presentacion";
import {
  FALTANTE_LABEL, MESES, diaActual, diaConfig, estadoDe, faltantes, fechaLarga, guardarDia, hoyLocal, logsQuery, textoRespuesta,
  type Borrador, type DiaConfig, type Faltante, type LogDia, type Pregunta, type Respuesta,
} from "@/lib/registro";

export const Route = createFileRoute("/_authenticated/registro-diario_/dia/$n")({
  beforeLoad: ({ params }) => {
    const n = Number(params.n);
    if (!Number.isInteger(n) || n < 1 || n > 21) throw redirect({ to: "/registro-diario" });
  },
  head: ({ params }) => meta(`Día ${params.n} · Registro Diario`, "Tu registro de práctica, reflexión y foco del día."),
  component: DiaPage,
});

function DiaPage() {
  const { n: raw } = Route.useParams();
  const n = Number(raw);
  const { data: logs, isLoading } = useQuery(logsQuery);
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch">
        <Volver />
        {logs && <NavDias n={n} logs={logs} />}
      </div>
      {!isLoading && logs && <Dia key={n} n={n} logs={logs} />}
    </BookScreen>
  );
}

function Volver() {
  return (
    <Link to="/registro-diario" className="flex w-fit items-center gap-1 py-1">
      <span
        className="h-5 w-5 bg-piedra"
        style={{ mask: `url(${backIcon.url}) center / contain no-repeat`, WebkitMask: `url(${backIcon.url}) center / contain no-repeat` }}
      />
      <span className="text-sm tracking-tight text-carbon">Volver</span>
    </Link>
  );
}

function NavDias({ n, logs }: { n: number; logs: LogDia[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const c = ref.current;
    const el = c?.querySelector<HTMLElement>(`[data-dia="${n}"]`);
    if (c && el) c.scrollTo({ left: el.offsetLeft - 20, behavior: "instant" as ScrollBehavior });
  }, [n]);
  return (
    <div
      ref={ref}
      className="relative -mx-5 flex w-[calc(100%+40px)] snap-x snap-mandatory scroll-pl-5 flex-row gap-2.5 overflow-x-auto scroll-smooth px-5 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
        <CirculoDia key={d} n={d} estado={estadoDe(d, logs)} seleccionado={d === n} />
      ))}
    </div>
  );
}

const vacio = (): Borrador => ({ logged_on: hoyLocal(), practice_items: [], responses: {}, focus: null });
const desdeLog = (l?: LogDia): Borrador =>
  l ? { logged_on: l.logged_on, practice_items: l.practice_items, responses: l.responses, focus: l.focus_level } : vacio();

function Dia({ n, logs }: { n: number; logs: LogDia[] }) {
  const cfg = presentacionDia(diaConfig(n));
  const qc = useQueryClient();
  const navigate = useNavigate();
  const log = logs.find((l) => l.day_number === n);
  const completado = log?.status === "completed";
  const actual = diaActual(logs);
  const [editando, setEditando] = useState(false);
  const modo: "preview" | "compacto" | "edicion" = n > actual ? "preview" : completado && !editando ? "compacto" : "edicion";

  const [b, setB] = useState<Borrador>(() => desdeLog(log));
  const [dirty, setDirty] = useState(false);
  const [pendiente, setPendiente] = useState(false);
  const [falta, setFalta] = useState<Faltante[]>([]);
  const [guardando, setGuardando] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const autoguardar = !completado && modo === "edicion";

  const persistirBorrador = async (next: Borrador) => {
    try {
      await guardarDia(n, next, "draft");
      setPendiente(false);
      void qc.invalidateQueries({ queryKey: logsQuery.queryKey });
    } catch {
      /* silencioso: se reintenta en el próximo cambio */
    }
  };

  const cambiar = (fn: (p: Borrador) => Borrador, inmediato = false) => {
    const next = fn(b);
    setB(next);
    if (autoguardar) {
      setPendiente(true);
      window.clearTimeout(timer.current);
      if (inmediato) void persistirBorrador(next);
      else timer.current = window.setTimeout(() => void persistirBorrador(next), 1000);
    } else setDirty(true);
    if (falta.length) setFalta(faltantes(cfg, next));
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const blocker = useBlocker({ shouldBlockFn: () => editando && dirty, enableBeforeUnload: editando && dirty, withResolver: true });

  const guardar = async () => {
    const f = completado ? [] : faltantes(cfg, b);
    setFalta(f);
    if (f.length) return;
    window.clearTimeout(timer.current);
    setGuardando(true);
    try {
      await guardarDia(n, b, "completed");
      await qc.invalidateQueries({ queryKey: logsQuery.queryKey });
      setDirty(false);
      setEditando(false);
      setPendiente(false);
      toast.success("Registro guardado");
      await navigate({ to: "/registro-diario" });
    } catch {
      toast.error("No pudimos guardar tu registro. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const toggleItem = (id: string) =>
    cambiar((p) => ({ ...p, practice_items: p.practice_items.includes(id) ? p.practice_items.filter((x) => x !== id) : [...p.practice_items, id] }), true);
  const setResp = (id: string, r: Respuesta, inmediato = false) => cambiar((p) => ({ ...p, responses: { ...p.responses, [id]: r } }), inmediato);

  return (
    <div className="flex flex-col self-stretch pb-5 animate-fade-in">
      <p className="py-2.5 text-[40px] font-normal leading-[1.1] tracking-[-1.5px] text-carbon">
        Día {n} <span className="text-lg tracking-tight text-piedra">/21</span>
      </p>
      {modo === "edicion" ? (
        <Edicion
          cfg={cfg} b={b} logs={logs} falta={falta} pendiente={pendiente}
          onFecha={(v) => cambiar((p) => ({ ...p, logged_on: v }), true)}
          onItem={toggleItem} onResp={setResp}
          onFoco={(v) => cambiar((p) => ({ ...p, focus: v }), true)}
        />
      ) : (
        <Resumen cfg={cfg} logs={logs} b={modo === "compacto" ? b : null} />
      )}
      <div className="mt-10 flex flex-col gap-2.5 self-stretch">
        {modo === "edicion" && falta.length > 0 && (
          <p className="text-center text-sm tracking-tight text-piedra">Te falta: {falta.map((f) => FALTANTE_LABEL[f]).join(", ")}.</p>
        )}
        {modo === "edicion" && (
          <button type="button" onClick={guardar} disabled={guardando} className={`${btnPrimary} self-stretch disabled:opacity-60`}>
            Guardar
          </button>
        )}
        {modo === "compacto" && (
          <Button type="button" variant="ghost" onClick={() => { setB(desdeLog(log)); setEditando(true); }} className="h-auto flex self-stretch items-center justify-center rounded-full bg-carbon-10/10 px-6 py-4 text-base font-semibold uppercase leading-none text-carbon hover:bg-carbon-10/10">
            Editar
          </Button>
        )}
        {modo === "preview" && (
          <div className="self-stretch rounded-[10px] bg-carbon/[0.04] p-5 text-center text-base tracking-tight text-carbon">
            Podrás completar este día cuando hayas realizado los días anteriores
          </div>
        )}
      </div>
      {blocker.status === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/30 p-5">
          <div className="flex w-full max-w-[340px] flex-col gap-5 rounded-[20px] bg-blanco p-5">
            <p className="text-base tracking-tight text-carbon">Tenés cambios sin guardar. ¿Querés salir igual?</p>
            <div className="flex flex-row gap-2.5">
              <button type="button" onClick={blocker.reset} className="flex-1 rounded-full bg-carbon-10/10 px-4 py-3 text-sm font-semibold uppercase text-carbon">
                Seguir editando
              </button>
              <button type="button" onClick={blocker.proceed} className="flex-1 rounded-full bg-salvia px-4 py-3 text-sm font-semibold uppercase text-tiza">
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Modo edición ----------
const pad2 = (n: number) => String(n).padStart(2, "0");
const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function SelectorFecha({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [abierto, setAbierto] = useState(false);
  const hoy = hoyLocal();
  const hoyDate = new Date();
  const mesActual = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), 1);
  const [mes, setMes] = useState(() => {
    const [y = 0, m = 1] = value.split("-").map(Number);
    return new Date(y, m - 1, 1);
  });

  const y = mes.getFullYear();
  const m = mes.getMonth();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // lunes primero
  const celdas: (string | null)[] = [
    ...Array.from({ length: offset }, () => null as string | null),
    ...Array.from({ length: new Date(y, m + 1, 0).getDate() }, (_, i) => `${y}-${pad2(m + 1)}-${pad2(i + 1)}`),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);
  const puedeSiguiente = mes.getTime() < mesActual.getTime(); // no se puede avanzar al mes en curso o futuro

  return (
    <div className="relative self-stretch">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label="Elegir fecha"
        className="flex w-full flex-row items-center gap-1 rounded-[10px] border border-carbon-10/10 bg-tiza p-2 text-left"
      >
        <span className="flex-1 text-base tracking-tight text-carbon">{fechaLarga(value)}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-piedra transition-transform ${abierto ? "rotate-180" : ""}`} strokeWidth={1.5} />
      </button>
      {abierto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAbierto(false)} aria-hidden="true" />
          <div className="absolute inset-x-0 top-full z-50 mt-1.5 flex flex-col gap-2 rounded-[10px] border border-carbon-10/10 bg-tiza p-3 animate-fade-in">
            <div className="flex flex-row items-center justify-between">
              <button
                type="button"
                onClick={() => setMes(new Date(y, m - 1, 1))}
                aria-label="Mes anterior"
                className="rounded-full p-1 text-piedra hover:bg-carbon/[0.04]"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <p className="text-base font-semibold tracking-tight text-carbon">
                {MESES[m]} {y}
              </p>
              <button
                type="button"
                disabled={!puedeSiguiente}
                onClick={() => setMes(new Date(y, m + 1, 1))}
                aria-label="Mes siguiente"
                className="rounded-full p-1 text-piedra hover:bg-carbon/[0.04] disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {DIAS_SEMANA.map((d) => (
                <span key={d} className="flex h-8 items-center justify-center text-xs tracking-tight text-piedra">
                  {d}
                </span>
              ))}
              {celdas.map((iso, idx) =>
                iso ? (
                  <button
                    key={iso}
                    type="button"
                    disabled={iso > hoy}
                    aria-pressed={iso === value}
                    onClick={() => {
                      onChange(iso);
                      setAbierto(false);
                    }}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm tracking-tight transition-colors ${
                      iso === value
                        ? "bg-salvia font-semibold text-tiza"
                        : iso > hoy
                          ? "text-piedra/50"
                          : "text-carbon hover:bg-carbon/[0.04]"
                    }`}
                  >
                    {Number(iso.slice(8))}
                  </button>
                ) : (
                  <span key={`vacio-${idx}`} />
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Seccion({ titulo, marcado, children }: { titulo: string; marcado?: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-2.5 self-stretch rounded-[10px] transition-shadow ${marcado ? "-m-3 p-3 ring-1 ring-salvia/60" : ""}`}>
      <p className="text-sm font-normal tracking-tight text-piedra">{titulo}</p>
      {children}
    </div>
  );
}

function FilaCheck({ titulo, desc, hecho, onToggle }: { titulo: string; desc?: string | undefined; hecho: boolean; onToggle: () => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="flex flex-row items-start gap-1 self-stretch border-b border-carbon-10/10 pb-2.5 pl-1 pr-2.5 pt-2.5">
      <Button variant="ghost" type="button" onClick={() => desc && setAbierto(!abierto)} className="h-auto min-w-0 flex-1 items-start justify-start gap-1 whitespace-normal rounded-none p-0 text-left hover:bg-transparent hover:text-carbon" aria-expanded={abierto}>
        <span className="flex h-6 w-5 shrink-0 items-center justify-center text-piedra">
          {abierto ? <Minus className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
        </span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-base font-semibold leading-normal text-carbon">{titulo}</span>
          {abierto && desc && <span className="whitespace-pre-line text-sm font-normal text-piedra">{desc}</span>}
        </span>
      </Button>
      <Button variant="ghost" type="button" className="h-6 w-6 shrink-0 rounded-full p-0 hover:bg-transparent" onClick={onToggle} aria-pressed={hecho} aria-label={hecho ? `Desmarcar ${titulo}` : `Marcar ${titulo} como hecho`}>
        {hecho ? <CheckLleno /> : <CheckVacio />}
      </Button>
    </div>
  );
}

const inputBox = "self-stretch rounded-[10px] border border-carbon-10/10 bg-blanco p-2.5 text-base tracking-tight text-carbon placeholder:text-piedra/60 outline-none focus:border-salvia/50";

function CampoPregunta({ p, i, total, r, pendiente, onResp }: { p: Pregunta; i: number; total: number; r?: Respuesta | undefined; pendiente: boolean; onResp: (r: Respuesta, inmediato?: boolean) => void }) {
  const titulo = <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{total > 1 ? `${i + 1}. ` : ""}<TextoConsigna texto={p.enunciado} />{p.opcional && <span className="text-sm font-normal text-piedra"> (opcional)</span>}</p>;
  if (p.tipo === "chips") {
    const sel = Array.isArray(r?.selected) ? r.selected : [];
    const toggle = (id: string) => {
      let next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
      if (p.maxSelect === 1) next = sel.includes(id) ? [] : [id];
      else if (p.maxSelect && next.length > p.maxSelect) return;
      onResp({ ...r, selected: next, other: r?.other ?? "" }, true);
    };
    return (
      <div className="flex flex-col gap-2.5 self-stretch py-2.5">
        {titulo}
        <div className="flex flex-row flex-wrap gap-1 py-1">
          {p.opciones.map((o) => {
            const on = sel.includes(o.id);
            return (
              <Button variant="ghost" key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={`h-auto rounded-full px-2.5 py-1 text-sm font-normal tracking-tight transition-colors ${on ? "bg-salvia text-tiza hover:bg-salvia hover:text-tiza" : "bg-carbon/[0.04] text-piedra hover:bg-carbon/[0.04] hover:text-piedra"}`}>
                {o.label}
              </Button>
            );
          })}
        </div>
        {(p.id.startsWith("d08.") || sel.includes("otro")) && <input value={r?.other ?? ""} onChange={(e) => onResp({ ...r, selected: sel, other: e.target.value })} placeholder="Otro (opcional)" className={inputBox} />}
      </div>
    );
  }
  if (p.tipo === "options") {
    const sel = typeof r?.selected === "string" ? r.selected : null;
    return (
      <div className="flex flex-col gap-2.5 self-stretch py-2.5">
        {titulo}
        <div className="flex flex-col py-1">
          {p.opciones.map((o) => {
            const on = sel === o.id;
            return (
              <Button variant="ghost" key={o.id} type="button" aria-pressed={on} onClick={() => onResp({ ...r, selected: on ? null : o.id, note: r?.note ?? "" }, true)} className="h-auto items-start justify-start gap-2.5 whitespace-normal rounded-none p-1 text-left font-normal hover:bg-transparent [&_span]:shrink-0">
                {on ? <CheckLleno /> : <CheckVacio />}
                <span className={`flex-1 text-base tracking-tight ${on ? "text-carbon" : "text-piedra"}`}>{o.label}</span>
              </Button>
            );
          })}
        </div>
        {p.id.startsWith("d08.") && <AreaTexto value={r?.note ?? ""} placeholder={p.placeholder} guardado={!pendiente && !!r?.note?.trim()} onChange={(v) => onResp({ ...r, selected: sel, note: v })} />}
        {!p.id.startsWith("d08.") && sel === "otro" && <input value={r?.other ?? ""} onChange={(e) => onResp({ ...r, selected: sel, other: e.target.value })} placeholder="Otro (opcional)" className={inputBox} />}
      </div>
    );
  }
  if (p.tipo === "text") {
    return (
      <div className="flex flex-col gap-2.5 self-stretch py-2.5">
        {titulo}
        <AreaTexto value={r?.text ?? ""} placeholder={p.placeholder} rows={p.id === "d09.r1" ? 12 : 7} guardado={!pendiente && !!r?.text?.trim()} onChange={(v) => onResp({ text: v })} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2.5 self-stretch py-2.5">
      {titulo}
      <button type="button" onClick={() => onResp({ done: !r?.done }, true)} className="flex flex-row items-center gap-2.5 p-1">
        {r?.done ? <CheckLleno /> : <CheckVacio />}
        <span className="text-base tracking-tight text-carbon">Lo hice</span>
      </button>
    </div>
  );
}

function AreaTexto({ value, placeholder, rows = 7, guardado, onChange }: { value: string; placeholder?: string | undefined; rows?: number; guardado: boolean; onChange: (v: string) => void }) {
  return (
    <div className="relative self-stretch">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${inputBox} w-full resize-none pr-9`} />
      <span className="pointer-events-none absolute bottom-3 right-2.5">{guardado ? <CheckLleno className="h-5 w-5" /> : <CheckVacio className="h-5 w-5" />}</span>
    </div>
  );
}

function TextoConsigna({ texto }: { texto: string }) {
  return texto.split(/(Mis Notas|Registro Diario|Tracker Visual de 21 Días)/g).map((s, i) => {
    const to = s === "Mis Notas" ? "/registro-diario/notas" : s === "Registro Diario" ? "/registro-diario" : s === "Tracker Visual de 21 Días" ? "/tracker" : null;
    return to ? <Link key={i} to={to} className="text-salvia underline underline-offset-2">{s}</Link> : s;
  });
}

function Edicion({ cfg, b, logs, falta, pendiente, onFecha, onItem, onResp, onFoco }: {
  cfg: DiaConfig; b: Borrador; logs: LogDia[]; falta: Faltante[]; pendiente: boolean;
  onFecha: (v: string) => void; onItem: (id: string) => void; onResp: (id: string, r: Respuesta, inmediato?: boolean) => void; onFoco: (v: number) => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-10 self-stretch">
      <Seccion titulo="Fecha">
        <SelectorFecha value={b.logged_on} onChange={onFecha} />
      </Seccion>
      {cfg.practica.length > 0 && (
        <Seccion titulo="Práctica corporal" marcado={falta.includes("practica")}>
          {cfg.practicaNota && <p className="rounded-[10px] bg-carbon-10/[0.03] p-3 text-sm text-piedra">{cfg.practicaNota}</p>}
          <div className="flex flex-col gap-1 self-stretch">
            {cfg.practica.map((it) => (
              <FilaCheck key={it.id} titulo={it.titulo} desc={it.desc} hecho={b.practice_items.includes(it.id)} onToggle={() => onItem(it.id)} />
            ))}
          </div>
        </Seccion>
      )}
      {cfg.extras.map((e) => (
        <Seccion key={e.id} titulo={e.seccion} marcado={falta.includes("extras")}>
          {[3, 15, 16, 17, 18, 19].includes(cfg.n) ? <>
           <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{e.titulo}</p>
          {e.pregunta ? <CampoPregunta p={{ ...e.pregunta, enunciado: "" }} i={0} total={1} r={b.responses[e.id]} pendiente={pendiente} onResp={(r, inm) => onResp(e.id, r, inm)} /> : <Button variant="ghost" className="h-auto justify-start p-1 text-carbon hover:bg-transparent" aria-pressed={b.practice_items.includes(e.id)} onClick={() => onItem(e.id)}>{b.practice_items.includes(e.id) ? <CheckLleno /> : <CheckVacio />}Lo hice</Button>}
          <AreaTexto value={b.responses[e.id]?.note ?? ""} placeholder="Escribí acá (opcional)." guardado={!pendiente && !!b.responses[e.id]?.note?.trim()} onChange={(v) => onResp(e.id, { ...b.responses[e.id], note: v })} />
          </> : e.pregunta ? <><div className="flex justify-end">{textoRespuesta(e.pregunta, b.responses[e.id]).length ? <CheckLleno /> : <CheckVacio />}</div><CampoPregunta p={e.pregunta} i={0} total={1} r={b.responses[e.id]} pendiente={pendiente} onResp={(r, inm) => onResp(e.id, r, inm)} /></> : <FilaCheck titulo={e.titulo} desc={e.desc} hecho={b.practice_items.includes(e.id)} onToggle={() => onItem(e.id)} />}
        </Seccion>
      ))}
      {cfg.preguntas.length > 0 && (
        <Seccion titulo="Reflexión escrita" marcado={falta.includes("reflexion")}>
          <ReferenciasDia cfg={cfg} logs={logs} />
          {cfg.preguntas.map((p, i) => (
            <CampoPregunta key={p.id} p={p} i={i} total={cfg.preguntas.length} r={b.responses[p.id]} pendiente={pendiente} onResp={(r, inm) => onResp(p.id, r, inm)} />
          ))}
          {cfg.reflexionNota && <p className="text-sm text-piedra"><TextoConsigna texto={cfg.reflexionNota} /></p>}
          {cfg.enlacePlan && <Link to="/registro-diario/plan" className="text-sm text-salvia underline underline-offset-2">Cuando termines el reto vas a poder armar tu plan en Mantenimiento.</Link>}
        </Seccion>
      )}
      <AutoevaluacionDia cfg={cfg} />
      <Seccion titulo="Cierre" marcado={falta.includes("foco")}>
        <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">Calificá tu foco de hoy</p>
        {cfg.n > 1 && cfg.n !== 8 && logs.find((l) => l.day_number === cfg.n - 1)?.focus_level != null && <p className="text-sm text-piedra">Ayer: {logs.find((l) => l.day_number === cfg.n - 1)?.focus_level}</p>}
        <EscalaFoco label="Calificá tu foco de hoy" value={b.focus} onChange={onFoco} />
      </Seccion>
    </div>
  );
}

// ---------- Modo compacto / preview ----------
function Resumen({ cfg, b, logs }: { cfg: DiaConfig; b: Borrador | null; logs: LogDia[] }) {
  const fila = "flex flex-col gap-2.5 self-stretch border-b border-carbon-10/10 px-1 py-5";
    const check = (hecho: boolean) => hecho ? <CheckLleno /> : <CheckVacio />;
  return (
    <div className="mt-5 flex flex-col self-stretch">
      <div className={`${fila} !flex-row items-center justify-between`}>
        <p className="text-base tracking-tight text-carbon">Fecha</p>
        {b && <p className="text-base tracking-tight text-piedra">{fechaLarga(b.logged_on)}</p>}
      </div>
      {(cfg.practica.length > 0 || cfg.extras.length > 0) && (
        <div className={fila}>
          <div className="flex flex-row items-center justify-between">
            <p className="text-base tracking-tight text-carbon">Práctica corporal</p>
            {check(!!b && cfg.practica.every((it) => b.practice_items.includes(it.id)))}
          </div>
          <div className="flex flex-col gap-2 pl-1.5">
             {cfg.practica.map((it) => {
              const pregunta = cfg.extras.find((e) => e.id === it.id)?.pregunta;
              return <div key={it.id} className="flex flex-col gap-1"><p className="text-sm tracking-tight text-piedra">{it.titulo}</p>{pregunta && b && textoRespuesta(pregunta, b.responses[it.id]).map((t, i) => <p key={i} className="text-base text-salvia">{t}</p>)}</div>;
            })}
          </div>
        </div>
      )}
      {cfg.extras.map((e) => <div key={e.id} className={fila}>
        <p className="text-base text-carbon">{e.seccion}</p>
        <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{e.titulo}</p>
        {b && e.pregunta && textoRespuesta(e.pregunta, b.responses[e.id]).map((text, i) => <p key={i} className="whitespace-pre-line text-base text-salvia">{text}</p>)}
        {b && !e.pregunta && b.responses[e.id]?.note && <p className="whitespace-pre-line text-base text-salvia">{b.responses[e.id]?.note}</p>}
      </div>)}
      {cfg.preguntas.length > 0 && (
        <div className={fila}>
          <div className="flex flex-row items-center justify-between">
            <p className="text-base tracking-tight text-carbon">Reflexión escrita</p>
            {check(!!b && !faltantes(cfg, b).includes("reflexion"))}
          </div>
          <div className="flex flex-col gap-2 pl-1.5">
            {cfg.referencias?.some((ref) => ref.tipo !== "nota") && <ReferenciasDia cfg={{ ...cfg, referencias: cfg.referencias.filter((ref) => ref.tipo !== "nota") }} logs={logs} />}
            {cfg.preguntas.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <p className="text-sm tracking-tight text-piedra"><TextoConsigna texto={p.enunciado} /></p>
                {b && textoRespuesta(p, b.responses[p.id]).map((t, i) => (
                  <p key={i} className="whitespace-pre-line pl-1 text-base tracking-tight text-salvia">{t}</p>
                ))}
              </div>
            ))}
            {cfg.reflexionNota && <p className="text-sm text-piedra"><TextoConsigna texto={cfg.reflexionNota} /></p>}
            {cfg.enlacePlan && <Link to="/registro-diario/plan" className="text-sm text-salvia underline underline-offset-2">Cuando termines el reto vas a poder armar tu plan en Mantenimiento.</Link>}
          </div>
        </div>
      )}
      {cfg.autoevaluacion && <div className={fila}><AutoevaluacionDia cfg={cfg} /></div>}
      <div className={`${fila} !flex-row items-center justify-between`}>
        <p className="text-base tracking-tight text-carbon">Calificación de foco</p>
        {b?.focus && (
          <p className="text-[28px] leading-none text-carbon">
            {b.focus} <span className="text-base text-piedra">/10</span>
          </p>
        )}
      </div>
    </div>
  );
}
