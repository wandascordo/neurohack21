import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { IconoMascara } from "@/components/IconoMascara";
import stickyNote from "@/assets/registro-sticky-note-02.png.asset.json";
import { CheckLleno } from "@/components/registro/RegistroUI";
import { NOTAS } from "@/lib/notas";
import { supabase } from "@/integrations/supabase/client";
import { diaConfig, textoRespuesta, type DiaConfig, type LogDia } from "@/lib/registro";

const moduloDeNota = (key: string) => {
  const m = /^m(\d+)_/.exec(key)?.[1];
  return m ? Number(m) : null;
};

export function ReferenciasDia({ cfg, logs }: { cfg: DiaConfig; logs: LogDia[] }) {
  const referencias = cfg.referencias ?? [];
  const modulos = [...new Set(referencias.filter((r) => r.tipo === "nota").map((r) => moduloDeNota(r.key)).filter((n): n is number => n != null))];
  const otros = referencias.filter((r) => r.tipo !== "nota");
  if (!modulos.length && !otros.length) return null;
  return (
    <div className="flex flex-col gap-5 self-stretch rounded-[10px] bg-carbon-10/[0.03] p-3 text-sm text-piedra">
      {modulos.map((n) => {
        const titulo = NOTAS.find((x) => x.n === n)?.titulo ?? `Módulo ${n}`;
        return (
          <Link
            key={n}
            to="/registro-diario/notas/modulo/$n"
            params={{ n: String(n) }}
            className="inline-flex w-fit items-center gap-1.5 text-salvia"
          >
            <IconoMascara asset={stickyNote} className="h-[15px] w-[15px] text-piedra" />
            <span className="underline underline-offset-2">
              {titulo} · Módulo {n}
            </span>
          </Link>
        );
      })}
      {otros.map((ref, i) => {
        const textos: { titulo: string; texto: string }[] = [];
        const dias = ref.tipo === "dias" ? ref.dias : [ref.dia];
        for (const n of dias) {
          const log = logs.find((l) => l.day_number === n);
          if (!log) continue;
          const preguntas = diaConfig(n).preguntas.filter((p) => ref.tipo === "dias" || p.id === ref.preguntaId);
          const texto = preguntas.flatMap((p) => textoRespuesta(p, log.responses[p.id])).join("\n\n");
          if (texto) textos.push({ titulo: `Día ${n}`, texto });
        }
        return (
          <div key={i} className="flex flex-col gap-2.5">
            <p className="text-sm text-piedra">{ref.titulo}</p>
            {textos.map((t) => (
              <div key={t.titulo} className="flex flex-col gap-1">
                {ref.tipo === "dias" && <p className="text-xs text-piedra">{t.titulo}</p>}
                <p className="whitespace-pre-wrap text-sm text-piedra">{t.texto}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function AutoevaluacionDia({ cfg }: { cfg: DiaConfig }) {
  const bloque = cfg.autoevaluacion;
  const { data: hecha = false } = useQuery({
    queryKey: ["registro-autoevaluacion", bloque?.moment],
    enabled: !!bloque,
    queryFn: async () => {
      if (!bloque) return false;
      const { data, error } = await supabase.from("focus_assessments").select("id").eq("moment", bloque.moment).limit(1);
      if (error) throw error;
      return !!data?.length;
    },
  });
  if (!bloque) return null;
  return (
    <div className="flex flex-col gap-2.5 self-stretch rounded-[10px] border border-carbon-10/10 p-3.5">
      <div className="flex items-center justify-between gap-2.5">
        <p className="text-sm text-piedra">Autoevaluación</p>
        {hecha && <span className="flex items-center gap-1 text-sm text-salvia"><CheckLleno className="h-5 w-5" />Hecha</span>}
      </div>
      <p className="text-base text-carbon">{bloque.texto}</p>
      <Button asChild variant="ghost" className="h-auto justify-start whitespace-normal p-0 text-left text-base text-salvia hover:bg-transparent hover:text-salvia">
        <Link to="/autoevaluacion">{bloque.boton}</Link>
      </Button>
    </div>
  );
}
