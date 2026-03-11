const fs = require('fs');

const file = process.argv[2] || 'production_schema_constraints_clean.sql';
let content = fs.readFileSync(file, 'utf8');

// Replace literal "\n" (backslash-n) with real newline
content = content.replace(/\\n/g, '\n');

fs.writeFileSync(file, content);
console.log("✅ Fixed newlines in SQL file.");
