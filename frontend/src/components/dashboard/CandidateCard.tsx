"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareCode, CheckCircle2, XCircle, ChevronRight, Wand2 } from 'lucide-react';

interface Candidate {
    id: number;
    name: string;
    email: string;
    score: number;
    status: string;
    skills: string[];
    explanation: string;
    job_title?: string;
    analysis?: any;
}

interface CandidateCardProps {
    candidate: Candidate;
    onViewReasoning: (cand: Candidate) => void;
    onApprove: (id: number) => void;
    onDecline: (id: number) => void;
}

export default function CandidateCard({ candidate, onViewReasoning, onApprove, onDecline }: CandidateCardProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <motion.div
            layout // Enable layout animation for sort/filter
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[var(--card-bg)]/80 backdrop-blur-[16px] border border-[var(--card-border)] p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:border-[var(--primary)]/30 transition-all duration-300 shadow-xl"
        >
            {/* Top Row: Name & Score */}
            <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[var(--foreground)] text-base sm:text-lg tracking-tight group-hover:text-[var(--primary)] transition-colors font-agale truncate">
                            {candidate.name}
                        </h3>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[var(--foreground)]/40 text-[9px] sm:text-[10px] font-mono lowercase tracking-wider truncate">
                            {candidate.email}
                        </p>
                        {candidate.job_title && (
                            <p className="text-[var(--primary)]/60 text-[8px] sm:text-[9px] font-black uppercase tracking-widest truncate">
                                Mission: {candidate.job_title}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end ml-2 shrink-0">
                    <div className={`text-2xl sm:text-3xl font-black ${getScoreColor(candidate.score * 100)} font-sans`}>
                        {Math.round(candidate.score * 100)}%
                    </div>
                </div>
            </div>

            {/* 60/40 Hybrid Split Visualization */}
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-[7px] sm:text-[8px] uppercase font-black text-[var(--foreground)]/30 tracking-widest">
                    <span>Neural (40%)</span>
                    <span>Skill (60%)</span>
                </div>
                <div className="flex gap-2 sm:gap-4 h-1 sm:h-1.5 w-full">
                    {/* Neural Match Bar */}
                    <div className="flex-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(candidate.analysis?.breakdown?.vector_similarity || 0) * 100}%` }}
                            className="h-full bg-[var(--primary)]"
                        />
                    </div>
                    {/* Skill Accuracy Bar */}
                    <div className="flex-1 bg-[var(--card-border)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(candidate.analysis?.breakdown?.constraint_score || 0) * 100}%` }}
                            className="h-full bg-indigo-500"
                        />
                    </div>
                </div>
                <div className="flex justify-between text-[8px] sm:text-[10px] font-mono font-bold">
                    <span className="text-[var(--primary)]">{Math.round((candidate.analysis?.breakdown?.vector_similarity || 0) * 100)}%</span>
                    <span className="text-indigo-400">{Math.round((candidate.analysis?.breakdown?.constraint_score || 0) * 100)}%</span>
                </div>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1 mb-4 sm:mb-6">
                {(candidate.skills || ["Nmap", "Wireshark", "Python"]).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-[var(--background)] border border-[var(--card-border)] rounded text-[8px] sm:text-[10px] uppercase font-bold text-[var(--foreground)]/60">
                        {skill}
                    </span>
                ))}
            </div>

            {/* AI Reasoning Button */}
            <button
                onClick={() => onViewReasoning(candidate)}
                className="w-full flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 bg-[var(--background)]/50 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold text-[var(--foreground)]/70 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-transparent hover:border-[var(--primary)]/20 transition-all mb-3 sm:mb-4 mt-auto"
            >
                <div className="flex items-center gap-2">
                    <Wand2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    AI Reasoning
                </div>
                <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-40" />
            </button>

            {/* Action Buttons - Stacked on very small devices, row on others */}
            <div className="flex flex-row gap-2">
                <button
                    onClick={() => onApprove(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all active:scale-95"
                >
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Accept
                </button>
                <button
                    onClick={() => onDecline(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all active:scale-95"
                >
                    <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Archive
                </button>
            </div>
        </motion.div>
    );
}
