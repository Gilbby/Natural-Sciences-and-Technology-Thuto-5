import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, shadow, size, space, type } from '@/theme/tokens';
import type { PlaceColumn, PlaceValueActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `place-value` — **build and break down a number in columns** (PRD §7.2,
 * §6.5c). **The first of the six, and the one that proves the idea.**
 *
 * **342 706** is a number *and* six digits in six columns. A child who can hold
 * only one of those cannot round it, cannot carry across a zero, and cannot say
 * why 40 000 is bigger than 9 999. **This component is the two-ways-at-once
 * made literal**: the columns on top, the whole number underneath, and both
 * changing together as she taps.
 *
 * ── Tapping a digit speaks its VALUE, not its name ────────────────────────
 *
 * The 7 in 342 706 says ***"seven hundred"***. A component that said *"seven"*
 * would have taught the child to read a number left to right as a row of
 * digits, **which is exactly the misreading place value exists to fix**.
 *
 * ── The child never types ─────────────────────────────────────────────────
 *
 * There is no number pad here and there will not be one (PRD §14 decision 15).
 * Each column has an up and a down, both `size.touchMin`, and **the digit
 * itself is a third target** that speaks its value. Three tap targets per
 * column, six columns, and none of them smaller than 56 dp — which is why this
 * component was built first: if the ergonomics did not work here they would not
 * work in any of the other five (PRD §12).
 *
 * ── Nothing is wrong, and nothing is timed ────────────────────────────────
 *
 * A column that is not yet right is simply not yet right — it is not red, it
 * does not shake, and no count of misses appears anywhere. The child can turn
 * a column up and down as many times as she likes. **`attempts` is reported so
 * the later teacher view has it, and it is never shown to her** (PRD §1.1
 * rules 1 and 2).
 */
export function PlaceValue({ activity, onFinished }: ActivityViewProps<PlaceValueActivity>) {
  const { columns, target, mode } = activity;

  /**
   * Where each column starts.
   *
   * `build` starts empty — she is making the number from nothing. `break-down`
   * and `regroup` start from `activity.start`, because both of those are about
   * taking a number apart rather than assembling one.
   */
  const initial = useMemo(() => {
    if (mode === 'build') return columns.map(() => 0);
    return digitsOf(activity.start, columns);
  }, [mode, activity.start, columns]);

  const [values, setValues] = useState<number[]>(initial);
  const attempts = useRef(1);
  const finished = useRef(false);

  const done = values.length === target.length && values.every((v, i) => v === target[i]);

  const check = useCallback(
    (next: number[]) => {
      if (finished.current) return;
      const right = next.every((value, index) => value === target[index]);
      if (!right) return;
      finished.current = true;
      celebrateCorrect(t(activity.say));
      onFinished({ correct: true, attempts: attempts.current });
    },
    [target, activity.say, onFinished],
  );

  const step = useCallback(
    (index: number, delta: number) => {
      setValues((current) => {
        const next = [...current];
        /*
         * **The ceiling is 9 everywhere except `regroup`.**
         *
         * `regroup` is the mode where 407 becomes 3 hundreds, 9 tens and 17
         * ones, and a column that stopped at 9 could not hold the 17. That is
         * the whole idea of carrying across a zero, so the ceiling goes up to
         * 19 in that mode and nowhere else (PRD §18.9).
         */
        const ceiling = mode === 'regroup' ? 19 : 9;
        const raw = next[index] + delta;
        if (raw < 0 || raw > ceiling) {
          // Nothing happens at the ends. No buzz, no message, no "you can't".
          return current;
        }
        next[index] = raw;
        if (next[index] !== current[index]) attempts.current += 1;
        check(next);
        return next;
      });
    },
    [mode, check],
  );

  /** The whole number the columns currently say. */
  const total = useMemo(
    () => values.reduce((sum, value, index) => sum + value * placeWorth(columns[index]), 0),
    [values, columns],
  );

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columns}
      >
        {columns.map((column, index) => (
          <Column
            key={column}
            column={column}
            value={values[index]}
            settled={values[index] === target[index]}
            onUp={() => step(index, 1)}
            onDown={() => step(index, -1)}
            onSpeakValue={() => speakLabel(sayDigitValue(values[index], column))}
          />
        ))}
      </ScrollView>

      {/*
        * **The whole number, underneath, always agreeing.**
        *
        * This is the other half of the two-ways-at-once and it is not
        * decoration: the columns and the number change together, so a child who
        * turns the ten-thousands column up by one watches 342 706 become
        * 352 706 in the same movement.
        */}
      <Pressable
        style={styles.totalCard}
        accessibilityRole="button"
        accessibilityLabel={`The number is ${groupDigits(total)}`}
        onPress={() => speakLabel(done ? t(activity.say) : groupDigits(total))}
      >
        <Text style={[styles.totalNumber, digitStyle]}>{groupDigits(total)}</Text>
        <Text style={styles.totalHint}>tap to hear it</Text>
      </Pressable>
    </View>
  );
}

