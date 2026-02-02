import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    const { pathname } = request.nextUrl;

    // 1. Redirect unauthenticated users to login
    if (!token && (pathname.startsWith('/recruiter') || pathname.startsWith('/candidate'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Role-based Access Control
    if (token && role === 'candidate' && pathname.startsWith('/recruiter')) {
        return NextResponse.redirect(new URL('/candidate/check', request.url));
    }

    if (token && role === 'recruiter' && pathname.startsWith('/candidate')) {
        return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/recruiter/:path*', '/candidate/:path*'],
};
