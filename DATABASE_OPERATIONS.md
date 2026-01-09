# Database Backup & Restore Procedures

## 1. Overview
This document outlines the standard procedures for backing up the Production database and restoring it. These scripts are critical for disaster recovery and safeguard data before major deployments.

**Scripts Location:** `./scripts/`
- `backup_production.js`
- `restore_production.js`

---

## 2. Backup Procedure

**When to run:** Before any deployment that modifies the database schema or data.

### Command
Run this command from the project root (`TBH Beekeeper/`):

```bash
node scripts/backup_production.js "postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/postgres"
```

### Connection Details (Production)
- **User:** `postgres.ayeqrbcvihztxbrxmrth` (Transaction Pooler)
- **Host:** `aws-1-us-east-2.pooler.supabase.com`
- **Port:** `6543`
- **Database:** `postgres`

### Output
- Data is saved to: `backups/production_YYYY-MM-DDTHH-mm-ss/`
- Each table is saved as a separate `.json` file.

---

## 3. Restore Procedure

**When to run:** In case of data loss, corruption, or to refresh a development environment with production data.

### Command

```bash
node scripts/restore_production.js "postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/postgres" "./backups/[BACKUP_FOLDER_NAME]"
```

**Example:**
```bash
node scripts/restore_production.js "postgres://..." "./backups/production_2026-01-09T21-28-04-000Z"
```

### How it Works
1. Connects to the target database.
2. Reads JSON files from the specified backup folder.
3. Restores tables in a specific dependency order (`users` -> `apiaries` -> `hives`...).
4. Uses `ON CONFLICT DO NOTHING`, so it will fill in missing records but NOT overwrite existing ones.

---

## 4. Troubleshooting

**Common Errors:**
- `Tenant or user not found`: Check that you are using the correct Region Pooler URL.
- `Password authentication failed`: Ensure your password is URL-encoded if it contains special characters (e.g., `!` -> `%21`, `#` -> `%23`).
- `ENETUNREACH`: You are likely trying to connect to the IPv6 Direct Connection (`db...`) on an IPv4 network. Switch to the **Transaction Pooler** (`aws-0...` or `aws-1...`).
