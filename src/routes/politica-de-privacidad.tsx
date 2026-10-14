import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/politica-de-privacidad")({
  head: () => meta("Política de privacidad", "Política de privacidad de Neurohack 21, de Destello Interior."),
  component: () => <LegalPage title="Política de privacidad"><p>Próximamente</p></LegalPage>,
});