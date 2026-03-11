# Deployment Checklist v1.0.8

## Pre-Build Testing

### Web App Testing
1. [ ] Start web dev server: `cd apps/web && npm run dev`
2. [ ] Test hive creation (create a new hive in an apiary)
   - Verify it saves successfully
   - Verify it appears in the hive list
3. [ ] Test inspection date editing
   - Create an inspection
   - Edit the inspection date
   - Verify the date displays correctly (not one day off)
4. [ ] Test intervention date editing
   - Create an intervention
   - Edit the intervention date
   - Verify the date displays correctly
5. [ ] Test session persistence
   - Log in
   - Close browser
   - Reopen browser to the app URL
   - Verify you're still logged in

### Tablet UI Testing
6. [ ] Open browser dev tools
7. [ ] Set viewport to tablet size (e.g., iPad: 768x1024)
8. [ ] Verify hive snapshots/bar visualizer appears larger than on phone size
9. [ ] Verify bars are approximately 25% larger (should be noticeable)

## Build Process

### 1. Install Required Package
```bash
cd apps/mobile
npm install expo-build-properties
```

### 2. Build Android App Bundle
```bash
# From apps/mobile directory
eas build --platform android --profile production
```

This will:
- Use the new `app.config.js` instead of `app.json`
- Apply the expo-build-properties plugin for better tablet support
- Create version 1.0.8 (versionCode 11)
- Generate an AAB file

### 3. Download the AAB
- Wait for the build to complete (check `eas build:list`)
- Download the `.aab` file from the EAS Build page or use:
  ```bash
  eas build:download --platform android --latest
  ```

## Google Play Console Upload

### 1. Create New Release
1. Go to: https://play.google.com/console
2. Select "TBH Beekeeper" app
3. Navigate to: **Release → Production → Create new release**

### 2. Upload AAB
1. Upload the downloaded `.aab` file
2. Wait for Google Play to process it

### 3. Check Device Compatibility
**IMPORTANT**: Before finalizing the release:
1. Click on "View supported devices" or go to **Release → Device catalog**
2. **Search for your Samsung Galaxy S8 tablet**
3. Check if it's listed as supported
4. If NOT supported:
   - Note the reason (usually shown in the catalog)
   - Take a screenshot
   - We may need to adjust the manifest further

### 4. Release Notes
```
Version 1.0.8 - Bug Fixes & Improvements

Fixed Issues:
• Fixed hive creation failing to save records
• Corrected date display for inspections and interventions (was showing one day off)
• Improved session persistence - you should stay logged in between app sessions
• Made hive snapshots 25% larger on tablet devices for better visibility
• Enhanced tablet compatibility configuration

If you experience any issues, please contact support.
```

### 5. Finalize Release
1. Review all details
2. Click "Review release"
3. Click "Start rollout to Production"

## Post-Release Verification

### On Phone
1. [ ] Wait for the update to be available (can take a few hours)
2. [ ] Update the app from Google Play
3. [ ] Verify version shows 1.0.8
4. [ ] Test hive creation
5. [ ] Test date editing
6. [ ] Close app and reopen - verify session persists

### On Tablet
1. [ ] Try to install directly from Google Play Store on tablet
2. [ ] If it appears: Install and test all features
3. [ ] If it doesn't appear:
   - Try the remote install method from phone (as before)
   - Document the issue
   - Check Google Play Console for device catalog info

## Tablet Installation Troubleshooting

If the tablet still won't show the app:

### Check Google Play Console
1. Go to: **Release → Device catalog**
2. Filter by "Tablets"
3. Find Samsung Galaxy S8 tablet in the list
4. Check the "Excluded" column - it should show the reason

### Common Exclusion Reasons:
- **Screen Size**: Min/max screen size requirements
- **Features**: Required hardware features the tablet doesn't have
- **API Level**: Android version too old/new
- **ABI**: CPU architecture mismatch

### Next Steps if Still Excluded:
1. Create a custom Expo config plugin to modify AndroidManifest.xml
2. Add specific `<supports-screens>` declarations
3. Review and remove any `<uses-feature android:required="true">` that might exclude tablets
4. Consider creating a separate APK for tablets if needed

## Files Changed in This Release

- ✅ `apps/web/components/HiveForm.tsx` - Added user_id to hive creation
- ✅ `apps/web/components/InspectionForm.tsx` - Fixed date handling
- ✅ `apps/web/components/InterventionForm.tsx` - Fixed date handling
- ✅ `apps/web/lib/supabase.ts` - Added PKCE auth flow
- ✅ `apps/web/components/BarVisualizer.tsx` - Made bars larger on tablets
- ✅ `apps/mobile/app.config.js` - New config with tablet support
- ✅ `apps/mobile/package.json` - Should add expo-build-properties

## Rollback Plan

If critical issues are found:
1. Go to Google Play Console
2. Navigate to: **Release → Production → Releases**
3. Click "Halt rollout" or "Create halted rollout"
4. Investigate the issue
5. Fix and create version 1.0.9

## Support Contacts

- Developer: [Your email]
- Google Play Console: https://play.google.com/console
- Expo EAS: https://expo.dev/accounts/[your-account]/projects/tbh-beekeeper
