# Debug Instructions - Login Crash Investigation

## Step 1: Check if Supabase Was Configured

**DID YOU DO THIS?** (If not, do it now!)
1. Go to: https://supabase.com/dashboard/project/ayeqrbcvihztxbrxmrth
2. Click **Authentication** → **URL Configuration**
3. In the **"Redirect URLs"** field, add these (one per line):
   ```
   https://tbh.beektools.com/**
   http://localhost:3000
   capacitor://localhost
   tbhbeekeeper://callback
   ```
4. Click **Save**
5. Try the app again

If you already did this and it's still crashing, continue to Step 2.

---

## Step 2: Get Error Logs from Your Phone

We need to see what error is actually happening. Follow these steps:

### A. Enable USB Debugging on Your Phone
1. Open **Settings** on your Android phone
2. Go to **About Phone**
3. Tap **Build Number** 7 times (enables Developer Mode)
4. Go back to **Settings** → **System** → **Developer Options**
5. Enable **USB Debugging**

### B. Connect Phone to Computer
1. Connect your phone via USB cable
2. On your phone, approve the "Allow USB debugging" prompt
3. Select "File Transfer" mode if asked

### C. Run ADB to Capture Logs
Open PowerShell on your computer and run:

```powershell
# Navigate to the mobile app directory
cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\mobile"

# Start capturing logs (this will show a live feed)
adb logcat *:E | Select-String "TBHBeekeeper|WebView|chromium|ReactNative|Supabase"
```

### D. Reproduce the Crash
1. With the logs running, open the app on your phone
2. Enter your username and password
3. Click Login
4. Watch the logs - you'll see the error right when it crashes
5. Copy the error messages and send them to me

---

## Step 3: Alternative - Check Network Requests

If ADB doesn't work, we can add more debugging to the web app:

1. **Open Chrome on your computer**
2. Go to: `chrome://inspect#devices`
3. Your phone should appear (if USB debugging is on)
4. Click **"inspect"** next to the WebView
5. This opens Chrome DevTools for your mobile app
6. Go to the **Console** tab
7. Try to login and watch for errors

---

## Most Likely Issues

Based on "immediate shutdown after entering credentials," here are the possibilities:

### 1. **Supabase Configuration** (80% likely)
- Redirect URLs not configured
- Fix: Add the URLs in Supabase dashboard

### 2. **Session Storage Issue** (15% likely)
- WebView can't save authentication cookies
- Error would show: "Unable to store session" or similar
- Fix: We may need to adjust storage settings

### 3. **React Router/Navigation Issue** (5% likely)
- Login succeeds but navigation to next page crashes
- Error would show in logs as navigation error
- Fix: Might need to update the web app's routing

---

## What to Send Me

Once you run the logs, send me:
1. **Did you configure Supabase?** (Yes/No)
2. **The error messages** from either:
   - ADB logcat output, OR
   - Chrome DevTools console
3. **What happens exactly:**
   - Does the login button respond?
   - Does the app freeze then close?
   - Is there any error message shown?

With the actual error logs, I can give you an exact fix instead of guessing!
