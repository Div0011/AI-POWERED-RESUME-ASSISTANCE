"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, SecTitle, NeuralBadge, NeuralButton, NeuralProgress } from '@/components/wireframe/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Cpu, Shield, Zap, Info, ChevronRight, Terminal } from 'lucide-react';

export default function InterviewArena() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome to the Simulation Arena. I am your Neural Assessor. We are simulating the Senior Backend Engineer mission. Initializing probe: Describe a high-concurrency event you architected." },
    { role: 'user', text: "In my previous mission, I designed a distributed task queue handling 1M+ packets/hr. I used Redis clusters with custom Lua deduplication scripts to maintain ultra-low latency." },
    { role: 'ai', text: "Packet resonance detected. Let's analyze the conflict: How did you handle cluster-wide race conditions during the Redis failover window?" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages([...newMessages, { role: 'ai', text: "Logical consistency confirmed. We are escalating the simulation. Diagram the database schema required for a mission-critical transaction log with 99.99% durability." }]);
      setIsTyping(false);
    }, 1800);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-160px)] animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
        <div>
           <SecTitle className="!mb-0">Simulation Environment</SecTitle>
           <h1 className="text-3xl font-black font-display text-[var(--text)] tracking-tighter uppercase">Neural Arena</h1>
        </div>
        <div className="flex items-center gap-3">
           <NeuralBadge variant="purple">Tier: Alpha Protocol</NeuralBadge>
           <NeuralBadge variant="cyan" className="animate-pulse">Active Sync</NeuralBadge>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-[var(--navy2)] border border-white/5 rounded-3xl p-8 mb-6 space-y-8 custom-scrollbar relative shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]">
        {/* Arena Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
           <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,var(--cyan)_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>

        {messages.map((m, idx) => {
           const isAI = m.role === 'ai';
           return (
             <motion.div 
               key={idx} 
               initial={{ opacity: 0, x: isAI ? -20 : 20, scale: 0.95 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} relative z-10`}
             >
                <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-[var(--dim)] uppercase tracking-[0.3em]">
                   {isAI ? <Cpu className="w-3 h-3 text-[var(--cyan)]" /> : <Shield className="w-3 h-3 text-[var(--purple)]" />}
                   {isAI ? 'NEURAL ASSESSOR' : 'CANDIDATE NODE'}
                </div>
                <div className={`
                  p-5 text-[12px] leading-relaxed max-w-[85%] lg:max-w-[60%] rounded-2xl shadow-xl transition-all hover:scale-[1.01]
                  ${isAI ? 'bg-[var(--navy3)] text-[var(--text)] border border-[rgba(0,241,254,0.1)] rounded-tl-none font-medium' : 'bg-gradient-to-br from-[var(--navy)] to-[var(--navy2)] border border-[rgba(214,116,255,0.1)] text-[var(--text)] rounded-tr-none text-right italic font-bold'}
                `}>
                  {m.text}
                </div>
             </motion.div>
           );
        })}

        {isTyping && (
          <div className="flex flex-col items-start relative z-10">
            <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-[var(--dim)] uppercase tracking-[0.3em]">
               <Cpu className="w-3 h-3 text-[var(--cyan)]" /> NEURAL ASSESSOR
            </div>
            <div className="bg-[var(--navy3)] border border-[rgba(0,241,254,0.1)] rounded-2xl rounded-tl-none p-4 px-6 flex items-center gap-4">
               <span className="text-[10px] font-black text-[var(--cyan)] neural-glow-cyan animate-pulse">Syncing...</span>
               <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div 
                      key={i} 
                      className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" 
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    />
                  ))}
               </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-3 bg-[var(--navy2)] border border-white/10 rounded-2xl p-2 pl-6 shadow-2xl group focus-within:border-[var(--cyan)] transition-all">
        <div className="flex items-center gap-2 opacity-40 group-focus-within:opacity-100 transition-opacity">
           <Terminal className="w-5 h-5 text-[var(--cyan)]" />
        </div>
        <input 
          className="flex-1 bg-transparent border-none px-4 py-4 text-[13px] font-bold text-[var(--text)] placeholder:text-[var(--dim)] outline-none" 
          placeholder="Execute Neural Response..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <NeuralButton className="px-10 rounded-xl" onClick={sendMessage}>
           <Send className="w-4 h-4" />
        </NeuralButton>
      </div>
    </div>
  );
}

