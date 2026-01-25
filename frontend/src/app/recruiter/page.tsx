"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mail, PieChart, ArrowRight } from 'lucide-react';

export default function RecruiterHub() {
    const router = useRouter();

    const tools = [
        {
            title: "Job Dashboard",
            desc: "Post jobs, manage listings, and view applicants in one place.",
            icon: <LayoutDashboard className="w-8 h-8 text-purple-200" />,
            path: "/dashboard",
            color: "bg-purple-500/20"
        },
        {
            title: "Smart Inbox",
            desc: "AI-powered email automation. Automatically screens and replies to candidates.",
            icon: <Mail className="w-8 h-8 text-pink-200" />,
            path: "/recruiter/inbox",
            color: "bg-pink-500/20"
        },
        {
            title: "Analytics (Beta)",
            desc: "Deep insights into your hiring funnel and time-to-hire metrics.",
            icon: <PieChart className="w-8 h-8 text-blue-200" />,
            path: "/recruiter/analytics",
            color: "bg-blue-500/20"
        }
    ];

    return (
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-28 text-white flex flex-col items-center justify-center pb-24 md:pb-8">
            <header className="mb-16 text-center">
                <h1 className="text-5xl font-bold tracking-wide mb-4 drop-shadow-md uppercase" style={{ fontFamily: 'var(--font-agale)' }}>
                    Recruiter Tools
                </h1>
                <p className="text-white/60 text-xl max-w-2xl mx-auto">
                    Everything you need to streamline your hiring process.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {tools.map((tool, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => router.push(tool.path)}
                        className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 hover:bg-white/20 transition-all cursor-pointer group hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between min-h-[300px]"
                    >
                        <div>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${tool.color}`}>
                                {tool.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 tracking-wide">{tool.title}</h3>
                            <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                                {tool.desc}
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                            Launch Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
