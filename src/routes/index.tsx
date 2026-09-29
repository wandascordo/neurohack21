import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { meta } from "@/components/Placeholder";
import coverArrow from "@/assets/cover-arrow.png.asset.json";
import loginVideo from "@/assets/login-background-optimized.mp4.asset.json";
import loginVideoWebm from "@/assets/login-background.webm.asset.json";
import loginPoster from "@/assets/login-video-poster.jpg.asset.json";
import logo from "@/assets/neurohack-21-logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => meta("Portada", "Neurohack 21: libro interactivo del reto de 21 días de Destello Interior."),
  component: Portada,
});

function Portada() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function route(userId: string) {
      await supabase.rpc("mark_first_login");
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", userId)
        .maybeSingle();
      navigate({ to: data?.onboarding_completed_at ? "/menu" : "/indice", replace: true });
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) route(data.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) route(session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return setError("No pudimos enviar el enlace. Revisá tu email e intentá de nuevo.");
    setSent(true);
  }

  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-primary text-cover-ink font-cover">
      <img src={loginPoster.url} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <video autoPlay muted loop playsInline preload="metadata" poster={loginPoster.url} aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-center motion-reduce:hidden">
        <source src={loginVideoWebm.url} type="video/webm" />
        <source src={loginVideo.url} type="video/mp4" />
      </video>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col items-center px-5 pt-[max(4.75rem,8svh)] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
        <h1 className="sr-only">Neurohack 21</h1>
        <img src={logo.url} alt="Neurohack 21" width={250} height={30} className="h-auto w-[250px] max-w-full" />
        <div className="mt-auto w-full max-w-2xl">
          {sent ? (
            <div role="status" className="rounded-[2rem] border-2 border-cover-ink px-6 py-4 text-base leading-snug text-cover-ink backdrop-blur-sm">
              Te enviamos un enlace a <strong>{email}</strong>. Abrilo desde este dispositivo para ingresar.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full">
              <label htmlFor="email" className="sr-only">Ingresá con tu email</label>
              <div data-active={email ? "" : undefined} className="group flex h-[52px] items-center gap-2 rounded-full border-2 border-cover-ink py-1 pl-6 pr-1.5 transition-colors hover:border-tiza hover:bg-tiza focus-within:border-tiza focus-within:bg-tiza data-[active]:border-tiza data-[active]:bg-tiza">
                <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="INGRESÁ CON TU EMAIL" className="min-w-0 flex-1 bg-transparent text-base font-semibold uppercase leading-none text-cover-ink placeholder:text-cover-ink focus:outline-none group-hover:text-carbon group-hover:placeholder:text-avena group-focus-within:text-carbon group-focus-within:placeholder:text-avena group-data-[active]:text-carbon" />
                <Button type="submit" variant="ghost" size="icon" disabled={loading} aria-label={loading ? "Enviando enlace" : "Enviarme el enlace"} className="size-[38px] shrink-0 rounded-full bg-cover-warm text-cover-arrow hover:bg-cover-warm/90 hover:text-cover-arrow group-hover:bg-salvia group-focus-within:bg-salvia group-data-[active]:bg-salvia group-hover:hover:bg-salvia/90">
                  <img src={coverArrow.url} alt="" width={20} height={20} className="size-5 group-hover:brightness-0 group-hover:invert group-focus-within:brightness-0 group-focus-within:invert group-data-[active]:brightness-0 group-data-[active]:invert" />
                </Button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm font-medium text-cover-ink">{error}</p>}
            </form>
          )}
          <p className="mt-[clamp(2rem,7svh,4rem)] text-center text-xs font-normal text-cover-ink md:text-sm">
            Producto desarrollado por <span className="underline underline-offset-4">Destello Interior</span>
          </p>
        </div>
      </div>
    </main>
  );
}
