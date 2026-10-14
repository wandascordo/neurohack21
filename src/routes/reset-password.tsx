import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { meta } from "@/components/Placeholder";
import { PasswordField } from "@/components/PasswordField";
import logo from "@/assets/book-logo.svg.asset.json";

export const Route = createFileRoute("/reset-password")({
  head: () => meta("Nueva contraseña", "Elegí una nueva contraseña para Neurohack 21."),
  component: ResetPassword,
});

const EXPIRED = "El link expiró o ya fue usado. Pedí uno nuevo desde el login.";

function ResetPassword() {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let done = false;
    const markReady = () => { if (!done) { done = true; setReady(true); setError(null); } };
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION")) markReady();
    });

    (async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.slice(1));
      const q = url.searchParams;
      if (hash.get("error") || q.get("error")) { setError(EXPIRED); return; }
      const code = q.get("code");
      const tokenHash = q.get("token_hash");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) { setError(EXPIRED); return; }
      } else if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
        if (error) { setError(EXPIRED); return; }
      }
      if (code || tokenHash) window.history.replaceState(null, "", "/reset-password");
      // Give the client a moment to process hash tokens.
      for (let i = 0; i < 10 && !done; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) { markReady(); break; }
        await new Promise((r) => setTimeout(r, 300));
      }
      if (!done) setError(EXPIRED);
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (p1.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (p1 !== p2) return setError("Las contraseñas no coinciden.");
    if (!ready) return setError(EXPIRED);
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    setSaving(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("different") || m.includes("same")) return setError("La nueva contraseña tiene que ser distinta a la anterior.");
      if (m.includes("weak") || m.includes("pwned") || m.includes("leaked")) return setError("Esa contraseña es muy fácil de adivinar. Probá con otra.");
      if (m.includes("session") || m.includes("jwt") || m.includes("expired")) return setError(EXPIRED);
      return setError("No pudimos guardar la contraseña. Intentá de nuevo.");
    }
    navigate({ to: "/inicio", replace: true });
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
        <button type="submit" disabled={saving} className="rounded-full bg-salvia py-4 text-base font-semibold uppercase text-tiza disabled:opacity-60">{saving ? "Guardando…" : "Guardar"}</button>
      </form>
    </main>
  );
}
