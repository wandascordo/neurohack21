import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/autoevaluacion")({
  head: () => meta("Autoevaluación de Foco", "Medí tu foco en 4 momentos del reto."),
  component: () => <Placeholder title="Autoevaluación de Foco" back="/menu" />,
});
