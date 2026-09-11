import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { celebrateCorrect, nudgeRetry } from '@/audio/feedback';
import { PictureCard } from '@/components/ui/PictureCard';
import { t } from '@/i18n';
import { space } from '@/theme/tokens';
import type { SelectActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `select` — tap the correct pictures (PRD §7; assessment Q1 and Q3).
 *
 * Correct taps latch and stay lit. A wrong tap wobbles, says the label back and
 * bounces free again, so the board is never in a losing state.
 */
export function SelectItems({ activity, onFinished }: ActivityViewProps<SelectActivity>) {
  const [items] = useState(() => shuffle(activity.items));
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [nudgedId, setNudgedId] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const { cardSize } = useGridSize(items.length, { maxColumns: 3 });
  const targetCount =
    activity.selectMode === 'one' ? 1 : items.filter((item) => item.correct).length;

  const tapItem = useCallback(
    (itemId: string) => {
      const item = items.find((candidate) => candidate.id === itemId);
      if (!item || foundIds.includes(itemId)) return;

      if (!item.correct) {
        attempts.current += 1;
        setNudgedId(itemId);
        setTimeout(() => setNudgedId(null), 500);
        nudgeRetry(t(item.label));
        return;
      }

      celebrateCorrect(t(item.label));
      const nextFound = [...foundIds, itemId];
      setFoundIds(nextFound);

      if (nextFound.length >= targetCount && !finished.current) {
        finished.current = true;
        onFinished({ correct: true, attempts: attempts.current });
      }
    },
    [items, foundIds, targetCount, onFinished],
  );

  return (
    <View style={styles.grid}>
      {items.map((item) => {
        const found = foundIds.includes(item.id);
        return (
          <PictureCard
            key={item.id}
            emoji={item.emoji}
            label={t(item.label)}
            cardSize={cardSize}
            emojiSize={40}
            state={found ? 'correct' : nudgedId === item.id ? 'nudge' : 'idle'}
            disabled={found}
            onPress={() => tapItem(item.id)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    justifyContent: 'center',
  },
});
