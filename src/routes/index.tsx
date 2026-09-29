import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function route(userId: string) {
      await supabase.rpc("mark_first_login");
      const { data } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", userId).maybeSingle();
      navigate({ to: data?.onboarding_completed_at ? "/menu" : "/indice", replace: true });
    }
    supabase.auth.getUser().then(({ data }) => { if (data.user) route(data.user.id); });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) route(session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (/confirm/i.test(error.message)) return setError("Todavía no validaste tu email. Abrí el enlace que te enviamos.");
      return setError("Email o contraseña incorrectos.");
    }
  }

  async function forgot() {
    setError(null); setInfo(null);
    if (!email) return setError("Escribí tu email y volvé a tocar “Olvidé mi contraseña”.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) return setError("No pudimos enviar el email. Intentá de nuevo.");
    setInfo(`Te enviamos un email a ${email} para crear una nueva contraseña.`);
  }

  const pill = "flex flex-row gap-2.5 items-center self-stretch h-[52px] bg-tiza/10 rounded-full border-2 border-cover-ink backdrop-blur-[50px] py-4 pr-1 pl-6 overflow-hidden";
  const inputCls = "min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-carbon placeholder:uppercase placeholder:text-cover-ink focus:outline-none";

  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-primary text-cover-ink font-cover">
      <img src={loginPoster.url} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <video autoPlay muted loop playsInline preload="metadata" poster={loginPoster.url} aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover object-center motion-reduce:hidden">
        <source src={loginVideoWebm.url} type="video/webm" />
        <source src={loginVideo.url} type="video/mp4" />
      </video>
      <div className="mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col gap-10 pt-20 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <h1 className="sr-only">Neurohack 21</h1>
        <img src={logo.url} alt="Neurohack 21" width={250} height={30} className="mx-auto h-auto w-[250px] max-w-full" />
        <div className="flex flex-1 flex-col justify-end gap-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
            <div className={pill}>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`${inputCls} pr-4`} />
            </div>
            <div className={pill}>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className={inputCls} />
              <Button type="submit" variant="ghost" size="icon" disabled={loading} aria-label="Ingresar" className="size-[38px] shrink-0 rounded-full bg-avena hover:bg-avena/90">
                <img src={coverArrow.url} alt="" width={20} height={20} className="size-5" />
              </Button>
            </div>
          </form>
          <div className="px-6">
            <button type="button" onClick={forgot} className="text-sm tracking-tight underline">Olvidé mi contraseña</button>
            {(error || info) && <p role={error ? "alert" : "status"} className="mt-2 text-sm font-medium">{error ?? info}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 border-t border-cover-ink pt-5">
          <div className="flex gap-5 text-xs tracking-tight">
            <Link to="/privacidad" className="underline">Políticas de Privacidad</Link>
            <Link to="/terminos" className="underline">Términos de Uso</Link>
          </div>
          <p className="text-[10px] tracking-tight">Producto desarrollado por <strong>Destello Interior</strong></p>
        </div>
      </div>
    </main>
  );
}
