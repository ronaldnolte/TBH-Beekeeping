// WebView-compatible navigation helper
// window.location.href crashes WebView's native CookieManager.
// This module stores a reference to Next.js router.push and uses it instead.

let routerPush: ((url: string) => void) | null = null;

// Called once from AuthProvider to register the Next.js router
export function setRouterPush(push: (url: string) => void) {
    routerPush = push;
    console.log('[navigateTo] Router registered');
}

// Use this everywhere instead of window.location.href
export function navigateTo(url: string) {
    if (routerPush) {
        console.log('[navigateTo] Using router.push for:', url);
        routerPush(url);
    } else {
        console.error('[navigateTo] routerPush is NULL - cannot navigate safely');
        // DO NOT use window.location.href — it crashes Android WebViews.
        // Show an alert in WebView so we can see this is happening.
        if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
            alert('Navigation error: router not ready. Please restart the app.\nTarget: ' + url);
        } else {
            // Regular browser — safe to use window.location.href
            window.location.href = url;
        }
    }
}
