'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { navigateTo } from '../lib/navigation';

// Type declaration for React Native WebView
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}


export default function LoginPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    console.log('[Login] Component mounted, auth loading:', authLoading, 'session:', !!session);

    // If already authenticated, redirect to apiary selection
    if (!authLoading && session) {
      console.log('[Login] Session found, redirecting to apiary-selection');
      navigateTo('/apiary-selection');
    }
  }, [session, authLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Detect WebView
    const isWebView = /TBHBeekeeperApp/.test(navigator.userAgent);
    console.log('[Login] Is WebView:', isWebView);
    console.log('[Login] Starting authentication...');

    try {
      if (isSignUp) {
        console.log('[Login] Attempting sign up...');
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          console.error('[Login] SignUp error:', error);
          throw error;
        }
        console.log('[Login] SignUp successful');
        setMessage('Check your email for the confirmation link!');
      } else {
        console.log('[Login] Attempting sign in...');
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error('[Login] SignIn error:', error);
          throw error;
        }
        console.log('[Login] SignIn successful, session:', data.session ? 'Created' : 'None');

        // Show success message
        setMessage('Login successful! Redirecting...');

        // Use WebView-compatible navigation
        console.log('[Login] Redirecting to apiary-selection');
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigateTo('/apiary-selection');
      }
    } catch (err: any) {
      console.error('[Login] Auth error:', err);
      setError(err.message);

      // Report error to native app
      if (isWebView && window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'login_error',
          error: err.message,
          stack: err.stack
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking for existing session
  if (authLoading) {
    return (
      <div className="min-h-screen honeycomb-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">🐝</div>
          <p className="text-[#8B4513] text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen honeycomb-bg flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-[#E67E22]/20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src="/icon-512.png" alt="TBH Beekeeper Logo" className="w-32 h-32 object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A3C28]">TBH Beekeeper</h1>
          <p className="text-gray-600 text-sm mt-2">{isSignUp ? 'Create your account' : 'Welcome back'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B4513] text-white py-3 rounded-lg font-semibold hover:bg-[#723910] transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-[#8B4513] py-3 rounded-lg font-medium hover:underline text-sm"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>


    </div>
  );
}
