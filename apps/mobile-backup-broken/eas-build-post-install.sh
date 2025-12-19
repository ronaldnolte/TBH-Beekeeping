#!/usr/bin/env bash

set -e

echo "🔧 Updating Gradle wrapper to 8.13..."

# Update the gradle-wrapper.properties file
GRADLE_WRAPPER="android/gradle/wrapper/gradle-wrapper.properties"

if [ -f "$GRADLE_WRAPPER" ]; then
  # Replace the Gradle version
  sed -i 's/gradle-8\.10\.2-all\.zip/gradle-8.13-bin.zip/g' "$GRADLE_WRAPPER"
  sed -i 's/gradle-8\.10\.2-bin\.zip/gradle-8.13-bin.zip/g' "$GRADLE_WRAPPER"
  echo "✅ Updated Gradle wrapper to 8.13"
else
  echo "⚠️  Gradle wrapper file not found at $GRADLE_WRAPPER"
fi

echo "✅ Build hook complete"
