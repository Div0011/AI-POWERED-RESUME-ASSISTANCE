"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  role: 'recruiter' | 'candidate';
}

export const Layout = ({ children, role }: LayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[var(--navy)] text-[var(--text)] overflow-hidden font-sans selection:bg-[var(--cyan)] selection:text-black">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Background Subtle Gradient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--purple)] rounded-full blur-[200px] opacity-[0.02] -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--cyan)] rounded-full blur-[200px] opacity-[0.02] -z-10" />
        
        <Topbar role={role} />
        
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-4 md:p-10 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
