"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Shield, User, Bell, Terminal, Palette, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "@/config";

export default function SettingsPage() {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<null | 'success' | 'error'>(null);
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        if (user?.name) {
            setDisplayName(user.name);
        }
    }, [user]);

    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveStatus(null);
        
        try {
            await axios.post(`${API_BASE}/user/settings/update`, {
                display_name: displayName,
                email_notifications: emailNotifications,
                message_notifications: messageNotifications,
                marketing_emails: marketingEmails
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setSaveStatus('success');
            setSaveMessage('Settings saved successfully');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err: any) {
            setSaveStatus('error');
            setSaveMessage(err.response?.data?.detail || 'Failed to save settings');
            setTimeout(() => setSaveStatus(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-32 p-4 sm:p-0 pt-24 sm:pt-32">
            <header className="mb-8 sm:mb-12 text-center sm:text-left px-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 opacity-50">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Security Protocols</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold font-agale italic tracking-tight mb-2 uppercase">Configuration</h1>
                <p className="text-[var(--foreground)]/40 font-mono text-[10px] sm:text-sm uppercase tracking-widest leading-relaxed">
                    // USER_ID: <span className="text-[var(--primary)]/60">{user?.email || 'GUEST_SESSION'}</span>
                </p>
            </header>

            {/* Status Message */}
            {saveStatus && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                        saveStatus === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/50'
                            : 'bg-rose-500/10 border border-rose-500/50'
                    }`}
                >
                    {saveStatus === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                        saveStatus === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                        {saveMessage}
                    </span>
                </motion.div>
            )}

            {/* 1. Profile Section */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl space-y-6 bg-white/[0.02] border-[var(--card-border)]"
            >
                <div className="flex items-center gap-4 mb-4 sm:mb-6 border-b border-white/5 pb-6">
                    <div className="p-3 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black italic">Profile Identity</h2>
                        <p className="text-[10px] sm:text-sm opacity-40 uppercase tracking-widest font-mono">Public display settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Display Name</label>
                        <input 
                            type="text" 
                            placeholder="Enter full name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3.5 text-sm focus:border-[var(--primary)] outline-none transition-colors" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ml-1">Role Designation</label>
                        <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3.5 text-sm opacity-40 cursor-not-allowed font-mono">
                            {user?.role?.toUpperCase() || 'UNASSIGNED'}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* 2. Visual Systems */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl space-y-6 bg-white/[0.02] border-[var(--card-border)]"
            >
                <div className="flex items-center gap-4 mb-4 sm:mb-6 border-b border-white/5 pb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                        <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black italic">Visual Interface</h2>
                        <p className="text-[10px] sm:text-sm opacity-40 uppercase tracking-widest font-mono">Theme and accessibility</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-black/40 rounded-[2rem] border border-white/5 gap-6 sm:gap-4">
                    <div className="text-center sm:text-left">
                        <p className="font-bold text-sm sm:text-base uppercase tracking-tight italic">Chroma Mode</p>
                        <p className="text-[10px] sm:text-xs opacity-40 uppercase tracking-widest mt-1">Toggle light/dark matrix</p>
                    </div>
                    <ThemeToggle />
                </div>
            </motion.section>

            {/* 3. Neural Alerts */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl space-y-6 bg-white/[0.02] border-[var(--card-border)]"
            >
                <div className="flex items-center gap-4 mb-4 sm:mb-6 border-b border-white/5 pb-6">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black italic">Neural Alerts</h2>
                        <p className="text-[10px] sm:text-sm opacity-40 uppercase tracking-widest font-mono">Notification protocols</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Application Updates', desc: 'Alert when mission status changes', state: emailNotifications, setState: setEmailNotifications },
                        { label: 'Secure Messages', desc: 'Direct protocol communications', state: messageNotifications, setState: setMessageNotifications },
                        { label: 'Marketing Comms', desc: 'General sector intelligence', state: marketingEmails, setState: setMarketingEmails }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 sm:p-6 bg-black/20 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all cursor-pointer" onClick={() => item.setState(!item.state)}>
                            <div className="max-w-[70%] sm:max-w-none">
                                <p className="font-bold text-xs sm:text-sm uppercase tracking-tight">{item.label}</p>
                                <p className="text-[8px] sm:text-xs opacity-30 uppercase tracking-widest mt-1">{item.desc}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    item.setState(!item.state);
                                }}
                                className="w-10 sm:w-12 h-6 sm:h-7 bg-gray-600/20 rounded-full flex items-center px-1 border border-gray-500/20 transition-all"
                            >
                                <motion.div
                                    layout
                                    className={`w-4 sm:w-5 h-4 sm:h-5 rounded-full ${
                                        item.state ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gray-600'
                                    }`}
                                    animate={{ x: item.state ? 16 : 0 }}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.section>

            <div className="flex justify-end pt-8">
                <button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-[var(--primary)]/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </div>
        </div>
    );
}
