"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isFocusMode: boolean;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Determine Focus Mode based on route
    const isFocusMode = pathname.includes('/candidate/interview') || pathname.includes('/candidate/check');

    // Auto-collapse on Focus Mode changes
    useEffect(() => {
        if (isFocusMode) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false); // Optional: auto-expand when leaving focus mode?
        }
    }, [isFocusMode]);

    return (
        <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed, isFocusMode }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
}
