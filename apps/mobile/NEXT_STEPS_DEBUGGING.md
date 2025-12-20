# Login Crash - Debugging Update

## What I Just Did

I added **extensive logging** to your web app to capture exactly where the crash is happening. This will help us identify the root cause.

### Changes Made:

#### 1. Updated `apps/web/app/page.tsx` (Login Page)
- Added console logs at every step of the login process:
  - "Starting authentication..."
  - "Attempting sign in..."
  - "SignIn successful..."
  - "Waiting for session storage..."
  - "Navigating to apiary-selection..."
- Added WebView detection
- Added 1-second delay after login to allow session to be stored
- Errors are now sent back to the native app via `postMessage`

#### 2. Updated `apps/web/hooks/useCurrentUser.ts`
- Added logging for session retrieval
- Added WebView detection
- Added error reporting to native app
- Will show if session is found or missing

## How to Test This:

### Option 1: Use Chrome DevTools (Easiest)

1. **On your computer, open Chrome**
2. Go to: `chrome://inspect#devices`
3. **Connect your phone via USB** (USB debugging enabled)
4. Your phone should appear in the device list
5. Find the WebView instance and click **"inspect"**
6. **Open the Console tab** in DevTools
7. **On your phone:** Try to login
8. **Watch the Console** - you'll see all the log messages
9. **Screenshot or copy the logs** and send them to me

This will show us exactly where it's failing!

### Option 2: Deploy to Vercel (If DevTools doesn't work)

If Chrome inspect doesn't work, you need to deploy the updated web app:

```powershell
cd "c:\Users\ronno\Antigravity\Beeks\TBH Beekeeper\apps\web"

#If you have Vercel CLI:
vercel --prod

# OR commit and push to trigger automatic deployment
git add .
git commit -m "Add debugging logs for WebView crash"
git push
```

Wait for deployment to finish, then test the mobile app again.

## What the Logs Will Tell Us:

The console logs will show one of these scenarios:

### Scenario A: Login Fails
```
[Login] Starting authentication...
[Login] Attempting sign in...
[Login] SignIn error: [ERROR MESSAGE HERE]
```
**Fix:** Auth configuration issue with Supabase

### Scenario B: Login Succeeds, Session Not Stored
```
[Login] SignIn successful, session: Created
[Login] Waiting for session storage...
[Login] Navigating to apiary-selection...
[useCurrentUser] Initial session: None  ← Problem here!
```
**Fix:** WebView storage issue - need to adjust how sessions are stored

### Scenario C: Navigation Crashes
```
[Login] SignIn successful...
[Login] Navigation triggered
[useCurrentUser] Initial session: Found
[Then crash with React/routing error]
```
**Fix:** Issue on the apiary-selection page, not with auth

### Scenario D: Everything Works in Logs But Still Crashes
```
All logs look good but app still closes
```
**Fix:** Native WebView crash, not web app issue - need to check native logs

## Next Steps:

1. **Try Chrome DevTools** (chrome://inspect#devices)
2. **Try to login and watch the console**
3. **Send me a screenshot or copy** of the console logs
4. With the exact error, I can give you a precise fix!

## If You Can't Access Chrome DevTools:

You can also:
- Deploy the new web app code to Vercel
- Try logging in from the mobile app
- The errors will be sent to the native app via `window.ReactNativeWebView.postMessage()`
- Check the native app logs in the WebView console handler we added earlier

The detailed logs will pinpoint the exact issue! 🐝
