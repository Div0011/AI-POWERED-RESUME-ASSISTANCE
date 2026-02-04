"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    Building2, Briefcase, DollarSign, Target, Sparkles,
    ChevronRight, ChevronLeft, Check, Calendar, MapPin,
    Users, GraduationCap, Award, Clock, Eye, Zap, Loader2
} from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '@/config';
import { MultiStageProgress } from '@/components/ProgressComponents';
import ReactMarkdown from 'react-markdown';

interface JobFormData {
    // Step 1: Basics
    companyName: string;
    jobTitle: string;
    department: string;
    employmentType: string;
    location: string;
    isRemote: boolean;

    // Step 2: Compensation
    salaryMin: number;
    salaryMax: number;
    currency: string;
    contractDuration: string;
    benefits: string[];

    // Step 3: Must-Haves
    requiredSkills: string[];
    yearsExperience: number;
    educationLevel: string;
    certifications: string[];

    // Step 4: Nice-to-Haves
    preferredSkills: string[];
    preferredExperience: string;
    culturalTraits: string[];

    // Step 5: AI Generated
    description: string;

    // Step 6: Publishing
    applicationDeadline: string;
    numOpenings: number;
    visibility: string;
    autoResponseTemplate: string;
}

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
    'Remote Work', 'Unlimited PTO', 'Learning Budget', 'Gym Membership',
    'Parental Leave', 'Commuter Benefits'
];

const CULTURAL_TRAITS = [
    'Team Player', 'Self-Starter', 'Detail-Oriented', 'Creative',
    'Analytical', 'Leadership', 'Adaptable', 'Communicative'
];

const VISIBILITY_OPTIONS = [
    { value: 'public', label: 'Public - Anyone can apply' },
    { value: 'internal', label: 'Internal - Company employees only' },
    { value: 'invite', label: 'Invite-only - Specific candidates' }
];

