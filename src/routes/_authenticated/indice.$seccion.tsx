import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Placeholder } from "@/components/Placeholder";
import { BookScreen, ProgressBar, TopBar, btnPrimary } from "@/components/libro/BookChrome";
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
  const next = LIBRO[i + 1];

  useEffect(() => {
    void supabase.rpc("set_last_read", { _slug: p.slug });
  }, [p.slug]);


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
            <p className="text-base font-semibold leading-none text-piedra">
              {p.eyebrow.includes(" / ") ? (
                (() => {
                  const sep = p.eyebrow.lastIndexOf(" / ");
                  return (
                    <>
                      {p.eyebrow.slice(0, sep)}
                      {" / "}
                      <span className="text-carbon">{p.eyebrow.slice(sep + 3)}</span>
                    </>
                  );
                })()
              ) : (
                p.eyebrow
              )}
            </p>
            <h1 className="text-4xl font-normal leading-[1.1] tracking-[-2.00px] text-carbon">{p.titulo}</h1>
            {"tiempo" in p && p.tiempo && (
              <p className="text-sm font-normal tracking-tight text-piedra">Tiempo de lectura: {p.tiempo}</p>
            )}
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
        {next ? (
          <Link to="/indice/$seccion" params={{ seccion: next.slug }} className={`${btnPrimary} w-full`}>Siguiente</Link>
        ) : (
          p.slug !== "prologo" && <Link to="/indice" className={`${btnPrimary} w-full`}>Índice</Link>
        )}
      </div>
    </BookScreen>
  );
}

function BlockView({ b }: { b: Block }) {
  const body = "text-base font-normal tracking-tight text-piedra";
  switch (b.type) {
    case "h":
      return <h2 className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{b.text}</h2>;
    case "sumario":
      return (
        <div className="flex flex-col rounded-[10px] bg-carbon/3 p-3.5">
          <p className="py-1 text-sm font-normal tracking-tight text-piedra">En este módulo:</p>
          {b.items.map((item, idx) => (
            <div key={item} className={`py-3.5 ${idx < b.items.length - 1 ? "border-t border-carbon-10/10" : ""}`}>
              <ol className="list-decimal pl-4 text-lg font-semibold leading-[1.1] tracking-tight text-piedra">
                <li>{item}</li>
              </ol>
            </div>
          ))}
        </div>
      );
    case "ejemplo":
      return (
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
          <p className="text-base font-bold tracking-tight text-carbon">{b.title ?? "Ejemplo práctico"}</p>
          <p className="text-base font-normal tracking-tight text-piedra">{b.text}</p>
        </div>
      );
    case "cierre":
      return (
        <div className="flex flex-col gap-5 border-t border-piedra pt-10">
          <h2 className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">Cierre del módulo: lo que te llevás</h2>
          <div className="flex flex-col gap-4">
            {b.items.map((t) => (
              <div key={t} className="flex flex-row items-start gap-1">
                <div className="flex h-5 w-5 flex-row items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-salvia" />
                </div>
                <p className="flex-1 text-base font-semibold tracking-tight text-piedra">{t}</p>
              </div>
            ))}
          </div>
          {b.ejercicio && (
            <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
              <p className="text-base font-bold tracking-tight text-carbon">Ejercicio de cierre de módulo</p>
              <p className="text-base font-normal tracking-tight text-piedra">{b.ejercicio}</p>
            </div>
          )}
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
