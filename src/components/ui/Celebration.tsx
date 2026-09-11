import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { celebrateFinish } from '@/audio/feedback';
import { BigButton } from '@/components/ui/BigButton';
import { t, ui } from '@/i18n';
import { motionDuration } from '@/theme/motion';
import { colours, size, space, type } from '@/theme/tokens';
import type { Badge } from '@/types';

/**
 * The end-of-lesson moment (PRD §6.3, §6.5). Stars, a spoken cheer, and any
 * badges that just unlocked — a lesson badge, the topic badge, and at the very
 * end of the year the Grade 2 English Star. No marks, no codes, ever
 * (PRD §6.9).
 */
interface CelebrationProps {
  stars: number;
  /** Badges earned for the first time by finishing this lesson. */
  newBadges: Badge[];
  onHome: () => void;
}

export function Celebration({ stars, newBadges, onHome }: CelebrationProps) {
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(pop, {
      toValue: 1,
      duration: motionDuration(500),
      easing: Easing.out(Easing.back(2)),
      useNativeDriver: true,
    }).start();

    const line =
      newBadges.length > 0
        ? `${t(ui.finished)} ${t(ui.badgeEarned)} You are a ${newBadges.map((badge) => t(badge.title)).join(' and a ')}!`
        : `${t(ui.finished)} ${t(ui.comeBackTomorrow)}`;
    celebrateFinish(line);
  }, [pop, newBadges]);

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, { opacity: pop, transform: [{ scale }] }]}>
        <Text style={styles.cheerEmoji}>🎉</Text>
        <Text style={styles.cheer}>{t(ui.wellDone)}</Text>

        <View style={styles.stars}>
          {Array.from({ length: 3 }, (_, index) => (
            <Text key={index} style={[styles.star, index >= stars && styles.starEmpty]}>
              ⭐
            </Text>
          ))}
        </View>

        {newBadges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
            <Text style={styles.badgeTitle}>{t(badge.title)}</Text>
          </View>
        ))}

        <Text style={styles.tomorrow}>{t(ui.comeBackTomorrow)}</Text>

        <BigButton emoji="🏠" label={t(ui.backToCalendar)} tone="happy" onPress={onHome} block />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 51, 48, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colours.surface,
    borderRadius: size.radiusLg,
    padding: space.xl,
    alignItems: 'center',
    gap: space.md,
  },
  cheerEmoji: { fontSize: type.emojiXl },
  cheer: { fontSize: type.display, fontWeight: '900', color: colours.ink },
  stars: { flexDirection: 'row', gap: space.sm },
  star: { fontSize: type.emojiLg },
  starEmpty: { opacity: 0.25 },
  badge: {
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: '#FFF8E3',
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.star,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    alignSelf: 'stretch',
  },
  badgeEmoji: { fontSize: type.emojiLg },
  badgeTitle: { fontSize: type.title, fontWeight: '900', color: colours.ink, textAlign: 'center' },
  tomorrow: {
    fontSize: type.body,
    color: colours.inkSoft,
    textAlign: 'center',
    fontWeight: '600',
  },
});
