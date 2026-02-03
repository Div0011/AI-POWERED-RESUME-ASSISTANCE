"use client";

import React, { useState, useEffect } from 'react';
import CandidateCard from '@/components/dashboard/CandidateCard';
import ReasoningModal from '@/components/dashboard/ReasoningModal';
import { Sparkles, Filter, Search, RefreshCcw, TrendingUp, Users, Target } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { motion } from 'framer-motion';

interface Candidate {
    id: number;
    name: string;
    email: string;
    score: number;
    status: string;
    skills: string[];
    explanation: string;
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

export default function RecruiterDashboard() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCand, setSelectedCand] = useState<Candidate | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCandidates = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/candidates`);
            setCandidates(res.data);
        } catch (err) {
            console.error("Failed to fetch candidates:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`${API_BASE}/candidates/${id}/approve`);
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'selected' } : c));
        } catch (err) {
            console.error("Approval failed:", err);
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await axios.post(`${API_BASE}/candidates/${id}/decline`);
            setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
        } catch (err) {
            console.error("Decline failed:", err);
        }
    };

    const columns = [
        { id: 'selected', title: 'Highly Compatible', icon: '✨', color: 'border-emerald-500/20 bg-emerald-500/5' },
        { id: 'under recruiter review', title: 'Review Needed', icon: '👀', color: 'border-amber-500/20 bg-amber-500/5' },
        { id: 'rejected', title: 'Not a Match', icon: '📁', color: 'border-rose-500/20 bg-rose-500/5' },
    ];

    return (
        <div className="font-sans">
            {/* Header Section */}
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                        <Sparkles className="w-4 h-4" />
                        Command Center
                    </div>
                    <h1 className="text-5xl font-agale font-bold tracking-tighter text-[var(--foreground)]">
                        Talent Matrix
                    </h1>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)]/30 group-focus-within:text-[var(--primary)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search vector database..."
                            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-[var(--primary)] w-64 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchCandidates}
                        className="p-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl hover:bg-[var(--foreground)]/5 transition-all active:scale-95"
                    >
                        <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin text-[var(--primary)]' : 'text-[var(--foreground)]/50'}`} />
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={Users} label="Total Candidates" value={candidates.length} trend="+12%" />
                <StatCard icon={TrendingUp} label="Avg Match Score" value="84%" trend="+5%" />
                <StatCard icon={Target} label="Positions Active" value="8" />

                {/* Action Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center text-center cursor-pointer border border-[var(--primary)]/30 bg-[var(--primary)]/5"
                >
                    <div className="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center text-white mb-3 shadow-lg shadow-[var(--primary)]/30">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-[var(--foreground)]">Auto-Screen</h3>
                    <p className="text-xs text-[var(--foreground)]/50 mt-1">Process New Batch</p>
                </motion.div>
            </div>

            {/* Main Kanban Board (Bento Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-240px)]">
                {columns.map((col) => {
                    const colCandidates = candidates.filter(c => c.status === col.id);
                    return (
                        <div key={col.id} className="flex flex-col h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl filter grayscale opacity-80">{col.icon}</span>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)]/70">
                                        {col.title}
                                    </h2>
                                    <span className="px-2 py-0.5 bg-[var(--foreground)]/5 rounded-full text-[10px] text-[var(--foreground)]/60 font-bold border border-[var(--card-border)]">
                                        {colCandidates.length}
                                    </span>
                                </div>
                            </div>

                            {/* Column Content */}
                            <div className={`flex-1 rounded-3xl border ${col.color} p-4 overflow-y-auto space-y-4 custom-scrollbar backdrop-blur-sm transition-colors hover:bg-opacity-10`}>
                                {colCandidates.map((cand) => (
                                    <CandidateCard
                                        key={cand.id}
                                        candidate={cand}
                                        onViewReasoning={(c) => {
                                            setSelectedCand(c);
                                            setIsModalOpen(true);
                                        }}
                                        onApprove={handleApprove}
                                        onDecline={handleDecline}
                                    />
                                ))}

                                {colCandidates.length === 0 && (
                                    <div className="h-48 flex flex-col items-center justify-center text-center opacity-30">
                                        <div className="w-12 h-12 bg-[var(--foreground)]/10 rounded-full mb-4 animate-pulse" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Data</p>
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
