import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log('[Middleware] Processing request:', req.nextUrl.pathname);

    // Check for Supabase auth token in cookies
    const authToken = req.cookies.get('supabase-auth-token')?.value;
    const hasSession = !!authToken;

    console.log('[Middleware] Session status:', hasSession ? 'Authenticated' : 'Not authenticated');

    const isAuthPage = req.nextUrl.pathname === '/';
    const isProtectedRoute = !isAuthPage &&
        !req.nextUrl.pathname.startsWith('/_next') &&
        !req.nextUrl.pathname.startsWith('/api') &&
        !req.nextUrl.pathname.includes('.');

    // Redirect unauthenticated users to login page
    if (!hasSession && isProtectedRoute) {
        console.log('[Middleware] Redirecting to login - no session');
        const redirectUrl = new URL('/', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from login page
    if (hasSession && isAuthPage) {
        console.log('[Middleware] Redirecting to apiary-selection - already authenticated');
        const redirectUrl = new URL('/apiary-selection', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    ],
};
