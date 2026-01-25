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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm"></div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-wide font-agale">
                        {isLogin ? 'WELCOME BACK' : 'JOIN US'}
                    </h1>
                    <p className="text-white/60 text-sm font-light tracking-wider">
                        {isLogin ? 'Access your AI recruiting portal' : 'Start your journey with us'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:bg-black/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-sans"
                                placeholder="admin@123.login"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:bg-black/30 focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all font-sans"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} fullWidth>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-purple-600" /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
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
