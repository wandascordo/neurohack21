import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/glosario")({
  head: () => meta("Glosario de Términos", "Conceptos de neurociencia y psicología junguiana."),
  component: () => (
    <Placeholder title="Glosario de Términos" description="Conceptos que acompañan el recorrido por el libro.">
      <h2 className="text-base font-semibold">Temas</h2>
      <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
        <li className="py-4">Neurociencia de la atención</li>
        <li className="py-4">Psicología junguiana</li>
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">Los términos y sus definiciones se incorporarán más adelante.</p>
    </Placeholder>
  ),
});
