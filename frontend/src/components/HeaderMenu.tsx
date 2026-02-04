"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, BarChart3,
    Briefcase, FileText, MessageSquare,
    Settings, LogOut, Search, Plus, Mic, Upload, Menu, X
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
    const [isOpen, setIsOpen] = useState(false);

    const isRecruiter = user?.role === 'recruiter';
    const menuItems = isRecruiter ? recruiterNav : candidateNav;

    const getCmdLabel = () => {
        if (pathname.includes('/candidate')) return 'MISSION BOARD';
        if (pathname.includes('/recruiter')) return 'MISSION DEPLOY';
        return 'STANDBY';
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-50 px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full glass-panel border border-[var(--card-border)] bg-[var(--obsidian)]/80 backdrop-blur-xl shadow-2xl flex items-center justify-between"
            >
                {/* Logo & Label */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/" className="font-agale font-bold text-lg sm:text-xl tracking-tighter text-[var(--foreground)]">
                        GET IT!
                    </Link>
                    <div className="hidden sm:block h-6 w-[1px] bg-[var(--card-border)] mx-2" />
                    <span className="hidden xs:block text-[8px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded-md">
                        {getCmdLabel()}
                    </span>
                </div>

                {/* Center Nav (Desktop) */}
                <nav className="hidden md:flex items-center gap-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all group ${isActive ? 'text-[var(--foreground)]' : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'}`}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary)]' : 'opacity-70 group-hover:opacity-100'}`} />
                                    {item.name}
                                </span>
                                {isActive && (
                                    <motion.div layoutId="active-nav" className="absolute inset-0 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-1 border-l border-[var(--card-border)] ml-2 pl-2">
                        <Link href="/settings" className="p-2 rounded-full hover:bg-[var(--foreground)]/5 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors">
                            <Settings className="w-4 h-4" />
                        </Link>
                        <button onClick={logout} className="p-2 rounded-full hover:bg-rose-500/10 text-[var(--foreground)]/60 hover:text-rose-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] active:scale-95 transition-all"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45] md:hidden"
                        />
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] z-[46] glass-panel rounded-3xl p-6 md:hidden border border-[var(--card-border)]"
                        >
                            <div className="space-y-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-4 rounded-xl font-bold uppercase tracking-widest text-xs ${pathname === item.path ? 'bg-[var(--primary)] text-black' : 'bg-white/5 text-[var(--foreground)]/60'}`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 mt-4 border-t border-[var(--card-border)] grid grid-cols-2 gap-3">
                                    <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 text-[var(--foreground)]/60 font-bold text-[10px] uppercase">
                                        <Settings className="w-4 h-4" /> Settings
                                    </Link>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center justify-center gap-2 p-4 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-[10px] uppercase">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
