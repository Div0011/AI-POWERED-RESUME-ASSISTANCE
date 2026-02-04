"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE } from '@/config';

interface User {
    email: string;
    role: 'candidate' | 'recruiter';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, role: string, email: string) => void;
    signInWithGoogle: () => Promise<void>;
    signupWithGoogle: (role: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedRole = localStorage.getItem('role') as 'candidate' | 'recruiter';
        const savedEmail = localStorage.getItem('email');

        if (savedToken && savedRole && savedEmail) {
            setToken(savedToken);
            setUser({ email: savedEmail, role: savedRole });
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        } else {
            // AUTO-INITIALIZE GUEST SESSION
            // This removes the need for a login page entirely
            const guestToken = "GUEST_NEURAL_LINK_" + Math.random().toString(36).substring(7);
            setToken(guestToken);
            setUser({ email: 'GUEST_OPERATOR@GETIT.AI', role: 'recruiter' }); // Default to Recruiter Hub access
            axios.defaults.headers.common['Authorization'] = `Bearer ${guestToken}`;
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, role: string, email: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);

        // Set cookies for middleware
        document.cookie = `token=${newToken}; path=/; max-age=86400`;
        document.cookie = `role=${role}; path=/; max-age=86400`;

        setToken(newToken);
        setUser({ email, role: role as 'candidate' | 'recruiter' });

        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Redirect based on role
        if (role === 'recruiter') {
            router.push('/recruiter/dashboard');
        } else {
            router.push('/candidate/check');
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { auth, googleProvider } = await import('@/lib/firebase');
            const { signInWithPopup } = await import('firebase/auth');
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const email = result.user.email || "";

            // Call backend to verify and get user role
            const res = await axios.post(`${API_BASE}/auth/google-login`, { token: idToken });
            login(idToken, res.data.role, email);
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            throw error;
        }
    };

    const signupWithGoogle = async (role: string) => {
        try {
            const { auth, googleProvider } = await import('@/lib/firebase');
            const { signInWithPopup } = await import('firebase/auth');
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const email = result.user.email || "";

            // Call backend to set role and sync user
            const res = await axios.post(`${API_BASE}/auth/google-signup`, { token: idToken, role });
            login(idToken, role, email);
        } catch (error) {
            console.error("Google Signup Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');

        // Remove cookies
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

        setToken(null);
        setUser(null);

        delete axios.defaults.headers.common['Authorization'];
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signInWithGoogle, signupWithGoogle, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
