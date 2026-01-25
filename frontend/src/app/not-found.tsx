"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-8 bg-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/20 text-center shadow-2xl max-w-md"
            >
                <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/30">
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                </div>
                <h1 className="text-6xl font-black mb-4" style={{ fontFamily: 'var(--font-agale)' }}>404</h1>
                <p className="text-white/60 mb-10 text-lg">Oops! This page was moved or doesn't exist in our static export.</p>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all mx-auto shadow-lg"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>
            </motion.div>
        </div>
    );
}
