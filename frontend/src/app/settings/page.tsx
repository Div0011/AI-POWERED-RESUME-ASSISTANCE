"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Save, Bell, Shield, User } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
            <header className="mb-12">
                <h1 className="text-4xl font-bold font-agale mb-2">SYSTEM CONFIGURATION</h1>
                <p className="text-[var(--foreground)]/60 font-mono text-sm">
                    // USER_ID: {user?.email || 'GUEST_SESSION'}
                </p>
            </header>

            {/* 1. Profile Section */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-3xl space-y-6"
            >
                <div className="flex items-center gap-4 mb-6 border-b border-[var(--card-border)] pb-6">
                    <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Profile Identity</h2>
                        <p className="text-sm opacity-60">Manage your public display settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-70">Display Name</label>
                        <input type="text" placeholder="Enter full name" className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-xl px-4 py-3 focus:border-[var(--primary)] outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-70">Role Designation</label>
                        <div className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 opacity-50 cursor-not-allowed">
                            {user?.role?.toUpperCase() || 'UNASSIGNED'}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* 2. Visuals Section */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-8 rounded-3xl space-y-6"
            >
                <div className="flex items-center gap-4 mb-6 border-b border-[var(--card-border)] pb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Visual Engine</h2>
                        <p className="text-sm opacity-60">Customize the application aesthetics.</p>
                    </div>
                </div>

                <div className="p-4 bg-[var(--background)] rounded-xl border border-[var(--card-border)] text-sm opacity-60">
                    Interface theme is currently controlled by the global command bar.
                </div>
            </motion.section>

            {/* 3. Notifications */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-8 rounded-3xl space-y-6"
            >
                <div className="flex items-center gap-4 mb-6 border-b border-[var(--card-border)] pb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Notifications</h2>
                        <p className="text-sm opacity-60">Configure email and push alerts.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {['Email Alerts', 'Browser Push', 'Weekly Digest'].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 hover:bg-[var(--background)]/50 rounded-lg transition-colors cursor-pointer group">
                            <span className="text-sm font-medium">{item}</span>
                            <div className="w-10 h-6 bg-[var(--card-border)] rounded-full relative group-hover:bg-[var(--primary)]/20 transition-colors">
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            <div className="flex justify-end pt-8">
                <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-[var(--primary)]/40 hover:-translate-y-1 transition-all">
                    <Save className="w-4 h-4" />
                    SAVE CHANGES
                </button>
            </div>
        </div>
    );
}
