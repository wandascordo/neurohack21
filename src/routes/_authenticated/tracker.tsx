import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/tracker")({
  head: () => meta("Tracker Visual de 21 Días", "Mirá tu avance a lo largo del reto."),
  component: () => <Placeholder title="Tracker Visual de 21 Días" back="/menu" />,
});
