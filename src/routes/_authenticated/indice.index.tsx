import { createFileRoute, Link } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";
import { Onboarding } from "@/components/Onboarding";
import { SECCIONES } from "@/lib/secciones";

export const Route = createFileRoute("/_authenticated/indice/")({
  head: () => meta("Índice de Contenidos", "Todas las partes y módulos de Neurohack 21."),
  component: () => (
    <Placeholder title="Índice de Contenidos" description="Recorré las partes del libro en el orden que prefieras.">
      <Onboarding />
      <ul className="space-y-2">
        {SECCIONES.map((s) => (
          <li key={s.slug}>
            <Link to="/indice/$seccion" params={{ seccion: s.slug }} className="block rounded-md border border-border px-4 py-3 text-foreground hover:bg-accent">
              {s.titulo}
            </Link>
          </li>
        ))}
      </ul>
    </Placeholder>
  ),
});
