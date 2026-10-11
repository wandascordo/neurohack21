import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckLleno } from "@/components/registro/RegistroUI";
import { notasQuery } from "@/lib/notas";
import { supabase } from "@/integrations/supabase/client";
import { diaConfig, textoRespuesta, type DiaConfig, type LogDia } from "@/lib/registro";

export function ReferenciasDia({ cfg, logs }: { cfg: DiaConfig; logs: LogDia[] }) {
  const { data: notas = [] } = useQuery({ ...notasQuery, enabled: !!cfg.referencias?.some((r) => r.tipo === "nota") });
  if (!cfg.referencias?.length) return null;
  return (
    <details className="group flex flex-col self-stretch">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-piedra [&::-webkit-details-marker]:hidden">
        Referencia <ChevronDown className="h-5 w-5 group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <div className="flex flex-col gap-5 pt-2.5">
        {cfg.referencias.map((ref, i) => {
          const textos: { titulo: string; texto: string }[] = [];
          if (ref.tipo === "nota") {
            const texto = notas.find((n) => n.field_key === ref.key)?.value_text;
            if (texto?.trim()) textos.push({ titulo: ref.titulo, texto });
          } else {
            const dias = ref.tipo === "dias" ? ref.dias : [ref.dia];
            for (const n of dias) {
              const log = logs.find((l) => l.day_number === n);
              if (!log) continue;
              const preguntas = diaConfig(n).preguntas.filter((p) => ref.tipo === "dias" || p.id === ref.preguntaId);
              const texto = preguntas.flatMap((p) => textoRespuesta(p, log.responses[p.id])).join("\n\n");
              if (texto) textos.push({ titulo: `Día ${n}`, texto });
            }
          }
          return (
            <div key={i} className="flex flex-col gap-2.5">
              <p className="text-sm text-piedra">{ref.titulo}</p>
              {textos.length ? textos.map((t) => (
                <div key={t.titulo} className="flex flex-col gap-1 rounded-[10px] bg-carbon/[0.04] p-2.5">
                  {ref.tipo === "dias" && <p className="text-xs text-piedra">{t.titulo}</p>}
                  <p className="whitespace-pre-wrap text-base text-carbon">{t.texto}</p>
                </div>
              )) : (
                <p className="text-sm text-piedra">Todavía no escribiste esta nota. Podés encontrarla o crearla en <Link to="/registro-diario/notas" className="text-salvia underline underline-offset-2">Mis notas</Link>.</p>
              )}
            </div>
          );
        })}
      </div>
    </details>
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
