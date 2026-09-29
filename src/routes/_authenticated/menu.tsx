import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/menu")({
  head: () => meta("Menú principal", "Accedé a todas las secciones de Neurohack 21."),
  component: Menu,
});

const items = [
  { to: "/indice", label: "Índice de Contenidos" },
  { to: "/autoevaluacion", label: "Autoevaluación de Foco" },
  { to: "/kit-emergencia", label: "Kit de Emergencia Anti-Distracción" },
  { to: "/registro-diario", label: "Registro Diario de 21 Días" },
  { to: "/tracker", label: "Tracker Visual de 21 Días" },
  { to: "/guiones", label: "Guiones Listos para Proteger tu Foco" },
  { to: "/glosario", label: "Glosario de Términos" },
] as const;

function Menu() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Menú principal</h1>
        <Button variant="outline" size="sm" onClick={signOut}>Salir</Button>
      </div>
      <ul className="mt-8 space-y-2">
        {items.map((i) => (
          <li key={i.to}>
            <Link to={i.to} className="block rounded-md border border-border px-4 py-3 text-foreground hover:bg-accent">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex gap-4 text-sm text-muted-foreground">
        <Link to="/privacidad" className="underline">Política de Privacidad</Link>
        <Link to="/terminos" className="underline">Términos de Uso</Link>
      </div>
    </main>
  );
}
