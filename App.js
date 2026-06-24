import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { loadState, saveState } from './src/storage';
import { MIGRATION_DATA } from './src/migrationData';
import { COLORS } from './src/constants';
import TodayScreen from './src/TodayScreen';
import ProgressScreen from './src/ProgressScreen';

export default function App() {
  const [appState, setAppState] = useState(null);
  const [activeTab, setActiveTab] = useState('today');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState().then(existing => {
      if (existing) {
        setAppState(existing);
      } else {
        setAppState(MIGRATION_DATA);
        saveState(MIGRATION_DATA);
      }
      setReady(true);
    });
  }, []);

  async function handleUpdate(newState) {
    setAppState(newState);
    await saveState(newState);
  }

  if (!ready) return <View style={styles.loading} />;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        {activeTab === 'today' ? (
          <TodayScreen
            state={appState}
            onUpdate={handleUpdate}
            activeTab={activeTab}
            onSwitchTab={setActiveTab}
          />
        ) : (
          <ProgressScreen
            state={appState}
            activeTab={activeTab}
            onSwitchTab={setActiveTab}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
