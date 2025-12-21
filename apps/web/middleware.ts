import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log('[Middleware] Processing request:', req.nextUrl.pathname);

    // TEMPORARILY DISABLED: Middleware auth checks cause WebView crashes
    // The issue: We use localStorage for session storage, but middleware
    // only has access to cookies. This causes a mismatch where:
    // 1. User logs in → session saved to localStorage
    // 2. Navigation happens
    // 3. Middleware checks cookies (empty) and redirects to login
    // 4. Conflict causes WebView crash
    //
    // SOLUTION: Client-side auth checks (AuthContext + useEffect) are sufficient
    // for protecting routes. Middleware auth can be re-enabled once we migrate
    // to server-side session handling with cookies.

    // For now, just log and allow all requests through
    console.log('[Middleware] Auth checks disabled - relying on client-side protection');

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
