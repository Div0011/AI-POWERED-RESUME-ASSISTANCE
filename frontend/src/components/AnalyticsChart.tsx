"use client";
import { motion } from 'framer-motion';

export default function AnalyticsChart({ chartBars }: { chartBars: number[] }) {
    return (
        <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
            {chartBars.map((height, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-purple-500/20 to-blue-500/40 rounded-t-xl hover:from-purple-500/40 hover:to-blue-500/60 transition-colors relative group"
                >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {height * 12}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
