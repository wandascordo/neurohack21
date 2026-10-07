import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Briefcase, CircleCheck, Copy, HouseHeart, SmilePlus, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { GUIONES, type CategoriaGuiones, type Guion } from "@/lib/guiones";

export const Route = createFileRoute("/_authenticated/guiones")({
  head: () => meta("Guiones para Proteger tu Foco", "Mensajes listos para cuidar tu atención en el trabajo, en casa, en redes y con vos."),
  component: GuionesParaProtegerTuFoco,
});

const ICONOS: Record<CategoriaGuiones["id"], ComponentType<{ className?: string; strokeWidth?: number }>> = {
  trabajo: Briefcase,
  hogar: HouseHeart,
  social: UsersRound,
  yo: SmilePlus,
};

function TextoGuion({ texto }: { texto: string }) {
  const partes = texto.split(/(\[[^\]]*\])/g);
  return (
    <p className="text-lg font-normal text-left text-carbon leading-[1.1] tracking-tight self-stretch h-fit">
      {partes.map((p, i) => (p.startsWith("[") && p.endsWith("]") ? <span key={i} className="font-normal text-piedra">{p}</span> : p))}
    </p>
  );
}

async function copiar(texto: string) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error();
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

function Tarjeta({ g, copiable }: { g: Guion; copiable: boolean }) {
  const [ok, setOk] = useState(false);
  const t = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(t.current), []);
  const onCopy = async () => {
    if (await copiar(g.texto)) {
      setOk(true);
      toast.success("Copiado");
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setOk(false), 2000);
    } else {
      toast.error("No pudimos copiar. Mantené presionado el texto para copiarlo.");
    }
  };
  return (
    <div className="flex touch-pan-y flex-col items-end self-stretch h-fit bg-blanco rounded-[10px] border border-carbon-10/10 p-2.5 overflow-clip">
      <div className="flex flex-col gap-2.5 justify-end items-center self-stretch h-fit p-1">
        <p className="text-xs font-normal text-left text-piedra tracking-tight self-stretch h-fit">{g.situacion}</p>
        <TextoGuion texto={g.texto} />
      </div>
      {copiable && (
        <button
          type="button"
          onClick={onCopy}
          aria-label={ok ? "Copiado" : "Copiar guion"}
          className="flex flex-row justify-center items-center w-[30px] h-[30px] bg-salvia rounded p-1 text-tiza"
        >
          {ok ? <CircleCheck className="h-5 w-5" strokeWidth={1.5} /> : <Copy className="h-[18px] w-[18px]" strokeWidth={1.75} />}
        </button>
      )}
    </div>
  );
}

function GuionesParaProtegerTuFoco() {
  const [activa, setActiva] = useState<CategoriaGuiones["id"]>("trabajo");
  const cat = GUIONES.find((c) => c.id === activa) ?? GUIONES[0];
  if (!cat) return null;
  return (
    <BookScreen fill>
      <TopBar />
      <div className="flex flex-col gap-10 items-center self-stretch h-fit py-2.5">
        <div className="flex select-none flex-col gap-2.5 items-center w-fit h-fit bg-carbon-10/10 rounded-full py-2 px-4">
          <p className="text-base font-semibold text-center text-salvia leading-none self-stretch h-fit">Guiones para Proteger tu Foco</p>
        </div>
      </div>
      <div key={cat.id} className="mt-2.5 flex flex-col gap-2.5 items-start self-stretch flex-1 animate-fade-in pb-[100px]">
        <div className="flex flex-col gap-2.5 items-start self-stretch h-fit py-2.5">
          <p className="text-base font-semibold text-left text-piedra leading-none self-stretch h-fit">{cat.categoria}</p>
          <p className="text-[28px] font-normal text-left text-carbon leading-[1.1] tracking-[-1.50px] self-stretch h-fit">
            {cat.titulo}
            {cat.subtitulo && <span className="ml-1.5 text-sm tracking-tight">{cat.subtitulo}</span>}
          </p>
        </div>
        {cat.guiones.map((g) => (
          <Tarjeta key={g.situacion} g={g} copiable={cat.copiable} />
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[117px] bg-gradient-to-t from-tiza to-tiza/0" />
      <nav className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-[calc(100%-20px)] max-w-[380px] flex-row gap-2.5 items-start bg-tiza rounded-full border border-carbon-10/10 p-2.5">
        {GUIONES.map((c) => {
          const Icono = ICONOS[c.id];
          const sel = c.id === activa;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={sel}
              onClick={() => {
                setActiva(c.id);
                window.scrollTo({ top: 0 });
              }}
              className={`flex flex-col gap-0.5 justify-center items-center flex-1 h-[60px] rounded-full p-4 overflow-hidden transition-colors ${sel ? "bg-salvia text-tiza" : "bg-carbon-10/10 text-piedra"}`}
            >
              <Icono className="h-6 w-6 shrink-0" strokeWidth={1.5} />
              <span className="text-xs font-normal text-center tracking-tight whitespace-nowrap">{c.tab}</span>
            </button>
          );
        })}
      </nav>
    </BookScreen>
  );
}
