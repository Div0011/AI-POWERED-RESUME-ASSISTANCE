"use client";

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Zap, Terminal } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

export class AIErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('AI Error Boundary caught error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const isQuotaError = this.state.error?.message?.includes('429') ||
                this.state.error?.message?.includes('quota') ||
                this.state.error?.message?.includes('ResourceExhausted');

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl w-full"
                    >
                        {/* Neural Link Interrupted Card */}
                        <div className="glass-panel p-8 rounded-3xl border-2 border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                    <Zap className="w-8 h-8 text-rose-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-rose-500 mb-1">
                                        <Terminal className="w-3 h-3" />
                                        SYSTEM_ALERT
                                    </div>
                                    <h2 className="text-3xl font-agale font-bold tracking-tight text-[var(--foreground)] italic">
                                        Neural Link Interrupted
                                    </h2>
                                </div>
                            </div>

                            {/* Error Message */}
                            <div className="mb-6 p-4 bg-[var(--obsidian-card)]/50 rounded-xl border border-[var(--card-border)]">
                                <p className="text-sm text-[var(--foreground)]/70 font-mono leading-relaxed">
                                    {isQuotaError ? (
                                        <>
                                            <span className="text-rose-500 font-bold">AI Quota Exceeded:</span> The AI service has reached its rate limit.
                                            This typically resets within 60 seconds. Please try again shortly.
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-rose-500 font-bold">AI Service Error:</span> {this.props.fallbackMessage ||
                                                'The AI service encountered an unexpected error. This could be due to network issues or service unavailability.'}
                                        </>
                                    )}
                                </p>
                            </div>

                            {/* Technical Details (Collapsible) */}
                            {this.state.error && (
                                <details className="mb-6 group">
                                    <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)]/40 hover:text-[var(--foreground)]/60 transition-colors mb-2">
                                        Technical Details ▼
                                    </summary>
                                    <div className="p-4 bg-black/20 rounded-xl border border-[var(--card-border)] font-mono text-xs text-rose-400">
                                        <div className="mb-2">
                                            <span className="opacity-50">Error:</span> {this.state.error.message}
                                        </div>
                                        {this.state.error.stack && (
                                            <div className="opacity-30 text-[10px] mt-2 max-h-32 overflow-auto">
                                                {this.state.error.stack}
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={this.handleRetry}
                                    className="flex-1 px-6 py-4 bg-[var(--primary)] text-black rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,232,255,0.2)] flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Retry Connection
                                </button>
                                <button
                                    onClick={() => window.history.back()}
                                    className="px-6 py-4 bg-[var(--foreground)]/5 border border-[var(--card-border)] text-[var(--foreground)] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[var(--foreground)]/10 transition-all"
                                >
                                    Go Back
                                </button>
                            </div>

                            {/* Status Indicator */}
                            <div className="mt-6 pt-6 border-t border-[var(--card-border)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                                    <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--foreground)]/30">
                                        {isQuotaError ? 'Quota limit reached - Waiting for reset' : 'Service temporarily unavailable'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <p className="text-[10px] font-mono text-[var(--foreground)]/20 uppercase tracking-widest">
                                If this issue persists, please contact support
                            </p>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier use
export function withAIErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallbackMessage?: string
) {
    return function WithAIErrorBoundaryWrapper(props: P) {
        return (
            <AIErrorBoundary fallbackMessage={fallbackMessage}>
                <Component {...props} />
            </AIErrorBoundary>
        );
    };
}
