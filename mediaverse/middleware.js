import { NextResponse } from 'next/server';

const protectedRoutes = ['/explore', '/profile', '/search', '/settings'];

export function middleware(req) {
    const sessionToken = req.cookies.get('mv_token')?.value;
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

    if (isProtectedRoute && !sessionToken) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/explore/:path*',
        '/profile/:path*',
        '/search/:path*',
        '/settings/:path*',
    ],
};