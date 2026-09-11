import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { celebrateFinish, speakLabel } from '@/audio/feedback';
import { speakSequence } from '@/audio/speech';
import { BigButton } from '@/components/ui/BigButton';
import { PictureCard } from '@/components/ui/PictureCard';
import { promptText, t, ui } from '@/i18n';
import { colours, size, space, type } from '@/theme/tokens';
import type { ExploreCardsActivity } from '@/types';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `explore-cards` — tap a picture to hear a fact about it (PRD §7).
 *
 * This is the ATP's "find-out" inquiry work, and it is the one activity with no
 * right answer at all: the child roams, listens, and finishes when they have
 * heard every card. Cards they have already heard stay marked so a seven-year-
 * old can see what is left without counting.
 */
export function ExploreCards({
  activity,
  onFinished,
  onRegisterReplay,
}: ActivityViewProps<ExploreCardsActivity>) {
  const [heardIds, setHeardIds] = useState<string[]>([]);
  const [lastFact, setLastFact] = useState<string | null>(null);
  const finished = useRef(false);
  const celebrated = useRef(false);

  const { cardSize } = useGridSize(activity.cards.length, { maxColumns: 3 });
  const allHeard = heardIds.length === activity.cards.length;

  // The replay button should repeat the fact the child is looking at, not the
  // prompt they heard several taps ago.
  useEffect(() => {
    if (!onRegisterReplay) return;
    onRegisterReplay(() => speakSequence([lastFact ?? promptText(activity.prompt)]));
    return () => onRegisterReplay(null);
  }, [onRegisterReplay, lastFact, activity.prompt]);

  const tapCard = useCallback(
    (cardId: string) => {
      const card = activity.cards.find((candidate) => candidate.id === cardId);
      if (!card) return;

      const fact = promptText(card.fact);
      setLastFact(fact);
      speakSequence([t(card.label), fact]);

      setHeardIds((prev) => {
        if (prev.includes(cardId)) return prev;
        const next = [...prev, cardId];
        if (next.length === activity.cards.length && !celebrated.current) {
          celebrated.current = true;
          // Cheer after the fact has had its turn, not over the top of it.
          setTimeout(() => celebrateFinish('You found out about all of them!'), 400);
        }
        return next;
      });
    },
    [activity.cards],
  );

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinished({ correct: true, attempts: 1 });
  }, [onFinished]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {activity.cards.map((card) => (
          <PictureCard
            key={card.id}
            emoji={card.emoji}
            label={t(card.label)}
            cardSize={cardSize}
            state={heardIds.includes(card.id) ? 'correct' : 'idle'}
            onPress={() => tapCard(card.id)}
          />
        ))}
      </View>

      {lastFact && (
        <View style={styles.factCard}>
          <Text style={styles.factEmoji}>💡</Text>
          <Text style={styles.factText}>{lastFact}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.counter}>
          {'⭐'.repeat(heardIds.length)}
          {'·'.repeat(Math.max(0, activity.cards.length - heardIds.length))}
        </Text>
        <BigButton
          emoji={allHeard ? '🎉' : '✅'}
          label={t(ui.done)}
          tone={allHeard ? 'happy' : 'soft'}
          onPress={allHeard ? done : () => speakLabel('Tap every picture to hear about it.')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    backgroundColor: colours.surfaceAlt,
    borderRadius: size.radius,
    borderWidth: 3,
    borderColor: colours.primary,
    padding: space.lg,
  },
  factEmoji: { fontSize: type.emojiSm },
  factText: { flex: 1, fontSize: type.body, fontWeight: '700', color: colours.ink, lineHeight: 23 },
  footer: { alignItems: 'center', gap: space.md },
  counter: { fontSize: 20, letterSpacing: 3, color: colours.inkSoft },
});
