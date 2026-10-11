import { createFileRoute } from "@tanstack/react-router";
import { meta } from "@/components/Placeholder";
import { PantallaIntenciones } from "@/components/registro/Intenciones";

export const Route = createFileRoute("/_authenticated/registro-diario_/plan_/mundo-real")({
  head: () => meta("Mi intención para el mundo real · Mi plan de mantenimiento", "Una intención para tu contexto de trabajo, estudio o relaciones."),
  component: () => <PantallaIntenciones mod={8} />,
});
