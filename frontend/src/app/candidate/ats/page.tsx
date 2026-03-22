"use client";

import React, { useState } from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralBridge } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ChevronDown, CheckCircle, AlertCircle, Sparkles, Wand2 } from 'lucide-react';

export default function ATSKernel() {
  const [showResult, setShowResult] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <SecTitle>Neural ATS Kernel</SecTitle>
      
      <div className="flex items-center gap-4 mb-4 bg-[var(--navy2)] border border-white/5 rounded-full px-5 py-2 w-fit group hover:border-[var(--cyan)] transition-all">
        <span className="text-[10px] text-[var(--dim)] font-black uppercase tracking-widest">Target Mission Profile:</span>
        <div className="flex items-center gap-1.5 cursor-pointer">
           <select className="bg-transparent border-none text-[11px] font-black text-[var(--cyan)] uppercase outline-none cursor-pointer appearance-none neural-glow-cyan pr-4">
             <option>Senior Backend Engineer</option>
             <option>ML Engineer – NLP Focus</option>
           </select>
           <ChevronDown className="w-3 h-3 text-[var(--dim)] -ml-4" />
        </div>
      </div>

      <div 
        className={`border-2 border-dashed ${isUploading ? 'border-[var(--cyan)] animate-pulse' : 'border-white/10'} rounded-3xl p-12 text-center cursor-pointer transition-all hover:bg-[var(--navy2)] hover:border-[var(--cyan)] flex flex-col items-center gap-4 group overflow-hidden relative`}
        onClick={handleUpload}
      >
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-[0.1]" />
        
        <div className="w-16 h-16 rounded-2xl bg-[var(--navy3)] border border-white/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6">
           {isUploading ? <Sparkles className="w-8 h-8 text-[var(--cyan)]" /> : <Upload className="w-8 h-8 text-[var(--dim)] group-hover:text-[var(--cyan)]" />}
        </div>
        <div>
           <div className="text-[14px] text-[var(--text)] font-black uppercase tracking-widest">
              {isUploading ? "Initializing Neural Parse..." : "Drop Mission Resume Profile"}
           </div>
           <div className="text-[10px] text-[var(--dim)] mt-1 font-black uppercase tracking-[0.2em]">or click to upload · max 10MB · PDF Neural Format</div>
        </div>
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6"
          >
            <Card className="!p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                  <Wand2 className="w-32 h-32 text-[var(--cyan)]" />
               </div>

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                  <div className="space-y-2">
                     <NeuralBadge variant="purple">Kernel Analysis Matrix complete</NeuralBadge>
                     <h3 className="text-3xl font-black font-display text-[var(--text)] tracking-tighter">Neural Resonance: 78%</h3>
                  </div>
                  <NeuralBridge score={78} />
               </div>
              
              <div className="grid md:grid-cols-2 gap-8 py-6 border-y border-white/5 mb-8">
                <div className="space-y-4">
                  <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle className="w-3.5 h-3.5 text-green-400" /> Matched Synapses
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['FastAPI', 'PostgreSQL', 'REST APIs', 'Neural Processing'].map(s => <NeuralBadge key={s} variant="cyan" className="!bg-[var(--navy3)] !border-none">{s}</NeuralBadge>)}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-widest flex items-center gap-2">
                     <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Missing Operational Nodes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Docker', 'Redis', 'Kubernetes', 'Cloud Deploy'].map(s => <NeuralBadge key={s} variant="red" className="!bg-[var(--navy3)] !border-none text-red-500">{s}</NeuralBadge>)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[var(--navy2)] rounded-2xl border-l-4 border-l-[var(--cyan)]">
                <div className="flex items-center gap-2 mb-2">
                   <Zap className="w-3.5 h-3.5 text-[var(--cyan)]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[var(--cyan)] neural-glow-cyan">Neural Coach Insight</span>
                </div>
                <p className="text-[11px] text-[var(--muted)] leading-relaxed italic font-medium">
                   "Strong backend fundamentals detected. Synthesizing containerization experience (Docker) will clear the critical operational gap. Re-run simulation after adding DevOps nodes."
                </p>
              </div>
              
              <div className="mt-8 flex gap-4">
                 <NeuralButton onClick={() => window.location.href='/candidate/builder'} className="px-8">✦ Boost Neural Resume</NeuralButton>
                 <NeuralButton variant="ghost" onClick={() => setShowResult(false)}>Execute Re-screen</NeuralButton>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

