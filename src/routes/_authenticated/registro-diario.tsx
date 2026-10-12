import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NotebookPen, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { meta } from "@/components/Placeholder";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { CirculoDia, Pill, RegistroBottomNav } from "@/components/registro/RegistroUI";
import { INSTRUCTIVO_PDF, cargarFeedback, cargarAvisoOculto, ocultarAviso, ultimoCompletado, diaActual, estadoDe, guardarFeedback, logsQuery, type LogDia } from "@/lib/registro";

export const Route = createFileRoute("/_authenticated/registro-diario")({
  head: () => meta("Registro Diario de 21 Días", "Registrá tu práctica y reflexión de cada día del reto."),
  component: RegistroInicio,
});

const SEMANAS = [
  { titulo: "Desprogramar", sub: "Semana 1", dias: [1, 2, 3, 4, 5, 6, 7] },
  { titulo: "Reprogramar", sub: "Semana 2", dias: [8, 9, 10, 11, 12, 13, 14] },
  { titulo: "Integrar", sub: "Semana 3", dias: [15, 16, 17, 18, 19, 20, 21] },
];

function Estrellas() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["registro-feedback"], queryFn: cargarFeedback });
  const [val, setVal] = useState<number | null>(null);
  useEffect(() => setVal(data ?? null), [data]);
  const elegir = async (r: number) => {
    const prev = val;
    setVal(r);
    try {
      await guardarFeedback(r);
      void qc.invalidateQueries({ queryKey: ["registro-feedback"] });
    } catch {
      setVal(prev);
      toast.error("No pudimos guardar tu calificación. Probá de nuevo.");
    }
  };
  return (
    <div className="flex flex-row gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((r) => {
        const on = val !== null && r <= val;
        return (
          <button key={r} type="button" aria-label={`${r} de 5`} aria-pressed={on} onClick={() => elegir(r)} className="p-0.5">
            <Star className={`h-6 w-6 ${on ? "fill-salvia text-salvia" : "text-piedra/40"}`} strokeWidth={1.5} />
          </button>
        );
      })}
    </div>
  );
}

function ReglaDeOro({ logs }: { logs: LogDia[] }) {
  const qc = useQueryClient();
  const { data: oculto, isSuccess } = useQuery({ queryKey: ["registro-aviso-oculto"], queryFn: cargarAvisoOculto });
  const [cerrado, setCerrado] = useState<string | null>(null);
  const [ahora, setAhora] = useState(0);
  useEffect(() => {
    setAhora(Date.now());
    const timer = window.setInterval(() => setAhora(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const ultimo = ultimoCompletado(logs);
  if (!isSuccess || !ultimo || !logs.some((l) => l.day_number === 1 && l.status === "completed") || ahora - Date.parse(ultimo) <= 24 * 60 * 60 * 1000 || oculto === ultimo || cerrado === ultimo) return null;
  return (
    <div className="relative flex flex-col gap-1 self-stretch rounded-[10px] border border-carbon-10/10 p-3 pr-9">
      <Button variant="ghost" size="icon" aria-label="Ocultar regla de oro" className="absolute right-1 top-1 h-7 w-7 rounded-full text-piedra hover:bg-carbon-10/[0.03] hover:text-piedra" onClick={async () => {
        setCerrado(ultimo);
        try {
          await ocultarAviso(ultimo);
          await qc.invalidateQueries({ queryKey: ["registro-aviso-oculto"] });
        } catch {
          setCerrado(null);
          toast.error("No pudimos ocultar el mensaje. Probá de nuevo.");
        }
      }}><X /></Button>
      <p className="text-xs font-normal text-piedra tracking-tight">Regla de oro</p>
      <p className="text-sm text-carbon tracking-tight"><strong className="font-semibold">Faltar un día no reinicia el proceso</strong>, simplemente seguí registrando tu progreso desde donde te quedaste.</p>
    </div>
  );
}

function RegistroInicio() {
  const { data: logs = [] } = useQuery(logsQuery);
  const actual = diaActual(logs);
  const completo = actual > 21;
  return (
    <BookScreen fill>
      <TopBar />
      <Pill />
      <div className="mt-2.5 flex flex-col gap-2.5 self-stretch animate-fade-in">
        <ReglaDeOro logs={logs} />
        <div className="flex flex-col self-stretch py-1">
          {SEMANAS.map((s, i) => (
            <div key={s.titulo} className={`flex flex-col gap-2.5 self-stretch p-2.5 ${i < 2 ? "border-b border-carbon-10/10" : ""}`}>
              <div className="flex flex-row gap-1 items-baseline">
                <p className="text-lg font-semibold text-carbon leading-[1.1] tracking-tight">{s.titulo}</p>
                <p className="text-sm font-normal text-piedra tracking-tight">{s.sub}</p>
              </div>
              <div className="flex flex-row justify-between self-stretch rounded-xl p-1">
                {s.dias.map((n) => (
                  <CirculoDia key={n} n={n} estado={estadoDe(n, logs)} />
                ))}
              </div>
            </div>
          ))}
        </div>
        {completo ? (
          <div className="flex flex-col self-stretch">
            <div className="flex flex-col gap-2 items-center py-10">
              <p className="text-[40px] font-normal text-carbon leading-[1.1] tracking-[-1.5px]">¡Felicitaciones!</p>
              <p className="text-sm text-piedra tracking-tight text-center">Completaste todos los registros diarios del reto</p>
            </div>
            <div className="border-t border-carbon-10/10" />
            <div className="flex flex-col gap-4 items-center py-8">
              <p className="text-base text-carbon tracking-tight">¿Cómo te resultó este reto?</p>
              <Estrellas />
            </div>
          </div>
        ) : (
          <>
            <Link to="/registro-diario/dia/$n" params={{ n: String(actual) }} className={`${btnPrimary} mt-5 self-stretch`}>
              Completar registro de hoy
            </Link>
            <div className="mt-10 flex flex-row gap-2.5 items-start self-stretch rounded-[10px] bg-carbon/[0.04] p-3">
              <NotebookPen className="h-5 w-5 shrink-0 text-piedra" strokeWidth={1.5} />
              <p className="text-sm text-piedra tracking-tight">
                Si preferís lápiz y papel, podés{" "}
                <a href={INSTRUCTIVO_PDF} target="_blank" rel="noopener" className="font-semibold text-salvia underline underline-offset-2">
                  descargar el instructivo
                </a>{" "}
                e imprimirlo, o replicarlo en una hoja.
              </p>
            </div>
          </>
        )}
      </div>
      <RegistroBottomNav />
    </BookScreen>
  );
}
