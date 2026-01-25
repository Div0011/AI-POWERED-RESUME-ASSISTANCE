"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, PhoneOff, Send, User, Bot, Sparkles, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    text: string;
}

export default function InterviewPrepPage() {
    const [isStarted, setIsStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startInterview = () => {
        setIsStarted(true);
        // Initial greeting
        setMessages([
            { id: 1, role: 'assistant', text: "Hello! I'm your AI Interviewer today. I've reviewed your profile. Let's start with a classic: Tell me about a time you faced a significant technical challenge and how you solved it." }
        ]);
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg: Message = { id: Date.now(), role: 'user', text: inputValue };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");

        // Simulate AI thinking and response
        setTimeout(() => {
            const responses = [
                "That's a great example. Can you elaborate on the specific technologies you used?",
                "Interesting approach. How did you handle the communication with stakeholders during that time?",
                "Good. Now, looking back, what would you have done differently?",
                "I see. Let's pivot a bit. How do you stay updated with the latest frontend trends?"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: randomResponse
            }]);
        }, 1500);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="min-h-screen p-4 md:p-8 text-white flex flex-col items-center pb-24 md:pb-8">

            {!isStarted ? (
                /* Welcome Screen */
                <div className="max-w-4xl w-full flex-1 flex flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl max-w-2xl"
                    >
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg animate-pulse">
                            <Bot className="w-8 h-8 md:w-12 md:h-12 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-wide" style={{ fontFamily: 'var(--font-agale)' }}>AI MOCK INTERVIEW</h1>
                        <p className="text-white/70 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                            Practice real-world scenarios with our advanced AI. It will ask you tailored questions, analyze your answers, and provide feedback on your tone and content.
                        </p>
                        <Button
                            onClick={startInterview}
                            className="text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-xl shadow-purple-900/20"
                        >
                            Start Session
                        </Button>
                    </motion.div>
                </div>
            ) : (
                /* Interview Interface */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-5xl w-full flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden h-[80vh] md:h-[85vh]"
                >
                    {/* Header */}
                    <div className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-white/5">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-border-white/10 flex items-center justify-center border border-white/10">
                                <Bot className="w-5 h-5 md:w-6 md:h-6 text-purple-300" />
                            </div>
                            <div>
                                <h2 className="font-bold text-sm md:text-lg">AI Interviewer</h2>
                                <p className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse" /> Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="bg-black/30 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-mono text-white/60">
                                00:12:45
                            </div>
                            <button
                                onClick={() => setIsStarted(false)}
                                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 p-2 md:p-3 rounded-full transition-colors"
                            >
                                <PhoneOff className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[90%] md:max-w-[80%] rounded-xl md:rounded-2xl p-4 md:p-6 ${msg.role === 'user'
                                    ? 'bg-purple-600 text-white rounded-tr-none shadow-lg'
                                    : 'bg-white/10 border border-white/10 text-white/90 rounded-tl-none'
                                    }`}>
                                    <p className="leading-relaxed text-sm md:text-lg">{msg.text}</p>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white/5 border-t border-white/10">
                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 md:gap-4">
                            <button
                                type="button"
                                onClick={() => setIsListening(!isListening)}
                                className={`p-3 md:p-4 rounded-full transition-all border ${isListening
                                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10 border-white/10'
                                    }`}
                            >
                                {isListening ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                            </button>

                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Answer..."
                                className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 md:px-6 py-3 md:py-4 text-white placeholder-white/30 focus:outline-none focus:bg-black/30 focus:border-purple-500/50 transition-all font-sans text-sm md:text-lg"
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="p-3 md:p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-all disabled:opacity-50"
                            >
                                <Send className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </form>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
