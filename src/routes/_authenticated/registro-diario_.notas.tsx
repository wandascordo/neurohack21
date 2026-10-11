import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { meta } from "@/components/Placeholder";
import { Pill, RegistroBottomNav } from "@/components/registro/RegistroUI";
import { Encabezado, TarjetaLink } from "@/components/registro/PlanUI";
import { NOTAS, editadoEl, notasQuery } from "@/lib/notas";

export const Route = createFileRoute("/_authenticated/registro-diario_/notas")({
  head: () => meta("Mis notas · Registro Diario", "Tus ejercicios de cierre de los Módulos 1 a 5."),
  component: MisNotas,
});

function MisNotas() {
  const { data: filas = [] } = useQuery(notasQuery);
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-5 self-stretch pt-2.5 animate-fade-in">
        <Encabezado
          titulo="Mis notas"
          subChico
          sub="Acá guardás lo que escribiste en los ejercicios de cierre de cada módulo. Podés volver a leerlo y editarlo cuando quieras. Solo vos podés ver estas notas."
        />
        <div className="flex flex-col gap-2.5 self-stretch">
          {NOTAS.map((m) => {
            const ed = editadoEl(filas, m.n);
            return (
              <TarjetaLink key={m.n} to={`/registro-diario/notas/modulo/${m.n}`} eyebrow={`Módulo ${m.n}`} titulo={m.titulo}>
                {ed && <p className="-mt-1 px-1 pb-1 text-xs tracking-tight text-piedra">{ed}</p>}
              </TarjetaLink>
            );
          })}
        </div>
      </div>
      <RegistroBottomNav />
    </BookScreen>
  );
}
