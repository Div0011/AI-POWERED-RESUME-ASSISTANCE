import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface ProgressStage {
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
    message?: string;
}

interface MultiStageProgressProps {
    stages: ProgressStage[];
    currentStage: number;
    estimatedTime?: string;
}

export function MultiStageProgress({ stages, currentStage, estimatedTime }: MultiStageProgressProps) {
    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="relative h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--primary)] to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Stage List */}
            <div className="space-y-3">
                {stages.map((stage, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${stage.status === 'active'
                                ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/30'
                                : stage.status === 'complete'
                                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                                    : stage.status === 'error'
                                        ? 'bg-rose-500/10 border border-rose-500/30'
                                        : 'bg-[var(--card-bg)] border border-[var(--card-border)]'
                            }`}
                    >
                        {/* Icon */}
                        <div className="shrink-0">
                            {stage.status === 'active' && (
                                <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
                            )}
                            {stage.status === 'complete' && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            )}
                            {stage.status === 'error' && (
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            )}
                            {stage.status === 'pending' && (
                                <div className="w-5 h-5 rounded-full border-2 border-[var(--foreground)]/20" />
                            )}
                        </div>

                        {/* Label */}
                        <div className="flex-1">
                            <p className={`text-sm font-bold uppercase tracking-wider ${stage.status === 'active' ? 'text-[var(--primary)]' :
                                    stage.status === 'complete' ? 'text-emerald-500' :
                                        stage.status === 'error' ? 'text-rose-500' :
                                            'text-[var(--foreground)]/40'
                                }`}>
                                {stage.label}
                            </p>
                            {stage.message && (
                                <p className="text-xs text-[var(--foreground)]/60 mt-1">{stage.message}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Estimated Time */}
            {estimatedTime && (
                <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/50 justify-center">
                    <Zap className="w-3 h-3" />
                    <span>Estimated time: {estimatedTime}</span>
                </div>
            )}
        </div>
    );
}

interface CircularProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    color?: string;
}

export function CircularProgress({
    percentage,
    size = 120,
    strokeWidth = 8,
    label,
    color = 'var(--primary)'
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg className="transform -rotate-90" width={size} height={size}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="var(--card-border)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            strokeDasharray: circumference,
                            filter: 'drop-shadow(0 0 8px currentColor)'
                        }}
                    />
                </svg>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black" style={{ color }}>
                        {Math.round(percentage)}%
                    </span>
                </div>
            </div>

            {label && (
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]/60">
                    {label}
                </p>
            )}
        </div>
    );
}

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

export function AnimatedCounter({ value, duration = 1, suffix = '', prefix = '' }: AnimatedCounterProps) {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const end = value;
        const increment = end / (duration * 60); // 60fps

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [value, duration]);

    return (
        <span className="font-mono font-bold">
            {prefix}{count}{suffix}
        </span>
    );
}

interface PulsingDotProps {
    color?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function PulsingDot({ color = 'var(--primary)', size = 'md' }: PulsingDotProps) {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    return (
        <div className="relative inline-flex">
            <motion.div
                className={`${sizeClasses[size]} rounded-full`}
                style={{ backgroundColor: color }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
            <motion.div
                className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
                style={{ backgroundColor: color }}
                animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0, 0.5]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </div>
    );
}

interface SkeletonLoaderProps {
    lines?: number;
    className?: string;
}

export function SkeletonLoader({ lines = 3, className = '' }: SkeletonLoaderProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, idx) => (
                <motion.div
                    key={idx}
                    className="h-4 bg-[var(--card-border)] rounded-lg overflow-hidden"
                    style={{ width: `${100 - idx * 10}%` }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
