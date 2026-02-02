"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, Target, AlertCircle, CheckCircle2, Wand2, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';

export default function CandidateCheckPage() {
    const [file, setFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState("");

    const [originalBullet, setOriginalBullet] = useState("");
    const [improvedBullet, setImprovedBullet] = useState("");
    const [isImproving, setIsImproving] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            const text = "Experience: 2 years Python developer, worked with Nmap and Wireshark. Knowledge of OWASP Top 10.";
            setResumeText(text);
        }
    };

    const runSimulation = async () => {
        setIsSimulating(true);
        setError("");
        try {
            const res = await axios.post(`${API_BASE}/candidate/simulate`, {
                resume_text: resumeText || "Sample resume text for Cyber Security Intern",
                job_id: 1
            });
            setResults(res.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Simulation failed.");
        } finally {
            setIsSimulating(false);
        }
    };

    const runImprovement = async () => {
        if (!originalBullet) return;
        setIsImproving(true);
        try {
            const res = await axios.post(`${API_BASE}/candidate/improve-bullet`, {
                bullet_point: originalBullet,
                job_id: 1
            });
            setImprovedBullet(res.data.improved);
        } catch (err) {
            console.error(err);
        } finally {
            setIsImproving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-purple-500/30">
            <div className="max-w-4xl mx-auto pt-20">
                {/* Header */}
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI ATS Simulator
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Check Your Match.
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl mx-auto font-medium">
                        Upload your resume to see how our AI scores you against the <span className="text-white">Cyber Security Intern</span> role.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Upload Section */}
                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-3xl text-center">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.txt"
                                />
                                <div className="mb-6 inline-flex p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                    <Upload className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{file ? file.name : "Drop Resume Here"}</h3>
                                <p className="text-white/40 text-sm">PDF or TXT (Max 5MB)</p>
                            </div>
                        </div>

                        <button
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSimulating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Run AI Simulation
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Right: Results Display */}
                    <AnimatePresence mode="wait">
                        {results ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Score Circle */}
                                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <Target className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">Match Percentage</div>
                                        <div className="text-7xl font-black text-white mb-2">
                                            {Math.round(results.score * 100)}%
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${results.score * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-white/20">ATS QUALITY</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Coaching Feedback */}
                                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl">
                                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-purple-400 mb-4">
                                        <Wand2 className="w-4 h-4" /> AI Coaching
                                    </h3>
                                    <p className="text-white/70 text-sm leading-relaxed font-medium italic">
                                        "{results.student_reasoning}"
                                    </p>
                                </div>

                                {/* Skill Gaps */}
                                <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-3xl">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-rose-400 mb-4">Missing Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {results.missing_skills.length > 0 ? (
                                            results.missing_skills.map((s: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-bold text-rose-400">
                                                    {s}
                                                </span>
                                            ))
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                Perfect Match! No missing skills found.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Next Step: Interview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl border border-white/10"
                                >
                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3">
                                        <Sparkles className="w-4 h-4" /> Next Level Practice
                                    </h4>
                                    <p className="text-sm font-bold mb-4 leading-tight text-white/90">Think you're ready? Try a live technical interview for this role.</p>
                                    <a
                                        href="/candidate/interview"
                                        className="flex items-center justify-center gap-2 py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-white/90 transition-all"
                                    >
                                        Start AI Interview
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-25">
                                <FileText className="w-16 h-16 mb-4 text-white/20" />
                                <p className="text-sm font-black uppercase tracking-widest">Awaiting Simulation</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Improvement Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-20 border-t border-white/5 pt-20"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Wand2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">AI Bullet Point Improver</h2>
                            <p className="text-white/40 text-sm font-medium">Level up your experience descriptions for the ATS.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Original Bullet</label>
                            <textarea
                                value={originalBullet}
                                onChange={(e) => setOriginalBullet(e.target.value)}
                                placeholder="I used Python to scan open ports."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-blue-500/50 transition-colors h-32 resize-none"
                            />
                            <button
                                onClick={runImprovement}
                                disabled={isImproving}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                            >
                                {isImproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Improve Bullet
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">AI Version</label>
                            <div className="w-full bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 h-32 text-sm font-medium text-blue-100/80 leading-relaxed italic">
                                {improvedBullet || "Your improved bullet will appear here..."}
                            </div>
                            {improvedBullet && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(improvedBullet)}
                                    className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors ml-2"
                                >
                                    Copy to Clipboard
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
