import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_daily_logs",
  title: "Ver registro diario",
  description: "Lista los registros del reto de 21 días del usuario (foco, reflexión, prácticas).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("daily_logs")
      .select("day_number, logged_at, focus_level, reflection, missed_practice, how_resumed, arrival_tags, body_scan, coherence_breathing, guided_visualization")
      .order("day_number");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const logs = (data ?? []).map((l) => ({
      day_number: l.day_number,
      logged_at: l.logged_at,
      focus_level: l.focus_level,
      reflection: l.reflection,
      missed_practice: l.missed_practice,
      how_resumed: l.how_resumed,
      arrival_tags: [...l.arrival_tags],
      body_scan: l.body_scan,
      coherence_breathing: l.coherence_breathing,
      guided_visualization: l.guided_visualization,
    }));
    return { content: [{ type: "text", text: JSON.stringify(logs) }], structuredContent: { logs } };
  },
});
