"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface SidebarProps {
  role: 'recruiter' | 'candidate';
}

import { 
  BarChart3, 
  Briefcase, 
  Users, 
  Globe, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  LayoutDashboard,
  Settings,
  HelpCircle
} from 'lucide-react';

const recruiterNav = [
  { section: 'RECRUITMENT', items: [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Job Deployment', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Talent Matrix', path: '/recruiter/talent', icon: Users },
    { name: 'Global Pool', path: '/recruiter/pool', icon: Globe },
  ]},
  { section: 'INTELLIGENCE', items: [
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
  ]}
];

const candidateNav = [
  { section: 'EXPLORE', items: [
    { name: 'Mission Board', path: '/candidate/jobs', icon: Briefcase },
    { name: 'ATS Kernel', path: '/candidate/ats', icon: ShieldCheck },
  ]},
  { section: 'PREPARE', items: [
    { name: 'Interview Arena', path: '/candidate/interview', icon: MessageSquare },
    { name: 'Resume Builder', path: '/candidate/builder', icon: FileText },
  ]}
];

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const nav = role === 'recruiter' ? recruiterNav : candidateNav;

  return (
    <div className="w-[240px] bg-[var(--navy2)] border-r border-white/5 py-8 shrink-0 overflow-y-auto flex flex-col justify-between relative">
      {/* Background Decorative Neural Pulse */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--cyan)] to-transparent opacity-[0.05]" />
      
      <div>
        <div className="px-6 mb-12">
           <div className="text-xl font-black font-display text-[var(--cyan)] neural-glow-cyan tracking-tighter italic">GET IT!</div>
           <div className="text-[8px] text-[var(--dim)] font-black uppercase tracking-[0.5em] mt-1 pl-1">Neural Node 01</div>
        </div>

        {nav.map((section, idx) => (
          <div key={idx} className="px-4 mb-10">
            <div className="text-[9px] text-[var(--dim)] tracking-[0.4em] font-black uppercase mb-4 px-3 flex items-center gap-2">
              <span className="w-1 h-1 bg-[var(--dim)] rounded-full opacity-40" />
              {section.section}
            </div>
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-[10.5px] font-black uppercase tracking-widest transition-all mb-1.5 group relative
                    ${isActive ? 'text-[var(--cyan)] neural-glow-cyan' : 'text-[var(--muted)] hover:text-[var(--cyan)]'}
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="navGlow" 
                      className="absolute inset-0 bg-gradient-to-r from-[rgba(0,241,254,0.08)] to-transparent rounded-xl -z-10" 
                    />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--cyan)]' : 'text-[var(--dim)] group-hover:text-[var(--cyan)]'}`} />
                  {item.name}
                  {isActive && <div className="absolute left-[-16px] w-1.5 h-1.5 bg-[var(--cyan)] rounded-full blur-[2px] animate-pulse" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="px-6 pt-6 border-t border-white/5 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2 group cursor-pointer">
             <div className="w-8 h-8 rounded-full bg-[var(--navy3)] border border-white/5 flex items-center justify-center text-[10px] font-black group-hover:border-[var(--cyan)] transition-colors">
                {role === 'recruiter' ? 'D' : 'A'}
             </div>
             <div>
                <div className="text-[10px] font-black text-[var(--text)] uppercase tracking-tight">{role === 'recruiter' ? 'Admin Node' : 'User Node'}</div>
                <div className="text-[8px] text-green-400 font-bold uppercase">Linked</div>
             </div>
          </div>
      </div>
    </div>
  );
};


