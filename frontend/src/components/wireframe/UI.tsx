"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* --- CORE INTERACTIVE COMPONENTS --- */

export const Card = ({ children, title, sub, className = "" }: { children: React.ReactNode, title?: string, sub?: string, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-card p-5 relative overflow-hidden group ${className}`}
  >
    {/* Background Glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" />
    
    {title && (
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-[0.1em] text-[var(--text)] font-display">{title}</h3>
        {sub && <p className="text-[10px] text-[var(--muted)] mt-0.5 font-sans italic">{sub}</p>}
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export const NeuralStat = ({ num, label, icon: Icon }: { num: string, label: string, icon?: any }) => (
  <div className="p-4 bg-[var(--navy2)] border-l-2 border-[var(--cyan)] rounded-r-xl transition-all hover:bg-[var(--navy3)] cursor-default">
    <div className="flex justify-between items-start mb-1">
      <div className="text-2xl font-black font-display text-[var(--text)] neural-glow-cyan tracking-tighter">{num}</div>
      {Icon && <Icon className="w-4 h-4 text-[var(--cyan)] opacity-60" />}
    </div>
    <div className="text-[9px] uppercase tracking-[0.2em] font-black text-[var(--dim)]">{label}</div>
  </div>
);

export const NeuralBadge = ({ children, variant = "cyan", className = "" }: { children: React.ReactNode, variant?: string, className?: string }) => {
  const colors = {
    cyan: "bg-[rgba(153,247,255,0.06)] text-[var(--cyan)] border-[var(--border-active)] shadow-[0_0_8px_rgba(153,247,255,0.1)]",
    purple: "bg-[rgba(214,116,255,0.06)] text-[var(--purple)] border-[rgba(214,116,255,0.2)] shadow-[0_0_8px_rgba(214,116,255,0.1)]",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    gray: "bg-white/5 text-[var(--muted)] border-white/10"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider border uppercase transition-all hover:scale-105 cursor-default ${colors[variant as keyof typeof colors]} ${className}`}>
      {children}
    </span>
  );
};

export const NeuralButton = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "secondary" | "ghost" | "danger", size?: "sm" | "md", className?: string, disabled?: boolean }) => {
  const styles = {
    primary: "bg-[var(--primary-gradient)] text-black border-none hover:shadow-[0_0_25px_rgba(0,241,254,0.4)]",
    secondary: "bg-[var(--navy3)] text-[var(--cyan)] border-[rgba(0,241,254,0.3)] hover:bg-[var(--navy)]",
    ghost: "bg-white/5 text-[var(--muted)] border-transparent hover:text-[var(--text)] hover:bg-white/10",
    danger: "bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30"
  };
  const sizes = { sm: "px-3 py-1.5 text-[10px]", md: "px-5 py-2.5 text-[11px]" };
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 disabled:opacity-50 border ${styles[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

/* --- ILLUSTRATIVE NEURAL COMPONENTS --- */

export const PipelineOrb = ({ size = 200 }) => (
  <div className="relative flex items-center justify-center animate-neural-pulse" style={{ width: size, height: size }}>
    {/* Multiple Glowing Rings */}
    <div className="absolute inset-0 border-2 border-[var(--cyan)] rounded-full opacity-20 animate-[spin_10s_linear_infinite]" />
    <div className="absolute inset-4 border-2 border-[var(--purple)] rounded-full opacity-10 animate-[spin_15s_linear_infinite_reverse]" />
    <div className="absolute inset-10 bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] rounded-full blur-[40px] opacity-10" />
    
    <div className="relative z-10 text-center">
       <div className="text-4xl font-black font-display text-[var(--text)] mb-1">94%</div>
       <div className="text-[8px] uppercase font-black tracking-[0.4em] text-[var(--cyan)] neural-glow-cyan">Pipeline Health</div>
    </div>
    
    {/* Floating Particles */}
    {[1, 2, 3, 4, 5, 6].map(i => (
      <motion.div 
        key={i}
        className="absolute w-1 h-1 rounded-full bg-[var(--cyan)]"
        animate={{ 
           scale: [0, 1.5, 0],
           x: [0, Math.sin(i) * 50, Math.cos(i) * 30],
           y: [0, Math.cos(i) * 50, Math.sin(i) * 30],
           opacity: [0, 1, 0]
        }}
        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: i * 0.5 }}
      />
    ))}
  </div>
);

export const NeuralBridge = ({ score }: { score: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="rotate-[-90deg]">
        <circle cx="70" cy="70" r={radius} stroke="var(--navy3)" strokeWidth="8" fill="transparent" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#neuralGradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--cyan)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black font-display text-[var(--text)] leading-none">{score}<span className="text-xs font-normal opacity-50">%</span></div>
        <div className="text-[7px] font-black uppercase tracking-widest text-[var(--dim)] mt-1">SIMULATION</div>
      </div>
    </div>
  );
};

export const NeuralRadar = () => (
  <div className="relative w-full aspect-square max-w-[220px] mx-auto filter drop-shadow-[0_0_15px_rgba(0,241,254,0.2)]">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Background Grids */}
      {[25, 38, 50].map(r => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="2 2" />
      ))}
      <line x1="50" y1="0" x2="50" y2="100" stroke="var(--border)" strokeWidth="0.5" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth="0.5" />
      
      {/* Neural Core */}
      <motion.polygon 
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        points="50,15 85,35 90,65 50,85 10,65 15,35" 
        fill="rgba(214, 116, 255, 0.1)" 
        stroke="var(--purple)" 
        strokeWidth="1.5"
      />
      <motion.circle 
        cx="50" cy="15" r="1.5" fill="var(--cyan)"
        animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  </div>
);

export const NeuralProgress = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`w-full h-1 bg-[var(--navy3)] rounded-full overflow-hidden ${className}`}>
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] shadow-[0_0_10px_rgba(0,241,254,0.3)]"
    />
  </div>
);

export const SecTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`mb-5 flex items-center gap-3 ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[var(--border-active)]" />
    <h2 className="text-[10px] font-black text-[var(--cyan)] uppercase tracking-[0.4em] neural-glow-cyan">
       {children}
    </h2>
    <div className="h-[1px] w-6 bg-[var(--border-active)]" />
  </div>
);
