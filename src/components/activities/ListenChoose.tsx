import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { celebrateCorrect, nudgeRetry } from '@/audio/feedback';
import { speak, speakSequence } from '@/audio/speech';
import { PictureCard } from '@/components/ui/PictureCard';
import { ProgressDots } from '@/components/ui/ProgressDots';
import { promptText, t } from '@/i18n';
import { space } from '@/theme/tokens';
import type { ListenChooseActivity } from '@/types';
import { shuffle } from '@/utils/shuffle';

import { useGridSize } from './useGridSize';
import type { ActivityViewProps } from './types';

/**
 * `listen-choose` — hear a question, tap the matching picture (PRD §7).
 *
 * Each round has its own narration, so this activity takes over the
 * "Hear it again" button while it is on screen.
 *
 * ── The open mode — PRD §7.2, §6.5f. **The one component edit of this fork.**
 *
 * A round with `open: true` has no `answerId`, and the difference on screen is
 * three things and no more:
 *
 *   1. **the first tap is accepted**, whichever option it lands on;
 *   2. the option's `why` is spoken — *what that answer commits you to*, never
 *      praise and never agreement — and **the praise bank is not used at all**,
 *      because there is nothing to praise;
 *   3. the card is marked `selected`, a filled outline rather than a tick.
 *
 * **There is no second attempt because there is nothing to attempt**, and
 * nothing is stored about which option was tapped (PRD §8.3). The app's job was
 * to ask.
 */
export function ListenChoose({
  activity,
  onFinished,
  onRegisterReplay,
  onRegisterIntro,
}: ActivityViewProps<ListenChooseActivity>) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [nudgedId, setNudgedId] = useState<string | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const attempts = useRef(1);
  const finished = useRef(false);

  const round = activity.rounds[roundIndex];
  const [options, setOptions] = useState(() => shuffle(activity.rounds[0]?.options ?? []));
  const { cardSize } = useGridSize(options.length, { maxColumns: 3 });

  useEffect(() => {
    if (!round) return;
    setOptions(shuffle(round.options));
    // The first question goes to the player: the screen's prompt speaks after
    // this effect and would cut it off. Later rounds are the only thing
    // speaking by then, so they say themselves.
    if (roundIndex === 0 && onRegisterIntro) return;
    speak(promptText(round.question));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (!onRegisterIntro) return;
    onRegisterIntro(() => speak(promptText(activity.rounds[0]?.question)));
    return () => onRegisterIntro(null);
  }, [onRegisterIntro, activity.rounds]);

  useEffect(() => {
    if (!onRegisterReplay) return;
    onRegisterReplay(() => speak(promptText(activity.rounds[roundIndex]?.question)));
    return () => onRegisterReplay(null);
  }, [onRegisterReplay, activity.rounds, roundIndex]);

  const tapOption = useCallback(
    (optionId: string, label: string) => {
      if (!round) return;

      /*
       * The open question — PRD §6.5f. Every option is accepted, the `why` is
       * spoken after the child's own words, and the activity is over.
       *
       * `speakSequence` rather than `celebrateCorrect` is the whole of the
       * difference: `celebrateCorrect` opens with a praise phrase, and a praise
       * phrase here would tell a child that one opinion was the right one.
       */
      if (round.open) {
        if (finished.current) return;
        finished.current = true;
        setChosenId(optionId);
        const chosen = round.options.find((option) => option.id === optionId);
        speakSequence([label, chosen?.why ? t(chosen.why) : null]);
        onFinished({ correct: true, attempts: 1 });
        return;
      }

      if (optionId !== round.answerId) {
        attempts.current += 1;
        setNudgedId(optionId);
        setTimeout(() => setNudgedId(null), 500);
        nudgeRetry(promptText(activity.hint) || promptText(round.question));
        return;
      }

      celebrateCorrect(label);
      if (roundIndex + 1 < activity.rounds.length) {
        setRoundIndex(roundIndex + 1);
        return;
      }
      if (!finished.current) {
        finished.current = true;
        onFinished({ correct: true, attempts: attempts.current });
      }
    },
    [round, roundIndex, activity.rounds, activity.hint, onFinished],
  );

  if (!round) return null;

  return (
    <View style={styles.container}>
      {activity.rounds.length > 1 && (
        <View style={styles.dots}>
          <ProgressDots total={activity.rounds.length} current={roundIndex} />
        </View>
      )}
      <Text style={styles.question}>{promptText(round.question)}</Text>
      {round.open && (
        <Text style={styles.openNote}>
          There is no right answer here. Pick the one you think.
        </Text>
      )}
      <View style={styles.grid}>
        {options.map((option) => (
          <PictureCard
            key={option.id}
            emoji={option.emoji}
            label={t(option.label)}
            cardSize={cardSize}
            state={
              chosenId === option.id
                ? 'selected'
                : nudgedId === option.id
                  ? 'nudge'
                  : 'idle'
            }
            onPress={() => tapOption(option.id, t(option.label))}
          />
        ))}
      </View>
      {round.open && chosenId && (
        <Text style={styles.why}>
          {t(round.options.find((option) => option.id === chosenId)?.why)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.lg },
  dots: { alignItems: 'center' },
  question: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#6B6478' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'center' },
  /*
   * Said as well as shown, like every other piece of chrome. A child who cannot
   * read it still hears the prompt, and the prompt of an open question always
   * says the same thing in the author's own words.
   */
  openNote: { textAlign: 'center', fontSize: 15, color: '#8A8298' },
  why: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 26,
    color: '#4C4459',
    paddingHorizontal: space.md,
  },
});
