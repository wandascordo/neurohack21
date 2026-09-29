import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/autoevaluacion")({
  head: () => meta("Autoevaluación de Foco", "Medí tu foco en 4 momentos del reto."),
  component: () => (
    <Placeholder title="Autoevaluación de Foco" description="Cuatro momentos para observar cómo cambia tu atención durante el reto.">
      <h2 className="text-base font-semibold">Momentos de evaluación</h2>
      <ol className="mt-4 divide-y divide-border border-y border-border text-sm">
        {["Antes del día 1", "Cierre de la semana 1", "Cierre de la semana 2", "Día 21"].map((moment, index) => (
          <li key={moment} className="flex gap-4 py-4"><span className="text-muted-foreground">0{index + 1}</span>{moment}</li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-muted-foreground">Las preguntas de cada evaluación se incorporarán más adelante.</p>
    </Placeholder>
  ),
});
