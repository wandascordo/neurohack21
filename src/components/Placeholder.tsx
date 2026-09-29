import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Placeholder({
  title,
  back = "/menu",
  children,
}: {
  title: string;
  back?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <Link to={back} className="text-sm text-muted-foreground underline">
        ← Volver
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Pantalla en construcción.</p>
      {children && <div className="mt-8">{children}</div>}
    </main>
  );
}

export function meta(title: string, description: string) {
  const t = `${title} — Neurohack 21`;
  return {
    meta: [
      { title: t },
      { name: "description", content: description },
      { property: "og:title", content: t },
      { property: "og:description", content: description },
    ],
  };
}
