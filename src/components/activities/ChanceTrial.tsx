import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { celebrateFinish, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, digitStyle, size, space, type } from '@/theme/tokens';
import type { ChanceTrialActivity } from '@/types';

import type { ActivityViewProps } from './types';

/**
 * `chance-trial` — **toss, roll or spin, and the app never rigs it**
 * (PRD §1.1 rule 4, §6.5d, §11 check 4, §17 test 7).
 *
 * *"Perform simple repeated events and list possible outcomes for experiments
 * such as tossing a coin, rolling a die, spinning a spinner"* and *"count and
 * compare the frequency of actual outcomes for a series of trials up to 20
 * trials"*. The child taps to toss; the app tosses; the tally builds; twenty
 * trials and stop.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  **THE ONE RULE THIS FILE EXISTS TO KEEP**
 *
 *  `Math.random()` and nothing else.
 *
 *    · **no seed** — there is no `seed` field on the type and there will never
 *      be one;
 *    · **no filter** — no re-roll, no "if the first five are all heads", no
 *      nudging towards ten and ten;
 *    · **no balancing** — the tally is whatever happened.
 *
 *  **The whole content of this ATP block is that twenty tosses do not come out
 *  ten and ten.** A child who runs it and gets thirteen and seven has learnt
 *  the lesson. **One who gets ten and ten every time has learnt a lie.**
 *
 *  `scripts/check-content.ts` check 4 greps this file's own source for
 *  filtering and fails the build if it finds any. It is crude, and it is the
 *  right crudeness: **the failure it prevents is somebody making the demo look
 *  tidy** before a meeting.
 *
 *  > **The trap here is new to this family and it is about integrity rather
 *  > than capability.** Every other *"the phone can do this"* finding has been
 *  > about what the device can manage. **This one is about what it must not
 *  > do**: the same code that makes twenty honest trials possible makes rigging
 *  > them a one-line change, and a rigged probability lesson teaches the exact
 *  > opposite of the thing (PRD §18.1 finding 4).
 * ══════════════════════════════════════════════════════════════════════════
 *
 * ── Listing the outcomes comes first ──────────────────────────────────────
 *
 * *"List possible outcomes"* is the ATP's **first** verb and it happens before
 * a single trial is run. The outcomes sit across the top as a row of cards from
 * the moment the screen opens, and the child can tap each one to hear it.
 *
 * ── Nothing here is a prediction that gets marked ─────────────────────────
 *
 * The `ask` is spoken **after** the trials, and it asks her to notice, not to
 * guess in advance and be scored. There is no right answer to *"did it come out
 * ten and ten?"* — the answer is whatever the coin did (PRD §1.1 rule 2).
 *
 * And, as everywhere: **nothing is timed.** She may take as long as she likes
 * between taps, and no part of this screen changes because she was slow.
 */
