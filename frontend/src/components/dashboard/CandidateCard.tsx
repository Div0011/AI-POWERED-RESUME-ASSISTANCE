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
            className="group relative bg-[var(--card-bg)]/80 backdrop-blur-[16px] border border-[var(--card-border)] p-6 rounded-3xl hover:border-[var(--primary)]/30 transition-all duration-300 shadow-xl"
        >
            {/* Top Row: Name & Score */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-[var(--foreground)] text-lg tracking-tight group-hover:text-[var(--primary)] transition-colors font-agale">
                        {candidate.name}
                    </h3>
                    <p className="text-[var(--foreground)]/40 text-xs font-mono lowercase tracking-wider truncate max-w-[150px]">
                        {candidate.email}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className={`text-3xl font-black ${getScoreColor(candidate.score * 100)} font-sans`}>
                        {Math.round(candidate.score * 100)}%
                    </div>
                </div>
            </div>

            {/* Heatmap Visualization */}
            <div className="mb-6 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--foreground)]/30 tracking-widest">
                    <span>Match Heatmap</span>
                    <span>High-Fidelity</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                    {/* Simulated Heatmap Bars based on Score */}
                    {[80, 60, 90, 40, 70].map((val, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full ${candidate.score * 100 > val ? 'bg-[var(--primary)]' : 'bg-[var(--card-border)]'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
                {(candidate.skills || ["Nmap", "Wireshark", "Python"]).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[var(--background)] border border-[var(--card-border)] rounded text-[10px] uppercase font-bold text-[var(--foreground)]/60">
                        {skill}
                    </span>
                ))}
            </div>

            {/* AI Reasoning Button */}
            <button
                onClick={() => onViewReasoning(candidate)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--background)]/50 rounded-xl text-xs font-semibold text-[var(--foreground)]/70 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-transparent hover:border-[var(--primary)]/20 transition-all mb-4 mt-auto"
            >
                <div className="flex items-center gap-2">
                    <Wand2 className="w-3.5 h-3.5" />
                    AI Reasoning
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onApprove(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Accept
                </button>
                <button
                    onClick={() => onDecline(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                    <XCircle className="w-4 h-4" />
                    Archive
                </button>
            </div>
        </motion.div>
    );
}
