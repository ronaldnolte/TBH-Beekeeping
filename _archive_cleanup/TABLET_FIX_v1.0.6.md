# Tablet Compatibility Fix - Version 1.0.6

## Problem Identified

Your app was **not available for direct installation on tablets** from the Google Play Store.

### Root Cause
The `AndroidManifest.xml` had this line in the MainActivity configuration:
```xml
android:screenOrientation="portrait"
```

This **locked the app to portrait-only mode**, which causes Google Play to automatically **exclude tablets** from the compatible device list because:
1. Tablets are commonly used in landscape orientation
2. Google Play filters out portrait-only apps from tablet device listings
3. Portrait-only apps are considered "not optimized for tablets"

## Changes Made

### 1. Updated `app.json`
- **Version:** Changed from `1.0.5` → `1.0.6`
- **Version Code:** Changed from `8` → `9`
- **Added:** `"screenOrientation": "default"` in the Android configuration

This ensures Expo generates the AndroidManifest without portrait-only restrictions.

### 2. Fixed `AndroidManifest.xml`
**Location:** `apps/mobile/android/app/src/main/AndroidManifest.xml`

**Before (MainActivity line 18):**
```xml
<activity android:name=".MainActivity" 
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode" 
  android:launchMode="singleTask" 
  android:windowSoftInputMode="adjustResize" 
  android:theme="@style/Theme.App.SplashScreen" 
  android:exported="true" 
  android:screenOrientation="portrait">  ← THIS WAS THE PROBLEM
```

**After:**
```xml
<activity android:name=".MainActivity" 
  android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode" 
  android:launchMode="singleTask" 
  android:windowSoftInputMode="adjustResize" 
  android:theme="@style/Theme.App.SplashScreen" 
  android:exported="true">  ← REMOVED android:screenOrientation="portrait"
```

## What This Means

✅ **The app will now support all orientations:**
- Portrait on phones
-  on tablets
- Landscape on tablets
- Portrait on tablets

✅ **Google Play will now:**
- List the app as compatible with tablets
- Allow direct installation from tablets
- Show the app in tablet search results

⚠️ **Note:** Your web app (`apps/web`) already handles responsive layouts, so it will work perfectly in both portrait and landscape modes.

## Next Steps

### 1. Build a New AAB (App Bundle)

Since you're out of EAS Build cloud builds, you'll need to build locally OR purchase more EAS builds.

#### Option A: Build Locally
```bash
cd apps/mobile

# Clean the build
npx expo prebuild --clean

# Build AAB locally (requires Android Studio & SDK)
cd android
./gradlew bundleRelease

# The AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

#### Option B: Use EAS Build (Requires Active Subscription)
```bash
cd apps/mobile
eas build --platform android --profile production
```

### 2. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app "TBH Beekeeper"
3. Go to **Release → Production**
4. Click **Create new release**
5. Upload the new `.aab` file (version 1.0.6, version code 9)
6. Add release notes:
   ```
   Version 1.0.6 Changes:
   - Fixed tablet compatibility - app can now be installed directly on tablets
   - Fixed crash when navigating back from Hive Details
   - Improved UI consistency across inspection lists
   - Enhanced password manager support for easier login
   ```
7. Review and submit for review

### 3. Google Play Review Timeline
- **Review time:** Usually 1-3 days
- **Once approved:** The app will be available for direct installation on tablets

### 4. Test Before Submitting (Recommended)
If you can build locally, test the AAB on your tablet before uploading to Play Store:
```bash
# Install the AAB on your connected tablet
bundletool build-apks --bundle=app-release.aab --output=app.apks --mode=universal
bundletool install-apks --apks=app.apks
```

## Why This Happens

This is a common issue when:
1. An app is initially designed for phones only
2. Expo's default templates sometimes set portrait orientation
3. The AndroidManifest is manually edited or generated with cached settings

## Verification

To verify the fix worked, after uploading the new version:
1. Open Google Play Console
2. Go to **Release → Setup → Advanced settings → Device catalog**
3. Check that tablets are now in the "Supported devices" list
4. Try installing from your tablet's Play Store app - it should now show the "Install" button

## Files Modified
- `apps/mobile/app.json` - Updated version and added screenOrientation config
- `apps/mobile/android/app/src/main/AndroidManifest.xml` - Removed portrait-only lock

## Additional Notes

- The web app changes (bug fixes from earlier) don't require a new Android build
- Those fixes will work immediately since the app loads the web content from Vercel
- This Android build is ONLY needed for the tablet compatibility fix

---

**Need help building?** Let me know if you need assistance with:
- Setting up local Android build environment
- Using bundletool for testing
- Purchasing EAS Build subscription
- Alternative build methods