export function ChanceTrial({ activity, onFinished }: ActivityViewProps<ChanceTrialActivity>) {
  const { outcomes, trials, kind } = activity;

  const [rolls, setRolls] = useState<string[]>([]);
  const finished = useRef(false);

  const tally = useMemo(() => {
    const counts = new Map<string, number>();
    for (const outcome of outcomes) counts.set(outcome.id, 0);
    for (const roll of rolls) counts.set(roll, (counts.get(roll) ?? 0) + 1);
    return counts;
  }, [rolls, outcomes]);

  const done = rolls.length >= trials;

  const runOne = useCallback(() => {
    if (done) return;

    /*
     * ─── THE TOSS ────────────────────────────────────────────────────────
     *
     * One call to Math.random(), scaled to the number of outcomes, used.
     *
     * **Whatever comes out is what the child sees.** There is deliberately no
     * code between this line and `setRolls` — no check of what came before, no
     * count of how many heads there have been, no adjustment of any kind. If
     * you are reading this because you want the demo to look neater: that is
     * the change PRD §1.1 rule 4 forbids, and check 4 will fail your build.
     */
    const index = Math.floor(Math.random() * outcomes.length);
    const outcome = outcomes[index];

    const next = [...rolls, outcome.id];
    setRolls(next);
    speakLabel(t(outcome.label));

    if (next.length >= trials && !finished.current) {
      finished.current = true;
      // The ask is spoken after the last trial, never before the first.
      setTimeout(() => celebrateFinish(t(activity.ask.text)), 400);
      onFinished({ correct: true, attempts: 1 });
    }
  }, [done, outcomes, rolls, trials, activity.ask, onFinished]);

  return (
    <View style={styles.wrap}>
      {/* The outcomes, listed before anything is tossed. The ATP's first verb. */}
      <View style={styles.outcomes}>
        {outcomes.map((outcome) => (
          <Pressable
            key={outcome.id}
            style={styles.outcomeCard}
            accessibilityRole="button"
            accessibilityLabel={t(outcome.label)}
            onPress={() => speakLabel(t(outcome.label))}
          >
            <Text style={styles.outcomeEmoji}>{outcome.emoji}</Text>
            <Text style={styles.outcomeLabel} numberOfLines={1}>
              {t(outcome.label)}
            </Text>
            <Text style={[styles.outcomeCount, digitStyle]}>{tally.get(outcome.id) ?? 0}</Text>
          </Pressable>
        ))}
      </View>

      {/* The tally, building as it goes — five marks and a gate. */}
      <View style={styles.tallyBlock}>
        {outcomes.map((outcome) => (
          <View key={`tally-${outcome.id}`} style={styles.tallyRow}>
            <Text style={styles.tallyName} numberOfLines={1}>
              {t(outcome.label)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.tallyMarks}>{tallyMarks(tally.get(outcome.id) ?? 0)}</Text>
            </ScrollView>
          </View>
        ))}
      </View>

      <Pressable
        style={[styles.go, done && styles.goDone]}
        accessibilityRole="button"
        accessibilityLabel={done ? 'all done' : verbFor(kind)}
        onPress={runOne}
        disabled={done}
      >
        <Text style={styles.goText}>{done ? 'all done' : verbFor(kind)}</Text>
        <Text style={[styles.goCount, digitStyle]}>
          {rolls.length} of {trials}
        </Text>
      </Pressable>

      {/*
        * **The question, and it arrives after the experiment.** It is a thing
        * to notice, not a thing to be right about.
        */}
      {done ? (
        <Pressable
          style={styles.ask}
          accessibilityRole="button"
          onPress={() => speakLabel(t(activity.ask.text))}
        >
          <Text style={styles.askText}>{t(activity.ask.text)}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function verbFor(kind: ChanceTrialActivity['kind']): string {
  if (kind === 'coin') return 'toss it';
  if (kind === 'die') return 'roll it';
  return 'spin it';
}

/** Five marks and a gate — the way a tally is actually written. */
function tallyMarks(count: number): string {
  const gates = Math.floor(count / 5);
  const rest = count % 5;
  return `${'卌 '.repeat(gates)}${'|'.repeat(rest)}`.trim() || '—';
}

const styles = StyleSheet.create({
  wrap: { gap: space.lg },
  outcomes: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  outcomeCard: {
    minWidth: size.tile,
    minHeight: size.touchMin + space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: size.radius,
    backgroundColor: colours.surfaceAlt,
  },
  outcomeEmoji: { fontSize: type.emojiMd },
  outcomeLabel: { fontSize: type.caption, fontWeight: '700', color: colours.inkSoft },
  outcomeCount: { fontSize: type.digit, fontWeight: '900', color: colours.ink },
  tallyBlock: { gap: space.xs },
  tallyRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 36 },
  tallyName: { width: 84, fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },
  tallyMarks: { fontSize: type.title, letterSpacing: 2, color: colours.ink },
  go: {
    alignSelf: 'center',
    minWidth: 180,
    minHeight: size.touchMin + space.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: size.radiusLg,
    backgroundColor: colours.primary,
  },
  goDone: { backgroundColor: colours.inkSoft },
  goText: { fontSize: type.title, fontWeight: '900', color: colours.surface },
  goCount: { fontSize: type.caption, fontWeight: '700', color: colours.surface },
  ask: {
    minHeight: size.touchMin,
    justifyContent: 'center',
    padding: space.md,
    borderRadius: size.radius,
    backgroundColor: colours.surface,
  },
  askText: { fontSize: type.body, fontWeight: '700', color: colours.ink, lineHeight: 26 },
});
