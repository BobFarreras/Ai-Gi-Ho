// src/app/(auth)/login/page.tsx - Página de acceso con fondo dinámico y formulario de login.
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { CyberBackground } from "@/components/landing/CyberBackground";

export default function LoginPage() {
  return (
    // relative y min-h-dvh aseguran que ocupe toda la pantalla.
    // bg-[#010308] mantiene el fondo oscuro si el Canvas tarda unos ms en cargar.
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#010308] p-4 sm:p-8 selection:bg-cyan-500/30">
      
      {/* Nuestro fondo interactivo de hiperconexiones */}
      <CyberBackground />
      <Link
        href="/"
        aria-label="Volver a la landing"
        className="absolute left-4 top-4 z-20 border border-cyan-500/45 bg-black/60 px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.2em] text-cyan-300 transition-colors hover:border-cyan-300 hover:text-cyan-100"
      >
        Volver
      </Link>
      
      {/* El contenedor del formulario con un z-index alto para estar sobre el Canvas */}
      <div className="relative z-10 w-full max-w-md shrink-0">
        <LoginForm />
      </div>

    </main>
  );
}
