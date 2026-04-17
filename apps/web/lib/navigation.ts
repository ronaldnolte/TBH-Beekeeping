// WebView-compatible navigation helper
// window.location.href crashes WebView after authentication.
// This module stores a reference to Next.js router.push and uses it instead.

let routerPush: ((url: string) => void) | null = null;

// Called once from AuthProvider to register the Next.js router
export function setRouterPush(push: (url: string) => void) {
    routerPush = push;
}

// Use this everywhere instead of window.location.href
export function navigateTo(url: string) {
    if (routerPush) {
        routerPush(url);
    } else {
        // Fallback for cases where router isn't registered yet
        window.location.href = url;
    }
}
