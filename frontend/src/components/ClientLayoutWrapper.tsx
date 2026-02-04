"use client";

import { usePathname, useRouter } from "next/navigation";
import { HeaderMenu } from "./HeaderMenu";
import { BackButton } from "./BackButton";
import { ThemeToggle } from "./ui/ThemeToggle";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { LayoutProvider, useLayout } from "@/context/LayoutContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search } from "lucide-react";

const ActionHUD = () => {
    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-[var(--primary)] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all"
            >
                <Plus className="w-8 h-8" strokeWidth={2} />
            </motion.button>
        </div>
    );
};

const LiquidProgressBar = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;
    return <div className="liquid-progress" />;
};

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { token, user, isLoading: authLoading } = useAuth();
    // const { isCollapsed } = useLayout(); // No longer needed for top nav
    const isLandingPage = pathname === "/";
    const showMenu = pathname.startsWith('/recruiter') || pathname.startsWith('/candidate');

    // Simulating "AI Processing" loading state for demo
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        // AUTH GUARD REMOVED - TOTAL ACCESS ENABLED
        // Redirection logic deactivated to allow pure agentic exploration
    }, [pathname, token, user, authLoading, router]);

    return (
        <div className="min-h-screen text-[var(--foreground)] selection:bg-[var(--primary)] selection:text-white">
            <LiquidProgressBar isLoading={authLoading || isProcessing} />

            {!isLandingPage && !showMenu && <BackButton />}

            {/* Top Right Controls - Cleaned up */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
                {/* Search removed as per user request */}
            </div>

            {showMenu && <HeaderMenu />}

            <main
                className="transition-all duration-500 ease-in-out min-h-screen pt-24 px-6 md:px-12 max-w-7xl mx-auto"
            >
                <ErrorBoundary>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </ErrorBoundary>
            </main>

            {/* ActionHUD (Plus Button) Removed */}
        </div>
    );
}

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <LayoutProvider>
            <ClientLayoutContent>
                {children}
            </ClientLayoutContent>
        </LayoutProvider>
    );
};
