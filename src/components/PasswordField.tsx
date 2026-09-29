import { useState } from "react";
import eyeClosed from "@/assets/eye.png.asset.json";
import eyeOpen from "@/assets/eye-open.png.asset.json";

export function PasswordField({ id, placeholder, value, onChange, autoComplete = "new-password" }: { id: string; placeholder: string; value: string; onChange: (v: string) => void; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-row gap-2.5 justify-center items-center self-stretch h-[52px] rounded-full border-2 border-carbon-10/10 bg-transparent py-4 px-6 overflow-hidden focus-within:border-salvia">
      <label htmlFor={id} className="sr-only">{placeholder}</label>
      <input id={id} type={show ? "text" : "password"} autoComplete={autoComplete} minLength={8} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-base font-semibold leading-none text-carbon placeholder:uppercase placeholder:text-piedra focus:outline-none" />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={show}>
        <img className="w-5 h-5" src={show ? eyeOpen.url : eyeClosed.url} alt="" />
      </button>
    </div>
  );
}
