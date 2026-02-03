"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { BackButton } from "./BackButton";
import { ThemeToggle } from "./ui/ThemeToggle";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { token, user, isLoading } = useAuth();
    const isLandingPage = pathname === "/";
    const showSidebar = pathname.startsWith('/recruiter') || pathname.startsWith('/candidate');

    useEffect(() => {
        if (isLoading) return;

        // 1. Redirect unauthenticated users
        if (!token && (pathname.startsWith('/recruiter') || pathname.startsWith('/candidate'))) {
            router.push('/login');
            return;
        }

        // 2. Role-based Access Control
        if (token && user?.role === 'candidate' && pathname.startsWith('/recruiter')) {
            router.push('/candidate/check');
        }

        if (token && user?.role === 'recruiter' && pathname.startsWith('/candidate')) {
            router.push('/recruiter/dashboard');
        }
    }, [pathname, token, user, isLoading, router]);

    return (
        <>
            {!isLandingPage && <BackButton />}
            <ThemeToggle />
            {showSidebar && <Sidebar />}
            <main className={`${showSidebar ? "md:pl-64" : ""} pt-0 transition-all duration-300 min-h-screen`}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </>
    );
};
