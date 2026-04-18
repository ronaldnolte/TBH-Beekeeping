'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { navigateTo } from '../lib/navigation';
import { Tour } from '../components/Tour';
import { loginTour } from '../lib/tourDefinitions';
import { HomePage } from '../components/HomePage';
import { AppHeader } from '../components/AppHeader';
import ApiarySelectionPage from './apiary-selection/page';

export default function LoginPage() {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // App State: 'loading' | 'dashboard' | 'marketing' | 'login'
  const [appState, setAppState] = useState<'loading' | 'dashboard' | 'marketing' | 'login'>('loading');

  useEffect(() => {
    // Wait for BOTH auth and identity to be certain
    if (authLoading) return;

    const checkIdentity = () => {
      const isStandalone = typeof window !== 'undefined' && (
        window.matchMedia('(display-mode: standalone)').matches
        || (window.navigator as any).standalone === true
      );
      const isReturningUser = localStorage.getItem('beektools-returning-user') === 'true';
      const isWebView = /TBHBeekeeperApp/.test(navigator.userAgent) || (typeof window !== 'undefined' && (window as any).ReactNativeWebView);

      if (session) {
        setAppState('dashboard');
      } else if (isStandalone || isReturningUser || isWebView) {
        setAppState('login');
      } else {
        setAppState('marketing');
      }
    };

    // Small delay to ensure WebView bridge has time to inject
    const timer = setTimeout(checkIdentity, 200);
    return () => clearTimeout(timer);
  }, [session, authLoading]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
      
      localStorage.setItem('beektools-returning-user', 'true');
      if (!isSignUp) {
        setMessage('Login successful!');
        // No router.push needed - the 'session' change triggers the useEffect to show 'dashboard'
      } else {
        setMessage('Check your email for the confirmation link!');
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'Invalid credentials. If you are a new user, please switch to Sign Up.' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'guest@beektools.com',
        password: 'Guest2026#',
      });
      if (error) throw error;

      const { resetGuestAccount } = await import('../lib/guestReset');
      await resetGuestAccount();

      localStorage.setItem('beektools-returning-user', 'true');
      // No router.push needed
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. LOADING STATE
  if (appState === 'loading') {
    return (
      <div className="min-h-screen honeycomb-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">🐝</div>
          <p className="text-[#8B4513] text-lg font-bold">Initializing...</p>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD STATE (Zero-Navigation)
  if (appState === 'dashboard') {
    return <ApiarySelectionPage />;
  }

  // 3. MARKETING STATE
  if (appState === 'marketing') {
    return <HomePage onLaunchApp={() => setAppState('login')} />;
  }

  // 4. LOGIN STATE
  return (
    <div className="min-h-screen honeycomb-bg flex flex-col">
      <AppHeader title="Beektools" />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-[#E67E22]/20">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#4A3C28]">{isSignUp ? 'Create account' : 'Welcome back'}</h2>
            <p className="text-gray-600 text-xs mt-1">Sign in to manage your hives</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
          {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">{message}</div>}

          <form onSubmit={handleAuth} className="space-y-3" autoComplete="off">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E67E22] outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E67E22] outline-none"
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B4513] text-white py-3 rounded-lg font-bold hover:bg-[#723910] disabled:opacity-50 transition-all"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
            
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-[#8B4513] py-2 text-sm font-medium hover:underline"
            >
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-[#E67E22] font-medium transition-colors"
            >
              <span>Continue as Guest</span>
            </button>
          </div>
        </div>
      </div>
      <Tour tourId="login-page" steps={loginTour} autoStart={false} />
    </div>
  );
}
