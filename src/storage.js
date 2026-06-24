import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '75hard_v2';

export async function loadState() {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveState(state) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
