"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { FileText, Target, AlertTriangle, TrendingUp, Info, Loader2, ArrowUpRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

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

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get(`${API_BASE}/analytics/summary`);
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    const cards = [
        {
            title: "Total Resumes",
            value: data?.total_resumes || 0,
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            desc: "Active across all roles"
        },
        {
            title: "Avg Match",
            value: `${Math.round((data?.avg_score || 0) * 100)}%`,
            icon: Target,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            desc: "Global quality score"
        },
        {
            title: "Top Skill Gap",
            value: data?.top_missing_skill || "N/A",
            icon: AlertTriangle,
            color: "text-rose-400",
            bg: "bg-rose-400/10",
            desc: "Most frequent gap"
        },
        {
            title: "Interview Ready",
            value: data?.interview_ready_count || 0,
            icon: Sparkles,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            desc: "Passed simulator (>70%)"
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 pl-6 md:pl-12 lg:pl-24 selection:bg-purple-500/30 font-sans">
            <header className="mb-12">
                <div className="flex items-center gap-2 mb-2 opacity-50">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Global Insights</span>
                </div>
                <h1 className="text-4xl font-agale font-bold tracking-tight mb-2">Recruitment Intelligence</h1>
                <p className="text-[var(--foreground)]/40 font-medium font-mono text-sm leading-relaxed">Data-driven analysis of your talent pipeline.</p>
            </header>

            {/* At-a-Glance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all"
                    >
                        <div className={`p-4 ${card.bg} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                        <h3 className="text-[var(--foreground)]/40 text-sm font-black uppercase tracking-widest mb-1">{card.title}</h3>
                        <div className="text-4xl font-black mb-2 text-[var(--foreground)] font-agale">{card.value}</div>
                        <p className="text-[10px] text-[var(--foreground)]/20 font-bold uppercase tracking-widest font-mono">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skill Gaps Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-10 rounded-[2.5rem]"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black font-agale">Skill Gap Analysis</h2>
                            <p className="text-xs text-[var(--foreground)]/30 font-medium italic mt-1">Top missing skills identified by Gemini AI</p>
                        </div>
                        <div className="p-3 bg-[var(--foreground)]/5 rounded-2xl border border-[var(--card-border)] cursor-help">
                            <Info className="w-4 h-4 opacity-40" />
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.skill_gaps || []} layout="vertical" margin={{ left: 40 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="skill"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.4, fontSize: 10, fontWeight: 800 }}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                                />
                                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                    {(data?.skill_gaps || []).map((entry, index) => (
                                        <Cell key={index} fill={index === 0 ? '#f43f5e' : `rgba(244, 63, 94, ${0.8 - index * 0.15})`} />
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
                    className="glass-panel p-10 rounded-[2.5rem]"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black font-agale">Score Distribution</h2>
                            <p className="text-xs text-[var(--foreground)]/30 font-medium italic mt-1">Global spread of 0-100% match scores</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400">
                            <ArrowUpRight className="w-3 h-3" /> LIVE DATA
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.score_distribution || []}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="bin"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--foreground)', opacity: 0.4, fontSize: 10, fontWeight: 800 }}
                                />
                                <YAxis hide />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', color: 'var(--foreground)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8b5cf6"
                                    strokeWidth={4}
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
