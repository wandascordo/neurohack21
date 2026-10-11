// Pantalla de intenciones (Módulo 7: hasta 3; Módulo 8: 1 con contexto). Creación y edición dentro de la tarjeta.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { Pill } from "@/components/registro/RegistroUI";
import { Chip, ChipEstatico, Confirmar, Encabezado, IrAlModulo, Volver, inputBox } from "@/components/registro/PlanUI";
import {
  ACCIONES, CONTEXTOS, MAX_INTENCIONES, eliminarIntencion, fraseDe, guardarIntencion, intencionesQuery, parte, situacionesDe,
  type BorradorIntencion, type Contexto, type Intencion,
} from "@/lib/plan";

type Paso = "contexto" | "si" | "entonces";
type Edit = BorradorIntencion & { paso: Paso };

const TEXTOS = {
  7: {
    titulo: "Mis intenciones de implementación",
    sub: "Dos o tres frases con el formato “si pasa X, entonces hago Y”.",
    max: "Llegaste al máximo de tres intenciones. Podés editar o eliminar alguna.",
  },
  8: {
    titulo: "Mi intención para el mundo real",
    sub: "Una intención para el contexto donde más te cuesta sostener el foco: trabajo, estudio o relaciones. Se suma a las que ya guardaste en el Módulo 7.",
    max: "Ya sumaste tu intención del Módulo 8. Podés editarla o eliminarla.",
  },
} as const;

export function PantallaIntenciones({ mod }: { mod: 7 | 8 }) {
  const qc = useQueryClient();
  const { data: todas } = useQuery(intencionesQuery);
  const lista = (todas ?? []).filter((i) => i.source_module === mod);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [borrar, setBorrar] = useState<string | null>(null);
  const t = TEXTOS[mod];

  // Cola de guardado: evita inserciones duplicadas si se encadenan cambios rápidos.
  const cola = useRef<Promise<unknown>>(Promise.resolve());
  const idRef = useRef<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const pendiente = useRef<Edit | null>(null);

  const completa = (e: Edit) =>
    !!parte(situacionesDe(mod, e.context), e.if_option_id, e.if_other) && !!parte(ACCIONES, e.then_option_id, e.then_other) && (mod === 7 || !!e.context);

  const guardar = (e: Edit) => {
    pendiente.current = null;
    cola.current = cola.current.then(async () => {
      try {
        const id = await guardarIntencion({ ...e, id: idRef.current ?? e.id });
        idRef.current = id;
        setEdit((cur) => (cur && (cur.id === null || cur.id === id) ? { ...cur, id } : cur));
        await qc.invalidateQueries({ queryKey: intencionesQuery.queryKey });
      } catch {
        toast.error("No pudimos guardar tu intención. Probá de nuevo.");
      }
    });
    return cola.current;
  };
  const flush = () => {
    window.clearTimeout(timer.current);
    if (pendiente.current) return guardar(pendiente.current);
    return cola.current;
  };
  useEffect(() => () => void flush(), []);

  const cambiar = (next: Edit, inmediato = true) => {
    setEdit(next);
    window.clearTimeout(timer.current);
    pendiente.current = null;
    if (!completa(next)) return; // incompleta: no se guarda (se conserva la última versión completa)
    if (inmediato) void guardar(next);
    else {
      pendiente.current = next;
      timer.current = window.setTimeout(() => void flush(), 800);
    }
  };

  const abrir = (i: Intencion) => {
    idRef.current = i.id;
    setEdit({ ...i, paso: mod === 8 && !i.context ? "contexto" : "si" });
  };
  const crear = () => {
    if (edit || lista.length >= MAX_INTENCIONES[mod]) return;
    idRef.current = null;
    const pos = lista.reduce((m, i) => Math.max(m, i.position), 0) + 1;
    setEdit({
      id: null, source_module: mod, context: null, if_option_id: null, if_other: null, then_option_id: null, then_other: null,
      position: pos, paso: mod === 8 ? "contexto" : "si",
    });
  };
  const listo = async () => {
    await flush();
    idRef.current = null;
    setEdit(null);
  };

  const copiar = async (f: string) => {
    try {
      await navigator.clipboard.writeText(f);
      toast.success("Frase copiada");
    } catch {
      toast.error("No pudimos copiar. Mantené presionado el texto para copiarlo.");
    }
  };
  const confirmarBorrar = async () => {
    const id = borrar;
    setBorrar(null);
    if (!id) return;
    try {
      await eliminarIntencion(id);
      if (edit?.id === id) setEdit(null);
      await qc.invalidateQueries({ queryKey: intencionesQuery.queryKey });
    } catch {
      toast.error("No pudimos eliminar la intención. Probá de nuevo.");
    }
  };

  const enMax = lista.length >= MAX_INTENCIONES[mod];
  const nuevaAbierta = edit && (edit.id === null || !lista.some((i) => i.id === edit.id));

  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch animate-fade-in">
        <Volver to="/registro-diario/plan" />
        <Encabezado eyebrow={`Módulo ${mod}`} titulo={t.titulo} sub={t.sub} />
        {todas && (
          <div className="flex flex-col gap-2.5 self-stretch">
            {lista.map((i, idx) =>
              edit && edit.id === i.id ? (
                <TarjetaEdicion key={i.id} n={idx + 1} mod={mod} e={edit} completa={completa(edit)} onChange={cambiar} onListo={listo} />
              ) : (
                <TarjetaGuardada
                  key={i.id} n={idx + 1} i={i} bloqueada={!!edit}
                  onAbrir={() => abrir(i)} onCopiar={copiar} onBorrar={() => setBorrar(i.id)}
                />
              ),
            )}
            {nuevaAbierta && edit && (
              <TarjetaEdicion n={lista.length + 1} mod={mod} e={edit} completa={completa(edit)} onChange={cambiar} onListo={listo} />
            )}
            {enMax && !edit ? (
              <p className="pt-3.5 text-base tracking-tight text-piedra">{t.max}</p>
            ) : (
              !enMax && !edit && (
                <div className="pt-3.5">
                  <Button type="button" onClick={crear} variant="ghost" className={`${btnPrimary} h-auto w-fit px-5 py-2.5 hover:bg-salvia hover:text-tiza`}>
                    Agregar intención
                  </Button>
                </div>
              )
            )}
          </div>
        )}
        <div className="pt-5"><IrAlModulo n={mod} /></div>
      </div>
      {borrar && <Confirmar texto="¿Eliminar esta intención?" accion="Eliminar" onConfirm={confirmarBorrar} onCancel={() => setBorrar(null)} />}
    </BookScreen>
  );
}

