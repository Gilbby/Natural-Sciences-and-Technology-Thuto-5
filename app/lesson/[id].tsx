import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { setCareMode } from '@/audio/feedback';
import { speakSequence, stopSpeaking } from '@/audio/speech';
import { ActivityRenderer } from '@/components/activities/ActivityRenderer';
import { BigButton } from '@/components/ui/BigButton';
import { Celebration } from '@/components/ui/Celebration';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { RoundButton } from '@/components/ui/RoundButton';
import { useApp } from '@/context/AppProvider';
import { STARS_PER_LESSON } from '@/domain/rewards';
import { promptText, t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { Badge } from '@/types';

/**
 * The lesson player — the core engine (PRD §6.3).
 *
 * It owns everything that is the same in every lesson: narration on entry, the
 * always-available replay, the picture progress dots, the persistent Home
 * control, the advance between activities, and the celebration at the end. An
 * activity component only has to say when the child has finished it.
 *
 * **Two lines change in this fork and both are in the feedback path** (PRD
 * §6.3):
 *
 *   1. **A `careful` topic turns the praise bank down.** The quieter care bank
 *      is spoken for every correct answer inside one (PRD §4.15, §8.3).
 *   2. **An activity carrying a `safety` line speaks it before its own
 *      prompt.** That happens inside `MoveAlong` through the intro hook this
 *      screen already hands every activity — the player passes the slot, the
 *      component puts the safety line first (PRD §7.2, §1.1 rule 1).
 */
export default function LessonPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ready, lessons, topics, recordActivityResult, finishLesson, isComplete } = useApp();

  const lesson = useMemo(() => lessons.find((entry) => entry._id === id) ?? null, [lessons, id]);
  const topic = useMemo(
    () => topics.find((entry) => entry._id === lesson?.topicId) ?? null,
    [topics, lesson?.topicId],
  );

  const [activityIndex, setActivityIndex] = useState(0);
  const [activityDone, setActivityDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  const activity = lesson?.activities[activityIndex] ?? null;
  const replayOverride = useRef<(() => void) | null>(null);
  const activityIntro = useRef<(() => void) | null>(null);

  // Announce the lesson on entry, then each activity as the child reaches it.
  useEffect(() => {
    if (!lesson || !activity) return;
    const lines =
      activityIndex === 0
        ? [t(lesson.title), promptText(activity.prompt)]
        : [promptText(activity.prompt)];
    // The activity's own opening line follows the prompt rather than racing
    // it — see `onRegisterIntro` in the activity contract.
    speakSequence(lines, () => activityIntro.current?.());
  }, [lesson, activity, activityIndex]);

  useEffect(() => stopSpeaking, []);

  /*
   * Care mode — PRD §4.15, §8.3. Set from the topic on the way in, cleared on
   * the way out, so that no component has to know which topic it is in.
   */
  useEffect(() => {
    setCareMode(topic?.careful === true);
    return () => setCareMode(false);
  }, [topic?.careful]);

  const goHome = useCallback(() => {
    stopSpeaking();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  const registerReplay = useCallback((replay: (() => void) | null) => {
    replayOverride.current = replay;
  }, []);

  const registerIntro = useCallback((intro: (() => void) | null) => {
    activityIntro.current = intro;
  }, []);

  const handleReplay = useCallback(() => {
    if (replayOverride.current) {
      replayOverride.current();
      return;
    }
    speakSequence([promptText(activity?.prompt)], () => activityIntro.current?.());
  }, [activity]);

  const handleActivityFinished = useCallback(
    (result: { correct: boolean; attempts: number }) => {
      setActivityDone(true);
      if (!lesson || !activity) return;
      void recordActivityResult(lesson._id, {
        activityId: activity.id,
        correct: result.correct,
        attempts: result.attempts,
      });
    },
    [lesson, activity, recordActivityResult],
  );

  const goNext = useCallback(async () => {
    if (!lesson) return;

    if (activityIndex + 1 < lesson.activities.length) {
      replayOverride.current = null;
      activityIntro.current = null;
      setActivityIndex(activityIndex + 1);
      setActivityDone(false);
      return;
    }

    const { newBadges: earned } = await finishLesson(lesson);
    setNewBadges(earned);
    setShowCelebration(true);
  }, [lesson, activityIndex, finishLesson]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  if (!lesson || !activity) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <Text style={styles.missingEmoji}>🧭</Text>
        <Text style={styles.missingText}>That lesson is not here.</Text>
        <BigButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
      </View>
    );
  }

  const isLast = activityIndex + 1 === lesson.activities.length;
  const alreadyDone = isComplete(lesson._id);

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.sm }]}>
        <RoundButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
        <View style={styles.dots}>
          <ProgressDots total={lesson.activities.length} current={activityIndex} />
        </View>
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={handleReplay} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + space.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.promptCard, shadow.card, { borderColor: lesson.colour }]}>
          <Text style={styles.promptEmoji}>{lesson.emoji}</Text>
          <View style={styles.promptTextWrap}>
            {lesson.kind === 'challenge' ? (
              <Text style={styles.challengeTag}>🏆 {t(ui.starChallenge)}</Text>
            ) : (
              topic && <Text style={styles.topicTag}>{t(topic.title)}</Text>
            )}
            <Text style={styles.lessonTitle}>{t(lesson.title)}</Text>
            <Text style={styles.promptText}>{promptText(activity.prompt)}</Text>
          </View>
        </View>

        <ActivityRenderer
          key={activity.id}
          activity={activity}
          onFinished={handleActivityFinished}
          onRegisterReplay={registerReplay}
          onRegisterIntro={registerIntro}
        />

        {activityDone && (
          <BigButton
            emoji={isLast ? '🎉' : '➡️'}
            label={isLast ? t(ui.finished) : t(ui.next)}
            tone="happy"
            onPress={goNext}
            block
          />
        )}

        {alreadyDone && !activityDone && (
          <Text style={styles.replayNote}>⭐ {t(ui.alreadyDone)}</Text>
        )}
      </ScrollView>

      {showCelebration && (
        <Celebration stars={STARS_PER_LESSON} newBadges={newBadges} onHome={goHome} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.lg,
    backgroundColor: colours.background,
  },
  missingEmoji: { fontSize: type.emojiXl },
  missingText: { fontSize: type.title, fontWeight: '800', color: colours.ink },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingBottom: space.sm,
    gap: space.md,
  },
  dots: { flex: 1, alignItems: 'center' },

  body: { flex: 1 },
  bodyContent: { paddingHorizontal: space.lg, gap: space.lg },

  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    padding: space.lg,
  },
  promptEmoji: { fontSize: type.emojiLg },
  promptTextWrap: { flex: 1, gap: 2 },
  challengeTag: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.pink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  topicTag: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  lessonTitle: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  promptText: { fontSize: type.body, color: colours.inkSoft, fontWeight: '600', lineHeight: 22 },

  replayNote: {
    textAlign: 'center',
    fontSize: type.body,
    fontWeight: '700',
    color: colours.inkSoft,
  },
});
