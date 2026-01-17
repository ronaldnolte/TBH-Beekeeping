// Cookie-based storage adapter for Supabase
// This is more reliable than localStorage in WebView environments

const COOKIE_OPTIONS = {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax' as const,
};

function setCookie(name: string, value: string, options = COOKIE_OPTIONS): void {
    if (typeof document === 'undefined') return;

    const cookieValue = encodeURIComponent(value);
    const parts = [`${name}=${cookieValue}`];

    if (options.maxAge) {
        parts.push(`max-age=${options.maxAge}`);
    }
    if (options.path) {
        parts.push(`path=${options.path}`);
    }
    if (options.sameSite) {
        parts.push(`samesite=${options.sameSite}`);
    }

    document.cookie = parts.join('; ');
}

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

function deleteCookie(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0`;
}

// Supabase-compatible storage interface
export const cookieStorage = {
    getItem: (key: string): string | null => {
        console.log('[CookieStorage] Getting item:', key);
        const value = getCookie(key);
        console.log('[CookieStorage] Retrieved:', value ? 'Session found' : 'No session');
        return value;
    },

    setItem: (key: string, value: string): void => {
        console.log('[CookieStorage] Setting item:', key);

        let options = { ...COOKIE_OPTIONS };

        // Check if this is a guest session
        try {
            // Supabase sessions are JSON strings containing a 'user' object
            const session = JSON.parse(value);
            if (session?.user?.email === 'guest@beektools.com') {
                console.log('[CookieStorage] Guest session detected - using non-persistent session cookie');
                // By omitting max-age, the cookie becomes a "session cookie"
                // which expires when the browser/WebView is closed.
                const { maxAge, ...sessionOptions } = options;
                options = sessionOptions as any;
            }
        } catch (e) {
            // If parsing fails, just use default persistent options
            console.warn('[CookieStorage] Failed to parse session value during setItem:', e);
        }

        setCookie(key, value, options);
        console.log('[CookieStorage] Saved to cookie', options.maxAge ? '(Persistent)' : '(Session only)');
    },

    removeItem: (key: string): void => {
        console.log('[CookieStorage] Removing item:', key);
        deleteCookie(key);
        console.log('[CookieStorage] Removed from cookie');
    },
};
