# Bug Fixes - Mobile App Issues
**Date:** December 20, 2025
**Version:** 1.0.4 (Preparation)

## Issues Addressed

### 1. ✅ FIXED: Crash on "Back to Apiary" Button
**Issue:** When viewing Hive Details and clicking "Back to Apiary", the app crashes.

**Root Cause:** The `HiveDetails.tsx` component was using Next.js `<Link>` component for navigation, which doesn't work properly in the WebView environment and causes the app to crash.

**Solution:**
- Replaced the `<Link>` component with a `<button>` that uses `onClick` handler
- Implemented `navigateTo()` function from `lib/navigation.ts` which uses meta refresh for WebView-compatible navigation
- This ensures smooth navigation without crashes

**Files Modified:**
- `apps/web/components/HiveDetails.tsx`
  - Added import: `import { navigateTo } from '../lib/navigation';`
  - Changed lines 184-189: Replaced Link with button using `onClick={() => navigateTo(\`/apiary/${hive.apiary_id}\`)}`

---

### 2. ✅ FIXED: Inconsistent Icon Placement
**Issue:** Delete icon was on the right for Inspections, but on the left (with Edit) for Interventions and Tasks.

**Solution:**
- Moved delete icon to the left side, next to the edit icon, in InspectionList
- Updated grid layout from `grid-cols-[50px_80px...]` to `grid-cols-[60px_80px...]` to accommodate both icons
- This creates a consistent UX across all three list types

**Files Modified:**
- `apps/web/components/InspectionList.tsx`
  - Line 65: Changed grid layout to `grid-cols-[60px_80px_90px_60px_60px_60px_60px_1fr]`
  - Lines 67-68: Added delete button next to edit button
  - Line 148: Updated header grid to match new layout
  - Removed lines 94-97: Old delete button column

**Before:**
- Inspections: [Edit] ... ... ... [Delete]
- Interventions: [Edit][Delete] ... ...
- Tasks: [Edit][Delete] ... ...

**After:**
- Inspections: [Edit][Delete] ... ...
- Interventions: [Edit][Delete] ... ...
- Tasks: [Edit][Delete] ... ...

---

### 3. ✅ IMPROVED: User ID (Email) Saving in Password Manager
**Issue:** The app doesn't save the user ID in the browser's password manager or its own cache, requiring re-entry each time.

**Root Cause:** Browser password managers need time to detect successful login and offer to save credentials. The quick navigation after login didn't give the browser enough time.

**Solution:**
- Increased the delay after successful login from 1000ms to 2000ms
- Added a success message ("Login successful! Redirecting...") so the user understands the delay
- This gives the browser's password manager sufficient time to detect the successful login and offer to save credentials

**Important Notes:**
- The login form already has proper `autocomplete` attributes (`email`, `current-password`)
- WebView has `domStorageEnabled={true}` and `sharedCookiesEnabled={true}` enabled
- Supabase is configured with `persistSession: true` and uses `localStorage`
- The browser password manager should now offer to save credentials on successful login

**Files Modified:**
- `apps/web/app/page.tsx`
  - Lines 64-68: Increased delay to 2000ms and added success message

---

### 4. ℹ️ NOTED: Tablet Installation Issue
**Issue:** App was not directly installable on tablet from Play Store listing.

**Status:** This was addressed in a previous conversation about tablet availability and Android manifest configuration. The issue was related to Play Store device compatibility settings.

---

## Testing Checklist

Before releasing this update, please test:

- [ ] **Navigation Test:** Go to Hive Details → Click "Back to Apiary" → Verify no crash
- [ ] **Icon Consistency:** 
  - [ ] Inspections list has Edit+Delete icons on left
  - [ ] Interventions list has Edit+Delete icons on left
  - [ ] Tasks list has Edit+Delete icons on left
- [ ] **Password Manager:**
  - [ ] Log out completely
  - [ ] Clear browser/app data
  - [ ] Login with credentials
  - [ ] Verify browser offers to "Save password"
  - [ ] Log out and log in again
  - [ ] Verify browser offers autofill

---

## Deployment Notes

1. These changes are in the **web app** (`apps/web/`), not the mobile wrapper
2. After deploying to Vercel, the mobile app will automatically use the updated code
3. No need to rebuild the Android app (AAB file) unless you make changes to `apps/mobile/`
4. Users will get the fixes on their next app launch (WebView loads latest from Vercel)

---

## Next Steps

1. Test the fixes locally: `cd apps/web && npm run dev`
2. Deploy to Vercel: `vercel --prod` or push to main branch
3. Test on mobile devices (phone and tablet)
4. If all tests pass, mark this version as stable
