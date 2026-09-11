import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { PictureCard } from '@/components/ui/PictureCard';
import { t } from '@/i18n';
import { size, space } from '@/theme/tokens';
import type { MatchConnectActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import type { ActivityViewProps } from './types';

/**
 * `match-connect` — tap one side, then its partner on the other side (PRD §7).
 *
 * Two columns rather than drawn lines: a connecting line needs a drag, and a
 * drag needs precision this age group does not reliably have yet (PRD §4.3).
 */
export function MatchConnect({ activity, onFinished }: ActivityViewProps<MatchConnectActivity>) {
  const { width } = useWindowDimensions();
  const left = useMemo(() => shuffle(activity.pairs), [activity.pairs]);
  const right = useMemo(() => shuffle(activity.pairs), [activity.pairs]);

  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [nudgedKey, setNudgedKey] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const cardSize = Math.max(
    size.touchMin,
    Math.min(120, Math.floor((width - space.lg * 2 - space.xl) / 2)),
  );

  const tapLeft = useCallback((pairId: string, label: string) => {
    setSelectedPairId(pairId);
    speakLabel(label);
  }, []);

  const tapRight = useCallback(
    (pairId: string, label: string) => {
      if (!selectedPairId) {
        // Nothing picked up yet — say the label rather than doing nothing.
        speakLabel(label);
        return;
      }

      if (selectedPairId !== pairId) {
        attempts.current += 1;
        setNudgedKey(`right-${pairId}`);
        setTimeout(() => setNudgedKey(null), 500);
        nudgeRetry(label);
        return;
      }

      celebrateCorrect(label);
      const nextMatched = [...matchedIds, pairId];
      setMatchedIds(nextMatched);
      setSelectedPairId(null);

      if (nextMatched.length === activity.pairs.length && !finished.current) {
        finished.current = true;
        onFinished({ correct: true, attempts: attempts.current });
      }
    },
    [selectedPairId, matchedIds, activity.pairs.length, onFinished],
  );

  return (
    <View style={styles.columns}>
      <View style={styles.column}>
        {left.map((pair) => {
          const matched = matchedIds.includes(pair.id);
          return (
            <PictureCard
              key={`left-${pair.id}`}
              emoji={pair.left.emoji}
              label={t(pair.left.label)}
              cardSize={cardSize}
              disabled={matched}
              state={matched ? 'correct' : selectedPairId === pair.id ? 'selected' : 'idle'}
              onPress={() => tapLeft(pair.id, t(pair.left.label))}
            />
          );
        })}
      </View>

      <View style={styles.column}>
        {right.map((pair) => {
          const matched = matchedIds.includes(pair.id);
          return (
            <PictureCard
              key={`right-${pair.id}`}
              emoji={pair.right.emoji}
              label={t(pair.right.label)}
              cardSize={cardSize}
              disabled={matched}
              state={matched ? 'correct' : nudgedKey === `right-${pair.id}` ? 'nudge' : 'idle'}
              onPress={() => tapRight(pair.id, t(pair.right.label))}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: { flexDirection: 'row', justifyContent: 'space-between', gap: space.xl },
  column: { gap: space.sm, flex: 1, alignItems: 'center' },
});
