# Code Review: Authentication Session Persistence Issue

**Reviewer:** Senior Software Engineer  
**Date:** December 21, 2025  
**Review Focus:** Login credentials not persisting between sessions

---

## Executive Summary

The application has **critical authentication issues** that prevent users from staying logged in between sessions. While the implementation includes some session persistence logic, there are **fundamental architectural problems** that prevent it from working correctly.

**Severity:** 🔴 **CRITICAL** - Users must log in every time they visit the application

---

## Root Cause Analysis

### 1. **Missing Auth Guard / Protected Routes** ⚠️ CRITICAL

**Location:** `apps/web/app/layout.tsx`

**Problem:** 
- There is **NO middleware or auth guard** protecting routes
- The root layout does not check authentication state
- Each page is individually responsible for checking auth (antipattern)

**Current Implementation:**
```tsx
// apps/web/app/layout.tsx - Lines 32-45
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}  {/* No auth check! */}
      </body>
    </html>
  );
}
```

**Impact:**
- Even if session persists, there's no centralized check to redirect logged-in users away from the login page
- Users see the login page every time they open the app, even if they have a valid session

**Recommended Fix:**
```tsx
// Create apps/web/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not logged in and trying to access protected routes
  if (!session && !req.nextUrl.pathname.startsWith('/')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // If user is logged in and on the login page, redirect to apiary selection
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/apiary-selection', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

### 2. **Login Page Doesn't Check for Existing Session** ⚠️ CRITICAL

**Location:** `apps/web/app/page.tsx`

**Problem:**
- The login page (`page.tsx`) never checks if the user is already logged in
- It relies solely on manual user interaction (entering credentials)
- No `useEffect` to check for existing session on mount

**Current Implementation:**
```tsx
// apps/web/app/page.tsx - Lines 18-26
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // ... no session check!
```

**Impact:**
- Even if the session cookie/localStorage exists, the login page doesn't check for it
- Users must manually log in every time

**Recommended Fix:**
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { navigateTo } from '../lib/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // Start as true
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // CHECK FOR EXISTING SESSION ON MOUNT
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('[Login] Existing session found, redirecting...');
        navigateTo('/apiary-selection');
      } else {
        console.log('[Login] No existing session, showing login form');
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-4xl">🐝</div>
      </div>
    );
  }

  // ... rest of component
}
```

---

### 3. **Supabase Storage Configuration Issues** ⚠️ MEDIUM

**Location:** `apps/web/lib/supabase.ts`

**Problems:**

#### 3a. Custom Cookie Storage Implementation is Buggy
**Lines 18-51:** The custom `cookieStorage` adapter has several issues:

```typescript
// Current implementation
const cookieStorage = {
    setItem: (key: string, value: string) => {
        if (typeof document === 'undefined') return;
        // Set cookie for 1 year
        document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Lax; Secure`;
```

**Issues:**
1. ❌ **Missing URL encoding** - Cookie values with special characters will fail
2. ❌ **Secure flag without HttpOnly** - Vulnerable to XSS attacks
3. ❌ **No domain specification** - May cause issues across subdomains
4. ⚠️ **Dual storage sync** - Storing in both cookies AND localStorage is unnecessary and can cause conflicts

**Impact:**
- Cookies may fail to persist with certain session tokens
- Security vulnerability (cookies accessible via JavaScript)
- Potential sync issues between cookie and localStorage

**Recommended Fix:**
```typescript
// RECOMMENDED: Use Supabase's built-in localStorage adapter instead
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use default localStorage - it's more reliable than cookies for SPAs
        // Cookies are better handled by server-side middleware
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
```

**OR** if you must use cookies (for SSR/middleware):
```typescript
// Install @supabase/auth-helpers-nextjs first
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

### 4. **No Root-Level Auth Provider** ⚠️ MEDIUM

**Location:** `apps/web/app/layout.tsx`

**Problem:**
- No global auth context provider
- Each component/page creates its own auth subscription
- Multiple `onAuthStateChange` listeners (performance issue)

**Current Pattern:**
```tsx
// Every component does this individually:
useEffect(() => {
    supabase.auth.getSession().then(...)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(...)
    return () => subscription.unsubscribe()
}, [])
```

**Impact:**
- Redundant auth checks
- Potential race conditions
- Worse performance (multiple listeners)

**Recommended Fix:**
```tsx
// Create apps/web/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
}>({
  session: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes (ONLY ONCE in the entire app)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

Then update `apps/web/app/layout.tsx`:
```tsx
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

