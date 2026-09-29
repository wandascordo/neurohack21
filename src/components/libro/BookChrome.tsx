import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/book-logo.svg.asset.json";
import menuClose from "@/assets/menu-close.png.asset.json";

function Menu() {
  return (
    <Link to="/menu" aria-label="Menú" className="flex h-7 w-7 flex-col justify-center gap-[9px]">
      <span className="block h-px w-7 bg-carbon" />
      <span className="block h-px w-7 bg-carbon" />
    </Link>
  );
}

function Header() {
  return (
    <Link
      to="/indice"
      aria-label="Neurohack 21 — Ir al Índice de Contenidos"
      className="absolute left-1/2 top-1/2 block h-3 w-[100px] -translate-x-1/2 -translate-y-1/2 bg-carbon"
      style={{ mask: `url(${logo.url}) center / contain no-repeat`, WebkitMask: `url(${logo.url}) center / contain no-repeat` }}
    />
  );
}

function DarkMode() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setOn(document.documentElement.classList.contains("dark") || mq.matches);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", on);
  }, [on]);
  return (
    <button
      type="button"
      aria-label="Modo oscuro"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      className={`flex h-fit w-[46px] cursor-pointer flex-row items-center gap-2.5 overflow-hidden rounded-full bg-avena p-1 ${on ? "justify-end" : ""}`}
    >
      <div className="relative h-5 w-5 overflow-hidden rounded-full bg-tiza" />
    </button>
  );
}

export function TopBar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="relative flex h-fit flex-row items-center justify-between self-stretch py-2.5">
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Cerrar menú" className="h-7 w-7">
          <img className="h-7 w-7" src={menuClose.url} alt="" />
        </button>
      ) : (
        <Menu />
      )}
      <Header />
      <DarkMode />
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex h-fit flex-row items-center self-stretch overflow-hidden rounded-full bg-carbon-10/10" role="progressbar" aria-valuenow={Math.round(value * 100)}>
      <div className="relative h-1 min-w-7 rounded-full bg-salvia transition-all" style={{ width: `${value * 100}%` }} />
    </div>
  );
}

export function BookScreen({ children, fill = false }: { children: ReactNode; fill?: boolean }) {
  return (
    <div className="min-h-screen bg-tiza font-rethink-sans">
      <div className={`mx-auto flex w-full max-w-[400px] flex-col items-start bg-tiza px-5 pb-10 pt-[30px] ${fill ? "min-h-screen" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export const btnPrimary =
  "flex h-fit shrink-0 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full bg-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-tiza";
export const btnSecondary =
  "flex h-fit flex-1 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full border border-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-salvia";
