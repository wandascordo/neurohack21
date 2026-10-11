// Piezas compartidas por Mis notas y Mi plan de mantenimiento.
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import backIcon from "@/assets/menu-back.png.asset.json";
import { CheckLleno, CheckVacio } from "@/components/registro/RegistroUI";

export const inputBox =
  "self-stretch rounded-[10px] border border-carbon-10/10 bg-blanco p-2.5 text-base tracking-tight text-carbon placeholder:text-piedra/60 outline-none focus:border-salvia/50";

export function Volver({ to }: { to: "/registro-diario/notas" | "/registro-diario/plan" }) {
  return (
    <Link to={to} className="flex w-fit items-center gap-1 py-1">
      <span
        className="h-5 w-5 bg-piedra"
        style={{ mask: `url(${backIcon.url}) center / contain no-repeat`, WebkitMask: `url(${backIcon.url}) center / contain no-repeat` }}
      />
      <span className="text-sm tracking-tight text-carbon">Volver</span>
    </Link>
  );
}

export function IrAlModulo({ n }: { n: number }) {
  return (
    <Link to="/indice/$seccion" params={{ seccion: `modulo-${n}` }} className="flex w-fit flex-row items-baseline gap-1.5 text-base font-semibold uppercase leading-none text-salvia">
      <span>Ir al</span>
      <span className="underline underline-offset-2">Módulo {n}</span>
    </Link>
  );
}

export function Encabezado({ eyebrow, titulo, sub, subChico }: { eyebrow?: string; titulo: string; sub?: string; subChico?: boolean }) {
  return (
    <div className="flex flex-col gap-1 self-stretch">
      {eyebrow && <p className="text-sm font-normal tracking-tight text-piedra">{eyebrow}</p>}
      <h1 className="text-[28px] font-normal leading-[1.1] tracking-[-1.5px] text-carbon">{titulo}</h1>
      {sub && <p className={`${subChico ? "text-sm" : "text-base"} font-normal tracking-tight text-piedra`}>{sub}</p>}
    </div>
  );
}

export function TarjetaLink({ to, eyebrow, titulo, children }: { to: string; eyebrow: string; titulo: string; children?: ReactNode }) {
  return (
    <Link to={to as "/"} className="flex flex-col gap-1 self-stretch rounded-[20px] border border-carbon-10/10 bg-blanco p-2.5">
      <div className="flex flex-row items-start gap-2.5 p-1">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-normal tracking-tight text-piedra">{eyebrow}</p>
          <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{titulo}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-piedra/70" strokeWidth={1.5} />
      </div>
      {children}
    </Link>
  );
}

export function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`rounded-full px-2.5 py-1 text-left text-sm tracking-tight transition-colors ${on ? "bg-salvia text-tiza" : "bg-carbon/[0.04] text-piedra"}`}>
      {children}
    </button>
  );
}

export function ChipEstatico({ children }: { children: ReactNode }) {
  return <span className="w-fit rounded-full bg-salvia/20 px-2.5 py-1 text-sm tracking-tight text-salvia">{children}</span>;
}

export function AreaGuardado({ value, placeholder, guardado, rows = 5, onChange, onBlur }: {
  value: string; placeholder?: string | undefined; guardado: boolean; rows?: number; onChange: (v: string) => void; onBlur: () => void;
}) {
  return (
    <div className="relative self-stretch">
      <textarea value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} rows={rows} className={`${inputBox} w-full resize-none pr-9`} />
      <span className="pointer-events-none absolute bottom-3 right-2.5">{guardado ? <CheckLleno className="h-5 w-5" /> : <CheckVacio className="h-5 w-5" />}</span>
    </div>
  );
}

export function Guardado({ visible }: { visible: boolean }) {
  return (
    <span className={`flex flex-row items-center gap-1 text-xs tracking-tight text-salvia transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`} aria-live="polite">
      <CheckLleno className="h-4 w-4" /> Guardado
    </span>
  );
}

export function Confirmar({ texto, accion, onConfirm, onCancel }: { texto: string; accion: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/30 p-5" role="dialog" aria-modal="true">
      <div className="flex w-full max-w-[340px] flex-col gap-5 rounded-[20px] bg-blanco p-5">
        <p className="text-base tracking-tight text-carbon">{texto}</p>
        <div className="flex flex-row gap-2.5">
          <button type="button" onClick={onCancel} className="flex-1 rounded-full bg-carbon-10/10 px-4 py-3 text-sm font-semibold uppercase text-carbon">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 rounded-full bg-salvia px-4 py-3 text-sm font-semibold uppercase text-tiza">
            {accion}
          </button>
        </div>
      </div>
    </div>
  );
}
