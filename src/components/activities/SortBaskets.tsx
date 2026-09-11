import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { speak } from '@/audio/speech';
import { PictureCard } from '@/components/ui/PictureCard';
import { promptText, t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { SortBasketsActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `sort-baskets` — tap an item, then tap the basket it belongs in
 * (PRD §7; booklet A1, A3, A5).
 *
 * Tap-to-place rather than drag: small fingers drop drags, and a dropped drag
 * feels like failure. Two taps never do.
 */
export function SortBaskets({ activity, onFinished }: ActivityViewProps<SortBasketsActivity>) {
  const { width } = useWindowDimensions();
  const [remaining, setRemaining] = useState(() => shuffle(activity.items));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string[]>>({});
  const [nudgedBasketId, setNudgedBasketId] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const { cardSize } = useGridSize(activity.items.length);
  const basketWidth = useMemo(() => {
    const gaps = space.sm * (activity.baskets.length - 1);
    return Math.floor((width - space.lg * 2 - gaps) / activity.baskets.length);
  }, [width, activity.baskets.length]);

  const selectItem = useCallback(
    (itemId: string, label: string) => {
      setSelectedId(itemId);
      speakLabel(label);
    },
    [],
  );

  const tapBasket = useCallback(
    (basketId: string) => {
      const item = remaining.find((candidate) => candidate.id === selectedId);

      if (!item) {
        // Nothing picked up yet — say how this works rather than doing nothing.
        speak(promptText(activity.hint) || promptText(activity.prompt));
        return;
      }

      if (item.basketId === basketId) {
        celebrateCorrect(null);
        setSelectedId(null);
        setPlaced((prev) => ({ ...prev, [basketId]: [...(prev[basketId] ?? []), item.id] }));

        const left = remaining.filter((candidate) => candidate.id !== item.id);
        setRemaining(left);

        if (left.length === 0 && !finished.current) {
          finished.current = true;
          onFinished({ correct: true, attempts: attempts.current });
        }
        return;
      }

      attempts.current += 1;
      setNudgedBasketId(basketId);
      setTimeout(() => setNudgedBasketId(null), 500);
      nudgeRetry(t(item.label));
    },
    [remaining, selectedId, activity.hint, activity.prompt, onFinished],
  );

  return (
    <View style={styles.container}>
      <View style={styles.tray}>
        {remaining.map((item) => (
          <PictureCard
            key={item.id}
            emoji={item.emoji}
            label={t(item.label)}
            cardSize={cardSize}
            state={selectedId === item.id ? 'selected' : 'idle'}
            onPress={() => selectItem(item.id, t(item.label))}
          />
        ))}
        {remaining.length === 0 && (
          <Text style={styles.emptyTray} accessibilityLabel="All sorted">
            🎉
          </Text>
        )}
      </View>

      <View style={styles.baskets}>
        {activity.baskets.map((basket) => {
          const contents = placed[basket.id] ?? [];
          const isNudged = nudgedBasketId === basket.id;

          return (
            <Pressable
              key={basket.id}
              onPress={() => tapBasket(basket.id)}
              accessibilityRole="button"
              accessibilityLabel={t(basket.label)}
              style={({ pressed }) => [
                styles.basket,
                shadow.card,
                {
                  width: basketWidth,
                  borderColor: isNudged ? colours.nudge : basket.colour,
                  backgroundColor: isNudged ? '#FFF3E0' : colours.surface,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.basketEmoji}>{basket.emoji}</Text>
              <Text style={styles.basketLabel} numberOfLines={2}>
                {t(basket.label)}
              </Text>
              <View style={styles.basketContents}>
                {contents.map((itemId) => {
                  const item = activity.items.find((candidate) => candidate.id === itemId);
                  return (
                    <Text key={itemId} style={styles.placedEmoji}>
                      {item?.emoji}
                    </Text>
                  );
                })}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg },
  tray: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    justifyContent: 'center',
    minHeight: size.tile,
  },
  emptyTray: { fontSize: type.emojiXl },
  baskets: { flexDirection: 'row', gap: space.sm, justifyContent: 'center' },
  basket: {
    minHeight: 120,
    borderRadius: size.radiusLg,
    borderWidth: 4,
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    gap: space.xs,
  },
  basketEmoji: { fontSize: type.emojiMd },
  basketLabel: {
    fontSize: type.caption,
    fontWeight: '800',
    color: colours.ink,
    textAlign: 'center',
  },
  basketContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    marginTop: space.xs,
  },
  placedEmoji: { fontSize: 20 },
});
