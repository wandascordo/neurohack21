import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/kit-emergencia")({
  beforeLoad: () => {
    throw redirect({ to: "/boton-anti-distraccion", replace: true });
  },
});
