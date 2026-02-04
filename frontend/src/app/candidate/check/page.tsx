"use client";

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Upload, Play, FileText, Terminal, Code, Cpu, FileCode, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MultiStageProgress, CircularProgress } from '@/components/ProgressComponents';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE } from '@/config';
import { AIErrorBoundary } from '@/components/AIErrorBoundary';

function CandidateCheckContent() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'source' | 'output'>('source');
    const [isManualInput, setIsManualInput] = useState(false);
    const [analysisStages, setAnalysisStages] = useState<Array<{
        label: string;
        status: 'pending' | 'active' | 'complete' | 'error';
        message: string;
    }>>([]);
    const [currentAnalysisStage, setCurrentAnalysisStage] = useState(-1);

    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get('job_id') || "1"; // Default to ID 1 if not set

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setResumeText("Parsing file... please wait...");
            setIsManualInput(false);

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

    const updateAnalysisStage = (index: number, status: 'pending' | 'active' | 'complete' | 'error', message = '') => {
        setAnalysisStages(prev => prev.map((stage, idx) =>
            idx === index ? { ...stage, status, message } : stage
        ));
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        setError("");
        setActiveTab('output'); // Auto switch to output on run
        setCurrentAnalysisStage(0);

        // Initialize stages
        setAnalysisStages([
            { label: 'Parsing Resume', status: 'pending', message: '' },
            { label: 'Extracting Skills', status: 'pending', message: '' },
            { label: 'Matching Requirements', status: 'pending', message: '' },
            { label: 'Calculating Score', status: 'pending', message: '' }
        ]);

        try {
            // Stage 1: Parsing
            updateAnalysisStage(0, 'active', 'Processing resume content...');
            await new Promise(resolve => setTimeout(resolve, 600));
            updateAnalysisStage(0, 'complete', 'Resume parsed successfully');
            setCurrentAnalysisStage(1);

            // Stage 2: Extracting
            updateAnalysisStage(1, 'active', 'Identifying key skills...');
            await new Promise(resolve => setTimeout(resolve, 500));
            updateAnalysisStage(1, 'complete', 'Skills extracted');
            setCurrentAnalysisStage(2);

            // Stage 3: Matching (API call)
            updateAnalysisStage(2, 'active', 'AI model analyzing...');
            const res = await axios.post(`${API_BASE}/candidate/simulate`, {
                resume_text: resumeText,
                job_id: parseInt(jobId.toString())
            });
            updateAnalysisStage(2, 'complete', 'Requirements matched');
            setCurrentAnalysisStage(3);

            // Stage 4: Scoring
            updateAnalysisStage(3, 'active', 'Computing final score...');
            await new Promise(resolve => setTimeout(resolve, 700));
            updateAnalysisStage(3, 'complete', `Score: ${res.data.score}%`);

            setResults(res.data);
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err: any) {
            if (currentAnalysisStage >= 0) {
                updateAnalysisStage(currentAnalysisStage, 'error', 'Analysis failed');
            }
            setError(err.response?.data?.detail || "Simulation failed.");
        } finally {
            setIsSimulating(false);
            setCurrentAnalysisStage(-1);
        }
    };

    const toggleManualInput = () => {
        setIsManualInput(!isManualInput);
        if (!isManualInput) {
            setFile(null); // Clear file if switching to manual
            if (resumeText.startsWith("Parsing")) setResumeText("");
        }
    };

    return (
        <AIErrorBoundary fallbackMessage="Resume analysis failed. The AI service may be experiencing quota limits. Please try again shortly.">
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
                        {/* Manual Input Toggle */}
                        <button
                            onClick={toggleManualInput}
                            className={`flex items-center gap-2 px-6 py-3 border font-bold rounded-lg transition-all uppercase tracking-widest text-xs ${isManualInput ? 'bg-[var(--primary)] text-[var(--obsidian)] border-[var(--primary)]' : 'border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)]/10'}`}
                        >
                            <FileText className="w-4 h-4" />
                            {isManualInput ? "Manual Input Active" : "Type Manually"}
                        </button>

                        {/* Upload Button */}
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
                            disabled={isSimulating || (!resumeText && !file)}
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
                            {isManualInput ? 'manual_input.txt' : (file ? file.name : 'resume_source')}
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
                            {isManualInput ? (
                                <div className="h-full flex flex-col">
                                    <p className="mb-4 text-[var(--primary)] opacity-50">// Enter your resume text below for manual processing</p>
                                    <textarea
                                        value={resumeText}
                                        onChange={(e) => {
                                            setResumeText(e.target.value);
                                            localStorage.setItem('resume_text', e.target.value);
                                            localStorage.setItem('job_id', jobId.toString());
                                        }}
                                        placeholder="Paste your resume content here..."
                                        className="flex-1 bg-transparent border border-[var(--card-border)] rounded-lg p-4 text-[var(--foreground)]/90 focus:border-[var(--primary)] focus:outline-none resize-none font-mono text-sm leading-relaxed"
                                    />
                                </div>
                            ) : file || resumeText ? (
                                <div className="h-full overflow-y-auto custom-scrollbar text-[var(--foreground)]/80">
                                    <p className="mb-4 text-[var(--primary)] opacity-50">// Resume Source Code</p>
                                    <p className="mb-4 text-[var(--primary)] opacity-50">// File: {file ? file.name : 'Unknown'}</p>
                                    <div className="whitespace-pre-wrap leading-relaxed">
                                        {resumeText || "Analyzing file structure..."}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--foreground)]/20">
                                    <FileCode className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="uppercase tracking-widest font-bold text-xs">No Source Detected</p>
                                    <p className="mt-2 text-xs">Upload a resume or select Manual Input.</p>
                                </div>
                            )}
                        </div>

                        {/* Output Tab (Results) */}
                        <div className={`absolute inset-0 overflow-y-auto p-8 font-mono text-sm transition-opacity duration-300 ${activeTab === 'output' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            {isSimulating ? (
                                <div className="h-full flex flex-col items-center justify-center">
                                    <div className="max-w-2xl w-full">
                                        <MultiStageProgress
                                            stages={analysisStages}
                                            currentStage={currentAnalysisStage}
                                            estimatedTime="8-12 seconds"
                                        />
                                    </div>
                                </div>
                            ) : results ? (
                                <div className="space-y-8 max-w-3xl mx-auto">
                                    {/* Enhanced Score Block with Circular Progress */}
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-8 glass-panel rounded-2xl border border-emerald-500/20">
                                        <CircularProgress
                                            percentage={results.score * 100}
                                            size={140}
                                            strokeWidth={10}
                                            label="ATS Match Score"
                                            color="rgb(16, 185, 129)"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <div className="text-xs font-bold uppercase tracking-widest text-emerald-500/60">Analysis Complete</div>
                                            <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${results.score * 100}%` }}
                                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                                />
                                            </div>
                                            <p className="text-xs text-[var(--foreground)]/60">
                                                {results.score >= 0.7 ? '✅ Strong match! Your resume aligns well with the requirements.' :
                                                    results.score >= 0.5 ? '⚠️ Moderate match. Consider highlighting missing skills.' :
                                                        '❌ Low match. Review the missing skills below.'}
                                            </p>
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
        </AIErrorBoundary>
    );
}

export default function CandidateCheckPage() {
    return (
        <Suspense fallback={
            <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] text-[var(--primary)] font-mono">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="animate-pulse tracking-widest text-xs">BOOTING ATS_KERNEL_v2.0...</p>
            </div>
        }>
            <CandidateCheckContent />
        </Suspense>
    );
}
