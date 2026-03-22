"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
    Target, Sparkles, ChevronRight,
    Calendar, MapPin, Users, GraduationCap,
    Clock, Loader2, DollarSign, CheckCircle2,
    Briefcase, Type, ExternalLink, Globe, LayoutDashboard, Eye, Building2
} from 'lucide-react';
import { API_BASE } from '@/config';
import { useAuth } from '@/context/AuthContext';

// Schema Validation
const formSchema = z.object({
    jobTitle: z.string().min(2, "Job title is required"),
    companyName: z.string().min(2, "Company name is required"),
    department: z.string().optional(),
    employmentType: z.string().optional(),
    location: z.string().optional(),
    isRemote: z.boolean(),
    salaryMin: z.number().min(0),
    salaryMax: z.number().min(0),
    currency: z.string(),
    yearsExperience: z.number().min(0),
    educationLevel: z.string().optional(),
    description: z.string().optional(), // Make optional because we might start without one
    requiredSkills: z.array(z.string()),
    benefits: z.array(z.string()),
});

type JobFormData = z.infer<typeof formSchema>;

const DEPARTMENTS = [
    'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
    'Operations', 'HR', 'Finance', 'Customer Success', 'Other'
];

const EMPLOYMENT_TYPES = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'
];

const EDUCATION_LEVELS = [
    'High School', 'Associate Degree', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD', 'Not Required'
];

const BENEFITS = [
    'Health Insurance', '401(k)', 'Stock Options', 'Flexible Hours',
    'Remote Work', 'Unlimited PTO', 'Learning Budget', 'Gym Membership'
];

