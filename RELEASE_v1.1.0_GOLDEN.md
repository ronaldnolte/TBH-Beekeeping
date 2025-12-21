# Release v1.1.0 - The "Golden" Build 🏆

## Overview
This release combines all fixes and introduces a major architectural change for session persistence.

## 🛠️ Key Fixes Included
### 1. Native Session Persistence (The Login Fix)
- **Problem**: Android WebView wipes cookies/localStorage when the app is swiped closed.
- **Fix**: Added `AsyncStorage` (Native Bridge). The app now saves your session to the phone's physical storage and restores it on launch.
- **Verification**: You should stay logged in even after force-closing the app.

### 2. Tablet Installation (Direct Install)
- **Problem**: Play Store didn't allow direct install on tablets.
- **Fix**: `app.json` updated with `intentFilters` and permissions (`INTERNET`, `ACCESS_NETWORK_STATE`).
- **Verification**: Should be installable directly from Play Store on Galaxy Tab S8.

### 3. Visual & Data Fixes (Web-Side)
*These are already live but work best with this app version.*
- **History Snapshots**: Increased size to `w-4` (16px) on tablets.
- **Main Bars**: Adjusted to `w-10` (Moderate).
- **Date Fixes**: Inspections/Interventions show correct dates.
- **Hive Creation**: Database errors resolved.

## Deployment Steps
1. **Download v1.1.0 AAB** from Expo.
2. **Upload to Google Play** (Production Release).
3. **Wait for Review** (usually fast for updates).
4. **Update App on Tablet**.

## Version History
- **v1.0.8**: Web fixes only (Native config reverted by mistake).
- **v1.0.9**: Tablet Install fix (but missed the Login Persistence fix).
- **v1.1.0**: **ALL FIXES** (Tablet Install + Native Login Persistence).
