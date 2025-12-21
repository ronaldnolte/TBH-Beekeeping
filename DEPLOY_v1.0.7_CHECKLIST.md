# Release v1.0.7 - Deployment Checklist
**Date:** December 20, 2025, 10:13 PM
**Status:** 🔄 Build in progress

## What's Fixed in This Release

### 1. 🐛 Task Due Date Timezone Bug (NEW)
- **Problem:** When editing a task and changing the due date, it appeared one day earlier
- **Cause:** Date was stored as midnight UTC, displayed in local timezone (MST)
- **Fix:** Dates now stored at noon local time to prevent timezone shifts
- **File Changed:** `apps/web/components/TaskForm.tsx`

### 2. Previous Fixes (from v1.0.6)
- ✅ Tablet compatibility (orientation support)
- ✅ "Back to Apiary" navigation crash fix
- ✅ Icon consistency across all lists
- ✅ Password manager compatibility improvements

## Version Details
- **Version Name:** 1.0.7
- **Version Code:** 10
- **Build Type:** Android App Bundle (.aab)
- **Built With:** Expo EAS (Production profile)

---

## 📋 DEPLOYMENT STEPS

### Step 1: Wait for Build to Complete
- [ ] Build completes successfully
- [ ] You receive email from Expo: "Your Android build is ready"
- [ ] Or check: https://expo.dev/accounts/rnolte/projects/tbh-beekeeper/builds

### Step 2: Download the .aab File
- [ ] Click the download link in the email OR
- [ ] Go to the Expo builds page and download the `.aab` file
- [ ] Save it somewhere you can find it (e.g., Downloads folder)

### Step 3: Verify Web App is Deployed
- [ ] Open: https://tbh.beektools.com
- [ ] Log in
- [ ] Navigate to a hive and check Tasks
- [ ] Edit a task and change the due date
- [ ] Verify the date stays correct (doesn't shift by one day)

### Step 4: Upload to Google Play Console
- [ ] Go to: https://play.google.com/console
- [ ] Select "TBH Beekeeper" app
- [ ] Navigate to: **Release → Production → Create new release**
- [ ] Upload the new `.aab` file (v1.0.7, versionCode 10)
- [ ] Review the release notes (optional - add "Bug fixes and improvements")
- [ ] Click **"Review release"**
- [ ] Click **"Start rollout to Production"**

### Step 5: Wait for Google Review
- [ ] Google will review the app (usually 1-3 days)
- [ ] You'll get an email when it's approved
- [ ] Once approved, update will roll out to users automatically

---

## 🧪 Testing After Release (Tomorrow)

### On Your Phone
- [ ] Update the app from Play Store
- [ ] Login
- [ ] Navigate to a hive
- [ ] Click "Back to Apiary" - should work without crash ✅
- [ ] Edit a task, change the due date, save it
- [ ] Verify date displays correctly (no one-day shift) ✅

### On Your Tablet
- [ ] Search for "TBH Beekeeper" in Play Store
- [ ] Verify "Install" button appears (not greyed out) ✅
- [ ] Install and test

---

## 📝 Quick Reference

**Google Play Console:** https://play.google.com/console  
**Expo Builds:** https://expo.dev/accounts/rnolte/projects/tbh-beekeeper/builds  
**Web App:** https://tbh.beektools.com  
**Vercel Dashboard:** https://vercel.com (for web deployment status)

---

## Git Commits (for reference)
1. `b57d54f` - Release v1.0.6 (tablet fix + web improvements)
2. `c4deb5c` - Fix task due date timezone offset bug
3. `7734cf5` - Bump version to 1.0.7 for new release

All changes are pushed to GitHub on branch `main`.

---

**Status:** Once the EAS build completes, just follow Steps 1-4 above and you're done! 🎉
