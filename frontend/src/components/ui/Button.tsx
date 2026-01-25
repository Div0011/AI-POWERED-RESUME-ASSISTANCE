import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    className,
    variant = 'primary',
    fullWidth = false,
    ...props
}: ButtonProps) => {

    const baseStyles = "px-6 py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 border border-white/20 hover:shadow-white/20 relative after:absolute after:inset-0 after:rounded-xl after:border-2 after:border-transparent after:bg-clip-border hover:bg-white/95", // White btn with gradient text (as requested!)
        outline: "bg-transparent border border-white/30 text-white hover:bg-white/10",
        ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
    };

    // Correcting the primary style logic: The user asked for "buttons white with texts written in gradient".
    // Implementing purely white background with gradient text is tricky with standard CSS boundaries, 
    // so we'll use a hack or just text-slate-900 with a gradient hover effects if simple text-gradient fails.
    // Let's stick to: White Background + Gradient Text.

    const primaryStyle = "bg-white text-slate-800 hover:text-purple-600";

    return (
        <button
            className={cn(
                baseStyles,
                variant === 'primary' ? primaryStyle : variants[variant],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            {variant === 'primary' ? (
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
                    {children}
                </span>
            ) : children}
        </button>
    );
};
