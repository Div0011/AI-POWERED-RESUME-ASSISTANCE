"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, BarChart3, LogIn, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Auto transition intro
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000); // 2s total duration for intro

    return () => clearTimeout(timer);
  }, []);

  // Main Role Selection
  const roles = [
    {
      id: 'recruiter',
      label: "RECRUITERS",
      desc: "Hire top talent faster with AI automation.",
      path: "/recruiter",
      color: "group-hover:text-purple-300"
    },
    {
      id: 'candidate',
      label: "CANDIDATES",
      desc: "Optimize your resume and find your dream job.",
      path: "/candidate",
      color: "group-hover:text-pink-300"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans bg-[var(--background)]">
      {/* Optimized Static Background Glow - Zero Lag */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--primary)] opacity-15 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent)] opacity-10 blur-[120px] rounded-full" />
      </div>

      <div className="flex flex-col items-center justify-center z-10 w-full max-w-7xl mx-auto px-6 relative min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: showIntro ? 0 : -50, /* Slide up when intro finishes */
            scale: 1
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center relative z-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] text-[var(--primary)] text-xs font-bold tracking-[0.3em] uppercase mb-8 ml-1">
            Agentic AI System v2.0
          </span>
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)]/50" style={{ fontFamily: 'var(--font-agale)' }}>
            RECRUITMENT
          </h1>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" style={{ fontFamily: 'var(--font-agale)' }}>
            INTELLIGENCE
          </h1>
          <p className="text-lg md:text-xl text-[var(--foreground)]/40 max-w-2xl mx-auto font-mono tracking-wide leading-relaxed">
             // OPTIMIZING TALENT CONNECTION PROTOCOLS
          </p>
        </motion.div>

        {!showIntro && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mt-16"
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(role.path)}
                className="glass-panel p-10 rounded-3xl cursor-pointer group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col items-start justify-between min-h-[360px]"
              >
                <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${role.id === 'recruiter' ? 'from-[var(--primary)]/10' : 'from-[var(--accent)]/10'} to-transparent rounded-bl-[100%] -mr-20 -mt-20 transition-opacity opacity-30 group-hover:opacity-60 blur-3xl`} />

                <div className="relative z-10 w-full">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-[var(--obsidian)] border border-[var(--card-border)] ${role.id === 'recruiter' ? 'text-[var(--primary)] shadow-[var(--primary)]/20' : 'text-[var(--accent)] shadow-[var(--accent)]/20'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {role.id === 'recruiter' ? <Briefcase className="w-8 h-8" /> : <Users className="w-8 h-8" />}
                  </div>

                  <h3 className="text-4xl font-bold mb-4 text-[var(--foreground)] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--foreground)] group-hover:to-[var(--foreground)]/70 transition-all font-agale tracking-wide">
                    {role.label}
                  </h3>
                  <p className="text-[var(--foreground)]/50 text-lg leading-relaxed font-light">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-12 w-full flex items-center justify-between border-t border-[var(--card-border)] pt-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/30 group-hover:text-[var(--primary)] transition-colors">
                    Access Portal
                  </span>
                  <div className="p-2 rounded-full bg-[var(--foreground)]/5 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
