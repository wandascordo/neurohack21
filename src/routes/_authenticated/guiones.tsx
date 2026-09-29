import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/guiones")({
  head: () => meta("Guiones Listos para Proteger tu Foco", "Frases listas para cuidar tu atención."),
  component: () => (
    <Placeholder title="Guiones Listos para Proteger tu Foco" description="Textos y planes para cuidar tu atención en distintos momentos.">
      <h2 className="text-base font-semibold">Tu espacio</h2>
      <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
        <li className="py-4">Planes «si pasa X, entonces hago Y»</li>
        <li className="py-4">Ritual mínimo de mantenimiento</li>
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">Los guiones y la edición de tus planes se incorporarán más adelante.</p>
    </Placeholder>
  ),
});
