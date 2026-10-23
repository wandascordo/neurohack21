import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { completeRegistration } from "@/lib/account-completion.functions";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { PasswordField } from "@/components/PasswordField";
import logo from "@/assets/book-logo.svg.asset.json";

export const Route = createFileRoute("/registro")({
  head: () => meta("Creá tu cuenta", "Creá tu cuenta para acceder a Neurohack 21."),
  component: Registro,
});

export const capitalizar = (s: string) => s.toLocaleLowerCase("es").replace(/(^|[\s'-])(\p{L})/gu, (_m, a: string, b: string) => a + b.toLocaleUpperCase("es"));

const campo = "flex flex-row gap-2.5 justify-center items-center self-stretch h-[52px] rounded-full border-2 border-carbon-10/10 py-4 px-6 overflow-hidden focus-within:border-salvia";
const input = "min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-carbon placeholder:uppercase placeholder:text-piedra focus:outline-none";
const boton = "flex justify-center items-center self-stretch bg-salvia rounded-full py-4 px-6 text-base font-semibold text-tiza leading-none uppercase disabled:opacity-60";
const errorCls = "px-2 text-sm text-carbon";

function Registro() {
  const [estado, setEstado] = useState<"cargando" | "invitacion" | "vencido">("cargando");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    let vivo = true;
    async function revisar() {
      for (let i = 0; i < 20 && vivo; i++) {
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (u) {
          const { data: p } = await supabase.from("profiles").select("account_completed_at, full_name").eq("id", u.id).maybeSingle();
          if (!vivo) return;
          if (p?.account_completed_at) return setEstado("vencido");
          const n = (u.user_metadata?.["full_name"] as string | undefined) ?? p?.full_name ?? "";
          setEmail(u.email ?? "");
          setNombre(n ? capitalizar(n.trim()) : "");
          return setEstado("invitacion");
        }
        if (!window.location.hash.includes("access_token") && !window.location.search.includes("code=") && i > 3) break;
        await new Promise((r) => setTimeout(r, 250));
      }
      if (vivo) setEstado("vencido");
    }
    void revisar();
    return () => { vivo = false; };
  }, []);

  return (
    <main className="min-h-[100svh] bg-tiza font-cover">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col gap-5 items-start pt-[30px] px-5 pb-10">
        <div className="flex flex-row justify-center items-center self-stretch h-12 py-2.5">
          <img className="w-[100px] h-3" src={logo.url} alt="Neurohack 21" />
        </div>
        {estado === "invitacion" && <Formulario email={email} nombreInicial={nombre} />}
        {estado === "vencido" && <PedirAcceso />}
      </div>
    </main>
  );
}

function Formulario({ email, nombreInicial }: { email: string; nombreInicial: string }) {
  const navigate = useNavigate();
  const complete = useServerFn(completeRegistration);
  const sinNombre = !nombreInicial.trim();
  const [name, setName] = useState(nombreInicial);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [err, setErr] = useState<{ nombre?: string; p1?: string; p2?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n: typeof err = {};
    if (sinNombre && !name.trim()) n.nombre = "Completá tu nombre y apellido.";
    if (p1.length < 8) n.p1 = "La contraseña debe tener al menos 8 caracteres.";
    else if (p1 !== p2) n.p2 = "Las contraseñas no coinciden.";
    setErr(n);
    if (Object.keys(n).length) return;
    setLoading(true);
    const full_name = name.trim().slice(0, 120);
    const { error } = await supabase.auth.updateUser({ password: p1, data: { full_name } });
    if (error) {
      setLoading(false);
      const m = error.message.toLowerCase();
      if (m.includes("weak") || m.includes("pwned") || m.includes("easy to guess"))
        return setErr({ p1: "Esa contraseña es muy común y fácil de adivinar. Elegí otra más segura." });
      if (m.includes("session") || m.includes("jwt") || m.includes("expired"))
        return setErr({ general: "Tu enlace venció. Pedí uno nuevo desde esta misma pantalla." });
      return setErr({ general: "No pudimos crear tu cuenta. Intentá de nuevo." });
    }
    const result = await complete({ data: { fullName: full_name } }).catch(() => ({ ok: false }));
    setLoading(false);
    if (!result.ok) return setErr({ general: "No pudimos crear tu cuenta. Intentá de nuevo." });
    navigate({ to: "/inicio" });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 items-start self-stretch flex-1">
      <div className="flex flex-col gap-[30px] items-center self-stretch flex-1 py-5">
        <div className="flex flex-col gap-2.5 items-start self-stretch">
          <h1 className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">Creá tu cuenta</h1>
        </div>
        <div className="flex flex-col gap-2.5 items-start self-stretch">
          <div className={`${campo} opacity-70`}>
            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" value={email} readOnly disabled className={input} />
          </div>
          <p className="px-2 text-sm text-piedra tracking-tight">¿Querés usar otro email? <a href="mailto:soporte@destellointerior.com" className="text-salvia underline">Escribinos</a>.</p>
        </div>
        {sinNombre && (
          <div className="flex flex-col gap-2.5 items-start self-stretch">
            <p className="text-base font-normal text-piedra tracking-tight self-stretch">Completá tu nombre y apellido:</p>
            <div className={campo}>
              <label htmlFor="nombre" className="sr-only">Nombre y Apellido</label>
              <input id="nombre" type="text" autoComplete="name" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y Apellido" className={input} />
            </div>
            {err.nombre && <p role="alert" className={errorCls}>{err.nombre}</p>}
          </div>
        )}
        <div className="flex flex-col gap-2.5 items-start self-stretch">
          <p className="text-base font-normal text-piedra tracking-tight self-stretch">Creá una contraseña de al menos 8 caracteres</p>
          <PasswordField id="p1" placeholder="Creá tu contraseña" value={p1} onChange={setP1} />
          {err.p1 && <p role="alert" className={errorCls}>{err.p1}</p>}
          <PasswordField id="p2" placeholder="Repetí tu contraseña" value={p2} onChange={setP2} />
          {err.p2 && <p role="alert" className={errorCls}>{err.p2}</p>}
          {err.general && <p role="alert" className={errorCls}>{err.general}</p>}
        </div>
        <p className="text-sm font-normal text-piedra tracking-tight self-stretch">Si este enlace vence, podrás pedir uno nuevo con tu email.</p>
      </div>
      <button type="submit" disabled={loading} aria-busy={loading} className={boton}>{loading ? "Creando…" : "Crear mi cuenta"}</button>
    </form>
  );
}

function PedirAcceso() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr("Ingresá un email válido.");
    setLoading(true);
    try {
      const r = await fetch("/api/public/access-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
      const j = (await r.json()) as { message?: string };
      setMsg(j.message ?? null);
    } catch {
      setErr("No pudimos enviar tu pedido. Intentá de nuevo.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 items-start self-stretch flex-1">
      <div className="flex flex-col gap-[30px] items-center self-stretch flex-1 py-5">
        <div className="flex flex-col gap-2.5 items-start self-stretch">
          <p className="text-base font-semibold text-piedra leading-none">Hola :)</p>
          <h1 className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">Este enlace ya no está disponible.</h1>
          <p className="text-base text-piedra tracking-tight">Ingresá tu email y, si tiene acceso, te enviamos uno nuevo.</p>
        </div>
        <div className="flex flex-col gap-2.5 items-start self-stretch">
          <div className={campo}>
            <label htmlFor="email-acceso" className="sr-only">Email</label>
            <input id="email-acceso" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={input} />
          </div>
          {err && <p role="alert" className={errorCls}>{err}</p>}
          {msg && <p role="status" className="px-2 text-sm text-carbon">{msg}</p>}
        </div>
      </div>
      <button type="submit" disabled={loading} aria-busy={loading} className={boton}>{loading ? "Enviando…" : "Pedir un acceso nuevo"}</button>
    </form>
  );
}
