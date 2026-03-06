// src/app/page.tsx - Landing principal del juego con flujo por fases (terminal, narrativa y showcase de acceso).
"use client";

import { useState } from "react";
import Link from "next/link";
import { CyberBackground } from "@/components/landing/CyberBackground";
import { TerminalPrompt } from "@/components/landing/TerminalPrompt";
import { CrawlText } from "@/components/landing/CrawlText";
import { HeroCards } from "@/components/landing/HeroCards";
import { motion, AnimatePresence, Variants } from "framer-motion";

type LandingPhase = "TERMINAL" | "NARRATIVE" | "SHOWCASE";

export default function HomePage() {
  const [phase, setPhase] = useState<LandingPhase>("TERMINAL");
  const [userCode, setUserCode] = useState("");

  const handleTerminalComplete = (code: string) => {
    setUserCode(code);
    setPhase("NARRATIVE");
  };

  const handleSkipNarrative = () => {
    setPhase("SHOWCASE");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#010308] selection:bg-cyan-500/30">
      
      <CyberBackground />

      <AnimatePresence mode="wait">
        {phase === "TERMINAL" && (
          <TerminalPrompt key="terminal" onComplete={handleTerminalComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "NARRATIVE" && (
          <motion.div 
            key="narrative" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 z-40"
          >
            <CrawlText accessCode={userCode} onSkip={handleSkipNarrative} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "SHOWCASE" && (
          <motion.div 
            key="showcase"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            // ARQUITECTURA RESPONSIVA: Altura total asegurada, overflow-y-auto por si la pantalla es enana
            className="absolute inset-0 z-30 flex h-dvh flex-col items-center justify-between overflow-x-hidden overflow-y-auto py-8 px-4 sm:px-6 pointer-events-auto"
          >
            {/* HEADER - flex-shrink-0 garantiza que no se aplaste */}
            <motion.header variants={itemVariants} className="flex-shrink-0 mt-2 text-center pointer-events-none">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                AI-GI-OH
              </h1>
              <span className="text-lg md:text-xl lg:text-2xl text-cyan-500 font-mono tracking-[0.3em] mt-2 block">
                THE AGI WARS
              </span>
            </motion.header>

            {/* CARTAS - flex-1 hace que ocupen EXACTAMENTE el espacio sobrante sin solapar */}
            <motion.div variants={itemVariants} className="flex-1 w-full max-w-5xl flex items-center justify-center min-h-[300px]">
              <HeroCards />
            </motion.div>

            {/* BOTONES - flex-shrink-0 garantiza que siempre estén visibles abajo */}
            <motion.footer variants={itemVariants} className="flex-shrink-0 w-full max-w-3xl flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group relative flex h-14 sm:h-16 w-full sm:w-1/2 items-center justify-center bg-cyan-500 px-4 sm:px-8 font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
              >
                <div className="absolute inset-0 -translate-x-full bg-white/40 skew-x-12 transition-transform duration-500 ease-out group-hover:translate-x-full" />
                <span>Compilar ID</span>
              </Link>
              
              <Link
                href="/login"
                className="relative flex h-14 sm:h-16 w-full sm:w-1/2 items-center justify-center border border-cyan-500/50 bg-black/60 px-4 sm:px-8 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 backdrop-blur-md transition-all hover:border-cyan-300 hover:bg-cyan-900/40 hover:text-cyan-200"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                Conexión Red
              </Link>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
