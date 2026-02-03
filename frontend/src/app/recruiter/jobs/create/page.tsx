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
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-12 rounded-[2.5rem] border border-emerald-500/20 text-center max-w-sm"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 font-agale">Job Published</h2>
                    <p className="text-[var(--foreground)]/40 text-sm leading-relaxed font-mono">Job listing is now active in the candidate pool. Redirecting to dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 pt-28 text-[var(--foreground)] bg-[var(--background)] font-sans">
            <div className="max-w-3xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4 text-[var(--primary)]">
                        <div className="p-3 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">New Job Post</h3>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4 font-agale italic">Create New Job</h1>
                    <p className="text-[var(--foreground)]/40 text-lg font-light font-mono">Define role requirements. Our AI will handle the screening.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2rem] border border-[var(--card-border)] space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 ml-1 inline-flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Job Title
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="E.g. Senior Backend Engineer"
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-5 text-[var(--foreground)] placeholder:text-[var(--foreground)]/10 focus:outline-none focus:border-[var(--primary)]/50 focus:bg-[var(--foreground)]/5 transition-all text-lg font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30 ml-1 inline-flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Technical Requirements
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detail the technical stack, responsibilities, and candidate expectations..."
                                className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-3xl p-6 text-[var(--foreground)] placeholder:text-[var(--foreground)]/10 focus:outline-none focus:border-[var(--primary)]/50 focus:bg-[var(--foreground)]/5 transition-all leading-relaxed"
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
                            className="flex-1 bg-[var(--foreground)] text-[var(--background)] font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--primary)] hover:text-white active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-xl hover:shadow-[var(--primary)]/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    PUBLISH JOB
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-10 py-5 rounded-2xl border border-[var(--card-border)] text-[var(--foreground)]/40 font-bold hover:bg-[var(--foreground)]/5 transition-all"
                        >
                            ABORT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
