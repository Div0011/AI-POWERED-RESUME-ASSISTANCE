"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Briefcase, FileText, Send, Sparkles, Loader2,
    CheckCircle2, AlertCircle, Rocket, Cpu,
    Tags, ChevronRight, ChevronLeft, Terminal,
    ExternalLink
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { API_BASE } from '@/config';
import { useStore } from '@/store/useStore';
import { AIErrorBoundary } from '@/components/AIErrorBoundary';
import { MultiStageProgress } from '@/components/ProgressComponents';

const steps = [
    { id: 'keywords', title: 'Target Parameters', icon: Tags },
    { id: 'generation', title: 'Neural Expansion', icon: Cpu },
    { id: 'deployment', title: 'Mission Active', icon: Rocket }
];

export default function MissionDeployPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [currentKeyword, setCurrentKeyword] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState("");
    const [createdJobId, setCreatedJobId] = useState<number | null>(null);
    const [isManualMode, setIsManualMode] = useState(false);
    const [generationStages, setGenerationStages] = useState<Array<{
        label: string;
        status: 'pending' | 'active' | 'complete' | 'error';
        message: string;
    }>>([
        { label: 'Analyzing Keywords', status: 'pending', message: '' },
        { label: 'Generating Mission Statement', status: 'pending', message: '' },
        { label: 'Crafting Technical Requirements', status: 'pending', message: '' },
        { label: 'Finalizing Description', status: 'pending', message: '' }
    ]);
    const [currentGenerationStage, setCurrentGenerationStage] = useState(-1);
    const router = useRouter();
    const addJob = useStore((state) => state.addJob);

    const handleManualSubmit = () => {
        if (!title.trim() || !description.trim()) {
            setError("Mission title and description are required.");
            return;
        }
        setCurrentStep(1);
    };

    const handleAddKeyword = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentKeyword.trim()) {
            e.preventDefault();
            if (!keywords.includes(currentKeyword.trim())) {
                setKeywords([...keywords, currentKeyword.trim()]);
            }
            setCurrentKeyword("");
        }
    };

    const removeKeyword = (tag: string) => {
        setKeywords(keywords.filter(k => k !== tag));
    };

    const updateStage = (index: number, status: 'pending' | 'active' | 'complete' | 'error', message = '') => {
        setGenerationStages(prev => prev.map((stage, idx) =>
            idx === index ? { ...stage, status, message } : stage
        ));
    };

    const generateJD = async () => {
        if (keywords.length === 0) {
            setError("Mission requires at least one target keyword.");
            return;
        }
        setIsGenerating(true);
        setError("");
        setCurrentGenerationStage(0);

        // Reset all stages
        setGenerationStages([
            { label: 'Analyzing Keywords', status: 'pending', message: '' },
            { label: 'Generating Mission Statement', status: 'pending', message: '' },
            { label: 'Crafting Technical Requirements', status: 'pending', message: '' },
            { label: 'Finalizing Description', status: 'pending', message: '' }
        ]);

        try {
            // Stage 1: Analyzing
            updateStage(0, 'active', 'Processing your input parameters...');
            await new Promise(resolve => setTimeout(resolve, 800));
            updateStage(0, 'complete', `Analyzed ${keywords.length} keywords`);
            setCurrentGenerationStage(1);

            // Stage 2: Generating Mission
            updateStage(1, 'active', 'Connecting to neural engine...');
            await new Promise(resolve => setTimeout(resolve, 600));

            // Stage 3: Crafting Requirements (start API call)
            updateStage(1, 'complete');
            setCurrentGenerationStage(2);
            updateStage(2, 'active', 'AI model processing...');

            // Add timeout to prevent infinite hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            try {
                const res = await axios.post(`${API_BASE}/jobs/expand`,
                    { keywords },
                    {
                        signal: controller.signal,
                        timeout: 30000
                    }
                );
                clearTimeout(timeoutId);

                updateStage(2, 'complete', 'Requirements generated');
                setCurrentGenerationStage(3);

                // Stage 4: Finalizing
                updateStage(3, 'active', 'Formatting output...');
                await new Promise(resolve => setTimeout(resolve, 500));
                updateStage(3, 'complete', 'Ready for review');

                setTitle(res.data.suggested_title);
                setDescription(res.data.suggested_description);

                // Small delay to show completion
                await new Promise(resolve => setTimeout(resolve, 800));
                setCurrentStep(1);
            } catch (apiError: any) {
                clearTimeout(timeoutId);
                if (apiError.code === 'ECONNABORTED' || apiError.message?.includes('timeout')) {
                    throw new Error('⏱️ Request timed out. The AI service is taking too long. Please try again with fewer keywords or check your connection.');
                }
                throw apiError;
            }
        } catch (err: any) {
            // Mark current stage as error
            if (currentGenerationStage >= 0) {
                updateStage(currentGenerationStage, 'error', 'Failed - see details below');
            }

            // Enhanced error handling
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError("⚠️ Authentication failed. Please log out and log back in to refresh your credentials.");
            } else if (err.response?.status === 429) {
                setError("⚠️ AI quota limit reached. The system will automatically retry with fallback models. Please wait a moment and try again.");
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Neural link failed. Please try again or contact support if the issue persists.");
            }
            console.error("Job expansion error:", err);
        } finally {
            setIsGenerating(false);
            setCurrentGenerationStage(-1);
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        setError("");

        try {
            // Add timeout to prevent infinite waiting
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            console.log('Publishing job:', { title, description });

            const res = await axios.post(
                `${API_BASE}/jobs/`,
                { title, description },
                {
                    signal: controller.signal,
                    timeout: 30000
                }
            );

            clearTimeout(timeoutId);
            console.log('Job published successfully:', res.data);

            addJob(res.data);
            setCreatedJobId(res.data.id);
            setCurrentStep(2);
        } catch (err: any) {
            console.error('Job publishing error:', err);

            if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('⏱️ Publishing timed out. The server is taking too long. Please check your connection and try again.');
            } else if (err.response?.status === 401) {
                setError('🔒 Authentication failed. Please log in again.');
            } else if (err.response?.status === 500) {
                setError('⚠️ Server error during job creation. This might be an AI model issue. Please try again.');
            } else {
                setError(err.response?.data?.detail || 'Deployment failed. Please try again.');
            }
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <AIErrorBoundary fallbackMessage="AI job description expansion failed. The AI service may be experiencing quota limits. Please try again in a moment.">
            <div className="min-h-screen p-8 pt-32 text-[var(--foreground)] font-sans max-w-6xl mx-auto">
                {/* Header: Identity & Progress */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                            <Terminal className="w-4 h-4" />
                            INITIATING :: MISSION_DEPLOY_v2.0
                        </div>
                        <h1 className="text-5xl font-bold font-agale italic tracking-tight">Deploy Mission</h1>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex gap-4">
                        {steps.map((s, idx) => (
                            <div key={s.id} className="flex flex-col items-center gap-2">
                                <div className={`
                                w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500
                                ${idx <= currentStep ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--card-border)] text-[var(--foreground)]/20'}
                                ${idx === currentStep ? 'shadow-[0_0_20px_rgba(0,232,255,0.3)] scale-110' : ''}
                            `}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${idx === currentStep ? 'text-[var(--primary)]' : 'text-[var(--foreground)]/20'}`}>
                                    {s.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Main kinetic form area */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-panel p-12 rounded-[3rem] border border-[var(--card-border)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Tags className="w-64 h-64 text-[var(--foreground)]" />
                                </div>

                                <section className="relative z-10 max-w-3xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4 text-[var(--foreground)]/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                                            <Tags className="w-4 h-4 text-[var(--primary)]" />
                                            {isManualMode ? "DIRECT_OVERRIDE_MODE" : "TARGET_KEYWORDS"}
                                        </div>

                                        <button
                                            onClick={() => setIsManualMode(!isManualMode)}
                                            className={`px-4 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isManualMode ? 'bg-[var(--primary)] text-[var(--obsidian)] border-[var(--primary)]' : 'border-[var(--card-border)] text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/5'}`}
                                        >
                                            {isManualMode ? "Switch to Neural AI" : "Switch to Manual Mode"}
                                        </button>
                                    </div>

                                    <p className="text-2xl font-light leading-relaxed mb-12">
                                        {isManualMode
                                            ? "Manually define the mission parameters. You have full control over the briefing."
                                            : "Input the core parameters of the mission. Our neural engine will expand these into a high-fidelity brief."}
                                    </p>

                                    {isManualMode ? (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2 block">Mission Title</label>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="e.g. Senior Cyber Security Analyst"
                                                    className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-2xl p-6 text-xl font-bold focus:border-[var(--primary)] outline-none transition-all placeholder:text-[var(--foreground)]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/50 mb-2 block">Mission Briefing</label>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Enter the full mission details here..."
                                                    rows={8}
                                                    className="w-full bg-[var(--background)]/50 border border-[var(--card-border)] rounded-2xl p-6 text-base font-medium focus:border-[var(--primary)] outline-none transition-all placeholder:text-[var(--foreground)]/10 resize-none"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[var(--background)]/50 p-2 rounded-2xl flex items-center shadow-inner border border-[var(--card-border)] mb-4 focus-within:border-[var(--primary)] transition-all">
                                            <input
                                                type="text"
                                                value={currentKeyword}
                                                onChange={(e) => setCurrentKeyword(e.target.value)}
                                                onKeyDown={handleAddKeyword}
                                                placeholder="Add parameter (e.g. React, CyberSec, 5yr Exp)..."
                                                className="flex-1 bg-transparent border-none outline-none p-4 text-sm font-mono placeholder:text-[var(--foreground)]/10"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (currentKeyword.trim()) {
                                                        setKeywords([...keywords, currentKeyword.trim()]);
                                                        setCurrentKeyword("");
                                                    }
                                                }}
                                                className="p-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl hover:bg-[var(--primary)] hover:text-white transition-all"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}

                                    {!isManualMode && (
                                        <div className="flex flex-wrap gap-3 mt-6">
                                            {keywords.map(tag => (
                                                <motion.div
                                                    layout
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    key={tag}
                                                    className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--primary)]/30 rounded-lg flex items-center gap-2 group hover:border-[var(--primary)] transition-all cursor-default"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest font-mono">{tag}</span>
                                                    <button onClick={() => removeKeyword(tag)} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-all text-xs">×</button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {error && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mt-6">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {/* Progress Display */}
                                {isGenerating && !isManualMode && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 p-6 glass-panel rounded-2xl border border-[var(--primary)]/30"
                                    >
                                        <MultiStageProgress
                                            stages={generationStages}
                                            currentStage={currentGenerationStage}
                                            estimatedTime="5-10 seconds"
                                        />
                                    </motion.div>
                                )}

                                <button
                                    onClick={isManualMode ? handleManualSubmit : generateJD}
                                    disabled={!isManualMode && (isGenerating || keywords.length === 0)}
                                    className={`w-full h-20 mt-12 rounded-2xl font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-[0.98] ${isManualMode
                                        ? 'bg-[var(--primary)] text-[var(--obsidian)] hover:opacity-90'
                                        : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--primary)] hover:text-white disabled:opacity-20'}`}
                                >
                                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Cpu className="w-6 h-6" />}
                                    {isManualMode ? "DEPLOY MISSION BRIEF" : "Expand Parameters"}
                                </button>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setCurrentStep(0)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40 hover:text-[var(--foreground)] transition-all"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Adjust Target
                                    </button>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] flex items-center gap-2">
                                        {isManualMode ? <Terminal className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                                        {isManualMode ? "Manual Override Active" : "Neural Draft Generated"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">
                                    {/* Editor Slab */}
                                    <div className="glass-panel rounded-3xl overflow-hidden border-[var(--card-border)] flex flex-col bg-[var(--obsidian-card)]/50 shadow-2xl">
                                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between shrink-0">
                                            <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-50">
                                                <FileText className="w-4 h-4" /> Source Editor
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-bold uppercase tracking-widest opacity-30">Mission Title</label>
                                                <input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="w-full bg-transparent border-none outline-none text-2xl font-bold font-agale placeholder:opacity-10"
                                                />
                                            </div>
                                            <div className="space-y-2 h-[400px]">
                                                <label className="text-[8px] font-bold uppercase tracking-widest opacity-30">Briefing Content (Markdown)</label>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed placeholder:opacity-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Slab */}
                                    <div className="glass-panel rounded-3xl overflow-hidden border-[var(--card-border)] flex flex-col bg-[var(--background)]/30 backdrop-blur-md">
                                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between shrink-0">
                                            <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-50">
                                                <Rocket className="w-4 h-4" /> Final Mission Brief
                                            </div>
                                        </div>
                                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar prose prose-invert prose-sm max-w-none preview-markdown">
                                            <h1 className="text-3xl font-agale mb-6">{title}</h1>
                                            <ReactMarkdown>{description}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 mt-8">
                                    <button
                                        onClick={handlePublish}
                                        disabled={isPublishing}
                                        className="flex-1 h-20 bg-[var(--primary)] text-black rounded-2xl font-black uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(0,232,255,0.2)]"
                                    >
                                        {isPublishing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                                        Deploy Mission
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-32 h-32 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-8 relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-emerald-500/20 rounded-full"
                                    />
                                    <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                                </div>

                                <h2 className="text-5xl font-agale font-bold mb-4 italic">Mission Active</h2>
                                <p className="text-[var(--foreground)]/40 font-mono text-sm max-w-md mb-12">
                                    Deployment successful. Neural screening is now active for this sector.
                                    Candidates will be analyzed against core parameters in real-time.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.push(`/recruiter/dashboard?job_id=${createdJobId}`)}
                                        className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[var(--primary)] hover:text-white transition-all shadow-xl"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Jump to Smart Inbox
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-10 py-5 border border-[var(--card-border)] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[var(--foreground)]/5 transition-all"
                                    >
                                        New Mission
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AIErrorBoundary >
    );
}
