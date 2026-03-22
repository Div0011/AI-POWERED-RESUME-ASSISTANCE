"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToATS() {
    const router = useRouter();
    useEffect(() => {
        router.push('/candidate/ats');
    }, [router]);
    return null;
}
