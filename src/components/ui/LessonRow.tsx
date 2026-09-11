import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { Lesson } from '@/types';

/**
 * One lesson, as a big tappable row. Shared by the subject screen and anywhere
 * else lessons are listed, so a lesson looks the same wherever a child meets it.
 */
interface LessonRowProps {
  lesson: Lesson;
  done: boolean;
  onPress: () => void;
  /** Small caption for the accompanying adult — a date, say. Never required. */
  caption?: string;
}

export function LessonRow({ lesson, done, onPress, caption }: LessonRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t(lesson.title)}
      style={({ pressed }) => [
        styles.row,
        shadow.card,
        { borderColor: lesson.colour, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: lesson.colour }]}>
        <Text style={styles.emoji}>{lesson.emoji}</Text>
      </View>

      <View style={styles.textWrap}>
        {lesson.kind === 'challenge' && <Text style={styles.challengeTag}>🏆 Star Challenge</Text>}
        <Text style={styles.title} numberOfLines={2}>
          {t(lesson.title)}
        </Text>
        {caption && <Text style={styles.caption}>{caption}</Text>}
      </View>

      <Text style={[styles.star, !done && styles.starEmpty]}>⭐</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: size.touchMin + 12,
    backgroundColor: colours.surface,
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
  textWrap: { flex: 1, gap: 2 },
  challengeTag: {
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.pink,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { fontSize: type.body, fontWeight: '800', color: colours.ink },
  caption: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '600' },
  star: { fontSize: type.emojiSm },
  starEmpty: { opacity: 0.2 },
});
