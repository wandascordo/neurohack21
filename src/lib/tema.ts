import { supabase } from "@/integrations/supabase/client";

export type Tema = "light" | "dark";

let tema: Tema | null = null;
let cargado = false;
const listeners = new Set<(t: Tema) => void>();

function aplicar(t: Tema) {
  if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", t === "dark");
}

function preferenciaSistema(): Tema {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

export function getTema(): Tema {
  return tema ?? preferenciaSistema();
}

export function suscribirTema(fn: (t: Tema) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Cambia el tema, lo aplica globalmente y lo persiste en el perfil. */
export function setTema(t: Tema) {
  tema = t;
  aplicar(t);
  listeners.forEach((fn) => fn(t));
  supabase.auth.getUser().then(({ data }) => {
    if (!data.user) return;
    supabase
      .from("profiles")
      .update({ theme: t })
      .eq("id", data.user.id)
      .then(({ error }) => {
        if (error) console.warn("setTema", error.message);
      });
  });
}

/** Carga el tema guardado en el perfil (una sola vez por sesión). */
export async function initTema() {
  if (cargado) return;
  cargado = true;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  const { data: prof } = await supabase.from("profiles").select("theme").eq("id", u.user.id).maybeSingle();
  const t: Tema = prof?.theme === "dark" ? "dark" : "light";
  tema = t;
  aplicar(t);
  listeners.forEach((fn) => fn(t));
}
