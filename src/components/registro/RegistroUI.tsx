import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Calendar, Check, Trophy } from "lucide-react";
import stickyNote from "@/assets/registro-sticky-note-02.png.asset.json";

function StickyNoteIcon() {
  return <span aria-hidden="true" className="block h-6 w-6 bg-current" style={{ mask: `url(${stickyNote.url}) center / contain no-repeat`, WebkitMask: `url(${stickyNote.url}) center / contain no-repeat` }} />;
}

export function Pill() {
  return (
    <div className="flex flex-col gap-10 items-center self-stretch h-fit py-2.5">
      <div className="flex select-none flex-col gap-2.5 items-center w-fit h-fit bg-carbon-10/10 rounded-full py-2 px-4">
        <p className="text-base font-semibold text-center text-salvia leading-none self-stretch h-fit">Registro Diario de 21 Días</p>
      </div>
    </div>
  );
}

const TAB_ICON_PX = 24;
const TAB_ICON_STROKE = 1.5;

// Un único componente para los tres íconos: SVG renderizado exactamente de
// TAB_ICON_PX × TAB_ICON_PX, mismo trazo, sin padding interno.
function TabIcon({ icon: Icon, overlay }: { icon: LucideIcon | typeof StickyNoteIcon; overlay?: string | undefined }) {
  return (
    <span className="relative inline-flex h-6 w-6 items-center justify-center">
      {Icon === StickyNoteIcon ? <StickyNoteIcon /> : <Icon size={TAB_ICON_PX} width={TAB_ICON_PX} height={TAB_ICON_PX} strokeWidth={TAB_ICON_STROKE} className="block" />}
      {overlay && (
        <span className="absolute inset-x-0 bottom-[3px] text-center text-[8px] font-semibold leading-none">{overlay}</span>
      )}
    </span>
  );
}

const TABS = [
  { to: "/registro-diario/notas", label: "Mis notas", icon: StickyNoteIcon, overlay: undefined },
  { to: "/registro-diario", label: "Registro Diario", icon: Calendar, overlay: "21" },
  { to: "/registro-diario/plan", label: "Mantenimiento", icon: Trophy, overlay: undefined },
] as const;

// Mismo estilo y comportamiento que la barra flotante de Guiones.
export function RegistroBottomNav() {
  return (
    <>
      <div className="h-[110px] shrink-0" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[117px] bg-gradient-to-t from-tiza to-tiza/0" />
      <nav
        className="fixed inset-x-0 z-40 mx-auto flex w-[calc(100%-20px)] max-w-[380px] flex-row gap-2.5 items-start bg-tiza rounded-full border border-carbon-10/10 p-2.5"
        style={{ bottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        {TABS.map(({ to, label, icon, overlay }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex flex-col gap-0.5 justify-center items-center flex-1 h-[60px] rounded-full p-4 overflow-hidden transition-colors bg-carbon-10/[0.03] text-piedra data-[status=active]:bg-salvia data-[status=active]:text-tiza"
          >
            <TabIcon icon={icon} overlay={overlay} />
            <span className="text-xs font-normal text-center tracking-tight whitespace-nowrap">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export type EstadoDia = "completado" | "actual" | "pendiente";

export function CirculoDia({ n, estado, size = "h-10 w-10" }: { n: number; estado: EstadoDia; size?: string }) {
  const cls =
    estado === "completado"
      ? "bg-salvia text-tiza"
      : estado === "actual"
        ? "border-2 border-salvia text-salvia"
        : "bg-carbon/[0.04] text-piedra";
  return (
    <Link
      to="/registro-diario/dia/$n"
      params={{ n: String(n) }}
      aria-label={`Día ${n}`}
      data-dia={n}
      className={`flex shrink-0 snap-start flex-row items-center justify-center rounded-full ${size} ${cls}`}
    >
      <span className="text-base font-semibold leading-none">{n}</span>
    </Link>
  );
}

export function CheckLleno({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full bg-salvia text-tiza ${className}`}>
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
    </span>
  );
}

export function CheckVacio({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] border-piedra/60 text-piedra/70 ${className}`}>
      <Check className="h-3.5 w-3.5" strokeWidth={2} />
    </span>
  );
}
