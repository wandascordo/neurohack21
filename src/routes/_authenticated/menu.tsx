import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { INDICE } from "@/lib/libro";
import { fetchProgreso, logEvent } from "@/lib/progreso";
import paginas from "@/assets/menu-paginas.png.asset.json";
import foco from "@/assets/menu-foco.png.asset.json";
import siren from "@/assets/menu-siren.png.asset.json";
import calendario from "@/assets/menu-calendario.png.asset.json";
import chart from "@/assets/menu-chart-03.png.asset.json";
import postits from "@/assets/menu-postits.png.asset.json";
import glosario from "@/assets/menu-glosario.png.asset.json";
import chevron from "@/assets/menu-chevron.png.asset.json";

export const Route = createFileRoute("/_authenticated/menu")({
  head: () => meta("Menú principal", "Accedé a todas las secciones de Neurohack 21."),
  component: Menu,
});

const items = [
  { to: "/autoevaluacion", label: "Autoevaluación de Foco", icon: foco.url },
  { to: "/boton-anti-distraccion", label: "Botón Anti-Distracción", icon: siren.url },
  { to: "/registro-diario", label: "Registro Diario del Reto", icon: calendario.url },
  { to: "/tracker", label: "Tracker Visual de tu Progreso", icon: chart.url },
  { to: "/guiones", label: "Guiones Listos para Proteger tu Foco", icon: postits.url },
  { to: "/glosario", label: "Glosario de Términos", icon: glosario.url },
] as const;

const row = "flex h-fit flex-row items-center gap-2.5 self-stretch border-b border-carbon-10/10 p-2.5";
const title = "text-base font-normal tracking-tight text-carbon text-left";
const sub = "text-sm font-normal tracking-tight text-carbon text-left";
const section = "flex-1 text-lg font-semibold leading-[1.1] tracking-tight text-carbon text-left";
const foot = "flex h-fit flex-col justify-center self-stretch p-2.5 text-sm font-normal tracking-tight text-piedra text-left";
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
  // Con 0% o 100% de lectura el botón invita a empezar de nuevo desde el Prólogo.
  const iniciar = !!progreso && (progreso.pct === 0 || progreso.pct === 100);
  const destino = iniciar ? "prologo" : continuar;
  const continuarHash = iniciar ? undefined : progreso?.anchor ?? undefined;

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
      <div className={`flex w-full flex-1 flex-col ${closing ? "animate-menu-out" : "animate-menu-in"}`}>
        <TopBar onClose={closeMenu} closing={closing} />
        {view === "main" ? (
          <div className="flex flex-1 flex-col items-center gap-[30px] self-stretch">
            <div className="flex h-fit flex-col items-center gap-3.5 self-stretch">
              <div className={`flex h-fit flex-row items-center self-stretch px-2.5 ${staggerClass}`} style={stagger(0)}>
                <h2 className={section}>Recursos</h2>
              </div>
              <nav className="flex h-fit flex-col items-start gap-2.5 self-stretch">
                {items.map((i, idx) => (
                  <Link key={i.to} to={i.to} onClick={() => logEvent("recurso_abierto", { metadata: { recurso: i.to, desde: "menu" } })} className={`${row} ${staggerClass}`} style={stagger(idx + 1)}>
                    <img className="h-6 w-6" src={i.icon} alt="" />
                    <span className={title}>{i.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex h-fit flex-col items-center gap-3.5 self-stretch">
              <div className={`flex h-fit flex-row items-center self-stretch px-2.5 ${staggerClass}`} style={stagger(7)}>
                <h2 className={section}>Libro digital</h2>
              </div>
              <div className="flex h-fit flex-col items-start gap-5 self-stretch">
                <button type="button" onClick={() => setView("indice")} className={`flex h-fit flex-row items-center gap-2.5 self-stretch border-b border-carbon-10/10 pt-2.5 pr-1 pb-2.5 pl-2.5 ${staggerClass}`} style={stagger(8)}>
                  <img className="h-6 w-6" src={paginas.url} alt="" />
                  <span className={`${title} flex-1`}>Índice de Contenidos</span>
                  <img className="h-6 w-6" src={chevron.url} alt="" />
                </button>
                <Link to="/indice/$seccion" params={{ seccion: destino }} {...(continuarHash ? { hash: continuarHash } : {})} onClick={() => logEvent(iniciar ? "iniciar_lectura" : "continuar_leyendo", { slug: destino, anchor: continuarHash, metadata: { desde: "menu" } })} style={stagger(9)} className={`flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-salvia px-6 py-4 text-center text-base font-semibold uppercase leading-none text-tiza ${staggerClass}`}>
                  {iniciar ? "Iniciar lectura" : "Continuar leyendo"}
                </Link>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-end self-stretch">
              <nav aria-label="Páginas legales" className="flex w-full flex-col items-center border-t border-carbon-10/10 pt-2.5">
                <Link to="/terminos-de-uso" style={stagger(10)} className={`${foot} ${staggerClass}`}>Términos de uso</Link>
                <Link to="/politica-de-privacidad" style={stagger(11)} className={`${foot} ${staggerClass}`}>Política de privacidad</Link>
              </nav>
              <button type="button" onClick={signOut} style={stagger(12)} className={`${foot} ${staggerClass}`}>Logout</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center gap-5 self-stretch">
            <button type="button" onClick={() => setView("main")} className="flex h-fit flex-row items-center gap-1 self-stretch">
              <img className="h-6 w-6 rotate-180" src={chevron.url} alt="" />
              <span className="text-sm font-normal tracking-tight text-piedra text-left">Menú principal</span>
            </button>
            <nav className="flex h-fit flex-col items-center gap-2.5 self-stretch py-2.5">
              <div className="flex h-fit flex-row items-center gap-1 self-stretch">
                <h2 className={section}>Índice de Contenidos</h2>
              </div>
              {INDICE.map((g, idx) => (
                <div key={g.titulo} style={stagger(idx)} className={`flex h-fit flex-col justify-center gap-2.5 self-stretch border-b border-carbon-10/10 p-2.5 ${staggerClass}`}>
                  <Link to="/indice/$seccion" params={{ seccion: g.slug ?? g.items[0]!.slug }} className={`${title} self-stretch`}>{g.titulo}</Link>
                  {g.items.length > 0 && g.titulo !== "Introducción" && !g.titulo.startsWith("Parte III") && g.items.map((it) => (
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
