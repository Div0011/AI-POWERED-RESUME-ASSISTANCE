"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock Data for Jobs
const MOCK_PUBLIC_JOBS = [
    { id: 1, title: "Senior Frontend Engineer", company: "TechCorp", location: "Remote", type: "Full-time", skills: ["React", "Typescript", "Tailwind"], match: 94 },
    { id: 2, title: "Product Designer", company: "CreativeStudio", location: "New York, NY", type: "Contract", skills: ["Figma", "UI/UX", "Prototyping"], match: 45 },
    { id: 3, title: "Backend Developer", company: "DataSystems", location: "San Francisco, CA", type: "Full-time", skills: ["Python", "Django", "AWS"], match: 88 },
];

export default function JobMatchPage() {
    return (
        <div className="min-h-screen p-4 md:p-8 pt-20 md:pt-28 text-white pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4 drop-shadow-md uppercase mt-12 md:mt-0" style={{ fontFamily: 'var(--font-agale)' }}>
                        AI Job Match
                    </h1>
                    <p className="text-white/60 max-w-2xl mx-auto">
                        We analyzed your resume and found these roles where you have the highest chance of getting an interview.
                    </p>
                </header>

                {/* Search Bar */}
                <div className="relative mb-12 max-w-2xl mx-auto">
                    <Search className="absolute left-5 top-4 w-5 h-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search for roles, skills, or companies..."
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-lg backdrop-blur-md"
                    />
                </div>

                {/* Job List */}
                <div className="space-y-6">
                    {MOCK_PUBLIC_JOBS.map((job) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl hover:bg-white/15 transition-all relative overflow-hidden"
                        >
                            {/* Match Badge */}
                            <div className="absolute top-0 right-0 p-4">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg border border-white/10
                                    ${job.match > 80 ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'}
                                `}>
                                    <Zap className="w-4 h-4 fill-current" />
                                    {job.match}% Match
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Briefcase className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">{job.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-4">
                                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.company}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-white/80">{job.type}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map(skill => (
                                            <span key={skill} className="text-xs font-semibold bg-black/20 px-3 py-1 rounded-full text-white/80 border border-white/5">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="self-end md:self-center">
                                    <Button className="px-8">Apply Now</Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
