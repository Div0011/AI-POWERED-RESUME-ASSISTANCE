"use client";

import React from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralProgress, NeuralStat } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Zap, Activity, Globe, Info } from 'lucide-react';

export default function HiringIntelligence() {
  const hiringData = [
    { label: 'Neural Matched', value: '247', percent: 100, color: 'var(--cyan)' },
    { label: 'Verified Review', value: '142', percent: 57, color: 'var(--purple)' },
    { label: 'Strategic Shortlist', value: '58', percent: 23, color: 'var(--purple-bright)' },
    { label: 'Tactical Hired', value: '18', percent: 7, color: 'var(--cyan-bright)' },
  ];

  const chartBars = [2, 4, 3, 6, 5, 7, 8, 4, 6, 9]; // Mock values for bar chart
  const timestamps = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00'];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <SecTitle className="!mb-2">System Analytics</SecTitle>
           <h1 className="text-4xl font-black font-display text-[var(--text)] tracking-tighter uppercase transition-all hover:tracking-normal cursor-default">Mission Intelligence</h1>
           <p className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
              <Globe className="w-3 h-3 text-[var(--cyan)]" /> Global Neural Network Status: Optimized
           </p>
        </div>
        <div className="flex gap-2">
           <NeuralButton variant="secondary" size="sm">Export Data Stream</NeuralButton>
           <NeuralButton variant="ghost" size="sm" className="!p-2"><Info className="w-4 h-4" /></NeuralButton>
        </div>
      </header>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <NeuralStat num="18" label="Total Hired" icon={Zap} />
        <NeuralStat num="7.2d" label="Neural Match Velocity" icon={TrendingUp} />
        <NeuralStat num="74%" label="Average Resonance" icon={Activity} />
        <NeuralStat num="31%" label="Neural Retention" icon={PieChart} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Monthly Trends */}
         <div className="lg:col-span-2 space-y-6">
            <SecTitle>Real-time Pulse Feed</SecTitle>
            <Card className="!p-8 h-[300px] flex flex-col justify-end relative overflow-hidden">
               <div className="absolute top-4 left-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--dim)]">Neural Activity (24h Window)</span>
               </div>
               
               <div className="flex items-end gap-2 h-44 border-b border-white/5 pb-4 relative">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map(v => (
                     <div key={v} className="absolute bottom-4 left-0 w-full h-[1px] bg-white/[0.02]" style={{ bottom: `${v}%` }} />
                  ))}
                  
                  {chartBars.map((val, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / 10) * 100}%` }}
                      transition={{ delay: idx * 0.05, duration: 0.8 }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-[var(--navy3)] to-[var(--cyan)] opacity-40 hover:opacity-100 transition-all border-t border-[rgba(0,241,254,0.3)] shadow-[0_-5px_15px_rgba(0,241,254,0.05)] cursor-pointer"
                    />
                  ))}
               </div>
               <div className="flex justify-between mt-4 px-1 opacity-40">
                {timestamps.map((t, i) => (
                  <span key={i} className="text-[8px] font-black uppercase tracking-tighter">{t}</span>
                ))}
              </div>
            </Card>
         </div>

         {/* Conversion Funnel */}
         <div className="lg:col-span-1 space-y-6">
            <SecTitle>Funnel Leakage Parse</SecTitle>
            <div className="space-y-8 p-6 bg-[var(--navy2)] border border-white/5 rounded-3xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--purple)] to-transparent opacity-[0.02] pointer-events-none" />
               {hiringData.map((stage, idx) => (
                 <div key={idx} className="space-y-2 relative z-10">
                   <div className="flex justify-between items-end">
                      <div className="text-[9px] font-black text-[var(--dim)] uppercase tracking-widest">{stage.label}</div>
                      <div className="text-[12px] font-black text-[var(--text)] font-display">{stage.value}</div>
                   </div>
                   <NeuralProgress value={stage.percent} />
                 </div>
               ))}
               
               <div className="pt-4 mt-6 border-t border-white/5">
                  <div className="flex justify-between items-center bg-[var(--navy3)] p-3 rounded-xl">
                     <div className="text-[9px] font-black text-[var(--purple)] uppercase tracking-widest">Efficiency Sigma</div>
                     <div className="text-sm font-black text-[var(--text)] italic">92.4%</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

