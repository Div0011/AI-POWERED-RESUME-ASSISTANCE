"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectToBuilder() {
    const router = useRouter();
    useEffect(() => {
        router.push('/candidate/builder');
    }, [router]);
    return null;
}
