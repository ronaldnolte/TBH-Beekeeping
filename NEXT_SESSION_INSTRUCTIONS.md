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

### 1. Enforce Read-Only Mode (Critical)
**Current State**: Mentors have `FOR ALL` access (Read/Write) to shared apiaries via the new RLS scripts.
- **Goal**: Restrict Mentors to **SELECT ONLY** (Read-Only) and update UI to hide edit buttons.
- **Backend**: Split RLS policies into `FOR SELECT` (Viewers+Owners) and `FOR INSERT/UPDATE/DELETE` (Owners Only). DONE (Script provided).
- **Frontend**: Update `HiveDetails`, `ApiarySelectionPage`, `TaskList` to check ownership.
    - **User Preference**: Do NOT hide the buttons. The Mentor should see the interface as normal.
    - **Logic**: In `handleSave`, `delete`, or `add` functions, check `if (apiary.user_id !== user.id)`.
    - **Action**: If not owner, show an `alert("Only the apiary owner can make changes.")` and abort independent of the DB check.
    - result: Mentor sees full UI but is blocked with a clear message when trying to write.

### 2. Implement Mentor Comments
- **Feature**: Allow Mentors to leave comments/notes for Mentees without editing the actual records.
- **Plan**: Create a `mentor_comments` table linked to `hive_snapshots` or `inspections`.
- **UI**: Add a comment thread component in the details modal.

### 3. Verify Mobile Wrapper
- Ensure the new pages (Admin, Password Reset) work correctly inside the WebView wrapper.

### 4. Polish & Testing
- Search by email in Sharing Modal now works (requires SQL script).
- Verify "Inspection Conditions" modal design (Red borders, detailed stats).

### 3. "Gotchas" / Warnings ⚠️
*   **The "Chicken-and-Egg" Bug**: If you touch user roles, remember that users must be able to read their own role. Don't revert the fix in `fix_roles_policy.sql`.
*   **Mock Data**: Do not use mock data. The backend is live and working. Use real Supabase queries.
*   **Admin Email Lookup**: This relies on a protected RPC function `get_user_by_email_for_admin`. Don't try to query `auth.users` directly from the client.
*   **SQL Scripts**: The user has locally applied `fix_hives_rls_simple.sql`, `fix_tasks_rls_for_sharing.sql`, `allow_mentor_view_student.sql`. These are **NOT** in the main migration history yet. Consider consolidating them.

**Go get 'em.** 🐝
