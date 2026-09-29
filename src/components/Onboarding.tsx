import { useEffect, useState } from "react";
import { Share, SquarePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { detectPlatform, isStandalone, promptInstall, type Platform } from "@/lib/install-prompt";

type Step = "welcome" | "install" | "ios-steps" | "done-android" | "done-ios" | null;

const TITLE = "Te damos la bienvenida a Neurohack 21";
const BODY =
  "Este es tu libro interactivo: la teoría, el reto de 21 días y tus recursos (Autoevaluación de Foco, Kit de Emergencia, Registro Diario, Tracker Visual, Guiones y Glosario) van a estar siempre acá, guardados en tu cuenta. Podés cerrar la app y volver cuando quieras, desde cualquier dispositivo, que vas a retomar exactamente donde lo dejaste.";

export function Onboarding() {
  const [step, setStep] = useState<Step>(null);
  const [platform, setPlatform] = useState<Platform>("desktop");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", u.user.id)
        .maybeSingle();
      if (data && !data.onboarding_completed_at) {
        setPlatform(detectPlatform());
        setStep("welcome");
      }
    })();
  }, []);

  function finish() {
    setStep(null);
    void supabase.rpc("complete_onboarding");
  }

  function afterWelcome() {
    if (platform === "desktop" || isStandalone()) return finish();
    setStep("install");
  }

  async function installAndroid() {
    const ok = await promptInstall();
    if (ok) setStep("done-android");
    else finish();
  }

  return (
    <Dialog open={step !== null} onOpenChange={(o) => !o && finish()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {step === "welcome" && (
          <>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Antes de empezar</p>
            <DialogTitle>{TITLE}</DialogTitle>
            <DialogDescription>{BODY}</DialogDescription>
            <Button onClick={afterWelcome}>Continuar</Button>
          </>
        )}

        {step === "install" && (
          <>
            <DialogTitle>{TITLE}</DialogTitle>
            <DialogDescription>
              Guardala en tu pantalla de inicio para abrirla como cualquier otra app.
            </DialogDescription>
            {platform === "ios" ? (
              <Button onClick={() => setStep("ios-steps")}>Mostrarme cómo</Button>
            ) : (
              <Button onClick={installAndroid}>Guardar en mi pantalla de inicio</Button>
            )}
            <Button variant="ghost" onClick={finish}>Ahora no</Button>
          </>
        )}

        {step === "ios-steps" && (
          <>
            <DialogTitle>Agregala a tu pantalla de inicio</DialogTitle>
            <ol className="space-y-4">
              {[
                { t: "Tocá el ícono de compartir en la barra de abajo de Safari", icon: <Share className="h-5 w-5" /> },
                { t: "Deslizá hacia abajo en el menú y elegí 'Agregar a pantalla de inicio'", icon: <SquarePlus className="h-5 w-5" /> },
                { t: "Tocá 'Agregar' arriba a la derecha, para confirmar", icon: null },
              ].map((s, i) => (
                <li key={i} className="space-y-2">
                  <div className="flex items-start gap-3 text-sm text-foreground">
                    <span className="font-semibold">{i + 1}.</span>
                    <span className="flex-1">{s.t}</span>
                    {s.icon}
                  </div>
                  <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                    Captura de Safari (próximamente)
                  </div>
                </li>
              ))}
            </ol>
            <Button onClick={() => setStep("done-ios")}>Ya lo hice</Button>
            <button className="text-sm text-muted-foreground underline" onClick={finish}>Más tarde</button>
          </>
        )}

        {step === "done-android" && (
          <>
            <DialogTitle>¡Listo! Ya tenés Neurohack 21 en tu pantalla de inicio.</DialogTitle>
            <DialogDescription className="sr-only">Instalación completa</DialogDescription>
            <Button onClick={finish}>Continuar</Button>
          </>
        )}

        {step === "done-ios" && (
          <>
            <DialogTitle>¡Listo!</DialogTitle>
            <DialogDescription>
              La próxima vez que quieras abrir Neurohack 21, buscalo en tu pantalla de inicio como cualquier otra app.
            </DialogDescription>
            <Button onClick={finish}>Continuar</Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
