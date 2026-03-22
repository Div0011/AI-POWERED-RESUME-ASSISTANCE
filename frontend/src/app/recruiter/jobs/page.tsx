"use client";

import React, { useState, useEffect } from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE } from '@/config';
import { Briefcase, Zap, Rocket, X } from 'lucide-react';

export default function JobDeployment() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [formData, setFormData] = useState({
    title: "Senior Backend Engineer",
    salary: "₹18L – ₹28L",
    skills: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis']
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/jobs/`);
      setActiveJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      const res = await axios.post(`${API_BASE}/jobs/expand`, {
        title: formData.title,
        salary_range: formData.salary,
        required_skills: formData.skills
      });
      setAiDescription(res.data.expanded_description);
      setIsExpanded(true);
    } catch (err) {
      console.error("Failed to expand job:", err);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <SecTitle>Mission Deployment</SecTitle>
      
      <Card title="Deploy a New Mission" sub="AI will expand your brief into a full mission descriptor and auto-match neural signals.">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.2em]">Mission Title</div>
            <input 
              className="w-full bg-[var(--navy2)] border border-[var(--border)] rounded-lg px-4 py-2 text-[11px] font-bold text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.2em]">Compensation Range</div>
            <input 
              className="w-full bg-[var(--navy2)] border border-[var(--border)] rounded-lg px-4 py-2 text-[11px] font-bold text-[var(--text)] outline-none focus:border-[var(--cyan)] transition-all" 
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
          </div>
        </div>
        
        <div className="text-[10px] text-[var(--dim)] font-black uppercase tracking-[0.2em] mb-2">Required Neural Skills</div>
        <div className="flex flex-wrap gap-2 mb-8">
          {formData.skills.map((s: string) => (
            <NeuralBadge key={s} variant="cyan">{s}</NeuralBadge>
          ))}
          <NeuralBadge variant="gray" className="cursor-pointer border-dashed">+ Add Skill</NeuralBadge>
        </div>
        
        <NeuralButton className="w-full py-4 text-xs" onClick={handleExpand} disabled={isExpanding}>
          {isExpanding ? "⚡ Synchronizing with Neural Engine..." : "⚡ Deploy Mission with AI"}
        </NeuralButton>
      </Card>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6 bg-[var(--navy3)] border border-[var(--cyan)] rounded-2xl shadow-[0_0_40px_rgba(0,241,254,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                 <Zap className="w-24 h-24 text-[var(--cyan)]" />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--cyan)] rounded-full animate-pulse shadow-[0_0_10px_var(--cyan)]" />
                    <span className="text-[var(--cyan)] text-[10px] font-black tracking-[0.3em] uppercase neural-glow-cyan">AI Expansion Logic Complete</span>
                 </div>
                 <NeuralBadge variant="purple">Llama-3 Neural Tier</NeuralBadge>
              </div>

              <div className="text-[11px] text-[var(--muted)] leading-relaxed mb-8 whitespace-pre-line font-medium opacity-90 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                {aiDescription}
              </div>

              <div className="flex gap-3">
                <NeuralButton onClick={() => setIsExpanded(false)} className="px-8">🚀 Initialize Mission</NeuralButton>
                <NeuralButton variant="ghost" onClick={() => setIsExpanded(false)} className="px-6 flex items-center gap-2">
                   <X className="w-3 h-3" /> Terminate Drift
                </NeuralButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SecTitle>Active Operational Missions</SecTitle>
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[var(--navy2)] rounded-3xl animate-pulse" />)
        ) : activeJobs.length === 0 ? (
          <div className="md:col-span-2 text-center py-20 opacity-30 text-[10px] font-black tracking-[0.5em] uppercase">No active missions detected.</div>
        ) : (
          activeJobs.map((job, idx) => (
            <Card key={idx} className="group cursor-pointer hover:border-[var(--cyan)] transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black font-display text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors leading-tight">{job.title}</h3>
                  <div className="text-[9px] text-[var(--dim)] font-black uppercase tracking-widest mt-1 italic">Linked: {new Date().toLocaleDateString()}</div>
                </div>
                <NeuralBadge variant="green">Active</NeuralBadge>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {job.required_skills?.slice(0, 4).map((s: string) => (
                   <NeuralBadge key={s} variant="gray" className="!bg-transparent !border-white/10 !text-[8.5px] lowercase italic">{s}</NeuralBadge>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


