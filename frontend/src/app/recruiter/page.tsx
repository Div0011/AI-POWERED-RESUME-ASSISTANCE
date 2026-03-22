"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterHub() {
    const router = useRouter();
    useEffect(() => {
        router.push('/recruiter/dashboard');
    }, [router]);
    return null;
}
