import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { speak } from '@/audio/speech';
import { PictureCard } from '@/components/ui/PictureCard';
import { promptText, t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { AssignSlotActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `assign-slot` — put one item into each labelled slot (PRD §7).
 *
 * Season → clothes, day part → activity. Where `sort-baskets` empties a tray
 * into a couple of bins, this fills a named set, so what the child ends up
 * looking at is a completed picture of the whole idea.
 */
export function AssignSlot({ activity, onFinished }: ActivityViewProps<AssignSlotActivity>) {
  const { width } = useWindowDimensions();
  const [remaining, setRemaining] = useState(() => shuffle(activity.items));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, string[]>>({});
  const [nudgedSlotId, setNudgedSlotId] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const { cardSize } = useGridSize(activity.items.length, { maxColumns: 4 });

  const columns = Math.min(activity.slots.length, activity.slots.length <= 2 ? 2 : 4);
  const slotWidth = useMemo(() => {
    const gaps = space.sm * (columns - 1);
    return Math.max(size.touchMin, Math.floor((width - space.lg * 2 - gaps) / columns));
  }, [width, columns]);

  const pickItem = useCallback((itemId: string, label: string) => {
    setSelectedId(itemId);
    speakLabel(label);
  }, []);

  const tapSlot = useCallback(
    (slotId: string, slotLabel: string) => {
      const item = remaining.find((candidate) => candidate.id === selectedId);

      if (!item) {
        // Nothing picked up yet — read the slot back and explain the move.
        speak(`${slotLabel}. ${promptText(activity.hint) || promptText(activity.prompt)}`);
        return;
      }

      if (item.slotId !== slotId) {
        attempts.current += 1;
        setNudgedSlotId(slotId);
        setTimeout(() => setNudgedSlotId(null), 500);
        nudgeRetry(t(item.label));
        return;
      }

      celebrateCorrect(`${t(item.label)}. ${slotLabel}.`);
      setSelectedId(null);
      setFilled((prev) => ({ ...prev, [slotId]: [...(prev[slotId] ?? []), item.id] }));

      const left = remaining.filter((candidate) => candidate.id !== item.id);
      setRemaining(left);

      if (left.length === 0 && !finished.current) {
        finished.current = true;
        onFinished({ correct: true, attempts: attempts.current });
      }
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
            onPress={() => pickItem(item.id, t(item.label))}
          />
        ))}
        {remaining.length === 0 && (
          <Text style={styles.emptyTray} accessibilityLabel="All placed">
            🎉
          </Text>
        )}
      </View>

      <View style={styles.slots}>
        {activity.slots.map((slot) => {
          const contents = filled[slot.id] ?? [];
          const isNudged = nudgedSlotId === slot.id;
          const label = t(slot.label);

          return (
            <Pressable
              key={slot.id}
              onPress={() => tapSlot(slot.id, label)}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.slot,
                shadow.card,
                {
                  width: slotWidth,
                  borderColor: isNudged ? colours.nudge : slot.colour,
                  backgroundColor: isNudged ? '#FFF3E0' : colours.surface,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text style={styles.slotEmoji}>{slot.emoji}</Text>
              <Text style={styles.slotLabel} numberOfLines={2}>
                {label}
              </Text>
              <View style={styles.slotContents}>
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
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  slot: {
    minHeight: 118,
    borderRadius: size.radiusLg,
    borderWidth: 4,
    alignItems: 'center',
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    gap: space.xs,
  },
  slotEmoji: { fontSize: type.emojiMd },
  slotLabel: { fontSize: type.caption, fontWeight: '800', color: colours.ink, textAlign: 'center' },
  slotContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    marginTop: space.xs,
  },
  placedEmoji: { fontSize: 20 },
});
