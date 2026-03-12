# UI Standardization - Delete Patterns

## Changes Made

Standardized the delete UI across all list components (Snapshots, Inspections, Interventions, Tasks) for consistency and better UX.

### Before (Inconsistent)

**Snapshots:**
- Delete button (×) on the **right**
- Used browser `confirm()` dialog (blue/system style)
- Clicking anywhere selected the snapshot

**Inspections/Interventions/Tasks:**
- Edit (✎) and Delete (×) buttons on the **left**
- Used custom Modal with red Delete button
- Had dedicated click areas

### After (Consistent)

**All Lists Now:**
- ✅ Delete button (×) consistently on the **left**
- ✅ Same custom Modal confirmation with red Delete button
- ✅ Consistent button styling (`text-gray-400 p-2 text-lg`)
- ✅ Clear separation between delete action and row click

## Benefits

1. **Muscle Memory** - Users learn one pattern, works everywhere
2. **Visual Consistency** - Same red delete confirmation modal
3. **Reduced Errors** - Delete button always in same place
4. **Better Accessibility** - Larger click targets for buttons vs inline ×
5. **Professional Feel** - Custom modal vs browser dialogs

## Files Changed

- `apps/web/components/HiveDetails.tsx` - Snapshot list UI

## Testing

After refresh, verify:
1. Delete button appears on left for snapshots
2. Clicking × shows custom modal (not browser confirm)
3. Delete button in modal is red
4. Cancel/Delete buttons work correctly
5. Clicking snapshot row (not delete button) still selects it
