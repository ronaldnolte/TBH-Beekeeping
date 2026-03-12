# Smart Bar Cycling Feature

## Overview
Enhanced the bar status cycling logic to reflect natural bee behavior - sections of the same type tend to stay together (honey near honey, brood near brood, etc.).

## How It Works

### Before (Old Behavior)
When you clicked any bar, it would cycle through in a fixed order:
```
inactive → active → empty → brood → resource → follower_board → (repeat)
```

**Problem:** If you had a honey bar and wanted to expand it to the next bar, you had to click through multiple options to get to "resource" (honey).

### After (New Behavior)
When you click a bar, the cycling **starts with the value of the bar to its left** (if one exists), then continues through all other options.

## Examples

### Example 1: Expanding Honey Section
**Setup:**
- Bar 5: `resource` (honey)
- Bar 6: `empty` (you want to change this to honey)

**Old way:**
1. Click Bar 6 → `active`
2. Click Bar 6 → `brood`
3. Click Bar 6 → `resource` ✓ (3 clicks)

**New way:**
1. Click Bar 6 → `resource` ✓ (1 click!)

The cycle order becomes: `resource → inactive → active → empty → brood → follower_board`

---

### Example 2: Expanding Brood Section
**Setup:**
- Bar 3: `brood`
- Bar 4: `active` (you want to change this to brood)

**Old way:**
1. Click Bar 4 → `empty`
2. Click Bar 4 → `brood` ✓ (2 clicks)

**New way:**
1. Click Bar 4 → `brood` ✓ (1 click!)

The cycle order becomes: `brood → inactive → active → empty → resource → follower_board`

---

### Example 3: Harvesting Honey (Converting to Empty)
**Setup:**
- Bar 7: `resource` (honey)
- Bar 8: `resource` (you just harvested this honey)

**Old way:**
1. Click Bar 8 → `follower_board`
2. Click Bar 8 → `inactive`
3. Click Bar 8 → `active`
4. Click Bar 8 → `empty` ✓ (4 clicks)

**New way:**
1. Click Bar 8 → `resource` (first cycle shows left bar's value)
2. Click Bar 8 → `inactive`
3. Click Bar 8 → `active`
4. Click Bar 8 → `empty` ✓ (4 clicks)

Still need to click through, but this is less common than expanding sections.

---

### Example 4: Leftmost Bar (No Left Neighbor)
**Setup:**
- Bar 1: `inactive` (no bar to the left)

**Behavior:**
Uses the standard cycling order since there's no left bar to reference:
`inactive → active → empty → brood → resource → follower_board`

---

## Technical Details

### Implementation
The logic checks for a bar at `position - 1`:
- **If found AND different from current status:** Reorders the cycle to start with the left bar's value
- **If not found OR same as current status:** Uses standard cycling order

### Code Location
`apps/web/components/BarVisualizer.tsx` - `toggleBarStatus()` function (lines 48-90)

### Key Benefits
1. **Faster data entry** - Most common action (expanding sections) is now 1 click instead of 2-4
2. **Intuitive UX** - Reflects natural bee behavior
3. **Still flexible** - All options remain available by continuing to click
4. **Non-breaking** - Existing functionality preserved

---

## User Experience Impact

### Common Workflows Improved

| Action | Before | After | Time Saved |
|--------|--------|-------|------------|
| Expand honey section | 3 clicks | 1 click | 66% faster |
| Expand brood section | 2 clicks | 1 click | 50% faster |
| Convert empty to brood | 1 click | 1 click | Same |
| Harvest honey (to empty) | 4 clicks | 4 clicks | Same |

### Edge Cases Handled
- ✅ Leftmost bar (no left neighbor) - uses standard cycle
- ✅ Left bar has same status - uses standard cycle
- ✅ Follower board positioning - still accessible
- ✅ All statuses remain available - just reordered

---

## Testing Checklist

- [ ] Test expanding honey section (resource → resource)
- [ ] Test expanding brood section (brood → brood)
- [ ] Test leftmost bar (position 1) - should work normally
- [ ] Test changing from left bar's value to something else (can still cycle through all)
- [ ] Test in read-only mode (snapshots) - should not allow changes
- [ ] Test all 6 status types are still accessible

---

## Future Enhancements (Optional)

1. **Right-click for reverse cycle** - Cycle backwards through options
2. **Long-press menu** - Show all options at once
3. **Smart suggestions** - Highlight the most likely next status
4. **Keyboard shortcuts** - Number keys to set specific statuses
