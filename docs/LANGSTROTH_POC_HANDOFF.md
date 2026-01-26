# Langstroth Hive Support - POC Handoff

**Date:** Jan 2026
**Status:** Prototype Complete (Standalone)
**Branch:** `develop`

## 1. Overview
We are adding support for Vertical (Langstroth) hives alongside the existing Horizontal (Top Bar) hives. A standalone prototype has been built to test the visual "Builder" interface.

## 2. Current State (The Prototype)
*   **URL:** `/langstroth-lab` (on local or beta environment)
*   **Code Location:**
    *   `apps/web/app/langstroth-lab/page.tsx` (Test Page)
    *   `apps/web/components/LangstrothBuilder.tsx` (Main Logic)
    *   `apps/web/components/LangstrothBox.tsx` (Visual Component)
*   **Features Implemented:**
    *   Drag-and-drop style building (Deep, Medium, Shallow boxes).
    *   Accessories: Queen Excluder, Inner Cover, Top Feeder, Slatted Rack.
    *   **Global Layout Config:** 8-frame vs 10-frame toggle (applies to entire stack).
    *   **Mobile Support:** Scrollable internal container for tall stacks.

## 3. Implementation Plan (Next Steps for Integration)

To move this from "Lab" to "Production", the following steps are needed:

### A. Database Schema
**Decision:** We need a flag to distinguish hive types.
*   **Recommended:** Add `type` column to `hives` table.
    *   `type` (text/enum): `top-bar` (default) | `langstroth`.
*   **Alternative:** Store in `jsonb` metadata if schema changes are strictly forbidden.

### B. Component Architecture
We need a dispatcher to render the correct view based on hive type.
1.  Create `components/HiveVisualizer.tsx`.
2.  Logic:
    ```typescript
    if (hive.type === 'langstroth') return <LangstrothVisualizer ... />
    else return <BarVisualizer ... />
    ```

### C. Data Persistence
The current `LangstrothBuilder` uses local state (`useState`). It needs to be updated to:
1.  Accept `initialData` (from Supabase).
2.  Save changes back to Supabase (likely storing the stack config in the `bars` column or a new `configuration` JSON column, as "Box 1, Deep, 10 frames").

## 4. Work Remaining
- [ ] Migration to add `type` column.
- [ ] adapting `LangstrothBuilder` to read/write to DB.
- [ ] Integrating into `HiveDetails` page.
