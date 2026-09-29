import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/guiones")({
  head: () => meta("Guiones Listos para Proteger tu Foco", "Frases listas para cuidar tu atención."),
  component: () => <Placeholder title="Guiones Listos para Proteger tu Foco" back="/menu" />,
});
