"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Terminal, ChevronRight, User, Sparkles, Loader2, Cpu, Power, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

interface Message {
    role: 'interviewer' | 'candidate';
    content: string;
}

export default function InterviewPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Speech Recognition
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRec = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const rec = new SpeechRec();
            rec.continuous = true;
            rec.interimResults = true;
            rec.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('');
                setUserInput(transcript);
            };
            setRecognition(rec);
        }
    }, []);

    const toggleVoice = () => {
        if (isVoiceActive) {
            recognition?.stop();
            setIsVoiceActive(false);
        } else {
            recognition?.start();
            setIsVoiceActive(true);
        }
    };

    const speak = (text: string) => {
        if (!isVoiceActive) return;
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const startInterview = async () => {
        setIsThinking(true);
        // Retrieve context from storage
        const storedResume = localStorage.getItem('resume_text');
        const storedJobId = localStorage.getItem('job_id');

        const resumeToUse = storedResume || "Experience in Cyber Security, Python, Nmap, worked on vulnerability assessment.";
        const jobIdToUse = storedJobId ? parseInt(storedJobId) : 1;

        if (!storedResume) {
            console.warn("No resume found in storage, using default.");
        }

        try {
            const res = await axios.post(`${API_BASE}/interview/start`, {
                job_id: jobIdToUse,
                resume_text: resumeToUse
            });
            const firstQuestion = res.data.next_question;
            setMessages([{ role: 'interviewer', content: firstQuestion }]);
            setIsInterviewStarted(true);
            speak(firstQuestion);
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'candidate', content: userInput }];
        setMessages(newMessages);
        setUserInput("");
        setIsThinking(true);

        const storedResume = localStorage.getItem('resume_text');
        const storedJobId = localStorage.getItem('job_id');
        const resumeToUse = storedResume || "Experience in Cyber Security, Python, Nmap, worked on vulnerability assessment.";
        const jobIdToUse = storedJobId ? parseInt(storedJobId) : 1;

        try {
            const res = await axios.post(`${API_BASE}/interview/respond`, {
                job_id: jobIdToUse,
                resume_text: resumeToUse,
                history: newMessages
            });
            const nextQ = res.data.next_question;
            setMessages(prev => [...prev, { role: 'interviewer', content: nextQ }]);
            speak(nextQ);
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const endInterview = async () => {
        setIsThinking(true);
        try {
            const res = await axios.post(`${API_BASE}/interview/feedback`, {
                job_id: 1,
                history: messages
            });
            setFeedback(res.data.feedback);
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    return (
        <div className="pt-24 sm:pt-32 pb-12 px-4 sm:px-12 max-w-7xl mx-auto font-mono min-h-[calc(100vh-2rem)] flex flex-col">
            {/* Terminal Container */}
            <div className="w-full flex-1 max-w-5xl mx-auto glass-panel p-1 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative bg-[#050505] border border-[var(--card-border)]">

                {/* CRT Scanline Effect (Contained within terminal) */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] z-50 bg-[length:100%_4px] opacity-10" />

                {/* Terminal Header */}
                <div className="bg-[#111] border-b border-emerald-500/10 p-4 flex items-center justify-between shrink-0 relative z-20">
                    <div className="flex items-center gap-3 text-emerald-500">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase truncate max-w-[150px] sm:max-w-none">AI_INTERVIEW_KERNEL_v2.0</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar space-y-6 text-emerald-500 relative z-10">
                    {!isInterviewStarted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 px-4">
                            <Cpu className="w-16 h-16 animate-pulse text-emerald-400 opacity-50" />
                            <div className="space-y-4">
                                <h1 className="text-xl sm:text-3xl font-bold tracking-[0.3em] uppercase">Initialize Connection</h1>
                                <p className="opacity-40 max-w-md mx-auto font-sans text-[10px] sm:text-xs leading-relaxed uppercase tracking-widest">
                                    Establishing secure link to AI neural network. Session will be recorded for quality assurance.
                                </p>
                            </div>
                            <button
                                onClick={startInterview}
                                className="w-full sm:w-auto px-10 py-5 border border-emerald-500/50 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 rounded-xl active:scale-95"
                            >
                                <Power className="w-4 h-4" />
                                Execute Dispatch
                            </button>
                        </div>
                    ) : feedback ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10">
                            <div className="border border-emerald-500/20 p-6 sm:p-10 bg-emerald-900/5 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 text-[8px] font-black opacity-20 uppercase tracking-widest">Secure Log</div>
                                <h2 className="text-lg sm:text-xl font-black mb-6 border-b border-emerald-500/10 pb-4 tracking-[0.2em] uppercase">Session Report</h2>
                                <div className="whitespace-pre-wrap leading-relaxed opacity-70 font-sans text-xs sm:text-sm">
                                    {feedback}
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:brightness-125 transition-all flex items-center gap-2"
                            >
                                [ Reboot System ]
                                <RefreshCw className="w-3 h-3 animate-reverse-spin" />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-8 pb-10">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col gap-2"
                                >
                                    <div className="flex items-center gap-3 opacity-30 text-[8px] uppercase font-black tracking-[0.3em]">
                                        <div className={`w-1 h-1 rounded-full ${m.role === 'interviewer' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                                        {m.role === 'interviewer' ? 'System::Root' : 'User::Guest'}
                                        <span className="opacity-50">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className={`p-5 rounded-2xl border-l-[3px] ${m.role === 'interviewer' ? 'border-emerald-500 bg-emerald-500/5' : 'border-cyan-500 bg-cyan-500/5 text-cyan-200 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]'}`}>
                                        <p className="leading-relaxed font-sans text-xs sm:text-sm tracking-wide">{m.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-3 opacity-40 px-4">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] animate-pulse">Analyzing...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {isInterviewStarted && !feedback && (
                    <div className="p-4 sm:p-6 border-t border-emerald-500/10 bg-black/40 shrink-0 relative z-20">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="flex-1 flex items-center gap-4 bg-white/5 border border-white/5 px-5 py-3 rounded-xl focus-within:border-emerald-500/30 transition-all">
                                <span className="text-emerald-500 opacity-50 font-black">{'>'}</span>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isVoiceActive ? "Listening..." : "Enter command..."}
                                    className="w-full bg-transparent border-none outline-none text-emerald-400 placeholder-emerald-900 font-mono text-xs sm:text-sm"
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 px-2 sm:px-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleVoice}
                                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border ${isVoiceActive ? 'bg-red-500/20 border-red-500/40 text-red-500 animate-pulse' : 'bg-white/5 border-white/5 text-emerald-500/50 hover:bg-white/10'}`}
                                    >
                                        {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!userInput.trim() || isThinking}
                                        className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-black rounded-xl transition-all disabled:opacity-20 disabled:scale-100 hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <button
                                    onClick={endInterview}
                                    className="w-12 h-12 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all rounded-xl"
                                    title="Terminate"
                                >
                                    <Power className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
