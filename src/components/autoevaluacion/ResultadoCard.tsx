import chevron from "@/assets/ob-chevron.png.asset.json";
import { fechaLarga, hora, rango } from "@/lib/autoevaluacion";

export type RegistroFoco = { id: string; answers: number[]; total_score: number; assessed_at: string };

/** Tarjeta de resultado compartida por "Mis resultados" y el Tracker Visual. */
export function ResultadoCard({ r, onClick }: { r: RegistroFoco; onClick: () => void }) {
  const m = `url(${chevron.url}) center / contain no-repeat`;
  return (
    <button type="button" onClick={onClick} className="flex flex-col gap-1 self-stretch rounded-[20px] border border-carbon-10/10 bg-tiza p-2.5 text-left">
      <div className="flex items-center gap-2.5 p-1">
        <p className="flex-1 text-sm tracking-tight text-piedra">{fechaLarga(r.assessed_at)}, {hora(r.assessed_at)} hs</p>
        <span aria-hidden className="block h-6 w-6 shrink-0 bg-piedra" style={{ mask: m, WebkitMask: m }} />
      </div>
      <div className="flex flex-col gap-2.5 rounded-[10px] bg-carbon/[0.03] p-3.5">
        <div className="flex items-center gap-2.5">
          <p className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">{r.total_score} puntos</p>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-carbon-10/10">
            <div className="h-full rounded-full bg-salvia" style={{ width: `${(r.total_score / 50) * 100}%` }} />
          </div>
        </div>
        <p className="text-xs tracking-tight text-carbon">{rango(r.total_score).titular}</p>
      </div>
    </button>
  );
}
