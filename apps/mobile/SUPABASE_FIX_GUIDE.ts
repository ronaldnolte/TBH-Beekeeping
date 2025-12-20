/**
 * Instructions for fixing the Supabase authentication crash in the mobile WebView
 * 
 * PROBLEM:
 * The app crashes when clicking login because Supabase requests from the WebView
 * are being treated differently than browser requests.
 * 
 * SOLUTION OPTIONS (in order of preference):
 */

// ============================================================================
// OPTION 1: Configure Supabase to Allow All Origins (Recommended for WebView)
// ============================================================================

/**
 * Go to your Supabase Dashboard:
 * 1. Visit: https://supabase.com/dashboard/project/ayeqrbcvihztxbrxmrth
 * 2. Go to Authentication → URL Configuration
 * 3. Under "Site URL" add: https://tbh.beektools.com
 * 4. Under "Redirect URLs" add:
 *    - https://tbh.beektools.com
 *    - https://tbh.beektools.com/**
 *    - capacitor://localhost (for mobile apps)
 *    - tbhbeekeeper://callback (custom scheme)
 * 5. Save the configuration
 * 
 * This ensures Supabase accepts authentication requests from your WebView.
 */

// ============================================================================
// OPTION 2: Add CORS Configuration to Web App (If needed)
// ============================================================================

/**
 * If the above doesn't work, you may need to add CORS headers to your Next.js app.
 * Create or update: apps/web/next.config.js
 */

const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // Or specify your mobile app's user agent
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization, apikey',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

// ============================================================================
// OPTION 3: Debug Logging in Web App (To see what's failing)
// ============================================================================

/**
 * Add this to apps/web/app/page.tsx in the handleAuth function
 * to see exactly what error is occurring:
 */

const handleAuthWithDebug = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Detect if we're in a WebView
    const isWebView = /TBHBeekeeperApp/.test(navigator.userAgent);
    console.log('Is WebView?', isWebView);
    console.log('User Agent:', navigator.userAgent);

    try {
        if (isSignUp) {
            console.log('Attempting signUp...');
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
            });
            console.log('SignUp Response:', { error, data });
            if (error) throw error;
            setMessage('Check your email for the confirmation link!');
        } else {
            console.log('Attempting signIn...');
            const { error, data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log('SignIn Response:', { error, data });
            if (error) throw error;

            // Add a small delay before navigation to ensure session is set
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log('Navigating to apiary-selection...');
            router.push('/apiary-selection');
        }
    } catch (err: any) {
        console.error('Auth Error:', err);
        setError(err.message || 'An unknown error occurred');

        // Post error back to native app for debugging
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'auth_error',
                error: err.message,
                stack: err.stack
            }));
        }
    } finally {
        setLoading(false);
    }
};

// ============================================================================
// OPTION 4: Add Error Boundary to Catch React Errors
// ============================================================================

/**
 * The crash might be happening after successful login when navigating.
 * Add this error boundary to apps/web/app/layout.tsx
 */

'use client';

import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error Boundary Caught:', error, errorInfo);

        // Send to native app
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'react_error',
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack
            }));
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style= {{ padding: '20px', textAlign: 'center' }
        }>
            <h2>Something went wrong </h2>
                < p > { this.state.error?.message } </p>
                < button onClick = {() => this.setState({ hasError: false, error: null })
    }>
        Try again
            </button>
            </div>
      );
    }

return this.props.children;
  }
}

// Wrap your app with this ErrorBoundary

// ============================================================================
// MOST LIKELY CAUSE
// ============================================================================

/**
 * After login succeeds, the web app tries to:
 * 1. Set cookies/localStorage for the session
 * 2. Navigate to /apiary-selection
 * 3. The new page tries to load user data
 * 
 * If the WebView doesn't allow proper cookie/storage access, the session
 * might not be preserved, causing errors on the next page.
 * 
 * The fixes we already added to App.js should help:
 * - domStorageEnabled={true}
 * - thirdPartyCookiesEnabled={true}
 * - sharedCookiesEnabled={true}
 * - cacheEnabled={true}
 * 
 * But you may also need to configure Supabase to accept the WebView origin.
 */

export { };
