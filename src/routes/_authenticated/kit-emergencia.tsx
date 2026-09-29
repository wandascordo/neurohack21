import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/kit-emergencia")({
  head: () => meta("Kit de Emergencia Anti-Distracción", "Recursos rápidos para recuperar el foco."),
  component: () => <Placeholder title="Kit de Emergencia Anti-Distracción" back="/menu" />,
});
