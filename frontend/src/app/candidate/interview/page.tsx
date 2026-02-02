"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, MessageSquare, Terminal, ChevronRight, User, Sparkles, Loader2, PlayCircle, StopCircle, ClipboardList } from 'lucide-react';
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
        <div className="min-h-screen bg-[#050505] text-white p-6 pt-24 font-sans flex flex-col items-center">
            <div className="w-full max-w-3xl">
                {!isInterviewStarted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/[0.03] border border-white/10 p-12 rounded-[2.5rem] text-center"
                    >
                        <div className="p-5 bg-purple-500/10 rounded-2xl w-fit mx-auto mb-8 border border-purple-500/20">
                            <Sparkles className="w-10 h-10 text-purple-400" />
                        </div>
                        <h1 className="text-4xl font-black mb-4 tracking-tighter">Ready for your interview?</h1>
                        <p className="text-white/40 mb-10 max-w-md mx-auto font-medium">
                            Step into a technical sandbox. Our AI interviewer will challenge you based on your resume and the Job Description.
                        </p>
                        <button
                            onClick={startInterview}
                            className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all active:scale-95 flex items-center gap-3 mx-auto"
                        >
                            Start Session
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                ) : feedback ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] border border-white/10 p-12 rounded-[2.5rem]"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                <ClipboardList className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-black">Performance Report</h2>
                        </div>
                        <div className="space-y-6 text-white/70 font-medium whitespace-pre-wrap leading-relaxed bg-black/40 p-8 rounded-2xl border border-white/5">
                            {feedback}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-10 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >
                            Retry Interview
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Chat Window */}
                        <div className="h-[60vh] overflow-y-auto mb-8 space-y-6 pr-4 scrollbar-hide">
                            <AnimatePresence>
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: m.role === 'interviewer' ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${m.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[80%] p-6 rounded-[2rem] flex gap-4 ${m.role === 'interviewer'
                                            ? 'bg-white/[0.03] border border-white/10 rounded-tl-none'
                                            : 'bg-purple-600 text-white rounded-tr-none'
                                            }`}>
                                            <div className={`mt-1 flex-shrink-0 ${m.role === 'interviewer' ? 'text-purple-400' : 'text-white/50'}`}>
                                                {m.role === 'interviewer' ? <Terminal className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                            </div>
                                            <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] rounded-tl-none">
                                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Controls */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl flex items-center p-3 gap-3">
                                    <button
                                        onClick={toggleVoice}
                                        className={`p-4 rounded-2xl transition-all ${isVoiceActive ? 'bg-red-500 text-white' : 'bg-white/5 text-white/50 hover:text-white'}`}
                                    >
                                        {isVoiceActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                    </button>
                                    <input
                                        type="text"
                                        placeholder={isVoiceActive ? "Listening (speaking your transcript)..." : "Type your answer..."}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        className="flex-1 bg-transparent border-none outline-none font-medium text-sm px-2"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!userInput.trim() || isThinking}
                                        className="p-4 bg-white text-black rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                    {isVoiceActive ? "Voice Mode: Active" : "Text Mode: Active"}
                                </p>
                                <button
                                    onClick={endInterview}
                                    className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
                                >
                                    End & Get Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
