# Interactive Guided Tours - Contextual Help System

## Overview
Implemented an in-app guided tour system with overlay tooltips that walks users through each page step-by-step, highlighting specific elements and providing contextual instructions.

---

## 🎯 What Was Created

### 1. Tour Component (`components/Tour.tsx`)
**Reusable tour system with:**
- ✅ Overlay backdrop (darkens screen)
- ✅ Element highlighting (border + spotlight effect)
- ✅ Tooltip with content and navigation
- ✅ Progress bar showing step X of Y
- ✅ Previous/Next navigation buttons
- ✅ Skip tour option
- ✅ Auto-scrolling to highlighted elements
- ✅ Persistent state (remembers completed tours)
- ✅ Floating "?" help button

### 2. Tour Definitions (`lib/tourDefinitions.ts`)
**Pre-defined tours for each page:**
- **Login Page Tour** (2 steps)
  - Guest login button
  - Help tutorial link
  
- **Apiary Selection Tour** (7 steps)
  - Welcome message
  - Apiary dropdown selection
  - Manage apiaries button
  - Task list section
  - Add task button
  - Help link
  - Ready to start message

- **Apiary Detail Tour** (4 steps)
  - Add hive button
  - Weather widget
  - Hive list
  - Back navigation

- **Hive Detail Tour** (5 steps)
  - New inspection button
  - Hive snapshots (bar tracking)
  - Inspection history
  - Interventions tab
  - Tasks tab

---

## 🎨 Visual Features

### Highlight Effect
```
┌─────────────────────────┐
│  Darkened background    │
│  ┌─────────────────┐   │
│  │ 🔆 Highlighted  │   │ ← Glowing border
│  │    Element      │   │
│  └─────────────────┘   │
│         ↓               │
│    ┌──────────┐         │
│    │ Tooltip  │         │ ← Explanation
│    └──────────┘         │
└─────────────────────────┘
```

### Tooltip Design
- White background with orange border
- Progress indicator (Step X of Y)
- Progress bar visual
- Title and content text
- Previous/Next buttons
- Skip tour link

### Floating Help Button
- Fixed bottom-right position
- Orange circular button with "?"
- Always visible when tour is not active
- Clicking restarts the tour

---

## 🚀 How It Works

### User Experience

**First-Time User (Auto-Start):**
1. User logs in / lands on page
2. Tour automatically starts after 500ms
3. Screen darkens, first element highlighted
4. Tooltip appears with instructions
5. User clicks "Next →" to progress
6. Tour walks through all steps
7. User clicks "Finish! 🎉" on last step
8. Tour marked as completed (localStorage)
9. "?" button appears in bottom-right

**Returning User:**
1. Tour doesn't auto-start (already completed)
2. "?" button visible in bottom-right
3. Clicking "?" restarts the tour
4. Can skip tour anytime

---

## 💾 State Management

### LocalStorage Keys
```javascript
`tour_completed_${tourId}` = "true"
```

**Example:**
- `tour_completed_login-page` = "true"
- `tour_completed_apiary-selection` = "true"

### Reset Tours
To reset all tours for testing:
```javascript
localStorage.clear(); // Clears all completed tours
// OR
localStorage.removeItem('tour_completed_login-page'); // Reset specific tour
```

---

## 📋 Tour Step Properties

```typescript
interface TourStep {
  target: string;        // CSS selector (e.g., "#add-hive-button")
  title: string;         // Step title
  content: string;       // Instruction text
  placement?: string;    // 'top' | 'bottom' | 'left' | 'right'
  action?: () => void;   // Optional function to execute
}
```

**Example:**
```typescript
{
  target: '#guest-login-button',
  title: 'Try It Out! 👤',
  content: 'Click "Continue as Guest" to explore with demo data.',
  placement: 'top'
}
```

---

## 🔧 Integration

### Adding Tour to a New Page

**Step 1: Define Tour Steps**
Edit `lib/tourDefinitions.ts`:

```typescript
export const myPageTour: TourStep[] = [
  {
    target: '#my-element',
    title: 'Welcome!',
    content: 'This is what this element does...',
    placement: 'bottom'
  },
  // ... more steps
];
```

**Step 2: Add IDs to Elements**
Add `id` attributes to elements you want to highlight:

```tsx
<button id="my-element">Click Me</button>
```

**Step 3: Import and Add Tour Component**
```typescript
import { Tour } from '../components/Tour';
import { myPageTour } from '../lib/tourDefinitions';

// In your component JSX:
<Tour 
  tourId="my-page"
  steps={myPageTour}
  autoStart={true}
/>
```

---

## 🎯 Current Integration

