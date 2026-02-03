"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Terminal, ChevronRight, User, Sparkles, Loader2, Cpu, Power } from 'lucide-react';
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
        try {
            const res = await axios.post(`${API_BASE}/interview/start`, {
                job_id: 1,
                resume_text: "Experience in Cyber Security, Python, Nmap, worked on vulnerability assessment."
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

        try {
            const res = await axios.post(`${API_BASE}/interview/respond`, {
                job_id: 1,
                resume_text: "Experience in Cyber Security, Python, Nmap, worked on vulnerability assessment.",
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
        <div className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto font-mono h-[calc(100vh-2rem)] flex flex-col">
            {/* Terminal Container */}
            <div className="w-full h-full max-w-5xl mx-auto glass-panel p-1 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative bg-[#050505]">

                {/* CRT Scanline Effect (Contained within terminal) */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-20" />

                {/* Terminal Header */}
                <div className="bg-[#111] border-b border-emerald-500/20 p-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-emerald-500">
                        <Terminal className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-widest uppercase">AI_INTERVIEW_KERNEL_v2.0</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4 text-emerald-500 relative z-10">
                    {!isInterviewStarted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                            <Cpu className="w-16 h-16 animate-pulse text-emerald-400" />
                            <h1 className="text-2xl font-bold tracking-widest">INITIALIZE CONNECTION</h1>
                            <p className="opacity-60 max-w-lg mb-8 font-sans text-sm">
                                Establishing secure link to AI neural network. Session will be recorded for quality assurance.
                            </p>
                            <button
                                onClick={startInterview}
                                className="px-8 py-4 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all font-bold tracking-widest uppercase flex items-center gap-2 rounded-lg"
                            >
                                <Power className="w-4 h-4" />
                                EXECUTE PRIORITY_ONE.EXE
                            </button>
                        </div>
                    ) : feedback ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="border border-emerald-500/50 p-6 bg-emerald-900/10 rounded-lg">
                                <h2 className="text-xl font-bold mb-4 border-b border-emerald-500/30 pb-2">SESSION_LOG_REPORT</h2>
                                <div className="whitespace-pre-wrap leading-relaxed opacity-80 font-sans text-sm">
                                    {feedback}
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-xs hover:underline decoration-emerald-500 underline-offset-4"
                            >
                                [REBOOT_SYSTEM]
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6 pb-4">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="flex items-center gap-2 opacity-50 text-[10px] uppercase font-bold tracking-widest">
                                        {m.role === 'interviewer' ? '>> SYSTEM::ROOT' : '>> USER::GUEST'}
                                        <span className="text-[8px]">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                    <div className={`p-4 rounded-lg border-l-2 ${m.role === 'interviewer' ? 'border-emerald-500 bg-emerald-900/10' : 'border-cyan-500 bg-cyan-900/10 text-cyan-300'}`}>
                                        <p className="leading-relaxed font-sans text-sm">{m.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-2 opacity-50">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs animate-pulse">PROCESSING_RESPONSE...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {isInterviewStarted && !feedback && (
                    <div className="p-4 border-t border-emerald-500/20 bg-[#0a0a0a] shrink-0 relative z-10">
                        <div className="flex items-center gap-4">
                            <span className="text-emerald-500 animate-pulse font-bold">{'>'}</span>
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isVoiceActive ? "LISTENING_ON_PORT_8080..." : "ENTER_COMMAND..."}
                                    className="w-full bg-transparent border-none outline-none text-emerald-500 placeholder-emerald-800 font-mono text-sm"
                                    autoFocus
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleVoice}
                                    className={`p-2 hover:bg-emerald-500/20 rounded-lg transition-colors ${isVoiceActive ? 'text-red-500 animate-pulse' : 'text-emerald-500/50'}`}
                                >
                                    {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!userInput.trim() || isThinking}
                                    className="p-2 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-colors rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={endInterview}
                                    className="p-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black transition-colors rounded-lg ml-2"
                                    title="TERMINATE SESSION"
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
