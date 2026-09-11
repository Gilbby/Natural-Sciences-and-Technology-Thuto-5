import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Completion, SubjectGroup } from '@/domain/curriculum';
import { t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * The subject on the home screen (PRD §5.4).
 *
 * Progress is shown as one dot per *term* rather than per lesson — a year has
 * far too many lessons to read as dots.
 */
interface SubjectTileProps {
  group: SubjectGroup;
  progress: Completion;
  /** Per-term completion, so the dots tell a child how far through the year they are. */
  termsComplete: boolean[];
  onPress: () => void;
}

export function SubjectTile({ group, progress, termsComplete, onPress }: SubjectTileProps) {
  const { subject } = group;
  const label = t(subject.title);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${progress.done} of ${progress.total} lessons done.`}
      style={({ pressed }) => [
        styles.tile,
        shadow.card,
        {
          borderColor: subject.colour,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.emojiWrap, { backgroundColor: subject.colour }]}>
        <Text style={styles.emoji}>{subject.emoji}</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {label}
        </Text>

        <View style={styles.terms}>
          {termsComplete.map((complete, index) => (
            <View
              key={index}
              style={[
                styles.termPip,
                { backgroundColor: complete ? subject.colour : colours.starEmpty },
              ]}
            >
              <Text style={[styles.termLabel, complete && styles.termLabelOn]}>{index + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.chevron}>{progress.complete ? '🏆' : '▶️'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: size.touchMin + 16,
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
  title: { fontSize: type.title, fontWeight: '900', color: colours.ink },
  terms: { flexDirection: 'row', gap: space.xs },
  termPip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termLabel: { fontSize: 12, fontWeight: '900', color: colours.inkSoft },
  termLabelOn: { color: '#FFFFFF' },
  chevron: { fontSize: type.emojiSm },
});
