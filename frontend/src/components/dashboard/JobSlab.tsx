
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Users, ArrowRight, Zap } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    company_name: string;
    location: string;
    department: string;
    employment_type: string;
    is_remote: boolean;
}

interface JobSlabProps {
    job: Job;
    onClick: (id: number) => void;
    active?: boolean;
}

export default function JobSlab({ job, onClick, active }: JobSlabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onClick(job.id)}
            className={`group relative p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border transition-all duration-300 cursor-pointer overflow-hidden ${active
                ? 'bg-[var(--primary)] border-[var(--primary)] shadow-[0_0_20px_rgba(0,232,255,0.1)]'
                : 'bg-[var(--obsidian-card)] border-[var(--card-border)] hover:border-[var(--primary)]/50'
                }`}
        >
            {/* Background Accent - simplified */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary)]/5 to-transparent transition-opacity duration-300 ${active ? 'opacity-40' : 'opacity-0 group-hover:opacity-100'}`} />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl border transition-colors ${active ? 'bg-black/20 border-black/20' : 'bg-[var(--primary)]/10 border-[var(--primary)]/20 shadow-[0_0_15px_rgba(0,232,255,0.1)]'}`}>
                            <Briefcase className={`w-4 h-4 ${active ? 'text-black' : 'text-[var(--primary)]'}`} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${active ? 'text-black/60' : 'text-[var(--primary)]'}`}>
                            {job.department} // {job.employment_type}
                        </span>
                    </div>

                    <h2 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 font-agale italic truncate ${active ? 'text-black' : 'text-white group-hover:text-[var(--primary)] transition-colors'}`}>
                        {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase tracking-widest">
                        <span className={`flex items-center gap-1.5 ${active ? 'text-black/70' : 'text-[var(--foreground)]/40'}`}>
                            <MapPin className="w-3 h-3" /> {job.is_remote ? 'Remote' : job.location}
                        </span>
                        <span className={`flex items-center gap-1.5 ${active ? 'text-black/70' : 'text-[var(--foreground)]/40'}`}>
                            <Users className="w-3 h-3" /> Talent Node: #{job.id}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${active ? 'bg-black/10 border-black/10 text-black' : 'bg-white/5 border-white/10 text-white/40 group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/30'}`}>
                        <span className="text-[9px] font-black tracking-[0.2em] uppercase">Enter Node</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                    <div className={`sm:hidden flex items-center justify-center p-3 rounded-full ${active ? 'bg-black text-white' : 'bg-[var(--primary)] text-black shadow-lg shadow-[var(--primary)]/20'}`}>
                        <Zap className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
