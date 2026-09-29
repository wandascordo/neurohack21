import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/privacidad")({
  head: () => meta("Política de Privacidad", "Cómo Destello Interior cuida tus datos en Neurohack 21."),
  component: () => <Placeholder title="Política de Privacidad" back="/" />,
});
