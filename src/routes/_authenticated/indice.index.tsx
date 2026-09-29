import { createFileRoute, Link } from "@tanstack/react-router";
import { meta } from "@/components/Placeholder";
import { Onboarding } from "@/components/Onboarding";
import { BookScreen, TopBar, btnPrimary } from "@/components/libro/BookChrome";
import { INDICE } from "@/lib/libro";

export const Route = createFileRoute("/_authenticated/indice/")({
  head: () => meta("Índice de Contenidos", "Todas las partes y módulos de Neurohack 21."),
  component: Indice,
});

function Indice() {
  return (
    <BookScreen fill>
      <Onboarding />
      <div className="flex w-full flex-1 flex-col gap-9">
        <TopBar />
        <div className="flex flex-1 flex-col items-center gap-2.5 self-stretch">
          <h1 className="h-fit self-stretch text-left text-[28px] font-normal leading-[1.1] tracking-[-1.50px] text-carbon">Índice</h1>
          <nav className="flex h-fit flex-col items-center self-stretch">
            {INDICE.map((g) => (
              <div key={g.titulo} className="flex h-fit flex-col justify-center self-stretch border-b border-carbon-10/10 p-2.5">
                {g.slug ? (
                  <Link to="/indice/$seccion" params={{ seccion: g.slug }} className="text-left text-base font-normal tracking-tight text-carbon">{g.titulo}</Link>
                ) : (
                  <p className="text-left text-base font-normal tracking-tight text-carbon">{g.titulo}</p>
                )}
                {g.items.map((i) => (
                  <div key={i.slug} className="flex flex-col px-2.5 pt-2.5">
                    <Link to="/indice/$seccion" params={{ seccion: i.slug }} className="text-left text-sm font-normal tracking-tight text-carbon">{i.label}</Link>
                  </div>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <Link to="/indice/$seccion" params={{ seccion: "prologo" }} className={btnPrimary}>Comenzar</Link>
      </div>
    </BookScreen>
  );
}
