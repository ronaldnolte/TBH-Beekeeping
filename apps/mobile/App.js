import React, { useRef, useState, useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Linking, View, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Production URL
const WEB_APP_URL = 'https://beta.beektools.com';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [key, setKey] = useState(0);
  const [initialScript, setInitialScript] = useState(null);

  // Load saved session from phone storage on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AsyncStorage.getItem('supabase-session');
        if (session) {
          console.log('Restoring native session...');
          const script = `
            try {
              window.localStorage.setItem('supabase.auth.token', ${JSON.stringify(session)});
              console.log('Native session restored to localStorage');
            } catch (e) {
              console.error('Failed to restore native session', e);
            }
            true;
          `;
          setInitialScript(script);
        } else {
          setInitialScript('true;');
        }
      } catch (e) {
        console.error('Failed to load native session', e);
        setInitialScript('true;');
      }
    };
    loadSession();
  }, []);

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
    // ... existing navigation logic can remain or be simplified ...
  };

  // Handle messages from WebView (saving session)
  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Save session when Supabase updates it
      if (data.type === 'SUPABASE_SESSION_UPDATE') {
        console.log('Saving session to native storage...');
        await AsyncStorage.setItem('supabase-session', JSON.stringify(data.session));
      }
    } catch (e) {
      // Ignore non-JSON messages
    }
  };

  if (initialScript === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#E67E22" />
      </View>
    );
  }

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
          onMessage={handleMessage}

          domStorageEnabled={true}
          javaScriptEnabled={true}
          sharedCookiesEnabled={true}
          cacheEnabled={true}
          incognito={false}
          thirdPartyCookiesEnabled={true}

          // Inject session restoration script
          injectedJavaScriptBeforeContentLoaded={initialScript}

          // Monitor localStorage for changes and send to native
          injectedJavaScript={`
            // Watch for Supabase token changes
            const originalSetItem = window.localStorage.setItem;
            const originalRemoveItem = window.localStorage.removeItem;

            window.localStorage.setItem = function(key, value) {
              if (key === 'supabase.auth.token') {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'SUPABASE_SESSION_UPDATE',
                  session: value
                }));
              }
              originalSetItem.apply(this, arguments);
            };

            // Check if token already exists (e.g. after login)
            const existingToken = window.localStorage.getItem('supabase.auth.token');
            if (existingToken) {
               window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'SUPABASE_SESSION_UPDATE',
                  session: existingToken
                }));
            }
            
            true;
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
