"use client";

import React, { useState, useEffect } from 'react';
import { Card, NeuralStat, SecTitle, NeuralBadge, NeuralButton, PipelineOrb, NeuralBridge } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE } from '@/config';
import { Zap, Users, Briefcase, Calendar, MessageSquare, Globe, Search, Command } from 'lucide-react';

export default function NeuralRecruiterDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNeuralData = async () => {
      try {
        const jobsRes = await axios.get(`${API_BASE}/jobs/`);
        setJobs(jobsRes.data);
        if (jobsRes.data.length > 0) {
          const candRes = await axios.get(`${API_BASE}/candidates/?job_id=${jobsRes.data[0].id}`);
          setCandidates(candRes.data);
        }
      } catch (err) {
        console.error("Neural data link failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadNeuralData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* Immersive Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-8 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--cyan)] via-[var(--purple)] to-transparent opacity-20" />
        <div>
           <div className="text-[9px] text-[var(--dim)] font-black uppercase tracking-[0.5em] mb-2 flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-pulse shadow-[0_0_10px_var(--cyan)]" />
             Neural Link Established
           </div>
           <h1 className="text-4xl font-black font-display text-[var(--text)] tracking-tighter">Recruitment Command</h1>
           <p className="text-xs text-[var(--muted)] mt-2 italic font-medium">Analyzing 2.4k talent signals across global mission pools</p>
        </div>
        <div className="flex gap-3">
           <div className="bg-[var(--navy2)] border border-[var(--border)] rounded-full px-5 py-2.5 flex items-center gap-3">
              <Command className="w-4 h-4 text-[var(--dim)]" />
              <input placeholder="Neural search..." className="bg-transparent border-none outline-none text-[11px] font-bold text-[var(--text)] w-48 placeholder:text-[var(--dim)]" />
           </div>
           <NeuralButton variant="primary" size="md">⚡ Deploy New Role</NeuralButton>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* L-Column: Dynamic Metrics */}
        <div className="lg:col-span-1 space-y-4">
           <SecTitle>Operational Load</SecTitle>
           <div className="space-y-3">
              <NeuralStat num={jobs.length.toString()} label="Active Missions" icon={Briefcase} />
              <NeuralStat num={candidates.length.toString()} label="Neural Screens" icon={Users} />
              <NeuralStat num="12" label="Simulations" icon={Zap} />
              <NeuralStat num="4" label="Final Filters" icon={Calendar} />
           </div>
           
           <Card className="mt-8 border-dashed border-white/10 opacity-60">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Network Alert</span>
              </div>
              <p className="text-[9px] text-[var(--muted)] leading-relaxed">System identified 3 matching candidates in Global Pool for 'Backend' role. Deploy expansion?</p>
              <NeuralButton variant="ghost" size="sm" className="w-full mt-3 !text-[9px]">Confirm Expansion</NeuralButton>
           </Card>
        </div>

        {/* Center: The Pipeline Orb */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-10 relative">
           {/* Decorative Background Aura */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--cyan)] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />
           
           <PipelineOrb size={320} />
           
           <div className="mt-12 w-full grid md:grid-cols-3 gap-6">
              <div className="text-center group cursor-pointer hover:scale-110 transition-transform">
                 <div className="text-xl font-black font-display text-[var(--cyan)] neural-glow-cyan">42%</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-[var(--dim)] mt-1">Sourcing speed</div>
              </div>
              <div className="text-center group cursor-pointer hover:scale-110 transition-transform">
                 <div className="text-xl font-black font-display text-[var(--purple)] neural-glow-purple">8.4d</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-[var(--dim)] mt-1">Avg Time to Match</div>
              </div>
              <div className="text-center group cursor-pointer hover:scale-110 transition-transform">
                 <div className="text-xl font-black font-display text-green-400">98%</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-[var(--dim)] mt-1">Hiring Velocity</div>
              </div>
           </div>
        </div>

        {/* R-Column: AI Assistant & Events */}
        <div className="lg:col-span-1 space-y-6">
           <section>
              <SecTitle>Neural Coach</SecTitle>
              <Card className="!bg-[var(--navy3)] !p-0 overflow-hidden border-none shadow-[0_0_20px_rgba(187,0,253,0.05)]">
                 <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[var(--navy3)] to-[var(--navy2)]">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] p-[1px]">
                          <div className="w-full h-full bg-[var(--navy2)] rounded-full flex items-center justify-center">
                             <Zap className="w-4 h-4 text-[var(--cyan)]" />
                          </div>
                       </div>
                       <div>
                          <div className="text-[10px] font-black text-[var(--text)]">SYSTEM ANALYST</div>
                          <div className="text-[8px] text-green-400 font-bold uppercase">Online & Operational</div>
                       </div>
                    </div>
                 </div>
                 <div className="p-4 space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                    <div className="bg-[var(--navy2)] p-2.5 rounded-r-lg rounded-tl-lg text-[10px] text-[var(--muted)] leading-relaxed italic border-l-2 border-[var(--purple)]">
                       I've prioritized Sarah R. for the Senior React role. Her technical score is 92%. Want to schedule?
                    </div>
                 </div>
                 <div className="p-3 border-t border-white/5 flex gap-2">
                    <input className="flex-1 bg-transparent border-none outline-none text-[10px] text-[var(--text)] font-bold placeholder:text-[var(--dim)]" placeholder="Command AI..." />
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--dim)]" />
                 </div>
              </Card>
           </section>

           <section>
              <SecTitle>Upcoming Signals</SecTitle>
              <div className="space-y-2">
                 {[
                   { time: "09:30 AM", name: "David C.", role: "Sr. Backend", score: 92 },
                   { time: "11:00 AM", name: "Maya V.", role: "ML Engineer", score: 87 },
                 ].map((signal, idx) => (
                   <div key={idx} className="flex items-center justify-between p-3 bg-[var(--navy2)] rounded-xl border border-white/5 hover:border-[var(--border-active)] transition-all cursor-pointer group">
                      <div>
                        <div className="text-[10px] font-black text-[var(--cyan)]">{signal.time}</div>
                        <div className="text-[11px] font-bold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors">{signal.name}</div>
                        <div className="text-[9px] text-[var(--dim)]">{signal.role}</div>
                      </div>
                      <NeuralBridge score={signal.score} />
                   </div>
                 ))}
              </div>
           </section>
        </div>

      </div>

      {/* Priority Candidates Grid */}
      <div className="pt-10">
        <SecTitle>Priority Talent Streams</SecTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {isLoading ? (
             [1, 2, 3].map(i => <div key={i} className="h-32 bg-[var(--navy2)] rounded-2xl animate-pulse" />)
           ) : candidates.length === 0 ? (
              <div className="lg:col-span-3 text-center py-20 opacity-30 text-xs tracking-widest">NO TALENT SIGNALS DETECTED.</div>
           ) : (
             candidates.slice(0, 6).map((cand, idx) => (
               <Card key={cand.id} className="cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <div className="text-xl font-black font-display text-[var(--text)] tracking-tighter transition-colors group-hover:text-[var(--cyan)]">{cand.name}</div>
                        <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-widest">{cand.email}</div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] p-[1px] shadow-[0_0_15px_rgba(0,241,254,0.1)]">
                        <div className="w-full h-full bg-[var(--navy)] rounded-full flex items-center justify-center text-[10px] font-black text-[var(--text)] italic">
                          {cand.score}%
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                     <NeuralBadge variant="cyan">Simulated: Match</NeuralBadge>
                     <NeuralBadge variant="purple">Neural: High Fit</NeuralBadge>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                     <div className="flex items-center gap-1.5 text-[9px] text-[var(--dim)] font-black uppercase tracking-widest">
                        <Command className="w-3 h-3" /> View Insight
                     </div>
                     <div className="text-[var(--cyan)] text-xs transition-transform transform group-hover:translate-x-1">→</div>
                  </div>
               </Card>
             ))
           )}
        </div>
      </div>
    </div>
  );
}
