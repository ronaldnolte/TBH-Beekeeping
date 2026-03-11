# Database Operations & Release Protocols

## ⚠️ Critical Environment Philosophy
**Development is a Clone of Production.**
We maintain strict parity between environments. The database schema in Development must ALWAYS exactly match Production.
- **Drift is Forbidden.** If you change Dev, you must migrate Prod. If you change Prod validation, you must update Dev.
- **Sync Tools:** We have created fully automated tools to enforce this.

---

## 🛠️ The "Red Button" Tooling

### 1. Reset & Sync (Production → Development)
**When to use:** 
- You need a fresh start in Dev.
- You need to reproduce a Production bug.
- Development schema has drifted and you want to reset.

**Command:**
```bash
node scripts/sync_prod_to_dev.js
```

**What it does:**
1.  **Backs up Production** data automatically.
2.  **Nukes Development Database** (Public Schema).
3.  **Clones Schema:** Applies Production tables, functions, triggers, and policies to Dev.
4.  **Clones Auth:** Backs up Prod Auth Users and forces them into Dev (deleting conflicts).
5.  **Restores Data:** Pushes all Production public data into Dev.

**Result:** `beta.beektools.com` (Dev) becomes a bit-perfect clone of `app.beektools.com` (Prod).

---

### 2. Promote Release (Development → Production)
**When to use:**
- You have finished a feature or bugfix in Dev.
- You are ready to deploy.

**Command:**
```bash
node scripts/promote_to_prod.js
```

**What it does:**
1.  **Git Safety:** Ensures you are on `develop` and clean.
2.  **Schema Check:** Compares Dev vs Prod schemas.
    - If Dev has changes (e.g. new columns) not in Prod, it **ABORTS**.
    - You must apply migrations manually first (see below).
3.  **Code Promotion:** Merges `develop` -> `main` and Pushes.
    - Triggers Vercel Deployment.

---

## 🔧 Manual Migrations (Applying Schema Changes)
If `promote_to_prod.js` fails due to "Schema Drift", you must apply your changes to Production.

**Command:**
```bash
node scripts/apply_migration_production.js "postgres://...[PROD_URL]..." "./path/to/your_migration.sql"
```
*(Find the Production URL in `scripts/promote_to_prod.js` or project secrets)*

**Workflow for New Features:**
1.  Create migration SQL file (e.g. `scripts/migrations/001_add_column.sql`).
2.  Apply to Dev using `psql` or Supabase UI.
3.  Develop & Test feature.
4.  Apply to Prod using `apply_migration_production.js`.
5.  Run `node scripts/promote_to_prod.js` to release code.

---

## 📂 Backup & Restore Details
The tooling uses JSON-based backups to maximize compatibility and avoid `pg_dump` binary dependencies.

- **Storage:** `backups/production_YYYY-MM-DD.../`
- **Format:** One JSON file per table.
- **Scripts:** `scripts/backup_production.js` / `scripts/restore_production.js`

**Note on Foreign Keys:**
The restore script (`restore_production.js`) has a hardcoded `RESTORE_ORDER`. If you add new tables with FKs, you **MUST** update the `RESTORE_ORDER` array in that script or restore will fail.
