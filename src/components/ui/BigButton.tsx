import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colours, shadow, size, space, type } from '@/theme/tokens';

/**
 * A large, unmissable action. Big enough for a six-year-old's finger and always
 * labelled with an emoji so it reads without words (PRD §4.2, §4.3).
 */
interface BigButtonProps {
  emoji: string;
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'soft' | 'happy';
  /** Fills the row instead of hugging its content. */
  block?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TONES = {
  primary: { background: colours.primary, text: '#FFFFFF' },
  happy: { background: colours.green, text: '#FFFFFF' },
  soft: { background: colours.surface, text: colours.ink },
} as const;

export function BigButton({
  emoji,
  label,
  onPress,
  tone = 'primary',
  block = false,
  disabled = false,
  style,
}: BigButtonProps) {
  const palette = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        shadow.card,
        {
          backgroundColor: palette.background,
          alignSelf: block ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        tone === 'soft' && styles.soft,
        style,
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color: palette.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: size.touchMin,
    borderRadius: size.radiusPill,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
  },
  soft: { borderWidth: 3, borderColor: colours.border },
  emoji: { fontSize: type.emojiSm },
  label: { fontSize: type.title, fontWeight: '800', flexShrink: 1 },
});
