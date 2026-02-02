"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobCreated: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Using bypass-token as auth is bypassed in backend
            await axios.post('http://localhost:8000/jobs/', {
                title,
                description
            }, {
                headers: { Authorization: `Bearer bypass-token` }
            });
            onJobCreated();
            onClose();
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error(error);
            alert('Failed to create job');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-8 rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto relative overflow-hidden">
                            {/* Detailed Tech Header Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-50" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-3 tracking-tight">
                                <span className="bg-[var(--primary)]/10 p-2 rounded-lg text-[var(--primary)] border border-[var(--primary)]/20">
                                    <Sparkles className="w-5 h-5" />
                                </span>
                                Post New Job
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--foreground)]/70 uppercase tracking-widest mb-2 ml-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--slate-950)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-sans text-sm"
                                        placeholder="e.g. Senior Frontend Developer"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[var(--foreground)]/70 uppercase tracking-widest mb-2 ml-1">Job Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--slate-950)] border border-[var(--card-border)] text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 transition-all font-sans text-sm resize-none"
                                        placeholder="Paste the JD here..."
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={isLoading} fullWidth>
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : 'Create Job Listing'}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
