"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CandidateCard from '@/components/dashboard/CandidateCard';
import ReasoningModal from '@/components/dashboard/ReasoningModal';
import { Sparkles, Search, RefreshCcw, TrendingUp, Users, Target, Terminal } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { motion, AnimatePresence } from 'framer-motion';

interface Candidate {
    id: number;
    name: string;
    email: string;
    score: number;
    confidence_score: string; // Used as status in backend
    skills: string[];
    explanation: string;
    analysis?: any;
}

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-[160px]"
    >
        <div className="flex justify-between items-start">
            <div className="p-3 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)]">
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-4xl font-agale font-bold text-[var(--foreground)] tracking-tight">{value}</h3>
            <p className="text-[var(--foreground)]/50 text-xs font-mono tracking-widest uppercase mt-1">{label}</p>
        </div>
    </motion.div>
);

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get('job_id');

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCand, setSelectedCand] = useState<Candidate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [jobs, setJobs] = useState<any[]>([]);
    const [activeJob, setActiveJob] = useState<any>(null);

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${API_BASE}/jobs/`);
            setJobs(res.data);
            if (jobId) {
                const current = res.data.find((j: any) => j.id === parseInt(jobId));
                setActiveJob(current);
            }
        } catch (err) {
            console.error("Failed to fetch missions:", err);
        }
    };

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const endpoint = jobId
                ? `${API_BASE}/candidates/?job_id=${jobId}`
                : `${API_BASE}/candidates/`;
            const res = await axios.get(endpoint);

            // Sort by score descending (Ranked Intelligence)
            const sorted = res.data.sort((a: Candidate, b: Candidate) => (b.score || 0) - (a.score || 0));
            setCandidates(sorted);
        } catch (err) {
            console.error("Failed to fetch candidates:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchCandidates();
    }, [jobId]);

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`${API_BASE}/candidates/${id}/approve`);
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, confidence_score: 'selected' } : c));
        } catch (err) {
            console.error("Approval failed:", err);
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await axios.post(`${API_BASE}/candidates/${id}/decline`);
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, confidence_score: 'rejected' } : c));
        } catch (err) {
            console.error("Decline failed:", err);
        }
    };

    const columns = [
        { id: 'selected', title: 'Highly Compatible', icon: '✨', color: 'border-emerald-500/20 bg-emerald-500/5' },
        { id: 'under recruiter review', title: 'Review Needed', icon: '👀', color: 'border-amber-500/20 bg-amber-500/5' },
        { id: 'rejected', title: 'Not a Match', icon: '📁', color: 'border-rose-500/20 bg-rose-500/5' },
    ];

    const filtered = candidates.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto font-sans">
            {/* Mission Hub Selection */}
            <div className="mb-8 sm:mb-12 flex flex-wrap gap-2 sm:gap-4">
                <button
                    onClick={() => router.push('/recruiter/dashboard')}
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${!jobId ? 'bg-[var(--primary)] text-black border-[var(--primary)]' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}
                >
                    Global View
                </button>
                {jobs.map(job => (
                    <button
                        key={job.id}
                        onClick={() => router.push(`/recruiter/dashboard?job_id=${job.id}`)}
                        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border transition-all ${parseInt(jobId || '0') === job.id ? 'bg-[var(--primary)] text-black border-[var(--primary)]' : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'}`}
                    >
                        {job.title}
                    </button>
                ))}

                <button
                    onClick={() => router.push('/recruiter/jobs/new-enhanced')}
                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-dashed border-[var(--primary)]/30 text-[var(--primary)] flex items-center gap-2 hover:bg-[var(--primary)]/10 transition-all"
                >
                    <Sparkles className="w-3 h-3" /> New Mission
                </button>
            </div>

            {/* Header Section */}
            <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[var(--primary)] text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-3">
                        <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
                        MISSION_CONTROL :: TALENT_MATRIX
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-agale font-bold tracking-tighter text-[var(--foreground)] italic">
                        The Matrix
                    </h1>
                </div>

                <div className="flex gap-2 sm:gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-initial">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[var(--foreground)]/30 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[var(--obsidian-card)]/50 border border-[var(--card-border)] rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 text-[10px] sm:text-xs focus:outline-none focus:border-[var(--primary)] w-full md:w-72 transition-all font-mono"
                        />
                    </div>
                    <button
                        onClick={fetchCandidates}
                        className="p-3 sm:p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl sm:rounded-2xl hover:bg-[var(--foreground)]/5 transition-all active:scale-95"
                    >
                        <RefreshCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin text-[var(--primary)]' : 'text-[var(--foreground)]/50'}`} />
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
                <StatCard icon={Users} label="Profiles" value={candidates.length} trend="+12%" />
                <StatCard icon={TrendingUp} label="Accuracy" value="84%" trend="+5%" />
                <div className="hidden sm:block">
                    <StatCard icon={Target} label="Mission" value={jobId ? "#" + jobId : "Global"} />
                </div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-center items-center text-center cursor-pointer border border-[var(--primary)]/30 bg-[var(--primary)]/5"
                >
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white mb-2 sm:mb-3 shadow-lg shadow-[var(--primary)]/30">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h3 className="font-black uppercase tracking-widest text-[7px] sm:text-[8px] text-[var(--foreground)]">Auto-Screen</h3>
                    <p className="text-[8px] sm:text-[10px] text-[var(--foreground)]/50 mt-0.5 sm:mt-1">Pipeline</p>
                </motion.div>

                <div className="sm:hidden">
                    <StatCard icon={Target} label="Mission" value={jobId ? "#" + jobId : "Global"} />
                </div>
            </div>

            {/* Main Kanban Board (Bento Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32">
                {columns.map((col) => {
                    const colCandidates = filtered.filter(c =>
                        (c.confidence_score || 'under recruiter review') === col.id
                    );
                    return (
                        <div key={col.id} className="flex flex-col h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 sm:mb-8 px-2">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <span className="text-lg sm:text-xl filter grayscale opacity-60">{col.icon}</span>
                                    <h2 className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40">
                                        {col.title}
                                    </h2>
                                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-[var(--foreground)]/5 rounded-full text-[8px] sm:text-[10px] text-[var(--foreground)]/60 font-black border border-[var(--card-border)]">
                                        {colCandidates.length}
                                    </span>
                                </div>
                            </div>

                            {/* Column Content */}
                            <div className={`flex-1 rounded-2xl sm:rounded-[2.5rem] border ${col.color} p-4 sm:p-6 space-y-4 sm:space-y-6 backdrop-blur-md transition-all min-h-[200px]`}>
                                <AnimatePresence mode="popLayout">
                                    {colCandidates.map((cand) => (
                                        <CandidateCard
                                            key={cand.id}
                                            candidate={{
                                                ...cand,
                                                status: cand.confidence_score || 'under recruiter review',
                                                score: cand.score
                                            }}
                                            onViewReasoning={(c: any) => {
                                                setSelectedCand(c);
                                                setIsModalOpen(true);
                                            }}
                                            onApprove={handleApprove}
                                            onDecline={handleDecline}
                                        />
                                    ))}
                                </AnimatePresence>

                                {colCandidates.length === 0 && (
                                    <div className="h-32 sm:h-48 flex flex-col items-center justify-center text-center opacity-10">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--foreground)]/10 rounded-full mb-4 sm:mb-6 animate-pulse" />
                                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.5em]">Empty</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ReasoningModal
                candidate={selectedCand}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

export default function RecruiterDashboard() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-40">
                <RefreshCcw className="w-8 h-8 animate-spin text-[var(--primary)]" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