/** One column: its label, its digit, and an up and a down. */
function Column({
  column,
  value,
  settled,
  onUp,
  onDown,
  onSpeakValue,
}: {
  column: PlaceColumn;
  value: number;
  settled: boolean;
  onUp: () => void;
  onDown: () => void;
  onSpeakValue: () => void;
}) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnLabel} numberOfLines={2}>
        {column}
      </Text>

      <Pressable
        style={styles.stepper}
        accessibilityRole="button"
        accessibilityLabel={`one more ${column}`}
        onPress={onUp}
      >
        <Text style={styles.stepperGlyph}>▲</Text>
      </Pressable>

      {/*
        * **The digit is a tap target and it speaks its value** — "seven
        * hundred", never "seven". See the header.
        */}
      <Pressable
        style={[styles.digitBox, settled && styles.digitBoxSettled]}
        accessibilityRole="button"
        accessibilityLabel={sayDigitValue(value, column)}
        onPress={onSpeakValue}
      >
        <Text style={[styles.digit, digitStyle]}>{value}</Text>
      </Pressable>

      <Pressable
        style={styles.stepper}
        accessibilityRole="button"
        accessibilityLabel={`one less ${column}`}
        onPress={onDown}
      >
        <Text style={styles.stepperGlyph}>▼</Text>
      </Pressable>

      <Text style={[styles.worth, digitStyle]}>{groupDigits(value * placeWorth(column))}</Text>
    </View>
  );
}

/* --------------------------------------------------------------- numbers */

const WORTH: Record<PlaceColumn, number> = {
  'hundred thousands': 100000,
  'ten thousands': 10000,
  thousands: 1000,
  hundreds: 100,
  tens: 10,
  ones: 1,
};

export function placeWorth(column: PlaceColumn): number {
  return WORTH[column];
}

/** The digits of `value` in the given columns, largest first. */
function digitsOf(value: number, columns: PlaceColumn[]): number[] {
  return columns.map((column) => Math.floor(value / WORTH[column]) % 10);
}

/**
 * **A number with South African spacing, never commas.**
 *
 * `342 706`, with a space. The DBE writes it this way and so does every
 * textbook this child will meet; `342,706` would read as a decimal to a child
 * who meets decimals next year.
 */
export function groupDigits(value: number): string {
  return value.toLocaleString('en-ZA').replace(/,/g, ' ');
}

/**
 * **What a digit is worth, said out loud** — the rule this component exists
 * for.
 *
 * `7` in the hundreds column is *"seven hundred"*. `0` anywhere is *"no
 * hundreds"* rather than *"zero"*, because a zero in a column is an absence the
 * child has to notice — it is the whole of `carry-across-a-zero`.
 */
function sayDigitValue(digit: number, column: PlaceColumn): string {
  if (digit === 0) return `no ${column}`;
  const worth = digit * WORTH[column];
  return groupDigits(worth);
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg },
  columns: { gap: space.sm, paddingHorizontal: space.sm, alignItems: 'flex-start' },
  column: {
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    paddingVertical: space.sm,
    paddingHorizontal: space.xs,
    minWidth: size.touchMin + space.lg,
  },
  columnLabel: {
    fontSize: type.caption,
    color: colours.inkSoft,
    fontWeight: '700',
    textAlign: 'center',
    width: size.touchMin + space.sm,
  },
  // Every one of these is `size.touchMin`. PRD §12.
  stepper: {
    width: size.touchMin,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surface,
  },
  stepperGlyph: { fontSize: type.body, color: colours.primaryDark, fontWeight: '900' },
  digitBox: {
    width: size.touchMin,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surface,
    borderWidth: 2,
    borderColor: colours.border,
  },
  // Settled is a quiet fill, not a tick and never a green "correct" flash.
  digitBoxSettled: { borderColor: colours.primary, backgroundColor: '#EAF1FC' },
  digit: { fontSize: type.digitLg, fontWeight: '800', color: colours.ink },
  worth: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },
  totalCard: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    borderRadius: size.radiusLg,
    backgroundColor: colours.surface,
    minHeight: size.touchMin,
    ...shadow.card,
  },
  totalNumber: { fontSize: type.display, fontWeight: '900', color: colours.ink },
  totalHint: { fontSize: type.caption, color: colours.inkSoft },
});
