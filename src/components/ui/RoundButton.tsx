import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * A circular control (home, replay, month arrows). Always at least the minimum
 * touch target, always carrying an accessibility label that matches what it
 * says out loud (PRD §4.3, §4.5).
 */
interface RoundButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
  /** Small caption under the circle — for the accompanying adult. */
  caption?: string;
  background?: string;
  diameter?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function RoundButton({
  emoji,
  label,
  onPress,
  caption,
  background = colours.surface,
  diameter = size.touchMin,
  disabled = false,
  style,
}: RoundButtonProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.circle,
          shadow.card,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: background,
            opacity: disabled ? 0.4 : 1,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </Pressable>
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: space.xs },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colours.border,
  },
  emoji: { fontSize: type.emojiSm },
  caption: { fontSize: type.caption, color: colours.inkSoft, fontWeight: '700' },
});
