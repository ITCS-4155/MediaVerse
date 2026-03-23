import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/search', '/settings'];

export function middleware(req) {
    const sessionToken = req.cookies.get('session')?.value;
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

    if (isProtectedRoute && !sessionToken) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/search/:path*',
        '/settings/:path*',
    ],
};