export default function EnhancedJobCreationForm() {
    const router = useRouter();
    const { user } = useAuth();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [previewScale, setPreviewScale] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [publishedJobId, setPublishedJobId] = useState<number | null>(null);
    const previewContainerRef = useRef<HTMLDivElement>(null);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<JobFormData>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            jobTitle: '',
            companyName: '',
            department: '',
            employmentType: 'Full-time',
            location: '',
            isRemote: false,
            salaryMin: 90000,
            salaryMax: 150000,
            currency: 'USD',
            yearsExperience: 2,
            educationLevel: "Bachelor's Degree",
            description: '',
            requiredSkills: [],
            benefits: [],
        }
    });

    const formValues = watch();

    useEffect(() => {
        const handleResize = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                const baseWidth = 600;
                const scale = Math.min(containerWidth / baseWidth, 1);
                setPreviewScale(scale);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const generateDescription = async () => {
        if (!formValues.jobTitle || !formValues.companyName) {
            setError("Please enter Job Title and Company Name to generate description.");
            return;
        }

        setIsGenerating(true);
        setError('');

        try {
            const keywords = [...formValues.requiredSkills, formValues.jobTitle, formValues.department || "General"];
            const res = await axios.post(`${API_BASE}/jobs/expand`, { keywords }, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setValue('description', res.data.suggested_description);
            setValue('jobTitle', res.data.suggested_title);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Description generation failed.');
        } finally {
            setIsGenerating(false);
        }
    };

    const onSubmit = async (data: JobFormData) => {
        setIsPublishing(true);
        setError('');
        try {
            const backendData = {
                title: data.jobTitle,
                description: data.description || "",
                company_name: data.companyName,
                department: data.department || "",
                employment_type: data.employmentType || "Full-time",
                location: data.location || "",
                is_remote: data.isRemote,
                salary_min: data.salaryMin,
                salary_max: data.salaryMax,
                currency: data.currency,
                benefits: data.benefits,
                required_skills: data.requiredSkills,
                years_experience: data.yearsExperience,
                education_level: data.educationLevel || "Bachelor's Degree",
                visibility: "public"
            };

            const res = await axios.post(`${API_BASE}/jobs/`, backendData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setPublishedJobId(res.data.id);
            setShowSuccessModal(true);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Job publishing failed.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="min-h-screen pt-4 px-4 sm:px-8 pb-12 font-sans bg-[var(--background)] text-[var(--foreground)]">
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[var(--obsidian)] border border-[var(--primary)]/30 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
                            <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-agale font-bold mb-2">Deployed!</h2>
                            <p className="text-sm text-gray-400 mb-8">
                                Your mission is now live on the neural net. Top candidates are being analyzed right now.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => router.push(`/recruiter/dashboard?job_id=${publishedJobId}`)}
                                    className="w-full py-3 bg-[var(--primary)] text-black rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,232,255,0.3)]"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={() => router.push(`/candidate/jobs`)}
                                    className="w-full py-3 bg-transparent border border-[var(--card-border)] text-white rounded-xl font-bold text-sm hover:bg-white/5 transition-all"
                                >
                                    View as Candidate
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between sticky top-0 z-40 py-4 bg-[var(--background)]/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/recruiter/dashboard')}
                        className="p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 opacity-60" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-white font-agale">
                            New Job Post Deployment
                        </h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPublishing}
                        className="px-6 py-2.5 bg-[var(--primary)] text-black rounded-xl font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,232,255,0.3)]"
                    >
                        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        {isPublishing ? "Publishing..." : "Publish Job Post"}
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-[calc(100vh-120px)]">

                {/* LEFT COLUMN - THE FORM EDITOR */}
                <div className="lg:col-span-6 space-y-8 overflow-y-auto pr-4 pb-20 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6">
                        {/* 1. Core Meta */}
                        <div className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] space-y-6">
                            <h2 className="text-xl font-agale flex items-center gap-2"><Briefcase className="w-5 h-5 text-[var(--primary)]" /> Core Metadata</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Job Title *</label>
                                    <input
                                        {...register("jobTitle")}
                                        className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all"
                                        placeholder="e.g. Senior Frontend Engineer"
                                    />
                                    {errors.jobTitle && <span className="text-rose-500 text-xs">{errors.jobTitle.message}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Company Name *</label>
                                        <input
                                            {...register("companyName")}
                                            className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all"
                                            placeholder="Your Company"
                                        />
                                        {errors.companyName && <span className="text-rose-500 text-xs">{errors.companyName.message}</span>}
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Department</label>
                                        <select
                                            {...register("department")}
                                            className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all appearance-none text-[var(--foreground)]"
                                        >
                                            <option value="">Select Department</option>
                                            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[var(--obsidian)]">{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Logistics & Compensation */}
                        <div className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] space-y-6">
                            <h2 className="text-xl font-agale flex items-center gap-2"><Globe className="w-5 h-5 text-[var(--primary)]" /> Logistics & Compensation</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Employment Type</label>
                                    <select
                                        {...register("employmentType")}
                                        className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all appearance-none text-[var(--foreground)]"
                                    >
                                        {EMPLOYMENT_TYPES.map(d => <option key={d} value={d} className="bg-[var(--obsidian)]">{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block">Work Model</label>
                                    <label className="flex items-center gap-3 p-3 border border-[var(--card-border)] rounded-xl cursor-pointer hover:bg-[var(--foreground)]/5 transition-colors bg-[var(--obsidian)]/30">
                                        <input
                                            type="checkbox"
                                            {...register("isRemote")}
                                            className="w-4 h-4 accent-[var(--primary)]"
                                        />
                                        <span className="text-xs font-bold tracking-wide">Remote Position</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Location</label>
                                <input
                                    {...register("location")}
                                    disabled={formValues.isRemote}
                                    className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all disabled:opacity-30"
                                    placeholder={formValues.isRemote ? "Remote Worldwide" : "City, Country"}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-center">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Min Salary</label>
                                    <input type="number" {...register("salaryMin", { valueAsNumber: true })} className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Max Salary</label>
                                    <input type="number" {...register("salaryMax", { valueAsNumber: true })} className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Currency</label>
                                    <select {...register("currency")} className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all appearance-none text-[var(--foreground)]">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Skill Matrices */}
                        <div className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] space-y-6">
                            <h2 className="text-xl font-agale flex items-center gap-2"><Target className="w-5 h-5 text-[var(--primary)]" /> Matrix Targets</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Years of Exp</label>
                                    <input type="number" {...register("yearsExperience", { valueAsNumber: true })} className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Education</label>
                                    <select {...register("educationLevel")} className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all appearance-none text-[var(--foreground)]">
                                        {EDUCATION_LEVELS.map(d => <option key={d} value={d} className="bg-[var(--obsidian)]">{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-wider font-bold opacity-50 block mb-2">Mandatory Skills (Type & Enter)</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formValues.requiredSkills.map(skill => (
                                        <span key={skill} className="px-3 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 rounded-lg text-xs font-bold flex items-center gap-2">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = formValues.requiredSkills.filter(s => s !== skill);
                                                    setValue('requiredSkills', updated);
                                                }}
                                                className="hover:opacity-70 text-rose-400">×</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (skillInput.trim() && !formValues.requiredSkills.includes(skillInput.trim())) {
                                                setValue('requiredSkills', [...formValues.requiredSkills, skillInput.trim()]);
                                                setSkillInput('');
                                            }
                                        }
                                    }}
                                    className="w-full bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl px-4 py-3 text-sm focus:border-[var(--primary)] outline-none transition-all"
                                    placeholder="e.g. React, Python, AWS..."
                                />
                            </div>
                        </div>

                        {/* 4. AI Generated Description */}
                        <div className="glass-panel p-6 rounded-3xl border border-[var(--card-border)] space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 blur-sm scale-150 rotate-12 pointer-events-none">
                                <Sparkles className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-agale flex items-center gap-2"><Type className="w-5 h-5 text-[var(--primary)]" /> Mission Description</h2>
                                    <button
                                        type="button"
                                        onClick={generateDescription}
                                        disabled={isGenerating || !formValues.jobTitle}
                                        className="text-[10px] font-black tracking-widest uppercase text-white bg-gradient-to-r from-purple-600 to-[var(--primary)] px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,232,255,0.4)] disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                        {isGenerating ? "Synthesizing..." : "Auto-Draft AI"}
                                    </button>
                                </div>
                                <textarea
                                    {...register("description")}
                                    className="w-full h-80 bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-xl p-6 text-sm font-mono leading-relaxed focus:border-[var(--primary)] outline-none transition-all resize-none custom-scrollbar"
                                    placeholder="The AI will weave the exact mission brief here..."
                                />
                                {errors.description && <span className="text-rose-500 text-xs mt-2 block">{errors.description.message}</span>}
                            </div>
                        </div>

                    </form>
                </div>

                {/* RIGHT COLUMN - LIVE PREVIEW */}
                <div className="lg:col-span-6 h-full flex flex-col items-center sticky top-28" ref={previewContainerRef}>
                    <div className="w-full flex items-center justify-between mb-4 px-2">
                        <span className="text-[10px] uppercase tracking-widest font-black opacity-40 flex items-center gap-2"><Eye className="w-4 h-4" /> Live Output Canvas</span>
                    </div>

                    <div className="w-full max-w-[600px] bg-white text-black shadow-2xl transition-all duration-300 origin-top overflow-hidden relative rounded-xl"
                        style={{
                            height: '800px',
                            transform: `scale(${previewScale})`,
                        }}
                    >
                        {/* A4 Content Area with neat scrollbar */}
                        <div className="h-full overflow-y-auto custom-scrollbar-light p-10 relative z-10 selection:bg-[var(--primary)] selection:text-white">

                            {/* Candidate View Header */}
                            <div className="border-b-4 border-black pb-8 mb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1 rounded-full">
                                        Mission Protocol
                                    </div>
                                    <div className="font-mono text-xs font-bold text-gray-400">
                                        {new Date().toISOString().split('T')[0]} // AC-11
                                    </div>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight mb-4 uppercase font-sans text-gray-900 leading-none">
                                    {formValues.jobTitle || "UNTITLED ROLE"}
                                </h1>
                                <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                                    <span className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {formValues.companyName || "COMPANY_ID"}</span>
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {formValues.isRemote ? "Remote Operations" : formValues.location || "LOCATION_ID"}</span>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <span className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-400 mb-2 tracking-widest"><Calendar className="w-3 h-3" /> Experience Index</span>
                                    <span className="font-bold text-lg text-gray-800">{formValues.yearsExperience}+ Cycles Expected</span>
                                </div>
                                <div>
                                    <span className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-400 mb-2 tracking-widest"><DollarSign className="w-3 h-3" /> Compensation Ledger</span>
                                    <span className="font-bold text-lg text-gray-800">
                                        {formValues.salaryMin > 0 ? `${formValues.currency} ${formValues.salaryMin.toLocaleString()} - ${formValues.salaryMax.toLocaleString()}` : 'Negotiable Yield'}
                                    </span>
                                </div>
                                <div>
                                    <span className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-400 mb-2 tracking-widest"><Briefcase className="w-3 h-3" /> Division / Model</span>
                                    <span className="font-bold text-lg text-gray-800">{formValues.department || "Operations"} • {formValues.employmentType}</span>
                                </div>
                                <div>
                                    <span className="flex items-center gap-2 text-[9px] uppercase font-black text-gray-400 mb-2 tracking-widest"><GraduationCap className="w-3 h-3" /> Academic Threshold</span>
                                    <span className="font-bold text-lg text-gray-800">{formValues.educationLevel}</span>
                                </div>
                            </div>

                            {/* Required Arsenal */}
                            {formValues.requiredSkills.length > 0 ? (
                                <div className="mb-10">
                                    <span className="block text-[10px] uppercase font-black text-[#4F46E5] mb-4 tracking-widest border-l-2 border-[#4F46E5] pl-3">Mandatory Capabilities</span>
                                    <div className="flex flex-wrap gap-2">
                                        {formValues.requiredSkills.map(skill => (
                                            <span key={skill} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold shadow-md">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-10 opacity-20 border border-dashed border-gray-400 rounded-xl p-4 text-center">
                                    <span className="block text-[10px] uppercase font-black text-gray-800 tracking-widest">No capabilities specified</span>
                                </div>
                            )}

                            {/* Briefing Contents */}
                            <div className="mb-12">
                                <span className="block text-[10px] uppercase font-black text-[#4F46E5] mb-6 tracking-widest border-l-2 border-[#4F46E5] pl-3">Mission Briefing Synopsis</span>
                                <div className="prose prose-sm prose-black max-w-none text-gray-700 font-serif leading-loose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h2:font-agale prose-h3:font-agale prose-a:text-[#4F46E5]">
                                    {formValues.description ? (
                                        <ReactMarkdown>{formValues.description}</ReactMarkdown>
                                    ) : (
                                        <div className="space-y-4 opacity-10 select-none font-sans">
                                            <div className="h-3 bg-black rounded w-full"></div>
                                            <div className="h-3 bg-black rounded w-[90%]"></div>
                                            <div className="h-3 bg-black rounded w-[95%]"></div>
                                            <div className="h-3 bg-black rounded w-3/4"></div>
                                            <div className="h-3 bg-black rounded w-[85%] mt-8"></div>
                                            <div className="h-3 bg-black rounded w-[60%]"></div>
                                            <div className="h-3 bg-black rounded w-[75%]"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Subtle watermarks for paper feel */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 border-[10px] border-gray-50 rounded-full opacity-50 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent pointer-events-none mix-blend-multiply"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
