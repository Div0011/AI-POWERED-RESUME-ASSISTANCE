"use client";

import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, CheckCircle2, AlertCircle, Loader2, FileText, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
    filename: string;
    analysis: {
        matching_skills: string[];
        missing_skills: string[];
        years_of_experience: string;
    };
    confidence_score: string;
    explanation: string;
    logs: string[];
}

export default function Dashboard() {
    const [jd, setJd] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [currentStep, setCurrentStep] = useState<'jd' | 'upload' | 'results'>('jd');

    const handleUpload = async (files: File[]) => {
        if (!jd) {
            alert("Please enter a Job Description first!");
            return;
        }

        setIsProcessing(true);
        setCurrentStep('results');

        const newResults: AnalysisResult[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jd_text', jd);

            try {
                const response = await axios.post('http://localhost:8000/process-candidate/', formData);
                newResults.push(response.data);
            } catch (error) {
                console.error("Error processing file:", file.name, error);
            }
        }

        setResults(prev => [...prev, ...newResults]);
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 text-white flex flex-col items-center pb-24 md:pb-8">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4 uppercase mt-12 md:mt-0"
                        style={{ fontFamily: 'var(--font-agale)' }}
                    >
                        AI Resume Screener
                    </motion.h1>
                    <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                        Upload job descriptions and resumes to get instant, AI-powered candidate ranking and reasoning.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Input */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/20"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center space-x-2 mb-6">
                                <Briefcase className="w-5 h-5 text-purple-300" />
                                <h2 className="text-xl font-bold tracking-wide uppercase" style={{ fontFamily: 'var(--font-agale)' }}>Job Description</h2>
                            </div>
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="w-full h-64 md:h-80 p-5 rounded-2xl bg-black/20 border border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none text-white placeholder-white/20 text-sm md:text-base"
                            />
                            <button
                                onClick={() => setCurrentStep('upload')}
                                disabled={!jd}
                                className={`mt-6 w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2
                  ${jd ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-xl shadow-purple-900/20 active:scale-95' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                            >
                                <span>Parse & Upload</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Upload & Results */}
                    <div className="lg:col-span-7 space-y-6">
                        <AnimatePresence mode="wait">
                            {currentStep === 'upload' ? (
                                <motion.div
                                    key="upload"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-1 border border-white/10 overflow-hidden">
                                        <UploadZone onUpload={handleUpload} />
                                    </div>
                                    <button
                                        onClick={() => setCurrentStep('jd')}
                                        className="mt-4 text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-180" /> Edit JD
                                    </button>
                                </motion.div>
                            ) : currentStep === 'results' ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between px-2">
                                        <h2 className="text-2xl font-bold tracking-wide uppercase" style={{ fontFamily: 'var(--font-agale)' }}>Results</h2>
                                        {isProcessing && (
                                            <div className="flex items-center space-x-2 text-purple-300 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-xs font-bold uppercase tracking-tighter">AI Reasoning...</span>
                                            </div>
                                        )}
                                    </div>

                                    {results.length === 0 && !isProcessing && (
                                        <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10 backdrop-blur-sm">
                                            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                            <p className="text-white/40 font-medium">No candidates analyzed yet.</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {results.map((res, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/20 relative overflow-hidden group"
                                            >
                                                <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />

                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8 relative z-10">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-500/30">
                                                            <FileText className="w-6 h-6 text-purple-300" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-xl text-white tracking-wide">{res.filename}</h3>
                                                            <p className="text-sm font-medium text-white/50 bg-white/5 px-2 py-0.5 rounded-md inline-block mt-1">
                                                                {res.analysis.years_of_experience} Experience
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-[0.1em] shadow-lg
                                                        ${res.confidence_score === 'High' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                            res.confidence_score === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                                        {res.confidence_score} Confidence
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                                                    <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                                                        <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-3 opacity-60">Matching Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {res.analysis.matching_skills.map(s => (
                                                                <span key={s} className="text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-300/90">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                                                        <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-3 opacity-60">Missing Skills</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {res.analysis.missing_skills.map(s => (
                                                                <span key={s} className="text-xs font-semibold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-rose-300/90">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-black/20 p-5 rounded-3xl mb-6 border border-white/5 relative z-10">
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <Search className="w-4 h-4 text-purple-400" />
                                                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Live Reasoning (CoT)</p>
                                                    </div>
                                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                                        {res.logs.map((log, index) => (
                                                            <p key={index} className="text-xs text-white/40 font-mono leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
                                                                {log}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-3xl border border-white/10 relative z-10 shadow-inner">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        {res.confidence_score === 'Low' ? <AlertCircle className="w-5 h-5 text-rose-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                                        <p className="text-sm font-black text-white uppercase tracking-widest">Final Verdict</p>
                                                    </div>
                                                    <p className="text-sm md:text-base text-white/80 leading-relaxed font-light italic">
                                                        "{res.explanation}"
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => { setResults([]); setCurrentStep('jd'); }}
                                        className="w-full py-4 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest underline underline-offset-4"
                                    >
                                        Reset Session
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-white/20">
                                    <p className="font-bold uppercase tracking-widest">Awaiting Job Description</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
