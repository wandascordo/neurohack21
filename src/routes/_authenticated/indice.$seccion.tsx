import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Placeholder } from "@/components/Placeholder";
import { BackButton, BookScreen, ProgressBar, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { Recapitulando, SemanaView } from "@/components/libro/Reto";
import { InstructivoLink } from "@/components/libro/InstructivoModal";
import { LIBRO, type Block } from "@/lib/libro";
import parte1Illustration from "@/assets/parte-1-illustration.svg.asset.json";
import parte2Illustration from "@/assets/parte-2-illustration.svg.asset.json";
import parte3Illustration from "@/assets/parte-3.png.asset.json";
import parte4Illustration from "@/assets/parte-4.png.asset.json";
import conclusionesIllustration from "@/assets/conclusiones.png.asset.json";

const parteIllustrations: Record<string, string> = {
  "parte-1": parte1Illustration.url,
  "parte-2": parte2Illustration.url,
  "parte-3": parte3Illustration.url,
  "parte-4": parte4Illustration.url,
  conclusiones: conclusionesIllustration.url,
};

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

  // La ruta reutiliza el componente al cambiar de sección: reiniciar el fade.
  useEffect(() => {
    setLeaving(false);
    setEntered(false);
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setEntered(true)),
    );
    return () => window.cancelAnimationFrame(id);
  }, [p.slug]);

  useEffect(() => {
    void supabase.rpc("set_last_read", { _slug: p.slug });
  }, [p.slug]);


  if (p.kind === "parte") {
    return (
      <BookScreen fill>
        <TopBar />
        <div className={`flex w-full flex-1 flex-col gap-5 ${fade}`}>
          <div className="flex flex-1 flex-col items-center justify-between self-stretch py-[50px]">
            <div className="flex h-fit flex-col items-center gap-2.5 self-stretch">
              <p className={`self-stretch text-left text-base font-semibold leading-none ${p.slug === "conclusiones" ? "text-piedra" : "text-carbon"}`}>{p.eyebrow}</p>
              <h1 className="self-stretch text-left text-4xl font-normal leading-[1.1] tracking-[-2.00px] text-carbon">{p.titulo}</h1>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center self-stretch">
              {p.slug === "conclusiones" ? (
                <div className="flex flex-col items-center justify-center self-stretch py-[60px] pr-[60px]">
                  <img className="-ml-5 h-[250px] w-[calc(100%+1.25rem)] max-w-none object-contain object-left dark:invert" src={parteIllustrations[p.slug]} alt="" />
                </div>
              ) : parteIllustrations[p.slug] && (
                <img
                  className="-mx-5 h-[200px] w-[calc(100%+2.5rem)] max-w-none object-cover dark:invert"
                  src={parteIllustrations[p.slug]}
                  alt=""
                />
              )}
            </div>
          </div>
          <button type="button" onClick={() => goNext(p.firstSlug)} className={`${btnPrimary} w-full`}>Continuar</button>
        </div>
      </BookScreen>
    );
  }

  return (
    <BookScreen>
      <TopBar />
      <div className={`flex w-full flex-col gap-5 ${fade}`}>
        <ProgressBar value={(i + 1) / LIBRO.length} />
        {prev && <BackButton label="Módulo anterior" onClick={() => goNext(prev.slug)} />}
        <article className={`flex flex-col self-stretch py-5 ${p.kind === "reto" && p.vista === "recap" ? "gap-5" : "gap-10"}`}>
          <div className="flex flex-col gap-2.5">
            <p className="text-base font-semibold leading-none text-piedra">
              {p.eyebrow.includes(" / ") ? (
                (() => {
                  const sep = p.eyebrow.lastIndexOf(" / ");
                  return (
                    <>
                      {p.eyebrow.slice(0, sep)}
                      {" / "}
                      {(() => {
                        const tail = p.eyebrow.slice(sep + 3);
                        const k = tail.indexOf(" (");
                        return k < 0 ? (
                          <span className="text-carbon">{tail}</span>
                        ) : (
                          <span className="text-carbon">{tail.slice(0, k)}<span className="font-normal">{tail.slice(k)}</span></span>
                        );
                      })()}
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
            p.vista === "recap" ? <Recapitulando /> : <SemanaView numero={p.vista} />
          ) : (
            groupParagraphs(p.blocks)
          )}
        </article>
        {p.kind === "modulo" && p.autoevaluacion && (
          <Link to="/autoevaluacion" className="flex h-fit w-full flex-row items-center justify-center gap-2.5 overflow-hidden rounded-full bg-carbon-10/10 px-6 py-4 text-center text-base font-semibold uppercase leading-none text-piedra">Realizar Autoevaluación de Foco</Link>
        )}
        {next ? (
          <button type="button" onClick={() => goNext(next.slug)} className={`${btnPrimary} w-full`}>{p.kind === "reto" && p.vista === "recap" ? "Continuar" : "Siguiente"}</button>
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
    // Párrafos, pasos y ejemplos comparten el ritmo interno de 20 px.
    if ((b.type === "p" || b.type === "ejemplo" || b.type === "pasos" || b.type === "bullets") && grupo) {
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

function withLinks(text: string, links?: { text: string; to: string }[]): ReactNode {
  if (!links || links.length === 0) return text;
  const parts: ReactNode[] = [];
  let rest = text;
  let key = 0;
  for (const link of links) {
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
}

function BlockView({ b }: { b: Block }) {
  const body = "text-base font-normal tracking-tight text-piedra";
  switch (b.type) {
    case "h":
      return <h2 id={anchorId(b.text)} style={{ scrollMarginTop: "40px" }} className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{b.text}</h2>;
    case "bullets":
      return (
        <ul className={`list-disc pl-4 ${body} ${b.bold ? "font-semibold" : ""} flex flex-col gap-2.5`}>
          {b.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );

    case "senales":
      return (
        <ul className="flex list-disc flex-col gap-5 pl-4 tracking-tight text-piedra">
          {b.items.map((it) => (
            <li key={it.title}>
              <p className="text-base font-semibold">{it.title}</p>
              <p className="text-sm font-normal">{it.text}</p>
            </li>
          ))}
        </ul>
      );
    case "ritual":
      return (
        <div className="flex flex-col pl-2.5">
          {b.grupos.map((g, n) => (
            <div key={g.label} className="flex flex-col gap-2.5 border-l-2 border-carbon-10/10 py-1 pl-3.5">
              <p className="text-sm font-normal tracking-tight text-piedra">{g.label}</p>
              <ol start={n + 1} className="list-decimal pl-4 text-base font-normal tracking-tight text-piedra">
                <li>{g.item}</li>
              </ol>
            </div>
          ))}
        </div>
      );
    case "sumario":
      return (
        <div className="flex flex-col rounded-[10px] bg-carbon/3 p-3.5">
          <p className="py-1 text-sm font-normal tracking-tight text-piedra">En este módulo:</p>
          {b.items.map((item, n) => (
            <div key={item} className="border-b border-carbon-10/10 py-[10px]">
              <a href={`#${anchorId(item)}`} className="flex flex-row items-start gap-0.5 pl-4 text-sm font-normal tracking-tight text-piedra transition-colors hover:text-carbon">
                <span>{n + 1}.</span>
                <span>{item}</span>
              </a>
            </div>
          ))}
        </div>
      );
    case "ejemplo":
      return (
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
          <p className="text-base font-bold tracking-tight text-carbon">{b.title ?? "Ejemplo práctico"}</p>
          <p className="text-base font-normal tracking-tight text-piedra">{withLinks(b.text, b.links)}</p>
          {b.extra && <p className="text-base font-normal tracking-tight text-piedra">{b.extra}</p>}
        </div>
      );

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
              <p className="text-base font-normal tracking-tight text-piedra">{withLinks(b.ejercicio, b.ejercicioLinks)}</p>
                {b.ejercicioExtra && <p className="text-base font-normal tracking-tight text-piedra">{b.ejercicioExtra}</p>}
              {b.instructivo && <InstructivoLink />}
            </div>
          )}
        </div>
      );
    case "pasos":
      if (b.card) {
        return (
          <div className="flex flex-col gap-5">
            {b.items.map((item) => (
              <div key={item.title} className="flex flex-col gap-2.5 rounded-[10px] border border-carbon-10/10 p-3.5">
                <h3 className="text-base font-bold tracking-tight text-carbon">
                  {item.title.includes(" / ") ? (() => {
                    const sep = item.title.lastIndexOf(" / ");
                    return (
                      <>
                        {item.title.slice(0, sep)}
                        <span className="text-piedra"> {item.title.slice(sep + 1)}</span>
                      </>
                    );
                  })() : item.title}
                </h3>
                {item.paragraphs.map((paragraph) => <p key={paragraph} className={body}>{paragraph}</p>)}
              </div>
            ))}
          </div>
        );
      }
      return (
        <ol className="flex flex-col gap-5">
          {b.items.map((item, index) => (
            <li key={item.title} className="flex flex-col gap-2.5">
              <h3 className="pl-4 text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{index + 1}. {item.title}</h3>
              <div className="flex flex-col gap-2.5 pl-4">
                {item.paragraphs.map((paragraph) => <p key={paragraph} className={body}>{paragraph}</p>)}
              </div>
            </li>
          ))}
        </ol>
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
          {withLinks(b.text, b.links)}
        </p>
      );
  }
}
