"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Briefcase, Mic, Sparkles, ArrowRight } from 'lucide-react';

export default function CandidateHub() {
    const router = useRouter();

    const tools = [
        {
            title: "ATS Simulator",
            desc: "Upload your resume to see your match score and get AI bullet point improvements.",
            icon: <Sparkles className="w-8 h-8 text-[var(--primary)]" />,
            path: "/candidate/check",
            color: "bg-[var(--primary)]/10 border-blue-500/20"
        },
        {
            title: "AI Technical Interviewer",
            desc: "Practice with our Voice-enabled AI interviewer that challenges you on real JD requirements.",
            icon: <Mic className="w-8 h-8 text-[var(--accent)]" />,
            path: "/candidate/interview",
            color: "bg-[var(--accent)]/10 border-cyan-500/20"
        },
        {
            title: "Smart Job Board",
            desc: "Browse and apply to AI-curated job listings that match your skills.",
            icon: <Briefcase className="w-8 h-8 text-purple-400" />,
            path: "/candidate/jobs",
            color: "bg-purple-400/10 border-purple-400/20"
        }
    ];

    return (
        <div className="p-4 md:p-8 pt-32 text-[var(--foreground)] flex flex-col items-center justify-start">
            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-sm uppercase text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)]/70" style={{ fontFamily: 'var(--font-agale)' }}>
                    Candidate Hub
                </h1>
                <p className="text-[var(--foreground)]/60 text-lg md:text-xl max-w-2xl mx-auto font-light">
                    Tools to help you stand out and get hired faster.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {tools.map((tool, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(tool.path)}
                        className="glass-panel p-8 rounded-2xl cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between min-h-[280px]"
                    >
                        <div>
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${tool.color}`}>
                                {tool.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 tracking-wide">{tool.title}</h3>
                            <p className="text-[var(--foreground)]/60 leading-relaxed group-hover:text-[var(--foreground)] transition-colors text-sm">
                                {tool.desc}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--primary)] opacity-80 group-hover:opacity-100 transition-opacity">
                            Launch Tool <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
