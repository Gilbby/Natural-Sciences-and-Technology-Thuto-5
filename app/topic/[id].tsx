import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { speak, stopSpeaking } from '@/audio/speech';
import { useNarration } from '@/audio/useNarration';
import { BigButton } from '@/components/ui/BigButton';
import { LessonRow } from '@/components/ui/LessonRow';
import { RoundButton } from '@/components/ui/RoundButton';
import { useApp } from '@/context/AppProvider';
import { completionOf, findTopicGroup } from '@/domain/curriculum';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import { MONTH_NAMES } from '@/utils/dates';

/**
 * How the five content areas are said out loud to a ten-year-old (PRD §5.2).
 *
 * **Carried across from *Mathematics Thuto 4* rather than re-invented** — a
 * Grade 4 decision the child will already have heard for a year. "Numbers,
 * Operations and Relationships" is what CAPS calls the first area and it is not
 * what anybody has ever said to a child; curriculum vocabulary belongs in the
 * parent note, not in the child's ear.
 */
const CONTENT_AREA_LABEL: Record<string, string> = {
  NUM: 'Numbers',
  PAT: 'Patterns',
  SPA: 'Shape and space',
  MEA: 'Measuring',
  DAT: 'Data and chance',
};

/**
 * One CAPS topic and its lessons (PRD §5.3).
 *
 * The parent note sits at the bottom rather than the top: it is written for the
 * adult who wanders past, and a child should meet the lessons first (PRD §6.7).
 */
export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ready, subjectGroups, schedule, isComplete, hasBadge } = useApp();

  const group = useMemo(() => findTopicGroup(subjectGroups, id), [subjectGroups, id]);
  const topic = group?.topic ?? null;

  const dateFor = useCallback(
    (lessonId: string) => {
      const entry = schedule.find((item) => item.lesson._id === lessonId);
      if (!entry) return undefined;
      return `${entry.date.getDate()} ${MONTH_NAMES[entry.date.getMonth()]}`;
    },
    [schedule],
  );

  const { replay } = useNarration(
    ready && topic ? `${t(topic.title)}. ${t(ui.tapALesson)}` : null,
  );

  const areaLine = topic ? `This is ${CONTENT_AREA_LABEL[topic.area] ?? topic.area}.` : '';
  const speakArea = useCallback(() => {
    if (topic) speak(`This is ${CONTENT_AREA_LABEL[topic.area] ?? topic.area}.`);
  }, [topic]);

  const goBack = useCallback(() => {
    stopSpeaking();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  if (!group || !topic) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <Text style={styles.missingEmoji}>🧭</Text>
        <Text style={styles.missingText}>{t(ui.noLessonsYet)}</Text>
        <BigButton emoji="🏠" label={t(ui.home)} onPress={() => router.replace('/')} />
      </View>
    );
  }

  const progress = completionOf(group.lessons, isComplete);
  const badgeEarned = Boolean(topic.badge && hasBadge(topic.badge.id));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.xxl },
      ]}
    >
      <View style={styles.header}>
        <RoundButton emoji="◀️" label={t(ui.back)} onPress={goBack} />
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {topic.emoji} {t(topic.title)}
          </Text>
          <Text style={styles.subtitle}>
            Term {topic.term} ·{' '}
            {topic.weekStart === topic.weekEnd
              ? `Week ${topic.weekStart}`
              : `Weeks ${topic.weekStart}–${topic.weekEnd}`}
          </Text>
        </View>
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={replay} />
      </View>

      {topic.badge && (
        <View
          style={[
            styles.badgeCard,
            { borderColor: badgeEarned ? colours.star : colours.border },
            badgeEarned && styles.badgeCardEarned,
          ]}
        >
          <Text style={[styles.badgeEmoji, !badgeEarned && styles.badgeLocked]}>
            {topic.badge.emoji}
          </Text>
          <View style={styles.badgeText}>
            <Text style={styles.badgeTitle}>{t(topic.badge.title)}</Text>
            <Text style={styles.badgeHint}>
              {badgeEarned
                ? 'You won this badge!'
                : `Finish all ${progress.total} lessons to win this badge.`}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.lessonList}>
        {group.lessons.map((lesson) => (
          <LessonRow
            key={lesson._id}
            lesson={lesson}
            done={isComplete(lesson._id)}
            caption={dateFor(lesson._id)}
            onPress={() => router.push(`/lesson/${lesson._id}`)}
          />
        ))}
      </View>

      {/* PRD §5.2: the content area, said plainly. A label, not a spine. */}
      <Pressable
        onPress={speakArea}
        accessibilityRole="button"
        accessibilityLabel={areaLine}
        style={styles.makingCard}
      >
        <Text style={styles.makingEmoji}>{topic.emoji}</Text>
        <Text style={styles.makingText}>{areaLine}</Text>
      </Pressable>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>For the grown-ups</Text>
        <Text style={styles.noteBody}>{t(topic.parentNote)}</Text>
        <Text style={styles.noteAreas}>
          {CONTENT_AREA_LABEL[topic.area] ?? topic.area}
        </Text>
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
  missingEmoji: { fontSize: type.emojiXl },
  missingText: { fontSize: type.title, fontWeight: '800', color: colours.ink },

  makingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    padding: space.lg,
    minHeight: size.touchMin,
  },
  makingEmoji: { fontSize: type.emojiMd },
  makingText: { flex: 1, fontSize: type.body, fontWeight: '700', color: colours.ink },

  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headerText: { flex: 1 },
  title: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  subtitle: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },

  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    padding: space.lg,
    ...shadow.card,
  },
  badgeCardEarned: { backgroundColor: '#FFFBEC' },
  badgeEmoji: { fontSize: type.emojiLg },
  badgeLocked: { opacity: 0.3 },
  badgeText: { flex: 1, gap: 2 },
  badgeTitle: { fontSize: type.body, fontWeight: '900', color: colours.ink },
  badgeHint: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '600' },

  lessonList: { gap: space.sm },

  noteCard: {
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    padding: space.lg,
    gap: space.xs,
  },
  noteTitle: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  noteBody: { fontSize: type.body, color: colours.ink, fontWeight: '600', lineHeight: 23 },
  noteAreas: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },
});
