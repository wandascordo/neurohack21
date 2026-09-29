import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { PasswordField } from "@/components/PasswordField";
import logo from "@/assets/book-logo.svg.asset.json";

export const Route = createFileRoute("/bienvenida")({
  validateSearch: z.object({ email: z.string().optional() }),
  head: () => meta("Creá tu contraseña", "Creá tu contraseña para acceder a Neurohack 21."),
  component: FirstTimeLogin,
});

function FirstTimeLogin() {
  const { email } = Route.useSearch();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Este link no es válido. Abrí el link que te enviamos después de tu compra.");
    if (p1.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (p1 !== p2) return setError("Las contraseñas no coinciden.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password: p1, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    if (error) return setError("No pudimos crear tu cuenta. Intentá de nuevo.");
    if (data.user && data.user.identities?.length === 0) return setError("Ya existe una cuenta con este email. Ingresá desde la portada.");
    setSent(true);
  }

  return (
    <main className="min-h-[100svh] bg-tiza font-cover">
      <form onSubmit={onSubmit} className="mx-auto flex min-h-[100svh] w-full max-w-[400px] flex-col gap-9 items-start pt-[30px] px-5 pb-10">
        <div className="flex flex-row justify-center items-center self-stretch h-12 py-2.5">
          <img className="w-[100px] h-3" src={logo.url} alt="Neurohack 21" />
        </div>
        <div className="flex flex-col gap-[30px] justify-center items-center self-stretch flex-1">
          <div className="flex flex-col gap-2.5 items-start self-stretch">
            <p className="text-base font-semibold text-piedra leading-none">Hola :)</p>
            <h1 className="text-[28px] font-normal text-carbon leading-[1.1] tracking-[-1.50px]">{sent ? "Revisá tu email" : "Que gusto verte acá"}</h1>
            {sent ? (
              <p className="text-base text-piedra tracking-tight">Te enviamos un email a <strong className="text-carbon">{email}</strong> para validar tu cuenta. Después de abrirlo, ingresá con tu email y contraseña.</p>
            ) : (
              <>
                <p className="text-base text-piedra tracking-tight">Para empezar, creá una contraseña de 8 dígitos que recuerdes para poder acceder a tu cuenta desde cualquier dispositivo.</p>
                <p className="text-base text-piedra tracking-tight">Una vez que crees tu contraseña, te vamos a enviar un email para que puedas validar tu cuenta. Esto es para que tu información quede protegida y solo vos tengas acceso a tus datos.</p>
              </>
            )}
          </div>
          {!sent && (
            <div className="flex flex-col gap-2.5 items-start self-stretch">
              <PasswordField id="p1" placeholder="Creá tu contraseña" value={p1} onChange={setP1} />
              <PasswordField id="p2" placeholder="Repetí tu contraseña" value={p2} onChange={setP2} />
              {error && <p role="alert" className="px-2 text-sm text-carbon">{error}</p>}
            </div>
          )}
        </div>
        {!sent && (
          <button type="submit" disabled={loading} className="flex justify-center items-center self-stretch bg-salvia rounded-full py-4 px-6 text-base font-semibold text-tiza leading-none uppercase disabled:opacity-60">
            {loading ? "Creando…" : "Listo, validar mi cuenta"}
          </button>
        )}
      </form>
    </main>
  );
}
