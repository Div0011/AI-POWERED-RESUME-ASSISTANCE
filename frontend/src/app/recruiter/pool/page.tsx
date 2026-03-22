"use client";

import React from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralProgress } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Fingerprint, Zap, Cpu, Filter, MousePointer2 } from 'lucide-react';

export default function GlobalTalentPool() {
  const candidates = [
    { name: 'Sarah R.', initials: 'SR', color: 'text-[var(--cyan)]', skills: 94, role: 'Full Stack Arch', exp: '6 Yrs' },
    { name: 'Dev J.', initials: 'DJ', color: 'text-[var(--purple)]', skills: 89, role: 'Neural Eng', exp: '4 Yrs' },
    { name: 'Ananya L.', initials: 'AL', color: 'text-green-400', skills: 82, role: 'Data Synth', exp: '5 Yrs' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
           <SecTitle className="!mb-0">Vault Access</SecTitle>
           <h1 className="text-4xl font-black font-display text-[var(--text)] tracking-tighter uppercase">Neural Talent Pool</h1>
        </div>
        <div className="flex gap-3">
           <NeuralButton variant="secondary" size="sm" className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5" /> Index Status: Sync
           </NeuralButton>
        </div>
      </header>
      
      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] rounded-2xl blur opacity-10 group-focus-within:opacity-25 transition-opacity" />
         <div className="relative flex gap-1 bg-[var(--navy2)] border border-white/5 rounded-2xl p-1 shadow-2xl">
            <div className="flex items-center pl-6 pr-2">
               <Search className="w-5 h-5 text-[var(--dim)]" />
            </div>
            <input 
              className="flex-1 bg-transparent border-none px-4 py-4 text-[13px] font-bold text-[var(--text)] placeholder:text-[var(--dim)] outline-none" 
              placeholder="Search by neural intent: 'React architect with fintech sync'..." 
              defaultValue="Full stack engineer Node.js React"
            />
            <div className="pr-1 flex items-center">
               <NeuralButton className="h-full px-8 rounded-xl font-display text-xs">Execute Search</NeuralButton>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between px-2">
         <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.4em] flex items-center gap-3">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> 384-Dim Vector Match · Time: 38ms
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-[var(--dim)] hover:text-[var(--cyan)] transition-colors cursor-pointer uppercase tracking-widest">
               <Filter className="w-3.5 h-3.5" /> High Resonance
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((cand, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[var(--navy2)] border border-white/5 rounded-3xl p-6 hover:border-[var(--cyan)] transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Fingerprint className="w-20 h-20 text-[var(--cyan)]" />
             </div>

             <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--navy3)] border border-white/5 flex items-center justify-center shadow-inner group-hover:border-[var(--cyan)] transition-colors">
                   <span className={`text-lg font-black italic ${cand.color}`}>{cand.initials}</span>
                </div>
                <div className="text-right">
                   <div className="text-sm font-black text-[var(--text)] group-hover:text-[var(--cyan)] transition-transform leading-none">{cand.skills}%</div>
                   <div className="text-[7px] font-black uppercase tracking-widest text-[var(--dim)] mt-1">Similarity</div>
                </div>
             </div>

             <div className="space-y-4 relative z-10">
                <div>
                   <div className="text-[10px] font-black text-[var(--dim)] uppercase tracking-widest leading-none mb-1">{cand.role}</div>
                   <div className="text-lg font-black font-display text-[var(--text)] tracking-tight">{cand.name}</div>
                </div>

                <div className="flex items-center gap-4 text-[9px] font-black text-[var(--dim)] uppercase tracking-[0.2em] border-t border-white/5 pt-4">
                   <span className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3 text-[var(--purple)]" /> {cand.exp} EXP</span>
                   <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-[var(--cyan)]" /> ACTIVE</span>
                </div>
             </div>

             <div className="mt-8 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <NeuralButton size="sm" className="flex-1">Link Node</NeuralButton>
                <NeuralButton size="sm" variant="ghost" className="!p-2"><Search className="w-3.5 h-3.5" /></NeuralButton>
             </div>
          </motion.div>
        ))}
        
        {/* Placeholder Node */}
        <div className="border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 opacity-40 hover:opacity-100 transition-all hover:bg-[var(--navy2)] cursor-pointer group">
           <div className="w-10 h-10 rounded-full border border-dashed border-[var(--dim)] flex items-center justify-center mb-4 group-hover:border-[var(--cyan)] group-hover:rotate-12 transition-all">
              <span className="text-xl text-[var(--dim)] group-hover:text-[var(--cyan)]">+</span>
           </div>
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--dim)] group-hover:text-[var(--cyan)]">Deploy Search Node</div>
        </div>
      </div>
    </div>
  );
}

