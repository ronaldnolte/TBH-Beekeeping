const fs = require('fs');

const inputFile = process.argv[2] || 'production_schema_ordered.sql';
const outputFile = process.argv[3] || 'production_schema_clean.sql';

let sql = fs.readFileSync(inputFile, 'utf8');

// Remove CREATE EXTENSION lines
sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS .*;/g, '-- EXTENSION SKIPPED');

fs.writeFileSync(outputFile, sql);
console.log(`✅ Cleaned SQL saved to ${outputFile}`);
