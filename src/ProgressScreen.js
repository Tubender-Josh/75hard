import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { COLORS } from './constants';
import { todayStr, toStr, dayIndex, addDays } from './dateUtils';
import DayDetailModal from './DayDetailModal';

export default function ProgressScreen({ state, activeTab, onSwitchTab }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const { width } = useWindowDimensions();

  const today = todayStr();
  const dayIdx = dayIndex(state.startDate);
  const startDate = new Date(state.startDate + 'T00:00:00');

  // Current streak: count back from yesterday (skip today if not all done)
  let currentStreak = 0;
  for (let i = dayIdx; i >= 0; i--) {
    const ds = toStr(addDays(state.startDate, i));
    const d = state.days[ds];
    const count = d ? d.tasks.filter(Boolean).length : 0;
    if (i === dayIdx && count < 7) continue;
    if (count === 7) currentStreak++;
    else break;
  }

  // Best streak
  let bestStreak = 0, run = 0;
  for (let i = 0; i <= dayIdx; i++) {
    const ds = toStr(addDays(state.startDate, i));
    const d = state.days[ds];
    const count = d ? d.tasks.filter(Boolean).length : 0;
    if (count === 7) { run++; if (run > bestStreak) bestStreak = run; }
    else if (i < dayIdx) run = 0;
  }

  // Build calendar weeks
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const startDow = startDate.getDay();
  const firstMonday = new Date(startDate);
  firstMonday.setDate(firstMonday.getDate() - (startDow === 0 ? 6 : startDow - 1));

  const todayDow = todayDate.getDay();
  const lastSunday = new Date(todayDate);
  lastSunday.setDate(lastSunday.getDate() + (todayDow === 0 ? 0 : 7 - todayDow));

  const weeks = [];
  let cur = new Date(firstMonday);
  let lastMonth = -1;
  while (cur <= lastSunday) {
    const week = { monthLabel: null, cells: [] };
    if (cur.getMonth() !== lastMonth) {
      lastMonth = cur.getMonth();
      week.monthLabel = cur.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    for (let d = 0; d < 7; d++) {
      const cell = new Date(cur);
      cell.setDate(cell.getDate() + d);
      week.cells.push(new Date(cell));
    }
    weeks.push(week);
    cur.setDate(cur.getDate() + 7);
  }

  const cellSize = Math.floor((width - 32 - 12) / 7);

  function getCellStyle(date) {
    const ds = toStr(date);
    if (date < startDate || date > todayDate) return 'empty';
    if (ds === today) return 'today';
    const d = state.days[ds];
    const count = d ? d.tasks.filter(Boolean).length : 0;
    if (count === 7) return 'complete';
    if (count > 0) return 'partial';
    return 'missed';
  }

  function getCellLabel(date, cellStyle) {
    if (cellStyle === 'empty') return '';
    const ds = toStr(date);
    if (cellStyle === 'partial') {
      const d = state.days[ds];
      const count = d ? d.tasks.filter(Boolean).length : 0;
      return `${count}/7`;
    }
    return String(date.getDate());
  }

  function handleCellPress(date) {
    const ds = toStr(date);
    if (date < startDate || date > todayDate) return;
    setSelectedDate(ds);
  }

  const selectedDayData = selectedDate ? state.days[selectedDate] : null;
  const selectedDayNumber = selectedDate
    ? Math.floor((new Date(selectedDate + 'T00:00:00') - startDate) / 86400000) + 1
    : null;

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
        <Text style={styles.heading}>Progress</Text>

        <View style={styles.statsBanner}>
          <View style={styles.statBlock}>
            <Text style={styles.statNum}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statNum}>{bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBlock}>
            <Text style={styles.statNum}>{Math.max(0, 75 - currentStreak)}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        {/* Day of week header */}
        <View style={styles.dowRow}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <View key={i} style={[styles.dowCell, { width: cellSize }]}>
              <Text style={styles.dowText}>{d}</Text>
            </View>
          ))}
        </View>

        {weeks.map((week, wi) => (
          <View key={wi}>
            {week.monthLabel && (
              <Text style={styles.monthLabel}>{week.monthLabel}</Text>
            )}
            <View style={styles.weekRow}>
              {week.cells.map((date, di) => {
                const cellStyle = getCellStyle(date);
                const label = getCellLabel(date, cellStyle);
                const isSmall = label.includes('/');
                return (
                  <TouchableOpacity
                    key={di}
                    onPress={() => handleCellPress(date)}
                    activeOpacity={cellStyle === 'empty' ? 1 : 0.7}
                    style={[
                      styles.cell,
                      { width: cellSize, height: cellSize },
                      cellStyle === 'complete' && styles.cellComplete,
                      cellStyle === 'partial' && styles.cellPartial,
                      cellStyle === 'missed' && styles.cellMissed,
                      cellStyle === 'today' && styles.cellToday,
                    ]}
                  >
                    <Text style={[
                      styles.cellText,
                      isSmall && styles.cellTextSmall,
                      cellStyle === 'missed' && styles.cellTextLight,
                      cellStyle === 'complete' && styles.cellTextDark,
                      cellStyle === 'partial' && styles.cellTextYellow,
                      (cellStyle === 'today') && styles.cellTextLight,
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.legend}>
          {[
            { color: COLORS.green, label: 'Complete' },
            { color: COLORS.yellow, label: 'Partial' },
            { color: COLORS.blue, label: 'Today' },
            { color: COLORS.red, label: 'Missed' },
          ].map(({ color, label }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.journeyText}>
          Day {Math.max(dayIdx + 1, 1)} of your journey
        </Text>
      </ScrollView>

      <DayDetailModal
        visible={!!selectedDate}
        dayData={selectedDayData}
        date={selectedDate}
        dayNumber={selectedDayNumber}
        onClose={() => setSelectedDate(null)}
      />
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
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  statsBanner: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.subtext,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  dowRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 4,
  },
  dowCell: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  dowText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#aeaeb2',
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingTop: 10,
    paddingBottom: 4,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 2,
  },
  cell: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellComplete: { backgroundColor: COLORS.green },
  cellPartial: { backgroundColor: COLORS.yellow },
  cellMissed: { backgroundColor: COLORS.red },
  cellToday: { backgroundColor: COLORS.blue },
  cellText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.text,
  },
  cellTextSmall: {
    fontSize: 7,
  },
  cellTextLight: {
    color: '#ffffff',
  },
  cellTextDark: {
    color: '#085041',
  },
  cellTextYellow: {
    color: '#7A5500',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.subtext,
  },
  journeyText: {
    fontSize: 13,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});
