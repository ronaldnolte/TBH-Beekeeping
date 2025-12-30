# Session Persistence Issue - Mobile WebView

## Problem
Session does not persist when the mobile app is closed and reopened. User has to log in every time.

## Root Cause
WebView localStorage can be cleared between app restarts depending on Android's memory management. The native session bridge (AsyncStorage ←→ localStorage) isn't working reliably.

## Solutions

### Option 1: Rebuild Mobile App (REQUIRES GOOGLE PLAY UPDATE)
**File:** `apps/mobile/App.js`

Added these props to WebView:
```javascript
cacheEnabled={true}
incognito={false}
thirdPartyCookiesEnabled={true}
```

**Pros:**
- Should make localStorage more persistent
- Clean solution

**Cons:**
- Requires rebuilding the mobile app with EAS Build
- Requires uploading new AAB to Google Play
- Users won't get the fix until they update the app

### Option 2: Cookie-Based Session (NO APP UPDATE NEEDED) ⭐ RECOMMENDED
**File:** `apps/web/lib/supabase.ts`

Switch to cookie-based storage which is more reliable in WebView:

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: typeof window !== 'undefined' ? cookieStorage : undefined,
        storageKey: 'supabase-auth-token',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: 'pkce',
    },
});
```

Where `cookieStorage` is a custom adapter that saves to cookies instead of localStorage.

**Pros:**
- Web app change only - deploys immediately
- All users get the fix instantly (no app update needed)
- Cookies persist better in WebView than localStorage

**Cons:**
- Need to implement cookie storage adapter
- Slightly more complex

### Option 3: Hybrid Storage
Use BOTH localStorage AND cookies - whichever works:

```typescript
const hybridStorage = {
    getItem: (key) => {
        return (
            window.localStorage.getItem(key) ||
            getCookie(key)
        );
    },
    setItem: (key, value) => {
        window.localStorage.setItem(key, value);
        setCookie(key, value, 365); // Also save to cookie as backup
    },
    removeItem: (key) => {
        window.localStorage.removeItem(key);
        deleteCookie(key);
    }
};
```

**Pros:**
- Best of both worlds - very reliable
- Web app change only
- Fallback if one method fails

**Cons:**
- Most complex implementation

## Recommendation

**Use Option 2 or 3** - cookie-based or hybrid storage. This way:
1. No mobile app rebuild needed
2. Fix deploys via Vercel immediately  
3. All users get the fix without updating the app
4. More reliable in WebView environments

## Implementation Time
- Option 1: 20+ minutes (rebuild + upload)
- Option 2: 5 minutes
- Option 3: 10 minutes

## Next Steps
1. Implement cookie storage adapter
2. Test on web (should still work)
3. Deploy to Vercel
4. Test on mobile (should persist session)
