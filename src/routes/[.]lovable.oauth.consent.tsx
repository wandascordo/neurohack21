import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type OAuthResult = { data: any; error: { message: string } | null };
const oauth = (supabase.auth as unknown as {
  oauth: {
    getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
    approveAuthorization: (id: string) => Promise<OAuthResult>;
    denyAuthorization: (id: string) => Promise<OAuthResult>;
  };
}).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Autorizar conexión · Neurohack 21" },
      { name: "description", content: "Autorizá a una app a acceder a tu cuenta de Neurohack 21." },
      { property: "og:title", content: "Autorizar conexión · Neurohack 21" },
      { property: "og:description", content: "Autorizá a una app a acceder a tu cuenta de Neurohack 21." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Falta authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/", search: { next: location.pathname + location.searchStr } as never });
  },
  loader: async ({ location }) => {
    const id = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth.getAuthorizationDetails(id);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-6 text-carbon">No pudimos cargar esta solicitud: {String((error as Error)?.message ?? error)}</main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const name = details?.client?.name ?? details?.client?.client_name ?? "una app";

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorization_id)
      : await oauth.denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No recibimos una dirección de retorno."); return; }
    window.location.href = target;
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-5 p-6 text-carbon">
      <h1 className="text-2xl font-semibold">Conectar {name} con tu cuenta</h1>
      <p className="text-muted-foreground">
        {name} podrá leer tu progreso, registro diario, autoevaluaciones y planes de Neurohack 21.
      </p>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="flex gap-3">
        <Button disabled={busy} onClick={() => decide(true)}>Autorizar</Button>
        <Button variant="outline" disabled={busy} onClick={() => decide(false)}>Cancelar</Button>
      </div>
    </main>
  );
}
