import { auth, defineMcp } from "@lovable.dev/mcp-js";
import progress from "./tools/progress";
import dailyLogs from "./tools/daily-logs";
import assessments from "./tools/assessments";
import intentions from "./tools/intentions";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "neurohack-21",
  title: "Neurohack 21",
  version: "0.1.0",
  instructions:
    "Herramientas de solo lectura para Neurohack 21: progreso de lectura del libro, registro diario del reto de 21 días, autoevaluaciones de foco y planes si-entonces del usuario conectado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [progress, dailyLogs, assessments, intentions],
});
