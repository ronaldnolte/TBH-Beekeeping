# TBH Beekeeper - Original Project Requirements

**Date Created:** Original prompt (predates 12/26/2024)  
**Last Updated:** 2024-12-29

---

## Project Role

Act as a senior TypeScript/React architect building an offline‑first beekeeping application for Android (React Native) and web (React + Next.js). You are working inside Google Antigravity with Gemini 3.

Your job is to:  
1) Research and internalize how top‑bar beekeeping and top‑bar hive inspections work before designing the app.  
2) Propose and then implement a minimal but extensible architecture that supports offline‑first usage, background sync, user‑level data isolation/sharing, and weather‑aware suggestions.  
3) Generate a working initial codebase for Android + web that I can run and iterate on.

Always show me a brief plan first, then ask for confirmation before writing or changing large amounts of code.

---

## Step 0 – Use Antigravity features explicitly  
- Use Antigravity's task/plan board to break this into phases.  
- For each phase, create clear tasks and attach artifacts (design notes, code diffs, screenshots) that I can review.  
- Never apply large code changes without first showing me the plan and the proposed diffs as artifacts and asking for approval.

---

## Step 1 – Domain research (top‑bar hives)  
Before any coding or data‑model design, spend a short phase researching:  
- Top‑bar hives vs Langstroth hives and how inspections differ.  
- Typical top‑bar management practices, especially bar‑by‑bar status tracking and interventions.  
- How beekeeping apps in the wild handle hives, inspections, interventions, tasks, and weather/visit planning (for both beginners and advanced users).

Do not copy any existing app UI or text. Summarize what you learn in your own words in under 300 words and propose any domain fields I might be missing for inspections, interventions, tasks, weather capture, or forecasts.

---

## Step 2 – High‑level requirements  
Build an app for managing top‑bar hives in one or more apiaries:

- Each apiary has: id, name, zip code (US), optional GPS coordinates, notes.  
- Each hive belongs to one apiary and is assumed to be a top‑bar hive.  
- Hives initially have 12–40 top bars, with a default of 30 bars per hive.  
- The primary UI is hive‑centric: inspections, interventions, tasks, snapshots, and forecasts are all attached to a hive (or its apiary).  
- The app runs on Android (React Native) and web (React/Next.js), sharing as much domain logic as possible in TypeScript.  
- Offline‑first: all data must be available and editable offline on device; when the device comes online, it syncs to a backend API.  
- Multi‑user: users must not see or modify other users' data, except where explicit "sharing" is granted.

---

## Step 3 – Data model  
Propose a concrete TypeScript data model and storage approach for at least:

- User  
- Apiary  
- Hive  
- HiveSnapshot  
- Inspection  
- Intervention  
- Task  
- WeatherForecastSlot (or equivalent) to store 14‑day forecast data and inspection suitability scores per time slot.

### Details and requirements:

#### 1) Top bars  
Each hive has an ordered list of bars, each with a "status" code and color:

- B = brood (mainly worker brood) – light brown  
- D = drone (mainly drone brood) – green  
- E = empty comb or empty bar – white  
- H = honey stores (may have some unsealed stores) – amber/honey color  
- N = nectar (may have some sealed honey) – lighter shade than honey  
- P = pollen (significant pollen stores) – light yellow  

Requirements:  
- In the hive view, display a row of rectangular bars in order.  
- Each bar is tap/click togglable to cycle through these statuses (or via a compact status picker).  
- A snapshot saves the current bar configuration plus derived summary fields (for example, counts of brood bars, honey bars, etc.).  
- Show the most recent 3 snapshots on the hive page.

#### 2) Snapshots, inspections, interventions – time and weather  
For each HiveSnapshot, Inspection, and Intervention:

- Always store a timestamp and link to the relevant hive and apiary.  
- Store an optional embedded weather object with fields such as:  
  - temperature  
  - windSpeed, windDirection  
  - precipitation  
  - humidity  
  - cloudCover  

Assumptions:

- Sometimes these records will be entered after the fact.  
- Sometimes the device will be offline when the event happens.

Requirements:

- Make the timestamp mandatory on creation.  
- Make weather fields optional and allow them to be:  
  - Filled manually by the user.  
  - Backfilled later from a weather API when the device is online.  

Design the data model so that backfilling weather for existing records is straightforward.

#### 3) Inspections  
Inspection records should include at least:

- Date/time (timestamp)  
- Queen status (seen, not seen, evidence of laying, unknown, etc.)  
- Brood pattern quality  
- Population/strength estimate  
- Temperament  
- Stores assessment (honey, pollen)  
- Notable observations (free‑text notes)  
- Optional reference to a related snapshot  
- Optional weather object as described above

Show the last 3 inspections on the hive detail screen.

#### 4) Interventions  
Interventions should include at least:

- Type: feeding, treatment, manipulation (cross‑comb, splitting, etc.), other  
- Date/time (timestamp)  
- Description / details (free text)  
- Optional link to a related inspection  
- Optional weather object as described above

Show the last 3 interventions on the hive detail screen.

#### 5) Tasks  
Tasks should support:

- Scope: per hive or per apiary  
- Title, description  
- Due date, status, priority  
- Assigned user (if applicable)

Tasks should be viewable per hive and per apiary.

---

## Step 4 – Offline‑first and sync  
Design for offline‑first behavior:

