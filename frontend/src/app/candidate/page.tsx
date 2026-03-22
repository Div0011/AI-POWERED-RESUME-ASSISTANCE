"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateHub() {
    const router = useRouter();
    useEffect(() => {
        router.push('/candidate/jobs');
    }, [router]);
    return null;
}
