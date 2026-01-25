"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { BackButton } from "./BackButton";
import { ThemeToggle } from "./ui/ThemeToggle";

export const ClientLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    return (
        <>
            {!isLandingPage && <BackButton />}
            <ThemeToggle />
            {!isLandingPage && <Sidebar />}
            <main className={`${isLandingPage ? "" : "md:pr-24"} pt-0 transition-all duration-300 min-h-screen`}>
                {children}
            </main>
        </>
    );
};
