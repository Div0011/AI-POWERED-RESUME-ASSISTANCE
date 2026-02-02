"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { BackButton } from "./BackButton";
import { ThemeToggle } from "./ui/ThemeToggle";
import ErrorBoundary from "./ErrorBoundary";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    return (
        <>
            {!isLandingPage && <BackButton />}
            <ThemeToggle />
            {pathname.startsWith('/recruiter') && <Sidebar />}
            <main className={`${isLandingPage ? "" : "md:pr-24"} pt-0 transition-all duration-300 min-h-screen`}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </main>
        </>
    );
};