const card = "flex flex-col gap-3.5 self-stretch rounded-[10px] border border-carbon-10/10 bg-blanco p-3.5";

function TarjetaGuardada({ n, i, bloqueada, onAbrir, onCopiar, onBorrar }: {
  n: number; i: Intencion; bloqueada: boolean; onAbrir: () => void; onCopiar: (f: string) => void; onBorrar: () => void;
}) {
  const f = fraseDe(i) ?? "";
  const ctx = CONTEXTOS.find((c) => c.id === i.context)?.label;
  return (
    <div className={card}>
      <div className="flex flex-col gap-2.5">
        <p className="text-xs tracking-tight text-piedra">Intención {n}</p>
        {ctx && <ChipEstatico>{ctx}</ChipEstatico>}
        <button type="button" onClick={onAbrir} disabled={bloqueada} className="text-left text-base tracking-tight text-carbon">
          {f}
        </button>
      </div>
      <div className="flex flex-row gap-2.5 text-piedra">
        <button type="button" onClick={() => onCopiar(f)} aria-label="Copiar frase"><Copy className="h-6 w-6" strokeWidth={1.5} /></button>
        <button type="button" onClick={onBorrar} aria-label="Eliminar intención"><Trash2 className="h-6 w-6" strokeWidth={1.5} /></button>
      </div>
    </div>
  );
}

