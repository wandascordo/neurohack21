import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/terminos")({
  head: () => meta("Términos de Uso", "Condiciones de uso de Neurohack 21."),
  component: () => <Placeholder title="Términos de Uso" back="/" />,
});
