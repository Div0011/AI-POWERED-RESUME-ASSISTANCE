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
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 shadow-2xl"
        >
            {/* Top Row: Name & Score */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-purple-300 transition-colors">
                        {candidate.name}
                    </h3>
                    <p className="text-white/40 text-xs font-mono lowercase tracking-wider truncate max-w-[150px]">
                        {candidate.email}
                    </p>
                </div>
                <div className={`text-2xl font-black ${getScoreColor(candidate.score * 100)}`}>
                    {Math.round(candidate.score * 100)}%
                </div>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
                {(candidate.skills || ["Nmap", "Wireshark", "Python"]).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] uppercase font-bold text-purple-300">
                        {skill}
                    </span>
                ))}
            </div>

            {/* AI Reasoning Button */}
            <button
                onClick={() => onViewReasoning(candidate)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10 transition-all mb-4"
            >
                <div className="flex items-center gap-2">
                    <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                    AI Reasoning
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onApprove(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                </button>
                <button
                    onClick={() => onDecline(candidate.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                    <XCircle className="w-4 h-4" />
                    Decline
                </button>
            </div>
        </motion.div>
    );
}
