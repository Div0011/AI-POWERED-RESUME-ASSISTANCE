"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, XCircle, Clock, Filter, Terminal, Cpu } from 'lucide-react';

// Mock Data for Email Automation
const MOCK_EMAILS = [
    { id: 1, sender: "alex.dev@gmail.com", subject: "Application for Senior React Dev", time: "10 mins ago", status: "processed", score: 92, action: "Auto-Replied (Calendar Link)" },
    { id: 2, sender: "sarah.design@yahoo.com", subject: "UX Designer Application", time: "25 mins ago", status: "processed", score: 45, action: "Auto-Replied (Rejection)" },
    { id: 3, sender: "mike.python@outlook.com", subject: "Backend Engineer Role", time: "1 hour ago", status: "hold", score: 68, action: "Flagged for Human Review" },
    { id: 4, sender: "spam.bot@marketing.com", subject: "SEO Services", time: "2 hours ago", status: "ignored", score: 0, action: "Ignored" },
];

export default function InboxPage() {
    const [emails, setEmails] = useState(MOCK_EMAILS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshInbox = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 pt-24 sm:pt-32 max-w-7xl mx-auto font-sans">
            <header className="mb-8 sm:mb-12 flex flex-col items-center sm:items-start justify-center text-center sm:text-left relative">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-[var(--primary)] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-3">
                    <Terminal className="w-4 h-4" />
                    AUTONOMOUS :: MAIL_PROXY
                </div>
                <h1 className="text-4xl sm:text-6xl font-agale font-bold tracking-tighter text-[var(--foreground)] italic mb-4 leading-none">
                    Smart Inbox
                </h1>
                <p className="text-[var(--foreground)]/50 font-mono text-[10px] sm:text-sm max-w-2xl leading-relaxed uppercase tracking-widest">
                    Real-time ingestion. The AI intercepts applicant emails at
                    <span className="text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded mx-1 break-all">jobs@mowglai.in</span>
                </p>

                <button
                    onClick={refreshInbox}
                    className="mt-6 sm:mt-0 sm:absolute sm:right-0 sm:top-4 bg-[var(--obsidian)] border border-[var(--card-border)] p-4 rounded-2xl hover:bg-[var(--foreground)]/5 hover:border-[var(--primary)]/30 transition-all active:scale-95 shadow-xl glass-panel group"
                >
                    <RefreshCw className={`w-5 h-5 md:w-6 md:h-6 text-[var(--primary)] ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                </button>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {[
                    { label: "Processed Today", value: "42", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Auto-Interviewed", value: "8", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                    { label: "Auto-Rejected", value: "15", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
                    { label: "Needs Review", value: "5", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${stat.bg} ${stat.border} border p-6 rounded-[2rem] glass-panel transition-all hover:-translate-y-1 hover:shadow-xl`}
                    >
                        <h3 className={`text-3xl sm:text-4xl font-agale italic font-bold mb-2 ${stat.color}`}>{stat.value}</h3>
                        <p className="text-[var(--foreground)]/50 text-[10px] uppercase font-black tracking-[0.2em]">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Email List */}
            <div className="glass-panel bg-[var(--obsidian-card)]/40 rounded-[2.5rem] border border-[var(--card-border)] overflow-hidden shadow-2xl">
                <div className="p-6 sm:p-8 border-b border-[var(--card-border)] flex items-center justify-between">
                    <h2 className="text-xl font-agale font-bold italic flex items-center gap-3">
                        <Mail className="w-5 h-5 text-[var(--primary)]" />
                        Intercepted Comm Log
                    </h2>
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/40 flex items-center gap-2 hover:text-[var(--primary)] transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                <div className="divide-y divide-[var(--card-border)]">
                    {emails.map((email, idx) => (
                        <motion.div
                            key={email.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 sm:p-8 hover:bg-[var(--primary)]/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                        >
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className={`w-2 h-2 rounded-full shadow-lg ${email.status === 'processed' ? 'bg-emerald-400 shadow-emerald-500/50' :
                                        email.status === 'hold' ? 'bg-amber-400 shadow-amber-500/50' : 'bg-slate-500 shadow-slate-500/50'
                                        }`} />
                                    <h3 className="font-bold text-lg sm:text-xl tracking-wide group-hover:text-[var(--primary)] transition-colors">{email.sender}</h3>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--foreground)]/40 bg-[var(--foreground)]/5 border border-[var(--card-border)] px-2 py-0.5 rounded-lg">{email.time}</span>
                                </div>
                                <p className="text-[var(--foreground)]/60 text-sm">{email.subject}</p>
                            </div>

                            <div className="flex flex-row items-center gap-6 sm:gap-12 w-full md:w-auto mt-4 md:mt-0">
                                {email.score > 0 && (
                                    <div className="text-left md:text-center w-1/3 md:w-auto">
                                        <div className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-[var(--foreground)]/30 mb-1">Alignment</div>
                                        <div className={`text-xl sm:text-2xl font-agale italic font-bold ${email.score > 85 ? 'text-emerald-400' :
                                            email.score > 50 ? 'text-amber-400' : 'text-rose-400'
                                            }`}>
                                            {email.score}%
                                        </div>
                                    </div>
                                )}

                                <div className="w-2/3 md:w-56 text-right">
                                    <div className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-[var(--foreground)]/30 mb-1">AI Action</div>
                                    <div className="text-xs sm:text-sm font-bold text-[var(--primary)] font-mono uppercase tracking-widest">
                                        {email.action}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
