import { useNavigate, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BackButton, BookScreen, TopBar } from "@/components/libro/BookChrome";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  const router = useRouter();
  const navigate = useNavigate();

  function goBack() {
    if (window.history.state?.__TSR_index > 0) router.history.back();
    else navigate({ to: "/inicio" });
  }

  return (
    <BookScreen>
      <TopBar />
      <main className="flex w-full min-w-0 flex-col gap-8 py-5 text-carbon">
        <BackButton label="Volver" onClick={goBack} />
        <header className="flex flex-col items-start gap-5">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] font-normal leading-tight">{title}</h1>
            {updated && <p className="text-sm leading-6 text-piedra">Última actualización: {updated}</p>}
          </div>
        </header>
        <article aria-label={title} className="flex min-w-0 flex-col gap-7 text-base leading-7 [overflow-wrap:anywhere] [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_p+ul]:mt-3 [&_a]:text-salvia [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold">
          {children}
        </article>
      </main>
    </BookScreen>
  );
}