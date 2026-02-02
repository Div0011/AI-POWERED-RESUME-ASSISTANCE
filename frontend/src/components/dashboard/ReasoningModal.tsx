"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, BrainCircuit, Target, AlertTriangle } from 'lucide-react';

interface Candidate {
    id: number;
    name: string;
    score: number;
    explanation: string;
}

interface ReasoningModalProps {
    candidate: Candidate | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReasoningModal({ candidate, isOpen, onClose }: ReasoningModalProps) {
    if (!candidate) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 blur-[100px] pointer-events-none" />

                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white">AI Analysis</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-2">Candidate Profile</h3>
                                <div className="flex items-center gap-3">
                                    <div className="text-lg font-bold text-white">{candidate.name}</div>
                                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] uppercase font-bold text-emerald-400">
                                        Match: {Math.round(candidate.score * 100)}%
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                <h3 className="flex items-center gap-2 text-purple-400 text-sm font-bold mb-4">
                                    <Sparkles className="w-4 h-4" />
                                    Gemini Explanation
                                </h3>
                                <p className="text-white/80 text-sm leading-relaxed font-medium italic">
                                    "{candidate.explanation || 'No explanation provided by AI.'}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-2 text-emerald-400 text-[10px] uppercase font-bold mb-2">
                                        <Target className="w-3 h-3" /> Strengths
                                    </div>
                                    <p className="text-white/50 text-xs">High semantic match with JD requirements.</p>
                                </div>
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="flex items-center gap-2 text-rose-400 text-[10px] uppercase font-bold mb-2">
                                        <AlertTriangle className="w-3 h-3" /> Gaps
                                    </div>
                                    <p className="text-white/50 text-xs">Missing specific 3+ year experience flag.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all active:scale-[0.98]"
                        >
                            Got it
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
