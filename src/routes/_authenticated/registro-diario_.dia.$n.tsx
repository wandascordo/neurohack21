import { createFileRoute, Link, redirect, useBlocker, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import backIcon from "@/assets/menu-back.png.asset.json";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { CheckLleno, CheckVacio, CirculoDia, Pill } from "@/components/registro/RegistroUI";
import {
  FALTANTE_LABEL, diaActual, diaConfig, estadoDe, faltantes, fechaLarga, guardarDia, hoyLocal, logsQuery,
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
        <CirculoDia key={d} n={d} estado={estadoDe(d, logs)} />
      ))}
    </div>
  );
}

const vacio = (): Borrador => ({ logged_on: hoyLocal(), practice_items: [], responses: {}, focus: null });
const desdeLog = (l?: LogDia): Borrador =>
  l ? { logged_on: l.logged_on, practice_items: l.practice_items, responses: l.responses, focus: l.focus_level } : vacio();

function Dia({ n, logs }: { n: number; logs: LogDia[] }) {
  const cfg = diaConfig(n);
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
    const f = faltantes(cfg, b);
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
      if (n === 21) navigate({ to: "/registro-diario" });
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
          cfg={cfg} b={b} falta={falta} pendiente={pendiente}
          onFecha={(v) => cambiar((p) => ({ ...p, logged_on: v }), true)}
          onItem={toggleItem} onResp={setResp}
          onFoco={(v) => cambiar((p) => ({ ...p, focus: v }), true)}
        />
      ) : (
        <Resumen cfg={cfg} b={modo === "compacto" ? b : null} />
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
          <button type="button" onClick={() => setEditando(true)} className="flex self-stretch items-center justify-center rounded-full bg-carbon-10/10 px-6 py-4 text-base font-semibold uppercase leading-none text-carbon">
            Editar
          </button>
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
function Seccion({ titulo, marcado, children }: { titulo: string; marcado?: boolean; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-2.5 self-stretch rounded-[10px] transition-shadow ${marcado ? "ring-1 ring-salvia/60 ring-offset-8 ring-offset-tiza" : ""}`}>
      <p className="text-sm font-normal tracking-tight text-piedra">{titulo}</p>
      {children}
    </div>
  );
}

function FilaCheck({ titulo, desc, hecho, onToggle }: { titulo: string; desc?: string | undefined; hecho: boolean; onToggle: () => void }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="flex flex-row items-start gap-1 self-stretch border-b border-carbon-10/10 pb-2.5 pl-1 pr-2.5 pt-2.5">
      <button type="button" onClick={() => desc && setAbierto(!abierto)} className="flex flex-1 flex-row items-start gap-1 text-left" aria-expanded={abierto}>
        <span className="flex h-6 w-5 shrink-0 items-center justify-center text-piedra">
          {abierto ? <Minus className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
        </span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className={`text-base tracking-tight text-carbon ${abierto ? "font-semibold" : "font-normal"}`}>{titulo}</span>
          {abierto && desc && <span className="text-xs tracking-tight text-piedra">{desc}</span>}
        </span>
      </button>
      <button type="button" onClick={onToggle} aria-pressed={hecho} aria-label={hecho ? `Desmarcar ${titulo}` : `Marcar ${titulo} como hecho`}>
        {hecho ? <CheckLleno /> : <CheckVacio />}
      </button>
    </div>
  );
}

const inputBox = "self-stretch rounded-[10px] border border-carbon-10/10 bg-blanco p-2.5 text-base tracking-tight text-carbon placeholder:text-piedra/60 outline-none focus:border-salvia/50";

function CampoPregunta({ p, i, r, pendiente, onResp }: { p: Pregunta; i: number; r?: Respuesta | undefined; pendiente: boolean; onResp: (r: Respuesta, inmediato?: boolean) => void }) {
  const titulo = <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{i + 1}. {p.enunciado}</p>;
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
              <button key={o.id} type="button" aria-pressed={on} onClick={() => toggle(o.id)} className={`rounded-full px-2.5 py-1 text-sm tracking-tight transition-colors ${on ? "bg-salvia text-tiza" : "bg-carbon/[0.04] text-piedra"}`}>
                {o.label}
              </button>
            );
          })}
        </div>
        <input value={r?.other ?? ""} onChange={(e) => onResp({ ...r, selected: sel, other: e.target.value })} placeholder="Otro (opcional)" className={inputBox} />
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
              <button key={o.id} type="button" aria-pressed={on} onClick={() => onResp({ ...r, selected: on ? null : o.id, note: r?.note ?? "" }, true)} className="flex flex-row items-start gap-2.5 p-1 text-left">
                {on ? <CheckLleno /> : <CheckVacio />}
                <span className={`flex-1 text-base tracking-tight ${on ? "text-carbon" : "text-piedra"}`}>{o.label}</span>
              </button>
            );
          })}
        </div>
        <AreaTexto value={r?.note ?? ""} placeholder={p.placeholder} guardado={!pendiente && !!r?.note?.trim()} onChange={(v) => onResp({ ...r, selected: sel, note: v })} />
      </div>
    );
  }
  if (p.tipo === "text") {
    return (
      <div className="flex flex-col gap-2.5 self-stretch py-2.5">
        {titulo}
        <AreaTexto value={r?.text ?? ""} placeholder={p.placeholder} guardado={!pendiente && !!r?.text?.trim()} onChange={(v) => onResp({ text: v })} />
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

function AreaTexto({ value, placeholder, guardado, onChange }: { value: string; placeholder?: string | undefined; guardado: boolean; onChange: (v: string) => void }) {
  return (
    <div className="relative self-stretch">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={7} className={`${inputBox} w-full resize-none pr-9`} />
      <span className="pointer-events-none absolute bottom-3 right-2.5">{guardado ? <CheckLleno className="h-5 w-5" /> : <CheckVacio className="h-5 w-5" />}</span>
    </div>
  );
}

function Edicion({ cfg, b, falta, pendiente, onFecha, onItem, onResp, onFoco }: {
  cfg: DiaConfig; b: Borrador; falta: Faltante[]; pendiente: boolean;
  onFecha: (v: string) => void; onItem: (id: string) => void; onResp: (id: string, r: Respuesta, inmediato?: boolean) => void; onFoco: (v: number) => void;
}) {
  const fechaRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-5 flex flex-col gap-10 self-stretch">
      <Seccion titulo="Fecha">
        <label className="relative flex flex-row items-center gap-1 self-stretch rounded-[10px] border border-carbon-10/10 bg-blanco p-2" onClick={() => fechaRef.current?.showPicker?.()}>
          <span className="flex-1 text-base tracking-tight text-carbon">{fechaLarga(b.logged_on)}</span>
          <ChevronDown className="h-5 w-5 text-piedra" strokeWidth={1.5} />
          <input
            ref={fechaRef} type="date" value={b.logged_on} max={hoyLocal()} aria-label="Fecha"
            onChange={(e) => e.target.value && onFecha(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </Seccion>
      {cfg.practica.length > 0 && (
        <Seccion titulo="Práctica corporal" marcado={falta.includes("practica")}>
          <div className="flex flex-col gap-1 self-stretch">
            {cfg.practica.map((it) => (
              <FilaCheck key={it.id} titulo={it.titulo} desc={it.desc} hecho={b.practice_items.includes(it.id)} onToggle={() => onItem(it.id)} />
            ))}
          </div>
        </Seccion>
      )}
      {cfg.extras.map((e) => (
        <Seccion key={e.id} titulo={e.seccion} marcado={falta.includes("extras")}>
          <FilaCheck titulo={e.titulo} desc={e.desc} hecho={b.practice_items.includes(e.id)} onToggle={() => onItem(e.id)} />
        </Seccion>
      ))}
      {cfg.preguntas.length > 0 && (
        <Seccion titulo="Reflexión escrita" marcado={falta.includes("reflexion")}>
          {cfg.preguntas.map((p, i) => (
            <CampoPregunta key={p.id} p={p} i={i} r={b.responses[p.id]} pendiente={pendiente} onResp={(r, inm) => onResp(p.id, r, inm)} />
          ))}
        </Seccion>
      )}
      <Seccion titulo="Cierre" marcado={falta.includes("foco")}>
        <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">Calificá tu foco de hoy</p>
        <div className="flex flex-row items-center justify-between self-stretch py-2.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
            <button key={v} type="button" aria-pressed={b.focus === v} onClick={() => onFoco(v)} className={`flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold leading-none ${b.focus === v ? "bg-salvia text-tiza" : "bg-carbon/[0.04] text-piedra"}`}>
              {v}
            </button>
          ))}
        </div>
      </Seccion>
    </div>
  );
}

// ---------- Modo compacto / preview ----------
function respuestaTexto(p: Pregunta, r?: Respuesta): string[] {
  if (!r) return [];
  const out: string[] = [];
  if (p.tipo === "chips") {
    const sel = Array.isArray(r.selected) ? r.selected : [];
    const labels = sel.map((id) => p.opciones.find((o) => o.id === id)?.label).filter(Boolean) as string[];
    if (r.other?.trim()) labels.push(r.other.trim());
    if (labels.length) out.push(labels.join(", "));
  } else if (p.tipo === "options") {
    const l = p.opciones.find((o) => o.id === r.selected)?.label;
    if (l) out.push(l);
    if (r.note?.trim()) out.push(r.note.trim());
  } else if (p.tipo === "text") {
    if (r.text?.trim()) out.push(r.text.trim());
  } else if (r.done) out.push("Lo hice");
  return out;
}

function Resumen({ cfg, b }: { cfg: DiaConfig; b: Borrador | null }) {
  const fila = "flex flex-col gap-2.5 self-stretch border-b border-carbon-10/10 px-1 py-5";
  const check = b ? <CheckLleno /> : <CheckVacio />;
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
            {check}
          </div>
          <div className="flex flex-col gap-2 pl-1.5">
            {[...cfg.practica, ...cfg.extras].map((it) => (
              <p key={it.id} className="text-sm tracking-tight text-piedra">{it.titulo}</p>
            ))}
          </div>
        </div>
      )}
      {cfg.preguntas.length > 0 && (
        <div className={fila}>
          <div className="flex flex-row items-center justify-between">
            <p className="text-base tracking-tight text-carbon">Reflexión escrita</p>
            {check}
          </div>
          <div className="flex flex-col gap-2 pl-1.5">
            {cfg.preguntas.map((p) => (
              <div key={p.id} className="flex flex-col gap-2">
                <p className="text-sm tracking-tight text-piedra">{p.enunciado}</p>
                {b && respuestaTexto(p, b.responses[p.id]).map((t, i) => (
                  <p key={i} className="whitespace-pre-line pl-1 text-base tracking-tight text-salvia">{t}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
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
