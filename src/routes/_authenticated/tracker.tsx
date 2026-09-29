import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/tracker")({
  head: () => meta("Tracker Visual de 21 Días", "Mirá tu avance a lo largo del reto."),
  component: () => (
    <Placeholder title="Tracker Visual de 21 Días" description="Una vista de los 21 días del reto. El avance aparecerá acá cuando esté listo el Registro Diario.">
      <h2 className="text-base font-semibold">Los 21 días</h2>
      <ol className="mt-4 grid grid-cols-7 gap-2" aria-label="Días del reto">
        {Array.from({ length: 21 }, (_, index) => <li key={index} className="flex aspect-square items-center justify-center border border-border text-sm text-muted-foreground" aria-label={`Día ${index + 1}`}>{index + 1}</li>)}
      </ol>
      <p className="mt-5 text-sm text-muted-foreground">Todavía no se muestra el estado de tus días.</p>
    </Placeholder>
  ),
});
