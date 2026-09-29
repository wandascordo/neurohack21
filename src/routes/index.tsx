import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { meta } from "@/components/Placeholder";

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
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold text-foreground">Neurohack 21</h1>
      {sent ? (
        <p className="mt-8 text-sm text-foreground">
          Te enviamos un enlace a <strong>{email}</strong>. Abrilo desde este dispositivo para ingresar.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Ingresá con tu email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando…" : "Enviarme el enlace"}
          </Button>
        </form>
      )}
      <p className="mt-10 text-xs text-muted-foreground">Producto desarrollado por Destello Interior</p>
      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <Link to="/privacidad" className="underline">Privacidad</Link>
        <Link to="/terminos" className="underline">Términos</Link>
      </div>
    </main>
  );
}
