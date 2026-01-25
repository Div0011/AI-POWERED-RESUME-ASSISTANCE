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
            className="fixed right-0 top-0 h-screen z-[100] flex"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Sidebar Content */}
            <motion.div
                className="h-full bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl overflow-hidden flex flex-col"
                animate={{ width: isHovered ? 280 : 80 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-center border-b border-white/10">
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
                <div className="flex-1 py-8 px-4 flex flex-col gap-4">
                    {[...navItems, ...commonItems].map((item, index) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => router.push(item.path)}
                                className={`
                                    relative flex items-center h-14 rounded-2xl transition-all group w-full
                                    ${isActive ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'}
                                    ${isHovered ? 'justify-start px-4' : 'justify-center'}
                                `}
                            >
                                <div className={`shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                    {item.icon}
                                </div>

                                {isHovered && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`ml-4 font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {/* Tooltip for collapsed state */}
                                {!isHovered && (
                                    <div className="absolute right-full mr-4 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-md">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-white/10">
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
