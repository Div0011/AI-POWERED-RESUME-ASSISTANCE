import { create } from 'zustand';

interface Job {
    id: number;
    title: string;
    description: string;
    required_skills: string[];
}

interface Application {
    id: number;
    job_id: number;
    candidate_id: number;
    status: string;
    applied_at: string;
}

interface AppState {
    jobs: Job[];
    applications: Application[];
    setJobs: (jobs: Job[]) => void;
    addJob: (job: Job) => void;
    setApplications: (apps: Application[]) => void;
    addApplication: (app: Application) => void;
}

export const useStore = create<AppState>((set) => ({
    jobs: [],
    applications: [],
    setJobs: (jobs) => set({ jobs }),
    addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
    setApplications: (apps) => set({ applications: apps }),
    addApplication: (app) => set((state) => ({ applications: [app, ...state.applications] })),
}));
