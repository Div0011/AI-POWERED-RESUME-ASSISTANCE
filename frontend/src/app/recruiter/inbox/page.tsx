"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';

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
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-28 text-white pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 relative h-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-wide mb-2 drop-shadow-md" style={{ fontFamily: 'var(--font-agale)' }}>
                            SMART INBOX
                        </h1>
                        <p className="text-white/60">
                            Real-time email monitoring. The AI reads resumes sent to
                            <span className="text-purple-300 font-mono bg-white/10 px-2 py-0.5 rounded mx-1">jobs@mowglai.in</span>
                        </p>
                    </div>
                    <button
                        onClick={refreshInbox}
                        className="absolute right-0 bg-white/10 border border-white/20 p-3 rounded-xl hover:bg-white/20 transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Processed Today", value: "42", color: "bg-blue-500/20" },
                        { label: "Auto-Interviewed", value: "8", color: "bg-emerald-500/20" },
                        { label: "Auto-Rejected", value: "15", color: "bg-rose-500/20" },
                        { label: "Needs Review", value: "5", color: "bg-amber-500/20" },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.color} border border-white/10 p-6 rounded-2xl backdrop-blur-sm`}>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-white/60 text-sm uppercase tracking-wider font-semibold">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Email List */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Mail className="w-5 h-5 text-purple-300" />
                            Recent Activities
                        </h2>
                        <button className="text-sm text-white/50 flex items-center gap-1 hover:text-white">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>

                    <div className="divide-y divide-white/10">
                        {emails.map((email) => (
                            <motion.div
                                key={email.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${email.status === 'processed' ? 'bg-emerald-400' :
                                            email.status === 'hold' ? 'bg-amber-400' : 'bg-slate-500'
                                            }`} />
                                        <h3 className="font-bold text-lg">{email.sender}</h3>
                                        <span className="text-xs text-white/40 bg-white/10 px-2 py-0.5 rounded">{email.time}</span>
                                    </div>
                                    <p className="text-white/70">{email.subject}</p>
                                </div>

                                <div className="flex items-center gap-8">
                                    {email.score > 0 && (
                                        <div className="text-center">
                                            <div className="text-xs text-white/40 uppercase font-bold mb-1">AI Score</div>
                                            <div className={`text-xl font-bold ${email.score > 85 ? 'text-emerald-300' :
                                                email.score > 50 ? 'text-amber-300' : 'text-rose-300'
                                                }`}>
                                                {email.score}%
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-48 text-right">
                                        <div className="text-xs text-white/40 uppercase font-bold mb-1">Action Taken</div>
                                        <div className="text-sm font-medium text-purple-200">
                                            {email.action}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
