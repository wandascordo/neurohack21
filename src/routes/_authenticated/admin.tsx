import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (!data) throw redirect({ to: "/menu" });
  },
  head: () => ({ ...meta("Panel de administración", "Panel privado de Destello Interior."), }),
  component: () => <Placeholder title="Panel de administración" />,
});
