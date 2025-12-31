# NEXT SESSION INSTRUCTIONS
**CRITICAL CONTEXT FOR THE NEXT AGENT.**
**READ THIS FILE IMMEDIATELY.**

## Status: "Mentor" Feature Implementation (Mid-Stream)
We are in the middle of building the "Mentor Delegation" feature.

### 1. What is DONE ✅
*   **Database**: Tables `mentor_profiles`, `apiary_shares`, `user_roles` are created in Production (`beta.beektools.com`).
*   **Security**: RLS Policies are applied.
    *   *Note*: We fixed a generic recursion bug in `check_infinite_recursion_v2.sql`. **Do not touch the policies unless you understand why `SECURITY DEFINER` was used.**
*   **Admin UI**: We have a working Admin Dashboard at `/admin/mentors`.
    *   *Credential*: `ron.nolte+admin@gmail.com` is the Master Admin.
    *   *Result*: The **User** (Ron's main account) has been successfully promoted to "Mentor" status.

### 2. What is YOUR JOB 🛠️
You are now the **Frontend Developer**.
Your task is to allow a Standard User (Mentee) to share their Apiary with a Mentor.

#### Task A: Build "Share Apiary" UI
1.  **Modify**: `apps/web/app/apiary-selection/page.tsx` (Use the "Manage Apiaries" view).
2.  **Add**: A "Share" button next to "Edit/Delete".
3.  **Create**: `components/ShareApiaryModal.tsx`.
    *   **Logic**:
        *   List mentors (Query `mentor_profiles`).
        *   User selects one.
        *   Click "Grant Access".
        *   Insert row into `apiary_shares` (`apiary_id`, `viewer_id`=mentor, `owner_id`=me).

#### Task B: Update Apiary List
1.  **Modify**: `apps/web/app/apiary-selection/page.tsx`.
2.  **Fetch**: Change the main query to fetch "My Apiaries" OR "Shared Apiaries".
    *   *Hint*: Secure RPC `check_hive_access` handles the permission, but listing them requires a joined query or a separate "Shared with Me" query.
    *   *Recommendation*: Do a separate query for clean UI separation.
    *   `supabase.from('apiary_shares').select('*, apiary:apiaries(*)')`

### 3. "Gotchas" / Warnings ⚠️
*   **The "Chicken-and-Egg" Bug**: If you touch user roles, remember that users must be able to read their own role. Don't revert the fix in `fix_roles_policy.sql`.
*   **Mock Data**: Do not use mock data. The backend is live and working. Use real Supabase queries.
*   **Admin Email Lookup**: This relies on a protected RPC function `get_user_by_email_for_admin`. Don't try to query `auth.users` directly from the client.

**Go get 'em.** 🐝
