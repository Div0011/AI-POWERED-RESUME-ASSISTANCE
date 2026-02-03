"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Play, AlertCircle, CheckCircle2, Loader2, Save, Terminal, FileCode, Cpu } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE } from '@/config';

export default function CandidateCheckPage() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'source' | 'output'>('source');

    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get('job_id') || "1"; // Default to ID 1 if not set

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setResumeText("Parsing file... please wait...");

            try {
                const formData = new FormData();
                formData.append('file', uploadedFile);

                const res = await axios.post(`${API_BASE}/candidate/parse`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const parsedText = res.data.text;
                setResumeText(parsedText);
                // Save to local storage for Interview Context
                localStorage.setItem('resume_text', parsedText);
                localStorage.setItem('job_id', jobId.toString());

            } catch (err) {
                console.error(err);
                setResumeText("// Error parsing file. Please try again or paste text manually.");
            }
        }
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        setError("");
        setActiveTab('output'); // Auto switch to output on run
        try {
            const res = await axios.post(`${API_BASE}/candidate/simulate`, {
                resume_text: resumeText,
                job_id: parseInt(jobId.toString())
            });
            setResults(res.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Simulation failed.");
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="pt-32 px-6 md:px-12 pb-12 font-sans max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            {/* Header */}
            <header className="mb-8 flex items-center justify-between shrink-0">
                <div>
                    <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-bold uppercase tracking-[0.2em] mb-2">
                        <Cpu className="w-4 h-4" />
                        ATS SIMULATION KERNEL
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Added Upload Button Here */}
                    <div className="relative overflow-hidden group">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            onChange={handleFileUpload}
                            accept=".pdf,.txt"
                        />
                        <button className="flex items-center gap-2 px-6 py-3 border border-[var(--primary)]/30 text-[var(--primary)] font-bold rounded-lg hover:bg-[var(--primary)]/10 transition-all uppercase tracking-widest text-xs">
                            <Upload className="w-4 h-4" />
                            {file ? "File Selected" : "Upload Resume"}
                        </button>
                    </div>

                    <button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black font-bold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95"
                    >
                        {isSimulating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        EXECUTE ANALYSIS
                    </button>
                </div>
            </header>

            {/* IDE Main Window */}
            <div className="flex-1 glass-panel rounded-xl overflow-hidden border border-[var(--card-border)] flex flex-col md:flex-row shadow-2xl h-[70vh]">

                {/* Sidebar (File Explorer style) */}
                <div className="w-full md:w-64 bg-[var(--obsidian)]/50 border-r border-[var(--card-border)] p-4 flex flex-col gap-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/30 mb-2 pl-2">Explorer</div>

                    <button
                        onClick={() => setActiveTab('source')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'source' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/5'}`}
                    >
                        <FileCode className="w-4 h-4" />
                        resume.pdf
                    </button>

                    <button
                        onClick={() => setActiveTab('output')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'output' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'text-[var(--foreground)]/60 hover:bg-[var(--foreground)]/5'}`}
                    >
                        <Terminal className="w-4 h-4" />
                        output.json
                    </button>
                </div>

                {/* Main Editor Area */}
                <div className="flex-1 bg-[var(--background)]/30 flex flex-col relative w-full h-full overflow-hidden">
                    {/* Source Tab (Resume Code View) */}
                    <div className={`absolute inset-0 p-8 font-mono text-sm transition-opacity duration-300 ${activeTab === 'source' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        {file ? (
                            <div className="h-full overflow-y-auto custom-scrollbar text-[var(--foreground)]/80">
                                <p className="mb-4 text-[var(--primary)] opacity-50">// Resume Source Code</p>
                                <p className="mb-4 text-[var(--primary)] opacity-50">// File: {file.name}</p>
                                <div className="whitespace-pre-wrap leading-relaxed">
                                    {resumeText || "Analyzing file structure..."}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--foreground)]/20">
                                <FileCode className="w-16 h-16 mb-4 opacity-50" />
                                <p className="uppercase tracking-widest font-bold text-xs">No Source Detected</p>
                                <p className="mt-2 text-xs">Upload a resume via the header to inspect.</p>
                            </div>
                        )}
                    </div>

                    {/* Output Tab (Results) */}
                    <div className={`absolute inset-0 overflow-y-auto p-8 font-mono text-sm transition-opacity duration-300 ${activeTab === 'output' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                        {isSimulating ? (
                            <div className="h-full flex flex-col items-center justify-center text-[var(--primary)]">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="animate-pulse">COMPILING ANALYSIS...</p>
                            </div>
                        ) : results ? (
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {/* Score Block */}
                                <div className="flex items-center gap-6 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                    <div className="text-5xl font-bold text-emerald-400">{Math.round(results.score * 100)}%</div>
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-emerald-500/60">Match Score</div>
                                        <div className="h-2 w-48 bg-[var(--background)] rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${results.score * 100}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* JSON Output Style */}
                                <div className="bg-black/40 p-6 rounded-xl border border-[var(--card-border)]">
                                    <div className="flex gap-2 mb-4 opacity-30">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="space-y-2 text-[var(--foreground)]/80">
                                        <p><span className="text-purple-400">const</span> <span className="text-blue-400">analysis</span> = {"{"}</p>
                                        <div className="pl-4 border-l border-[var(--card-border)]">
                                            <p><span className="text-red-400">"feedback"</span>: <span className="text-amber-200">"{results.student_reasoning}"</span>,</p>
                                            <p><span className="text-red-400">"missing_modules"</span>: [</p>
                                            <div className="pl-4 text-rose-400">
                                                {results.missing_skills.length ? results.missing_skills.map((s: string) => `"${s}", `) : "// No errors found"}
                                            </div>
                                            <p>],</p>
                                            <p><span className="text-red-400">"status"</span>: <span className="text-emerald-400">"COMPLETE"</span></p>
                                        </div>
                                        <p>{"};"}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/candidate/interview')}
                                    className="w-full py-4 border border-[var(--card-border)] rounded-xl hover:bg-[var(--foreground)]/5 transition-colors text-[var(--foreground)]/60 hover:text-[var(--primary)] uppercase tracking-widest text-xs font-bold"
                                >
                                    Initialize Interview Protocol &gt;_
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[var(--foreground)]/20">
                                 // No output generated. Run simulation first.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
