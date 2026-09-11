import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { celebrateFinish, speakLabel } from '@/audio/feedback';
import { speak, speakSequence } from '@/audio/speech';
import { BigButton } from '@/components/ui/BigButton';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { promptText, t, ui } from '@/i18n';
import { motionDuration } from '@/theme/motion';
import { colours, reading, shadow, size, space, type } from '@/theme/tokens';
import type { MovementSpace, MoveAlongActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `move-along` — the app calls a movement, the child does it, then taps done
 * (PRD §7, §7.2).
 *
 * Physical Education and Creative Arts happen away from the screen. A phone
 * cannot assess a cartwheel and should not pretend to, so this component's job
 * is to call the move clearly, give the child time, and get out of the way
 * (PRD §2.2). `freeze-go` adds the inhibitory-control game on top.
 *
 * ── The safety line — PRD §1.1 rule 1, §7.2. **This fork's change.**
 *
 * Two-thirds of this ATP is a body, in a room the app cannot see, with no adult
 * in it. So a movement call **refuses to run without saying where and how
 * first**: the space, the safety line and the kit render above everything else,
 * and the safety line is **spoken before the activity's own prompt**.
 *
 * It renders as **content, not chrome** (PRD §12): at the reading scale, on the
 * app's warm nudge colour, speaking on tap like every other line. It is not a
 * toast, not a footnote and not grey — and it is **never red**, because red is
 * a fright and this is an instruction (PRD §4 principle 7).
 */

/**
 * What each `space` means, said the way a child would be told it.
 *
 * The four values are the whole vocabulary (PRD §6.5b). `outdoors-open` is the
 * only one that assumes anything, and every call that uses it says so in its
 * own safety line as well.
 */
const SPACE_LABEL: Record<MovementSpace, { emoji: string; label: string }> = {
  standing: { emoji: '🧍', label: 'You can do this standing still.' },
  'one-arm': { emoji: '🙆', label: 'You need to stretch one arm out and turn round.' },
  'a-few-steps': { emoji: '👣', label: 'You need three or four steps in one direction.' },
  'outdoors-open': { emoji: '🌳', label: 'You need to be outside with room to run.' },
};
/** The stage breathes out to 1.16 at the top of the pulse and must still fit. */
const PULSE_PEAK = 1.16;
const GLYPH_STAGE = 168;
const WRITTEN_STAGE = 300;

/**
 * A step whose stage is a written line rather than a glyph.
 *
 * `readAloud` (PRD §7, authoring) builds its steps with the sentence in the
 * stage slot: the thing the child looks at *is* the line to read. Two letters
 * running together is enough to tell that from an emoji, which has none.
 */
function isWrittenLine(stage: string): boolean {
  return /[A-Za-z]{2}/.test(stage);
}

/**
 * The largest font that keeps `text` inside a circle of `diameter`.
 *
 * A circle only lends you the square that fits inside it — side d/√2 — and the
 * line has to fit that square in whole words, at a size a Grade 3 can still
 * read. Set at the emoji size instead, a nine-word line runs off the stage and
 * over the prompt, the header and the buttons.
 */
function fitWrittenLine(text: string, diameter: number): number {
  const side = diameter / Math.SQRT2 - space.sm;
  const longestWord = text.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 1);
  for (let fontSize = type.display; fontSize > type.body; fontSize -= 1) {
    // Bold sans: a character runs a little over half its point size wide, and
    // ragged wrapping costs about one line's worth of the square.
    const perLine = Math.floor(side / (fontSize * 0.55));
    if (perLine < longestWord) continue;
    const lines = Math.ceil(text.length / perLine) + 1;
    if (lines * fontSize * 1.25 <= side) return fontSize;
  }
  return type.body;
}

