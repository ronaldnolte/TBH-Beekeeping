import React from 'react';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Your computer's IP address (verified earlier)
const WEB_APP_URL = 'http://10.0.0.164:3000';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E67E22' }}>
      {/* Status bar matches the app theme */}
      <StatusBar style="light" backgroundColor="#E67E22" />

      {/* The WebView acts as the "browser" for your app */}
      <WebView
        source={{ uri: WEB_APP_URL }}
        style={{ flex: 1 }}
        // Allow file uploads if needed in future
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </SafeAreaView>
  );
}
