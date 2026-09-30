import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_focus_assessments",
  title: "Ver autoevaluaciones de foco",
  description: "Lista las autoevaluaciones de foco del usuario con su puntaje total y fecha.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("focus_assessments")
      .select("moment, total_score, assessed_at")
      .order("assessed_at");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const assessments = (data ?? []).map((a) => ({
      moment: String(a.moment),
      total_score: a.total_score,
      assessed_at: a.assessed_at,
    }));
    return { content: [{ type: "text", text: JSON.stringify(assessments) }], structuredContent: { assessments } };
  },
});
