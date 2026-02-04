"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Sparkles, Target, TrendingUp, Terminal } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

interface VectorSearchResult {
    id: number;
    name: string;
    email: string;
    score: number;
    confidence_score: string;
    explanation: string;
    job_id: number;
    job_title: string;
    is_cross_match: boolean;
    similarity: number;
}

export default function TalentPoolPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<VectorSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [topK, setTopK] = useState(10);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await axios.post(`${API_BASE}/candidates/vector-search`, {
                query: searchQuery,
                top_k: topK
            });
            setResults(res.data);
        } catch (err) {
            console.error("Vector search failed:", err);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <header className="mb-8 sm:mb-12 text-center sm:text-left px-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[var(--primary)] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-3">
                    <Terminal className="w-4 h-4" />
                    NEURAL_SEARCH :: GLOBAL_TALENT_POOL
                </div>
                <h1 className="text-4xl sm:text-6xl font-agale font-bold tracking-tighter text-[var(--foreground)] italic mb-4 leading-none">
                    Global Talent Pool
                </h1>
                <p className="text-[var(--foreground)]/50 font-mono text-[10px] sm:text-sm max-w-2xl leading-relaxed uppercase tracking-widest mx-auto sm:mx-0">
                    Semantic AI search across all candidates. Find hidden talent that matches your requirements using vector similarity.
                </p>
            </header>

            {/* Search Bar */}
            <div className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl mb-8 sm:mb-12 border border-[var(--card-border)] bg-white/[0.02]">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-end">
                    <div className="flex-1">
                        <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 mb-3 block ml-1">
                            Neural Query Parameters
                        </label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="e.g., 'React developer with 3 years experience in fintech'"
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--primary)] transition-all font-mono placeholder:opacity-30"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="w-24 sm:w-32">
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30 mb-3 block ml-1">
                                Top K
                            </label>
                            <input
                                type="number"
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                min={1}
                                max={50}
                                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-[var(--primary)] transition-all font-mono text-center"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={isSearching || !searchQuery.trim()}
                            className="flex-1 lg:flex-none px-8 py-4 bg-[var(--primary)] text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 transition-all disabled:opacity-20 shadow-xl flex items-center justify-center gap-3 active:scale-95"
                        >
                            {isSearching ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    Scanning
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Execute
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]/40">
                            Found {results.length} Matches
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {results.map((candidate, idx) => (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-panel p-6 rounded-2xl border border-[var(--card-border)] hover:border-[var(--primary)]/30 transition-all group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">{candidate.name}</h3>
                                        <p className="text-[var(--foreground)]/40 text-xs font-mono">{candidate.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-[var(--primary)]">
                                            {Math.round(candidate.similarity * 100)}%
                                        </div>
                                        <div className="text-[8px] uppercase font-bold tracking-widest text-[var(--foreground)]/30">
                                            Similarity
                                        </div>
                                    </div>
                                </div>

                                {/* Job Context */}
                                <div className="mb-4 p-3 bg-[var(--foreground)]/5 rounded-xl">
                                    <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-[var(--foreground)]/40 mb-1">
                                        <Target className="w-3 h-3" />
                                        Applied To
                                    </div>
                                    <p className="text-sm font-mono">{candidate.job_title}</p>
                                    {candidate.is_cross_match && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-mono text-amber-500">
                                            Cross-Match Opportunity
                                        </span>
                                    )}
                                </div>

                                {/* Match Score */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest text-[var(--foreground)]/30 mb-2">
                                        <span>Overall Score</span>
                                        <span>{Math.round(candidate.score * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[var(--card-border)] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${candidate.score * 100}%` }}
                                            className="h-full bg-gradient-to-r from-[var(--primary)] to-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${candidate.confidence_score === 'selected'
                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                        : candidate.confidence_score === 'rejected'
                                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                        }`}>
                                        {candidate.confidence_score || 'Under Review'}
                                    </span>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] hover:text-[var(--primary)]/70 transition-colors">
                                        View Profile →
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !isSearching && (
                <div className="text-center py-20 opacity-20">
                    <Users className="w-24 h-24 mx-auto mb-6 text-[var(--foreground)]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">
                        Enter a search query to find talent
                    </p>
                </div>
            )}
        </div>
    );
}
