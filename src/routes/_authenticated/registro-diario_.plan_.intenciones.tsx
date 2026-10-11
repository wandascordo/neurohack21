import { createFileRoute } from "@tanstack/react-router";
import { meta } from "@/components/Placeholder";
import { PantallaIntenciones } from "@/components/registro/Intenciones";

export const Route = createFileRoute("/_authenticated/registro-diario_/plan_/intenciones")({
  head: () => meta("Mis intenciones de implementación · Mi plan de mantenimiento", "Frases “si pasa X, entonces hago Y” para sostener el foco."),
  component: () => <PantallaIntenciones mod={7} />,
});
