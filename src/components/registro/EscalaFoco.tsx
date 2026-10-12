import type { CSSProperties } from "react";

/** The Figma scale shared by daily focus and the module-four presence rating. */
export function EscalaFoco({ value, onChange, label }: { value: number | null; onChange: (value: number) => void; label: string }) {
  const position = ((value ?? 1) - 1) / 9;
  return (
    <div className="escala-foco relative h-[42px] w-full self-stretch overflow-hidden rounded-full bg-carbon-10/[0.03]" data-value={value ?? ""} style={{ "--scale-position": position } as CSSProperties}>
      {value !== null && <div className="escala-foco-fill pointer-events-none absolute bottom-[5px] left-[5px] top-[5px] rounded-full bg-salvia/20" />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[5px] right-[5px] flex items-center justify-between">
        {Array.from({ length: 10 }, (_, i) => <span key={i} className="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-normal text-carbon-10/10">{i + 1}</span>)}
      </div>
      {value !== null && <span aria-hidden="true" className="escala-foco-thumb pointer-events-none absolute top-[5px] flex h-8 w-8 items-center justify-center rounded-full bg-salvia text-base font-semibold leading-none text-tiza">{value}</span>}
      <input aria-label={label} aria-valuetext={value === null ? "Sin calificar" : `${value} de 10`} type="range" min={1} max={10} step={1} value={value ?? 1}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const position = Math.max(0, Math.min(1, (e.clientX - bounds.left - 16) / (bounds.width - 32)));
          onChange(Math.round(position * 9) + 1);
        }}
        className="absolute inset-y-0 left-[5px] z-10 m-0 h-[42px] w-[calc(100%-10px)] cursor-pointer appearance-none bg-transparent opacity-0" />
    </div>
  );
}