function Hueco({ valor, activo, onClick }: { valor: string | null; activo: boolean; onClick: () => void }) {
  if (valor)
    return (
      <button type="button" onClick={onClick} className={`inline text-left underline decoration-1 underline-offset-4 ${activo ? "decoration-salvia" : "decoration-piedra/50"}`}>
        {valor}
      </button>
    );
  return (
    <button type="button" onClick={onClick} className={`inline rounded-full px-2 py-0.5 text-sm ${activo ? "bg-carbon/10 text-carbon" : "bg-carbon/[0.04] text-piedra"}`}>
      Completar...
    </button>
  );
}

function Opciones({ titulo, children, otro, onOtro }: { titulo?: string; children: ReactNode; otro?: string; onOtro?: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5 self-stretch animate-fade-in">
      {titulo && <p className="text-sm font-semibold tracking-tight text-carbon">{titulo}</p>}
      <div className="flex flex-row flex-wrap gap-1">{children}</div>
      {onOtro && <input value={otro ?? ""} onChange={(e) => onOtro(e.target.value)} placeholder="Otro (opcional)" className={inputBox} />}
    </div>
  );
}

function TarjetaEdicion({ n, mod, e, completa, onChange, onListo }: {
  n: number; mod: 7 | 8; e: Edit; completa: boolean; onChange: (e: Edit, inmediato?: boolean) => void; onListo: () => void;
}) {
  const sits = situacionesDe(mod, e.context);
  const si = parte(sits, e.if_option_id, e.if_other);
  const en = parte(ACCIONES, e.then_option_id, e.then_other);
  const ir = (paso: Paso) => onChange({ ...e, paso });
  const setCtx = (c: Contexto) =>
    onChange({ ...e, context: c, if_option_id: e.context === c ? e.if_option_id : null, if_other: e.context === c ? e.if_other : null, paso: "si" });
  return (
    <div className={card}>
      <div className="flex flex-col gap-2.5">
        <p className="text-xs tracking-tight text-piedra">Intención {n}</p>
        {mod === 8 && e.context && e.paso === "entonces" && <ChipEstatico>{CONTEXTOS.find((c) => c.id === e.context)?.label}</ChipEstatico>}
        <p className="text-base leading-[1.6] tracking-tight text-carbon">
          “Si <Hueco valor={si} activo={e.paso === "si" || e.paso === "contexto"} onClick={() => ir(mod === 8 && !e.context ? "contexto" : "si")} />, entonces{" "}
          <Hueco valor={en} activo={e.paso === "entonces"} onClick={() => ir("entonces")} />”.
        </p>
      </div>
      {mod === 8 && (e.paso === "contexto" || e.paso === "si") && (
        <Opciones titulo="¿En qué contexto?">
          {CONTEXTOS.map((c) => (
            <Chip key={c.id} on={e.context === c.id} onClick={() => setCtx(c.id)}>{c.label}</Chip>
          ))}
        </Opciones>
      )}
      {e.paso === "si" && (mod === 7 || e.context) && (
        <Opciones otro={e.if_other ?? ""} onOtro={(v) => onChange({ ...e, if_other: v, if_option_id: null }, false)}>
          {sits.map((o) => (
            <Chip key={o.id} on={e.if_option_id === o.id && !e.if_other?.trim()} onClick={() => onChange({ ...e, if_option_id: o.id, if_other: null, paso: en ? e.paso : "entonces" })}>
              {o.label}
            </Chip>
          ))}
        </Opciones>
      )}
      {e.paso === "entonces" && (
        <Opciones otro={e.then_other ?? ""} onOtro={(v) => onChange({ ...e, then_other: v, then_option_id: null }, false)}>
          {ACCIONES.map((o) => (
            <Chip key={o.id} on={e.then_option_id === o.id && !e.then_other?.trim()} onClick={() => onChange({ ...e, then_option_id: o.id, then_other: null })}>
              {o.label}
            </Chip>
          ))}
        </Opciones>
      )}
      {completa && (
        <button type="button" onClick={onListo} className="w-fit rounded-full border border-salvia px-5 py-2.5 text-base font-semibold uppercase leading-none text-salvia">
          Listo
        </button>
      )}
    </div>
  );
}
