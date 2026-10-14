import { createFileRoute, redirect } from "@tanstack/react-router";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/privacidad")({
  head: () => meta("Política de Privacidad", "Cómo Destello Interior cuida tus datos en Neurohack 21."),
  beforeLoad: () => { throw redirect({ to: "/politica-de-privacidad", statusCode: 301 }); },
});
