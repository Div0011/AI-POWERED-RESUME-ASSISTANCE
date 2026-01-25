"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, BarChart3, LogIn, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Auto transition intro
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000); // 2s total duration for intro

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  // Main Role Selection
  const roles = [
    {
      id: 'recruiter',
      label: "RECRUITERS",
      desc: "Hire top talent faster with AI automation.",
      path: "/recruiter",
      color: "group-hover:text-purple-300"
    },
    {
      id: 'candidate',
      label: "CANDIDATES",
      desc: "Optimize your resume and find your dream job.",
      path: "/candidate",
      color: "group-hover:text-pink-300"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Interactive Background Glow - Persistent */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-1000"
        animate={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.25), transparent 40%)`,
        }}
      />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              scale: 5, // Zoom VERY close in
              opacity: 0,
              filter: "blur(20px)"
            }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <motion.h1
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="text-8xl md:text-[12rem] text-white drop-shadow-2xl tracking-widest select-none text-center"
              style={{ fontFamily: 'var(--font-agale)' }}
            >
              GET IT!
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center z-10 w-full h-full relative"
          >
            <h2 className="text-2xl font-bold text-white/80 uppercase tracking-[0.2em] mb-12 animate-pulse mt-20 md:mt-0">Choose Your Role</h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-5xl px-8 pb-12 md:pb-0">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (index * 0.2) }}
                  onClick={() => router.push(role.path)}
                  className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-[3rem] cursor-pointer transition-all hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl hover:border-white/40 group flex flex-col items-center text-center aspect-[4/5] md:aspect-square justify-center relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${role.id === 'recruiter' ? 'from-purple-500 to-blue-500' : 'from-pink-500 to-orange-500'}`} />

                  <h3 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors ${role.color}`} style={{ fontFamily: 'var(--font-agale)' }}>
                    {role.label}
                  </h3>
                  <p className="text-lg text-white/60 font-light max-w-xs">{role.desc}</p>

                  <div className="mt-12 bg-white/10 p-4 rounded-full group-hover:bg-white/20 transition-all group-hover:scale-110">
                    <ArrowRight className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
