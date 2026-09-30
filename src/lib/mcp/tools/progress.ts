import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_reading_progress",
  title: "Ver progreso de lectura",
  description: "Devuelve la última sección leída del libro y el estado de acceso del usuario.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("profiles")
      .select("last_read_slug, access_status, first_login_at")
      .eq("id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const progress = {
      last_read_slug: data?.last_read_slug ?? null,
      access_status: data?.access_status ?? null,
      first_login_at: data?.first_login_at ?? null,
    };
    return { content: [{ type: "text", text: JSON.stringify(progress) }], structuredContent: { progress } };
  },
});
