"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PipelineOrb, NeuralButton } from "@/components/wireframe/UI";
import { Zap, Target, ArrowRight, Shield } from "lucide-react";

export default function NeuralHome() {
  const router = useRouter();
  const [hoveredPanel, setHoveredPanel] = useState<"recruiter" | "candidate" | null>(null);

  const handlePanelClick = (role: "recruiter" | "candidate") => {
    const subRoute = role === "recruiter" ? "dashboard" : "jobs";
    router.push(`/${role}/${subRoute}`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--navy)] overflow-hidden relative">
      
      {/* Central Neural Core (Visible on Desktop) */}
      <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none items-center justify-center">
         <div className="relative group">
            <div className="absolute inset-x-0 top-0 h-[200px] w-[200px] bg-[var(--cyan)] rounded-full blur-[120px] opacity-[0.1] -translate-x-1/2 -translate-y-1/2" />
            <PipelineOrb size={280} />
         </div>
      </div>

      {/* RECRUITER CHANNEL */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer relative overflow-hidden group z-10 border-r border-white/5"
        initial={{ flex: 1 }}
        animate={hoveredPanel === "recruiter" ? { flex: 1.4 } : hoveredPanel === "candidate" ? { flex: 0.6 } : { flex: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onHoverEnter={() => setHoveredPanel("recruiter")}
        onHoverLeave={() => setHoveredPanel(null)}
        onClick={() => handlePanelClick("recruiter")}
      >
        {/* Ambient Neural Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
           <svg width="100%" height="100%">
              <pattern id="gridRec" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--cyan)" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridRec)" />
           </svg>
        </div>

        <motion.div className="relative z-20 text-center max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[var(--navy2)] border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,196,255,0.05)] group-hover:border-[var(--cyan)] transition-colors">
             <Shield className="w-8 h-8 text-[var(--cyan)] opacity-60" />
          </div>
          <div className="text-[10px] text-[var(--cyan)] font-black uppercase tracking-[0.5em] mb-4 neural-glow-cyan">Enterprise Matrix</div>
          <h1 className="text-5xl font-black font-display text-[var(--text)] tracking-tighter mb-4 leading-none">RECRUITER</h1>
          <p className="text-xs text-[var(--muted)] leading-relaxed italic opacity-60 mb-8">
             Synchronize candidate neural signals with global mission requirements.
          </p>
          <NeuralButton variant="secondary" size="md" className="group-hover:bg-[var(--cyan)] group-hover:text-black transition-all">
             Initialize Console <ArrowRight className="w-4 h-4 ml-2" />
          </NeuralButton>
        </motion.div>
      </motion.div>

      {/* CANDIDATE CHANNEL */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center p-12 cursor-pointer relative overflow-hidden group z-10"
        initial={{ flex: 1 }}
        animate={hoveredPanel === "candidate" ? { flex: 1.4 } : hoveredPanel === "recruiter" ? { flex: 0.6 } : { flex: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        onHoverEnter={() => setHoveredPanel("candidate")}
        onHoverLeave={() => setHoveredPanel(null)}
        onClick={() => handlePanelClick("candidate")}
      >
        {/* Ambient Neural Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
           <svg width="100%" height="100%">
              <pattern id="gridCand" width="40" height="40" patternUnits="userSpaceOnUse">
                 <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--purple)" strokeWidth="0.5"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#gridCand)" />
           </svg>
        </div>

        <motion.div className="relative z-20 text-center max-w-sm">
          <div className="w-16 h-16 rounded-3xl bg-[var(--navy2)] border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(187,0,253,0.05)] group-hover:border-[var(--purple)] transition-colors">
             <Target className="w-8 h-8 text-[var(--purple)] opacity-60" />
          </div>
          <div className="text-[10px] text-[var(--purple)] font-black uppercase tracking-[0.5em] mb-4 neural-glow-purple">Talent Pulse</div>
          <h1 className="text-5xl font-black font-display text-[var(--text)] tracking-tighter mb-4 leading-none">CANDIDATE</h1>
          <p className="text-xs text-[var(--muted)] leading-relaxed italic opacity-60 mb-8">
             Simulate career trajectories and unlock neural job mission signals.
          </p>
          <NeuralButton variant="secondary" size="md" className="group-hover:bg-[var(--purple)] group-hover:text-black transition-all border-[rgba(214,116,255,0.3)]">
             Unlock Journey <ArrowRight className="w-4 h-4 ml-2" />
          </NeuralButton>
        </motion.div>
      </motion.div>

      {/* System Status Tracker (Bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 text-[10px] font-black text-[var(--dim)] uppercase tracking-[0.4em] flex items-center gap-4">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Neural Link Online
         </div>
         <div className="w-1 h-1 bg-white/10 rounded-full" />
         <div className="opacity-40">Build 0.4.2-Immersive</div>
      </div>
    </div>
  );
}
