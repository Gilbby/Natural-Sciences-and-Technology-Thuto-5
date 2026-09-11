import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, size, space, type } from '@/theme/tokens';
import type { FractionBarActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `fraction-bar` — **a bar cut into equal parts** (PRD §7.2, §6.5c).
 *
 * *Three quarters* is a fraction **and** three of four equal parts of a bar,
 * and the whole of Term 2's common-fractions block is about holding both at
 * once. **A child cannot learn this by sorting cards that say "three
 * quarters".** She has to shade three of the four and see how much of the bar
 * is left.
 *
 * ── Four modes, and the last is the one the ATP asks for by name ──────────
 *
 *   `shade`       shade three of the four parts
 *   `compare`     two bars, which is more — *"compare and order common
 *                 fractions to at least twelfths"*
 *   `add`         two bars with the **same denominator**, added. The ATP limits
 *                 Grade 5 addition and subtraction to like denominators and so
 *                 does the type: `denominator` is one number, not two
 *   `equivalent`  **two names for one amount.** A half and two quarters are the
 *                 same length of bar. *"Recognize and use the equivalence of
 *                 division and fractions"* is this mode with a division
 *                 sentence printed beside it (PRD §7.6)
 *
 * ── Every part is a tap target ────────────────────────────────────────────
 *
 * A bar in twelfths on a 360 dp screen gives parts about 26 dp wide, **which is
 * under the floor**. So the bar is drawn at whatever width fits and **a
 * separate row of `size.touchMin` buttons sits under it**, one per part — the
 * same split `number-line` makes between the thing she reads and the thing she
 * taps (PRD §12).
 *
 * ── Tapping a part says how much is shaded ────────────────────────────────
 *
 * Not *"part four"*. ***"Three quarters"*** — the amount, said as a fraction and
 * never spelled (PRD §9.1 caveat 4).
 */
export function FractionBar({ activity, onFinished }: ActivityViewProps<FractionBarActivity>) {
  const { denominator, bars, target, mode } = activity;

  const [shaded, setShaded] = useState<number[]>(bars);
  const [pickedBar, setPickedBar] = useState<number | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const settle = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    celebrateCorrect(t(activity.say));
    onFinished({ correct: true, attempts: attempts.current });
  }, [activity.say, onFinished]);

  /**
   * `compare` asks *which bar*, so the whole bar is the target and the parts
   * are fixed. Every other mode asks *how many parts*, so the parts move.
   */
  const chooseBar = useCallback(
    (index: number) => {
      setPickedBar(index);
      speakLabel(sayFraction(shaded[index], denominator));
      // In compare the answer is recorded on `target` as 1 for the chosen bar.
      if (target[index] === 1) settle();
      else attempts.current += 1;
    },
    [shaded, denominator, target, settle],
  );

  const tapPart = useCallback(
    (barIndex: number, partIndex: number) => {
      setShaded((current) => {
        const next = [...current];
        // Tapping part 3 shades one, two and three — a fraction is a run from
        // the left, not a scatter of coloured squares.
        const wanted = partIndex + 1;
        next[barIndex] = next[barIndex] === wanted ? wanted - 1 : wanted;
        if (next[barIndex] !== current[barIndex]) attempts.current += 1;
        speakLabel(sayFraction(next[barIndex], denominator));

        const rightNow =
          mode === 'add'
            ? next[0] + next[1] === target[0]
            : next.every((value, index) => value === target[index]);
        if (rightNow) settle();
        return next;
      });
    },
    [denominator, mode, target, settle],
  );

  return (
    <View style={styles.wrap}>
      {shaded.map((count, barIndex) => (
        <View key={`bar-${barIndex}`} style={styles.barBlock}>
          <Pressable
            style={[styles.bar, pickedBar === barIndex && styles.barPicked]}
            accessibilityRole={mode === 'compare' ? 'button' : 'image'}
            accessibilityLabel={sayFraction(count, denominator)}
            onPress={mode === 'compare' ? () => chooseBar(barIndex) : undefined}
          >
            {Array.from({ length: denominator }, (_, part) => (
              <View
                key={part}
                style={[
                  styles.part,
                  part < count && styles.partShaded,
                  part === denominator - 1 && styles.partLast,
                ]}
              />
            ))}
          </Pressable>

          <Text style={[styles.reading, digitStyle]}>
            {count}/{denominator}
          </Text>

          {/* The tap row — one 56 dp button per part. See the header. */}
          {mode !== 'compare' ? (
            <View style={styles.partButtons}>
              {Array.from({ length: denominator }, (_, part) => (
                <Pressable
                  key={part}
                  style={[styles.partButton, part < count && styles.partButtonOn]}
                  accessibilityRole="button"
                  accessibilityLabel={sayFraction(part + 1, denominator)}
                  onPress={() => tapPart(barIndex, part)}
                >
                  <Text style={[styles.partButtonText, digitStyle]}>{part + 1}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ))}

      {/*
        * **The second name for the same amount** — the point of `equivalent`.
        * A bar shaded four eighths, with `1/2` printed beside it, is the ATP's
        * *"recognize and use equivalent forms"* in one screen.
        */}
      {mode === 'equivalent' && activity.equivalentTo ? (
        <Pressable
          style={styles.sameCard}
          accessibilityRole="button"
          onPress={() => speakLabel(t(activity.say))}
        >
          <Text style={styles.sameLabel}>the same amount is</Text>
          <Text style={[styles.sameValue, digitStyle]}>
            {activity.equivalentTo[0]}/{activity.equivalentTo[1]}
          </Text>
        </Pressable>
      ) : null}

      {/*
        * **The number sentence beside the bars.** Shown, and never computed for
        * her: the app has no calculator and does not do her arithmetic
        * (PRD §14 decision 15, Appendix B).
        */}
      {activity.sentence ? (
        <Pressable
          style={styles.sentence}
          accessibilityRole="button"
          onPress={() => speakLabel(t(activity.sentence!))}
        >
          <Text style={[styles.sentenceText, digitStyle]}>{t(activity.sentence)}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* --------------------------------------------------------------- numbers */

const NAMES: Record<number, [string, string]> = {
  2: ['half', 'halves'],
  3: ['third', 'thirds'],
  4: ['quarter', 'quarters'],
  5: ['fifth', 'fifths'],
  6: ['sixth', 'sixths'],
  7: ['seventh', 'sevenths'],
  8: ['eighth', 'eighths'],
  9: ['ninth', 'ninths'],
  10: ['tenth', 'tenths'],
  11: ['eleventh', 'elevenths'],
  12: ['twelfth', 'twelfths'],
};

const COUNTS = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
];

/**
 * **A fraction is said, not spelled** — PRD §9.1 caveat 4.
 *
 * `3/4` is *"three quarters"*. Never *"three slash four"*, and never *"three
 * over four"* unless the lesson is about the notation.
 */
export function sayFraction(numerator: number, denominator: number): string {
  if (numerator === 0) return 'nothing shaded';
  if (numerator === denominator) return 'one whole';
  const name = NAMES[denominator];
  if (!name) return `${numerator} over ${denominator}`;
  const count = COUNTS[numerator] ?? String(numerator);
  return numerator === 1 ? `one ${name[0]}` : `${count} ${name[1]}`;
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg, alignItems: 'center' },
  barBlock: { gap: space.xs, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    width: '100%',
    minWidth: 260,
    height: 52,
    borderRadius: size.radius,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colours.ink,
    backgroundColor: colours.surface,
  },
  barPicked: { borderColor: colours.primary, borderWidth: 4 },
  part: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: colours.ink,
    backgroundColor: colours.surface,
  },
  partLast: { borderRightWidth: 0 },
  partShaded: { backgroundColor: colours.primary },
  reading: { fontSize: type.digit, fontWeight: '800', color: colours.ink },
  partButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, justifyContent: 'center' },
  partButton: {
    width: size.touchMin,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  partButtonOn: { backgroundColor: '#EAF1FC', borderWidth: 2, borderColor: colours.primary },
  partButtonText: { fontSize: type.body, fontWeight: '800', color: colours.ink },
  sameCard: {
    alignItems: 'center',
    paddingVertical: space.sm,
    paddingHorizontal: space.xl,
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
    minHeight: size.touchMin,
    justifyContent: 'center',
  },
  sameLabel: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },
  sameValue: { fontSize: type.digit, fontWeight: '900', color: colours.ink },
  sentence: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: size.radius,
    backgroundColor: colours.surface,
  },
  sentenceText: { fontSize: type.digit, fontWeight: '800', color: colours.ink },
});
