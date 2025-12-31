# Architecture Plan: Mentor Delegation & Shared Access

## 1. Overview
This feature allows a Standard User ("Mentee") to securely delegate access to specific Apiaries to a Trusted User ("Mentor").
The goal is to facilitate teaching and remote monitoring without compromising account security or privacy. This uses a "Delegation" model (I share with you) rather than an "Admin" model (You take control of me).

## 2. Core Principles
1.  **Strict Opt-In**: Mentors must be explicitly flagged to appear in search results.
2.  **Privacy First**: Mentors' email addresses are **never** exposed to Mentees in the search list. Only `Display Name` and `Location/Bio` are visible.
3.  **Granular Access**: Sharing is done at the **Apiary** level. A Mentee can share one apiary while keeping another private.
4.  **Read-Only Default**: Initially, this access is Read-Only to preventing accidental data modification by the Mentor.

---

## 3. Database Schema Changes

### A. Modify `users` table
We need to flag who is a Mentor and provide public-safe profile fields.

```sql
ALTER TABLE users 
ADD COLUMN is_mentor BOOLEAN DEFAULT false,
ADD COLUMN mentor_location TEXT,  -- e.g. "Austin, TX"
ADD COLUMN mentor_bio TEXT;       -- e.g. "Certified TBH Instructor"
```

### B. New Table: `apiary_shares`
This link table defines who has access to what.

```sql
CREATE TABLE apiary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apiary_id UUID REFERENCES apiaries(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,  -- The Mentee
    viewer_id UUID REFERENCES users(id) ON DELETE CASCADE, -- The Mentor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate shares of same apiary to same person
    UNIQUE(apiary_id, viewer_id)
);
```

---

## 4. Security & Privacy Architecture (RLS)

### A. Protecting User Data (The "Mentor Directory")
We must ensuring that searching for mentors does not leak private data (emails) or random users' existence.

*   **Policy Rule**: `Users can view other profiles`
*   **Condition**: `(is_mentor = true) OR (id = auth.uid())`
    *   *Effect*: If I query the users table, I only see myself AND people who are public mentors.
*   **Column Security**: We will restrict the SELECT API to only return: `id`, `display_name`, `mentor_location`, `mentor_bio`.

### B. The "Look Down" Access Chain
This is the most complex part. We must update the "Check Access" logic for every secure table (`hives`, `inspections`, `tasks`).

*   **Current Logic**: "Do I own the Apiary?"
*   **New Logic**: "Do I own the Apiary **OR** is there a record in `apiary_shares` where `apiary_id = [current] AND viewer_id = [me]`?

We will update the central database function `check_hive_access()` to handle this logic centrally, so we don't have to rewrite 20 different policies.

---

## 5. User Interface & Workflow

### Phase 1: The Setup (Admin/Profile)
1.  **Mentor Settings**: A user (or Admin) toggles `is_mentor = true` and fills in `Location/Bio`.

### Phase 2: The Delegation (Mentee)
1.  **"Share Apiary" Button**: Located on the Apiary Setup/Settings screen.
2.  **"Find a Mentor" Modal**:
    *   Displays a list of users where `is_mentor = true`.
    *   Shows: Name, Location, Bio. (No Email).
3.  **Action**: Mentee selects a Mentor → System inserts row into `apiary_shares`.

### Phase 3: The Mentor View
1.  **Apiary Selection Screen**:
    *   Section 1: **"My Apiaries"** (Standard View)
    *   Section 2: **"Mentored Apiaries"** (New Section)
        *   Lists apiaries shared with them.
        *   Visually distinct (maybe a different icon or badge).
2.  **Read-Only Mode**:
    *   When viewing a Shared Hive, "Edit", "Delete", and "Add Log" buttons are hidden/disabled.

---

## 6. Implementation Strategy (Multi-Agent / Sequential)

This workload splits cleanly into two distinct phases that can be executed sequentially:

1.  **The Backend Specialist (Agent Mode 1)**
    *   Execute SQL Schema changes.
    *   **CRITICAL**: Write and Verify the complex RLS Security Policies.
    *   *Deliverable*: A secure database where if you manually insert a share record, the access works instantly.

2.  **The Frontend Developer (Agent Mode 2)**
    *   Build the "Share" UI.
    *   Update the Apiary List to show shared items.
    *   Implement the "Read Only" UI masking.
