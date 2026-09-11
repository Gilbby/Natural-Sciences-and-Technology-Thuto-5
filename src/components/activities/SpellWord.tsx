import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { celebrateFinish, nudgeRetry, speakLabel } from '@/audio/feedback';
import { speak, speakSequence } from '@/audio/speech';
import { BigButton } from '@/components/ui/BigButton';
import { useApp } from '@/context/AppProvider';
import { promptText, t, ui } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { DailyRecord, SpellWordActivity } from '@/types';
import { WEEKDAY_LABELS, addDays, mondayIndex, startOfWeek, toDateKey } from '@/utils/dates';

import type { ActivityViewProps } from './types';

/**
 * `spell-word` — My Word Wall's build step (PRD §6.6, §7).
 *
 * **This is not a spelling test, and at Grade 5 FAL it is not a phonics drill
 * either.** The ATP has no phonics row anywhere; what it has, in **every block
 * of the year without exception**, is this: *"Records words and their meanings
 * in a personal dictionary or word wall."* This component is that row, as a
 * tap — the child hears the word, hears it used in a sentence, sees its
 * picture, builds it from parts, and watches it join the wall.
 *
 * **The wall collects; it does not test.** `spelledCorrectly` was deliberately
 * removed from the daily record in this fork (PRD §10): a child building their
 * first personal dictionary in a language they do not speak at home is not
 * being marked on the spelling of it. Finishing writes the word to today's
 * record *and* to the wall, which outlives the week.
 *
 * Two rules that are easy to get wrong:
 *
 *   - A tile is *shown* as its letters and *spoken* as its sound. A device
 *     asked to read a bare letter group gives you the letter names, which is
 *     the one thing a language app must never teach (PRD §9.1). The `say`
 *     string is not optional and the validator fails the build without it.
 *   - The tiles must spell the word exactly, in order, when the right ones are
 *     tapped. The validator checks that, because a word that cannot be built is
 *     a screen a child can never leave.
 *
 * There is no attempt limit, no timer and no score. A wrong part wobbles and
 * the word is said again (PRD §4.6 — nobody fails).
 */
