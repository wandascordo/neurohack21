import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/registro-diario")({
  head: () => meta("Registro Diario de 21 Días", "Tu práctica y reflexión de cada día del reto."),
  component: () => (
    <Placeholder title="Registro Diario de 21 Días" description="Un lugar para registrar cada día de práctica, del 1 al 21.">
      <h2 className="text-base font-semibold">Cada registro incluirá</h2>
      <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
        {["Cómo llegaste antes de empezar", "Prácticas corporales", "Reflexión del día", "Nivel de foco", "Pausas y cómo retomaste"].map((item) => <li key={item} className="py-4">{item}</li>)}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">La escritura y el guardado de registros estarán disponibles cuando completemos esta sección.</p>
    </Placeholder>
  ),
});
