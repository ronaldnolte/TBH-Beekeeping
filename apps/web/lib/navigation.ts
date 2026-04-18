// WebView-compatible navigation helper
// Stores a reference to Next.js router.push for use in non-component files.

let routerPush: ((url: string) => void) | null = null;

// Called once from AuthProvider to register the Next.js router
export function setRouterPush(push: (url: string) => void) {
    routerPush = push;
}

// Standard navigation helper
export function navigateTo(url: string) {
    if (routerPush) {
        routerPush(url);
    } else {
        // Fallback for when router isn't initialized yet
        if (typeof window !== 'undefined') {
            window.location.href = url;
        }
    }
}
