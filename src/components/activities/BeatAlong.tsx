import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { celebrateFinish } from '@/audio/feedback';
import { speak, speakSequence } from '@/audio/speech';
import { BigButton } from '@/components/ui/BigButton';
import { promptText, t, ui } from '@/i18n';
import { isReducedMotion, motionDuration } from '@/theme/motion';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { BeatAlongActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `beat-along` — **the one new component in this fork, and it exists because a
 * crotchet is a sound** (PRD §7.3).
 *
 * The Creative Arts half of this ATP prints, across three of four terms:
 * *"Rhythm patterns of different note values (semibreve, minim, crotchet,
 * quaver and the equivalent rests), using body percussion and percussive
 * instruments"* · *"Notation of rhythms on single line stave"* · *"Musical
 * phrases with contrasts in dynamics"* · *"Melodic and rhythmic phrases … that
 * use repetition, call and response and contrast"*.
 *
 * **Taught as a picture alone, a crotchet is a shape with a name and no
 * meaning**, and a child with no instrument, no teacher and no audio files has
 * met nothing. So the app plays it: a pulse per beat with `expo-haptics`, the
 * count spoken with `expo-speech`, the pattern twice, and the child taps when
 * she has clapped along.
 *
 * ── Three constraints, and all three are load-bearing ─────────────────────
 *
 * **1. THIS IS NOT A TIMER.** The family's rule forbids timing *the child* —
 * no countdown, no stopwatch, no streak, no "in a row". **A played beat times
 * nothing and scores nothing.** It is the content, in the only medium the
 * content has. Nothing here measures when the child taps, compares one tap to
 * another, or can be got wrong (PRD §1.1, §4 principle 10, §2.2).
 *
 * > **This is exactly the kind of thing a later contributor deletes on
 * > principle.** It is a `setTimeout` chain firing haptics on a phone in a
 * > family whose rules say nothing is timed. Read the previous paragraph before
 * > removing it: the rule is about the *child*, and this component knows
 * > nothing about her.
 *
 * **2. It never plays while another sound is playing.** Haptics and TTS share
 * the utterance queue's turn-taking: the pattern waits for the spoken `ask` to
 * finish, and nothing is spoken during a pattern. **A beat under a spoken line
 * is noise** (PRD §9.1 caveat 6).
 *
 * **3. Tempo stays between 60 and 100.** Below 60 a ten-year-old loses the
 * pulse; above 100 the haptic motor on a budget Android smears the beats
 * together. `scripts/check-content.ts` fails the build outside that envelope,
 * and **a `setTimeout` chain is not a metronome** — two repetitions at 60–100
 * is the tested shape and anything tighter has the child clapping against a
 * beat that has moved (PRD §9.1 caveat 7).
 *
 * ── And reduced motion ────────────────────────────────────────────────────
 *
 * **A child who has asked for reduced motion has not asked for silence.** The
 * haptics and the count stay; the swelling dot stops (PRD §12).
 */

/** What each note value is worth, in beats. The rest is worth its note. */
const BEATS: Record<BeatAlongActivity['pattern'][number], number> = {
  semibreve: 4,
  minim: 2,
  crotchet: 1,
  quaver: 0.5,
  rest: 1,
};

/** The glyph for each, drawn as text because a stave is a `figure` (PRD §7.4). */
const GLYPH: Record<BeatAlongActivity['pattern'][number], string> = {
  semibreve: '𝅝',
  minim: '𝅗𝅥',
  crotchet: '♩',
  quaver: '♪',
  rest: '𝄽',
};

/** Said aloud, because no device voice reads a music glyph (PRD §9.1 caveat 5). */
const SAY: Record<BeatAlongActivity['pattern'][number], string> = {
  semibreve: 'semibreve, four beats',
  minim: 'minim, two beats',
  crotchet: 'crotchet, one beat',
  quaver: 'quaver, half a beat',
  rest: 'a rest. Silence. You wait',
};

