import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { celebrateFinish } from '@/audio/feedback';
import { speakSequence, stopSpeaking } from '@/audio/speech';
import { ActivityRenderer } from '@/components/activities/ActivityRenderer';
import { BigButton } from '@/components/ui/BigButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { RoundButton } from '@/components/ui/RoundButton';
import { variantForDate } from '@/content';
import { useApp } from '@/context/AppProvider';
import { promptText, t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * The daily rhythms player — PRD §6.6.
 *
 * The lesson player marks a lesson done once and for ever. These do the
 * opposite: the number chart and the counting warm-up come round again every
 * school day, so completion is written to *today's* record and tomorrow starts
 * fresh. That difference is the whole reason this is a separate screen and not
 * a lesson with a flag on it.
 */
export default function DailyRhythmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { ready, rhythms, today, updateToday } = useApp();

  const rhythm = useMemo(() => rhythms.find((entry) => entry._id === id) ?? null, [rhythms, id]);
  const activities = useMemo(() => {
    if (!rhythm) return [];
    return rhythm.variants[variantForDate(rhythm, today.date)] ?? rhythm.variants[0] ?? [];
  }, [rhythm, today.date]);

  const [index, setIndex] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const replayOverride = useRef<(() => void) | null>(null);
  const activityIntro = useRef<(() => void) | null>(null);

  const activity = activities[index] ?? null;

  useEffect(() => {
    if (!rhythm || !activity) return;
    const lines =
      index === 0 ? [t(rhythm.title), promptText(activity.prompt)] : [promptText(activity.prompt)];
    // The activity's own opening line follows the prompt rather than racing
    // it — see `onRegisterIntro` in the activity contract.
    speakSequence(lines, () => activityIntro.current?.());
  }, [rhythm, activity, index]);

  useEffect(() => stopSpeaking, []);

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

  const goNext = useCallback(async () => {
    if (!rhythm) return;

    if (index + 1 < activities.length) {
      replayOverride.current = null;
      activityIntro.current = null;
      setIndex(index + 1);
      setStepDone(false);
      return;
    }

    // My Word Wall writes its own word as the child builds it, so there is
    // nothing to set here; the other rhythms flip their flag on the day record.
    if (rhythm.marks === 'movedToday') await updateToday({ movedToday: true });
    if (rhythm.marks === 'washDone') await updateToday({ washDone: true });
    setAllDone(true);
    celebrateFinish(`${t(rhythm.title)} done for today.`);
  }, [rhythm, index, activities.length, updateToday]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colours.primary} />
      </View>
    );
  }

  if (!rhythm || !activity) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <Text style={styles.missingEmoji}>🧭</Text>
        <Text style={styles.missingText}>That is not here today.</Text>
        <BigButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
      </View>
    );
  }

  const isLast = index + 1 === activities.length;

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + space.sm }]}>
        <RoundButton emoji="🏠" label={t(ui.home)} onPress={goHome} />
        <View style={styles.dots}>
          <ProgressDots total={activities.length} current={index} />
        </View>
        <RoundButton emoji="🔊" label={t(ui.hearItAgain)} onPress={handleReplay} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + space.xxl }]}
      >
        <View style={[styles.promptCard, shadow.card, { borderColor: rhythm.colour }]}>
          <Text style={styles.promptEmoji}>{rhythm.emoji}</Text>
          <View style={styles.promptTextWrap}>
            <Text style={styles.tag}>{t(ui.everyDay)}</Text>
            <Text style={styles.title}>{t(rhythm.title)}</Text>
            <Text style={styles.promptText}>{promptText(activity.prompt)}</Text>
          </View>
        </View>

        <ActivityRenderer
          key={`${activity.id}-${today.date}`}
          activity={activity}
          onFinished={() => setStepDone(true)}
          onRegisterReplay={registerReplay}
          onRegisterIntro={registerIntro}
        />

        {stepDone && !allDone && (
          <BigButton
            emoji={isLast ? '🎉' : '➡️'}
            label={isLast ? t(ui.doneToday) : t(ui.next)}
            tone="happy"
            onPress={goNext}
            block
          />
        )}

        {allDone && (
          <View style={styles.doneCard}>
            <Text style={styles.doneEmoji}>⭐</Text>
            <Text style={styles.doneText}>{t(ui.doneToday)}</Text>
            <BigButton
              emoji="🏠"
              label={t(ui.backToCalendar)}
              tone="happy"
              onPress={goHome}
              block
            />
          </View>
        )}
      </ScrollView>
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
  tag: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  promptText: { fontSize: type.body, color: colours.inkSoft, fontWeight: '600', lineHeight: 22 },

  doneCard: {
    alignItems: 'center',
    gap: space.md,
    backgroundColor: '#FFFBEC',
    borderRadius: size.radiusLg,
    borderWidth: 3,
    borderColor: colours.star,
    padding: space.xl,
  },
  doneEmoji: { fontSize: type.emojiXl },
  doneText: { fontSize: type.title, fontWeight: '900', color: colours.ink },
});
