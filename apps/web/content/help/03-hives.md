---
title: Hives
summary: Supported hive types, adding/editing/moving/deleting hives, and the hive detail screen.
keywords: hive, add hive, hive type, langstroth, top bar, warre, layens, dartington, dadant, national, edit hive, move hive, delete hive, archived, bars
---

# Hives

## Supported hive types

Pick the category first (**Horizontal Expansion** or **Vertical Expansion**), then the **Hive Model**.

| Category | Models |
|---|---|
| Vertical | Langstroth (10-Frame), Langstroth (8-Frame), UK National, Dadant (Blatt), Warré |
| Horizontal | Top Bar (Kenyan), Layens, Long Langstroth, Dartington |

How each is configured:

- **Langstroth (8- or 10-Frame):** you build a stack of boxes with the box builder (`04-bar-and-box-configuration.md`).
- **All other models:** you enter a **Total Bars** number (10–60; Top Bar defaults to 30) and manage the bars as coloured rectangles.

**The hive model cannot be changed after the hive is created** (the Hive Model field is locked when editing). To switch type, create a new hive.

## Adding a hive

1. Open an apiary and tap **+ Add Hive** (or **Create First Hive** if empty).
2. Enter a **Hive Name** (for example "Hive Alpha") and optional **Notes**.
3. Choose the category and **Hive Model**.
4. Configure the boxes (Langstroth) or set **Total Bars**.
5. Tap **Create Hive**. An initial snapshot is saved automatically.

New bar hives start with a default layout: bars 1–2 empty, 3–5 brood, 6–7 resource, 8–9 empty, bar 10 a follower board, and the remaining bars inactive. New Langstroth hives start with two deep 10-frame boxes.

## Hive cards (apiary dashboard)

Each card shows the hive name, an **Active/Archived** badge, the bar count (not shown for Langstroth), and the last inspection date or "Never". Buttons: **View** (open the hive) and **Move**.

- **Move:** choose another apiary from the list and tap **Move Hive**. You need at least one other apiary.
- **✏️ Edit** (top of the page) puts cards into edit mode, showing **✏️ Edit Info** and **🗑️ Delete** on each card. Tap **✓ Done** to leave edit mode.
- **Delete** asks for confirmation and permanently removes the hive with all its inspections, interventions, tasks and history. This cannot be undone.

## Hive detail screen

Opening a hive shows, top to bottom:

1. **Edit Hive** button, then the configuration (bars or boxes)
2. **History** (snapshots) and **Notes** (with an Edit link)
3. Tabs: **Inspections**, **Interventions**, **Varroa**, **Tasks**
4. A "Return to [apiary]" button at the top

**Edit Hive** lets you rename, change notes, change the bar count, or (Langstroth) rebuild the boxes. Changing the bar count or the box layout saves a new snapshot automatically.

If you are viewing someone else's shared apiary you can look but not change anything: edit actions show "Only the apiary owner can make changes."
