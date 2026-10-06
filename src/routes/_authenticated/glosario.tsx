import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { TERMINOS, type Termino } from "@/lib/glosario";
import searchIcon from "@/assets/search.png.asset.json";

export const Route = createFileRoute("/_authenticated/glosario")({
  head: () => meta("Glosario de Términos", "Conceptos de neurociencia y psicología junguiana del libro Neurohack 21."),
  component: GlosarioDeTrminos,
});

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function distancia(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length]!;
}

function coincide(t: Termino, q: string) {
  return norm(t.nombre).includes(q) || (t.sub ? norm(t.sub).includes(q) : false);
}

function sugerencias(q: string): Termino[] {
  const puntaje = (t: Termino) => {
    const enDef = norm(t.def).includes(q) ? -100 : 0;
    const palabras = norm(`${t.nombre} ${t.sub ?? ""}`).split(/[^a-z0-9]+/).filter(Boolean);
    const min = Math.min(...palabras.map((p) => distancia(q, p.slice(0, Math.max(q.length, p.length)))));
    return enDef + min;
  };
  return [...TERMINOS].sort((a, b) => puntaje(a) - puntaje(b)).slice(0, 3);
}

function Nota({ t }: { t: Termino }) {
  const partes: ReactNode[] = [];
  const re = /Módulo (\d)|Guiones Listos para Proteger tu Foco/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t.nota))) {
    partes.push(t.nota.slice(last, m.index));
    partes.push(
      m[1] ? (
        <Link key={m.index} to="/indice/$seccion" params={{ seccion: `modulo-${m[1]}` }} className="underline underline-offset-2">
          {m[0]}
        </Link>
      ) : (
        <Link key={m.index} to="/guiones" className="underline underline-offset-2">
          {m[0]}
        </Link>
      ),
    );
    last = m.index + m[0].length;
  }
  partes.push(t.nota.slice(last));
  const sinInline = last === 0;
  return (
    <p className="text-xs font-normal text-left text-piedra tracking-tight self-stretch h-fit">
      {partes}
      {sinInline &&
        t.links.map((l) =>
          l.to === "/guiones" ? (
            <Link key={l.to} to="/guiones" className="ml-1 underline underline-offset-2">{l.label}</Link>
          ) : (
            <Link key={l.to} to="/indice/$seccion" params={{ seccion: l.to.replace("/indice/", "") }} className="ml-1 underline underline-offset-2">
              {l.label.replace("Ir al ", "")}
            </Link>
          ),
        )}
    </p>
  );
}

function GlosarioDeTrminos() {
  const [query, setQuery] = useState("");
  const [abierto, setAbierto] = useState<string | null>(TERMINOS[0]?.id ?? null);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const q = norm(query);

  const match = useMemo(() => (q ? TERMINOS.find((t) => norm(t.nombre).startsWith(q)) ?? TERMINOS.find((t) => coincide(t, q)) : undefined), [q]);
  const sinResultados = q.length > 0 && !match;

  useEffect(() => {
    if (!match) return;
    const id = setTimeout(() => {
      setAbierto(match.id);
      requestAnimationFrame(() => refs.current[match.id]?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }, 250);
    return () => clearTimeout(id);
  }, [match]);

  const elegir = (t: Termino) => {
    setQuery(t.nombre);
    setAbierto(t.id);
  };

  return (
    <BookScreen fill>
      <TopBar />
      <div className="flex flex-col gap-10 items-center self-stretch h-fit py-2.5">
        <div className="flex flex-col gap-2.5 items-center w-fit h-fit bg-carbon-10/10 rounded-full py-2 px-4">
          <h1 className="text-base font-semibold text-center text-salvia leading-none self-stretch h-fit">Glosario de Términos</h1>
        </div>
      </div>

      <div className="mt-2.5 flex flex-col gap-5 items-start self-stretch flex-1">
        <label className="sticky top-[78px] z-10 flex flex-row justify-end items-center self-stretch h-fit bg-white dark:bg-tiza rounded-[10px] border border-carbon-10/10 p-2.5 overflow-hidden">
          <div className="flex flex-col gap-2.5 justify-end items-center flex-1 h-fit p-1">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              aria-label="Buscar un término"
              className="w-full bg-transparent text-sm font-normal text-left text-carbon tracking-tight outline-none placeholder:text-carbon-10/10 [&::-webkit-search-cancel-button]:hidden"
            />
          </div>
          <span
            aria-hidden="true"
            className="block w-6 h-6 shrink-0 bg-piedra"
            style={{ maskImage: `url(${searchIcon.url})`, WebkitMaskImage: `url(${searchIcon.url})`, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
          />
        </label>

        {sinResultados ? (
          <>
            <div className="flex flex-col gap-10 items-center self-stretch flex-1 py-10 px-2.5">
              <div className="flex flex-col gap-2.5 items-start self-stretch h-fit">
                <p className="text-[22px] font-normal text-left text-piedra leading-[1.1] tracking-[-1.00px] self-stretch h-fit">
                  No encontramos &quot;{query.trim()}&quot;
                </p>
                <p className="text-base font-normal text-left text-piedra tracking-tight self-stretch h-fit">Probá con otra palabra o escribilo de otra forma.</p>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-2.5 items-start self-stretch h-fit border-t border-carbon-10/10 py-5 px-2.5">
              <p className="text-lg font-semibold text-left text-carbon leading-[1.1] tracking-tight self-stretch h-fit">¿Buscabas alguno de estos?</p>
              <div className="flex flex-row gap-2.5 items-start flex-wrap self-stretch h-fit py-2.5">
                {sugerencias(q).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => elegir(t)}
                    className="flex flex-col gap-2.5 items-center w-fit h-fit rounded-full border border-salvia py-2 px-4 text-base font-semibold text-center text-salvia tracking-tight"
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start self-stretch h-fit">
            {TERMINOS.map((t) => {
              const open = abierto === t.id;
              return (
                <div
                  key={t.id}
                  ref={(el) => {
                    refs.current[t.id] = el;
                  }}
                  className="scroll-mt-[150px] flex flex-col items-start self-stretch h-fit border-b border-carbon-10/10 pt-2.5 pr-2.5 pb-5 pl-2.5 mt-2.5"
                >
                  <button
                    type="button"
                    onClick={() => setAbierto(open ? null : t.id)}
                    aria-expanded={open}
                    className={`self-stretch text-left transition-all duration-300 ${open ? "text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]" : "text-lg font-semibold text-salvia leading-[1.1] tracking-tight"}`}
                  >
                    {t.nombre}
                  </button>
                  <div className={`grid self-stretch transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-2.5 pt-2.5">
                        {t.sub && <p className="text-lg font-semibold text-left text-piedra leading-[1.1] tracking-tight">{t.sub}</p>}
                        <p className="text-base font-normal text-left text-piedra tracking-tight">{t.def}</p>
                        <Nota t={t} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BookScreen>
  );
}