export function MoveAlong({
  activity,
  onFinished,
  onRegisterReplay,
  onRegisterIntro,
}: ActivityViewProps<MoveAlongActivity>) {
  const { width } = useWindowDimensions();
  const [stepIndex, setStepIndex] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const finished = useRef(false);
  const pulse = useRef(new Animated.Value(0)).current;

  const step = activity.steps[stepIndex];
  const isFreezeGo = activity.mode === 'freeze-go';
  const isLast = stepIndex + 1 === activity.steps.length;
  const written = isWrittenLine(step?.emoji ?? '');

  const safety = activity.safety ? t(activity.safety) : null;
  const spaceInfo = activity.space ? SPACE_LABEL[activity.space] : null;
  const kit = activity.kit ?? [];

  // A slow breathing pulse gives the child something to move in time with.
  useEffect(() => {
    pulse.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: motionDuration(900),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: motionDuration(900),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    // A line to read holds still. Text that breathes in and out is text you
    // cannot read, and the swell is what pushed it over the border.
    if (!frozen && !written) loop.start();
    return () => loop.stop();
  }, [pulse, stepIndex, frozen, written]);

  useEffect(() => {
    if (!step) return;
    // The first call goes to the player so the screen's prompt does not cut
    // it off; every later step is the only thing speaking.
    if (stepIndex === 0 && onRegisterIntro) return;
    speak(promptText(step.call));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /*
   * **The safety line is spoken before the first step** — PRD §1.1 rule 1.
   *
   * Not after the prompt, not alongside it, and not only on tap: a child who
   * has already started rolling has not heard it. The intro hook hands the
   * player one sequence, and the safety line is the first thing in it.
   */
  useEffect(() => {
    if (!onRegisterIntro) return;
    onRegisterIntro(() => {
      const opening = promptText(activity.steps[0]?.call);
      if (safety) speakSequence([safety, opening]);
      else speak(opening);
    });
    return () => onRegisterIntro(null);
  }, [onRegisterIntro, activity.steps, safety]);

  useEffect(() => {
    if (!onRegisterReplay) return;
    onRegisterReplay(() => speak(promptText(activity.steps[stepIndex]?.call)));
    return () => onRegisterReplay(null);
  }, [onRegisterReplay, activity.steps, stepIndex]);

  const nextStep = useCallback(() => {
    if (!isLast) {
      setFrozen(false);
      setStepIndex((prev) => prev + 1);
      return;
    }
    if (finished.current) return;
    finished.current = true;
    celebrateFinish('Great moving! Well done.');
    onFinished({ correct: true, attempts: 1 });
  }, [isLast, onFinished]);

  const toggleFreeze = useCallback(() => {
    setFrozen((prev) => {
      const next = !prev;
      speakLabel(next ? 'Freeze!' : 'Go!');
      return next;
    });
  }, []);

  const repeatCall = useCallback(() => {
    if (!step) return;
    speakSequence([t(step.label), promptText(step.call)]);
  }, [step]);

  if (!step) return null;

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, PULSE_PEAK] });

  // The stage never grows past what the screen holds at the top of the pulse.
  const stageSize = Math.min(
    written ? WRITTEN_STAGE : GLYPH_STAGE,
    Math.floor((width - space.lg * 2) / PULSE_PEAK),
  );
  const written_ = written && !frozen;
  const stageText = written_ ? fitWrittenLine(step.emoji, stageSize) : type.emojiXl;

  return (
    <View style={styles.container}>
      {safety && (
        <View style={styles.safetyCard}>
          <Text style={styles.safetyHeading}>{t(ui.beforeYouStart)}</Text>
          <Pressable
            onPress={() => speak(safety)}
            accessibilityRole="button"
            accessibilityLabel={safety}
            accessibilityHint="Tap to hear it again"
            style={styles.safetyPress}
          >
            <Text style={styles.safetyText}>{safety}</Text>
          </Pressable>

          {spaceInfo && (
            <Pressable
              onPress={() => speak(spaceInfo.label)}
              accessibilityRole="button"
              accessibilityLabel={spaceInfo.label}
              style={styles.safetyRow}
            >
              <Text style={styles.safetyRowEmoji}>{spaceInfo.emoji}</Text>
              <Text style={styles.safetyRowText}>{spaceInfo.label}</Text>
            </Pressable>
          )}

          {kit.length > 0 && (
            <Pressable
              onPress={() =>
                speak(
                  kit.includes('nothing')
                    ? `${t(ui.whatYouNeed)}. ${t(ui.needNothing)}.`
                    : `${t(ui.whatYouNeed)}. ${kit.join(', or ')}.`,
                )
              }
              accessibilityRole="button"
              style={styles.safetyRow}
            >
              <Text style={styles.safetyRowEmoji}>🎒</Text>
              <Text style={styles.safetyRowText}>
                {kit.includes('nothing') && kit.length === 1
                  ? t(ui.needNothing)
                  : kit.join(', or ')}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {activity.steps.length > 1 && (
        <View style={styles.dots}>
          <ProgressDots total={activity.steps.length} current={stepIndex} />
        </View>
      )}

      <Animated.View
        style={[
          styles.stage,
          shadow.raised,
          {
            width: stageSize,
            height: stageSize,
            borderRadius: stageSize / 2,
            padding: stageSize * (1 - 1 / Math.SQRT2) * 0.5,
            borderColor: frozen ? colours.blue : colours.primary,
            backgroundColor: frozen ? '#EAF4FD' : colours.surface,
            transform: [{ scale }],
          },
        ]}
      >
        <Text
          style={[
            styles.stageGlyph,
            // A written line gets the leading its wrap was measured against.
            // An emoji keeps the platform's own, which runs taller than its
            // point size and clips against anything tighter.
            { fontSize: stageText, lineHeight: written_ ? stageText * 1.25 : undefined },
          ]}
          accessibilityLabel={t(step.label)}
        >
          {frozen ? '🧊' : step.emoji}
        </Text>
      </Animated.View>

      <Text style={styles.call}>{frozen ? 'Freeze! Stand very still.' : promptText(step.call)}</Text>

      <View style={styles.controls}>
        <BigButton emoji="🔁" label="Say it again" tone="soft" onPress={repeatCall} />
        {isFreezeGo && (
          <BigButton
            emoji={frozen ? '🏃' : '🧊'}
            label={frozen ? 'Go!' : 'Freeze!'}
            tone="soft"
            onPress={toggleFreeze}
          />
        )}
      </View>

      <BigButton
        emoji={isLast ? '🎉' : '👍'}
        label={isLast ? 'I did it!' : 'Done — next move'}
        tone="happy"
        onPress={nextStep}
        block
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg, alignItems: 'stretch' },
  dots: { alignItems: 'center' },

  /*
   * The safety block. **Content, not chrome** (PRD §12): the reading scale, a
   * warm amber that is `colours.nudge` and never red, and every line speaks on
   * tap. A safety line a child cannot hear is a safety line for somebody else.
   */
  safetyCard: {
    backgroundColor: '#FFF6E9',
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.nudge,
    padding: space.lg,
    gap: space.sm,
  },
  safetyHeading: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  safetyPress: { minHeight: size.touchMin, justifyContent: 'center' },
  safetyText: {
    fontSize: reading.body,
    lineHeight: reading.lineHeight,
    fontWeight: '700',
    color: colours.ink,
  },
  safetyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: size.touchMin,
  },
  safetyRowEmoji: { fontSize: type.emojiSm },
  safetyRowText: { flex: 1, fontSize: reading.small, fontWeight: '700', color: colours.ink },
  stage: {
    alignSelf: 'center',
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  // Size and line height come from the step: a glyph is set at the emoji size,
  // a written line at whatever fits the circle (`fitWrittenLine`).
  stageGlyph: {
    textAlign: 'center',
    fontWeight: '800',
    color: colours.ink,
  },
  call: {
    textAlign: 'center',
    fontSize: type.title,
    fontWeight: '800',
    color: colours.ink,
    lineHeight: 30,
    minHeight: size.touchMin,
  },
  controls: { flexDirection: 'row', gap: space.md, justifyContent: 'center', flexWrap: 'wrap' },
});
