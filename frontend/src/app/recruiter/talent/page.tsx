"use client";

import React, { useState, useEffect } from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralProgress } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Shield, LayoutGrid, List, Search, ChevronRight } from 'lucide-react';

export default function TalentMatrix() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/jobs/`);
        setJobs(res.data);
        if (res.data.length > 0) {
          setSelectedJobId(res.data[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      const fetchCandidates = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`${API_BASE}/candidates/?job_id=${selectedJobId}`);
          setCandidates(res.data);
        } catch (err) {
          console.error("Failed to fetch candidates:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCandidates();
    }
  }, [selectedJobId]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div className="absolute bottom-0 left-0 w-[100px] h-[1px] bg-[var(--cyan)] opacity-60 shadow-[0_0_10px_var(--cyan)]" />
        <div>
           <SecTitle className="!mb-2">Operational Matrix</SecTitle>
           <h1 className="text-3xl font-black font-display text-[var(--text)] tracking-tighter uppercase">Talent Pulse Visualization</h1>
        </div>
        
        <div className="flex items-center gap-4 bg-[var(--navy2)] border border-white/5 rounded-full px-5 py-2 group hover:border-[var(--cyan)] transition-all">
           <span className="text-[9px] text-[var(--dim)] font-black uppercase tracking-widest leading-none">ACTIVE JOB STREAM</span>
           <div className="flex items-center gap-2 cursor-pointer">
              <select 
                className="bg-transparent border-none text-[11px] font-black text-[var(--cyan)] uppercase outline-none cursor-pointer appearance-none neural-glow-cyan pr-4"
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(Number(e.target.value))}
              >
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
              <LayoutGrid className="w-3 h-3 text-[var(--dim)] -ml-4" />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* L-Sidebar: Search & Filters */}
        <div className="lg:col-span-1 space-y-6">
           <div className="p-4 bg-[var(--navy2)] rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-[var(--dim)] uppercase tracking-widest">
                 <Search className="w-3 h-3" /> Candidate Search
              </div>
              <input className="w-full bg-[var(--navy3)] border border-white/5 rounded-lg px-3 py-2 text-[10px] text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--cyan)] transition-all" placeholder="Neural signature..." />
              
              <div className="pt-4 border-t border-white/5 space-y-3">
                 <div className="text-[9px] font-black text-[var(--dim)] uppercase tracking-widest leading-none">Filters</div>
                 <div className="space-y-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                    {['Senior Node', 'Verified Link', 'Immediate Active'].map(f => (
                       <label key={f} className="flex items-center gap-2 cursor-pointer group">
                          <div className="w-3 h-3 rounded border border-white/20 group-hover:border-[var(--cyan)]" />
                          <span className="text-[10px] font-medium text-[var(--muted)] group-hover:text-[var(--text)]">{f}</span>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
           
           <Card className="!bg-gradient-to-br !from-[rgba(0,241,254,0.03)] !to-transparent border-none">
              <div className="flex items-center gap-2 mb-2">
                 <Target className="w-3.5 h-3.5 text-[var(--cyan)]" />
                 <span className="text-[10px] font-black text-[var(--cyan)] tracking-widest uppercase neural-glow-cyan">Neural Target</span>
              </div>
              <p className="text-[9px] text-[var(--dim)] leading-relaxed font-medium">Auto-deployING candidate link scripts for top 3 matching nodes in this mission pulse.</p>
           </Card>
        </div>

        {/* R-Main: Candidate Pulse list */}
        <div className="lg:col-span-3 space-y-4">
           {isLoading ? (
             [1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-[var(--navy2)] rounded-3xl animate-pulse" />)
           ) : candidates.length === 0 ? (
             <div className="py-32 text-center flex flex-col items-center gap-4 opacity-20">
                <Users className="w-12 h-12" />
                <div className="text-[10px] font-black tracking-[0.5em] uppercase">No neural signals detected.</div>
             </div>
           ) : (
             candidates.map((cand, idx) => {
               const isPremium = cand.score >= 85;
               return (
                 <motion.div 
                   key={cand.id} 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="flex items-center gap-6 p-5 bg-[var(--navy2)] border border-white/5 rounded-2xl hover:bg-[var(--navy3)] hover:border-[var(--border-active)] transition-all cursor-pointer group relative overflow-hidden"
                 >
                   {isPremium && <div className="absolute top-0 left-0 w-[4px] h-full bg-gradient-to-b from-[var(--cyan)] to-[var(--purple)]" />}
                   
                   <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--navy3)] to-[var(--navy2)] border border-white/5 flex items-center justify-center shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.2)] group-hover:border-[var(--cyan)] transition-colors">
                     <span className="text-sm font-black text-[var(--cyan)] italic">{cand.name ? cand.name.substring(0, 1) : '?'}</span>
                   </div>

                   <div className="flex-1 space-y-3">
                     <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                         <div className="text-[14px] font-black text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors">{cand.name}</div>
                         <div className="text-[9px] text-[var(--dim)] font-black uppercase tracking-widest">Signature: #{cand.id?.toString().padStart(4, '0')}</div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="text-right">
                             <div className="text-[14px] font-black font-display text-[var(--cyan)] neural-glow-cyan leading-none">{cand.score}%</div>
                             <div className="text-[7px] text-[var(--dim)] font-black uppercase tracking-[0.3em] mt-1">Resonance</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--dim)] group-hover:translate-x-1 transition-transform" />
                       </div>
                     </div>

                     <div className="space-y-1.5">
                        <NeuralProgress value={cand.score} />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {cand.skills?.slice(0, 4).map((s: string) => <NeuralBadge key={s} variant="gray" className="!bg-white/5 !border-none !text-[8.5px] italic">{s}</NeuralBadge>)}
                          {cand.missing_skills?.length > 0 && (
                            <NeuralBadge variant="red" className="!bg-transparent !border-none !text-[8.5px] lowercase italic opacity-60">Waitlist: {cand.missing_skills[0]} (+{cand.missing_skills.length-1})</NeuralBadge>
                          )}
                        </div>
                     </div>
                   </div>

                   <div className="hidden md:flex flex-col gap-2">
                       <NeuralButton size="sm">Neural Link</NeuralButton>
                       <NeuralButton size="sm" variant="ghost">Archive</NeuralButton>
                   </div>
                 </motion.div>
               );
             })
           )}
        </div>
      </div>
    </div>
  );
}


