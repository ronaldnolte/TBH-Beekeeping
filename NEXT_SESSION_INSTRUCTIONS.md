# NEXT SESSION INSTRUCTIONS
**CRITICAL CONTEXT FOR THE NEXT AGENT.**
**READ THIS FILE IMMEDIATELY.**

## Status: "Mentor" Feature Implementation (Mid-Stream)
We are in the middle of building the "Mentor Delegation" feature.

## Current Status
- **Date**: December 31, 2025
- **Environment**: `beta.beektools.com` (Develop branch)
- **Database**: Dev DB (Supabase)

## Completed Features
- [x] **Mentor Backend**: Tables `mentor_profiles`, `apiary_shares` created. RLS policies implemented.
- [x] **Admin UI**: `/admin/mentors` is fully functional with "Search Again", search logic, and integrated header.
- [x] **Auth**: Password Reset flow (Forgot -> Email -> Update) is robustly implemented with session verification.
- [x] **Sharing UI**: Users can search for mentors and share apiaries via `ShareApiaryModal`.
- [x] **Mentor View (List)**: Mentors can see shared apiaries in their dashboard dropdown (via "Show Shared" toggle).
- [x] **Intervention Types**: Added "Honey Harvest" and fixed build issues.

## Immediate Next Steps (Priority)

### 1. Implement Read-Only Mode for Shared Apiaries
**Critical Task**: Currently, mentors can access shared apiaries, but the UI might still show "Edit", "Delete", or "Add Task" buttons.
- **Goal**: Update `HiveDetails`, `ApiarySelectionPage`, and `TaskList` to check ownership.
- **Logic**:
  - Check if `apiary.user_id === current_user.id`.
  - If FALSE (it's shared), hide/disable:
    - Edit Apiary / Delete Apiary buttons.
    - Add Hive / Edit Hive buttons.
    - Add Log / Edit Log buttons (unless we decide mentors can add logs?).
    - Add Task (Mentors *should* probably be able to add tasks for students, but check requirements).

### 2. Verify Mobile Wrapper
- Ensure the new pages (Admin, Password Reset) work correctly inside the WebView wrapper if they are accessible there.

### 3. Polish & Testing
- create a test plan for Mentor-Mentee interaction.

### 3. "Gotchas" / Warnings ⚠️
*   **The "Chicken-and-Egg" Bug**: If you touch user roles, remember that users must be able to read their own role. Don't revert the fix in `fix_roles_policy.sql`.
*   **Mock Data**: Do not use mock data. The backend is live and working. Use real Supabase queries.
*   **Admin Email Lookup**: This relies on a protected RPC function `get_user_by_email_for_admin`. Don't try to query `auth.users` directly from the client.

**Go get 'em.** 🐝
