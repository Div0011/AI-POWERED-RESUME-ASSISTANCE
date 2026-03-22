"use client";

import React from 'react';
import Link from 'next/link';
import { Activity, Shield, Wifi, Battery, Command } from 'lucide-react';

interface TopbarProps {
  role: 'recruiter' | 'candidate';
}

export const Topbar = ({ role }: TopbarProps) => {
  return (
    <div className="bg-[var(--navy)] border-b border-white/5 h-16 flex items-center justify-between px-8 z-50">
      
      {/* Dynamic System Info */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-pulse shadow-[0_0_8px_var(--cyan)]" />
          <div className="text-[10px] font-black text-[var(--cyan)] uppercase tracking-[0.2em] neural-glow-cyan">
             {role === 'recruiter' ? 'SYSTEM: AGENTIC CORE' : 'USER: NEURAL PATH'}
          </div>
        </div>
        
        {/* Status Indicators (Decorative) */}
        <div className="hidden md:flex gap-6 opacity-30">
          <div className="flex items-center gap-2 scale-75">
             <Activity className="w-3.5 h-3.5" /> <span className="text-[9px] font-black uppercase">Syncing</span>
          </div>
          <div className="flex items-center gap-2 scale-75">
             <Wifi className="w-3.5 h-3.5" /> <span className="text-[9px] font-black uppercase">Neural-01</span>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Control Panel */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-[var(--navy2)] border border-white/5 py-1.5 px-3 rounded-full group cursor-help transition-all hover:border-[var(--cyan)]">
           <Command className="w-3 h-3 text-[var(--dim)] group-hover:text-[var(--cyan)]" />
           <span className="text-[9px] font-bold text-[var(--dim)] group-hover:text-[var(--text)] transition-colors">OS VERSION 0.4.5</span>
        </div>
        
        <Link 
          href="/"
          className="relative inline-flex items-center gap-2.5 py-1.5 px-4 bg-[var(--navy2)] border border-white/10 rounded-lg text-[10px] font-black tracking-widest text-[var(--muted)] hover:text-white hover:border-[var(--cyan)] transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,241,254,0.1)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10 transition-transform group-hover:-translate-x-1">TERMINATE LINK</span>
          <span className="text-red-500 opacity-60 group-hover:opacity-100 transition-opacity">✕</span>
        </Link>
      </div>
    </div>
  );
};
