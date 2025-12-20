# Building Locally (If Out of EAS Builds)

## Option 1: Wait for Next Month
- Expo free tier resets monthly
- You get 30 builds per month

## Option 2: Upgrade Expo Plan ($29/month)
- Go to: https://expo.dev/accounts/rnolte/settings/billing
- Upgrade to get unlimited builds

## Option 3: Build Locally with Android Studio

### Prerequisites:
1. Install Android Studio
2. Install Java JDK 17

### Build Steps:

```powershell
cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\mobile"

# Generate Android project files
npx expo prebuild --platform android

# Build the AAB file
cd android
.\gradlew bundleRelease

# The .aab file will be at:
# android\app\build\outputs\bundle\release\app-release.aab
```

### Upload to Google Play:
The `app-release.aab` file is what you upload to Google Play Console.

## Option 4: Use APK Instead (Testing Only)

For quick testing (not for Play Store):

```powershell
cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\mobile"
npx expo prebuild --platform android
cd android
.\gradlew assembleRelease
```

APK will be at: `android\app\build\outputs\apk\release\app-release.apk`
You can install this directly on your phone via USB.

## Quick Fix for Now:

Since version 1.0.2 with the icon fixes already exists and you have it, you could:
1. Test that version first
2. If it still crashes (which it likely will), you'll know for sure it's the storage issue
3. Then decide whether to:
   - Wait for next month's EAS builds
   - Upgrade Expo
   - Build locally

The changes I made (incognito=false, setSupportMultipleWindows=false) are critical, but you can verify the current version still crashes first.
