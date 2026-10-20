import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const RESPUESTA = "Si tu email tiene acceso, te enviamos un correo en los próximos minutos. Revisá también spam y promociones.";
const SITE = "https://neurohack21.com";

export const Route = createFileRoute("/api/public/access-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ok = () => Response.json({ message: RESPUESTA });
        const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).safeParse(await request.json().catch(() => null));
        if (!parsed.success) return ok();
        const email = parsed.data.email;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const desde = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { data: reciente } = await supabaseAdmin.from("access_requests").select("id").eq("email", email).gte("requested_at", desde).limit(1);
        if (reciente?.length) return ok();
        await supabaseAdmin.from("access_requests").insert({ email });

        const { data: compra } = await supabaseAdmin.from("purchases").select("first_name, last_name")
          .eq("email", email).eq("status", "active").order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (!compra) return ok();

        const { data: perfil } = await supabaseAdmin.from("profiles").select("id, account_completed_at").eq("email", email).maybeSingle();
        try {
          if (perfil?.account_completed_at) {
            await supabaseAdmin.auth.resetPasswordForEmail(email, { redirectTo: `${SITE}/reset-password` });
          } else {
            const full_name = [compra.first_name, compra.last_name].filter(Boolean).join(" ") || undefined;
            const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, { redirectTo: `${SITE}/registro`, data: full_name ? { full_name } : {} });
            if (error) {
              // Cuenta invitada que ya existe: enlace de acceso único hacia /registro.
              await supabaseAdmin.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${SITE}/registro` } });
            }
          }
        } catch {
          console.error("[access-request] send failed", { email });
        }
        return ok();
      },
    },
  },
});
