# Pre-Deployment Testing Guide

## Quick Local Test (5 minutes)

### Test 1: Fresh Login
1. Open browser in **Incognito/Private mode**
2. Navigate to `http://localhost:3000`
3. Should see login page
4. Enter credentials and log in
5. Should redirect to apiary selection
6. ✅ **PASS** if redirected successfully

### Test 2: Session Persistence (CRITICAL)
1. While still logged in from Test 1
2. **Close the entire browser** (not just the tab)
3. **Reopen browser**
4. Navigate to `http://localhost:3000`
5. ✅ **PASS** if you're automatically redirected to `/apiary-selection` WITHOUT seeing login page
6. ❌ **FAIL** if you see the login page

### Test 3: Auto-Redirect When Logged In
1. While logged in, manually navigate to `http://localhost:3000`
2. ✅ **PASS** if immediately redirected to `/apiary-selection`
3. ❌ **FAIL** if you see the login form

### Test 4: Protected Routes
1. Log out using the "Log Out" button
2. Manually navigate to `http://localhost:3000/apiary-selection`
3. ✅ **PASS** if redirected back to login page
4. ❌ **FAIL** if you can access the page

### Test 5: Logout
1. Log in if not already
2. Click "Log Out" button
3. ✅ **PASS** if redirected to login page
4. Refresh the page
5. ✅ **PASS** if still on login page (not auto-redirected)

---

## Expected Console Logs

When opening the app while logged in, you should see:

```
[Supabase] Initializing client with URL: https://ayeqrbcvihztxbrxmrth.supabase.co
[Supabase] Running in WebView: false
[AuthProvider] Initializing...
[AuthProvider] Initial session: Found (User: your-email@example.com)
[Login] Component mounted, auth loading: false session: true
[Login] Session found, redirecting to apiary-selection
```

When opening the app while NOT logged in:

```
[Supabase] Initializing client with URL: https://ayeqrbcvihztxbrxmrth.supabase.co
[Supabase] Running in WebView: false
[AuthProvider] Initializing...
[AuthProvider] Initial session: None
[Login] Component mounted, auth loading: false session: false
```

---

## Post-Deployment Verification (Production)

After deploying to Vercel:

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Run all 5 tests above on the production site
3. Test on multiple devices:
   - Desktop browser
   - Mobile browser (Safari, Chrome)
   - Mobile app (WebView)

---

## Mobile App Testing

The mobile app should work without changes:

1. Open the mobile app
2. Log in
3. Close the app completely (swipe away from recent apps)
4. Reopen the app
5. ✅ **PASS** if you're still logged in

---

## Troubleshooting

### Issue: Still seeing login page after closing browser

**Cause:** Browser may be clearing localStorage

**Solutions:**
1. Check browser settings - ensure cookies/storage is not being cleared on exit
2. Try a different browser
3. Check browser console for errors

### Issue: Build fails on Vercel

**Cause:** Missing environment variables

**Solution:**
1. Go to Vercel → Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

### Issue: Middleware redirect loop

**Symptoms:** Browser keeps redirecting endlessly

**Solution:**
1. Clear browser cache and localStorage
2. Log out and log back in
3. Check console logs for middleware errors

---

## Success Criteria

✅ All 5 tests pass
✅ No console errors during auth flow
✅ Session persists after closing browser
✅ Auto-redirect works correctly
✅ Protected routes are actually protected

If all criteria are met: **READY TO DEPLOY** 🚀

---

## Running Local Dev Server

To test locally:

```bash
cd apps/web
npm run dev
```

Then open `http://localhost:3000`
