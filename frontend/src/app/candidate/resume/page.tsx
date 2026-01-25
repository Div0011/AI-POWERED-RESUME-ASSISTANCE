"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadZone } from '@/components/UploadZone';
import { Sparkles, FileText, BarChart, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ResumeImproverPage() {
    const [score, setScore] = useState<number | null>(null);
    const [improvement, setImprovement] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedResumeUrl, setAnalyzedResumeUrl] = useState<string | null>(null);

    // Mock analysis function 
    const handleAnalyze = async (files: File[]) => {
        setIsAnalyzing(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock result
        setScore(72);
        setImprovement("Try using more active verbs like 'Spearheaded' instead of 'Led'. Quantify your sales achievements (e.g., 'Increased revenue by 20%'). Your formatting is clean, but consider adding a skills summary at the top.");
        setAnalyzedResumeUrl("#"); // Placeholder for updated PDF download
        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen p-8 text-white">
            <div className="max-w-6xl mx-auto">
                <header className="mb-14 text-center">
                    <h1 className="text-5xl font-bold tracking-wide mb-6 drop-shadow-md border-b-2 border-white/20 pb-6 inline-block" style={{ fontFamily: 'var(--font-agale)' }}>
                        AI RESUME IMPROVER
                    </h1>
                    <p className="text-white/80 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                        Upload your resume to get an instant AI score and generative suggestions to increase your interview chances.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Upload Section */}
                    <div>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl border border-white/20">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-agale)' }}>
                                <FileText className="w-6 h-6" />
                                Upload & Analyze
                            </h2>
                            <UploadZone onUpload={handleAnalyze} />

                            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h3 className="font-bold flex items-center gap-2 mb-2 text-sm text-white/70 uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4 text-purple-300" /> How it works
                                </h3>
                                <ul className="space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                                        Our AI scans for ATS readability and keyword matching.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                                        It identifies weak verbs and suggests stronger alternatives.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5" />
                                        You get a formatting score based on modern recruiter standards.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div>
                        <AnimatePresence mode="wait">
                            {isAnalyzing ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 h-full min-h-[500px] flex flex-col items-center justify-center text-center"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-24 h-24 border-4 border-white/10 border-t-purple-400 rounded-full animate-spin" />
                                        <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-300 animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Analyzing Resume...</h3>
                                    <p className="text-white/60 max-w-sm">Checking 50+ data points, including formatting, keywords, active verbs, and impact metrics.</p>
                                </motion.div>
                            ) : score !== null ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/30"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">ATS Compatibility Score</h3>
                                        <div className="relative inline-flex items-center justify-center">
                                            <svg className="w-48 h-48 transform -rotate-90">
                                                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-black/20" />
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="80"
                                                    stroke="currentColor"
                                                    strokeWidth="12"
                                                    fill="transparent"
                                                    strokeDasharray={502}
                                                    strokeDashoffset={502 - (502 * score) / 100}
                                                    className={`${score > 80 ? 'text-emerald-400' : score > 60 ? 'text-amber-400' : 'text-rose-400'} drop-shadow-glow`}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-6xl font-bold" style={{ fontFamily: 'var(--font-agale)' }}>{score}</span>
                                                <span className="text-xs uppercase font-bold text-white/50">OUT OF 100</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 p-6 rounded-3xl border border-white/10 mb-6">
                                        <h4 className="flex items-center gap-2 font-bold mb-3 text-purple-200 uppercase tracking-wider text-sm">
                                            <AlertTriangle className="w-4 h-4" /> AI Feedback
                                        </h4>
                                        <p className="text-white/90 leading-relaxed font-light text-sm">
                                            {improvement}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <Button className="w-full bg-white text-purple-900 border-none hover:bg-white/90 shadow-lg">
                                            <Download className="w-4 h-4 mr-2" /> Download Improved Version
                                        </Button>
                                        <button
                                            onClick={() => setScore(null)}
                                            className="w-full py-3 rounded-xl text-white/60 text-sm hover:text-white transition-colors underline"
                                        >
                                            Analyze Another Resume
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 h-full min-h-[500px] flex flex-col items-center justify-center text-center opacity-60 dashed-border">
                                    <BarChart className="w-16 h-16 mb-6 text-white/20" />
                                    <h3 className="text-xl font-bold mb-2">Awaiting Upload</h3>
                                    <p className="max-w-sm mx-auto">Upload your resume on the left to see your detailed score and AI-powered improvement suggestions.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
