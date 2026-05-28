import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // List of legacy app sub-routes we want to decommission and redirect to home
    const legacyRoutes = [
        '/apiary',
        '/apiary-selection',
        '/hive',
        '/setup',
        '/langstroth-lab',
        '/help',
        '/debug',
        '/delete-account',
        '/auth'
    ];

    if (legacyRoutes.some(route => pathname.startsWith(route))) {
        console.log(`[Middleware] Decommissioned legacy route ${pathname}. Redirecting to portal.`);
        return NextResponse.redirect(new URL('/', req.url));
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
