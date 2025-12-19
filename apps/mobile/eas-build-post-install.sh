#!/usr/bin/env bash

set -e

echo "🔧 Patching expo-modules-autolinking to remove broken reference..."

# Patch the autolinking gradle template to remove the expo-gradle-plugin reference
AUTOLINKING_DIR="node_modules/expo-modules-autolinking"

if [ -d "$AUTOLINKING_DIR" ]; then
  # The template file that generates settings.gradle
  TEMPLATE_FILE="$AUTOLINKING_DIR/build/autolinking.gradle"
  
  if [ -f "$TEMPLATE_FILE" ]; then
    # Remove the includeBuild line for expo-gradle-plugin
    sed -i '/expo-gradle-plugin/d' "$TEMPLATE_FILE"
    echo "✅ Patched autolinking template"
  else
    echo "⚠️  Template file not found at $TEMPLATE_FILE"
  fi
else
  echo "⚠️  expo-modules-autolinking not found"
fi

echo "✅ Build hook complete"
