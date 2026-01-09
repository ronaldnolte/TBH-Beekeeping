const fs = require('fs');

const dev = JSON.parse(fs.readFileSync('dev_policies.json', 'utf8'));
const prod = JSON.parse(fs.readFileSync('prod_policies.json', 'utf8'));

// Helper to key policies
const key = (p) => `${p.tablename}:${p.policyname}`;

const devMap = dev.reduce((acc, p) => ({ ...acc, [key(p)]: p }), {});
const prodMap = prod.reduce((acc, p) => ({ ...acc, [key(p)]: p }), {});

console.log("📊 POLICY COMPARISON\n");

// Missing in Prod
const missing = Object.keys(devMap).filter(k => !prodMap[k]);
if (missing.length > 0) {
    console.log("🔴 MISSING IN PROD:");
    missing.forEach(k => console.log(`   - ${k}`));
}

// Extra in Prod
const extra = Object.keys(prodMap).filter(k => !devMap[k]);
if (extra.length > 0) {
    console.log("⚠️  EXTRA IN PROD:");
    extra.forEach(k => console.log(`   - ${k}`));
}

// Definition Mismatch
const common = Object.keys(devMap).filter(k => prodMap[k]);
common.forEach(k => {
    const d = devMap[k];
    const p = prodMap[k];
    if (d.cmd !== p.cmd || d.qual !== p.qual || d.with_check !== p.with_check) {
        console.log(`❌ MISMATCH: ${k}`);
        // console.log(`   Dev:  ${d.qual}`);
        // console.log(`   Prod: ${p.qual}`);
    }
});

if (missing.length === 0 && extra.length === 0) {
    console.log("✅ Policy Names Match (Check mismatch logs for logic diffs).");
}
