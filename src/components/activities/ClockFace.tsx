import React, { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

import { celebrateCorrect, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, size, space, type } from '@/theme/tokens';
import type { ClockFaceActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `clock-face` — **an analogue face and a digital readout, side by side and
 * always agreeing** (PRD §7.2).
 *
 * Term 4's whole time block. *"Read, tell and write time in 12-hour and 24-hour
 * formats on both analogue and digital instruments"* is one ATP row and it is
 * one component: **set either one and the other follows.** A child who moves
 * the big hand to the 6 and watches the readout say `:30` in the same movement
 * has been *shown* what half past means rather than told it.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  **THIS FILE MEASURES NOTHING.**
 *
 *  It is the one file in the app exempted from the `Date.now()` ban in
 *  `scripts/check-content.ts` check 5, because a clock face has to draw hands.
 *  **It is not exempt from the token ban and it does not need to be.**
 *
 *  There is no stopwatch in the stopwatch lesson. Nothing here reads the
 *  system clock, nothing here starts an interval, and nothing here records how
 *  long the child took. The hands are at `activity.hour` and `activity.minute`
 *  because the *content* put them there (PRD §1.1 rule 1, §11 check 5).
 *
 *  > The ATP names *"clocks, watches and stopwatches"* as instruments to read.
 *  > **The app draws a stopwatch; it never runs one.**
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── The hands move on buttons, not on a drag ──────────────────────────────
 *
 * Dragging a clock hand needs precision a ten-year-old on a cracked screen
 * does not have, and PRD §4 principle 1 rules out any gesture that does. So
 * the hands move on four `size.touchMin` buttons — hour up and down, minute up
 * and down in fives — and the face redraws.
 */
export function ClockFace({ activity, onFinished }: ActivityViewProps<ClockFaceActivity>) {
  const { mode, show, format, target } = activity;

  const [hour, setHour] = useState(mode === 'set' ? 12 : activity.hour);
  const [minute, setMinute] = useState(mode === 'set' ? 0 : activity.minute);
  const attempts = useRef(1);
  const finished = useRef(false);

  const settle = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    celebrateCorrect(t(activity.say));
    onFinished({ correct: true, attempts: attempts.current });
  }, [activity.say, onFinished]);

  const move = useCallback(
    (deltaHour: number, deltaMinute: number) => {
      attempts.current += 1;
      let nextMinute = minute + deltaMinute;
      let nextHour = hour + deltaHour;
      if (nextMinute >= 60) {
        nextMinute -= 60;
        nextHour += 1;
      }
      if (nextMinute < 0) {
        nextMinute += 60;
        nextHour -= 1;
      }
      nextHour = ((nextHour % 24) + 24) % 24;
      setHour(nextHour);
      setMinute(nextMinute);
      speakLabel(sayTime(nextHour, nextMinute, format));
      if (target && nextHour === target.hour && nextMinute === target.minute) {
        // Settle on the next tick so the child hears the time before the praise.
        setTimeout(settle, 0);
      }
    },
    [hour, minute, format, target, settle],
  );

  /**
   * `read` mode gives her the face and asks her to say what it says — the
   * finish is the tap on the readout, because reading a clock *is* saying the
   * time.
   */
  const confirmRead = useCallback(() => {
    speakLabel(t(activity.say));
    if (mode === 'read' || mode === 'match') settle();
  }, [mode, activity.say, settle]);

  const showFace = show === 'analogue' || show === 'both';
  const showDigital = show === 'digital' || show === 'both';

  return (
    <View style={styles.wrap}>
      <View style={styles.pair}>
        {showFace ? <Face hour={hour} minute={minute} second={activity.second} /> : null}

        {showDigital ? (
          <Pressable
            style={styles.readout}
            accessibilityRole="button"
            accessibilityLabel={sayTime(hour, minute, format)}
            onPress={confirmRead}
          >
            <Text style={[styles.readoutText, digitStyle]}>
              {readTime(hour, minute, format, activity.second)}
            </Text>
            <Text style={styles.readoutHint}>tap to hear it</Text>
          </Pressable>
        ) : null}
      </View>

      {mode === 'set' ? (
        <View style={styles.controls}>
          <Knob label="hour −" onPress={() => move(-1, 0)} />
          <Knob label="5 min −" onPress={() => move(0, -5)} />
          <Knob label="5 min +" onPress={() => move(0, 5)} />
          <Knob label="hour +" onPress={() => move(1, 0)} />
        </View>
      ) : null}

      {/*
        * The 12-hour / 24-hour label, spoken. The ATP asks for both formats and
        * a child who does not know which one she is looking at has been shown
        * two different clocks.
        */}
      <Pressable
        style={styles.formatChip}
        accessibilityRole="button"
        onPress={() => speakLabel(`This is ${format.replace('-', ' ')} time.`)}
      >
        <Text style={styles.formatText}>{format} time</Text>
      </Pressable>
    </View>
  );
}

