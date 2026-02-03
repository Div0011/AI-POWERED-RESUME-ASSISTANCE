"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BarChart3,
    Briefcase, FileText, MessageSquare,
    Settings, LogOut, Search, Plus, Mic, Upload
} from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

const recruiterNav = [
    { name: 'Talent Matrix', icon: Users, path: '/recruiter/dashboard' },
    { name: 'Post Job', icon: Plus, path: '/recruiter/jobs/new' },
    { name: 'Hiring Intelligence', icon: BarChart3, path: '/recruiter/analytics' },
];

const candidateNav = [
    { name: 'Job Posts', icon: Briefcase, path: '/candidate/jobs' },
    { name: 'ATS Kernel', icon: FileText, path: '/candidate/check' },
    { name: 'Interview Arena', icon: MessageSquare, path: '/candidate/interview' },
];

export const HeaderMenu = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const isRecruiter = user?.role === 'recruiter';
    const menuItems = isRecruiter ? recruiterNav : candidateNav;

    // Hover state to trigger "Pull Down"
    const [isHovered, setIsHovered] = useState(false);

    // CMD Label Logic
    const getCmdLabel = () => {
        if (pathname.includes('/candidate')) return 'CMD :: CANDIDATE';
        if (pathname.includes('/recruiter')) return 'CMD :: RECRUITER';
        return 'CMD :: STANDBY';
    };

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full h-[80px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The "Invisible" Trigger Zone is inherent in the container height */}

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: isHovered ? 0 : -80 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="absolute top-0 w-full max-w-5xl mt-2 px-6 py-3 rounded-full glass-panel border border-[var(--card-border)] bg-[var(--obsidian)]/80 backdrop-blur-xl shadow-2xl flex items-center justify-between"
            >
                {/* 1. Logo Group */}
                <div className="flex items-center gap-4">
                    <span className="font-agale font-bold text-xl tracking-tighter text-[var(--foreground)]">
                        GET IT!
                    </span>
                    <div className="h-6 w-[1px] bg-[var(--card-border)] mx-2" />

                    {/* CMD Badge */}
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md min-w-[120px] text-center">
                        {getCmdLabel()}
                    </span>
                </div>

                {/* 2. Center Navigation */}
                <nav className="flex items-center gap-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`
                                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all group
                                    ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'}
                                `}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary)]' : 'opacity-70 group-hover:opacity-100'}`} />
                                    {item.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* 3. Right Global Tools */}
                <div className="flex items-center gap-2 pl-4 border-l border-[var(--card-border)]">
                    <ThemeToggle />

                    {/* AI Interaction Tools */}


                    {/* Settings & Logout */}
                    <Link href="/settings" className="p-2 rounded-full hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors">
                        <Settings className="w-5 h-5" />
                    </Link>

                    <button
                        onClick={logout}
                        className="p-2 rounded-full hover:bg-rose-500/10 text-[var(--foreground)]/60 hover:text-rose-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            {/* Hint Line (Visible when hidden so user knows to hover) */}
            <motion.div
                animate={{ opacity: isHovered ? 0 : 1, width: isHovered ? "0%" : "20%" }}
                className="absolute top-0 h-[2px] bg-[var(--primary)]/50 rounded-b-full shadow-[0_0_10px_var(--primary)]"
            />
        </div>
    );
};
