import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { DailyRhythm } from '@/types';

/**
 * One daily rhythm on the home screen (PRD §6.6).
 *
 * These sit pinned to today rather than on a calendar square, because the ATP
 * asks for them every school day of the year. A finished one keeps its star so
 * the child can see the routine is complete without reading anything.
 */
interface DailyCardProps {
  rhythm: DailyRhythm;
  done: boolean;
  /**
   * What the child did today, shown back on the card — the word they spelled.
   *
   * It goes in the roundel where the rhythm's picture normally sits, and it is
   * a *word*, not a picture: at the emoji size "beautiful" is four roundels
   * wide and spills out over the card. It is measured and shrunk to fit.
   */
  summaryWord?: string | null;
  onPress: () => void;
}

/** Usable width across the roundel, less its 3dp ring and the text's padding. */
const ROUNDEL_WIDTH = size.touchMin - 6 - space.xs * 2;

/** A bold character is about this much of its font size wide. */
const CHARACTER_RATIO = 0.62;

/**
 * How to set `word` so it fits inside the roundel.
 *
 * One line while that stays readable; "beautiful" on one line would be 10sp,
 * which is a badge a child cannot read, so a long word takes two lines at a
 * size that fits half of it. Nothing is ever clipped and nothing overflows —
 * the badge is a reminder of what was done, and the activity behind it shows
 * the word full size.
 */
function fitWord(word: string): { fontSize: number; lines: number } {
  const characters = Math.max(word.length, 1);
  const oneLine = Math.floor(ROUNDEL_WIDTH / (characters * CHARACTER_RATIO));
  if (oneLine >= 15) return { fontSize: Math.min(type.title, oneLine), lines: 1 };

  const twoLines = Math.floor(ROUNDEL_WIDTH / (Math.ceil(characters / 2) * CHARACTER_RATIO));
  return { fontSize: Math.max(11, Math.min(22, twoLines)), lines: 2 };
}

export function DailyCard({ rhythm, done, summaryWord, onPress }: DailyCardProps) {
  const title = t(rhythm.title);
  const word = summaryWord?.trim() || null;
  const fitted = word ? fitWord(word) : null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        word ? `${title}. Done today. Today's word: ${word}.` : done ? `${title}. Done today.` : title
      }
      style={({ pressed }) => [
        styles.card,
        shadow.card,
        {
          borderColor: done ? colours.star : rhythm.colour,
          backgroundColor: done ? '#FFFBEC' : colours.surface,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.emojiWrap,
          word
            ? { backgroundColor: colours.surface, borderWidth: 3, borderColor: rhythm.colour }
            : { backgroundColor: rhythm.colour },
        ]}
      >
        {word && fitted ? (
          <Text
            style={[styles.word, { fontSize: fitted.fontSize, lineHeight: fitted.fontSize + 2 }]}
            numberOfLines={fitted.lines}
          >
            {word}
          </Text>
        ) : (
          <Text style={styles.emoji}>{rhythm.emoji}</Text>
        )}
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {t(rhythm.subtitle)}
        </Text>
      </View>

      <Text style={[styles.star, !done && styles.starEmpty]}>⭐</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: size.touchMin + 12,
    borderRadius: size.radiusLg,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: space.lg,
    paddingLeft: space.sm,
    paddingVertical: space.sm,
    gap: space.md,
  },
  emojiWrap: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: size.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: type.emojiMd },
  word: {
    fontWeight: '900',
    color: colours.ink,
    textAlign: 'center',
    paddingHorizontal: space.xs,
  },
  textWrap: { flex: 1, gap: 2 },
  title: { fontSize: type.body, fontWeight: '900', color: colours.ink },
  subtitle: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '600' },
  star: { fontSize: type.emojiSm },
  starEmpty: { opacity: 0.2 },
});