- Use a local database suitable for React Native and web. You may suggest separate local solutions for mobile and web if needed, but keep the domain model shared in TypeScript.  
- All core operations (view/edit apiaries, hives, snapshots, inspections, interventions, tasks) must work without network.  
- Implement a sync queue for changes made offline, to be pushed when the device reconnects.  
- Propose a conflict‑resolution strategy that is simple but safe. A reasonable starting point is:  
  - Last‑write‑wins per scalar field.  
  - Never delete existing snapshots, inspections, or interventions as part of conflict resolution; treat them as append‑only records.  
  - For lists (tasks, snapshots, interventions), merge additively, resolving conflicts at the record level.  

Propose a simple HTTP API contract for the backend that can support this sync model (I will implement or generate the backend later).

---

## Step 5 – Security and sharing  
- Implement user authentication and per‑user data isolation so that users cannot see or change other users' apiaries, hives, or records by default.  
- Add a sharing model where an apiary or hive owner can grant read‑only or read‑write access to another user (for example, a mentor viewing a student's apiary).  
- Propose how to represent sharing in the data model (for example, access control lists or shared‑with entries) and how to enforce it in both the client logic and API contract (access checks for every request).

---

## Step 6 – UI requirements  
Build an initial UX that includes:

- Apiary list and detail pages.  
- Hive list per apiary and hive detail page.  
- Hive detail view showing:  
  - Current bar row with colored rectangles and tap/click toggling.  
  - Last 3 snapshots.  
  - Last 3 inspections.  
  - Last 3 interventions.  
  - Task list for this hive (with quick add) plus a way to view tasks for the entire apiary.

Forms:

- Create/edit apiaries and hives, including number of top bars.  
- Create/edit inspections with standard inspection fields and notes.  
- Create/edit interventions with type and description.  
- Create/edit tasks (per hive or per apiary).

UI constraints:

- Mobile‑first, optimized for in‑field use: large tap targets, high contrast, minimal typing, clear status colors on the bar row.

---

## Step 7 – Weather integration and 14‑day inspection forecast  

### 1) Historical and real‑time weather capture  
- Each apiary has a zip code (and optionally GPS coordinates).  
- Design integration points for a weather API that can:  
  - Fetch historical weather for a given timestamp and location (for backfilling snapshots, inspections, and interventions).  
  - Fetch current and forecast weather for inspection‑planning.  
- Assume that when the device is offline, only timestamps (and user‑entered notes) are recorded. When online, the app should be able to:  
  - Backfill missing weather for existing records.  
  - Allow the user to trigger a "fill weather for recent records" action.  
- If the weather API is unavailable or rate‑limited, leave weather fields empty but editable manually.

### 2) 14‑day inspection forecast  
- Integrate with a weather API that provides a 14‑day forecast for the apiary location, including at least:  
  - Temperature  
  - Cloudiness  
  - Precipitation  
  - Humidity  
  - (Optionally) wind speed  
- Design and implement a feature that uses this forecast data to calculate recommended time slots for hive inspections over the next 14 days.  
  - The model should output an "inspection suitability" score or discrete labels (for example, Poor / OK / Good / Ideal) per time slot.  
  - The scoring algorithm should be simple, explainable, and configurable later. For now, propose a reasonable default heuristic based on beekeeping best practices (avoid rain, avoid very low or very high temps, avoid high wind; prefer moderate temperatures, light winds, and moderate humidity).  
  - Document the scoring algorithm clearly in comments and in a short markdown design artifact so it can be adjusted later.

Do not over‑engineer the algorithm in the first version; produce a simple heuristic that we can refine later.

---

## Step 8 – Implementation plan and phases  
Before writing code:

1) Present a concise, phased implementation plan with milestones, for example:  
   - Phase 1: Domain research summary and data model.  
   - Phase 2: Storage layer and offline‑first setup.  
   - Phase 3: Basic UI (apiaries, hives, bar row, snapshots).  
   - Phase 4: Inspections, interventions, tasks.  
   - Phase 5: Sync logic and basic conflict handling.  
   - Phase 6: Auth & sharing.  
   - Phase 7: Weather integration hooks and 14‑day inspection forecast scoring.  
   - Phase 8: Historical weather backfill workflow and UX polish.  

2) Ask me to confirm or adjust the plan.

After I confirm, start implementing phase by phase, showing me diffs or artifacts at each step and asking for confirmation before big changes.

---

## Important working style  

- At each phase, show me:  
  - The updated plan.  
  - The files you propose to create or modify.  
  - A short explanation of design choices in plain language.  

- Ask me for approval before:  
  - Adding new major dependencies.  
  - Creating or changing database schemas.  
  - Changing the sync model, security/sharing model, or forecasting/scoring model.

---

## Current Implementation Status

**As of 2024-12-29:**
- ✅ Core data model implemented
- ✅ Supabase backend with RLS policies
- ✅ Web app (Next.js) deployed to production and beta
- ✅ Android app (React Native/Expo) published to Play Store
- ✅ Basic offline-first functionality
- ✅ Weather integration (14-day forecast)
- ✅ User authentication and data isolation
- 🚧 Advanced sharing features (planned)
- 🚧 Comprehensive conflict resolution (basic implementation exists)

**Production:** https://www.beektools.com  
**Beta/Dev:** https://beta.beektools.com
