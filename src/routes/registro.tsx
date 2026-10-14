import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { PasswordField } from "@/components/PasswordField";
import logo from "@/assets/book-logo.svg.asset.json";

export const Route = createFileRoute("/registro")({
  validateSearch: z.object({ email: z.string().optional() }),
  head: () => meta("Creá tu cuenta", "Creá tu cuenta para acceder a Neurohack 21."),
  component: FirstTimeLogin,
});

function FirstTimeLogin() {
  const { email } = Route.useSearch();
  const [name, setName] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Este link no es válido. Abrí el link que te enviamos después de tu compra.");
    if (name.trim().length < 2) return setError("Completá tu nombre y apellido.");
    if (p1.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (p1 !== p2) return setError("Las contraseñas no coinciden.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password: p1, options: { emailRedirectTo: window.location.origin, data: { full_name: name.trim().slice(0, 120) } } });
    setLoading(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("weak") || m.includes("pwned") || m.includes("easy to guess"))
        return setError("Esa contraseña es muy común y fácil de adivinar. Elegí otra más segura (por ejemplo, combiná palabras, números y símbolos).");
      if (m.includes("already registered") || m.includes("already exists"))
        return setError("Este email ya tiene una cuenta. Ingresá desde el login con tu contraseña.");
      if (m.includes("rate") || m.includes("too many"))
        return setError("Hubo demasiados intentos. Esperá unos minutos y probá de nuevo.");
      return setError("No pudimos crear tu cuenta. Intentá de nuevo.");
    }
    if (data.user && data.user.identities?.length === 0) return setError("Ya existe una cuenta con este email. Ingresá desde el login.");
    setSent(true);
  }

  return (
    <main className="min-h-[100svh] bg-tiza font-cover">
      <form onSubmit={onSubmit} className="mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col gap-5 items-start pt-[30px] px-5 pb-10">
        <div className="flex flex-row justify-center items-center self-stretch h-12 py-2.5">
          <img className="w-[100px] h-3" src={logo.url} alt="Neurohack 21" />
        </div>
        <div className="flex flex-col gap-[30px] items-center self-stretch flex-1 py-5">
          <div className="flex flex-col gap-2.5 items-start self-stretch">
            <p className="text-base font-semibold text-piedra leading-none">Hola :)</p>
            <h1 className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">{sent ? "Revisá tu email" : "Que gusto verte acá"}</h1>
            {sent ? (
              <p className="text-base text-piedra tracking-tight">Te enviamos un email a <strong className="text-carbon">{email}</strong> para validar tu cuenta. Después de abrirlo, ingresá con tu email y contraseña.</p>
            ) : (
              <p className="text-base font-normal text-left text-piedra tracking-tight self-stretch h-fit">Para empezar, completá tu nombre completo:</p>
            )}
          </div>
          {!sent && (
            <>
              <div className="flex flex-col gap-2.5 items-start self-stretch h-fit">
                <div className="flex flex-row gap-2.5 justify-center items-center self-stretch h-[52px] rounded-full border-2 border-carbon-10/10 py-4 px-6 overflow-hidden focus-within:border-salvia">
                  <label htmlFor="nombre" className="sr-only">Nombre y Apellido</label>
                  <input id="nombre" type="text" autoComplete="name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y Apellido"
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-carbon placeholder:uppercase placeholder:text-piedra focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2.5 justify-center items-center self-stretch h-fit">
                <p className="text-base font-normal text-left text-piedra tracking-tight self-stretch h-fit">Y creá una contraseña de 8 dígitos que recuerdes para poder acceder a tu cuenta desde cualquier dispositivo:</p>
              </div>
              <div className="flex flex-col gap-2.5 items-start self-stretch h-fit">
                <PasswordField id="p1" placeholder="Creá tu contraseña" value={p1} onChange={setP1} />
                <PasswordField id="p2" placeholder="Repetí tu contraseña" value={p2} onChange={setP2} />
                {error && <p role="alert" className="px-2 text-sm text-carbon">{error}</p>}
              </div>
              <div className="flex flex-col gap-2.5 items-start self-stretch h-fit">
                <p className="text-sm font-normal text-left text-piedra tracking-tight self-stretch h-fit">Una vez que crees tu contraseña, te vamos a enviar un email para que puedas validar tu cuenta. Esto es para que tu información quede protegida y solo vos tengas acceso a tus datos.</p>
              </div>
            </>
          )}
        </div>
        {!sent && (
          <button type="submit" disabled={loading} className="flex justify-center items-center self-stretch bg-salvia rounded-full py-4 px-6 text-base font-semibold text-tiza leading-none uppercase disabled:opacity-60">
            {loading ? "Creando…" : "Validar mi cuenta"}
          </button>
        )}
      </form>
    </main>
  );
}
