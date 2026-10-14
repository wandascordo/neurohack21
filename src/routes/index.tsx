import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/progreso";
import { Button } from "@/components/ui/button";
import { meta } from "@/components/Placeholder";
import coverArrow from "@/assets/cover-arrow.png.asset.json";
import eyeClosed from "@/assets/iconoview-off.png";
import eyeOpen from "@/assets/iconoview.png";
import loginVideo from "@/assets/login-background-optimized.mp4.asset.json";
import loginVideoWebm from "@/assets/login-background.webm.asset.json";
import loginPoster from "@/assets/login-video-poster.jpg.asset.json";
import logo from "@/assets/neurohack-21-logo.svg.asset.json";

export const Route = createFileRoute("/")({
  head: () => meta("Login", "Ingresá a Neurohack 21, el libro interactivo del reto de 21 días de Destello Interior."),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coverState, setCoverState] = useState<"anim" | "hold" | "fade" | "gone">("anim");

  // Portada de carga: destello Salvia → Tiza (2s) mientras llega el video.
  // Con SSR la animación arranca antes de la hidratación, así que no nos
  // apoyamos en animationend: usamos temporizadores y el estado del video.
  useEffect(() => {
    const hold = setTimeout(() => setCoverState((s) => (s === "anim" ? "hold" : s)), 2000);
    const poll = setInterval(() => {
      const v = videoRef.current;
      const ready = !!v && (v.readyState >= 3 || !!v.error);
      setCoverState((s) => (s === "hold" && ready ? "fade" : s));
    }, 150);
    // Red de seguridad: aunque el video no avise, la portada se retira sola.
    const cap = setTimeout(() => setCoverState((s) => (s === "anim" || s === "hold" ? "fade" : s)), 9000);
    return () => { clearTimeout(hold); clearInterval(poll); clearTimeout(cap); };
  }, []);

  useEffect(() => {
    if (coverState !== "fade") return;
    const t = setTimeout(() => setCoverState("gone"), 700);
    return () => clearTimeout(t);
  }, [coverState]);

  useEffect(() => {
    async function route(_userId: string) {
      await supabase.rpc("mark_first_login");
      logEvent("ingreso");
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/") && !next.startsWith("//")) {
        window.location.replace(next);
        return;
      }
      navigate({ to: "/inicio", replace: true });
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

  const pillBase = "group flex flex-row gap-2.5 items-center self-stretch h-[52px] rounded-full border-2 border-cover-ink backdrop-blur-[10px] py-4 pr-1 pl-6 overflow-hidden";
  const inputCls = "min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-carbon placeholder:uppercase placeholder:text-cover-ink focus:outline-none";
  const activeField = "bg-white";
  const activeBtn = "bg-salvia hover:bg-salvia";

  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-primary text-cover-ink font-cover">
      {coverState !== "gone" && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-50 overflow-hidden bg-arena transition-opacity duration-500 motion-reduce:hidden ${
            coverState === "fade" ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="login-cover-glow" />
        </div>
      )}
      <img src={loginPoster.url} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <video
        ref={videoRef}
        autoPlay muted loop playsInline preload="metadata" poster={loginPoster.url} aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center motion-reduce:hidden"
      >
        <source src={loginVideoWebm.url} type="video/webm" />
        <source src={loginVideo.url} type="video/mp4" />
      </video>
      <div aria-hidden="true" className="login-shade" />
      <div className="mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col gap-10 pt-20 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <h1 className="sr-only">Neurohack 21</h1>
        <img src={logo.url} alt="Neurohack 21" width={250} height={30} className="mx-auto h-auto w-[250px] max-w-full" />
        <div className="flex flex-1 flex-col justify-end gap-5">
          <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
            <div className={`${pillBase} ${email ? activeField : "bg-tiza/10"} group-hover:bg-white group-focus-within:bg-white`}>
              <label htmlFor="email" className="sr-only">Email</label>
              <input id="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={`${inputCls} pr-4`} />
            </div>
            <div className={`${pillBase} ${password ? activeField : "bg-tiza/10"} group-hover:bg-white group-focus-within:bg-white`}>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className={inputCls} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} className="shrink-0 px-1">
                <img className="w-5 h-5" src={showPassword ? eyeOpen : eyeClosed} alt="" />
              </button>
              <Button type="submit" variant="ghost" size="icon" disabled={loading} aria-label="Ingresar"
                className={`size-[38px] shrink-0 rounded-full ${password ? activeBtn : "bg-avena hover:bg-avena/90"} group-hover:bg-salvia group-focus-within:bg-salvia`}>
                <img src={coverArrow.url} alt="" width={20} height={20} className={`size-5 ${password ? "brightness-0 invert" : ""} group-hover:brightness-0 group-hover:invert group-focus-within:brightness-0 group-focus-within:invert`} />
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
        </div>
      </div>
    </main>
  );
}