### Pages with Tours:

1. **Login Page** (`app/page.tsx`)
   - Tour ID: `login-page`
   - Auto-start: YES
   - Steps: 2

2. **Apiary Selection** (`app/apiary-selection/page.tsx`)
   - Tour ID: `apiary-selection`
   - Auto-start: YES
   - Steps: 7

### Highlighted Elements:

**Login Page:**
- `#guest-login-button` - Guest login button
- `#help-tutorial-link` - Help link

**Apiary Selection:**
- `#apiary-select-dropdown` - Apiary dropdown
- `#manage-apiaries-button` - Manage button
- `#task-list-section` - Task list panel
- `#add-task-button` - New task button
- `#help-link` - Help navigation link

---

## 🎨 Customization

### Changing Colors
Edit `components/Tour.tsx`:

```tsx
// Highlight border color
border-[#E67E22]  // Change to your color

// Progress bar color
bg-[#E67E22]      // Change to your color

// Button colors
bg-[#E67E22]      // Primary button
bg-gray-200       // Secondary button
```

### Changing Tooltip Size
```tsx
className="... max-w-sm ..."  // Change max-width
```

### Changing Animation
```tsx
className="... animate-pulse ..."  // Change or remove animation
```

---

## 📱 Mobile Responsive

✅ Tours work on mobile devices
✅ Tooltips reposition on screen resize
✅ Touch-friendly button sizes
✅ Readable text on small screens

---

## 🐛 Troubleshooting

### Issue: Tour doesn't start
**Possible causes:**
- Tour already completed (check localStorage)
- Element not found (check ID exists)
- autoStart set to false

**Fix:**
```javascript
localStorage.removeItem('tour_completed_YOUR_TOUR_ID');
```

### Issue: Tooltip in wrong position
**Cause:** Element not yet rendered

**Fix:**
- Increase initial delay (500ms → 1000ms)
- Ensure element exists when tour starts

### Issue: Can't click highlighted element
**Cause:** Overlay blocks clicks

**Current:** Tour requires clicking "Next" button, not the element itself
**Future:** Could add click-through support

---

## 🚀 Future Enhancements

### Potential Additions:
- [ ] Click-through mode (click element to advance)
- [ ] Video/GIF support in tooltips
- [ ] Branching tours (different paths)
- [ ] Tour analytics (track completion rates)
- [ ] Multi-page tours (navigate between pages)
- [ ] Animated transitions
- [ ] Audio narration option
- [ ] Keyboard shortcuts (arrow keys to navigate)
- [ ] Tour progress persistence across sessions
- [ ] Admin panel to create tours visually

---

## ✅ Benefits

### For New Users:
- ✅ **Guided onboarding** - Learn by doing
- ✅ **Contextual help** - Right info, right time
- ✅ **Confidence building** - Clear instructions
- ✅ **Feature discovery** - Find hidden features

### For You:
- ✅ **Reduced support** - Users self-educate
- ✅ **Better adoption** - Users use more features
- ✅ **Consistent training** - Everyone gets same info
- ✅ **Easy updates** - Edit tooltour definitions

### For Test Users:
- ✅ **Quick start** - No reading manuals
- ✅ **Visual learning** - See highlighted elements
- ✅ **Self-paced** - Go at your own speed
- ✅ **Skippable** - Can skip if experienced

---

## 📊 Comparison

### vs. Static Help Page
| Feature | Guided Tour | Help Page |
|---------|-------------|-----------|
| Contextual | ✅ Yes | ❌ No |
| Interactive | ✅ Yes | ❌ No |
| Highlights elements | ✅ Yes | ❌ No |
| In-app | ✅ Yes | ⚠️ Separate page |
| Completion tracking | ✅ Yes | ❌ No |
| Auto-start | ✅ Yes | ❌ No |

**Best Approach:** Use BOTH
- Guided tours for onboarding
- Help page for reference

---

## 📁 Files Created/Modified

### New Files:
1. `apps/web/components/Tour.tsx` - Tour component
2. `apps/web/lib/tourDefinitions.ts` - Tour step definitions

### Modified Files:
1. `apps/web/app/page.tsx` - Added login page tour
2. `apps/web/app/apiary-selection/page.tsx` - Added apiary selection tour

---

## 🎉 Result

Users now get **contextual, step-by-step guidance** directly in the app! No need to read separate documentation - the app teaches itself!

Perfect for your test users to quickly understand features without asking questions.

---

**Status:** ✅ Ready to deploy
**Impact:** High (significantly improves onboarding)
**Maintenance:** Low (easy to update tour definitions)

---

*Created: December 24, 2025*
*Version: v1.2.0*
