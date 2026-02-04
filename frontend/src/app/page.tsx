"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  // Animation Phase: 0 = Init (Big Logo), 1 = Move Logo, 2 = Show Content
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Sequence the Intro
    // Phase 0 -> 1: Move Logo after 1s
    const timer1 = setTimeout(() => setPhase(1), 1000);
    // Phase 1 -> 2: Show Content after logo settles (approx 0.8s transition)
    const timer2 = setTimeout(() => setPhase(2), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const roles = [
    {
      id: 'recruiter',
      label: "RECRUITERS",
      desc: "Hire faster with AI automation.",
      path: "/recruiter",
    },
    {
      id: 'candidate',
      label: "CANDIDATES",
      desc: "Optimize your resume & get hired.",
      path: "/candidate",
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-[var(--primary)] selection:text-black">
      {/* Background Glow (Cinematic Atmosphere) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] bg-[var(--primary)]/10 blur-[180px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* 2. Kinetic Logo Animation */}
      <motion.div
        initial={{ top: "50%", left: "50%", x: "-50%", y: "-50%", fontSize: "20vw" }}
        animate={phase >= 1 ? { top: "20px", left: "20px", x: "0%", y: "0%", fontSize: "2rem" } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute z-50 flex flex-col sm:flex-row items-center gap-4 font-bold tracking-tighter text-[var(--foreground)] font-agale leading-none whitespace-nowrap"
      >
        <span className="block">GET IT!</span>
        {phase >= 1 && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.3, x: 0 }}
            className="hidden sm:block text-[10px] font-mono uppercase tracking-[0.4em] mt-2 sm:mt-0"
          >
                // AGENTIC_RECRUITMENT_OS
          </motion.span>
        )}
      </motion.div>

      {/* 3. Main Content (Fades in after logo moves) */}
      {phase >= 2 && (
        <div className="flex flex-col items-center justify-start w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 pt-24 sm:pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full max-w-4xl mt-4 sm:mt-8"
          >
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => router.push(role.path)}
                className="glass-panel p-6 sm:p-10 rounded-2xl sm:rounded-3xl cursor-pointer group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-start justify-between min-h-[300px] sm:min-h-[400px]"
              >
                {/* Card Content */}
                <div className="relative z-10 w-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--primary)] shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {role.id === 'recruiter' ? <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" /> : <Users className="w-6 h-6 sm:w-8 sm:h-8" />}
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-[var(--foreground)] font-agale tracking-wide">
                    {role.label}
                  </h3>
                  <p className="text-[var(--foreground)]/60 text-sm sm:text-lg leading-relaxed font-light">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-8 sm:mt-12 w-full flex items-center justify-between border-t border-[var(--card-border)] pt-4 sm:pt-6">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)]/40 group-hover:text-[var(--primary)] transition-colors">
                    Initialize
                  </span>
                  <div className="p-2 sm:p-3 rounded-full bg-[var(--foreground)]/5 group-hover:bg-[var(--primary)] group-hover:text-black transition-all">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
