import { useEffect, useState } from "react";
import { Share, SquarePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { detectPlatform, isStandalone, promptInstall, type Platform } from "@/lib/install-prompt";
import closeX from "@/assets/close-x.png.asset.json";

type Step = "welcome" | "ios-steps" | "done-android" | "done-ios" | null;

const btnPrimary = "flex justify-center items-center self-stretch bg-salvia rounded-full py-4 px-6 text-base font-semibold text-center text-tiza leading-none uppercase";
const btnSecondary = "flex justify-center items-center self-stretch bg-carbon-10/10 rounded-full py-4 px-6 text-base font-semibold text-center text-carbon leading-none uppercase";

export function Onboarding() {
  const [step, setStep] = useState<Step>(null);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    if (sessionStorage.getItem("nh21-onboarding-closed")) return;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", u.user.id).maybeSingle();
      if (data && !data.onboarding_completed_at) {
        setPlatform(detectPlatform());
        setStep("welcome");
      }
    })();
  }, []);

  // X: cierra solo por esta vez (vuelve en el próximo ingreso)
  function close() {
    sessionStorage.setItem("nh21-onboarding-closed", "1");
    setStep(null);
  }
  // No volver a mostrar / instalación completada
  function finish() {
    setStep(null);
    void supabase.rpc("complete_onboarding");
  }

  async function save() {
    if (platform === "ios") return setStep("ios-steps");
    const ok = await promptInstall();
    if (ok) setStep("done-android");
  }

  const canInstall = platform !== "desktop" && !isStandaloneSafe();

  return (
    <Dialog open={step !== null} onOpenChange={(o) => !o && close()}>
      <DialogContent className="flex max-h-[calc(100svh-6rem)] min-h-[min(776px,calc(100svh-6rem))] w-[calc(100%-30px)] max-w-[370px] flex-col gap-2.5 overflow-y-auto rounded-[20px] border border-carbon-10/10 bg-white pt-5 px-5 pb-[30px] font-cover shadow-[3px_3px_10px_0px_rgb(29_29_29_/_0.1)] [&>button]:hidden">
        <button onClick={close} aria-label="Cerrar" className="absolute top-[17px] right-[17px]">
          <img className="w-6 h-6" src={closeX.url} alt="" />
        </button>
        <span className="w-fit rounded-full bg-carbon-10/10 py-2 px-4 text-base font-semibold text-salvia leading-none">Onboarding</span>

        {step === "welcome" && (
          <>
            <div className="flex flex-1 flex-col justify-center gap-2.5">
              <p className="text-base font-semibold text-piedra leading-none">Antes de empezar</p>
              <DialogTitle className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">Te damos la bienvenida a Neurohack 21</DialogTitle>
              <DialogDescription className="text-base text-piedra tracking-tight">Este es tu libro interactivo: la teoría, el reto de 21 días y tus recursos van a estar siempre acá, guardados en tu cuenta. Podés cerrar la app y volver cuando quieras, desde cualquier dispositivo, que vas a retomar exactamente donde lo dejaste.</DialogDescription>
              <p className="text-base text-piedra tracking-tight">Te recomendamos guardar este link en tu pantalla de inicio para tenerlo a mano, como si fuese una app en tu celular (pero sin ocuparte espacio).</p>
            </div>
            {canInstall && <button className={btnPrimary} onClick={save}>Guardar en mi pantalla de inicio</button>}
            <button className={btnSecondary} onClick={finish}>No volver a mostrar</button>
          </>
        )}

        {step === "ios-steps" && (
          <>
            <div className="flex flex-1 flex-col justify-center gap-4">
              <DialogTitle className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">Agregala a tu pantalla de inicio</DialogTitle>
              <DialogDescription className="sr-only">Pasos para iOS</DialogDescription>
              <ol className="space-y-4">
                {[
                  { t: "Tocá el ícono de compartir en la barra de abajo de Safari", icon: <Share className="h-5 w-5" /> },
                  { t: "Deslizá hacia abajo en el menú y elegí 'Agregar a pantalla de inicio'", icon: <SquarePlus className="h-5 w-5" /> },
                  { t: "Tocá 'Agregar' arriba a la derecha, para confirmar", icon: null },
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-piedra tracking-tight">
                    <span className="font-semibold text-carbon">{i + 1}.</span>
                    <span className="flex-1">{s.t}</span>
                    <span className="text-carbon">{s.icon}</span>
                  </li>
                ))}
              </ol>
            </div>
            <button className={btnPrimary} onClick={() => setStep("done-ios")}>Ya lo hice</button>
            <button className={btnSecondary} onClick={close}>Más tarde</button>
          </>
        )}

        {(step === "done-android" || step === "done-ios") && (
          <>
            <div className="flex flex-1 flex-col justify-center gap-2.5">
              <DialogTitle className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">
                {step === "done-android" ? "¡Listo! Ya tenés Neurohack 21 en tu pantalla de inicio." : "¡Listo!"}
              </DialogTitle>
              <DialogDescription className="text-base text-piedra tracking-tight">
                La próxima vez que quieras abrir Neurohack 21, buscalo en tu pantalla de inicio como cualquier otra app.
              </DialogDescription>
            </div>
            <button className={btnPrimary} onClick={finish}>Continuar</button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function isStandaloneSafe() {
  return typeof window !== "undefined" && isStandalone();
}
