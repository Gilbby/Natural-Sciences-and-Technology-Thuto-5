import type { Activity } from '@/types';

/**
 * The contract every interaction component honours (PRD §7).
 *
 * Components are self-narrating, forgiving and themeable; the lesson player
 * owns the prompt, the progress dots and the advance, so an activity only has
 * to report when the child has finished it.
 */
export interface ActivityViewProps<A extends Activity = Activity> {
  activity: A;
  /**
   * Called exactly once when the child completes the activity.
   * `correct` records that it was completed (nobody fails — PRD §4.4);
   * `attempts` is the total number of tries, which is the signal the later
   * CAPS rubric mapping actually needs (PRD §6.9).
   */
  onFinished: (result: { correct: boolean; attempts: number }) => void;
  /**
   * Lets an activity take over the "Hear it again" button when it has its own
   * per-round narration. Pass `null` to hand it back.
   */
  onRegisterReplay?: (replay: (() => void) | null) => void;
  /**
   * Lets an activity hand its *opening* utterance — the word to spell, the
   * first question, the first reading — to the player, which says it once the
   * screen's prompt has finished.
   *
   * An activity must not speak on mount: effects run child-first, so that
   * utterance is queued a tick before the prompt, and the prompt interrupts
   * it. The child hears "Listen to the word and spell it" and then silence.
   * Pass `null` to hand it back.
   */
  onRegisterIntro?: (intro: (() => void) | null) => void;
}
