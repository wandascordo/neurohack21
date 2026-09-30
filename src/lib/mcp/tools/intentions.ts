import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_implementation_intentions",
  title: "Ver planes si-entonces",
  description: "Lista los planes de intención de implementación (si-entonces) del usuario.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    const { data, error } = await supabaseForUser(ctx)
      .from("implementation_intentions")
      .select("position, if_situation, then_action")
      .order("position");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const intentions = (data ?? []).map((i) => ({
      position: i.position,
      if_situation: i.if_situation,
      then_action: i.then_action,
    }));
    return { content: [{ type: "text", text: JSON.stringify(intentions) }], structuredContent: { intentions } };
  },
});
