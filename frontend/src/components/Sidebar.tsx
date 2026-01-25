"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Mail,
    FileText,
    Briefcase,
    Users,
    Home,
    Settings,
    LogOut,
    ChevronLeft
} from 'lucide-react';

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    // Hide sidebar on landing page
    if (pathname === "/") return null;

    const isRecruiter = pathname.startsWith('/dashboard') || pathname.startsWith('/recruiter') || pathname.startsWith('/jobs');
    const isCandidate = pathname.startsWith('/candidate');

    const navItems = isRecruiter ? [
        { label: "Dashboard", icon: <LayoutDashboard className="w-6 h-6" />, path: "/dashboard" },
        { label: "Smart Inbox", icon: <Mail className="w-6 h-6" />, path: "/recruiter/inbox" },
        { label: "Job Postings", icon: <Briefcase className="w-6 h-6" />, path: "/dashboard" }, // Routing to dashboard for now
    ] : [
        { label: "My Hub", icon: <Home className="w-6 h-6" />, path: "/candidate" },
        { label: "AI Resume", icon: <FileText className="w-6 h-6" />, path: "/candidate/resume" },
        { label: "Job Match", icon: <Briefcase className="w-6 h-6" />, path: "/candidate/jobs" },
    ];

    const commonItems = [
        { label: "Switch Role", icon: <Users className="w-6 h-6" />, path: "/" }, // Go back to landing
    ];

    return (
        <motion.div
            className="fixed bottom-0 left-0 w-full md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-screen md:w-auto z-[100] flex"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Sidebar Content */}
            <motion.div
                className="w-full h-20 md:h-full bg-white/10 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/20 shadow-2xl overflow-hidden flex flex-row md:flex-col"
                animate={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : (isHovered ? 280 : 80) }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Header - Hidden on mobile */}
                <div className="hidden md:flex h-20 items-center justify-center border-b border-white/10 shrink-0">
                    <div className="w-full px-6 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                            <span className="font-bold text-white text-lg">G</span>
                        </div>
                        <AnimatePresence>
                            {isHovered && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="font-bold text-white text-xl tracking-wide whitespace-nowrap"
                                    style={{ fontFamily: 'var(--font-agale)' }}
                                >
                                    GET IT!
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-2 md:py-8 px-4 flex flex-row md:flex-col gap-2 md:gap-4 justify-around md:justify-start items-center md:items-stretch">
                    {[...navItems, ...commonItems].map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => router.push(item.path)}
                                className={`
                                    relative flex items-center h-12 md:h-14 rounded-2xl transition-all group w-auto md:w-full px-4 md:px-0
                                    ${isActive ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}
                                    ${isHovered ? 'md:justify-start md:px-4' : 'md:justify-center'}
                                    justify-center
                                `}
                            >
                                <div className={`shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                    {item.icon}
                                </div>

                                {/* Labels - Hidden on mobile unless desktop hovered */}
                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`ml-4 hidden md:block font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {/* Tooltip - Desktop only */}
                                {!isHovered && (
                                    <div className="hidden md:block absolute right-full mr-4 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer User Profile - Hidden on mobile */}
                <div className="hidden md:block p-4 border-t border-white/10 shrink-0">
                    <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 border-2 border-white/20"></div>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden"
                            >
                                <p className="text-sm font-bold text-white truncate">Divya User</p>
                                <p className="text-xs text-white/50 truncate">My Account</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