export function BeatAlong({
  activity,
  onFinished,
  onRegisterReplay,
  onRegisterIntro,
}: ActivityViewProps<BeatAlongActivity>) {
  const [position, setPosition] = useState<number | null>(null);
  const [playCount, setPlayCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const finished = useRef(false);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const pulse = useRef(new Animated.Value(0)).current;

  const msPerBeat = 60000 / activity.tempo;

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /**
   * Play the pattern twice.
   *
   * A `setTimeout` chain drifts, and it is allowed to: the child is clapping
   * along, not being measured against it (constraint 3). Two repetitions is
   * the tested shape — long enough to find the pulse, short enough that the
   * drift never becomes the thing she is hearing.
   */
  const play = useCallback(() => {
    clearTimers();
    setPlaying(true);
    let elapsed = 0;

    for (let repeat = 0; repeat < 2; repeat += 1) {
      activity.pattern.forEach((note, index) => {
        const at = elapsed;
        const slot = repeat * activity.pattern.length + index;
        timers.current.push(
          setTimeout(() => {
            setPosition(slot % activity.pattern.length);
            if (note !== 'rest') {
              // A long note gets a heavier pulse, which is the whole of what
              // "note value" means to a hand: a semibreve is not four claps.
              void Haptics.impactAsync(
                BEATS[note] >= 2
                  ? Haptics.ImpactFeedbackStyle.Heavy
                  : note === 'quaver'
                    ? Haptics.ImpactFeedbackStyle.Light
                    : Haptics.ImpactFeedbackStyle.Medium,
              );
              if (!isReducedMotion()) {
                pulse.setValue(0);
                Animated.timing(pulse, {
                  toValue: 1,
                  duration: motionDuration(Math.min(msPerBeat * BEATS[note], 900)),
                  easing: Easing.out(Easing.ease),
                  useNativeDriver: true,
                }).start();
              }
            }
          }, at),
        );
        elapsed += msPerBeat * BEATS[note];
      });
      // A breath between the two runs, so the child hears where it starts.
      elapsed += msPerBeat;
    }

    timers.current.push(
      setTimeout(() => {
        setPosition(null);
        setPlaying(false);
        setPlayCount((count) => count + 1);
      }, elapsed),
    );
  }, [activity.pattern, clearTimers, msPerBeat, pulse]);

  /*
   * Constraint 2: the pattern waits for the spoken line to finish. The player
   * hands us the intro slot, we speak the `ask` there, and the beat starts
   * only when the utterance queue has drained.
   */
  useEffect(() => {
    if (!onRegisterIntro) return;
    onRegisterIntro(() => {
      speakSequence([promptText(activity.ask)], play);
    });
    return () => onRegisterIntro(null);
  }, [onRegisterIntro, activity.ask, play]);

  useEffect(() => {
    if (!onRegisterReplay) return;
    onRegisterReplay(() => {
      if (playing) return;
      speakSequence([promptText(activity.ask)], play);
    });
    return () => onRegisterReplay(null);
  }, [onRegisterReplay, activity.ask, play, playing]);

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearTimers();
    // Nothing is measured and nothing is compared. She clapped; that is all
    // there was to do (PRD §7.3).
    celebrateFinish('Good. You kept the beat.');
    onFinished({ correct: true, attempts: 1 });
  }, [clearTimers, onFinished]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1.25, 1] });

  return (
    <View style={styles.container}>
      <Text style={styles.ask}>{promptText(activity.ask)}</Text>

      <View style={styles.staveRow}>
        {activity.pattern.map((note, index) => {
          const lit = position === index;
          return (
            <Pressable
              key={`${note}-${index}`}
              onPress={() => speak(SAY[note])}
              accessibilityRole="button"
              accessibilityLabel={SAY[note]}
              style={[
                styles.note,
                lit && { borderColor: colours.primary, backgroundColor: '#ECF8F0' },
              ]}
            >
              <Animated.Text
                style={[
                  styles.noteGlyph,
                  note === 'rest' && styles.restGlyph,
                  lit ? { transform: [{ scale }] } : null,
                ]}
              >
                {GLYPH[note]}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>Tap a note to hear what it is called.</Text>

      <View style={styles.controls}>
        <BigButton
          emoji="🥁"
          label={playCount === 0 ? t(ui.listenFirst) : t(ui.playItAgain)}
          tone="soft"
          onPress={() => {
            if (!playing) play();
          }}
        />
      </View>

      {playCount > 0 && (
        <BigButton emoji="👏" label={t(ui.iClappedAlong)} tone="happy" onPress={done} block />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg, alignItems: 'stretch' },
  ask: {
    textAlign: 'center',
    fontSize: type.title,
    fontWeight: '800',
    color: colours.ink,
    lineHeight: 30,
  },
  staveRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: space.sm,
  },
  note: {
    width: size.touchMin,
    height: size.touchMin + 8,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.border,
    backgroundColor: colours.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  noteGlyph: { fontSize: type.emojiSm, color: colours.ink, fontWeight: '700' },
  restGlyph: { color: colours.inkSoft },
  hint: { textAlign: 'center', fontSize: type.caption, color: colours.inkSoft },
  controls: { flexDirection: 'row', gap: space.md, justifyContent: 'center' },
});
