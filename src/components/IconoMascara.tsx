// Íconos de la librería de Figma del usuario (PNG monocromo con canal alpha).
// Se renderizan como máscara CSS para que el color salga del texto del padre:
// así el mismo ícono se ve Piedra en estado inactivo y Tiza sobre Salvia en activo.
export type AssetPuntero = { url: string };

export function IconoMascara({ asset, className = "h-6 w-6" }: { asset: AssetPuntero; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 bg-current ${className}`}
      style={{ mask: `url(${asset.url}) center / contain no-repeat`, WebkitMask: `url(${asset.url}) center / contain no-repeat` }}
    />
  );
}
