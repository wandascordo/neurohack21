import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { meta } from "@/components/Placeholder";
import { Pill, RegistroBottomNav } from "@/components/registro/RegistroUI";
import { ChipEstatico, Encabezado, TarjetaLink } from "@/components/registro/PlanUI";
import { CONTEXTOS, fraseDe, intencionesQuery, ritualCuando, ritualPractica, ritualQuery } from "@/lib/plan";

export const Route = createFileRoute("/_authenticated/registro-diario_/plan")({
  head: () => meta("Mi plan de mantenimiento · Registro Diario", "Lo que vas a sostener después del Día 21."),
  component: Plan,
});

const caja = "flex flex-col gap-2.5 self-stretch rounded-[10px] bg-carbon/[0.04] p-2.5";
const vacio = "text-base tracking-tight text-piedra";

function Cita({ children }: { children: string }) {
  return (
    <div className="rounded-[10px] bg-carbon/[0.04] p-2.5">
      <p className="border-l-2 border-piedra/70 pl-3 text-base tracking-tight text-carbon">{children}</p>
    </div>
  );
}

function Plan() {
  const { data: ritual } = useQuery(ritualQuery);
  const { data: ints = [] } = useQuery(intencionesQuery);
  const practica = ritual ? ritualPractica(ritual) : null;
  const cuando = ritual ? ritualCuando(ritual) : null;
  const m7 = ints.filter((i) => i.source_module === 7);
  const m8 = ints.find((i) => i.source_module === 8);
  const f8 = m8 ? fraseDe(m8) : null;
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch pt-2.5 animate-fade-in">
        <Encabezado titulo="Mi plan de mantenimiento" subChico sub="Lo que vas a sostener después del Día 21. Se arma con los Módulos 7 y 8 y podés editarlo cuando quieras." />
        <div className="flex flex-col gap-2.5 self-stretch">
          <TarjetaLink to="/registro-diario/plan/ritual" eyebrow="Módulo 7" titulo="Mi ritual mínimo">
            <div className={`${caja} !flex-row flex-wrap items-center`}>
              {practica || cuando ? (
                <>
                  {practica && <span className="text-base tracking-tight text-carbon">{practica}</span>}
                  {cuando && <ChipEstatico>{cuando}</ChipEstatico>}
                </>
              ) : (
                <span className={vacio}>Sin completar</span>
              )}
            </div>
          </TarjetaLink>
          <TarjetaLink to="/registro-diario/plan/intenciones" eyebrow="Módulo 7" titulo="Mis intenciones de implementación">
            {m7.length ? (
              <div className="flex flex-col gap-1">
                {m7.map((i) => {
                  const f = fraseDe(i);
                  return f ? <Cita key={i.id}>{f}</Cita> : null;
                })}
              </div>
            ) : (
              <div className={caja}><span className={vacio}>Todavía no creaste intenciones</span></div>
            )}
          </TarjetaLink>
          <TarjetaLink to="/registro-diario/plan/mundo-real" eyebrow="Módulo 8" titulo="Mi intención para el mundo real">
            {f8 && m8 ? (
              <div className={caja}>
                <ChipEstatico>{CONTEXTOS.find((c) => c.id === m8.context)?.label}</ChipEstatico>
                <p className="border-l-2 border-piedra/70 pl-3 text-base tracking-tight text-carbon">{f8}</p>
              </div>
            ) : (
              <div className={caja}><span className={vacio}>Sin completar</span></div>
            )}
          </TarjetaLink>
        </div>
      </div>
      <RegistroBottomNav />
    </BookScreen>
  );
}
