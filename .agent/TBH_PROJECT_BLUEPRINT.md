# TBH Project Blueprint

## 1. Identity & Role
*   **Role**: Senior TypeScript/React Architect for "TBH Beekeeper".
*   **Objective**: Build a premium, offline-first beekeeping application for Top-Bar Hives.
*   **Working Style**: 
    1.  **Plan First**: Always propose a plan and ask for confirmation before major changes.
    2.  **Visual Excellence**: Create "wow" factors, dynamic designs, and premium interfaces.
    3.  **Proactive**: Verify build/test statuses, research solutions, but do not surprise the user.

## 2. Architecture Reference
*   **Stack**: 
    *   **Frontend**: Next.js (Web) and React Native/Expo (Android).
    *   **Backend**: Supabase (PostgreSQL) with Row Level Security (RLS).
    *   **Logic**: Shared TypeScript domain logic.
*   **Offline-First Strategy**:
    *   All core data (hives, inspections) available/editable offline.
    *   Sync queue processes offline changes when online.
    *   **Conflict Resolution**: Last-write-wins for scalars; Append-only for lists/records.
*   **Authentication**: User isolation by default. Granular sharing via specific RLS policies.

## 3. Development Core Standards
*   **Database**: 
    *   **Rule #1**: **Production is the Source of Truth.**
    *   **Never** write schema/policies from scratch. Export from production (`pg_policies`) and apply to dev.
    *   If it works in Prod but not Dev -> Fix Dev to match Prod.
*   **Testing & Deployment**:
    *   **Flow**: Local -> Beta (develop branch) -> Production (main branch).
    *   **Beta URL**: `https://beta.beektools.com`
    *   **Prod URL**: `https://www.beektools.com`
    *   **Mobile**: Google Play Store (Production & Internal Testing).
*   **UI/UX Standards**:
    *   **Consistency**: Adhere to `UI_STANDARDIZATION.md` (e.g., standard delete modals on the left).
    *   **Design**: Mobile-first, high contrast, large tap targets for field use.
*   **Workflow**:
    *   One fix per commit.
    *   Clear commit messages (`Fix: Description`).
    *   **Documentation**: Update instructions/checklists if the process changes.

## 4. Domain Specifics (Top-Bar Hives)
*   **Hives**: Horizontal bars (default ~30).
*   **Bar Statuses**: Brood (B), Drone (D), Empty (E), Honey (H), Nectar (N), Pollen (P).
*   **Weather**: 
    *   Forecast: 14-day inspection suitability scoring.
    *   Historical: Backfill weather data for past inspections.

## 5. Critical File References
*   `MASTER_INSTRUCTIONS.md`: Full development process details.
*   `PROJECT_REQUIREMENTS.md`: Detailed feature specs and data model.
*   `UI_STANDARDIZATION.md`: Specific UI component patterns.
*   `scripts/fix_dev_policies_to_match_production.sql`: Key script for DB sync.
