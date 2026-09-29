import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";
import { BookScreen, ProgressBar, TopBar, btnPrimary, btnSecondary } from "@/components/libro/BookChrome";
import { LIBRO, type Block } from "@/lib/libro";
import illustration from "@/assets/parte-1-illustration.png.asset.json";

export const Route = createFileRoute("/_authenticated/indice/$seccion")({
  loader: ({ params }) => {
    const i = LIBRO.findIndex((x) => x.slug === params.seccion);
    if (i < 0) throw notFound();
    return { i };
  },
  head: ({ loaderData }) => {
    const t = `${loaderData ? LIBRO[loaderData.i]?.titulo : "Sección"} — Neurohack 21`;
    return {
      meta: [
        { title: t },
        { name: "description", content: "Sección del libro interactivo Neurohack 21." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Sección del libro interactivo Neurohack 21." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => <Placeholder title="Sección no encontrada" back="/indice" />,
  errorComponent: () => <Placeholder title="No se pudo cargar" back="/indice" />,
  component: Seccion,
});

function Seccion() {
  const { i } = Route.useLoaderData();
  const p = LIBRO[i]!;
  const prev = LIBRO[i - 1];
  const next = LIBRO[i + 1];

  if (p.kind === "parte") {
    return (
      <BookScreen fill>
        <div className="flex w-full flex-1 flex-col gap-5">
          <TopBar />
          <div className="flex flex-1 flex-col items-center justify-between self-stretch py-[50px]">
            <div className="flex h-fit flex-col items-center gap-2.5 self-stretch">
              <p className="self-stretch text-left text-base font-semibold leading-none text-carbon">{p.eyebrow}</p>
              <h1 className="self-stretch text-left text-4xl font-normal leading-[1.1] tracking-[-2.00px] text-carbon">{p.titulo}</h1>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center self-stretch">
              <img className="h-[200px] self-stretch object-contain dark:invert" src={illustration.url} alt="" />
            </div>
          </div>
          <Link to="/indice/$seccion" params={{ seccion: p.firstSlug }} className={`${btnPrimary} w-full`}>Continuar</Link>
        </div>
      </BookScreen>
    );
  }

  return (
    <BookScreen>
      <div className="flex w-full flex-col gap-5">
        <TopBar />
        <ProgressBar value={(i + 1) / LIBRO.length} />
        <article className="flex flex-col gap-5 self-stretch py-5">
          <div className="flex flex-col gap-2.5">
            <p className="text-base font-semibold leading-none text-piedra">{p.eyebrow}</p>
            <h1 className="text-4xl font-normal leading-[1.1] tracking-[-2.00px] text-carbon">{p.titulo}</h1>
          </div>
          {p.kind === "reto" ? (
            <>
              <p className="text-base tracking-tight text-piedra">Tus prácticas diarias y reflexiones del reto van a vivir en el Registro Diario. Esta sección se completará más adelante.</p>
              <Link to="/registro-diario" className="text-base font-semibold text-salvia underline">Ir al Registro Diario →</Link>
            </>
          ) : (
            p.blocks.map((b, k) => <BlockView key={k} b={b} />)
          )}
        </article>
        {p.slug === "prologo" && next && (
          <Link to="/indice/$seccion" params={{ seccion: next.slug }} className={`${btnPrimary} w-full`}>Siguiente</Link>
        )}
      </div>
      {p.slug !== "prologo" && <div className="fixed inset-x-0 bottom-0 bg-tiza/95 backdrop-blur">
        <div className="mx-auto flex max-w-[400px] gap-2.5 px-5 py-4">
          {prev ? (
            <Link to="/indice/$seccion" params={{ seccion: prev.slug }} className={btnSecondary}>‹ Anterior</Link>
          ) : (
            <Link to="/indice" className={btnSecondary}>‹ Índice</Link>
          )}
          {next ? (
            <Link to="/indice/$seccion" params={{ seccion: next.slug }} className={`${btnPrimary} flex-1`}>Siguiente ›</Link>
          ) : (
            <Link to="/indice" className={`${btnPrimary} flex-1`}>Índice</Link>
          )}
        </div>
      </div>}
    </BookScreen>
  );
}

function BlockView({ b }: { b: Block }) {
  const body = "text-base font-normal tracking-tight text-piedra";
  switch (b.type) {
    case "h":
      return <h2 className="text-lg font-semibold tracking-tight text-carbon">{b.text}</h2>;
    case "ejemplo":
      return <p className={`${body} border-l-2 border-salvia pl-4`}>{b.text}</p>;
    case "cierre":
      return (
        <div className="rounded-2xl border border-carbon-10/10 p-5">
          <p className="mb-3 font-semibold text-carbon">Cierre del módulo: lo que te llevás</p>
          <ul className={`${body} list-disc space-y-2 pl-5`}>{b.items.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      );
    case "lista":
      return (
        <div className={body}>
          <p>{b.intro}</p>
          <ol className="list-decimal pl-4">{b.items.map((item) => <li key={item}>{item}</li>)}</ol>
          <p>{b.outro}</p>
        </div>
      );
    case "ejercicio":
      return (
        <div className="rounded-2xl bg-avena/60 p-5">
          <p className="mb-2 font-semibold text-carbon">{b.title ?? "Ejercicio de cierre de módulo"}</p>
          <p className="text-base tracking-tight text-carbon">{b.text}</p>
        </div>
      );
    default:
      return (
        <p className={body}>
          {b.lead && <strong className="font-semibold text-carbon">{b.lead} </strong>}
          {b.text}
        </p>
      );
  }
}
