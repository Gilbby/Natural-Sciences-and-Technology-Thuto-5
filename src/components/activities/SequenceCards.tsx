import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { celebrateCorrect, nudgeRetry } from '@/audio/feedback';
import { PictureCard } from '@/components/ui/PictureCard';
import { promptText, t } from '@/i18n';
import { colours, size, space, type } from '@/theme/tokens';
import type { SequenceActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import type { ActivityViewProps } from './types';

/**
 * `sequence` — tap the cards in the right order (PRD §7; booklet A2).
 *
 * The finished strip builds up along the top so the child can see the story so
 * far. Only the *next* card counts; anything else is a gentle "not yet".
 */
export function SequenceCards({ activity, onFinished }: ActivityViewProps<SequenceActivity>) {
  const { width } = useWindowDimensions();
  const ordered = useMemo(
    () => [...activity.items].sort((a, b) => a.order - b.order),
    [activity.items],
  );
  const [pool, setPool] = useState(() => shuffle(activity.items));
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [nudgedId, setNudgedId] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const columns = Math.min(4, ordered.length);
  const slotSize = Math.max(
    56,
    Math.floor((width - space.lg * 2 - space.sm * (columns - 1)) / columns),
  );
  const cardSize = Math.max(size.touchMin, Math.min(96, slotSize));

  const tapCard = useCallback(
    (itemId: string) => {
      const expected = ordered[placedIds.length];
      const item = pool.find((candidate) => candidate.id === itemId);
      if (!item || !expected) return;

      if (item.id !== expected.id) {
        attempts.current += 1;
        setNudgedId(itemId);
        setTimeout(() => setNudgedId(null), 500);
        nudgeRetry(promptText(activity.hint) || t(expected.label));
        return;
      }

      celebrateCorrect(t(item.label));
      const nextPlaced = [...placedIds, item.id];
      setPlacedIds(nextPlaced);
      setPool((prev) => prev.filter((candidate) => candidate.id !== item.id));

      if (nextPlaced.length === ordered.length && !finished.current) {
        finished.current = true;
        onFinished({ correct: true, attempts: attempts.current });
      }
    },
    [ordered, placedIds, pool, activity.hint, onFinished],
  );

  return (
    <View style={styles.container}>
      <View style={styles.strip}>
        {ordered.map((slot, index) => {
          const placedId = placedIds[index];
          const placed = placedId
            ? activity.items.find((candidate) => candidate.id === placedId)
            : null;

          return (
            <View
              key={slot.id}
              style={[
                styles.slot,
                {
                  width: cardSize,
                  height: cardSize,
                  borderColor: placed ? colours.green : colours.starEmpty,
                  backgroundColor: placed ? '#E9F8EC' : colours.surfaceAlt,
                },
              ]}
              accessibilityLabel={placed ? t(placed.label) : `Step ${index + 1}, empty`}
            >
              <Text style={styles.slotNumber}>{index + 1}</Text>
              <Text style={styles.slotEmoji}>{placed ? placed.emoji : ''}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.pool}>
        {pool.map((item) => (
          <PictureCard
            key={item.id}
            emoji={item.emoji}
            label={t(item.label)}
            cardSize={cardSize}
            state={nudgedId === item.id ? 'nudge' : 'idle'}
            onPress={() => tapCard(item.id)}
          />
        ))}
        {pool.length === 0 && <Text style={styles.done}>🎉</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.xl },
  strip: { flexDirection: 'row', gap: space.sm, justifyContent: 'center' },
  slot: {
    borderRadius: size.radius,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotNumber: {
    position: 'absolute',
    top: 4,
    left: 8,
    fontSize: type.caption,
    fontWeight: '900',
    color: colours.inkSoft,
  },
  slotEmoji: { fontSize: type.emojiMd },
  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    justifyContent: 'center',
    minHeight: size.tile,
  },
  done: { fontSize: type.emojiXl },
});
