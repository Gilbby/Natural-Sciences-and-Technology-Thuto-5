import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { speakLabel } from '@/audio/feedback';
import { speak } from '@/audio/speech';
import { useNarration } from '@/audio/useNarration';
import { BigButton } from '@/components/ui/BigButton';
import { DailyCard } from '@/components/ui/DailyCard';
import { RoundButton } from '@/components/ui/RoundButton';
import { SubjectTile } from '@/components/ui/SubjectTile';
import { useApp } from '@/context/AppProvider';
import { completionOf } from '@/domain/curriculum';
import { buildSchedule, groupByDate, resolveTodaysLesson } from '@/domain/schedule';
import { currentTerm, resolveSchoolYear, spokenPosition, termOn } from '@/domain/schoolYear';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  isSameDay,
  monthMatrix,
  spokenDate,
  startOfDay,
  toDateKey,
} from '@/utils/dates';

/**
 * The calendar home screen — the navigation surface (PRD §5.1, §6.1).
 *
 * A child never has to read anything here: the greeting is spoken on open,
 * every tile is a colour and an emoji, and "Today's lesson" is the shortcut so
 * nobody has to hunt. The calendar comes first because it is the thing a child
 * opens the app for; the daily rhythms the ATP requires sit under it.
 */
export default function CalendarHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const {
    ready,
    schedule,
    topics,
    lessons,
    schoolYear,
    subjectGroups,
    rhythms,
    today: dailyRecord,
    isComplete,
    badges,
  } = useApp();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const term = useMemo(() => currentTerm(schoolYear, today), [schoolYear, today]);
  const inTerm = useMemo(() => termOn(schoolYear, today), [schoolYear, today]);

  const greeting = ready ? `${t(ui.homeGreeting)} ${spokenPosition(schoolYear, today)}.` : null;
  const { replay } = useNarration(greeting);

  const viewedYear = useMemo(
    () => resolveSchoolYear(viewDate, toDateKey(schoolYear.start)),
    [schoolYear.start, viewDate],
  );
  const viewedSchedule = useMemo(
    () => buildSchedule(viewedYear, topics, lessons),
    [lessons, topics, viewedYear],
  );
  const byDate = useMemo(() => groupByDate(viewedSchedule), [viewedSchedule]);
  const todays = useMemo(
    () => resolveTodaysLesson(schedule, today, isComplete),
    [schedule, today, isComplete],
  );

  const cellSize = Math.floor((width - space.lg * 2 - space.xs * 6) / 7);

  const openLesson = useCallback(
    (lessonId: string) => router.push(`/lesson/${lessonId}`),
    [router],
  );

  const tapDay = useCallback(
    (date: Date) => {
      const entries = byDate.get(toDateKey(date)) ?? [];
      if (entries.length > 0) {
        // Open the first thing still to do, so a revisited day moves forward.
        const next = entries.find((entry) => !isComplete(entry.lesson._id)) ?? entries[0];
        openLesson(next.lesson._id);
        return;
      }
      // Empty days still answer back, so a tap is never a dead end (PRD §4.5).
      speak(`${spokenDate(date)}. ${spokenPosition(schoolYear, date)}. No lesson on this day.`);
    },
    [byDate, isComplete, openLesson, schoolYear],
  );

  const changeMonth = useCallback((delta: number) => {
    setViewDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      speak(`${MONTH_NAMES[next.getMonth()]} ${next.getFullYear()}`);
      return next;
    });
  }, []);

  const jumpToTerm = useCallback(
    (delta: number) => {
      const index = schoolYear.terms.findIndex((entry) => entry.term === term.term);
      const next = schoolYear.terms[Math.min(3, Math.max(0, index + delta))];
      setViewDate(new Date(next.start.getFullYear(), next.start.getMonth(), 1));
      speak(`${t(next.plan.title)}. ${t(next.plan.subtitle)}.`);
    },
    [schoolYear.terms, term.term],
  );

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingEmoji}>💬</Text>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  const weeks = monthMatrix(viewDate.getFullYear(), viewDate.getMonth());
  const monthLabel = `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  // The word that went on the wall today, shown back on the rhythm card so the
  // calendar can say what was done without opening it.
  const wordToday = dailyRecord.word;

  const rhythmDone = (marks: string): boolean => {
    if (marks === 'wordAdded') return dailyRecord.word !== null;
    if (marks === 'movedToday') return dailyRecord.movedToday;
    return dailyRecord.washDone;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.xxl },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.appName}>{t(ui.subtitle)}</Text>
          <Text style={styles.greeting}>{t(ui.homeGreeting)}</Text>
        </View>
        <RoundButton emoji="🏅" label={t(ui.myTrophies)} onPress={() => router.push('/trophies')} />
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={replay} />
      </View>

      {todays && (
        <BigButton
          emoji={todays.entry.lesson.emoji}
          label={`${t(todays.isToday ? ui.todaysLesson : ui.nextLesson)}: ${t(todays.entry.lesson.title)}`}
          onPress={() => openLesson(todays.entry.lesson._id)}
          block
        />
      )}

      {!inTerm && <Text style={styles.holiday}>🌴 {t(ui.holiday)}</Text>}

      <View style={styles.monthBar}>
        <RoundButton
          emoji="◀️"
          label={t(ui.previousMonth)}
          onPress={() => changeMonth(-1)}
          diameter={52}
        />
        <Pressable
          onPress={() => speakLabel(monthLabel)}
          accessibilityRole="header"
          accessibilityLabel={monthLabel}
          style={styles.monthLabelWrap}
        >
          <Text style={styles.monthLabel}>{monthLabel}</Text>
        </Pressable>
        <RoundButton
          emoji="▶️"
          label={t(ui.nextMonth)}
          onPress={() => changeMonth(1)}
          diameter={52}
        />
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={[styles.weekday, { width: cellSize }]}>
            {label[0]}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((date, dayIndex) => {
              if (!date) {
                return <View key={dayIndex} style={{ width: cellSize, height: cellSize }} />;
              }

              const entries = byDate.get(toDateKey(date)) ?? [];
              const first = entries[0];
              const allDone = entries.length > 0 && entries.every((e) => isComplete(e.lesson._id));
              const isToday = isSameDay(date, today);

              return (
                <Pressable
                  key={dayIndex}
                  onPress={() => tapDay(date)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    first ? `${spokenDate(date)}. ${t(first.lesson.title)}` : spokenDate(date)
                  }
                  style={({ pressed }) => [
                    styles.cell,
                    first ? shadow.card : null,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: first ? first.lesson.colour : colours.surface,
                      borderColor: isToday
                        ? colours.ink
                        : first
                          ? first.lesson.colour
                          : colours.border,
                      borderWidth: isToday ? 3 : 2,
                      transform: [{ scale: pressed ? 0.94 : 1 }],
                    },
                  ]}
                >
                  <Text style={[styles.dayNumber, first && styles.dayNumberOnTile]}>
                    {date.getDate()}
                  </Text>
                  {first && <Text style={styles.cellEmoji}>{first.lesson.emoji}</Text>}
                  {entries.length > 1 && <Text style={styles.cellCount}>+{entries.length - 1}</Text>}
                  {allDone && <Text style={styles.cellStar}>⭐</Text>}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={[styles.termBar, { borderColor: term.plan.colour }]}>
        <RoundButton
          emoji="◀️"
          label={t(ui.previousTerm)}
          onPress={() => jumpToTerm(-1)}
          diameter={52}
        />
        <Pressable
          onPress={() => speakLabel(`${t(term.plan.title)}. ${t(term.plan.subtitle)}.`)}
          accessibilityRole="header"
          accessibilityLabel={`${t(term.plan.title)}. ${t(term.plan.subtitle)}`}
          style={styles.termLabelWrap}
        >
          <Text style={styles.termTitle}>
            {term.plan.emoji} {t(term.plan.title)}
          </Text>
          <Text style={styles.termSubtitle} numberOfLines={2}>
            {t(term.plan.subtitle)}
          </Text>
        </Pressable>
        <RoundButton
          emoji="▶️"
          label={t(ui.nextTerm)}
          onPress={() => jumpToTerm(1)}
          diameter={52}
        />
      </View>

      <Text style={styles.sectionTitle}>{t(ui.everyDay)}</Text>
      <View style={styles.rhythmList}>
        {rhythms.map((rhythm) => (
          <DailyCard
            key={rhythm._id}
            rhythm={rhythm}
            done={rhythmDone(rhythm.marks)}
            summaryWord={rhythm.marks === 'wordAdded' ? wordToday : null}
            onPress={() => router.push(`/daily/${rhythm._id}`)}
          />
        ))}
      </View>

      <View style={styles.subjectsHeader}>
        <Text style={styles.sectionTitle}>{t(ui.myLessons)}</Text>
        {badges.length > 0 && (
          <Pressable
            onPress={() => router.push('/trophies')}
            accessibilityRole="button"
            accessibilityLabel={`${badges.length} badges earned`}
          >
            <Text style={styles.badgeCount}>🏅 {badges.length}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.subjectList}>
        {subjectGroups.map((group) => {
          const progress = completionOf(group.lessons, isComplete);
          const termsComplete = [1, 2, 3, 4].map((termNumber) => {
            const found = group.terms.find((entry) => entry.term === termNumber);
            return found ? completionOf(found.lessons, isComplete).complete : false;
          });

          return (
            <SubjectTile
              key={group.subject._id}
              group={group}
              progress={progress}
              termsComplete={termsComplete}
              onPress={() => router.push(`/subject/${group.subject._id}`)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  content: { paddingHorizontal: space.lg, gap: space.lg },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.lg,
    backgroundColor: colours.background,
  },
  loadingEmoji: { fontSize: type.emojiXl },

  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  headerText: { flex: 1 },
  appName: { fontSize: type.display, fontWeight: '900', color: colours.ink },
  greeting: { fontSize: type.body, color: colours.inkSoft, fontWeight: '600' },

  holiday: {
    fontSize: type.body,
    fontWeight: '700',
    color: colours.inkSoft,
    textAlign: 'center',
  },

  rhythmList: { gap: space.sm },

  termBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    gap: space.sm,
  },
  termLabelWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2 },
  termTitle: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  termSubtitle: {
    fontSize: type.caption,
    fontWeight: '600',
    color: colours.inkSoft,
    textAlign: 'center',
  },

  monthBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  monthLabelWrap: {
    flex: 1,
    alignItems: 'center',
    minHeight: size.touchMin,
    justifyContent: 'center',
  },
  monthLabel: { fontSize: type.title, fontWeight: '900', color: colours.ink },

  weekdayRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekday: {
    textAlign: 'center',
    fontSize: type.caption,
    fontWeight: '800',
    color: colours.inkSoft,
  },

  grid: { gap: space.xs },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { borderRadius: size.radius, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },
  dayNumberOnTile: { color: 'rgba(255,255,255,0.92)' },
  cellEmoji: { fontSize: 24 },
  cellCount: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.95)',
  },
  cellStar: { position: 'absolute', bottom: 2, right: 2, fontSize: 13 },

  subjectsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.sm,
  },
  sectionTitle: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  badgeCount: { fontSize: type.body, fontWeight: '800', color: colours.inkSoft },

  subjectList: { gap: space.sm },
});
