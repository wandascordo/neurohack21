import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

// Dirección anterior: los links ya enviados siguen funcionando.
export const Route = createFileRoute("/bienvenida")({
  validateSearch: z.object({ email: z.string().optional() }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/registro", search, statusCode: 301 });
  },
});
