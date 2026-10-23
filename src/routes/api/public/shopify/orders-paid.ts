import { createFileRoute } from "@tanstack/react-router";

const REDIRECT = "https://neurohack21.com/registro";

async function firmaValida(body: string, header: string | null, secret: string) {
  if (!header) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
  const esperado = btoa(String.fromCharCode(...sig));
  if (esperado.length !== header.length) return false;
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) diff |= esperado.charCodeAt(i) ^ header.charCodeAt(i);
  return diff === 0;
}

const txt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : null);

type Orden = {
  id?: number | string;
  email?: string;
  customer?: { email?: string; first_name?: string; last_name?: string };
  billing_address?: { first_name?: string; last_name?: string; name?: string };
  shipping_address?: { name?: string };
  line_items?: { product_id?: number | string | null }[];
};

export function nombreDe(o: Orden): { first: string | null; last: string | null } {
  const c = o.customer, b = o.billing_address;
  if (txt(c?.first_name) || txt(c?.last_name)) return { first: txt(c?.first_name), last: txt(c?.last_name) };
  if (txt(b?.first_name) || txt(b?.last_name)) return { first: txt(b?.first_name), last: txt(b?.last_name) };
  const full = txt(b?.name) ?? txt(o.shipping_address?.name);
  if (!full) return { first: null, last: null };
  const [first, ...rest] = full.split(/\s+/);
  return { first: first ?? null, last: rest.length ? rest.join(" ") : null };
}

export const Route = createFileRoute("/api/public/shopify/orders-paid")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["SHOPIFY_WEBHOOK_SECRET"];
        const body = await request.text();
        if (!secret || !(await firmaValida(body, request.headers.get("x-shopify-hmac-sha256"), secret)))
          return new Response("Invalid signature", { status: 401 });

        const topic = request.headers.get("x-shopify-topic");
        if (topic && topic !== "orders/paid") return Response.json({ ok: true, ignored: "topic" });

        let o: Orden;
        try { o = JSON.parse(body); } catch { return Response.json({ ok: true, ignored: "invalid_json" }); }
        const orderId = o.id != null ? String(o.id) : null;
        const email = (o.email || o.customer?.email || "").trim().toLowerCase();
        if (!orderId || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return Response.json({ ok: true, ignored: "missing_email" });

        const ids = (process.env["SHOPIFY_PRODUCT_IDS"] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        const aviso = ids.length ? undefined : "SHOPIFY_PRODUCT_IDS no está cargado: se aceptan todos los pedidos.";
        if (ids.length && !(o.line_items ?? []).some((li) => li.product_id != null && ids.includes(String(li.product_id))))
          return Response.json({ ok: true, ignored: "product" });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: existe } = await supabaseAdmin.from("purchases").select("id").eq("shopify_order_id", orderId).maybeSingle();
        if (existe) return Response.json({ ok: true, duplicate: true, aviso });

        const { first, last } = nombreDe(o);
        const { error: insErr } = await supabaseAdmin.from("purchases")
          .insert({ shopify_order_id: orderId, email, first_name: first, last_name: last, status: "active" });
        if (insErr) {
          if (insErr.code === "23505") return Response.json({ ok: true, duplicate: true, aviso });
          console.error("[shopify] insert failed", { orderId, email });
          return new Response("Error", { status: 500 });
        }
        console.log("[shopify] order paid", { orderId, email });

        const { data: perfil } = await supabaseAdmin.from("profiles").select("id").eq("email", email).maybeSingle();
        if (perfil) return Response.json({ ok: true, invited: false, existing_account: true, aviso });

        const full_name = [first, last].filter(Boolean).join(" ") || undefined;
        const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, { redirectTo: REDIRECT, data: full_name ? { full_name } : {} });
        if (error) {
          const ya = /already|registered|exists/i.test(error.message);
          if (!ya) {
            await supabaseAdmin.from("purchases").update({ status: "error", error_message: error.message.slice(0, 500) }).eq("shopify_order_id", orderId);
            console.error("[shopify] invite failed", { orderId, email });
          }
          return Response.json({ ok: true, invited: false, aviso });
        }
        try {
          const { notifyAdmin } = await import('@/lib/admin-notification');
          const { sendTemplateEmail } = await import('@/lib/email-templates/send-email');
          await notifyAdmin(sendTemplateEmail, 'invitation', email, `shopify-${orderId}`);
        } catch { console.warn('[shopify] admin notification failed'); }
        return Response.json({ ok: true, invited: true, aviso });
      },
    },
  },
});
