# Release v1.0.6 - SUBMITTED TO GOOGLE PLAY
**Date:** December 20, 2025, 8:01 PM
**Status:** ✅ Uploaded to Google Play Console - Pending Review

## What Was Fixed

### 1. 🔧 Tablet Compatibility (PRIMARY FIX - Requires New Build)
- **Problem:** App could not be installed directly on tablets from Play Store
- **Cause:** `android:screenOrientation="portrait"` in AndroidManifest.xml excluded tablets
- **Fix:** Removed portrait-only lock, app now supports all orientations
- **Result:** Tablets will now show the "Install" button on Play Store

### 2. 🐛 Bug Fixes in Web App (Auto-included via WebView)
- **Fixed:** Crash when clicking "Back to Apiary" button (replaced Next.js Link with navigateTo())
- **Fixed:** Inconsistent icon placement - delete icons now on left for all lists
- **Improved:** Password manager support with 2-second delay after successful login

## Version Details
- **Version Name:** 1.0.6
- **Version Code:** 9
- **Build Type:** Android App Bundle (.aab)
- **Built With:** Expo EAS (Production profile)
- **Uploaded To:** Google Play Console - Production track

## What Happens Next

### Google Play Review Process
1. **Review Time:** Usually 1-3 days
2. **They Check:** App functionality, policy compliance, malware scan
3. **Notification:** You'll get email when approved/rejected

### After Approval
- Users will automatically get the update
- Tablets will see the app in Play Store and can install directly
- All the web app fixes are already live (via Vercel)

## Testing Checklist (Once Published)

### On Phone
- [ ] Login works (credentials should be saveable by password manager)
- [ ] Navigate to Hive Details
- [ ] Click "Back to Apiary" button - should NOT crash
- [ ] Check all lists (Inspections, Interventions, Tasks) - icons should be consistent

### On Tablet ⭐ NEW
- [ ] Open Play Store on tablet
- [ ] Search for "TBH Beekeeper"
- [ ] Verify "Install" button appears (not greyed out)
- [ ] Install app directly from tablet
- [ ] Test app works in both portrait and landscape orientations

## Files Changed Today

### Android Build Files
- `apps/mobile/app.json` - Updated version, added screenOrientation config
- `apps/mobile/android/app/src/main/AndroidManifest.xml` - Removed portrait lock

### Web App Files (Already Deployed to Vercel)
- `apps/web/components/HiveDetails.tsx` - Fixed navigation crash
- `apps/web/components/InspectionList.tsx` - Fixed icon consistency
- `apps/web/app/page.tsx` - Improved password manager timing

## Documentation Created
- `BUG_FIXES_v1.0.4.md` - Details of the 4 bug fixes
- `TABLET_FIX_v1.0.6.md` - Technical explanation of tablet compatibility fix
- `RELEASE_v1.0.6_SUMMARY.md` - This file

## Known Issues (If Any Found in Morning)
_Add any issues discovered during testing here_

---

## Quick Reference

**Google Play Console:** https://play.google.com/console
**Expo Builds:** https://expo.dev/accounts/rnolte/projects/tbh-beekeeper/builds
**Web App:** https://tbh.beektools.com

---

**Good work today!** The tablet fix is submitted and the web app improvements are already live. 🐝
