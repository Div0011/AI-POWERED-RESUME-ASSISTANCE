// API Base URL - Support both local and remote deployments
const getApiBase = (): string => {
    // 1. Check environment variable first
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // 2. For browser environment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // If running on localhost, use local backend
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8000';
        }
        
        // For remote deployments, construct backend URL based on domain
        const protocol = window.location.protocol;
        const port = window.location.port;
        
        // If backend is on the same domain but different port
        if (port) {
            return `${protocol}//${hostname}:8000`;
        }
        
        // Default: assume backend is on /api
        return `${protocol}//${hostname}/api`;
    }
    
    // 3. Fallback for server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export const API_BASE = getApiBase();
