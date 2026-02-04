"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mail, PieChart, ArrowRight, Users } from 'lucide-react';

export default function RecruiterHub() {
    const router = useRouter();

    const tools = [
        {
            title: "Talent Matrix",
            desc: "AI-powered candidate screening and automated email replies.",
            icon: <Mail className="w-8 h-8 text-[var(--primary)]" />,
            path: "/recruiter/dashboard",
            color: "bg-[var(--primary)]/10 border-blue-500/20"
        },
        {
            title: "Global Talent Pool",
            desc: "Semantic AI search across all candidates and job matches.",
            icon: <Users className="w-8 h-8 text-[var(--accent)]" />,
            path: "/recruiter/talent-pool",
            color: "bg-[var(--accent)]/10 border-cyan-500/20"
        },
        {
            title: "Hiring Intelligence",
            desc: "Real-time skill gap analysis and preparedness metrics.",
            icon: <PieChart className="w-8 h-8 text-emerald-400" />,
            path: "/recruiter/analytics",
            color: "bg-emerald-500/10 border-emerald-500/20"
        }
    ];

    return (
        <div className="p-4 sm:p-8 pt-24 sm:pt-32 text-[var(--foreground)] flex flex-col items-center justify-start max-w-7xl mx-auto">
            <header className="mb-8 sm:mb-16 text-center px-4">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 sm:mb-4 drop-shadow-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70 font-agale">
                    Recruiter Tools
                </h1>
                <p className="text-[var(--foreground)]/60 text-sm sm:text-xl max-w-xl mx-auto font-light">
                    Manage missions and neural candidates.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {tools.map((tool, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(tool.path)}
                        className="glass-panel p-6 sm:p-8 rounded-2xl cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between min-h-[240px] sm:min-h-[280px]"
                    >
                        <div>
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 border ${tool.color}`}>
                                {tool.title === "Talent Matrix" ? <Mail className="w-6 h-6 sm:w-8 sm:h-8" /> :
                                    tool.title === "Global Talent Pool" ? <Users className="w-6 h-6 sm:w-8 sm:h-8" /> :
                                        <PieChart className="w-6 h-6 sm:w-8 sm:h-8" />}
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 tracking-wide">{tool.title}</h3>
                            <p className="text-[var(--foreground)]/60 leading-relaxed group-hover:text-[var(--foreground)] transition-colors text-xs sm:text-sm">
                                {tool.desc}
                            </p>
                        </div>
                        <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--primary)] opacity-80 group-hover:opacity-100 transition-opacity">
                            Launch Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
