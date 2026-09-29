import { createFileRoute, notFound } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";
import { SECCIONES } from "@/lib/secciones";

export const Route = createFileRoute("/_authenticated/indice/$seccion")({
  loader: ({ params }) => {
    const s = SECCIONES.find((x) => x.slug === params.seccion);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.titulo ?? "Sección"} — Neurohack 21` },
      { name: "description", content: "Sección del libro interactivo Neurohack 21." },
      { property: "og:title", content: `${loaderData?.titulo ?? "Sección"} — Neurohack 21` },
      { property: "og:description", content: "Sección del libro interactivo Neurohack 21." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: () => <Placeholder title="Sección no encontrada" back="/indice" />,
  errorComponent: () => <Placeholder title="No se pudo cargar" back="/indice" />,
  component: Seccion,
});

function Seccion() {
  const s = Route.useLoaderData();
  const modules = s.slug === "parte-1" ? [1, 2, 3] : s.slug === "parte-2" ? [4, 5, 6] : s.slug === "parte-4" ? [7, 8] : [];
  return (
    <Placeholder title={s.titulo} back="/indice" description="El contenido de esta parte se incorporará más adelante.">
      {modules.length > 0 && (
        <div className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">Módulos</h2>
          <ol className="mt-4 space-y-3 text-sm text-foreground">
            {modules.map((number) => <li key={number} className="border-b border-border pb-3">Módulo {number}</li>)}
          </ol>
        </div>
      )}
      {s.slug === "parte-3" && (
        <div className="border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">El reto de 21 días</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tus prácticas y reflexiones tendrán su lugar en el Registro Diario.</p>
          <Link to="/registro-diario" className="mt-5 inline-block text-sm font-medium text-foreground underline">Ir al Registro Diario →</Link>
        </div>
      )}
    </Placeholder>
  );
}
