import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/registro-diario")({
  head: () => meta("Registro Diario de 21 Días", "Tu práctica y reflexión de cada día del reto."),
  component: () => <Placeholder title="Registro Diario de 21 Días" back="/menu" />,
});
