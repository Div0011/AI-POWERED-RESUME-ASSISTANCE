"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] w-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-12 text-center">
                    <div className="p-4 bg-rose-500/10 rounded-2xl mb-6">
                        <AlertCircle className="w-12 h-12 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Something went wrong.</h2>
                    <p className="text-white/40 mb-8 max-w-sm font-medium">
                        The AI engine or dashboard encountered an unexpected error. This might be due to an API timeout.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-white/90 transition-all active:scale-95"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
