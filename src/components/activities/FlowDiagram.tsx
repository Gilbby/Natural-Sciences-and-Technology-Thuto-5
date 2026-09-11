import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, size, space, type } from '@/theme/tokens';
import type { FlowDiagramActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `flow-diagram` — **input, a rule, output** (PRD §7.2).
 *
 * The ATP prints *"input and output values"* **four times** across the two
 * pattern blocks, and *"determine the equivalence of different descriptions of
 * the same rule"* **twice**. This component is the first half of that; the
 * second half is that the same screen shows the flow diagram **beside a table
 * beside a number sentence**, and the child sees that all three say one thing
 * (PRD §7.6).
 *
 * ── Any one of the three can be the blank, and the third one matters ──────
 *
 *   given the input and the rule   → find the output
 *   given the input and the output → find the rule
 *   given the rule and the output  → **find the input**
 *
 * **The last is the one a worksheet almost never asks and the one that shows
 * whether she has it.** Working backwards through *times 4, then add 3* is not
 * the same skill as working forwards through it, and `find-the-input-from-the-
 * output` is a rung of the ladder in its own right.
 *
 * ── The app does not do her arithmetic ────────────────────────────────────
 *
 * `operations` exists so the **component** can check an answer without a
 * calculator being anywhere near the child. She still works it out; the app
 * only knows whether she got there (Appendix B, PRD §14 decision 15).
 *
 * A number is built on a stepper, never typed. A **rule** cannot be built out
 * of digits, so when the rule is the blank it is chosen from two or three
 * `ruleOptions` — which is the one place in this component a wrong tap can
 * carry a `why` (PRD §6.5b).
 */
export function FlowDiagram({ activity, onFinished }: ActivityViewProps<FlowDiagramActivity>) {
  const { blank, inputs, outputs, blankAt = 0, operations } = activity;

  const attempts = useRef(1);
  const finished = useRef(false);

  const answer =
    blank === 'input' ? inputs[blankAt] : blank === 'output' ? outputs[blankAt] : null;

  const [guess, setGuess] = useState(0);
  const [pickedRule, setPickedRule] = useState<string | null>(null);

  const settle = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    celebrateCorrect(t(activity.rule));
    onFinished({ correct: true, attempts: attempts.current });
  }, [activity.rule, onFinished]);

  const step = useCallback(
    (delta: number) => {
      setGuess((current) => {
        const next = Math.max(0, current + delta);
        if (next === current) return current;
        attempts.current += 1;
        if (answer != null && next === answer) settle();
        return next;
      });
    },
    [answer, settle],
  );

  const chooseRule = useCallback(
    (optionId: string) => {
      const option = activity.ruleOptions?.find((entry) => entry.id === optionId);
      if (!option) return;
      setPickedRule(optionId);
      if (option.correct) {
        settle();
        return;
      }
      attempts.current += 1;
      nudgeRetry(t(option.label));
    },
    [activity.ruleOptions, settle],
  );

  return (
    <View style={styles.wrap}>
      {/* The machine: a column of inputs, one rule, a column of outputs. */}
      <View style={styles.machine}>
        <View style={styles.column}>
          <Text style={styles.columnHead}>in</Text>
          {inputs.map((value, index) => {
            const isBlank = blank === 'input' && index === blankAt;
            return (
              <Cell
                key={`in-${index}`}
                value={isBlank ? guess : value}
                blank={isBlank}
                onPress={() => speakLabel(String(isBlank ? guess : value))}
              />
            );
          })}
        </View>

        <View style={styles.ruleColumn}>
          <View style={styles.arrow} />
          <Pressable
            style={[styles.ruleBox, blank === 'rule' && styles.ruleBoxBlank]}
            accessibilityRole="button"
            accessibilityLabel={blank === 'rule' ? 'the rule is missing' : t(activity.rule)}
            onPress={() => speakLabel(blank === 'rule' ? 'What is the rule?' : t(activity.rule))}
          >
            <Text style={styles.ruleText}>
              {blank === 'rule' ? '?' : t(activity.rule)}
            </Text>
          </Pressable>
          <View style={styles.arrow} />
        </View>

        <View style={styles.column}>
          <Text style={styles.columnHead}>out</Text>
          {outputs.map((value, index) => {
            const isBlank = blank === 'output' && index === blankAt;
            return (
              <Cell
                key={`out-${index}`}
                value={isBlank ? guess : value}
                blank={isBlank}
                onPress={() => speakLabel(String(isBlank ? guess : value))}
              />
            );
          })}
        </View>
      </View>

      {/* The stepper, when a NUMBER is the blank. No number pad, ever. */}
      {blank !== 'rule' ? (
        <View style={styles.stepperRow}>
          <Pressable
            style={styles.stepper}
            accessibilityRole="button"
            accessibilityLabel="one less"
            onPress={() => step(-1)}
          >
            <Text style={styles.stepperGlyph}>−</Text>
          </Pressable>
          <Pressable
            style={styles.stepper}
            accessibilityRole="button"
            accessibilityLabel="ten less"
            onPress={() => step(-10)}
          >
            <Text style={styles.stepperGlyph}>−10</Text>
          </Pressable>
          <View style={styles.guessBox}>
            <Text style={[styles.guessText, digitStyle]}>{guess}</Text>
          </View>
          <Pressable
            style={styles.stepper}
            accessibilityRole="button"
            accessibilityLabel="ten more"
            onPress={() => step(10)}
          >
            <Text style={styles.stepperGlyph}>+10</Text>
          </Pressable>
          <Pressable
            style={styles.stepper}
            accessibilityRole="button"
            accessibilityLabel="one more"
            onPress={() => step(1)}
          >
            <Text style={styles.stepperGlyph}>+</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.ruleOptions}>
          {(activity.ruleOptions ?? []).map((option) => (
            <Pressable
              key={option.id}
              style={[styles.ruleOption, pickedRule === option.id && styles.ruleOptionPicked]}
              accessibilityRole="button"
              accessibilityLabel={t(option.label)}
              onPress={() => chooseRule(option.id)}
            >
              <Text style={styles.ruleOptionText}>{t(option.label)}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/*
        * **The same rule, said again** — the ATP's *"equivalence of different
        * descriptions of the same rule"*, printed twice and meant literally.
        * The diagram above, the table here, and the number sentence under it
        * are one rule wearing three coats.
        */}
      {activity.alsoSaid?.asTable ? (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHead, digitStyle]}>in</Text>
            {inputs.map((value, index) => (
              <Text key={`ti-${index}`} style={[styles.tableCell, digitStyle]}>
                {blank === 'input' && index === blankAt ? '?' : value}
              </Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHead, digitStyle]}>out</Text>
            {outputs.map((value, index) => (
              <Text key={`to-${index}`} style={[styles.tableCell, digitStyle]}>
                {blank === 'output' && index === blankAt ? '?' : value}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      {activity.alsoSaid?.asSentence ? (
        <Pressable
          style={styles.sentence}
          accessibilityRole="button"
          onPress={() => speakLabel(t(activity.alsoSaid!.asSentence!))}
        >
          <Text style={[styles.sentenceText, digitStyle]}>
            {t(activity.alsoSaid.asSentence)}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Cell({
  value,
  blank,
  onPress,
}: {
  value: number;
  blank: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.cell, blank && styles.cellBlank]}
      accessibilityRole="button"
      accessibilityLabel={String(value)}
      onPress={onPress}
    >
      <Text style={[styles.cellText, digitStyle]}>{value}</Text>
    </Pressable>
  );
}

/**
 * Apply a rule to a number.
 *
 * Exported so `scripts/check-content.ts` can verify that every authored
 * `inputs`/`outputs` pair actually agrees with its own `operations` — **an
 * author who mistypes an output has written a question with no right answer**,
 * and that is a build failure rather than something a child discovers.
 */
export function applyRule(
  input: number,
  operations: FlowDiagramActivity['operations'],
): number {
  return operations.reduce((value, operation) => {
    switch (operation.op) {
      case 'add':
        return value + operation.by;
      case 'subtract':
        return value - operation.by;
      case 'multiply':
        return value * operation.by;
      case 'divide':
        return operation.by === 0 ? value : value / operation.by;
      default:
        return value;
    }
  }, input);
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg, alignItems: 'center' },
  machine: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  column: { gap: space.xs, alignItems: 'center' },
  columnHead: { fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },
  cell: {
    minWidth: size.touchMin + space.md,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  cellBlank: {
    backgroundColor: colours.surface,
    borderWidth: 3,
    borderColor: colours.amber,
    borderStyle: 'dashed',
  },
  cellText: { fontSize: type.digit, fontWeight: '800', color: colours.ink },
  ruleColumn: { alignItems: 'center', gap: space.xs },
  arrow: { width: 3, height: 18, backgroundColor: colours.inkSoft, borderRadius: 2 },
  ruleBox: {
    minHeight: size.touchMin,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    maxWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.primary,
  },
  ruleBoxBlank: { backgroundColor: colours.amber },
  ruleText: {
    fontSize: type.body,
    fontWeight: '800',
    color: colours.surface,
    textAlign: 'center',
  },
  stepperRow: { flexDirection: 'row', gap: space.xs, alignItems: 'center' },
  stepper: {
    minWidth: size.touchMin,
    height: size.touchMin,
    paddingHorizontal: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  stepperGlyph: { fontSize: type.body, fontWeight: '900', color: colours.primaryDark },
  guessBox: {
    minWidth: size.touchMin + space.lg,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surface,
    borderWidth: 2,
    borderColor: colours.primary,
  },
  guessText: { fontSize: type.digitLg, fontWeight: '900', color: colours.ink },
  ruleOptions: { gap: space.sm, alignSelf: 'stretch' },
  ruleOption: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  ruleOptionPicked: { borderWidth: 2, borderColor: colours.primary, backgroundColor: '#EAF1FC' },
  ruleOptionText: { fontSize: type.body, fontWeight: '700', color: colours.ink },
  table: { gap: space.xs },
  tableRow: { flexDirection: 'row', gap: space.xs },
  tableHead: {
    width: 44,
    fontSize: type.caption,
    fontWeight: '800',
    color: colours.inkSoft,
    textAlign: 'center',
    lineHeight: 32,
  },
  tableCell: {
    minWidth: 44,
    fontSize: type.body,
    fontWeight: '800',
    color: colours.ink,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: colours.surfaceAlt,
    borderRadius: space.sm,
  },
  sentence: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: size.radius,
    backgroundColor: colours.surface,
  },
  sentenceText: { fontSize: type.digit, fontWeight: '800', color: colours.ink },
});
