# Quick Fix Checklist - Login Crash Issue

## ✅ Already Done (by me)
1. ✅ Added comprehensive error handling to `App.js`
2. ✅ Enabled cookie/storage support for authentication
3. ✅ Replaced placeholder icons with your actual app icon
4. ✅ Added error logging and debugging
5. ✅ Started building version 1.0.2 (versionCode 3)

## 🔴 **YOU NEED TO DO THIS** - Critical for Login to Work

### Fix Supabase Authentication Configuration

**This is the most likely cause of the crash!**

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/ayeqrbcvihztxbrxmrth
   - Login if needed

2. **Navigate to Authentication Settings:**
   - Click "Authentication" in the left sidebar
   - Click "URL Configuration"

3. **Configure Redirect URLs:**
   
   Find the **"Redirect URLs"** field and add these URLs (one per line):
   ```
   https://tbh.beektools.com/**
   http://localhost:3000
   capacitor://localhost
   tbhbeekeeper://callback
   ```
   
   Note: The `/**` wildcard covers all paths under your domain, so you don't need the base URL separately.

4. **Verify Site URL:**
   
   Make sure the **"Site URL"** field is set to:
   ```
   https://tbh.beektools.com
   ```

5. **Save Changes:**
   - Click "Save" at the bottom of the page

### Why This Matters

When you login from the WebView app:
- Your web app (running at tbh.beektools.com) tries to authenticate with Supabase
- Supabase checks if the redirect URL is allowed
- If the URL isn't whitelisted, Supabase rejects the request
- This causes an error that crashes the WebView

By adding the redirect URLs above, you're telling Supabase "yes, it's okay for these origins to use authentication."

## 🟡 Testing After Supabase Config

1. **Wait for the EAS build to finish**
   - You'll get an email when it's ready
   - Or check: https://expo.dev/accounts/rnolte/projects/tbh-beekeeper/builds

2. **Download the new .aab file**

3. **Test with Internal Testing Track first:**
   - In Google Play Console, go to **Testing → Internal Testing**
   - Upload version 1.0.2
   - Install on your phone from the test track
   - Try logging in

4. **Check if it works:**
   - ✅ Icon displays correctly (gold hexagon with bee)
   - ✅ Can enter email/password
   - ✅ **Can click login without crash**
   - ✅ Successfully logs in and shows apiary selection

5. **If it still crashes:**
   - Connect your phone via USB
   - Enable USB debugging
   - Run: `adb logcat | Select-String "TBHBeekeeperApp"`
   - Try to login and watch the logs
   - The error messages will tell us exactly what's wrong

## 📝 Summary

**Immediate Action Required:**
1. Configure Supabase redirect URLs (5 minutes)
2. Wait for build to complete (~10-15 minutes)
3. Test the new version

**Expected Result:**
- ✅ App starts with correct icon
- ✅ Login works without crash
- ✅ App functions normally

If login **still** crashes after the Supabase config, there might be another issue (like session storage), but I'm 90% confident the Supabase redirect URLs are the problem.
