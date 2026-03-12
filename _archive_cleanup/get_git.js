const { execSync } = require('child_process');

try {
    const main = execSync('git rev-parse main').toString().trim();
    const develop = execSync('git rev-parse develop').toString().trim();
    const status = execSync('git status --short').toString().trim();
    console.log(JSON.stringify({ main, develop, status }, null, 2));
} catch (e) {
    console.error(e.toString());
}
