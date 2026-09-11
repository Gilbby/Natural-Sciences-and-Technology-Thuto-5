import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, size, space, type } from '@/theme/tokens';
import type { NumberLineActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `number-line` — **a line with marks** (PRD §7.2).
 *
 * **The ATP names this tool by name.** *"Using a number line"* is one of the
 * six calculation techniques it lists for both the addition and the
 * multiplication blocks, and it prints it again under counting in fractions. So
 * the app uses the tool rather than a picture of one.
 *
 * ── Rounding lives here, and not in `place-value` ─────────────────────────
 *
 * **Rounding 4 738 to the nearest 100 is not a rule about the tens digit. It is
 * a position between two marks.** 4 738 sits between 4 700 and 4 800, and it is
 * nearer to 4 700. A child who has seen that does not need to remember which
 * way five goes, and a child who has only been told the rule will get 4 750
 * wrong for the rest of her life.
 *
 * ── Three modes ───────────────────────────────────────────────────────────
 *
 *   `place`  tap the mark where this number goes
 *   `jump`   hop along in equal steps — the technique the ATP means when it
 *            says *"using a number line"* for adding and taking away
 *   `round`  the two marks either side are drawn heavy; tap the nearer one
 *
 * ── Fractions ─────────────────────────────────────────────────────────────
 *
 * With `denominator` set the line is marked in `1/n` and **the labels are said
 * as fractions** — *"three quarters"*, never *"three slash four"* and never
 * *"nought point seven five"* (PRD §9.1 caveat 4). Term 2's *"count forwards
 * and backwards in fractions"* is this mode.
 *
 * ── Nothing here counts, and nothing here is red ──────────────────────────
 *
 * A tap on the wrong mark says what that mark *is* and leaves the line alone.
 * It does not shake, it does not cross out, and the child may tap every mark on
 * the line if she wants to hear them (PRD §1.1 rules 1 and 2).
 */
export function NumberLine({ activity, onFinished }: ActivityViewProps<NumberLineActivity>) {
  const { from, to, step, value, target, mode, denominator } = activity;
  const { width } = useWindowDimensions();

  const attempts = useRef(1);
  const finished = useRef(false);

  /** In `jump` mode the child walks the line, so the position is state. */
  const [at, setAt] = useState<number>(mode === 'jump' ? value : from);
  const [chosen, setChosen] = useState<number | null>(null);

  /** Every drawn mark, in order. */
  const marks = useMemo(() => {
    const out: number[] = [];
    // Guard against a zero or negative step authored by hand: one mark is
    // better than an infinite loop, and the validator catches the real cause.
    const stride = step > 0 ? step : Math.max(1, to - from);
    for (let n = from; n <= to + 1e-9; n += stride) out.push(round6(n));
    return out;
  }, [from, to, step]);

  const chartWidth = Math.max(280, Math.min(width - space.xl * 2, 560));
  const padding = 28;
  const usable = chartWidth - padding * 2;
  const xFor = useCallback(
    (n: number) => padding + ((n - from) / (to - from || 1)) * usable,
    [from, to, usable],
  );

  const settle = useCallback(
    (mark: number) => {
      if (finished.current) return;
      finished.current = true;
      celebrateCorrect(t(activity.say));
      onFinished({ correct: true, attempts: attempts.current });
    },
    [activity.say, onFinished],
  );

  const tapMark = useCallback(
    (mark: number) => {
      const label = labelFor(mark, denominator);

      if (mode === 'jump') {
        const hop = activity.jump ?? step;
        // Only the next hop along counts as a move; any other mark just speaks.
        if (Math.abs(mark - (at + hop)) < 1e-9) {
          setAt(mark);
          speakLabel(label);
          if (Math.abs(mark - target) < 1e-9) settle(mark);
          return;
        }
        attempts.current += 1;
        speakLabel(label);
        return;
      }

      setChosen(mark);
      if (Math.abs(mark - target) < 1e-9) {
        settle(mark);
        return;
      }
      attempts.current += 1;
      // **What that mark is, not that she was wrong** (PRD §1.1 rule 2).
      nudgeRetry(`That one is ${label}.`);
    },
    [mode, activity.jump, step, at, target, denominator, settle],
  );

  /** In `round` mode, the two marks the value sits between are drawn heavy. */
  const neighbours = useMemo(() => {
    if (mode !== 'round') return null;
    const below = marks.filter((m) => m <= value).pop();
    const above = marks.find((m) => m >= value);
    return { below, above };
  }, [mode, marks, value]);

  const height = 132;
  const axisY = 74;

  return (
    <View style={styles.wrap}>
      <Svg width={chartWidth} height={height}>
        <Line
          x1={padding}
          y1={axisY}
          x2={chartWidth - padding}
          y2={axisY}
          stroke={colours.ink}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {marks.map((mark) => {
          const x = xFor(mark);
          const heavy =
            neighbours != null && (mark === neighbours.below || mark === neighbours.above);
          const picked = chosen != null && Math.abs(mark - chosen) < 1e-9;
          const walked = mode === 'jump' && mark <= at;
          return (
            <Rect
              key={`tick-${mark}`}
              x={x - 1.5}
              y={axisY - (heavy ? 18 : 11)}
              width={3}
              height={heavy ? 36 : 22}
              rx={1.5}
              fill={
                picked
                  ? colours.primary
                  : walked
                    ? colours.primaryDark
                    : heavy
                      ? colours.ink
                      : colours.inkSoft
              }
            />
          );
        })}

        {/* The value being placed or rounded, sitting above the line. */}
        {mode !== 'jump' ? (
          <>
            <Circle cx={xFor(value)} cy={axisY - 34} r={7} fill={colours.amber} />
            <SvgText
              x={xFor(value)}
              y={axisY - 46}
              fontSize={type.caption}
              fontWeight="800"
              fill={colours.ink}
              textAnchor="middle"
            >
              {labelFor(value, denominator)}
            </SvgText>
          </>
        ) : (
          <Circle cx={xFor(at)} cy={axisY} r={9} fill={colours.amber} />
        )}

        {/* Labels: every mark in a short line, the ends only in a long one. */}
        {marks.map((mark, index) => {
          const dense = marks.length > 12;
          const show = !dense || index === 0 || index === marks.length - 1 || index % 5 === 0;
          if (!show) return null;
          return (
            <SvgText
              key={`label-${mark}`}
              x={xFor(mark)}
              y={axisY + 34}
              fontSize={type.caption}
              fill={colours.inkSoft}
              fontWeight="700"
              textAnchor="middle"
            >
              {labelFor(mark, denominator)}
            </SvgText>
          );
        })}
      </Svg>

      {/*
        * **The tap targets are separate from the drawing, and they are 56 dp.**
        *
        * An SVG tick is three pixels wide and no ten-year-old can hit one. The
        * row below is one `size.touchMin` button per mark, laid over the same
        * positions, scrolling if the line is long. **The drawing is what she
        * reads; this is what she taps** (PRD §12).
        */}
      <View style={[styles.targets, { width: chartWidth }]}>
        {marks.map((mark) => (
          <MarkButton
            key={`hit-${mark}`}
            label={labelFor(mark, denominator)}
            state={
              chosen != null && Math.abs(mark - chosen) < 1e-9
                ? 'picked'
                : mode === 'jump' && Math.abs(mark - at) < 1e-9
                  ? 'here'
                  : 'idle'
            }
            onPress={() => tapMark(mark)}
          />
        ))}
      </View>
    </View>
  );
}

function MarkButton({
  label,
  state,
  onPress,
}: {
  label: string;
  state: 'idle' | 'picked' | 'here';
  onPress: () => void;
}) {
  return (
    <View
      style={[
        styles.mark,
        state === 'picked' && styles.markPicked,
        state === 'here' && styles.markHere,
      ]}
      onTouchEnd={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.markText, digitStyle]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/* --------------------------------------------------------------- numbers */

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

/**
 * A mark's label. **A fraction is said, not spelled** (PRD §9.1 caveat 4), so
 * a line marked in quarters reads `0`, `1/4`, `1/2`, `3/4`, `1` on screen and
 * its `say` strings carry the words.
 */
function labelFor(value: number, denominator?: number): string {
  if (!denominator) return value.toLocaleString('en-ZA').replace(/,/g, ' ');
  const parts = Math.round(value * denominator);
  const whole = Math.floor(parts / denominator);
  const rest = parts % denominator;
  if (rest === 0) return String(whole);
  const simplified = simplify(rest, denominator);
  return whole > 0
    ? `${whole} ${simplified[0]}/${simplified[1]}`
    : `${simplified[0]}/${simplified[1]}`;
}

function simplify(numerator: number, denominator: number): [number, number] {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.md },
  targets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    justifyContent: 'center',
  },
  mark: {
    minWidth: size.touchMin,
    height: size.touchMin,
    paddingHorizontal: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  markPicked: { backgroundColor: '#EAF1FC', borderWidth: 2, borderColor: colours.primary },
  markHere: { backgroundColor: colours.amber },
  markText: { fontSize: type.caption, fontWeight: '800', color: colours.ink },
});
