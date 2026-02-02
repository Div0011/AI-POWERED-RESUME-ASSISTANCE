"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Mail, Briefcase, Star, SearchCode, AlertCircle, Loader2, Sparkles, Filter } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

interface Candidate {
    id: number;
    name: string;
    email: string;
    score: number;
    job_title: string;
    is_cross_match: boolean;
    similarity: number;
    confidence_score: string;
}

export default function TalentPoolPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filter, setFilter] = useState("all");

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 3) {
            if (query.length === 0) fetchAllCandidates();
            return;
        }

        setIsSearching(true);
        try {
            const res = await axios.post(`${API_BASE}/candidates/vector-search`, {
                query: query,
                top_k: 20
            });
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchAllCandidates = async () => {
        setIsSearching(true);
        try {
            const res = await axios.get(`${API_BASE}/candidates/`);
            // Map regular candidates to the search format
            const mapped = res.data.map((c: any) => ({
                ...c,
                similarity: 1.0,
                job_title: c.job_title || "Pending Job",
                is_cross_match: false
            }));
            setCandidates(mapped);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchAllCandidates();
    }, []);

    const filteredCandidates = candidates.filter(cand => {
        if (filter === "all") return true;
        return cand.confidence_score === filter;
    });

    return (
        <div className="min-h-screen bg-[#020202] text-white p-8 pl-72">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-purple-400/60">Recruiter Tools</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Global Talent Pool</h1>
                <p className="text-white/40 font-medium">Search across all job applications with semantic AI context.</p>
            </header>

            {/* Search Hub */}
            <div className="grid grid-cols-1 gap-8 mb-12">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                    <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl flex items-center p-2">
                        <div className="pl-4">
                            <SearchCode className="w-6 h-6 text-white/20" />
                        </div>
                        <input
                            type="text"
                            className="bg-transparent border-none outline-none flex-1 px-4 py-3 font-medium placeholder:text-white/20"
                            placeholder="Try 'Python developer with security background' or 'Frontend React specialist'..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {isSearching && (
                            <div className="pr-4">
                                <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <Filter className="w-4 h-4 text-white/40" />
                        <select
                            className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="selected">Selected</option>
                            <option value="review">Under Review</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    {searchQuery && (
                        <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">AI Semantic Search Active</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredCandidates.map((cand, idx) => (
                        <motion.div
                            key={cand.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.05] transition-all group relative overflow-hidden"
                        >
                            {cand.is_cross_match && (
                                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-tighter text-amber-500">Cross-Job Match</span>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6 text-white/50" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none mb-1">{cand.name}</h3>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Mail className="w-3 h-3" />
                                        <span className="text-[10px] font-medium truncate max-w-[120px]">{cand.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 truncate max-w-[150px]">{cand.job_title}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-black">{Math.round(cand.score * 100)}%</span>
                                    </div>
                                </div>

                                {/* Semantic Match Indicator */}
                                {searchQuery && (
                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Search Relevance</span>
                                            <span className="text-[10px] font-black text-purple-400">{Math.round(cand.similarity * 100)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${cand.similarity * 100}%` }}
                                                className="h-full bg-purple-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredCandidates.length === 0 && !isSearching && (
                    <div className="col-span-full py-24 text-center">
                        <div className="inline-flex p-6 bg-white/5 rounded-full border border-white/10 mb-6">
                            <Search className="w-12 h-12 opacity-10" />
                        </div>
                        <h3 className="text-xl font-bold opacity-40">No candidates found matching your criteria.</h3>
                        <p className="text-sm opacity-20">Try adjusting your search query or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
