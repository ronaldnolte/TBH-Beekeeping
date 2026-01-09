const { execSync } = require('child_process');
const fs = require('fs');

// CONFIG
const PROD_DB = "postgres://postgres.ayeqrbcvihztxbrxmrth:tbhSupa5723@aws-1-us-east-2.pooler.supabase.com:6543/postgres";
const DEV_DB = "postgres://postgres.wrdnwzgztwzoigkoebeq:tbhSupa5723@aws-0-us-west-2.pooler.supabase.com:6543/postgres";

function run(cmd, ignoreError = false) {
    console.log(`> ${cmd}`);
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
    } catch (e) {
        if (!ignoreError) {
            console.error(`❌ COMMAND FAILED: ${cmd}`);
            process.exit(1);
        }
    }
}

function runSilent(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8' }).trim();
    } catch (e) {
        return '';
    }
}

async function main() {
    console.log("🚀 STARTING PROMOTION: DEV -> PROD");
    console.log("===================================================");

    // 1. Git Status Check
    const branch = runSilent('git branch --show-current');
    if (branch !== 'develop') {
        console.error(`❌ You must be on 'develop' branch to promote. Current: ${branch}`);
        process.exit(1);
    }

    const status = runSilent('git status --porcelain');
    if (status) {
        console.error("❌ Your git working directory is dirty. Please commit or stash changes first.");
        process.exit(1);
    }
    console.log("✅ Git status clean.");

    // 2. Schema Drift Check
    console.log("\n🔍 Checking Database Schema Compatibility...");
    // We use our audit scripts to check if Dev has changes not in Prod
    run(`node scripts/audit_schema.js "${DEV_DB}" "temp_dev_check.json"`, true);
    run(`node scripts/audit_schema.js "${PROD_DB}" "temp_prod_check.json"`, true);

    // We run the diff analysis silently and check output
    try {
        const diffOutput = execSync('node scripts/analyze_schema_diff.js temp_dev_check.json temp_prod_check.json', { encoding: 'utf8' });

        // If there are "MISSING TABLES IN PRODUCTION" or "Type mismatch", we warn.
        if (diffOutput.includes("MISSING TABLES IN PRODUCTION") || diffOutput.includes("Type mismatch")) {
            console.error("\n🛑 BLOCKING PROMOTION: DATABASE SCHEMA DRIFT DETECTED");
            console.error("---------------------------------------------------");
            console.error(diffOutput);
            console.error("---------------------------------------------------");
            console.error("You have Database changes in DEV that are not in PROD.");
            console.error("Please apply the necessary SQL migrations to Production FIRST.");
            console.error("Use 'node scripts/apply_migration_production.js' to apply them.");
            process.exit(1);
        }
        console.log("✅ Database Schemas match (or Prod is superset). Safe to deploy code.");
    } catch (e) {
        console.error("❌ Schema check failed execution.");
        process.exit(1);
    }

    // 3. The Promotion (Git Operations)
    console.log("\n🚢 PROMOTING CODE...");

    run('git fetch origin main');
    run('git checkout main');
    run('git merge develop');
    run('git push origin main');

    console.log("✅ Code Pushed to Main. Vercel should be building now.");

    // 4. Return to Develop
    run('git checkout develop');

    console.log("\n===================================================");
    console.log("🎉 PROMOTION COMPLETE!");
}

main();
