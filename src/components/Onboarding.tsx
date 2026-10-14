import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/progreso";
import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import closeX from "@/assets/close-x.png.asset.json";
import bienvenida from "@/assets/onboarding-bienvenida.png.asset.json";
import compartir from "@/assets/onboarding-share-ios.png.asset.json";
import check from "@/assets/onboarding-check.png.asset.json";

const GUIAS = [
  {
    id: "ios",
    label: "iPhone",
    pasos: [
      <>Desde la barra del navegador, seleccioná el icono de Compartir <img src={compartir.url} alt="" className="inline-block h-3.5 w-3.5 align-baseline" /></>,
      <>Elegí la opción <strong className="font-semibold">Agregar a pantalla de inicio</strong></>,
      <>Seleccioná Guardar, y listo</>,
    ],
    cierre: "Aparecerá en tu pantalla del celular como una app.",
  },
  {
    id: "android",
    label: "Android",
    pasos: [
      <>Abrí este link en Chrome y tocá el menú de los tres puntos.</>,
      <>Elegí <strong className="font-semibold">Agregar a pantalla principal</strong> (o “Instalar app”).</>,
      <>Tocá Agregar para confirmar.</>,
    ],
    cierre: "Aparecerá en tu pantalla del celular como una app.",
  },
  {
    id: "computadora",
    label: "Computadora",
    pasos: [
      <>Abrí este link en tu navegador.</>,
      <>Agregalo a tus favoritos o marcadores desde el menú del navegador.</>,
      <>Guardalo para volver cuando quieras.</>,
    ],
    cierre: "Vas a poder acceder desde tus favoritos.",
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [pantalla, setPantalla] = useState<1 | 2>(1);
  const [abierta, setAbierta] = useState<string | null>("ios");
  const [noMostrar, setNoMostrar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("nh21-onboarding-closed")) return;
    let vigente = true;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", u.user.id).maybeSingle();
      if (vigente && data && !data.onboarding_completed_at) setOpen(true);
    })();
    return () => { vigente = false; };
  }, []);

  function close() {
    sessionStorage.setItem("nh21-onboarding-closed", "1");
    setOpen(false);
    logEvent("onboarding_cerrado");
  }

  async function finish() {
    if (guardando) return;
    setError("");
    if (noMostrar) {
      setGuardando(true);
      const { error: rpcError } = await supabase.rpc("complete_onboarding");
      setGuardando(false);
      if (rpcError) {
        setError("No pudimos guardar tu preferencia. Intentá de nuevo.");
        return;
      }
      logEvent("onboarding_no_volver_a_mostrar");
    }
    sessionStorage.setItem("nh21-onboarding-closed", "1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !guardando) close(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-carbon-10/10 backdrop-blur-lg" />
        <DialogPrimitive.Content className="onboarding-modal fixed bottom-5 left-1/2 z-50 flex h-[776px] max-h-[calc(100svh-98px)] w-[calc(100%-30px)] max-w-[370px] -translate-x-1/2 flex-col gap-2.5 overflow-hidden rounded-[20px] border border-carbon-10/10 bg-blanco px-5 pb-[30px] pt-5 font-rethink-sans outline-none sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2">
          <Button variant="ghost" size="icon" onClick={close} disabled={guardando} aria-label="Cerrar" className="absolute right-[13px] top-[13px] z-10 h-8 w-8 rounded-full p-1 hover:bg-carbon-10/[0.03]">
            <img className="h-6 w-6" src={closeX.url} alt="" />
          </Button>

          {pantalla === 1 ? (
            <div key="bienvenida" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              <div className="relative -mx-5 mt-20 min-h-[120px] flex-1">
                <img src={bienvenida.url} alt="" className="absolute inset-0 h-full w-full object-contain opacity-20 dark:invert" />
              </div>
              <div className="flex shrink-0 flex-col gap-2.5 py-5">
                <p className="text-base font-semibold leading-none text-salvia">Antes de empezar</p>
                <DialogTitle className="text-[22px] font-normal leading-[1.1] tracking-normal text-carbon">Te damos la bienvenida a Neurohack 21</DialogTitle>
                <DialogDescription className="text-sm font-normal leading-[1.3] tracking-normal text-piedra">Este es tu libro interactivo: la teoría, el reto de 21 días y tus recursos van a estar siempre acá, guardados en tu cuenta.</DialogDescription>
                <p className="text-sm font-normal leading-[1.3] text-piedra">Podés cerrar la app y volver cuando quieras, desde cualquier dispositivo, que vas a retomar exactamente donde lo dejaste.</p>
              </div>
            </div>
          ) : (
            <div key="recomendacion" className="onboarding-recomendacion flex min-h-0 flex-1 flex-col gap-[30px] overflow-y-auto overscroll-contain pt-[100px]">
              <Button variant="ghost" onClick={() => setPantalla(1)} className="h-auto shrink-0 justify-start gap-1 self-start rounded-none p-0 text-sm font-normal text-piedra hover:bg-transparent hover:text-carbon">
                <ChevronLeft className="size-5" /> Volver
              </Button>
              <div className="flex shrink-0 flex-col gap-2.5">
                <p className="text-base font-semibold leading-none text-salvia">Recomendación</p>
                <DialogTitle className="text-[22px] font-normal leading-[1.1] tracking-normal text-carbon">Guardame en tu pantalla de inicio</DialogTitle>
                <DialogDescription className="text-sm font-normal leading-[1.3] tracking-normal text-piedra">Te recomendamos guardar este link en tu pantalla de inicio para tenerlo a mano, como si fuese una app en tu dispositivo.</DialogDescription>
              </div>
              <div className="shrink-0 rounded-[10px] bg-carbon-10/[0.03] px-2.5 py-1">
                {GUIAS.map((g) => {
                  const isOpen = abierta === g.id;
                  return (
                    <div key={g.id} className="border-b border-carbon-10/10 last:border-b-0">
                      <Button variant="ghost" aria-expanded={isOpen} aria-controls={`onboarding-${g.id}`} onClick={() => setAbierta(isOpen ? null : g.id)} className="h-auto w-full justify-between rounded-none px-2.5 py-3.5 text-base font-semibold text-carbon hover:bg-transparent">
                        {g.label}<ChevronDown className={`size-5 text-piedra transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`} />
                      </Button>
                      {isOpen && (
                        <div id={`onboarding-${g.id}`} className="px-2.5 pb-4 text-sm leading-[1.3] text-piedra">
                          <ol className="list-decimal pl-5">{g.pasos.map((paso, i) => <li key={i}>{paso}</li>)}</ol>
                          <p className="mt-4 text-xs leading-[1.3]">{g.cierre}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pantalla === 2 && (
            <label className="relative flex shrink-0 cursor-pointer items-center gap-2.5 pb-5 pl-1 pt-2.5 text-base text-piedra">
              <input type="checkbox" checked={noMostrar} onChange={(e) => setNoMostrar(e.target.checked)} disabled={guardando} className="peer absolute left-1 top-2.5 h-6 w-6 cursor-pointer opacity-0" />
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-carbon-10/20 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-salvia">
                {noMostrar && <img src={check.url} alt="" className="h-6 w-6" />}
              </span>
              No volver a mostrar
            </label>
          )}
          {error && <p role="alert" className="text-sm text-carbon">{error}</p>}
          <Button onClick={pantalla === 1 ? () => setPantalla(2) : finish} disabled={guardando} className="h-12 w-full shrink-0 rounded-full bg-salvia px-6 py-4 text-base font-semibold uppercase leading-none text-tiza shadow-none hover:bg-salvia/90">
            {pantalla === 1 ? "Siguiente" : guardando ? "Guardando…" : "Listo"}
          </Button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}