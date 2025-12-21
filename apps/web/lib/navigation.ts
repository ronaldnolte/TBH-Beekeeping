// WebView-compatible navigation helper
// Use meta refresh instead of router.push() for WebView compatibility
export function navigateTo(url: string) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'refresh';
    meta.content = `0; url=${url}`;
    document.getElementsByTagName('head')[0].appendChild(meta);
}
