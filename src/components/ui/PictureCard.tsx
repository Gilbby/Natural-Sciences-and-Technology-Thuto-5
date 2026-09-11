import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { motionDuration } from '@/theme/motion';
import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * The workhorse of every activity: a big, forgiving, self-narrating picture
 * button (PRD §4.1, §4.3). Emoji carries the meaning; the label is a companion
 * for the parent reading over a shoulder, never a requirement.
 */

export type CardState = 'idle' | 'selected' | 'correct' | 'nudge' | 'done';

interface PictureCardProps {
  emoji: string;
  label: string;
  onPress: () => void;
  state?: CardState;
  /** Width/height of the square. Never smaller than the minimum touch target. */
  cardSize?: number;
  emojiSize?: number;
  showLabel?: boolean;
  disabled?: boolean;
  accent?: string;
  style?: StyleProp<ViewStyle>;
  /** A number badge, used by the sequence activity to show the order so far. */
  badgeNumber?: number;
}

/**
 * The size that fits `text` across a card of `cardWidth`.
 *
 * An emoji is one glyph wide whatever size it is set at, so the emoji slot was
 * sized for exactly that. This app puts **words and whole sentences** in the
 * same slot — a `speakAlong` line, a word card, a `spell-word` tile — and six
 * letters at the emoji size run wider than the card and spill out over its
 * edge. Letters get measured; emoji are left alone.
 */
function fitGlyph(text: string, requested: number, cardWidth: number): number {
  if (!/[A-Za-z]/.test(text)) return requested;
  const usable = cardWidth - space.sm * 2;
  const perCharacter = 0.62;
  const fitted = Math.floor(usable / (Math.max(text.length, 1) * perCharacter));
  return Math.max(20, Math.min(requested, fitted));
}

const STATE_STYLE: Record<CardState, { border: string; background: string }> = {
  idle: { border: colours.border, background: colours.surface },
  selected: { border: colours.primary, background: '#EAF4FD' },
  correct: { border: colours.green, background: '#E9F8EC' },
  nudge: { border: colours.nudge, background: '#FFF3E0' },
  done: { border: colours.border, background: '#F4F1EC' },
};

export function PictureCard({
  emoji,
  label,
  onPress,
  state = 'idle',
  cardSize = size.tile,
  emojiSize = type.emojiMd,
  showLabel = true,
  disabled = false,
  accent,
  style,
  badgeNumber,
}: PictureCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // A wrong tap wobbles the card. It never turns red (PRD §4.4).
  useEffect(() => {
    if (state !== 'nudge') return;
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: motionDuration(60), useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: motionDuration(60), useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: motionDuration(60), useNativeDriver: true }),
    ]).start();
  }, [state, shake]);

  useEffect(() => {
    if (state !== 'correct') return;
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.12, useNativeDriver: true, speed: 20, bounciness: 12 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 16, bounciness: 8 }),
    ]).start();
  }, [state, scale]);

  const palette = STATE_STYLE[state];
  const borderColour = state === 'idle' && accent ? accent : palette.border;

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale },
            { translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] }) },
          ],
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.card,
          shadow.card,
          {
            width: cardSize,
            minHeight: cardSize,
            borderColor: borderColour,
            backgroundColor: palette.background,
            opacity: disabled ? 0.55 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        {badgeNumber !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeNumber}</Text>
          </View>
        )}
        <Text style={{ fontSize: fitGlyph(emoji, emojiSize, cardSize) }} numberOfLines={1}>
          {emoji}
        </Text>
        {showLabel && (
          <Text style={styles.label} numberOfLines={3}>
            {label}
          </Text>
        )}
        {state === 'correct' && (
          <View style={styles.tick}>
            <Text style={styles.tickText}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: size.touchMin,
    borderRadius: size.radius,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    paddingHorizontal: space.xs,
    gap: space.xs,
  },
  label: {
    fontSize: type.caption,
    lineHeight: type.caption + 4,
    color: colours.inkSoft,
    textAlign: 'center',
    fontWeight: '600',
  },
  tick: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colours.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  badge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colours.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
