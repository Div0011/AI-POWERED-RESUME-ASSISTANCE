"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, Briefcase, Settings, LogOut,
    Sparkles, BarChart3, FileText, MessageSquare, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLayout } from '@/context/LayoutContext';

const recruiterMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
    { name: 'Post Job', icon: Briefcase, path: '/recruiter/jobs/new-enhanced' },
    { name: 'Talent Pool', icon: Users, path: '/recruiter/talent-pool' },
    { name: 'Analytics', icon: BarChart3, path: '/recruiter/analytics' },
];

const candidateMenuItems = [
    { name: 'Mission Board', icon: Briefcase, path: '/candidate/jobs' },
    { name: 'ATS Simulator', icon: FileText, path: '/candidate/check' },
    { name: 'AI Interviewer', icon: MessageSquare, path: '/candidate/interview' },
    { name: 'Resume Builder', icon: Sparkles, path: '/candidate/resume' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const { isCollapsed, setIsCollapsed, isFocusMode } = useLayout();
    const menuItems = user?.role === 'recruiter' ? recruiterMenuItems : candidateMenuItems;

    return (
        <motion.aside
            initial={{ width: 256 }}
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-0 top-0 h-screen z-50 flex flex-col glass-slab overflow-hidden"
        >
            {/* Header / Logo */}
            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-[var(--cyan-electric)] to-emerald-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,232,255,0.3)]">
                        <Sparkles className="text-black w-5 h-5" strokeWidth={2} />
                    </div>
                    {!isCollapsed && (
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold tracking-tighter text-white font-agale"
                        >
                            GET IT!
                        </motion.h1>
                    )}
                </div>

                {!isCollapsed && !isFocusMode && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative
                                ${isActive
                                    ? 'bg-[var(--primary)] text-white shadow-[0_0_20px_rgba(0,232,255,0.15)]'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <item.icon
                                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 
                                    ${isActive ? 'text-white' : 'opacity-70'}
                                `}
                                strokeWidth={1.5}
                            />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium text-sm whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}

                            {/* Hover "Run" Effect for Borders could go here using pseudo-elements if needed */}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User Controls */}
            <div className="p-4 border-t border-[var(--card-border)] space-y-2">
                {/* Expand Button for manual override in focus mode */}
                {isCollapsed && isFocusMode && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex justify-center p-2 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                <button className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 w-full transition-all`}>
                    <Settings className="w-5 h-5" strokeWidth={1.5} />
                    {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
                </button>

                <button
                    onClick={logout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 px-3 py-3 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 w-full transition-all`}
                >
                    <LogOut className="w-5 h-5" strokeWidth={1.5} />
                    {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
                </button>
            </div>
        </motion.aside>
    );
}
