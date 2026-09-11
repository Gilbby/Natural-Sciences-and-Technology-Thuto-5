import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Completion, TopicGroup } from '@/domain/curriculum';
import { t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * One CAPS topic, as a big tappable row (PRD §5.1, §6.1).
 *
 * Progress is one dot per lesson rather than "2 / 4", so a child who cannot
 * read still sees how far along they are. The week range is a caption for the
 * adult reading over a shoulder and is never needed to use the app.
 */
interface TopicRowProps {
  group: TopicGroup;
  progress: Completion;
  earnedBadge: boolean;
  onPress: () => void;
}

export function TopicRow({ group, progress, earnedBadge, onPress }: TopicRowProps) {
  const { topic } = group;
  const title = t(topic.title);
  const weeks =
    topic.weekStart === topic.weekEnd
      ? `Week ${topic.weekStart}`
      : `Weeks ${topic.weekStart}–${topic.weekEnd}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${progress.done} of ${progress.total} done.`}
      style={({ pressed }) => [
        styles.row,
        shadow.card,
        { borderColor: topic.colour, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: topic.colour }]}>
        <Text style={styles.emoji}>{topic.emoji}</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.caption}>{weeks}</Text>
        <View style={styles.dots}>
          {group.lessons.map((lesson, index) => (
            <View
              key={lesson._id}
              style={[
                styles.dot,
                { backgroundColor: index < progress.done ? topic.colour : colours.starEmpty },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.badge}>
        {earnedBadge ? (topic.badge?.emoji ?? '⭐') : progress.complete ? '⭐' : '▶️'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: size.touchMin + 20,
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
  textWrap: { flex: 1, gap: space.xs },
  title: { fontSize: type.body, fontWeight: '900', color: colours.ink },
  caption: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  badge: { fontSize: type.emojiSm },
});
