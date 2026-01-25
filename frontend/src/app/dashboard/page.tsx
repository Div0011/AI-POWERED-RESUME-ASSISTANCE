"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CreateJobModal } from '@/components/CreateJobModal';

interface Job {
    id: number;
    title: string;
    description: string;
    required_skills: string[];
}

export default function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // Auth bypass - just fetch
    const fetchJobs = useCallback(async () => {
        try {
            // Send dummy token just to satisfy standard Headers if needed, 
            // but backend now ignores validity of token content.
            const response = await axios.get('http://localhost:8000/jobs/', {
                headers: { Authorization: `Bearer bypass-token` }
            });
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return (
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-28 text-white pb-24 md:pb-8">
            <CreateJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobCreated={fetchJobs}
            />

            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-16 gap-6 relative">
                    <div className="text-center md:text-center md:absolute md:left-1/2 md:-translate-x-1/2 w-full md:w-max">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-wide drop-shadow-md uppercase" style={{ fontFamily: 'var(--font-agale)' }}>
                            RECRUITER DASHBOARD
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="md:ml-auto bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-white/30 transition-all shadow-lg hover:shadow-xl hover:scale-105 group whitespace-nowrap md:z-10"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="font-semibold tracking-wide text-xs md:text-base">Create New Job</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/10 backdrop-blur-lg p-8 rounded-[2rem] border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all cursor-pointer group relative overflow-hidden"
                            onClick={() => router.push(`/jobs/details?id=${job.id}`)}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-6 h-6 text-white" />
                            </div>

                            <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{job.title}</h3>
                            <p className="text-white/70 text-sm line-clamp-3 mb-6 leading-relaxed font-light">{job.description}</p>

                            <div className="flex flex-wrap gap-2">
                                {job.required_skills.slice(0, 3).map(skill => (
                                    <span key={skill} className="bg-black/20 text-white/90 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10">
                                        {skill}
                                    </span>
                                ))}
                                {job.required_skills.length > 3 && (
                                    <span className="bg-black/20 text-white/90 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10">
                                        +{job.required_skills.length - 3}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Add empty state if needed */}
                    {jobs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 border-dashed">
                            <p className="text-white/50 text-xl font-light">No jobs posted yet. Create your first one!</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 text-white hover:text-purple-200 underline"
                            >
                                Post a job now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
