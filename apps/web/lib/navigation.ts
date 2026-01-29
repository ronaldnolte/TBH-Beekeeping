// WebView-compatible navigation helper
// Use meta refresh instead of router.push() for WebView compatibility
export function navigateTo(url: string) {
    // meta refresh was causing history issues (back button traps).
    // window.location.href performs a standard navigation which is safe for WebViews
    // and correctly pushes to the history stack.
    window.location.href = url;
}
