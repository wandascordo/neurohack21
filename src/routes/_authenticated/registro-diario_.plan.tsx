import { createFileRoute } from "@tanstack/react-router";
import { BookScreen, TopBar } from "@/components/libro/BookChrome";
import { meta } from "@/components/Placeholder";
import { RegistroBottomNav } from "@/components/registro/RegistroUI";

export const Route = createFileRoute("/_authenticated/registro-diario_/plan")({
  head: () => meta("Mi plan de mantenimiento", "Mi plan de mantenimiento dentro del Registro Diario de Neurohack 21."),
  component: () => (
    <BookScreen>
      <TopBar />
      <div className="flex w-full flex-col gap-5 py-5">
        <h1 className="text-4xl font-normal leading-[1.1] text-carbon">Mi plan de mantenimiento</h1>
        <p className="text-base font-normal text-piedra">Esta sección se completa en el siguiente paso.</p>
      </div>
      <RegistroBottomNav />
    </BookScreen>
  ),
});