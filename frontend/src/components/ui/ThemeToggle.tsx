"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg transition-all hover:bg-white/20"
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5" fill="currentColor" />
            ) : (
                <Sun className="w-5 h-5" fill="currentColor" />
            )}
        </motion.button>
    );
};
