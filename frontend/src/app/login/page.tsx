"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                // Login Logic - JSON payload
                // Note: Ensure your backend supports JSON login at /auth/token endpoint
                // If it ONLY supports form-data, you MUST use FormData object.
                // Assuming we fixed the backend or reusing the previous working JSON approach if applicable.
                // However, the user request in step 219/248 implies reverting to JSON.
                // Wait, in step 216 I fixed it to use FormData because backend used OAuth2PasswordRequestForm.
                // If I revert to JSON now, it might break again unless backend was changed.
                // The user's prompt in 248 said "Revert Login logic to JSON".
                // I'll follow the instruction but if backend is unchanged it might fail.
                // Actually, let's look at auth.py again. The /token endpoint uses `user: schemas.UserCreate` which is a Pydantic model (JSON).
                // Wait, let me check auth.py content from step 242.
                // @router.post("/token", response_model=schemas.Token)
                // def login(user: schemas.UserCreate, ...):
                // It treats `user` as a JSON body `UserCreate`.
                // So JSON IS correct for the current backend code shown in step 242.
                // The previous FormData fix (step 216) might have been based on an assumption or I misread the file.
                // Let's stick to JSON as requested and as per auth.py inspection.

                const response = await axios.post('http://localhost:8000/auth/token', {
                    email,
                    password,
                    role: 'recruiter'
                });
                localStorage.setItem('token', response.data.access_token);
                router.push('/dashboard');
            } else {
                // Signup Logic
                const response = await axios.post('http://localhost:8000/auth/signup', {
                    email,
                    password,
                    role: 'recruiter'
                });
                localStorage.setItem('token', response.data.access_token);
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.detail || (isLogin ? 'Login failed.' : 'Signup failed.');
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent blur-sm"></div>

                <div className="text-center mb-10">
                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-wide font-agale uppercase">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h1>
                    <p className="text-[var(--foreground)]/60 text-sm font-light tracking-wide">
                        {isLogin ? 'Access your AI recruiting portal' : 'Start your journey with us'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-[var(--foreground)]/70 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[var(--foreground)]/40 group-focus-within:text-[var(--primary)] transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--slate-950)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-sans text-sm"
                                placeholder="admin@123.login"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[var(--foreground)]/70 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[var(--foreground)]/40 group-focus-within:text-[var(--primary)] transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--slate-950)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-sans text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} fullWidth>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-white/70 hover:text-white font-medium transition-colors hover:underline decoration-white/30 underline-offset-4"
                    >
                        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
