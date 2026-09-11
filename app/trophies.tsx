import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { speakLabel } from '@/audio/feedback';
import { stopSpeaking } from '@/audio/speech';
import { useNarration } from '@/audio/useNarration';
import { RoundButton } from '@/components/ui/RoundButton';
import { useApp } from '@/context/AppProvider';
import { YEAR_BADGE } from '@/domain/rewards';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { Badge } from '@/types';

/**
 * The trophy shelf (PRD §6.5).
 *
 * Locked badges are shown greyed rather than hidden: seeing what is still to
 * come is the pull, and it lets a child find their way back to a topic they
 * have not finished. There are no marks here — only things won.
 *
 * Everything on this screen comes from the progress stored on the device, so it
 * survives closing the app: the stars and lessons are summed from the saved
 * lesson records, the badges from the saved badge list.
 */
export default function TrophyShelf() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ready, topics, lessons, hasBadge, badges, totals } = useApp();

  /** Every badge the year contains: topic badges, term badges, then the year. */
  const allBadges = useMemo<Badge[]>(() => {
    const seen = new Set<string>();
    const list: Badge[] = [];

    for (const topic of topics) {
      if (topic.badge && !seen.has(topic.badge.id)) {
        seen.add(topic.badge.id);
        list.push(topic.badge);
      }
    }
    for (const lesson of lessons) {
      if (lesson.badge && !seen.has(lesson.badge.id)) {
        seen.add(lesson.badge.id);
        list.push(lesson.badge);
      }
    }
    list.push(YEAR_BADGE);
    return list;
  }, [topics, lessons]);

  const earned = allBadges.filter((badge) => hasBadge(badge.id)).length;
  const yearDone = hasBadge(YEAR_BADGE.id);

  /** Stars first: they are what a child earns every single lesson. */
  const tally = [
    { key: 'stars', emoji: '⭐', value: totals.stars, label: t(ui.myStars) },
    { key: 'lessons', emoji: '✅', value: totals.lessonsDone, label: t(ui.myLessonsDone) },
    { key: 'badges', emoji: '🏅', value: earned, label: t(ui.myBadges) },
  ];

  const spokenTally =
    `You have ${totals.stars} ${totals.stars === 1 ? 'star' : 'stars'}, ` +
    `${totals.lessonsDone} ${totals.lessonsDone === 1 ? 'lesson' : 'lessons'} finished, ` +
    `and ${earned} of ${allBadges.length} badges.`;

  const { replay } = useNarration(
    ready
      ? earned === 0 && totals.lessonsDone === 0
        ? t(ui.noTrophiesYet)
        : `${t(ui.myTrophies)}. ${spokenTally}`
      : null,
  );

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
          <Text style={styles.title}>🏅 {t(ui.myTrophies)}</Text>
          <Text style={styles.subtitle}>
            {earned} of {allBadges.length} won
          </Text>
        </View>
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={replay} />
      </View>

      <View style={styles.tally}>
        {tally.map((entry) => (
          <Pressable
            key={entry.key}
            onPress={() => speakLabel(`${entry.value} ${entry.label}`)}
            accessibilityRole="button"
            accessibilityLabel={`${entry.value} ${entry.label}`}
            style={({ pressed }) => [
              styles.tallyBox,
              shadow.card,
              { transform: [{ scale: pressed ? 0.96 : 1 }] },
            ]}
          >
            <Text style={styles.tallyEmoji}>{entry.emoji}</Text>
            <Text style={styles.tallyValue}>{entry.value}</Text>
            <Text style={styles.tallyLabel}>{entry.label}</Text>
          </Pressable>
        ))}
      </View>

      {yearDone && <Text style={styles.yearBanner}>🏆 {t(ui.yearComplete)}</Text>}
      {badges.length === 0 && <Text style={styles.empty}>{t(ui.noTrophiesYet)}</Text>}

      <View style={styles.shelf}>
        {allBadges.map((badge) => {
          const won = hasBadge(badge.id);
          const label = t(badge.title);

          return (
            <Pressable
              key={badge.id}
              onPress={() => speakLabel(won ? `${label}. You won this!` : `${label}. Not yet.`)}
              accessibilityRole="button"
              accessibilityLabel={won ? `${label}. Won.` : `${label}. Not won yet.`}
              style={({ pressed }) => [
                styles.badge,
                won ? shadow.card : null,
                {
                  borderColor: won ? colours.star : colours.border,
                  backgroundColor: won ? '#FFFBEC' : colours.surface,
                  opacity: won ? 1 : 0.55,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <Text style={styles.badgeEmoji}>{won ? badge.emoji : '🔒'}</Text>
              <Text style={styles.badgeTitle} numberOfLines={3}>
                {label}
              </Text>
            </Pressable>
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
    backgroundColor: colours.background,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headerText: { flex: 1 },
  title: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  subtitle: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },

  tally: { flexDirection: 'row', gap: space.sm },
  tallyBox: {
    flex: 1,
    minHeight: size.touchMin + 24,
    backgroundColor: colours.surface,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    gap: 2,
  },
  tallyEmoji: { fontSize: type.emojiSm },
  tallyValue: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  tallyLabel: { fontSize: type.caption, fontWeight: '700', color: colours.inkSoft },

  yearBanner: {
    fontSize: type.body,
    fontWeight: '900',
    color: colours.primaryDark,
    textAlign: 'center',
  },
  empty: {
    fontSize: type.body,
    fontWeight: '600',
    color: colours.inkSoft,
    textAlign: 'center',
  },

  shelf: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  badge: {
    width: 104,
    minHeight: 118,
    borderRadius: size.radius,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.sm,
    gap: space.xs,
  },
  badgeEmoji: { fontSize: type.emojiLg },
  badgeTitle: {
    fontSize: type.caption,
    fontWeight: '800',
    color: colours.ink,
    textAlign: 'center',
  },
});
