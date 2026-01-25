"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Clock,
    TrendingUp,
    TrendingDown,
    Calendar,
    ChevronDown,
    PieChart,
    ArrowUpRight
} from 'lucide-react';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
    ssr: false,
    loading: () => <div className="h-64 flex items-end justify-center pb-8"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>
});

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("Last 30 Days");

    const stats = [
        { label: "Total Applicants", value: "1,284", change: "+12%", isPositive: true, icon: <Users className="w-5 h-5" /> },
        { label: "Avg. Time to Hire", value: "14 Days", change: "-2 Days", isPositive: true, icon: <Clock className="w-5 h-5" /> },
        { label: "Offer Acceptance", value: "88%", change: "-2%", isPositive: false, icon: <TrendingUp className="w-5 h-5" /> },
    ];

    const chartBars = [65, 45, 75, 50, 80, 60, 90, 70, 85, 95, 60, 75];

    return (
        <div className="min-h-screen p-4 md:p-8 text-white pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-wide mb-2 drop-shadow-md" style={{ fontFamily: 'var(--font-agale)' }}>
                            HIRING ANALYTICS
                        </h1>
                        <p className="text-white/60">
                            Deep insights into your recruitment funnel and team performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-all">
                            <Calendar className="w-4 h-4" />
                            {timeRange}
                            <ChevronDown className="w-4 h-4 opacity-50" />
                        </button>
                    </div>
                </header>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />

                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${stat.isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                                    {stat.change}
                                    {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                </div>
                            </div>

                            <h3 className="text-4xl font-bold mb-1 relative z-10">{stat.value}</h3>
                            <p className="text-white/60 text-sm font-medium uppercase tracking-wider relative z-10">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-blue-300" />
                                Application Volume
                            </h3>
                            <button className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors">View Report</button>
                        </div>

                        {/* CSS-only Bar Chart */}
                        <AnalyticsChart chartBars={chartBars} />
                        <div className="flex justify-between mt-4 text-xs text-white/30 font-mono uppercase">
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        </div>
                    </motion.div>

                    {/* Funnel Widget */}
                    <div className="bg-gradient-to-br from-purple-900/40 to-black/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col">
                        <h3 className="text-xl font-bold mb-6">Conversion Funnel</h3>
                        <div className="space-y-4 flex-1">
                            {[
                                { label: "Applications", val: "100%", color: "bg-blue-500" },
                                { label: "Screened", val: "45%", color: "bg-purple-500" },
                                { label: "Interviewed", val: "20%", color: "bg-pink-500" },
                                { label: "Offers Sent", val: "8%", color: "bg-emerald-500" },
                            ].map((step, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white/70">{step.label}</span>
                                        <span className="font-bold">{step.val}</span>
                                    </div>
                                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: step.val }}
                                            transition={{ duration: 1.2, delay: 0.5 + (i * 0.2) }}
                                            className={`h-full rounded-full ${step.color} opacity-80`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="mt-8 w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all group">
                            Full Report <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
