"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Briefcase, Search, Sparkles, ArrowRight,
    Loader2, Cpu, Code, Globe, Terminal,
    Zap, Target, ShieldCheck, AlertTriangle,
    CheckCircle2, Layers, Send, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { API_BASE } from '@/config';
import { CircularProgress } from '@/components/ProgressComponents';

interface MissionData {
    job_id: number;
    title: string;
    description: string;
    company_name?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    currency?: string;
    employment_type?: string;
    match_score: number;
    missing_skills: string[];
    matched_skills: string[];
    reasoning: string;
}

export default function MissionBoardPage() {
    const [missions, setMissions] = useState<MissionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [applyingId, setApplyingId] = useState<number | null>(null);
    const [appliedIds, setAppliedIds] = useState<number[]>([]);
    const [selectedMission, setSelectedMission] = useState<MissionData | null>(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchMissions = async () => {
            setIsLoading(true);
            try {
                const resumeText = localStorage.getItem('resume_text');
                const res = await axios.post(`${API_BASE}/candidate/board`, {
                    resume_text: resumeText || "",
                });
                setMissions(res.data);
            } catch (err) {
                console.error("Failed to fetch missions", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMissions();
    }, []);

    const handleApplyClick = (mission: MissionData) => {
        setSelectedMission(mission);
        setShowApplyModal(true);
    };

    const confirmApplication = async (missionId: number) => {
        setApplyingId(missionId);
        try {
            const resumeText = localStorage.getItem('resume_text') || "";
            const candidateEmail = localStorage.getItem('user_email') || "demo@example.com";

            await axios.post(`${API_BASE}/candidate/apply`, {
                job_id: missionId,
                resume_text: resumeText,
                candidate_email: candidateEmail
            });

            setAppliedIds([...appliedIds, missionId]);
            setShowApplyModal(false);
        } catch (err) {
            console.error("Application failed", err);
        } finally {
            setApplyingId(null);
        }
    };

    const filteredMissions = missions.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16">
                <div className="px-2">
                    <div className="flex items-center gap-2 text-[var(--primary)] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-3">
                        <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                        Neural Board :: Active Missions
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-agale font-bold tracking-tighter text-[var(--foreground)] italic">
                        Mission Board
                    </h1>
                </div>

                <div className="flex gap-2 sm:gap-4 px-2">
                    <div className="relative group flex-1 md:flex-initial">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[var(--foreground)]/30 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter missions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[var(--obsidian-card)]/50 border border-[var(--card-border)] rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 text-[10px] sm:text-xs focus:outline-none focus:border-[var(--primary)] w-full md:w-72 transition-all font-mono"
                        />
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative w-16 h-16">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 border-2 border-[var(--primary)]/20 rounded-full border-t-[var(--primary)]"
                        />
                        <Cpu className="absolute inset-4 w-8 h-8 text-[var(--primary)] animate-pulse" />
                    </div>
                    <p className="text-[var(--foreground)]/20 text-[10px] font-black uppercase tracking-[0.5em] font-mono">Scanning Sector...</p>
                </div>
            ) : filteredMissions.length === 0 ? (
                <div className="text-center py-40 glass-panel rounded-3xl border-dashed">
                    <p className="text-[var(--foreground)]/30 font-mono text-sm tracking-widest">NO ACTIVE MISSIONS IN THIS SECTOR.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-32">
                    {filteredMissions.map((mission, idx) => (
                        <MissionBriefCard
                            key={mission.job_id}
                            mission={mission}
                            hasApplied={appliedIds.includes(mission.job_id)}
                            onApply={() => handleApplyClick(mission)}
                            idx={idx}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showApplyModal && selectedMission && (
                    <ApplicationModal
                        mission={selectedMission}
                        isApplying={applyingId === selectedMission.job_id}
                        onClose={() => setShowApplyModal(false)}
                        onConfirm={() => confirmApplication(selectedMission.job_id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function MissionBriefCard({ mission, onApply, hasApplied, idx }: {
    mission: MissionData,
    onApply: () => void,
    hasApplied: boolean,
    idx: number
}) {
    const scorePct = Math.round(mission.match_score * 100);
    const isGoodMatch = scorePct >= 70;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col gap-6 sm:gap-8 group relative overflow-hidden bg-[var(--obsidian-card)]/40 border-[var(--card-border)] hover:border-[var(--primary)]/50 transition-all duration-500"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${isGoodMatch ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded text-[8px] font-black uppercase tracking-widest border border-[var(--primary)]/20">
                                {mission.employment_type || 'Contract'}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-agale italic tracking-tight truncate leading-tight group-hover:text-[var(--primary)] transition-colors">
                        {mission.title}
                    </h3>

                    <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono uppercase tracking-widest opacity-40">
                        <span className="truncate max-w-[120px] sm:max-w-none">{mission.company_name}</span>
                        <span className="opacity-30">/</span>
                        <span className="truncate max-w-[100px] sm:max-w-none">{mission.location}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="flex flex-col items-center sm:items-end w-full sm:w-32">
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Neural Alignment</div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${scorePct}%` }}
                                className={`h-full ${isGoodMatch ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}
                            />
                        </div>
                        <span className={`text-xl sm:text-2xl font-black italic font-agale mt-2 ${isGoodMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {scorePct}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <p className="text-xs sm:text-sm text-[var(--foreground)]/60 leading-relaxed font-light line-clamp-3 italic opacity-80">
                    "{mission.reasoning}"
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-6 border-t border-[var(--card-border)]">
                <div className="flex flex-wrap gap-2">
                    {mission.matched_skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-[var(--foreground)]/40 hover:text-[var(--primary)] transition-colors">
                            {skill}
                        </span>
                    ))}
                    {mission.matched_skills.length > 3 && (
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-[var(--foreground)]/20">
                            +{mission.matched_skills.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onApply}
                        disabled={hasApplied}
                        className={`flex-1 sm:flex-initial h-12 sm:h-14 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 ${hasApplied
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed'
                            : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--primary)] hover:text-black shadow-lg shadow-black/20 active:scale-95'
                            }`}
                    >
                        {hasApplied ? <ShieldCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        {hasApplied ? 'Mission Accepted' : 'Infiltrate'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function ApplicationModal({ mission, isApplying, onClose, onConfirm }: {
    mission: MissionData,
    isApplying: boolean,
    onClose: () => void,
    onConfirm: () => void
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl sm:rounded-[3rem] overflow-hidden flex flex-col sm:flex-row bg-[var(--background)] border border-[var(--card-border)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors sm:hidden"
                >
                    <X className="w-5 h-5 text-white/50" />
                </button>

                {/* Left: Mission Analysis */}
                <div className="w-full sm:w-[40%] p-6 sm:p-10 bg-black/40 border-b sm:border-b-0 sm:border-r border-[var(--card-border)] flex flex-col justify-between overflow-y-auto sm:overflow-visible">
                    <div>
                        <div className="flex items-center gap-2 text-[var(--primary)] text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" /> Neural Match Analysis
                        </div>

                        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                            <CircularProgress
                                percentage={Math.round(mission.match_score * 100)}
                                size={120}
                            />
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="space-y-3">
                                <h4 className="font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] opacity-40">Matched Parameters</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {mission.matched_skills?.slice(0, 8).map((skill: string) => (
                                        <span key={skill} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[8px] font-bold uppercase">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold uppercase tracking-[0.2em] text-[8px] sm:text-[10px] opacity-40">Identified Gaps</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {mission.missing_skills?.length > 0 ? mission.missing_skills.slice(0, 8).map((skill: string) => (
                                        <span key={skill} className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-[8px] font-bold uppercase">{skill}</span>
                                    )) : <span className="text-[8px] font-bold uppercase opacity-20 italic">Optimal compatibility</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-10">
                        <button
                            onClick={onConfirm}
                            disabled={isApplying}
                            className="w-full relative h-12 sm:h-14 px-6 sm:px-8 bg-[var(--primary)] text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl active:scale-95"
                        >
                            {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Deploy Application
                        </button>
                    </div>
                </div>

                {/* Right: Mission Details */}
                <div className="w-full sm:w-[60%] p-6 sm:p-10 flex flex-col overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl sm:text-4xl font-agale font-bold mb-3 sm:mb-4 tracking-tight leading-tight">{mission.title}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs opacity-60 mb-6 font-mono uppercase tracking-widest border-b border-[var(--card-border)] pb-4">
                        <span className="text-[var(--primary)]">{mission.company_name}</span>
                        <span className="opacity-30">/</span>
                        <span>{mission.location}</span>
                        <span className="opacity-30">/</span>
                        <span>{mission.employment_type}</span>
                    </div>
                    <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-[var(--foreground)]/80 leading-relaxed">
                        <ReactMarkdown>{mission.description}</ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
