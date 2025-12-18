import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🐝</Text>
      <Text style={styles.title}>TBH Beekeeper</Text>
      <Text style={styles.subtitle}>Mobile App</Text>
      <StatusBar style="auto" />
      <Text style={styles.info}>
        Setting up navigation and database...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A3C28',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B4513',
    marginBottom: 32,
  },
  info: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
