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
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [mode, setMode] = useState<"login" | "signup">("login");
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
    setError(null);
    if (step === "email") return setStep("password");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) return setError("No pudimos crear tu cuenta. Revisá los datos e intentá de nuevo.");
      if (data.user && data.user.identities?.length === 0)
        return setError("Ya existe una cuenta con este email. Ingresá con tu contraseña.");
      setPassword("");
      setMode("login");
      setSent(true);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (/confirm/i.test(error.message)) return setError("Todavía no validaste tu email. Abrí el enlace que te enviamos.");
      return setError("Email o contraseña incorrectos. Si es tu primera vez, creá tu cuenta.");
    }
  }

  const pill =
    "group flex h-[52px] items-center gap-2 rounded-full border-2 border-cover-ink py-1 pl-6 pr-1.5 transition-colors hover:border-tiza hover:bg-tiza focus-within:border-tiza focus-within:bg-tiza data-[active]:border-tiza data-[active]:bg-tiza";
  const inputCls =
    "min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-cover-ink placeholder:uppercase placeholder:text-cover-ink focus:outline-none group-hover:text-carbon group-hover:placeholder:text-avena group-focus-within:text-carbon group-focus-within:placeholder:text-avena group-data-[active]:text-carbon";
  const arrowBtn = (label: string) => (
    <Button type="submit" variant="ghost" size="icon" disabled={loading} aria-label={label} className="size-[38px] shrink-0 rounded-full bg-cover-warm text-cover-arrow hover:bg-cover-warm/90 hover:text-cover-arrow group-hover:bg-salvia group-focus-within:bg-salvia group-data-[active]:bg-salvia group-hover:hover:bg-salvia/90">
      <img src={coverArrow.url} alt="" width={20} height={20} className="size-5 group-hover:brightness-0 group-hover:invert group-focus-within:brightness-0 group-focus-within:invert group-data-[active]:brightness-0 group-data-[active]:invert" />
    </Button>
  );

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
          {sent && (
            <div role="status" className="mb-4 rounded-[2rem] border-2 border-cover-ink px-6 py-4 text-base leading-snug text-cover-ink backdrop-blur-sm">
              Te enviamos un enlace a <strong>{email}</strong> para validar tu email. Después de abrirlo, volvé a ingresar con tu email y contraseña.
            </div>
          )}
          <form onSubmit={onSubmit} className="w-full space-y-3">
            {step === "password" && (
              <p className="px-2 text-sm font-medium text-cover-ink">
                {mode === "signup" ? "Creá una contraseña de al menos 8 caracteres" : "Ingresá tu contraseña"}
              </p>
            )}
            <label htmlFor="email" className="sr-only">Email</label>
            <div data-active={email ? "" : undefined} className={pill}>
              <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="INGRESÁ CON TU EMAIL" className={inputCls} />
              {step === "email" && arrowBtn("Continuar")}
            </div>
            {step === "password" && (
              <>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <div data-active={password ? "" : undefined} className={pill}>
                  <input id="password" type="password" autoFocus minLength={8} required autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "CREÁ UNA CONTRASEÑA" : "CONTRASEÑA"} className={inputCls} />
                  {arrowBtn(loading ? "Cargando" : mode === "signup" ? "Crear cuenta" : "Ingresar")}
                </div>
                <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }} className="block w-full text-center text-sm text-cover-ink underline underline-offset-4">
                  {mode === "login" ? "¿Primera vez? Creá tu cuenta" : "¿Ya tenés cuenta? Ingresá"}
                </button>
              </>
            )}
            {error && <p role="alert" className="px-2 text-sm font-medium text-cover-ink">{error}</p>}
          </form>
          <p className="mt-[clamp(2rem,7svh,4rem)] text-center text-xs font-normal text-cover-ink md:text-sm">
            Producto desarrollado por <span className="underline underline-offset-4">Destello Interior</span>
          </p>
        </div>
      </div>
    </main>
  );
}
