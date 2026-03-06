// src/app/(auth)/register/page.tsx - Página de registro con fondo dinámico y formulario de alta de jugador.
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { CyberBackground } from "@/components/landing/CyberBackground";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#010308] p-4 sm:p-8 selection:bg-cyan-500/30">
      
      {/* Fondo interactivo de hiperconexiones */}
      <CyberBackground />
      <Link
        href="/"
        aria-label="Volver a la landing"
        className="absolute left-4 top-4 z-20 border border-cyan-500/45 bg-black/60 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-300 transition-colors hover:border-cyan-300 hover:text-cyan-100"
      >
        Volver
      </Link>
      
      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md shrink-0">
        <RegisterForm />
      </div>

    </main>
  );
}
