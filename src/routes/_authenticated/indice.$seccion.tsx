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
    ],
  }),
  notFoundComponent: () => <Placeholder title="Sección no encontrada" back="/indice" />,
  errorComponent: () => <Placeholder title="No se pudo cargar" back="/indice" />,
  component: Seccion,
});

function Seccion() {
  const s = Route.useLoaderData();
  return <Placeholder title={s.titulo} back="/indice" />;
}
