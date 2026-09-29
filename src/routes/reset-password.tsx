import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { PasswordField } from "@/components/PasswordField";
import logo from "@/assets/book-logo.svg.asset.json";

export const Route = createFileRoute("/reset-password")({
  head: () => meta("Nueva contraseña", "Elegí una nueva contraseña para Neurohack 21."),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (p1.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (p1 !== p2) return setError("Las contraseñas no coinciden.");
    const { error } = await supabase.auth.updateUser({ password: p1 });
    if (error) return setError("El link expiró. Pedí uno nuevo desde el login.");
    navigate({ to: "/menu" });
  }

  return (
    <main className="min-h-[100svh] bg-tiza font-cover">
      <form onSubmit={onSubmit} className="mx-auto flex min-h-[100svh] max-w-[400px] flex-col gap-9 pt-[30px] px-5 pb-10">
        <div className="flex justify-center py-2.5"><img className="w-[100px] h-3" src={logo.url} alt="Neurohack 21" /></div>
        <div className="flex flex-1 flex-col justify-center gap-2.5">
          <h1 className="text-[28px] text-carbon leading-[1.1] tracking-[-1.5px]">Nueva contraseña</h1>
          <PasswordField id="np1" placeholder="Nueva contraseña" value={p1} onChange={setP1} autoComplete="new-password" />
          <PasswordField id="np2" placeholder="Repetí tu contraseña" value={p2} onChange={setP2} autoComplete="new-password" />
          {error && <p role="alert" className="px-2 text-sm text-carbon">{error}</p>}
        </div>
        <button type="submit" className="rounded-full bg-salvia py-4 text-base font-semibold uppercase text-tiza">Guardar</button>
      </form>
    </main>
  );
}
