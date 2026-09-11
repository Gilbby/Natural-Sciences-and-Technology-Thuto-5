import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { celebrateFinish, speakLabel } from '@/audio/feedback';
import { BigButton } from '@/components/ui/BigButton';
import { useApp } from '@/context/AppProvider';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { HabitTrackerActivity, HabitWeek } from '@/types';
import { WEEKDAY_LABELS, WEEKDAY_NAMES, mondayIndex, startOfWeek, toDateKey } from '@/utils/dates';

import type { ActivityViewProps } from './types';

/**
 * `habit-tracker` — the weekly star chart (PRD §7; booklet A6).
 *
 * This is the daily-return mechanic (PRD §6.6), so it outlives the lesson: the
 * week is stored on its own and the chart shows the same stars whenever the
 * child comes back. Today is the tappable column, in rows big enough for a
 * six-year-old; the rest of the week sits underneath as a read-only summary.
 */
export function HabitTracker({ activity, onFinished }: ActivityViewProps<HabitTrackerActivity>) {
  const { loadHabitWeek, saveHabitWeek } = useApp();
  const [week, setWeek] = useState<HabitWeek | null>(null);
  const finished = useRef(false);
  const celebrated = useRef(false);

  const today = new Date();
  const todayIndex = mondayIndex(today);
  const weekStart = toDateKey(startOfWeek(today));

  useEffect(() => {
    let active = true;
    loadHabitWeek(weekStart).then((loaded) => {
      if (active) setWeek(loaded);
    });
    return () => {
      active = false;
    };
  }, [loadHabitWeek, weekStart]);

  const toggleToday = useCallback(
    (habitId: string, label: string) => {
      if (!week) return;

      const key = `${habitId}:${todayIndex}`;
      const nowOn = !week.entries[key];
      const next: HabitWeek = { ...week, entries: { ...week.entries, [key]: nowOn } };

      setWeek(next);
      void saveHabitWeek(next);
      speakLabel(nowOn ? `${label}. Star!` : label);

      const allDone = activity.habits.every((habit) => next.entries[`${habit.id}:${todayIndex}`]);
      if (allDone && !celebrated.current) {
        celebrated.current = true;
        celebrateFinish('You did all your maths practice today! You are a star.');
      }
    },
    [week, activity.habits, saveHabitWeek, todayIndex],
  );

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished({ correct: true, attempts: 1 });
  }, [onFinished]);

  if (!week) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.todayLabel}>Today · {WEEKDAY_NAMES[todayIndex]}</Text>

      <View style={styles.rows}>
        {activity.habits.map((habit) => {
          const on = Boolean(week.entries[`${habit.id}:${todayIndex}`]);
          const label = t(habit.label);

          return (
            <Pressable
              key={habit.id}
              onPress={() => toggleToday(habit.id, label)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.row,
                shadow.card,
                {
                  borderColor: on ? colours.star : colours.border,
                  backgroundColor: on ? '#FFF8E3' : colours.surface,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Text style={styles.rowEmoji}>{habit.emoji}</Text>
              <Text style={styles.rowLabel} numberOfLines={2}>
                {label}
              </Text>
              <Text style={[styles.rowStar, { opacity: on ? 1 : 0.25 }]}>⭐</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>My week</Text>
        <View style={styles.weekHeader}>
          <View style={styles.weekLabelCell} />
          {WEEKDAY_LABELS.map((label, index) => (
            <Text
              key={label}
              style={[styles.weekDay, index === todayIndex && styles.weekDayToday]}
            >
              {label[0]}
            </Text>
          ))}
        </View>
        {activity.habits.map((habit) => (
          <View key={habit.id} style={styles.weekRow}>
            <Text style={styles.weekLabelCell}>{habit.emoji}</Text>
            {WEEKDAY_LABELS.map((_, dayIndex) => (
              <Text key={dayIndex} style={styles.weekCell}>
                {week.entries[`${habit.id}:${dayIndex}`] ? '⭐' : '·'}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <BigButton emoji="✅" label={t(ui.done)} tone="happy" onPress={done} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: space.xxl, alignItems: 'center' },
  container: { gap: space.lg, alignItems: 'stretch' },
  todayLabel: {
    fontSize: type.body,
    fontWeight: '800',
    color: colours.inkSoft,
    textAlign: 'center',
  },
  rows: { gap: space.sm },
  row: {
    minHeight: size.touchMin + 8,
    borderRadius: size.radius,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    gap: space.md,
  },
  rowEmoji: { fontSize: type.emojiSm },
  rowLabel: { flex: 1, fontSize: type.body, fontWeight: '700', color: colours.ink },
  rowStar: { fontSize: type.emojiSm },
  weekCard: {
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    padding: space.md,
    gap: space.xs,
  },
  weekTitle: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekHeader: { flexDirection: 'row', alignItems: 'center' },
  weekRow: { flexDirection: 'row', alignItems: 'center' },
  weekLabelCell: { width: 32, fontSize: 18, textAlign: 'center' },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: type.caption,
    fontWeight: '800',
    color: colours.inkSoft,
  },
  weekDayToday: { color: colours.primary },
  weekCell: { flex: 1, textAlign: 'center', fontSize: 16, color: colours.inkSoft },
});
