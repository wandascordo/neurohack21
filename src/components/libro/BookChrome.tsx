import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/book-logo.svg.asset.json";
import menuClose from "@/assets/menu-close.png.asset.json";
import backIcon from "@/assets/menu-back.png.asset.json";
import { getTema, setTema, suscribirTema } from "@/lib/tema";

// Botón "volver" con el mismo formato que "Menú principal" del índice.
export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-11 flex-row items-center gap-1 self-stretch py-2.5">
      <img className="h-5 w-5" src={backIcon.url} alt="" />
      <span className="text-sm font-normal tracking-tight text-carbon text-left">{label}</span>
    </button>
  );
}

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
      to="/inicio"
      aria-label="Neurohack 21 — Ir al Inicio"
      className="absolute left-1/2 top-1/2 block h-3 w-[100px] -translate-x-1/2 -translate-y-1/2 bg-carbon"
      style={{ mask: `url(${logo.url}) center / contain no-repeat`, WebkitMask: `url(${logo.url}) center / contain no-repeat` }}
    />
  );
}

function DarkMode() {
  const [on, setOn] = useState(() => getTema() === "dark");
  useEffect(() => suscribirTema((t) => setOn(t === "dark")), []);
  return (
    <button
      type="button"
      aria-label="Modo oscuro"
      aria-pressed={on}
      onClick={() => setTema(on ? "light" : "dark")}
      className={`flex h-fit w-[46px] cursor-pointer flex-row items-center gap-2.5 overflow-hidden rounded-full bg-avena p-1 ${on ? "justify-end" : ""}`}
    >
      <div className="relative h-5 w-5 overflow-hidden rounded-full bg-tiza" />
    </button>
  );
}

function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function TopBarRow({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {onClose ? (
        <button type="button" onClick={onClose} aria-label="Cerrar menú" className="h-7 w-7">
          <span
            className="block h-7 w-7 bg-carbon"
            style={{ mask: `url(${menuClose.url}) center / contain no-repeat`, WebkitMask: `url(${menuClose.url}) center / contain no-repeat` }}
          />
        </button>
      ) : (
        <Menu />
      )}
      <Header />
      <DarkMode />
    </>
  );
}

export function TopBar({ onClose }: { onClose?: () => void }) {
  if (onClose) {
    return (
      <div className="relative flex h-fit flex-row items-center justify-between self-stretch py-2.5">
        <TopBarRow onClose={onClose} />
      </div>
    );
  }
  return <FixedTopBar />;
}

function FixedTopBar() {
  const hidden = useHideOnScrollDown();
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 bg-tiza transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto flex w-full max-w-[400px] flex-row items-center justify-between px-5 py-5">
          <TopBarRow />
        </div>
      </header>
      <div className="h-[68px] shrink-0" aria-hidden="true" />
    </>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(value)));
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <div className="flex h-fit flex-row items-center self-stretch overflow-hidden rounded-full bg-carbon-10/10" role="progressbar" aria-valuenow={Math.round(value * 100)}>
      <div className="relative h-1 min-w-7 rounded-full bg-salvia transition-[width] duration-1000 ease-linear" style={{ width: `${shown * 100}%` }} />
    </div>
  );
}

export function BookScreen({ children, fill = false, exact = false }: { children: ReactNode; fill?: boolean; exact?: boolean }) {
  return (
    <div className="min-h-screen bg-tiza font-rethink-sans">
      <div className={`mx-auto flex w-full max-w-[400px] flex-col items-start bg-tiza px-5 pb-10 pt-[30px] ${exact ? "h-[100dvh] overflow-y-auto" : fill ? "min-h-screen" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export const btnPrimary =
  "flex h-fit shrink-0 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full bg-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-tiza";
export const btnSecondary =
  "flex h-fit flex-1 flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full border border-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-salvia";
