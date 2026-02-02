"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Briefcase, FileText, Send, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

export default function CreateJobPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await axios.post(`${API_BASE}/jobs/`, { title, description });
            setSuccess(true);
            setTimeout(() => router.push('/recruiter/dashboard'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create job post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-12 rounded-[2.5rem] border border-emerald-500/20 text-center max-w-sm"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Protocol Established</h2>
                    <p className="text-white/40 text-sm leading-relaxed">Job listing deployed to the global talent pool. Redirecting to terminal...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 pt-28 text-white bg-[#050505]">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4 text-purple-400">
                        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">New Assignment</h3>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4 font-agale italic">Agentic Job Creation</h1>
                    <p className="text-white/40 text-lg font-light">Describe the mission. Our AI will handle the screening.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/10 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 inline-flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Job Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Senior Backend Operative (Python/Go)"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all text-lg font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 inline-flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Technical Requirements
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detail the technical stack, mission objectives, and candidate expectations..."
                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all leading-relaxed"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 text-rose-400 bg-rose-400/10 p-5 rounded-2xl text-xs font-bold border border-rose-400/20"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <div className="flex items-center gap-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    DEPLOY TO POOL
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-10 py-5 rounded-2xl border border-white/10 text-white/40 font-bold hover:bg-white/5 transition-all"
                        >
                            ABORT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
