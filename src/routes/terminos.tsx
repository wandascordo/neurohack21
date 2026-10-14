import { createFileRoute, redirect } from "@tanstack/react-router";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/terminos")({
  head: () => meta("Términos de Uso", "Condiciones de uso de Neurohack 21."),
  beforeLoad: () => { throw redirect({ to: "/terminos-de-uso", statusCode: 301 }); },
});
