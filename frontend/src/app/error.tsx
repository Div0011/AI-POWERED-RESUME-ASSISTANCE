"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw, ShieldAlert } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-[var(--foreground)] p-8 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-12 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(255,50,50,0.2)] max-w-lg border border-red-500/20 relative overflow-hidden"
            >
                {/* Critical Error Glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />

                <div className="w-24 h-24 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 animate-pulse">
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>

                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-80">
                        <AlertCircle className="w-4 h-4" />
                        Critical Failure
                    </div>
                    <h1 className="text-4xl font-black mb-4 text-[var(--foreground)] font-agale leading-tight">
                        Protocol Malfunction
                    </h1>
                    <p className="text-red-400/80 text-sm font-mono border-l-2 border-red-500/30 pl-3 text-left bg-red-500/5 p-2 rounded">
                        Error Code: {error.digest || 'CRITICAL_UNKNOWN_EXCEPTION'}
                        <br />
                        Message: {error.message}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Reboot System
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="text-[var(--foreground)]/40 hover:text-red-400 text-sm font-mono transition-colors"
                    >
                        Force Return to Base
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
