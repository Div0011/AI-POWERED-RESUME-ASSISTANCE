"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Sparkles, Loader2, AlertCircle, User, Briefcase } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { useAuth } from '@/context/AuthContext';

type Role = 'candidate' | 'recruiter';

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>('candidate');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, role });
            login(res.data.access_token, res.data.role, email);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050505]">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                            <Sparkles className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter text-white font-agale">Create Identity</h1>
                        <p className="text-white/40 text-sm mt-2">Join the agentic recruitment era</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Account Protocol</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('candidate')}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${role === 'candidate'
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08]'}`}
                                >
                                    <User className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Candidate</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('recruiter')}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${role === 'recruiter'
                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/[0.08]'}`}
                                >
                                    <Briefcase className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Recruiter</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="agent@getit.ai"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Establish Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    min={8}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-rose-400 bg-rose-400/10 p-4 rounded-xl text-xs font-bold border border-rose-400/20"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    ACTIVATE PROTOCOLS
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium">
                        <span className="text-white/20">Already verified? </span>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-bold"
                        >
                            Identity Portal
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
