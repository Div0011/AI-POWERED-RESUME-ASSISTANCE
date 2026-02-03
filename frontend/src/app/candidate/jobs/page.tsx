"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Briefcase, Search, Sparkles, ArrowRight, Loader2, Cpu, Code, Globe, Terminal } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

interface Job {
    id: number;
    title: string;
    description: string;
    required_skills: string[];
}

export default function CandidateJobBoard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${API_BASE}/jobs/`);
                setJobs(res.data);
            } catch (err) {
                console.error("Failed to fetch jobs", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                        <Briefcase className="w-4 h-4" />
                        Job Board
                    </div>
                    <h1 className="text-5xl font-agale font-bold tracking-tighter text-[var(--foreground)]">
                        Job Posts
                    </h1>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)]/30 group-focus-within:text-[var(--primary)] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for roles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl py-4 pl-14 pr-6 text-[var(--foreground)] placeholder:text-[var(--foreground)]/20 focus:outline-none focus:border-[var(--primary)]/50 focus:shadow-[0_0_20px_rgba(0,232,255,0.1)] transition-all font-mono text-sm"
                    />
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                    <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
                    <p className="text-[var(--foreground)]/30 text-xs font-bold uppercase tracking-widest font-mono">Loading Opportunities...</p>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-40 border-2 border-dashed border-[var(--card-border)] rounded-[3rem] bg-[var(--card-bg)]/30">
                    <p className="text-[var(--foreground)]/30 font-mono">No active job posts found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel p-8 rounded-[2rem] hover:border-[var(--primary)]/50 transition-all group relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Technical Decoration */}
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Code className="w-12 h-12 text-[var(--foreground)]/5 rotate-12" />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Active Hiring</span>
                                </div>
                                <h2 className="text-3xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors font-agale leading-tight">
                                    {job.title}
                                </h2>
                            </div>

                            <p className="text-[var(--foreground)]/50 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow font-light">
                                {job.description}
                            </p>

                            <div className="space-y-6">
                                {/* Tech Stack Grid */}
                                <div className="flex flex-wrap gap-2">
                                    {job.required_skills.slice(0, 5).map((skill, i) => (
                                        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--background)] border border-[var(--card-border)] rounded-md">
                                            <div className="w-1 h-1 bg-[var(--foreground)]/20 rounded-full" />
                                            <span className="text-[10px] font-bold text-[var(--foreground)]/60 uppercase tracking-wider font-mono">
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => router.push(`/candidate/check?job_id=${job.id}`)}
                                    className="w-full group/btn relative overflow-hidden bg-[var(--foreground)] text-[var(--background)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--primary)] hover:text-white transition-all shadow-lg hover:shadow-[var(--primary)]/30"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        APPLY NOW
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
