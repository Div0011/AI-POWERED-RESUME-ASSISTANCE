"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Briefcase, Search, Sparkles, ArrowRight, Loader2, MapPin, Clock, Filter, BrainCircuit } from 'lucide-react';
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
        <div className="min-h-screen p-8 pt-28 text-white bg-[#050505]">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-purple-400">
                            <Briefcase className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Terminal</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight font-agale italic">Explore Opportunities</h1>
                        <p className="text-white/40 text-lg font-light max-w-xl">
                            Select a mission. Use our <span className="text-white font-medium">ATS Simulator</span> to verify your match before applying.
                        </p>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search missions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                        />
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Scanning Network...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-white/20 font-medium">No missions found matching your search parameters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-panel p-8 rounded-[2.5rem] border border-white/10 hover:border-purple-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors pr-8">{job.title}</h2>
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                                        <BrainCircuit className="w-5 h-5 text-purple-400" />
                                    </div>
                                </div>

                                <p className="text-white/40 text-sm mb-8 line-clamp-3 leading-relaxed">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {job.required_skills.slice(0, 4).map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                            {skill}
                                        </span>
                                    ))}
                                    {job.required_skills.length > 4 && (
                                        <span className="px-3 py-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                            +{job.required_skills.length - 4} more
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => router.push(`/candidate/check?job_id=${job.id}`)}
                                    className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all active:scale-[0.98]"
                                >
                                    SIMULATE MATCH
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