### 5. **Environment Variables Hardcoded** 🔴 SECURITY ISSUE

**Location:** `apps/web/lib/supabase.ts` - Lines 3-4

**Problem:**
```typescript
const supabaseUrl = 'https://ayeqrbcvihztxbrxmrth.supabase.co';
const supabaseAnonKey = 'sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa';
```

**Issues:**
- ❌ Credentials committed to version control
- ❌ Can't use different environments (dev/staging/prod)
- ❌ Security risk if repo is public

**Recommended Fix:**
```typescript
// apps/web/lib/supabase.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}
```

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ayeqrbcvihztxbrxmrth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_YeFrbZkCUwM-cSAm3ZODrg_ie0j1Maa
```

---

### 6. **Meta Refresh Navigation (Hack)** ⚠️ LOW

**Location:** `apps/web/app/page.tsx` - Lines 67-80

**Problem:**
```typescript
// Wait longer for session storage AND browser password manager to save credentials
await new Promise(resolve => setTimeout(resolve, 2000));

// Use meta refresh for WebView-compatible navigation
const meta = document.createElement('meta');
meta.httpEquiv = 'refresh';
meta.content = '0; url=/apiary-selection';
document.getElementsByTagName('head')[0].appendChild(meta);
```

**Issues:**
- Using meta refresh is a hack/workaround
- 2 second delay is arbitrary and frustrating
- Not addressing the root cause (session not being checked on page load)

**Recommended Fix:**
Once you implement the fixes above, you can use normal navigation:
```typescript
if (error) throw error;

console.log('[Login] SignIn successful');
setMessage('Login successful! Redirecting...');

// Just redirect normally - the middleware will handle it
await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX
router.push('/apiary-selection');
```

---

## Summary of Required Changes

### Priority 1 - CRITICAL (Must Fix Immediately)

1. ✅ **Add Session Check to Login Page**
   - Add `useEffect` to check for existing session on mount
   - Auto-redirect to `/apiary-selection` if session exists
   
2. ✅ **Add Next.js Middleware for Route Protection**
   - Create `apps/web/middleware.ts`
   - Protect all routes except login page
   - Auto-redirect authenticated users away from login

### Priority 2 - HIGH (Should Fix Soon)

3. ✅ **Fix Supabase Storage Configuration**
   - Remove custom cookie storage
   - Use built-in localStorage OR proper auth-helpers
   
4. ✅ **Add Global Auth Provider**
   - Create `AuthContext` to manage session globally
   - Prevent multiple auth listeners

5. ✅ **Move Credentials to Environment Variables**
   - Remove hardcoded credentials
   - Use `.env.local` file

### Priority 3 - MEDIUM (Nice to Have)

6. ✅ **Remove Meta Refresh Hack**
   - Use proper `router.push()` once other fixes are in place

---

## Testing Checklist

After implementing fixes, verify:

- [ ] Fresh user can sign up successfully
- [ ] User can log in successfully
- [ ] **After logging in, closing browser, and reopening - user is still logged in** ✅
- [ ] Visiting root URL (`/`) auto-redirects to `/apiary-selection` if logged in
- [ ] Visiting protected routes when not logged in redirects to `/`
- [ ] Logout clears session and redirects to login page
- [ ] CANNOT access `/apiary-selection` without authentication

---

## Additional Recommendations

### Code Quality Improvements

1. **TypeScript Strictness**
   - Enable strict mode in `tsconfig.json`
   - Fix type safety issues

2. **Error Handling**
   - Add proper error boundaries
   - Implement toast notifications instead of `alert()`

3. **Loading States**
   - Show skeleton loaders instead of blank screens
   - Add optimistic UI updates

4. **Security**
   - Implement rate limiting on auth endpoints
   - Add CAPTCHA for signup/login
   - Enable Supabase RLS (Row Level Security) policies

---

## Conclusion

The primary issue is **architectural**: the app lacks fundamental auth guards and session checking. The custom cookie implementation and lack of centralized auth state management compound the problem.

**Estimated Fix Time:** 2-4 hours for a mid-level developer

**Impact of Fixes:** Users will stay logged in between sessions, drastically improving UX

The developer showed good understanding of Supabase auth basics, but missed critical Next.js patterns for session persistence and route protection. This is a common mistake for developers new to modern web frameworks.

---

**Reviewed by:** Senior Software Engineer  
**Next Steps:** Implement Priority 1 fixes first, then test thoroughly before moving to Priority 2
