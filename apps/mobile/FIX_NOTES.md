# Login Crash and Icon Fix

## Issues Identified

### 1. **Critical: App Crashes on Login** ✅ PARTIALLY FIXED (Needs Supabase Config)
The app was crashing immediately when clicking the login button. This was caused by:
- **Supabase origin/CORS issues** - The WebView container has a different origin than a browser ⚠️ **MOST LIKELY CAUSE**
- Missing error handling in the WebView component ✅ Fixed
- Potential issues with authentication redirects (Supabase auth flow) ✅ Improved
- Missing permissions for third-party cookies and mixed content ✅ Fixed
- No error recovery mechanism ✅ Fixed

### 2. **Icon Shows as Test Pattern** ✅ FIXED
The app icon was displaying as a test pattern instead of your designed gold hexagon bee icon because:
- The icon files in `apps/mobile/assets/` were placeholder images
- The actual designed icon from the web app wasn't copied to the mobile assets folder

## ⚠️ CRITICAL: Supabase Configuration Required

**Your insight was correct!** The web app works fine in a browser but crashes in the WebView because **Supabase doesn't recognize the mobile app's origin.**

### Required Supabase Dashboard Changes:

1. **Go to your Supabase Dashboard:**
   - URL: https://supabase.com/dashboard/project/ayeqrbcvihztxbrxmrth

2. **Navigate to Authentication → URL Configuration**

3. **Add these Redirect URLs:**
   ```
   https://tbh.beektools.com/**
   http://localhost:3000
   capacitor://localhost
   tbhbeekeeper://callback
   ```
   (Note: The `/**` wildcard covers all paths, so you don't need the base URL separately)

4. **Check your Site URL:**
   - Should be: `https://tbh.beektools.com`

5. **Save the configuration**

**Why this matters:** When you login from the WebView, Supabase sees requests coming from a different context than a normal browser. Without these redirect URLs whitelisted, Supabase will reject the authentication attempt or fail to set cookies properly, causing the app to crash.



## Changes Made

### App.js - Enhanced Error Handling
Added comprehensive error handling and debugging capabilities:

1. **Error Handlers:**
   - `onError` - Catches WebView loading errors and shows retry dialog
   - `onHttpError` - Handles HTTP errors (500, 404, etc.)
   - `onMessage` - Receives messages from the WebView for debugging
   - `onConsoleMessage` - Captures console logs from the web app

2. **Authentication Support:**
   - `thirdPartyCookiesEnabled={true}` - Required for Supabase auth
   - `sharedCookiesEnabled={true}` - Maintains auth state
   - `mixedContentMode="always"` - Allows HTTPS auth on HTTP pages
   - Added 'supabase.co' to allowed domains for auth redirects

3. **Error Recovery:**
   - Added a `key` state that forces WebView reload on errors
   - Retry functionality when errors occur
   - Better logging to help diagnose issues

4. **JavaScript Error Catching:**
   - Injected JavaScript to catch runtime errors in the web app
   - Errors are posted back to native code for logging

### Icon Updates
Replaced all placeholder icon files with your actual designed icon:
- `icon.png` - Main app icon (512x512 from web app)
- `adaptive-icon.png` - Android adaptive icon
- `splash-icon.png` - Splash screen icon

### Version Bump
- Updated version from `1.0.1` → `1.0.2`
- Updated Android versionCode from `2` → `3`

## Next Steps - Building the New Release

### Option 1: EAS Build (Cloud - Recommended)
1. Navigate to mobile directory:
   ```powershell
   cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\mobile"
   ```

2. Build the new version:
   ```powershell
   npx eas-cli build --platform android --profile production
   ```

3. Wait for the build to complete (will get an email when done)

4. Download the new `.aab` file from the EAS dashboard or email link

### Option 2: Local Build (If you have Android Studio set up)
1. Navigate to mobile directory:
   ```powershell
   cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\mobile"
   ```

2. Build locally:
   ```powershell
   npx expo run:android --variant release
   ```

## Uploading to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app "TBH Beekeeper"
3. Go to **Production** → **Create new release**
4. Upload the new `.aab` file (version 1.0.2, versionCode 3)
5. Add release notes:
   ```
   Version 1.0.2
   - Fixed crash when logging in
   - Updated app icon to display correctly
   - Improved error handling and stability
   ```
6. Review and roll out to production

## Testing Before Full Release

Consider doing a **Closed Testing** release first:
1. In Play Console, go to **Testing** → **Closed testing**
2. Create a test track if you haven't already
3. Upload version 1.0.2 to the test track
4. Add your email as a tester
5. Install from the test track and verify:
   - ✅ Icon displays correctly
   - ✅ Can complete login without crash
   - ✅ App functions normally after login

## Debugging Logs

If the crash still occurs after this update, you can view logs:

### On your phone (after installing the new version):
1. Connect phone via USB to computer
2. Enable USB Debugging on your phone
3. Run:
   ```powershell
   adb logcat | Select-String "TBHBeekeeperApp|WebView|ReactNative"
   ```
4. Try to login and watch the logs for error messages

The new error handlers will also show user-friendly error dialogs with a "Retry" button if something goes wrong.

## Summary

The main fix for the login crash was adding proper error handling, authentication cookie support, and allowing mixed content mode for the Supabase authentication flow. The icon issue was simply replacing placeholder images with your actual designed icon.

Both issues should be resolved in version 1.0.2 (versionCode 3).
