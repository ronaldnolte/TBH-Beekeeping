---
description: Android app release to Google Play checklist
---

# Android App Release Checklist

## Pre-Release
- [ ] **Bump version** in `apps/mobile/app.json`:
  - Update `version` (e.g., "1.1.6" → "1.1.7")
  - Increment `android.versionCode` (must be higher than last uploaded)
- [ ] Commit changes: `git commit -m "Bump version to X.X.X (versionCode N)"`
- [ ] Push to main: `git push origin main`

## Build
// turbo
- [ ] Run EAS build:
  ```
  cd apps/mobile
  npx eas-cli build --platform android --profile production --non-interactive
  ```
- [ ] Wait for build to complete (~8-10 min)
- [ ] Download AAB from EAS dashboard

## Upload to Google Play
- [ ] Go to [Google Play Console](https://play.google.com/console)
- [ ] Select app → **Internal Testing** → **Create new release**
- [ ] Upload the `.aab` file
- [ ] Add release notes
- [ ] Review for errors/warnings
- [ ] Submit release

## Post-Release
- [ ] Verify testers received update notification
- [ ] Test on device from internal testing track

---

## Common Issues

### "versionCode already used"
Solution: Bump `android.versionCode` in `app.json` and rebuild

### "targetSdkVersion must be 35"
Solution: Ensure `app.json` has in `expo-build-properties`:
```json
"android": {
  "targetSdkVersion": 35,
  "compileSdkVersion": 35
}
```

### "minSdkVersion 21 but library requires 24"
Solution: Add `"minSdkVersion": 24` to `expo-build-properties`
