import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/glosario")({
  head: () => meta("Glosario de Términos", "Conceptos de neurociencia y psicología junguiana."),
  component: () => <Placeholder title="Glosario de Términos" back="/menu" />,
});
