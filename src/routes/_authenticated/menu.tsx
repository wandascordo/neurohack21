import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { INDICE } from "@/lib/libro";
import { fetchProgreso, logEvent } from "@/lib/progreso";
import paginas from "@/assets/menu-paginas.png.asset.json";
import flecha from "@/assets/menu-flecha.png.asset.json";
import foco from "@/assets/menu-foco.png.asset.json";
import siren from "@/assets/menu-siren.png.asset.json";
import calendario from "@/assets/menu-calendario.png.asset.json";
import chart from "@/assets/menu-chart.png.asset.json";
import postits from "@/assets/menu-postits.png.asset.json";
import glosario from "@/assets/menu-glosario.png.asset.json";
import back from "@/assets/menu-back.png.asset.json";

export const Route = createFileRoute("/_authenticated/menu")({
  head: () => meta("Menú principal", "Accedé a todas las secciones de Neurohack 21."),
  component: Menu,
});

const items = [
  { to: "/autoevaluacion", label: "Autoevaluación de Foco", icon: foco.url },
  { to: "/kit-emergencia", label: "Botón de Emergencia Anti-Distracción", icon: siren.url },
  { to: "/registro-diario", label: "Registro Diario de 21 Días", icon: calendario.url },
  { to: "/tracker", label: "Tracker Visual de 21 Días", icon: chart.url },
  { to: "/guiones", label: "Guiones Listos para Proteger tu Foco", icon: postits.url },
  { to: "/glosario", label: "Glosario de Términos", icon: glosario.url },
] as const;

const row = "flex h-fit flex-row items-center gap-2.5 self-stretch border-b border-carbon-10/10 p-2.5";
const title = "text-base font-normal tracking-tight text-carbon text-left";
const sub = "text-sm font-normal tracking-tight text-carbon text-left";
const staggerClass = "animate-menu-item";
const stagger = (i: number) => ({ animationDelay: `${60 + i * 35}ms` });

function Menu() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"main" | "indice">("main");
  const [closing, setClosing] = useState(false);

  const { data: progreso } = useQuery({
    queryKey: ["progreso-lectura"],
    queryFn: fetchProgreso,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const continuar = progreso?.slug ?? "prologo";
  const continuarHash = progreso?.anchor ?? undefined;

  function closeMenu() {
    if (closing) return;
    setClosing(true);
    window.setTimeout(() => {
      if (window.history.length > 1) router.history.back();
      else navigate({ to: "/indice" });
    }, 170);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <BookScreen fill>
      <div className={`flex w-full flex-1 flex-col gap-5 ${closing ? "animate-menu-out" : "animate-menu-in"}`}>
        <TopBar onClose={closeMenu} />
        {view === "main" ? (
          <div className="flex flex-1 flex-col items-center gap-[30px] self-stretch">
            <nav className="flex h-fit flex-col items-center gap-2.5 self-stretch">
              <button type="button" onClick={() => setView("indice")} className={`${row} ${staggerClass}`} style={stagger(0)}>
                <img className="h-6 w-6" src={paginas.url} alt="" />
                <span className={`${title} flex-1`}>Índice de Contenidos</span>
                <img className="h-6 w-6" src={flecha.url} alt="" />
              </button>
              {items.map((i, idx) => (
                <Link key={i.to} to={i.to} className={`${row} ${staggerClass}`} style={stagger(idx + 1)}>
                  <img className="h-6 w-6" src={i.icon} alt="" />
                  <span className={title}>{i.label}</span>
                </Link>
              ))}
            </nav>
            <Link to="/indice/$seccion" params={{ seccion: continuar }} hash={continuarHash} onClick={() => logEvent("continuar_leyendo", { slug: continuar, anchor: continuarHash, metadata: { desde: "menu" } })} style={stagger(7)} className={`flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-salvia px-6 py-4 text-center text-base font-semibold uppercase leading-none text-tiza ${staggerClass}`}>
              Continuar leyendo
            </Link>
            <div className="flex flex-1 flex-col items-center justify-end self-stretch">
              <Link to="/privacidad" style={stagger(8)} className={`${row} ${sub} ${staggerClass}`}>Políticas de Privacidad</Link>
              <Link to="/terminos" style={stagger(9)} className={`${row} ${sub} ${staggerClass}`}>Términos de Uso</Link>
              <button type="button" onClick={signOut} style={stagger(10)} className={`${row} ${sub} ${staggerClass}`}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-2.5 self-stretch">
            <button type="button" onClick={() => setView("main")} className="flex h-11 flex-row items-center gap-1 self-stretch py-2.5">
              <img className="h-5 w-5" src={back.url} alt="" />
              <span className={sub}>Menú principal</span>
            </button>
            <nav className="flex h-fit flex-col items-center gap-2.5 self-stretch">
              {INDICE.map((g, idx) => (
                <div key={g.titulo} style={stagger(idx)} className={`flex h-fit flex-col justify-center gap-2.5 self-stretch border-b border-carbon-10/10 p-2.5 ${staggerClass}`}>
                  <Link to="/indice/$seccion" params={{ seccion: g.slug ?? g.items[0]!.slug }} className={`${title} self-stretch`}>{g.titulo}</Link>
                  {g.items.length > 0 && g.titulo !== "Introducción" && g.items.map((it) => (
                    <Link key={it.slug} to="/indice/$seccion" params={{ seccion: it.slug }} className={`${sub} self-stretch px-2.5 pt-2.5`}>{it.label}</Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </BookScreen>
  );
}
