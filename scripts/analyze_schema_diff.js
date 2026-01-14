const fs = require('fs');

const devFile = process.argv[2] || 'dev_schema.json';
const prodFile = process.argv[3] || 'prod_schema.json';

const devSchema = JSON.parse(fs.readFileSync(devFile, 'utf8'));
const prodSchema = JSON.parse(fs.readFileSync(prodFile, 'utf8'));

console.log("📊 SCHEMA COMPARISON REPORT\n");

const devTables = new Set(Object.keys(devSchema));
const prodTables = new Set(Object.keys(prodSchema));

// 1. Missing Tables
const missingInProd = [...devTables].filter(t => !prodTables.has(t));
if (missingInProd.length > 0) {
    console.log("🔴 MISSING TABLES IN PRODUCTION:");
    missingInProd.forEach(t => console.log(`   - ${t}`));
} else {
    console.log("✅ All tables exist in Production.");
}

// 2. Extra Tables (Unexpected)
const extraInProd = [...prodTables].filter(t => !devTables.has(t));
if (extraInProd.length > 0) {
    console.log("\n⚠️  EXTRA TABLES IN PRODUCTION (Not in Dev):");
    extraInProd.forEach(t => console.log(`   - ${t}`));
}

// 3. Column Mismatches
console.log("\n🔍 COLUMN ANALYSIS:");
let hasMismatch = false;

devTables.forEach(table => {
    if (!prodSchema[table]) return; // Skip if table missing

    const devCols = devSchema[table].reduce((acc, col) => ({ ...acc, [col.name]: col }), {});
    const prodCols = prodSchema[table].reduce((acc, col) => ({ ...acc, [col.name]: col }), {});

    const mismatches = [];

    // Check for missing or typed-wrong columns
    Object.keys(devCols).forEach(colName => {
        const d = devCols[colName];
        const p = prodCols[colName];

        if (!p) {
            mismatches.push(`❌ Missing column: ${colName} (${d.type})`);
        } else if (p.type !== d.type) {
            mismatches.push(`⚠️ Type mismatch: ${colName} (Dev: ${d.type} vs Prod: ${p.type})`);
        }
    });

    if (mismatches.length > 0) {
        hasMismatch = true;
        console.log(`\nTable: ${table}`);
        mismatches.forEach(m => console.log(`   ${m}`));
    }
});

if (!hasMismatch) {
    console.log("   ✅ All columns match.");
}
