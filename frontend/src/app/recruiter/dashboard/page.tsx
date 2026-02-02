"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CandidateCard from '@/components/dashboard/CandidateCard';
import ReasoningModal from '@/components/dashboard/ReasoningModal';
import { Sparkles, Filter, Search, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

interface Candidate {
    id: number;
    name: string;
    email: string;
    score: number;
    status: string;
    skills: string[];
    explanation: string;
}

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
        { id: 'selected', title: 'Highly Compatible', icon: '✨', color: 'bg-emerald-500/10' },
        { id: 'under recruiter review', title: 'Review Needed', icon: '👀', color: 'bg-amber-500/10' },
        { id: 'rejected', title: 'Not a Match', icon: '📁', color: 'bg-rose-500/10' },
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-500/30 pl-64">
            <main className="p-10">
                {/* Header Area */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                            <Sparkles className="w-4 h-4" />
                            AI Powered Insights
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">Smart Inbox</h1>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 w-64 transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchCandidates}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                        >
                            <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin text-purple-400' : 'text-white/50'}`} />
                        </button>
                    </div>
                </div>

                {/* Candidate Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-250px)]">
                    {columns.map((col) => (
                        <div key={col.id} className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{col.icon}</span>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-white/70">
                                        {col.title}
                                    </h2>
                                    <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-white/40 font-bold">
                                        {candidates.filter(c => c.status === col.id).length}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                                    <Filter className="w-4 h-4 text-white/20" />
                                </button>
                            </div>

                            <div className={`flex-1 rounded-3xl ${col.color} border border-white/[0.03] p-4 overflow-y-auto space-y-4 custom-scrollbar`}>
                                {candidates.filter(c => c.status === col.id).map((cand) => (
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

                                {candidates.filter(c => c.status === col.id).length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                        <div className="w-12 h-12 bg-white/10 rounded-full mb-4 animate-pulse" />
                                        <p className="text-xs font-bold uppercase tracking-widest">No entries</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <ReasoningModal
                candidate={selectedCand}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
