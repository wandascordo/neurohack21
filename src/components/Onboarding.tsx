import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/progreso";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import closeX from "@/assets/close-x.png.asset.json";
import chevron from "@/assets/ob-chevron.png.asset.json";

const GUIAS = [
  {
    id: "ios",
    label: "Instrucciones para iPhone",
    pasos: [
      "Abrí este link en Safari.",
      "Tocá el ícono de compartir en la barra de abajo.",
      "Deslizá hacia abajo en el menú y elegí “Agregar a pantalla de inicio”.",
      "Tocá “Agregar” arriba a la derecha para confirmar.",
    ],
  },
  {
    id: "android",
    label: "Instrucciones para Android",
    pasos: [
      "Abrí este link en Chrome.",
      "Tocá el menú de los tres puntos arriba a la derecha.",
      "Elegí “Agregar a pantalla principal” (o “Instalar app”).",
      "Tocá “Agregar” para confirmar.",
    ],
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [abierta, setAbierta] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("nh21-onboarding-closed")) return;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", u.user.id).maybeSingle();
      if (data && !data.onboarding_completed_at) setOpen(true);
    })();
  }, []);

  // X: cierra solo por esta vez (vuelve en el próximo ingreso)
  function close() {
    sessionStorage.setItem("nh21-onboarding-closed", "1");
    setOpen(false);
    logEvent("onboarding_cerrado");
  }
  // «No volver a mostrar»: queda guardado en la cuenta (la consulta debe
  // ejecutarse con await; si no, nunca se envía).
  async function finish() {
    setOpen(false);
    sessionStorage.setItem("nh21-onboarding-closed", "1");
    const { error } = await supabase.rpc("complete_onboarding");
    if (error) console.warn("complete_onboarding", error.message);
    logEvent("onboarding_no_volver_a_mostrar");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="flex max-h-[calc(100svh-2.5rem)] w-[calc(100%-30px)] max-w-[370px] flex-col gap-2.5 overflow-hidden rounded-[20px] border border-carbon-10/10 bg-blanco px-5 pb-[30px] pt-5 font-rethink-sans shadow-[3px_3px_10px_0px_rgb(29_29_29_/_0.1)] sm:rounded-[20px] [&>button:last-child]:hidden">
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-5 overflow-y-auto pt-10">
          <div className="flex h-fit flex-col items-start gap-2.5 self-stretch">
            <p className="self-stretch text-left text-base font-semibold leading-none text-piedra">Antes de empezar</p>
            <DialogTitle className="self-stretch text-left text-[28px] font-normal leading-[1.1] tracking-[-1.50px] text-carbon">Te damos la bienvenida a Neurohack 21</DialogTitle>
            <DialogDescription className="self-stretch text-left text-base font-normal tracking-tight text-piedra">Este es tu libro interactivo: la teoría, el reto de 21 días y tus recursos van a estar siempre acá, guardados en tu cuenta. Podés cerrar la app y volver cuando quieras, desde cualquier dispositivo, que vas a retomar exactamente donde lo dejaste.</DialogDescription>
            <p className="self-stretch text-left text-base font-normal tracking-tight text-piedra">Te recomendamos guardar este link en tu pantalla de inicio para tenerlo a mano, como si fuese una app en tu celular (pero sin ocuparte espacio).</p>
          </div>
          <div className="flex h-fit flex-col items-center justify-center gap-2.5 self-stretch rounded-[10px] border border-carbon-10/10 p-3.5">
            <p className="self-stretch text-left text-base font-bold tracking-tight text-carbon">Cómo guardar en la pantalla de inicio</p>
            {GUIAS.map((g) => {
              const isOpen = abierta === g.id;
              return (
                <div key={g.id} className="self-stretch border-b border-carbon-10/10">
                  <button type="button" aria-expanded={isOpen} onClick={() => setAbierta(isOpen ? null : g.id)} className="flex w-full flex-row items-center gap-2.5 p-2.5 text-left">
                    <span className="flex-1 text-base font-normal tracking-tight text-carbon">{g.label}</span>
                    <img className={`h-6 w-6 transition-transform ${isOpen ? "-rotate-90" : "rotate-90"}`} src={chevron.url} alt="" />
                  </button>
                  {isOpen && (
                    <ol className="flex flex-col gap-2 px-2.5 pb-3">
                      {g.pasos.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm tracking-tight text-piedra">
                          <span className="font-semibold text-carbon">{i + 1}.</span>
                          <span className="flex-1">{s}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button type="button" onClick={close} aria-label="Cerrar" className="absolute right-[17px] top-[17px] z-10">
          <img className="h-6 w-6" src={closeX.url} alt="" />
        </button>
        <button type="button" onClick={finish} className="flex h-fit shrink-0 flex-row items-center justify-center gap-2.5 self-stretch overflow-hidden rounded-full bg-carbon-10/10 px-6 py-4 text-center text-base font-semibold uppercase leading-none text-carbon">
          No volver a mostrar
        </button>
      </DialogContent>
    </Dialog>
  );
}
