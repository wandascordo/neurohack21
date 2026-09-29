import { createFileRoute } from "@tanstack/react-router";
import { Placeholder, meta } from "@/components/Placeholder";

export const Route = createFileRoute("/_authenticated/kit-emergencia")({
  head: () => meta("Kit de Emergencia Anti-Distracción", "Recursos rápidos para recuperar el foco."),
  component: () => (
    <Placeholder title="Kit de Emergencia Anti-Distracción" description="Un espacio para volver a tu práctica cuando la atención se dispersa.">
      <h2 className="text-base font-semibold">Prácticas del reto</h2>
      <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
        {["Escaneo corporal", "Respiración de coherencia cardíaca", "Visualización dirigida"].map((practice) => <li key={practice} className="py-4">{practice}</li>)}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">Los recursos guiados se incorporarán más adelante.</p>
    </Placeholder>
  ),
});