export function SpellWord({
  activity,
  onFinished,
  onRegisterIntro,
}: ActivityViewProps<SpellWordActivity>) {
  const { today, updateToday, loadDailyRecords, addToWordWall } = useApp();
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [week, setWeek] = useState<DailyRecord[]>([]);
  const attempts = useRef(0);
  const finished = useRef(false);
  const celebrated = useRef(false);

  const target = t(activity.word).toLowerCase();
  const now = new Date();
  const todayIndex = mondayIndex(now);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => toDateKey(addDays(startOfWeek(now), i))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [today.date],
  );

  useEffect(() => {
    let active = true;
    loadDailyRecords(weekDates).then((records) => {
      if (active) setWeek(records);
    });
    return () => {
      active = false;
    };
  }, [loadDailyRecords, weekDates, today.word]);

  const built = placed.join('');
  const complete = built === target;

  /** The word, said once — this is a listening task first. */
  const sayTheWord = useCallback(() => {
    speak(t(activity.say));
  }, [activity.say]);

  /*
   * The word is handed to the player, not spoken from here.
   *
   * Effects run child-first, so saying it on mount queued the word a tick
   * before the screen said "Listen to the word, then tap the letters" — and
   * the prompt interrupts, which swallowed it. The child got the instruction
   * and then silence, with "Hear it again" the only way to hear the word at
   * all. The player now says it once the prompt has finished (PRD §9.1).
   */
  useEffect(() => {
    if (!onRegisterIntro) {
      sayTheWord();
      return;
    }
    onRegisterIntro(sayTheWord);
    return () => onRegisterIntro(null);
  }, [onRegisterIntro, sayTheWord]);

  useEffect(() => {
    if (!complete || celebrated.current) return;
    celebrated.current = true;
    // The wall collects; it does not test. `spelledCorrectly` is deliberately
    // gone from the daily record (PRD §10) — a child building their first
    // personal dictionary in a language they do not speak at home is not being
    // marked on the spelling.
    void updateToday({ word: target, wordAdded: true });
    /*
     * And the word joins the wall itself, which outlives the day's record —
     * "Records words and their meanings in a personal dictionary or word
     * wall" is printed in every cycle of this ATP (PRD §6.6, §10). The
     * picture is the activity's emoji, because a wall a child cannot read is a
     * blank wall.
     */
    void addToWordWall({
      word: target,
      say: t(activity.say),
      picture: activity.emoji,
      meaning: promptText(activity.sentence),
      metIn: activity.pattern,
      addedOn: toDateKey(new Date()),
    });
    celebrateFinish(`${t(ui.wordDone)} ${target}. ${promptText(activity.sentence)}`);
  }, [complete, target, updateToday, addToWordWall, activity]);

  const tapTile = useCallback(
    (tileId: string, say: string) => {
      if (complete) return;
      const next = built + tileId;
      if (!target.startsWith(next)) {
        // Wrong letter. It wobbles, the word is said again, and nothing is
        // recorded against the child (PRD §4.7).
        attempts.current += 1;
        setWrong(tileId);
        setTimeout(() => setWrong(null), 400);
        nudgeRetry(`Listen again. ${t(activity.say)}.`);
        return;
      }
      speakLabel(say);
      setPlaced((prev) => [...prev, tileId]);
    },
    [built, complete, target, activity.say],
  );

  /** Tapping a placed tile takes it back. No penalty, ever. */
  const takeBack = useCallback(
    (index: number) => {
      if (complete) return;
      setPlaced((prev) => prev.slice(0, index));
      speak(t(activity.say));
    },
    [complete, activity.say],
  );

  const sayItAgain = useCallback(() => {
    if (complete) {
      speakSequence([target, promptText(activity.sentence)]);
      return;
    }
    speakSequence([t(activity.say), t(ui.tapTheLetters)]);
  }, [complete, target, activity.say, activity.sentence]);

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished({ correct: true, attempts: Math.max(1, attempts.current) });
  }, [onFinished]);

  const wordAt = (records: DailyRecord[], dateKey: string): string => {
    const record = records.find((entry) => entry.date === dateKey);
    return record?.word ?? '·';
  };

  return (
    <View style={styles.container}>
      <View style={styles.builtCard}>
        <Text style={styles.builtLabel}>{t(ui.myWordToday)}</Text>
        <View style={styles.strip}>
          {placed.length === 0 && <Text style={styles.stripEmpty}>?</Text>}
          {placed.map((tile, index) => (
            <Pressable
              key={`${tile}-${index}`}
              onPress={() => takeBack(index)}
              accessibilityRole="button"
              accessibilityLabel={`${tile}. Tap to take it back.`}
              style={[styles.stripTile, complete && styles.stripTileDone]}
            >
              <Text style={styles.stripTileText}>{tile}</Text>
            </Pressable>
          ))}
        </View>
        {complete && <Text style={styles.builtEmoji}>{activity.emoji}</Text>}
        <Text style={styles.pattern}>{activity.pattern}</Text>
      </View>

      <Text style={styles.sectionLabel}>
        {complete ? t(ui.wordDone) : t(ui.tapTheLetters)}
      </Text>

      <View style={styles.grid}>
        {activity.tiles.map((tile) => (
          <Pressable
            key={tile.id}
            onPress={() => tapTile(tile.id, t(tile.say))}
            disabled={complete}
            accessibilityRole="button"
            accessibilityLabel={t(tile.say)}
            style={({ pressed }) => [
              styles.tile,
              shadow.card,
              wrong === tile.id && styles.tileWrong,
              complete && styles.tileDim,
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
          >
            <Text style={styles.tileText}>{t(tile.label)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.weekCard}>
        <Text style={styles.weekTitle}>{t(ui.myWordWeek)}</Text>
        <View style={styles.weekRow}>
          {WEEKDAY_LABELS.map((label, index) => (
            <View key={label} style={styles.weekCell}>
              <Text style={[styles.weekDay, index === todayIndex && styles.weekDayToday]}>
                {label[0]}
              </Text>
              <Text style={styles.weekWord} numberOfLines={1}>
                {wordAt(week, weekDates[index])}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <BigButton emoji="🔁" label={t(ui.hearItAgain)} tone="soft" onPress={sayItAgain} block />

      <BigButton
        emoji={complete ? '🎉' : '✅'}
        label={t(ui.done)}
        tone={complete ? 'happy' : 'soft'}
        onPress={complete ? done : sayItAgain}
        block
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg },

  builtCard: {
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radiusLg,
    paddingVertical: space.md,
  },
  builtLabel: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  strip: { flexDirection: 'row', gap: space.xs, minHeight: 56, alignItems: 'center' },
  stripEmpty: { fontSize: type.emojiLg, fontWeight: '900', color: colours.inkSoft },
  stripTile: {
    minWidth: 40,
    minHeight: 52,
    paddingHorizontal: space.sm,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.primary,
    backgroundColor: colours.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripTileDone: { borderColor: colours.green, backgroundColor: '#E9F8EC' },
  stripTileText: { fontSize: 30, fontWeight: '900', color: colours.primaryDark },
  builtEmoji: { fontSize: type.emojiMd },
  pattern: { fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },

  sectionLabel: {
    textAlign: 'center',
    fontSize: type.body,
    fontWeight: '800',
    color: colours.inkSoft,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  tile: {
    minWidth: size.touchMin,
    minHeight: size.touchMin,
    paddingHorizontal: space.md,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.border,
    backgroundColor: colours.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileWrong: { borderColor: colours.nudge, backgroundColor: '#FFF3E0' },
  tileDim: { opacity: 0.5 },
  tileText: { fontSize: 28, fontWeight: '900', color: colours.ink },

  weekCard: {
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    padding: space.md,
    gap: space.sm,
  },
  weekTitle: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekRow: { flexDirection: 'row' },
  weekCell: { flex: 1, alignItems: 'center', gap: 2 },
  weekDay: { fontSize: type.caption, fontWeight: '800', color: colours.inkSoft },
  weekDayToday: { color: colours.primaryDark },
  weekWord: { fontSize: 13, fontWeight: '900', color: colours.ink },
});
