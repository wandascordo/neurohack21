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
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/menu", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError("Email o contraseña incorrectos.");
    await supabase.rpc("mark_first_login");
    navigate({ to: "/menu", replace: true });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold text-foreground">Neurohack 21</h1>
      <p className="mt-1 text-sm text-muted-foreground">Destello Interior</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Ingresando…" : "Ingresar"}
        </Button>
      </form>
      <div className="mt-8 flex gap-4 text-xs text-muted-foreground">
        <Link to="/privacidad" className="underline">Privacidad</Link>
        <Link to="/terminos" className="underline">Términos</Link>
      </div>
    </main>
  );
}
