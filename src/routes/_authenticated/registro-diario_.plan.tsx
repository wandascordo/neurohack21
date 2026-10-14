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
  const m8s = ints.filter((i) => i.source_module === 8);
  const m8 = m8s[m8s.length - 1];
  const u7 = m7[m7.length - 1];
  const f7 = u7 ? fraseDe(u7) : null;
  const mas = (n: number) => n > 1 ? <p className="text-sm tracking-tight text-piedra">+{n - 1} {n - 1 === 1 ? "intención" : "intenciones"}</p> : null;
  const f8 = m8 ? fraseDe(m8) : null;
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch pt-2.5 animate-fade-in">
        <Encabezado titulo="Mi plan de mantenimiento" subChico sub="Lo que vas a sostener después del Día 21. Se arma con los Módulos 7 y 8 y podés editarlo cuando quieras." />
        <div className="flex flex-col gap-2.5 self-stretch">
          <TarjetaLink to="/registro-diario/plan/ritual" eyebrow="Módulo 7" titulo="Mi ritual mínimo">
            {practica && cuando && (
              <div className={`${caja} !flex-row flex-wrap items-center`}>
                <>
                  {practica && <span className="text-base tracking-tight text-carbon">{practica}</span>}
                  {cuando && <ChipEstatico>{cuando}</ChipEstatico>}
                </>
              </div>
            )}
          </TarjetaLink>
          <TarjetaLink to="/registro-diario/plan/intenciones" eyebrow="Módulo 7" titulo="Mis intenciones de implementación">
            {f7 ? (
              <div className="flex flex-col gap-1">
                <Cita>{f7}</Cita>
                {mas(m7.length)}
              </div>
            ) : null}
          </TarjetaLink>
          <TarjetaLink to="/registro-diario/plan/mundo-real" eyebrow="Módulo 8" titulo="Mi intención para el mundo real">
            {f8 && m8 ? (
              <div className={caja}>
                <ChipEstatico>{CONTEXTOS.find((c) => c.id === m8.context)?.label}</ChipEstatico>
                <p className="border-l-2 border-piedra/70 pl-3 text-base tracking-tight text-carbon">{f8}</p>
                {mas(m8s.length)}
              </div>
            ) : null}
          </TarjetaLink>
        </div>
      </div>
      <RegistroBottomNav />
    </BookScreen>
  );
}
