import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
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
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const fade = `transition-opacity duration-300 ${leaving || !entered ? "opacity-0" : "opacity-100"}`;

  // Fade out al salir: el contenido se desvanece, recién entonces se navega
  // (con scroll instantáneo a top mientras está invisible, sin scroll up).
  const goNext = (seccion?: string) => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      if (seccion) void navigate({ to: "/indice/$seccion", params: { seccion } });
      else void navigate({ to: "/indice" });
    }, 300);
  };

  useEffect(() => {
    setEntered(true);
  }, []);

  useEffect(() => {
    void supabase.rpc("set_last_read", { _slug: p.slug });
  }, [p.slug]);


  if (p.kind === "parte") {
    return (
      <BookScreen fill>
        <div className={`flex w-full flex-1 flex-col gap-5 ${fade}`}>
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
          <button type="button" onClick={() => goNext(p.firstSlug)} className={`${btnPrimary} w-full`}>Continuar</button>
        </div>
      </BookScreen>
    );
  }

  return (
    <BookScreen>
      <div className={`flex w-full flex-col gap-5 ${fade}`}>
        <TopBar />
        <ProgressBar value={(i + 1) / LIBRO.length} />
        <article className="flex flex-col gap-10 self-stretch py-5">
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
            groupParagraphs(p.blocks)
          )}
        </article>
        {next ? (
          <button type="button" onClick={() => goNext(next.slug)} className={`${btnPrimary} w-full`}>Siguiente</button>
        ) : (
          p.slug !== "prologo" && <button type="button" onClick={() => goNext()} className={`${btnPrimary} w-full`}>Índice</button>
        )}
      </div>
    </BookScreen>
  );
}

function groupParagraphs(blocks: Block[]) {
  const nodes: ReactNode[] = [];
  // Grupo = subtítulo ("h") + los párrafos que le siguen; se renderiza en un
  // contenedor con gap-5 (20 px) para que el subtítulo quede a 20 px del
  // primer párrafo. Entre grupos/elementos se aplica el gap-10 (40 px) del article.
  let grupo: { b: Block; idx: number }[] | null = null;
  const flush = () => {
    if (!grupo) return;
    if (grupo.length === 1) {
      nodes.push(<BlockView key={grupo[0]!.idx} b={grupo[0]!.b} />);
    } else {
      nodes.push(
        <div key={`pg-${grupo[0]!.idx}`} className="flex flex-col gap-5">
          {grupo.map(({ b, idx }) => (
            <BlockView key={idx} b={b} />
          ))}
        </div>
      );
    }
    grupo = null;
  };
  blocks.forEach((b, idx) => {
    // "p" y "ejemplo" comparten grupo: la tarjeta de Ejemplo práctico queda a
    // 20 px del párrafo anterior (mismo contenedor gap-5).
    if ((b.type === "p" || b.type === "ejemplo") && grupo) {
      grupo.push({ b, idx });
    } else if (b.type === "h") {
      flush();
      grupo = [{ b, idx }];
    } else if (b.type === "p" || b.type === "ejemplo") {
      grupo = [{ b, idx }];
    } else {
      flush();
      nodes.push(<BlockView key={idx} b={b} />);
    }
  });
  flush();
  return nodes;
}

function anchorId(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function BlockView({ b }: { b: Block }) {
  const body = "text-base font-normal tracking-tight text-piedra";
  switch (b.type) {
    case "h":
      return <h2 id={anchorId(b.text)} style={{ scrollMarginTop: "40px" }} className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{b.text}</h2>;
    case "sumario":
      return (
        <div className="flex flex-col rounded-[10px] bg-carbon/3 p-3.5">
          <p className="py-1 text-sm font-normal tracking-tight text-piedra">En este módulo:</p>
          {b.items.map((item, n) => (
            <div key={item} className="border-b border-carbon-10/10 py-3.5">
              <a href={`#${anchorId(item)}`} className="flex flex-row items-start gap-0.5 pl-4 text-lg font-normal leading-[1.1] tracking-tight text-piedra transition-colors hover:text-carbon">
                <span>{n + 1}.</span>
                <span>{item}</span>
              </a>
            </div>
          ))}
        </div>
      );
    case "ejemplo": {
      const renderText = () => {
        if (!b.links || b.links.length === 0) return b.text;
        const parts: ReactNode[] = [];
        let rest = b.text;
        let key = 0;
        for (const link of b.links) {
          const i = rest.indexOf(link.text);
          if (i < 0) continue;
          if (i > 0) parts.push(rest.slice(0, i));
          parts.push(
            <Link key={key++} to={link.to} className="underline underline-offset-2 hover:text-carbon">
              {link.text}
            </Link>
          );
          rest = rest.slice(i + link.text.length);
        }
        if (rest) parts.push(rest);
        return parts;
      };
      return (
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
          <p className="text-base font-bold tracking-tight text-carbon">{b.title ?? "Ejemplo práctico"}</p>
          <p className="text-base font-normal tracking-tight text-piedra">{renderText()}</p>
        </div>
      );
    }
    case "cierre":
      return (
        <div className="flex flex-col gap-5 border-t border-carbon-10/10 pt-10">
          <h2 className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">Cierre del módulo: lo que te llevás</h2>
          <div className="flex flex-col gap-4">
            {b.items.map((t) => (
              <div key={t} className="flex flex-row items-start gap-1">
                <div className="flex h-5 w-5 flex-row items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-salvia" />
                </div>
                <p className="flex-1 text-base font-normal tracking-tight text-piedra">{t}</p>
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
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
          <p className="text-base font-bold tracking-tight text-carbon">{b.title ?? "Ejercicio de cierre de módulo"}</p>
          <p className="text-base font-normal tracking-tight text-piedra">{b.text}</p>
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
