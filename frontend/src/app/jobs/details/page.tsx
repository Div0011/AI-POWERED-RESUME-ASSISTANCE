"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { UploadZone } from '@/components/UploadZone';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface Job {
    id: number;
    title: string;
    description: string;
}

interface Candidate {
    id: number;
    name: string;
    score: number;
    confidence_score: string;
    explanation: string;
    analysis: any;
}

function JobDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [job, setJob] = useState<Job | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchJob = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/jobs/${id}`, {
                    headers: { Authorization: `Bearer bypass-token` }
                });
                setJob(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchJob();
    }, [id]);

    const handleUpload = async (files: File[]) => {
        setIsUploading(true);
        const token = localStorage.getItem('token');

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jd_text', job?.description || '');

            try {
                const res = await axios.post('http://localhost:8000/process-candidate/', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const newCandidate: Candidate = {
                    id: Date.now(),
                    name: res.data.filename,
                    score: 85,
                    confidence_score: res.data.confidence_score,
                    explanation: res.data.explanation,
                    analysis: res.data.analysis
                };
                setCandidates(prev => [...prev, newCandidate]);
            } catch (e) {
                console.error(e);
            }
        }
        setIsUploading(false);
    };

    if (!job) return <div className="p-8 text-white">Loading job details...</div>;

    return (
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-28 text-white pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-14 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-6 drop-shadow-md border-b-2 border-white/20 pb-6 inline-block uppercase mt-12 md:mt-0" style={{ fontFamily: 'var(--font-agale)' }}>{job.title}</h1>
                    <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-4xl mx-auto">{job.description}</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 tracking-wide flex items-center gap-3 uppercase" style={{ fontFamily: 'var(--font-agale)' }}>
                            <span className="bg-white/10 p-2 rounded-xl border border-white/10"><FileText className="w-5 h-5 text-purple-300" /></span>
                            Candidates
                        </h2>
                        <div className="space-y-4">
                            {candidates.map((c) => (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 relative overflow-hidden group"
                                >
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-500/30">
                                                <FileText className="w-6 h-6 text-purple-300" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg tracking-wide">{c.name}</h3>
                                                <p className="text-sm font-medium text-white/50">Score: <span className="text-purple-300 font-bold">{c.score}%</span></p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border
                                            ${c.confidence_score === 'High' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                                c.confidence_score === 'Medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                    'bg-rose-500/20 text-rose-400 border-rose-500/30'}`}>
                                            {c.confidence_score} Confidence
                                        </div>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed p-5 bg-black/20 rounded-[1.5rem] border border-white/5 font-light italic relative z-10">"{c.explanation}"</p>
                                </motion.div>
                            ))}
                            {candidates.length === 0 && (
                                <div className="text-center py-20 bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/10 border-dashed">
                                    <p className="text-white/30 font-medium uppercase tracking-widest text-sm">No candidates yet. Upload resumes to screen.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6 tracking-wide flex items-center gap-3 uppercase" style={{ fontFamily: 'var(--font-agale)' }}>
                            <span className="bg-white/10 p-2 rounded-xl border border-white/10"><AlertCircle className="w-5 h-5 text-purple-300" /></span>
                            Screening
                        </h2>
                        <div className="bg-white/10 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-2xl border border-white/20 sticky top-8">
                            <UploadZone onUpload={handleUpload} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JobDetailsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
            <JobDetailsContent />
        </Suspense>
    );
}
