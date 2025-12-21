import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Linking, View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

// Production URL with navigation fix
const WEB_APP_URL = 'https://tbh.beektools.com';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [key, setKey] = useState(0); // For forcing WebView reload on error

  // Handle Android Hardware Back Button
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // Prevent default behavior (exit app)
        }
        return false; // Allow default behavior (exit app)
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
  }, [canGoBack]);

  // Handle External Links (Don't open them inside the app)
  const handleNavigationStateChange = (navState) => {
    console.log('Navigation State Change:', navState.url);
    setCanGoBack(navState.canGoBack);

    const { url } = navState;
    if (!url) return;

    // Allow beektools.com and vercel.app to stay within WebView
    const allowedDomains = ['beektools.com', 'vercel.app', 'supabase.co'];
    const isAllowedDomain = allowedDomains.some(domain => url.includes(domain));

    if (!isAllowedDomain && !url.includes('localhost') && !url.includes('10.0.0.')) {
      // Optional: Intercept external links here if needed
      console.log('External link detected:', url);
      // Linking.openURL(url);
      // webViewRef.current.stopLoading();
    }
  };

  // Handle WebView errors
  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView Error:', nativeEvent);
    Alert.alert(
      'Connection Error',
      `Failed to load page: ${nativeEvent.description || 'Unknown error'}`,
      [
        {
          text: 'Retry',
          onPress: () => setKey(prevKey => prevKey + 1)
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]
    );
  };

  // Handle HTTP errors (like 404, 500, etc.)
  const handleHttpError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('HTTP Error:', nativeEvent);
    // Only show alert for serious errors (500+), not auth redirects (3xx)
    if (nativeEvent.statusCode >= 500) {
      Alert.alert(
        'Server Error',
        `Server returned error ${nativeEvent.statusCode}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Handle messages from the WebView (for debugging)
  const handleMessage = (event) => {
    console.log('Message from WebView:', event.nativeEvent.data);
  };

  // Handle console logs from the WebView
  const handleConsoleLog = (event) => {
    console.log('WebView Console:', event.nativeEvent.message);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="auto" backgroundColor="#ffffff" />

        <WebView
          key={key}
          ref={webViewRef}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationStateChange}

          // Error Handling
          onError={handleError}
          onHttpError={handleHttpError}
          onMessage={handleMessage}
          onConsoleMessage={handleConsoleLog}

          // Persistence & Permissions
          domStorageEnabled={true}
          javaScriptEnabled={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}

          // CRITICAL: Prevent incognito mode (would clear storage)
          incognito={false}

          // CRITICAL: Keep storage persistent across navigations
          setSupportMultipleWindows={false}

          // Security & Mixed Content (needed for auth flows)
          mixedContentMode="always"

          // Cache (might help with auth state)
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"

          // UI
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#E67E22" />
            </View>
          )}

          // User Agent (Optional: helps identify app traffic)
          applicationNameForUserAgent={"TBHBeekeeperApp"}

          // Inject JavaScript to catch errors
          injectedJavaScript={`
            window.onerror = function(message, source, lineno, colno, error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                message: message,
                source: source,
                lineno: lineno,
                colno: colno,
                error: error ? error.toString() : null
              }));
              return false;
            };
            
            // Log localStorage availability to debug
            console.log('localStorage available:', typeof localStorage !== 'undefined');
            if (typeof localStorage !== 'undefined') {
              console.log('localStorage keys:', Object.keys(localStorage));
            }
            
            true; // Required for injected JavaScript
          `}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Match your branding
  },
  webview: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
