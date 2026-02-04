"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { FileText, Target, AlertTriangle, TrendingUp, Info, Loader2, ArrowUpRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { SkeletonLoader } from '@/components/ProgressComponents';

interface AnalyticsData {
    total_resumes: number;
    avg_score: number;
    top_missing_skill: string;
    interview_ready_count: number;
    skill_gaps: { skill: string; count: number }[];
    score_distribution: { bin: string; count: number }[];
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        setError('');
        setLoadingProgress(0);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setLoadingProgress(prev => Math.min(prev + 10, 90));
        }, 300);

        try {
            // Add timeout to prevent infinite loading
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const res = await axios.get(`${API_BASE}/analytics/summary`, {
                signal: controller.signal,
                timeout: 15000
            });

            clearTimeout(timeoutId);
            clearInterval(progressInterval);
            setLoadingProgress(100);
            setData(res.data);
        } catch (err: any) {
            clearInterval(progressInterval);
            console.error("Failed to fetch analytics:", err);
            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('⏱️ Request timed out. The analytics service is taking too long. Please try again.');
            } else if (err.response?.status === 404) {
                setError('📊 No analytics data available yet. Start analyzing resumes to see insights.');
            } else {
                setError(err.response?.data?.detail || 'Failed to load analytics. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Enhanced Loading State with Skeleton
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto">
                <header className="mb-10 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 opacity-50">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Global Insights</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-agale font-bold tracking-tight mb-3">Intelligence</h1>
                    <p className="text-[var(--foreground)]/40 font-mono text-[10px] sm:text-sm uppercase tracking-widest">Hydrating data streams...</p>
                </header>

                {/* Progress Bar */}
                <div className="mb-10 px-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Syncing Protocol</span>
                        <span className="text-[10px] font-bold font-mono opacity-60 text-[var(--primary)]">{loadingProgress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-[var(--primary)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadingProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Skeleton Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-panel p-8 rounded-[2.5rem] animate-pulse bg-white/[0.02]">
                            <div className="w-12 h-12 bg-white/5 rounded-xl mb-6" />
                            <div className="h-2 bg-white/5 rounded w-20 mb-3" />
                            <div className="h-8 bg-white/10 rounded w-24 mb-4" />
                            <div className="h-1.5 bg-white/5 rounded w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center p-10 glass-panel rounded-[3rem] border-rose-500/20">
                    <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <AlertCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter italic font-agale">Kernel Error</h2>
                    <p className="text-[var(--foreground)]/50 mb-8 text-sm leading-relaxed">{error}</p>
                    <button
                        onClick={fetchAnalytics}
                        className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[var(--primary)] text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[var(--primary)]/10"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Restart Analytics
                    </button>
                </div>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Missions",
            value: data?.total_resumes || 0,
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            desc: "Active across sector"
        },
        {
            title: "Avg Sync",
            value: `${Math.round((data?.avg_score || 0) * 100)}%`,
            icon: Target,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            desc: "Quality match score"
        },
        {
            title: "Top Gap",
            value: data?.top_missing_skill || "N/A",
            icon: AlertTriangle,
            color: "text-rose-400",
            bg: "bg-rose-400/10",
            desc: "Critical skill lack"
        },
        {
            title: "Combat Ready",
            value: data?.interview_ready_count || 0,
            icon: Sparkles,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            desc: "Passed simulator"
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto selection:bg-[var(--primary)]/30 font-sans">
            <header className="mb-10 sm:mb-16 text-center sm:text-left px-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 opacity-50">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Neural Intelligence</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-agale font-bold tracking-tight mb-3 italic">Analytics Hub</h1>
                <p className="text-[var(--foreground)]/40 font-mono text-[10px] sm:text-sm uppercase tracking-widest leading-relaxed">System-wide data stream analysis.</p>
            </header>

            {/* At-a-Glance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all bg-white/[0.02] border-[var(--card-border)]"
                    >
                        <div className={`p-4 ${card.bg} rounded-2xl w-fit mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                            <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color}`} />
                        </div>
                        <h3 className="text-[var(--foreground)]/30 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</h3>
                        <div className="text-3xl sm:text-4xl font-black mb-2 text-[var(--foreground)] font-agale italic leading-none">{card.value}</div>
                        <p className="text-[9px] text-[var(--foreground)]/20 font-bold uppercase tracking-widest font-mono">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Skill Gaps Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-[var(--card-border)] bg-white/[0.02]"
                >
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-lg sm:text-xl font-black font-agale italic tracking-tight">Skill Gap Analysis</h2>
                            <p className="text-[10px] text-[var(--foreground)]/30 font-medium italic mt-1 font-mono uppercase">Top missing modules</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 cursor-help hidden sm:block">
                            <Info className="w-4 h-4 opacity-40" />
                        </div>
                    </div>

                    <div className="h-64 sm:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.skill_gaps || []} layout="vertical" margin={{ left: -10, right: 10 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="skill"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.3, fontSize: 8, fontWeight: 900 }}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {(data?.skill_gaps || []).map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? '#f43f5e' : `rgba(244, 63, 94, ${0.6 - (index * 0.1)})`} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Score Distribution Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border-[var(--card-border)] bg-white/[0.02]"
                >
                    <div className="flex items-center justify-between mb-8 sm:mb-12">
                        <div>
                            <h2 className="text-lg sm:text-xl font-black font-agale italic tracking-tight">Distribution</h2>
                            <p className="text-[10px] text-[var(--foreground)]/30 font-medium italic mt-1 font-mono uppercase">Global match spread</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                            LIVE DATA
                        </div>
                    </div>

                    <div className="h-64 sm:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.score_distribution || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="bin"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.3, fontSize: 8, fontWeight: 900 }}
                                />
                                <YAxis hide />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
