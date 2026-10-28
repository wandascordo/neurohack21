import type { ErrorComponentProps } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import bookLogo from "@/assets/book-logo.svg.asset.json";
import illustration404 from "@/assets/404-illustration.png.asset.json";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { initInstallPrompt } from "@/lib/install-prompt";

function NotFoundComponent() {
  const [destino, setDestino] = useState<"/" | "/inicio" | null>(null);
  useEffect(() => {
    let activo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (activo) setDestino(data.session ? "/inicio" : "/");
    });
    return () => {
      activo = false;
    };
  }, []);

  const boton =
    "flex h-[52px] w-full items-center justify-center rounded-full bg-carbon px-6 text-base font-semibold uppercase text-tiza md:w-fit";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between bg-tiza px-5 py-[30px] font-rethink-sans">
      <div className="flex self-stretch justify-center">
        <span
          aria-label="Neurohack 21™"
          role="img"
          className="block h-3 w-[100px] bg-carbon"
          style={{ mask: `url(${bookLogo.url}) center / contain no-repeat`, WebkitMask: `url(${bookLogo.url}) center / contain no-repeat` }}
        />
      </div>
      <main className="flex w-full max-w-[360px] flex-col items-center md:max-w-[520px]">
        <img src={illustration404.url} alt="" aria-hidden="true" className="h-auto w-full max-w-[388px]" />
        <p className="text-base font-semibold leading-none text-piedra">404</p>
        <h1 className="mt-3 text-center text-[32px] font-normal leading-[1.1] tracking-[-1.5px] text-carbon md:text-[44px] md:tracking-[-2px]">
          Este camino no existe
        </h1>
        <p className="mt-4 max-w-80 text-center text-base leading-normal tracking-tight text-piedra md:max-w-[420px]">
          Puede que el enlace haya cambiado o que la página ya no esté. Volvé al inicio y seguimos desde ahí.
        </p>
        <div className="mt-8 flex w-full justify-center">
          {destino ? (
            <Link to={destino} className={boton}>
              Volver al inicio
            </Link>
          ) : (
            <button type="button" disabled className={boton}>
              Volver al inicio
            </button>
          )}
        </div>
      </main>
      <p className="w-full max-w-[360px] text-center text-sm leading-snug tracking-tight text-carbon md:max-w-[520px]">
        ¿Necesitás ayuda? Escribinos a<br className="md:hidden" />
        <span className="hidden md:inline"> </span>
        <a href="mailto:soporte@destellointerior.com" className="text-carbon underline">
          soporte@destellointerior.com
        </a>
      </p>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Neurohack 21 — Destello Interior" },
      { name: "description", content: "Libro interactivo del reto de 21 días de atención." },
      { name: "author", content: "Destello Interior" },
      { property: "og:title", content: "Neurohack 21 — Destello Interior" },
      { property: "og:description", content: "Libro interactivo del reto de 21 días de atención." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0f1424" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Neurohack 21" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initInstallPrompt();
  }, []);

  // Si una pantalla falla al cargar por una versión desactualizada, recargar una sola vez.
  useEffect(() => {
    const KEY = "nh21-preload-reload";
    const onPreloadError = (e: Event) => {
      if (sessionStorage.getItem(KEY)) return;
      e.preventDefault();
      sessionStorage.setItem(KEY, "1");
      window.location.reload();
    };
    const t = window.setTimeout(() => sessionStorage.removeItem(KEY), 10000);
    window.addEventListener("vite:preloadError", onPreloadError);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("vite:preloadError", onPreloadError);
    };
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div key={pathname} className="animate-fade-in">
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