function Knob({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      style={styles.knob}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
    >
      <Text style={styles.knobText}>{label}</Text>
    </Pressable>
  );
}

/** The drawn face. Nothing here reads a system clock. */
function Face({ hour, minute, second }: { hour: number; minute: number; second?: number }) {
  const r = 92;
  const cx = r + 10;
  const cy = r + 10;

  // Angles from twelve o'clock, clockwise.
  const minuteAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;

  const hand = (angle: number, length: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(radians) * length, y: cy + Math.sin(radians) * length };
  };

  const minuteEnd = hand(minuteAngle, r * 0.78);
  const hourEnd = hand(hourAngle, r * 0.52);
  const secondEnd = second != null ? hand((second / 60) * 360, r * 0.84) : null;

  return (
    <Svg width={(r + 10) * 2} height={(r + 10) * 2}>
      <Circle cx={cx} cy={cy} r={r} fill={colours.surface} stroke={colours.ink} strokeWidth={4} />

      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * 360;
        const outer = hand(angle, r * 0.88);
        const inner = hand(angle, r * 0.78);
        const numeral = hand(angle, r * 0.66);
        return (
          <React.Fragment key={index}>
            <Line
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={colours.inkSoft}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <SvgText
              x={numeral.x}
              y={numeral.y + 6}
              fontSize={type.body}
              fontWeight="800"
              fill={colours.ink}
              textAnchor="middle"
            >
              {index === 0 ? 12 : index}
            </SvgText>
          </React.Fragment>
        );
      })}

      <Line
        x1={cx}
        y1={cy}
        x2={hourEnd.x}
        y2={hourEnd.y}
        stroke={colours.ink}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Line
        x1={cx}
        y1={cy}
        x2={minuteEnd.x}
        y2={minuteEnd.y}
        stroke={colours.primaryDark}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {secondEnd ? (
        <Line
          x1={cx}
          y1={cy}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke={colours.amber}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ) : null}
      <Circle cx={cx} cy={cy} r={6} fill={colours.ink} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ time */

/** `14:30`, or `2:30 pm`. The app never spells a colon aloud. */
export function readTime(
  hour: number,
  minute: number,
  format: '12-hour' | '24-hour',
  second?: number,
): string {
  const mm = String(minute).padStart(2, '0');
  const ss = second != null ? `:${String(second).padStart(2, '0')}` : '';
  if (format === '24-hour') return `${String(hour).padStart(2, '0')}:${mm}${ss}`;
  const suffix = hour < 12 ? 'am' : 'pm';
  const shown = hour % 12 === 0 ? 12 : hour % 12;
  return `${shown}:${mm}${ss} ${suffix}`;
}

const MINUTE_WORDS: Record<number, string> = {
  0: "o'clock",
  15: 'quarter past',
  30: 'half past',
  45: 'quarter to',
};

/**
 * **The time, said the way a child says it** — PRD §9.1.
 *
 * *"half past two in the afternoon"*, not *"fourteen colon three zero"*. A
 * device voice handed `14:30` will say the second thing.
 */
export function sayTime(hour: number, minute: number, format: '12-hour' | '24-hour'): string {
  const shown = hour % 12 === 0 ? 12 : hour % 12;
  const partOfDay = hour < 12 ? 'in the morning' : hour < 18 ? 'in the afternoon' : 'at night';

  if (format === '24-hour') {
    const mm = minute === 0 ? "o'clock" : `${minute} minutes`;
    return `${hour} hundred ${mm === "o'clock" ? 'hours' : mm}`.replace('  ', ' ');
  }

  const word = MINUTE_WORDS[minute];
  if (word === "o'clock") return `${shown} o'clock ${partOfDay}`;
  if (word === 'quarter to') return `quarter to ${shown === 12 ? 1 : shown + 1} ${partOfDay}`;
  if (word) return `${word} ${shown} ${partOfDay}`;
  if (minute < 30) return `${minute} minutes past ${shown} ${partOfDay}`;
  return `${60 - minute} minutes to ${shown === 12 ? 1 : shown + 1} ${partOfDay}`;
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.lg },
  pair: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readout: {
    minWidth: 150,
    minHeight: size.touchMin + space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: size.radiusLg,
    backgroundColor: colours.ink,
  },
  readoutText: { fontSize: type.display, fontWeight: '900', color: '#8FE38F' },
  readoutHint: { fontSize: type.caption, color: '#9E97AE' },
  controls: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap', justifyContent: 'center' },
  knob: {
    minWidth: size.touchMin + space.md,
    height: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.sm,
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  knobText: { fontSize: type.caption, fontWeight: '800', color: colours.primaryDark },
  formatChip: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: size.radiusPill,
    backgroundColor: colours.surfaceAlt,
  },
  formatText: { fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },
});
