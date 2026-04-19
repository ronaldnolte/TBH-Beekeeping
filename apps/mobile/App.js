import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Production URL
const WEB_APP_URL = 'https://beektools.com';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Handle Android Hardware Back Button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [canGoBack]);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="auto" backgroundColor="#ffffff" />
        <WebView
          ref={webViewRef}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationStateChange}

          // Persistence & Performance
          domStorageEnabled={true}
          javaScriptEnabled={true}
          sharedCookiesEnabled={true}
          cacheEnabled={true}
          incognito={false}
          thirdPartyCookiesEnabled={true}
          setSupportMultipleWindows={false}
          
          // The WebView will persist localStorage automatically as long as incognito is false
          // and domStorageEnabled is true. Manual syncing was causing crashes.
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
