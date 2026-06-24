import React from 'react';
import {
  View, Text, Modal, TouchableOpacity,
  ScrollView, Image, StyleSheet,
} from 'react-native';
import { TASKS, COLORS } from './constants';

export default function DayDetailModal({ visible, dayData, date, dayNumber, onClose }) {
  if (!date) return null;

  const label = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const tasks = dayData?.tasks || Array(7).fill(false);
  const doneCount = tasks.filter(Boolean).length;
  const photo = dayData?.photo || null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dayNum}>Day {dayNumber}</Text>
            <Text style={styles.dateLabel}>{label}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{doneCount}/7 tasks completed</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {TASKS.map((task, i) => {
            const done = tasks[i];
            return (
              <View key={i} style={[styles.taskRow, done && styles.taskRowDone]}>
                <Text style={styles.taskIcon}>{task.icon}</Text>
                <Text style={[styles.taskLabel, done && styles.taskLabelDone]}>{task.label}</Text>
                <Text style={styles.statusIcon}>{done ? '✅' : '❌'}</Text>
              </View>
            );
          })}

          {photo && (
            <View style={styles.photoSection}>
              <Text style={styles.photoLabel}>Progress Photo</Text>
              <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c7c7cc',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  dayNum: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
  },
  dateLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  badge: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.subtext,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  taskRowDone: {
    backgroundColor: COLORS.greenLight,
  },
  taskIcon: {
    fontSize: 20,
    width: 26,
    textAlign: 'center',
  },
  taskLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  taskLabelDone: {
    color: COLORS.green,
  },
  statusIcon: {
    fontSize: 16,
  },
  photoSection: {
    marginTop: 16,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
});
