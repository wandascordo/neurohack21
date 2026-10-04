import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchProgreso, logEvent } from "@/lib/progreso";
import check from "@/assets/inicio-check.png.asset.json";
import { meta } from "@/components/Placeholder";
import { Onboarding } from "@/components/Onboarding";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { LIBRO } from "@/lib/libro";
import foco from "@/assets/menu-foco.png.asset.json";
import siren from "@/assets/menu-siren.png.asset.json";
import calendario from "@/assets/menu-calendario.png.asset.json";
import chart from "@/assets/menu-chart.png.asset.json";
import postits from "@/assets/menu-postits.png.asset.json";
import glosario from "@/assets/menu-glosario.png.asset.json";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => meta("Inicio", "Tu progreso de lectura y tus recursos de Neurohack 21."),
  component: Inicio,
});

const recursos = [
  { to: "/autoevaluacion", label: "Autoevaluación de Foco", icon: foco.url },
  { to: "/kit-emergencia", label: "Botón Anti-Distracción", icon: siren.url },
  { to: "/registro-diario", label: "Registro Diario de 21 Días", icon: calendario.url },
  { to: "/tracker", label: "Tracker Visual de 21 Días", icon: chart.url },
  { to: "/guiones", label: "Guiones Listos para Proteger tu Foco", icon: postits.url },
  { to: "/glosario", label: "Glosario de Términos", icon: glosario.url },
] as const;

function saludo() {
  const h = new Date().getHours();
  if (h >= 5 && h < 13) return "Buenos días";
  if (h >= 13 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function Inicio() {
  const { data } = useQuery({
    queryKey: ["progreso-lectura"],
    queryFn: fetchProgreso,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const pagina = data?.slug ? LIBRO.find((p) => p.slug === data.slug) ?? null : null;
  const pct = data?.pct ?? 0;
  const completo = pct >= 100;
  const hash = data?.anchor ?? undefined;
  const [parte, ...resto] = pagina ? pagina.eyebrow.split(" / ") : [];
  const [shownPct, setShownPct] = useState(0);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShownPct(pct)));
    return () => cancelAnimationFrame(raf);
  }, [pct]);

  return (
    <BookScreen exact>
      <Onboarding />
      <div className="flex w-full flex-1 flex-col gap-5">
        <TopBar />
        <div className="flex flex-1 flex-col items-center gap-5 self-stretch">
          <h1 className="h-fit shrink-0 self-stretch text-left text-[28px] font-normal leading-[1.1] tracking-[-1.50px] text-carbon">
            {saludo()}
          </h1>
          <div className="flex h-fit shrink-0 flex-col items-center justify-center gap-4 self-stretch rounded-[10px] relative isolate overflow-hidden border border-carbon-10/10 bg-salvia p-4 [&>*:not(.glow)]:relative [&>*:not(.glow)]:z-10">
            <div aria-hidden className="glow pointer-events-none absolute left-1/2 top-[70%] -z-0 h-[372px] w-[372px] -translate-x-1/2 rounded-full bg-tiza opacity-40 blur-[100px]" />
            {completo ? (
              <div className="flex flex-col items-center justify-center gap-2.5 self-stretch p-1">
                <div className="flex h-fit flex-row items-start justify-center gap-5 self-stretch">
                  <p className="h-fit flex-1 text-left text-base font-semibold tracking-tight text-tiza">Tu progreso de lectura: 100%</p>
                  <img className="h-5 w-5" src={check.url} alt="Lectura completa" />
                </div>
                <div className="flex h-fit flex-col items-start gap-2.5 self-stretch pb-2.5">
                  <p className="h-fit self-stretch text-left text-sm font-normal tracking-tight text-tiza">Llegaste hasta el final de tu aprendizaje, ahora es momento de llevar a la práctica todo lo aprendido.</p>
                  <p className="h-fit self-stretch text-left text-sm font-normal tracking-tight text-tiza">Cuando quieras, podés volver a repasar los contenidos de este libro y reforzar los conceptos que trabajamos acá.</p>
                </div>
                <Link to="/indice/$seccion" params={{ seccion: "prologo" }} onClick={() => logEvent("leer_de_nuevo")} className="flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full border-2 border-tiza px-6 py-4 text-center text-base font-semibold uppercase leading-none text-tiza">
                  Leer de nuevo
                </Link>
              </div>
            ) : pagina ? (
              <>
                <p className="h-fit self-stretch text-left text-base font-semibold tracking-tight text-tiza">Tu progreso de lectura: {pct}%</p>
                <div className="flex h-1 flex-row self-stretch overflow-hidden rounded-full bg-carbon-10/10">
                  <div className="self-stretch rounded-full bg-tiza transition-[width] duration-1000 ease-linear" style={{ width: `${shownPct}%` }} />
                </div>
                <div className="flex h-fit flex-col items-start gap-2.5 self-stretch">
                  <p className="h-fit self-stretch text-left text-base font-semibold leading-none">
                    <span className="text-avena">{parte}{resto.length ? " / " : ""}</span>
                    {resto.length > 0 && <span className="text-tiza">{resto.join(" / ")}</span>}
                  </p>
                  <p className="h-fit self-stretch text-left text-[22px] font-normal leading-[1.1] tracking-[-1.00px] text-tiza">{pagina.titulo}</p>
                  {data?.anchorLabel && (
                    <p className="h-fit self-stretch text-left text-sm font-normal tracking-tight text-avena">{data.anchorLabel}</p>
                  )}
                </div>
                <Link to="/indice/$seccion" params={{ seccion: pagina.slug }} hash={hash} onClick={() => logEvent("continuar_leyendo", { slug: pagina.slug, anchor: hash, metadata: { desde: "inicio" } })} className="flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-tiza px-6 py-4 text-center text-base font-semibold uppercase leading-none text-salvia">
                  Continuar leyendo
                </Link>
              </>
            ) : (
              <>
                <p className="h-fit self-stretch text-left text-base font-normal tracking-tight text-tiza">
                  Acá vas a ver tu progreso a medida que vayas avanzando con la lectura del libro, ¿estás listo/a para empezar?
                </p>
                <Link to="/indice" onClick={() => logEvent("iniciar_lectura")} className="flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-tiza px-6 py-4 text-center text-base font-semibold uppercase leading-none text-salvia">
                  Iniciar lectura
                </Link>
              </>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-start gap-2.5 self-stretch">
            <p className="h-fit shrink-0 self-stretch text-left text-base font-semibold tracking-tight text-carbon">Tus recursos</p>
            <div className="grid w-full min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2.5">
              {recursos.map((r) => (
                <Link key={r.to} to={r.to} onClick={() => logEvent("recurso_abierto", { metadata: { recurso: r.to, desde: "inicio" } })} className="flex min-h-[104px] flex-col items-start justify-between gap-3 rounded-[10px] border border-carbon-10/10 bg-blanco p-3.5">
                  <img className="h-6 w-6" src={r.icon} alt="" />
                  <span className="text-left text-base font-normal leading-snug tracking-tight text-carbon">{r.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BookScreen>
  );
}
