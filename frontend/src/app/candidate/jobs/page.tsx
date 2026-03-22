"use client";

import React, { useState, useEffect } from 'react';
import { Card, NeuralStat, SecTitle, NeuralBadge, NeuralButton, NeuralRadar, NeuralBridge } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE } from '@/config';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Clock, Zap, Target, MessageSquare } from 'lucide-react';

export default function NeuralMissionBoard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    const resumeText = localStorage.getItem('resume_text');
    setHasResume(!!resumeText && resumeText.length > 20);
    fetchJobs(resumeText);
  }, []);

  const fetchJobs = async (resumeText: string | null) => {
    setIsLoading(true);
    try {
      if (resumeText && resumeText.length > 20) {
        const res = await axios.post(`${API_BASE}/candidate/board`, {
          resume_text: resumeText,
          job_id: 1
        });
        setJobs(res.data);
      } else {
        const res = await axios.get(`${API_BASE}/jobs/`);
        setJobs(res.data.map((j: any) => ({ ...j, match_score: null })));
      }
    } catch (err) {
      console.error("Neural board link failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const topJob = jobs.length > 0 ? jobs[0] : null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* Immersive Welcome Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10 relative">
        <div className="absolute bottom-0 left-0 w-1/2 h-[2px] bg-gradient-to-r from-[var(--cyan)] to-transparent opacity-40 shadow-[0_0_15px_var(--cyan)]" />
        <div>
           <div className="text-[10px] text-[var(--cyan)] font-black uppercase tracking-[0.5em] mb-3 flex items-center gap-2">
             <Sparkles className="w-3.5 h-3.5 neural-glow-cyan" />
             Neural Career Path Integrated
           </div>
           <h1 className="text-5xl font-black font-display text-[var(--text)] tracking-tighter">Your Career Simulations</h1>
        </div>
        {!hasResume && (
           <NeuralButton variant="primary" size="md" onClick={() => router.push('/candidate/ats')}>✦ Analyze Resume to Unlock Signals</NeuralButton>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* L: The Neural Journey (Main Job) */}
        <div className="lg:col-span-2">
          {topJob ? (
             <section className="relative group">
                {/* Background Decor */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-[var(--purple)] rounded-full blur-[100px] opacity-10 pointer-events-none" />
                
                <Card className="!p-8 h-full border-l-4 border-l-[var(--cyan)] relative overflow-hidden flex flex-col justify-between min-h-[440px]">
                   <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                      <NeuralBridge score={topJob.match_score ? Math.round(topJob.match_score * 100) : 0} />
                   </div>
                   
                   <div>
                      <NeuralBadge variant="purple" className="mb-4 !bg-[var(--navy2)] !border-none !text-[9px] uppercase tracking-widest font-black">Top Neural Match</NeuralBadge>
                      <h2 className="text-4xl font-black font-display text-[var(--text)] tracking-tight group-hover:text-[var(--cyan)] transition-colors leading-tight max-w-lg">
                         {topJob.title}
                      </h2>
                      <div className="text-[11px] text-[var(--muted)] mt-2 font-black uppercase tracking-widest">{topJob.company_name || 'TechCorp'} · {topJob.location || 'Remote'} · {topJob.salary_range || 'Neural Comp'}</div>
                      
                      <div className="grid md:grid-cols-2 gap-8 mt-12">
                         <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--dim)] border-b border-white/5 pb-2">Technical Resonance</div>
                            <div className="flex flex-wrap gap-2">
                               {topJob.matched_skills?.slice(0, 5).map((s: string) => (
                                 <NeuralBadge key={s} variant="cyan" className="!bg-[var(--navy3)] !border-none !text-[8.5px] uppercase font-bold tracking-tighter">Matched: {s}</NeuralBadge>
                               ))}
                            </div>
                            <p className="text-[11px] text-[var(--muted)] leading-relaxed italic opacity-80 pt-4">
                               "Your recent simulation projects in distributed architecture align with 94% of this mission's neural requirements."
                            </p>
                         </div>
                         
                         <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--dim)] border-b border-white/5 pb-2">Simulation Probabilities</div>
                            <div className="space-y-3">
                               <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-[var(--muted)] font-black uppercase">Technical Depth</span>
                                  <span className="text-[var(--cyan)] font-display font-black italic">High</span>
                               </div>
                               <div className="h-1 bg-[var(--navy3)] rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-[var(--cyan)] shadow-[0_0_10px_var(--cyan)]" />
                               </div>
                               <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-[var(--muted)] font-black uppercase">Cultural Alignment</span>
                                  <span className="text-[var(--purple)] font-display font-black italic">Strategic</span>
                               </div>
                               <div className="h-1 bg-[var(--navy3)] rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="h-full bg-[var(--purple)]" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-12 flex justify-between items-center">
                      <div className="flex items-center gap-4 text-[10px] text-[var(--dim)] font-black uppercase tracking-widest">
                         <Target className="w-4 h-4" /> Neural Accuracy 99.8%
                      </div>
                      <div className="flex gap-3">
                         <NeuralButton variant="ghost" size="md">Analyze More</NeuralButton>
                         <NeuralButton variant="primary" size="md">Initiate Link <ArrowRight className="w-4 h-4 ml-2" /></NeuralButton>
                      </div>
                   </div>
                </Card>
             </section>
          ) : (
             <Card className="flex flex-col items-center justify-center p-20 min-h-[440px] text-center">
                <div className="w-20 h-20 bg-[var(--navy2)] border border-dashed border-[var(--border)] rounded-full flex items-center justify-center mb-6">
                   <Target className="w-8 h-8 text-[var(--dim)]" />
                </div>
                <h3 className="text-xl font-bold font-display">No Talent Signals Found</h3>
                <p className="text-xs text-[var(--muted)] max-w-xs mt-2 italic leading-relaxed">System requires a resume analysis to synchronize your skill matrix with global job signals.</p>
                <NeuralButton className="mt-8" onClick={() => router.push('/candidate/ats')}>Unlock Neural Board</NeuralButton>
             </Card>
          )}
        </div>

        {/* R: Matrix & Coach sidebar */}
        <div className="space-y-8">
           <section>
              <SecTitle>Skill Matrix View</SecTitle>
              <Card className="py-8 relative overflow-hidden group border-none !bg-[var(--navy2)]">
                {/* Background decorative pulsing lines */}
                <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-[var(--cyan)] to-transparent opacity-[0.03] animate-pulse" />
                 <NeuralRadar />
                 <div className="mt-6 text-center">
                    <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.3em]">Current Global Rank</div>
                    <div className="text-3xl font-black font-display text-[var(--cyan)] neural-glow-cyan italic">Top 6%</div>
                 </div>
              </Card>
           </section>

           <section>
              <SecTitle>Operational Steps</SecTitle>
              <div className="space-y-2">
                 {[
                   { title: "Scale Assessment", sub: "Required for 'SDE-3' roles", icon: Zap, status: "Critical", color: "text-[var(--cyan)]" },
                   { title: "Architectural Mock", sub: "Boost score by +14", icon: MessageSquare, status: "Recommended", color: "text-[var(--purple)]" },
                 ].map((step, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-[var(--navy3)] rounded-xl border border-white/5 hover:bg-[var(--navy2)] transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                         <div className={`mt-0.5 ${step.color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                            <step.icon className="w-4 h-4" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-[var(--text)] uppercase tracking-tight">{step.title}</div>
                            <div className="text-[9px] text-[var(--dim)] font-medium italic">{step.sub}</div>
                         </div>
                      </div>
                      <div className="text-[8px] font-black uppercase text-[var(--dim)] bg-white/5 px-2 py-0.5 rounded-full">{step.status}</div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

      </div>

      {/* Grid of Other Missions */}
      <div className="pt-20">
         <SecTitle>Other Mission Signals</SecTitle>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-[var(--navy2)] rounded-3xl animate-pulse" />)
            ) : (
               jobs.slice(1).map((job, idx) => {
                  const score = job.match_score ? Math.round(job.match_score * 100) : null;
                  return (
                    <Card key={idx} className="group hover:border-[var(--border-active)] transition-all cursor-pointer">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="text-[14px] font-black font-display group-hover:text-[var(--cyan)] transition-colors leading-tight">{job.title}</h4>
                             <p className="text-[9px] text-[var(--dim)] font-black uppercase tracking-widest mt-1">{job.company_name || 'TechCorp'}</p>
                          </div>
                          {score && (
                             <div className="text-xl font-black font-display text-[var(--cyan)] italic">{score}%</div>
                          )}
                       </div>
                       <div className="flex flex-wrap gap-1.5 mb-6">
                          {job.required_skills?.slice(0, 3).map((s: string) => (
                             <NeuralBadge key={s} variant="gray" className="!text-[8px] !bg-transparent border-dashed border-white/10">{s}</NeuralBadge>
                          ))}
                       </div>
                       <div className="pt-3 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100">
                          <div className="text-[9px] text-[var(--dim)] font-black uppercase tracking-tighter">Mission Detected</div>
                          <div className="text-[var(--cyan)] text-xs">→</div>
                       </div>
                    </Card>
                  );
               })
            )}
         </div>
      </div>
    </div>
  );
}
