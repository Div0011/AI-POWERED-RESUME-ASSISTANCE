"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";

export const BackButton = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Do not show on home page
    if (pathname === "/") return null;

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="fixed top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full shadow-lg hover:shadow-glow hover:bg-white/25 transition-all hover:scale-105 group"
        >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wider text-sm hidden md:block">BACK</span>
        </motion.button>
    );
};
