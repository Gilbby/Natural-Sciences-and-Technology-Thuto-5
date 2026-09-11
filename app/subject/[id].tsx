import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { speak, stopSpeaking } from '@/audio/speech';
import { useNarration } from '@/audio/useNarration';
import { BigButton } from '@/components/ui/BigButton';
import { RoundButton } from '@/components/ui/RoundButton';
import { TopicRow } from '@/components/ui/TopicRow';
import { useApp } from '@/context/AppProvider';
import { completionOf, findSubjectGroup } from '@/domain/curriculum';
import { t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * A subject, with its topics grouped by term (PRD §5.1, §6.1).
 *
 * This is the other way into the year: the calendar shows *when*, this shows
 * *what*. A child who wants to go back to the animals does not have to
 * remember which week they were in.
 */
export default function SubjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ready, subjectGroups, isComplete, hasBadge } = useApp();

  const group = useMemo(() => findSubjectGroup(subjectGroups, id), [subjectGroups, id]);
  const title = group ? t(group.subject.title) : '';

  const { replay } = useNarration(ready && group ? `${title}. ${t(ui.tapATopic)}` : null);

  const goHome = useCallback(() => {
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

  if (!group) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <Text style={styles.missingEmoji}>🧭</Text>
        <Text style={styles.missingText}>{t(ui.noLessonsYet)}</Text>
        <BigButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
      </View>
    );
  }

  const overall = completionOf(group.lessons, isComplete);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + space.xxl },
      ]}
    >
      <View style={styles.header}>
        <RoundButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {group.subject.emoji} {title}
          </Text>
          <Text style={styles.subtitle}>
            {overall.done} of {overall.total} lessons done
          </Text>
        </View>
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={replay} />
      </View>

      {group.terms.map((term) => {
        const termProgress = completionOf(term.lessons, isComplete);

        return (
          <View key={term.term} style={styles.termBlock}>
            <View style={[styles.termHeader, { backgroundColor: term.plan.colour }]}>
              <Text style={styles.termEmoji}>{term.plan.emoji}</Text>
              <View style={styles.termHeaderText}>
                <Text style={styles.termTitle}>{t(term.plan.title)}</Text>
                <Text style={styles.termSubtitle} numberOfLines={2}>
                  {t(term.plan.subtitle)}
                </Text>
              </View>
              {termProgress.complete && <Text style={styles.termStar}>⭐</Text>}
            </View>

            {term.topics.map((topicGroup) => (
              <TopicRow
                key={topicGroup.topic._id}
                group={topicGroup}
                progress={completionOf(topicGroup.lessons, isComplete)}
                earnedBadge={Boolean(
                  topicGroup.topic.badge && hasBadge(topicGroup.topic.badge.id),
                )}
                onPress={() => {
                  speak(t(topicGroup.topic.title));
                  router.push(`/topic/${topicGroup.topic._id}`);
                }}
              />
            ))}
          </View>
        );
      })}
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

  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headerText: { flex: 1 },
  title: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  subtitle: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '600' },

  termBlock: { gap: space.sm },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderRadius: size.radiusLg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    ...shadow.card,
  },
  termEmoji: { fontSize: type.emojiSm },
  termHeaderText: { flex: 1 },
  termTitle: { fontSize: type.title, fontWeight: '900', color: '#FFFFFF' },
  termSubtitle: { fontSize: type.caption, fontWeight: '700', color: 'rgba(255,255,255,0.92)' },
  termStar: { fontSize: type.emojiSm },
});
