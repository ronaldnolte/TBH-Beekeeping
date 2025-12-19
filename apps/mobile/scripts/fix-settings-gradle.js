#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const settingsGradlePath = path.join(__dirname, '..', 'android', 'settings.gradle');

console.log('🔧 Fixing settings.gradle for SDK 52...');

// Read the generated settings.gradle
let content = fs.readFileSync(settingsGradlePath, 'utf8');

// Remove the problematic expo-gradle-plugin reference
content = content.replace(
    /includeBuild\(['"].*?expo-modules-autolinking.*?expo-gradle-plugin['"]?\)/g,
    '// expo-gradle-plugin reference removed (not needed in SDK 52)'
);

// Write it back
fs.writeFileSync(settingsGradlePath, content, 'utf8');

console.log('✅ settings.gradle fixed!');
