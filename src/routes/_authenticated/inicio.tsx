import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  { to: "/kit-emergencia", label: "Botón de Anti-Distracción", icon: siren.url },
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
    queryKey: ["inicio-profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data } = await supabase.from("profiles").select("last_read_slug, email").eq("id", u.user.id).maybeSingle();
      return { slug: data?.last_read_slug ?? null, email: data?.email ?? u.user.email ?? "" };
    },
  });
  const idx = data?.slug ? LIBRO.findIndex((p) => p.slug === data.slug) : -1;
  const pagina = idx >= 0 ? LIBRO[idx] : null;
  const pct = idx >= 0 ? Math.round(((idx + 1) / LIBRO.length) * 100) : 0;
  const [parte, ...resto] = pagina ? pagina.eyebrow.split(" / ") : [];

  return (
    <BookScreen exact>
      <Onboarding />
      <div className="flex w-full flex-1 flex-col gap-5">
        <TopBar />
        <div className="flex flex-1 flex-col items-center gap-5 self-stretch">
          <h1 className="h-fit shrink-0 self-stretch text-left text-[28px] font-normal leading-[1.1] tracking-[-1.50px] text-carbon">
            {saludo()}
          </h1>
          <div className="flex h-fit shrink-0 flex-col items-center justify-center gap-4 self-stretch rounded-[10px] border border-carbon-10/10 bg-salvia p-4">
            {pagina ? (
              <>
                <p className="h-fit self-stretch text-left text-base font-semibold tracking-tight text-tiza">Tu progreso de lectura: {pct}%</p>
                <div className="flex h-1 flex-row self-stretch overflow-hidden rounded-full bg-carbon-10/10">
                  <div className="self-stretch rounded-full bg-tiza" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex h-fit flex-col items-start gap-2.5 self-stretch">
                  <p className="h-fit self-stretch text-left text-base font-semibold leading-none">
                    <span className="text-avena">{parte}{resto.length ? " / " : ""}</span>
                    {resto.length > 0 && <span className="text-tiza">{resto.join(" / ")}</span>}
                  </p>
                  <p className="h-fit self-stretch text-left text-[22px] font-normal leading-[1.1] tracking-[-1.00px] text-tiza">{pagina.titulo}</p>
                </div>
                <Link to="/indice/$seccion" params={{ seccion: pagina.slug }} className="flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-tiza px-6 py-4 text-center text-base font-semibold uppercase leading-none text-salvia">
                  Continuar leyendo
                </Link>
              </>
            ) : (
              <>
                <p className="h-fit self-stretch text-left text-base font-normal tracking-tight text-tiza">
                  Acá vas a ver tu progreso a medida que vayas avanzando con la lectura del libro, ¿estás listo/a para empezar?
                </p>
                <Link to="/indice" className="flex h-fit flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-tiza px-6 py-4 text-center text-base font-semibold uppercase leading-none text-salvia">
                  Iniciar lectura
                </Link>
              </>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-start gap-2.5 self-stretch">
            <p className="h-fit shrink-0 self-stretch text-left text-base font-semibold tracking-tight text-carbon">Tus recursos</p>
            <div className="grid w-full min-h-0 flex-1 grid-cols-2 grid-rows-3 gap-2.5">
              {recursos.map((r) => (
                <Link key={r.to} to={r.to} className="flex min-h-[104px] flex-col items-start justify-between gap-3 rounded-[10px] border border-carbon-10/10 bg-blanco p-3.5">
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
