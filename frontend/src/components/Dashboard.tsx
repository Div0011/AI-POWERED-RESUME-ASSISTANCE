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
        <div className="min-h-screen bg-[#f8fafc] p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 mb-4"
                    >
                        AI Resume Screener
                    </motion.h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Upload job descriptions and resumes to get instant, AI-powered candidate ranking and reasoning.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Input */}
                    <div className="lg:col-span-5 space-y-6">
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-slate-800">Job Description</h2>
                            </div>
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job description here..."
                                className="w-full h-64 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-slate-700"
                            />
                            <button
                                onClick={() => setCurrentStep('upload')}
                                disabled={!jd}
                                className={`mt-4 w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2
                  ${jd ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                                <span>Next: Upload Resumes</span>
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
                                    <UploadZone onUpload={handleUpload} />
                                </motion.div>
                            ) : currentStep === 'results' ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-slate-800">Analysis Results</h2>
                                        {isProcessing && (
                                            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm font-medium">Agent is thinking...</span>
                                            </div>
                                        )}
                                    </div>

                                    {results.length === 0 && !isProcessing && (
                                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500">No candidates analyzed yet.</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {results.map((res, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-blue-50 p-2 rounded-lg">
                                                            <FileText className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800">{res.filename}</h3>
                                                            <p className="text-sm text-slate-500">{res.analysis.years_of_experience} Experience</p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${res.confidence_score === 'High' ? 'bg-emerald-50 text-emerald-600' :
                                                            res.confidence_score === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                                'bg-rose-50 text-rose-600'}`}>
                                                        {res.confidence_score} Confidence
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-slate-50 p-3 rounded-xl">
                                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Matching Skills</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {res.analysis.matching_skills.map(s => (
                                                                <span key={s} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-50 p-3 rounded-xl">
                                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Missing Skills</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {res.analysis.missing_skills.map(s => (
                                                                <span key={s} className="text-xs bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-xl mb-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Search className="w-4 h-4 text-blue-500" />
                                                        <p className="text-sm font-bold text-slate-700">Live Reasoning (Chain of Thought)</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {res.logs.map((log, index) => (
                                                            <p key={index} className="text-xs text-slate-500 font-mono">
                                                                {log}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-xl">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {res.confidence_score === 'Low' ? <AlertCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                        <p className="text-sm font-bold text-slate-700">Final Verdict</p>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {res.explanation}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <p>Please complete the Job Description first.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
