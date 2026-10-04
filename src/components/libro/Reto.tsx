import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { RETO_LINKS, SEMANAS, type RetoDia } from "@/lib/reto";

const body = "text-base font-normal tracking-tight text-piedra";

/** Marcado mínimo: **negrita**, *cursiva*, {Enlace}. */
export function Rich({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\{(.+?)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={k++} className="font-semibold">{m[1]}</strong>);
    else if (m[2]) parts.push(<em key={k++}>{m[2]}</em>);
    else if (m[3]) {
      const to = RETO_LINKS[m[3]];
      parts.push(
        to ? (
          <Link key={k++} to={to} className="font-semibold underline underline-offset-2 hover:text-carbon">{m[3]}</Link>
        ) : (
          m[3]
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const linkSalvia = "text-base font-semibold uppercase leading-none text-salvia underline underline-offset-2";

export function Recapitulando() {
  return (
    <div className="flex flex-col gap-3 self-stretch">
      <p className={body}>Antes de empezar, un recordatorio de la estructura que vimos en el Módulo 6.</p>
      <div className={body}>
        El reto se divide en tres bloques de 7 días:
        <ol className="list-decimal pl-4">
          <li><strong className="font-semibold">Desprogramar</strong> (Días 1 a 7)</li>
          <li><strong className="font-semibold">Reprogramar</strong> (Días 8 a 14)</li>
          <li><strong className="font-semibold">Integrar</strong> (Días 15 a 21)</li>
        </ol>
      </div>
      <p className={body}>Necesitarás entre 15 y 25 minutos diarios, sin interrupciones.</p>
      <div className={body}>
        Cada día combina:
        <ul className="list-disc pl-4">
          <li><strong className="font-semibold">Una práctica corporal breve</strong> (antes de tu primer bloque de trabajo del día)</li>
          <li><strong className="font-semibold">Una reflexión escrita guiada</strong> (escritura de sombra)</li>
          <li><strong className="font-semibold">Un cierre de autoevaluación</strong> de un minuto</li>
        </ul>
      </div>
      <div className={body}>
        La secuencia de respiración de coherencia cardíaca (entre 3 y 5 minutos) es siempre la misma, salvo que se indique otra cosa:
        <ul className="list-disc pl-4">
          <li><strong className="font-semibold">Inhalar 5 segundos por nariz</strong></li>
          <li><strong className="font-semibold">Exhalar 5 segundos por la boca</strong></li>
        </ul>
      </div>
      <p className={body}>
        A continuación veremos qué hacer cada día, pero recordá que todo lo podés realizar dentro de tu <Rich text="{Registro Diario}" />.
      </p>
    </div>
  );
}

function Dia({ d }: { d: RetoDia }) {
  let n = 0;
  return (
    <div className="flex flex-col gap-5 self-stretch">
      <h2 id={`dia-${d.n}`} className="text-[22px] font-normal leading-[1.1] tracking-[-1.00px] text-carbon">Día {d.n}</h2>
      <div className="flex flex-col self-stretch pl-2.5">
        <div className="flex flex-col gap-2.5 border-l-2 border-carbon-10/10 py-1 pl-3.5">
          {d.grupos.map((g) => (
            <div key={g.label} className="flex flex-col gap-2.5">
              <p className="text-sm font-normal tracking-tight text-piedra"><Rich text={g.label} /></p>
              {g.items.map((it) => {
                n += 1;
                return (
                  <ol key={it.text} start={n} className={`list-decimal pl-4 ${body}`}>
                    <li>
                      <Rich text={it.text} />
                      {it.note && (
                        <span className="block text-sm"><Rich text={it.note} /></span>
                      )}
                    </li>
                  </ol>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start gap-5 p-2.5">
        <Link to="/registro-diario" className={linkSalvia}>Mi registro diario</Link>
      </div>
    </div>
  );
}

export function SemanaView({ numero }: { numero: 1 | 2 | 3 }) {
  const s = SEMANAS[numero];
  return (
    <>
      <div className="flex flex-col gap-5 self-stretch">
        <h2 className="text-lg font-semibold leading-[1.1] tracking-tight text-carbon">Objetivo neurológico de la semana</h2>
        {s.objetivo.map((t) => <p key={t} className={body}>{t}</p>)}
        {s.recordatorio && <p className="text-sm font-normal tracking-tight text-piedra">{s.recordatorio}</p>}
      </div>
      {s.diasLista.map((d) => <Dia key={d.n} d={d} />)}
    </>
  );
}