export default function EnhancedJobCreationForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<JobFormData>({
        companyName: '',
        jobTitle: '',
        department: '',
        employmentType: '',
        location: '',
        isRemote: false,
        salaryMin: 0,
        salaryMax: 0,
        currency: 'USD',
        contractDuration: '',
        benefits: [],
        requiredSkills: [],
        yearsExperience: 0,
        educationLevel: '',
        certifications: [],
        preferredSkills: [],
        preferredExperience: '',
        culturalTraits: [],
        description: '',
        applicationDeadline: '',
        numOpenings: 1,
        visibility: 'public',
        autoResponseTemplate: 'Thank you for your application! We will review it and get back to you soon.'
    });

    const [currentInput, setCurrentInput] = useState('');
    const [generationStages, setGenerationStages] = useState<Array<{
        label: string;
        status: 'pending' | 'active' | 'complete' | 'error';
        message: string;
    }>>([]);
    const [currentGenerationStage, setCurrentGenerationStage] = useState(-1);

    const updateField = (field: keyof JobFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addToArray = (field: keyof JobFormData, value: string) => {
        const currentArray = formData[field] as string[];
        if (!currentArray.includes(value)) {
            updateField(field, [...currentArray, value]);
        }
    };

    const removeFromArray = (field: keyof JobFormData, value: string) => {
        const currentArray = formData[field] as string[];
        updateField(field, currentArray.filter(item => item !== value));
    };

    const toggleArrayItem = (field: keyof JobFormData, value: string) => {
        const currentArray = formData[field] as string[];
        if (currentArray.includes(value)) {
            removeFromArray(field, value);
        } else {
            addToArray(field, value);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return formData.companyName && formData.jobTitle && formData.department && formData.employmentType;
            case 1: return formData.salaryMin > 0 && formData.salaryMax > formData.salaryMin;
            case 2: return formData.requiredSkills.length > 0 && formData.yearsExperience >= 0;
            case 3: return true; // Optional step
            case 4: return formData.description.length > 0;
            case 5: return formData.applicationDeadline && formData.numOpenings > 0;
            default: return false;
        }
    };

    const generateDescription = async () => {
        setIsGenerating(true);
        setError('');
        setCurrentGenerationStage(0);

        setGenerationStages([
            { label: 'Analyzing Requirements', status: 'pending', message: '' },
            { label: 'Generating Description', status: 'pending', message: '' },
            { label: 'Formatting Output', status: 'pending', message: '' }
        ]);

        try {
            // Stage 1
            setGenerationStages(prev => prev.map((s, i) =>
                i === 0 ? { ...s, status: 'active', message: 'Processing job details...' } : s
            ));
            await new Promise(r => setTimeout(r, 600));
            setGenerationStages(prev => prev.map((s, i) =>
                i === 0 ? { ...s, status: 'complete', message: 'Requirements analyzed' } : s
            ));
            setCurrentGenerationStage(1);

            // Stage 2 - API Call
            setGenerationStages(prev => prev.map((s, i) =>
                i === 1 ? { ...s, status: 'active', message: 'AI generating content...' } : s
            ));

            const prompt = {
                company: formData.companyName,
                title: formData.jobTitle,
                department: formData.department,
                type: formData.employmentType,
                location: formData.isRemote ? 'Remote' : formData.location,
                required_skills: formData.requiredSkills,
                preferred_skills: formData.preferredSkills,
                years_experience: formData.yearsExperience,
                education: formData.educationLevel
            };

            const res = await axios.post(`${API_BASE}/jobs/expand`, {
                keywords: [...formData.requiredSkills, ...formData.preferredSkills]
            });

            setGenerationStages(prev => prev.map((s, i) =>
                i === 1 ? { ...s, status: 'complete', message: 'Description generated' } : s
            ));
            setCurrentGenerationStage(2);

            // Stage 3
            setGenerationStages(prev => prev.map((s, i) =>
                i === 2 ? { ...s, status: 'active', message: 'Finalizing...' } : s
            ));
            await new Promise(r => setTimeout(r, 400));
            setGenerationStages(prev => prev.map((s, i) =>
                i === 2 ? { ...s, status: 'complete', message: 'Ready!' } : s
            ));

            updateField('description', res.data.suggested_description);
            await new Promise(r => setTimeout(r, 500));
            setCurrentStep(5);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Generation failed');
            if (currentGenerationStage >= 0) {
                setGenerationStages(prev => prev.map((s, i) =>
                    i === currentGenerationStage ? { ...s, status: 'error', message: 'Failed' } : s
                ));
            }
        } finally {
            setIsGenerating(false);
            setCurrentGenerationStage(-1);
        }
    };

    const publishJob = async () => {
        setIsPublishing(true);
        setError('');
        try {
            // Map camelCase to snake_case for backend
            const backendData = {
                title: formData.jobTitle,
                description: formData.description,
                company_name: formData.companyName,
                department: formData.department,
                employment_type: formData.employmentType,
                location: formData.location,
                is_remote: formData.isRemote,
                salary_min: formData.salaryMin,
                salary_max: formData.salaryMax,
                currency: formData.currency,
                benefits: formData.benefits,
                required_skills: formData.requiredSkills,
                preferred_skills: formData.preferredSkills,
                years_experience: formData.yearsExperience,
                education_level: formData.educationLevel,
                application_deadline: formData.applicationDeadline,
                visibility: formData.visibility,
                num_openings: formData.numOpenings
            };

            const res = await axios.post(`${API_BASE}/jobs/`, backendData);
            router.push(`/recruiter/dashboard?job_id=${res.data.id}`);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Publishing failed');
        } finally {
            setIsPublishing(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
                            Role Basics
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">Company *</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => updateField('companyName', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] transition-all"
                                    placeholder="Acme Corp"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Job Title *</label>
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => updateField('jobTitle', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] transition-all"
                                    placeholder="Senior Backend Engineer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Department *</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => updateField('department', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] transition-all"
                                >
                                    <option value="">Select Department</option>
                                    {DEPARTMENTS.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Employment Type *</label>
                                <select
                                    value={formData.employmentType}
                                    onChange={(e) => updateField('employmentType', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] transition-all"
                                >
                                    <option value="">Select Type</option>
                                    {EMPLOYMENT_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    disabled={formData.isRemote}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] transition-all disabled:opacity-50"
                                    placeholder="San Francisco, CA"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-8">
                                <input
                                    type="checkbox"
                                    id="remote"
                                    checked={formData.isRemote}
                                    onChange={(e) => updateField('isRemote', e.target.checked)}
                                    className="w-5 h-5 accent-[var(--primary)]"
                                />
                                <label htmlFor="remote" className="text-sm font-bold uppercase tracking-wider cursor-pointer">
                                    Remote Position
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Compensation & Duration
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                            Compensation
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-1 sm:space-y-2">
                                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">Min Salary ({formData.currency})</label>
                                <input
                                    type="number"
                                    value={formData.salaryMin}
                                    onChange={(e) => updateField('salaryMin', parseInt(e.target.value))}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] text-emerald-400 font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Salary Max ({formData.currency})</label>
                                <input
                                    type="number"
                                    value={formData.salaryMax}
                                    onChange={(e) => updateField('salaryMax', parseInt(e.target.value))}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] text-emerald-400 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Benefits</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {BENEFITS.map(benefit => (
                                    <button
                                        key={benefit}
                                        onClick={() => toggleArrayItem('benefits', benefit)}
                                        className={`p-3 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${formData.benefits.includes(benefit)
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                            : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        {benefit}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 2: // Must-Haves
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                            Requirements
                        </h2>

                        <div className="space-y-3 sm:space-y-4">
                            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">Skills (Press Enter)</label>
                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && currentInput.trim()) {
                                        addToArray('requiredSkills', currentInput.trim());
                                        setCurrentInput('');
                                    }
                                }}
                                value={currentInput}
                                onChange={(e) => setCurrentInput(e.target.value)}
                                className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)]"
                                placeholder="e.g. Python, AWS, React"
                            />
                            <div className="flex flex-wrap gap-2">
                                {formData.requiredSkills.map(skill => (
                                    <div key={skill} className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-bold flex items-center gap-2">
                                        {skill}
                                        <button onClick={() => removeFromArray('requiredSkills', skill)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Years of Experience</label>
                                <input
                                    type="number"
                                    value={formData.yearsExperience}
                                    onChange={(e) => updateField('yearsExperience', parseInt(e.target.value))}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Education Level</label>
                                <select
                                    value={formData.educationLevel}
                                    onChange={(e) => updateField('educationLevel', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)]"
                                >
                                    <option value="">Select Level</option>
                                    {EDUCATION_LEVELS.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Cultural & Optional
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                            Culture Fit
                        </h2>

                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Ideal Values</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {CULTURAL_TRAITS.map(trait => (
                                    <button
                                        key={trait}
                                        onClick={() => toggleArrayItem('culturalTraits', trait)}
                                        className={`p-3 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all ${formData.culturalTraits.includes(trait)
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                            : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        {trait}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.preferredExperience}
                                onChange={(e) => updateField('preferredExperience', e.target.value)}
                                className="w-full h-32 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)] resize-none"
                                placeholder="Describe the ideal candidate's personality..."
                            />
                        </div>
                    </div>
                );

            case 4: // AI Generation Step
                return (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--primary)]" />
                                AI Brief
                            </h2>
                            <button
                                onClick={generateDescription}
                                disabled={isGenerating}
                                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[var(--primary)]/20 transition-all flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Re-Synthesize
                            </button>
                        </div>

                        <div className="bg-[var(--obsidian)]/50 border border-[var(--card-border)] rounded-2xl p-4 sm:p-8 h-[300px] sm:h-[450px] overflow-y-auto custom-scrollbar prose prose-invert prose-xs sm:prose-sm max-w-none">
                            <ReactMarkdown>{formData.description || "Synthesizing mission brief..."}</ReactMarkdown>
                        </div>
                    </div>
                );

            case 5: // Final Review & Visibility
                return (
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Eye className="w-6 h-6 text-orange-400" />
                            Final Review & Deployment
                        </h2>

                        <div className="p-6 bg-black/40 rounded-2xl border border-[var(--card-border)] space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold font-agale">{formData.jobTitle}</h3>
                                    <p className="text-sm opacity-60">{formData.companyName} • {formData.location}</p>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase">
                                    {formData.employmentType}
                                </div>
                            </div>
                            <div className="shrink-0 h-[1px] bg-[var(--card-border)]" />
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{formData.description}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Submission Deadline</label>
                                <input
                                    type="date"
                                    value={formData.applicationDeadline}
                                    onChange={(e) => updateField('applicationDeadline', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest opacity-60">Access Level</label>
                                <select
                                    value={formData.visibility}
                                    onChange={(e) => updateField('visibility', e.target.value)}
                                    className="w-full p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl outline-none focus:border-[var(--primary)]"
                                >
                                    {VISIBILITY_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-24 sm:pt-32 px-4 sm:px-12 pb-12">
            <div className="max-w-5xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 no-scrollbar">
                        {['Basics', 'Comps', 'Must', 'Nice', 'AI', 'Pub'].map((step, idx) => (
                            <div key={idx} className="flex items-center shrink-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${idx < currentStep ? 'bg-emerald-500 text-white' :
                                    idx === currentStep ? 'bg-[var(--primary)] text-[var(--obsidian)]' :
                                        'bg-[var(--card-bg)] text-[var(--foreground)]/40'
                                    }`}>
                                    {idx < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                                </div>
                                {idx < 5 && (
                                    <div className={`w-4 sm:w-12 h-1 mx-1 sm:mx-2 ${idx < currentStep ? 'bg-emerald-500' : 'bg-[var(--card-border)]'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">
                        Mission Step {currentStep + 1} / 6
                    </div>
                </div>

                {/* Form Content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--card-border)]"
                >
                    {renderStep()}

                    {error && (
                        <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--card-border)]">
                        <button
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm disabled:opacity-30 hover:bg-[var(--card-bg)] transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        <button
                            onClick={() => {
                                if (currentStep === 4) {
                                    generateDescription();
                                } else if (currentStep === 5) {
                                    publishJob();
                                } else {
                                    setCurrentStep(prev => prev + 1);
                                }
                            }}
                            disabled={!canProceed() || isGenerating || isPublishing}
                            className="flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-[var(--obsidian)] rounded-xl font-black uppercase tracking-wider text-sm hover:opacity-90 disabled:opacity-30 transition-all"
                        >
                            {currentStep === 4 ? 'Generate Description' :
                                currentStep === 5 ? 'Publish Job' : 'Continue'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
