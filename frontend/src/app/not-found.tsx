"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-[var(--foreground)] p-8 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--cream)]/10 backdrop-blur-xl p-12 rounded-[3rem] border border-[var(--cream)]/20 text-center shadow-2xl max-w-md"
            >
                <div className="w-20 h-20 bg-[var(--mustard)]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--mustard)]/30">
                    <AlertCircle className="w-10 h-10 text-[var(--mustard)]" />
                </div>
                <h1 className="text-6xl font-black mb-4 text-[var(--cream)]" style={{ fontFamily: 'var(--font-agale)' }}>404</h1>
                <p className="text-[var(--cream)]/60 mb-10 text-lg">Oops! This page was moved or doesn't exist in our static export.</p>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-[var(--mustard)] text-[var(--navy)] px-8 py-4 rounded-full font-bold hover:bg-[var(--mustard)]/90 transition-all mx-auto shadow-lg"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
}
