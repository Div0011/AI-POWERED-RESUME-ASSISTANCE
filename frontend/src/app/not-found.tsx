"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, FileQuestion, Terminal } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-[var(--foreground)] p-8 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-12 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg border border-[var(--primary)]/20 relative overflow-hidden"
            >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)]/10 rounded-full blur-3xl" />

                <div className="w-24 h-24 bg-[var(--card-bg)] rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[var(--card-border)] shadow-inner">
                    <FileQuestion className="w-12 h-12 text-[var(--primary)] animate-pulse" />
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-center gap-2 text-[var(--primary)] text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-70">
                        <Terminal className="w-4 h-4" />
                        System Error
                    </div>
                    <h1 className="text-8xl font-black mb-2 text-[var(--foreground)]" style={{ fontFamily: 'var(--font-agale)' }}>404</h1>
                    <p className="text-[var(--foreground)]/50 text-lg font-mono">Module not found in vector database.</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center justify-center gap-2 bg-[var(--primary)] text-black px-8 py-4 rounded-xl font-bold hover:bg-[var(--primary)]/90 transition-all shadow-[0_0_20px_rgba(0,232,255,0.3)]"
                    >
                        <Home className="w-5 h-5" />
                        Return to Base
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="text-[var(--foreground)]/40 hover:text-[var(--primary)] text-sm font-mono transition-colors"
                    >
                        &lt; Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
