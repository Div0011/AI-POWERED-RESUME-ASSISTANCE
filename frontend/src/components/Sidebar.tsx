"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, Sparkles, BarChart3, FileText, MessageSquare } from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/recruiter/dashboard' },
    { name: 'Talent Pool', icon: Users, path: '/recruiter/talent-pool' },
    { name: 'Analytics', icon: BarChart3, path: '/recruiter/analytics' },
    { name: 'Candidate Hub', icon: FileText, path: '/candidate/check' },
    { name: 'Interviewer', icon: MessageSquare, path: '/candidate/interview' },
];

import { motion } from 'framer-motion';

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-50">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Sparkles className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tighter text-white">GET IT!</h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${pathname === item.path
                            ? 'bg-purple-500/10 text-white border border-purple-500/20'
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {pathname === item.path && (
                            <motion.div
                                layoutId="active-sidebar"
                                className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full"
                            />
                        )}
                        <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${pathname === item.path ? 'text-purple-400' : 'opacity-50'}`} />
                        <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 w-full transition-all">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium text-sm">Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/5 w-full transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
