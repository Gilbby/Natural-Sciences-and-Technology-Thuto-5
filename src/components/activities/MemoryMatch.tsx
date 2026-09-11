import { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, nudgeRetry, speakLabel } from '@/audio/feedback';
import { t } from '@/i18n';
import { colours, shadow, size, space, type } from '@/theme/tokens';
import type { MemoryMatchActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `memory-match` — flip pairs from memory (PRD §6.6, §7).
 *
 * The ATP asks repeatedly for activities that build executive function; this is
 * the working-memory one. There is no timer and no score: a wrong pair simply
 * turns back over, which is the "you can't lose" rule applied to a game that
 * would normally keep score (PRD §4.4).
 */

interface Tile {
  key: string;
  cardId: string;
  emoji: string;
  label: string;
}

/** How long a mismatched pair stays visible before turning back. */
const PEEK_MS = 900;

export function MemoryMatch({ activity, onFinished }: ActivityViewProps<MemoryMatchActivity>) {
  const tiles = useMemo<Tile[]>(
    () =>
      shuffle(
        activity.cards.flatMap((card) => [
          { key: `${card.id}-a`, cardId: card.id, emoji: card.emoji, label: t(card.label) },
          { key: `${card.id}-b`, cardId: card.id, emoji: card.emoji, label: t(card.label) },
        ]),
      ),
    [activity.cards],
  );

  const [faceUp, setFaceUp] = useState<string[]>([]);
  const [matchedCardIds, setMatchedCardIds] = useState<string[]>([]);
  const attempts = useRef(1);
  const busy = useRef(false);
  const finished = useRef(false);

  const { cardSize } = useGridSize(tiles.length, { maxColumns: 4 });

  const flip = useCallback(
    (tile: Tile) => {
      if (busy.current) return;
      if (matchedCardIds.includes(tile.cardId)) return;
      if (faceUp.includes(tile.key)) return;

      speakLabel(tile.label);

      if (faceUp.length === 0) {
        setFaceUp([tile.key]);
        return;
      }

      const first = tiles.find((candidate) => candidate.key === faceUp[0]);
      const next = [faceUp[0], tile.key];
      setFaceUp(next);

      if (first && first.cardId === tile.cardId) {
        const matched = [...matchedCardIds, tile.cardId];
        setMatchedCardIds(matched);
        setFaceUp([]);
        celebrateCorrect(tile.label);

        if (matched.length === activity.cards.length && !finished.current) {
          finished.current = true;
          onFinished({ correct: true, attempts: attempts.current });
        }
        return;
      }

      // Not a pair: hold both up long enough to be remembered, then turn back.
      attempts.current += 1;
      busy.current = true;
      setTimeout(() => {
        setFaceUp([]);
        busy.current = false;
        nudgeRetry(null);
      }, PEEK_MS);
    },
    [faceUp, matchedCardIds, tiles, activity.cards.length, onFinished],
  );

  return (
    <View style={styles.grid}>
      {tiles.map((tile) => {
        const matched = matchedCardIds.includes(tile.cardId);
        const showing = matched || faceUp.includes(tile.key);

        return (
          <Pressable
            key={tile.key}
            onPress={() => flip(tile)}
            accessibilityRole="button"
            accessibilityLabel={showing ? tile.label : 'Face-down card'}
            style={({ pressed }) => [
              styles.tile,
              shadow.card,
              {
                width: cardSize,
                height: cardSize,
                borderColor: matched ? colours.green : showing ? colours.primary : colours.border,
                backgroundColor: matched
                  ? '#E9F8EC'
                  : showing
                    ? colours.surface
                    : colours.surfaceAlt,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Text style={styles.face}>{showing ? tile.emoji : '❓'}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  tile: {
    minWidth: size.touchMin,
    minHeight: size.touchMin,
    borderRadius: size.radius,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: { fontSize: type.emojiMd },
});
