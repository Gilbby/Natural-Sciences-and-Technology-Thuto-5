import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { speak } from '@/audio/speech';
import { Figure, FIGURE_DESCRIPTIONS } from '@/figures';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { FigureId } from '@/types';

/**
 * **The drawn figure, above the question about it** — PRD §7.4.
 *
 * **Borrowed whole from *Social Sciences Thuto 4*** and cut down. That app's
 * version named the *kind* of source — a picture, some writing, an old thing, a
 * map — because naming the kinds was its Term 1 curriculum. This app has no
 * such row, so the label went and the rest stayed: one drawing, tappable, above
 * whatever the activity is.
 *
 * ── Why this exists at all, when `read-text` already has a table layout ────
 *
 * A table is a text and renders as one: every cell is a line, every word speaks
 * on tap. **A bar graph is not.** It is a drawing with numbers on it, and this
 * ATP asks the child to read one four times — *"Presents information using a
 * map, chart, graph or diagram"*, *"Interprets graphic information"*, *"Reads
 * an information text with visuals, e.g., maps/ graphs/ charts/ tables"*,
 * *"Transfers information from the visual to narrative form."*
 *
 * A lesson's activities usually name **the same figure**, so the child keeps
 * looking at one picture while the questions change. That is what the ATP's own
 * sentence asks for, and it is why the figure lives on the activity rather than
 * inside one component.
 *
 * ── Tapping it speaks it, and that is not decoration ─────────────────────
 *
 * PRD §4 principle 9 says pictures carry support and never meaning. **In these
 * four cycles the picture very often *is* the evidence**, so the rule is
 * refined rather than relaxed: **the figure carries a spoken description that
 * answers the question without the picture.** A child who cannot see it must
 * still be able to answer.
 *
 * The description says plainly what is in the frame. **It never says what it
 * means** — working that out is the child's job and it is the whole of *"turn
 * the picture into two sentences"*.
 *
 * And, inherited with the component: **the description does not count against
 * the term's word ceiling** (PRD §8.2c rule 4). It is the app's own voice,
 * in the same class as a prompt.
 */
export function SourceFigure({ figure }: { figure: FigureId }) {
  const { width } = useWindowDimensions();
  // Leave the screen margins alone and cap it, so a tablet does not turn one
  // drawing into the whole page.
  const figureWidth = Math.min(width - space.lg * 4, 320);

  const description = FIGURE_DESCRIPTIONS[figure];

  const describe = useCallback(() => {
    if (description) speak(description);
  }, [description]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={describe}
        accessibilityRole="image"
        accessibilityLabel={description ?? 'A picture'}
        accessibilityHint="Tap to hear what is in the picture"
        style={({ pressed }) => [
          styles.card,
          shadow.card,
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        <Figure id={figure} width={figureWidth} />
      </Pressable>
      <Text style={styles.hint}>Tap the picture to hear what is in it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.sm, marginBottom: space.md },
  card: {
    backgroundColor: colours.surface,
    borderRadius: size.radius,
    borderWidth: 2,
    borderColor: colours.border,
    padding: space.md,
    minHeight: size.touchMin,
  },
  hint: { fontSize: type.caption, color: colours.inkSoft },
});
