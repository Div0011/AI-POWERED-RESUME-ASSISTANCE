"use client";

import React, { useState } from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralProgress } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Copy, RefreshCcw, Upload, Rocket, Brain, Layers } from 'lucide-react';

export default function ResumeBuilder() {
  const [showResult, setShowResult] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setShowResult(true);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
           <SecTitle className="!mb-0">Neural Lab</SecTitle>
           <h1 className="text-3xl font-black font-display text-[var(--text)] tracking-tighter uppercase">Resume Synthesis</h1>
        </div>
        <div className="flex items-center gap-3">
           <NeuralBadge variant="purple">Matrix Rev 0.9</NeuralBadge>
        </div>
      </header>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* L-SIDE: Input */}
        <div className="space-y-6">
           <Card title="Bullet Point Optimization" sub="Inject achievement-driven STAR signals into weak mission descriptors.">
             <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.2em] mb-2">Operational Fragment</div>
             <textarea 
               className="w-full bg-[var(--navy2)] border border-white/5 rounded-2xl p-5 text-[12px] font-bold text-[var(--text)] h-32 resize-none outline-none focus:border-[var(--cyan)] transition-all placeholder:text-[var(--dim)]" 
               placeholder="Example: 'Built a backend for the app...'"
               defaultValue="Developed the backend API for the mobile application to handle users."
             />
             <NeuralButton className="mt-6 w-full py-4 text-xs flex items-center gap-3" onClick={handleSynthesize} disabled={isSynthesizing}>
               {isSynthesizing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               {isSynthesizing ? "Synthesizing Neurons..." : "✦ Execute Synthesis"}
             </NeuralButton>
           </Card>

           <div className="p-6 bg-[var(--navy2)] border border-dashed border-white/10 rounded-3xl flex flex-col items-center gap-4 text-center group hover:border-[var(--cyan)] transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-[var(--navy3)] flex items-center justify-center border border-white/5 group-hover:rotate-12 transition-transform">
                 <Upload className="w-6 h-6 text-[var(--dim)] group-hover:text-[var(--cyan)]" />
              </div>
              <div>
                 <div className="text-[11px] font-black uppercase tracking-widest text-[var(--text)]">Full Mission Overhaul</div>
                 <div className="text-[9px] text-[var(--dim)] font-black uppercase tracking-[0.2em] mt-1 italic">Submit PDF for complete profile re-writing</div>
              </div>
           </div>
        </div>

        {/* R-SIDE: Result / Coach */}
        <div className="space-y-6">
           <AnimatePresence mode="wait">
             {!showResult && !isSynthesizing ? (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="h-full min-h-[300px] border border-white/5 rounded-3xl flex flex-col items-center justify-center p-10 text-center opacity-30 grayscale"
               >
                  <Brain className="w-16 h-16 mb-4" />
                  <div className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Input Signal</div>
               </motion.div>
             ) : isSynthesizing ? (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="h-full min-h-[300px] bg-[var(--navy3)] rounded-3xl flex flex-col items-center justify-center p-10 text-center relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--cyan)_0%,transparent_70%)] opacity-[0.05] animate-pulse" />
                  <div className="relative z-10 space-y-4">
                     <Layers className="w-12 h-12 text-[var(--cyan)] animate-bounce mx-auto" />
                     <div className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse text-[var(--cyan)] neural-glow-cyan">Optimizing Logic Gates...</div>
                  </div>
               </motion.div>
             ) : (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, x: 20 }}
                 animate={{ opacity: 1, scale: 1, x: 0 }}
                 className="space-y-6"
               >
                 <Card className="!p-8 border-[var(--cyan)] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                      <Rocket className="w-24 h-24 text-[var(--cyan)]" />
                   </div>
                   
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-pulse shadow-[0_0_10px_var(--cyan)]" />
                      <span className="text-[10px] font-black text-[var(--cyan)] uppercase tracking-[0.4em] neural-glow-cyan">Synthesis Complete</span>
                   </div>

                   <div className="bg-[var(--navy2)] border-l-4 border-[var(--cyan)] p-6 rounded-r-2xl text-[13px] leading-relaxed italic font-bold text-[var(--text)] shadow-2xl">
                     "Engineered a high-performance RESTful API ecosystem serving 200k+ MAU, optimizing endpoint latency by 41% through strategic neural caching and SQL node resolution."
                   </div>

                   <div className="flex gap-3 mt-8">
                     <NeuralButton size="sm" className="flex items-center gap-2 px-6">
                        <Copy className="w-3.5 h-3.5" /> Transfer Signal
                     </NeuralButton>
                     <NeuralButton size="sm" variant="ghost" className="flex items-center gap-2" onClick={() => setShowResult(false)}>
                        <RefreshCcw className="w-3.5 h-3.5" /> Re-parse
                     </NeuralButton>
                   </div>
                 </Card>

                 <div className="p-5 bg-[var(--navy3)] rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                       <Wand2 className="w-3.5 h-3.5 text-[var(--purple)]" />
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--purple)]">Neural Enhancement Insight</span>
                    </div>
                    <p className="text-[10px] text-[var(--dim)] leading-relaxed italic">
                       Added quantified achievements (200k+ MAU) and specific technical nodes (Neural Caching) to optimize resonance for Tier-1 Missions.
                    </p>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

