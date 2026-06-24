import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { TASKS, COLORS } from './constants';
import { todayStr, dayIndex } from './dateUtils';

export default function TodayScreen({ state, onUpdate, activeTab, onSwitchTab }) {
  const today = todayStr();
  const dayIdx = dayIndex(state.startDate);
  const dayData = state.days[today] || { tasks: Array(7).fill(false), photo: null };

  async function toggleTask(i) {
    const updated = { ...dayData, tasks: [...dayData.tasks] };
    updated.tasks[i] = !updated.tasks[i];
    const newState = {
      ...state,
      days: { ...state.days, [today]: updated },
    };
    await onUpdate(newState);
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access in Settings to take progress photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const dest = FileSystem.documentDirectory + `photo_${today}.jpg`;
      await FileSystem.copyAsync({ from: uri, to: dest });

      const updated = { ...dayData, tasks: [...dayData.tasks], photo: dest };
      updated.tasks[2] = true;
      const newState = {
        ...state,
        days: { ...state.days, [today]: updated },
      };
      await onUpdate(newState);
    }
  }

  const doneCount = dayData.tasks.filter(Boolean).length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'today' && styles.navBtnActive]}
          onPress={() => onSwitchTab('today')}
        >
          <Text style={[styles.navText, activeTab === 'today' && styles.navTextActive]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, activeTab === 'progress' && styles.navBtnActive]}
          onPress={() => onSwitchTab('progress')}
        >
          <Text style={[styles.navText, activeTab === 'progress' && styles.navTextActive]}>Progress</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dayHeading}>
            {dayIdx < 0 ? 'Starting soon' : `Day ${dayIdx + 1}`}
          </Text>
          <Text style={styles.dateText}>
            {dayIdx < 0
              ? 'Your challenge hasn\'t started yet'
              : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          {dayIdx >= 0 && (
            <Text style={styles.countText}>{doneCount}/7 complete</Text>
          )}
        </View>

        {TASKS.map((task, i) => {
          const done = dayData.tasks[i];
          return (
            <TouchableOpacity
              key={i}
              style={[styles.taskItem, done && styles.taskItemDone]}
              onPress={() => dayIdx >= 0 && toggleTask(i)}
              activeOpacity={0.7}
            >
              <Text style={styles.taskIcon}>{task.icon}</Text>
              <Text style={[styles.taskLabel, done && styles.taskLabelDone]}>{task.label}</Text>

              {task.hasCamera && dayIdx >= 0 && (
                <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
                  <Text style={styles.cameraBtnText}>📷</Text>
                </TouchableOpacity>
              )}

              <View style={[styles.circle, done && styles.circleDone]}>
                {done && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: '#e5e5ea',
    borderRadius: 10,
    margin: 16,
    marginBottom: 0,
    padding: 3,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  navBtnActive: {
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.subtext,
  },
  navTextActive: {
    color: COLORS.text,
  },
  scroll: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  dayHeading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 4,
  },
  countText: {
    fontSize: 13,
    color: COLORS.green,
    marginTop: 4,
    fontWeight: '600',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  taskItemDone: {
    backgroundColor: COLORS.greenLight,
  },
  taskIcon: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  taskLabel: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
  },
  taskLabelDone: {
    color: COLORS.green,
  },
  cameraBtn: {
    padding: 4,
  },
  cameraBtnText: {
    fontSize: 20,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#c7c7cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
