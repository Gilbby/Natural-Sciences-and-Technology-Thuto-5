import * as Haptics from 'expo-haptics';

import { carePraisePhrases, encouragePhrases, praisePhrases, randomFrom } from '@/i18n';

import { speak, speakSequence } from './speech';

/**
 * Feedback moments (PRD §6.5). Correct answers always celebrate; wrong answers
 * always encourage. There is no red X and no score to lose (PRD §4.4).
 */

/**
 * **Care mode — PRD §4.15, §8.3.** Kept as module state, exactly as reduced
 * motion is, so that a leaf component never has to know which topic it is in.
 *
 * Inside a `careful` topic the praise is quieter: a child who has just tapped
 * *"the person doing it"* in a question about whose fault abuse is has not done
 * something clever, and *"Got it."* is the wrong sound to make at her. **The
 * app acknowledges and moves on.**
 *
 * The lesson player sets it from `Topic.careful` on entry and clears it on the
 * way out.
 */
let careMode = false;

export function setCareMode(next: boolean): void {
  careMode = next;
}

function buzz(style: Haptics.ImpactFeedbackStyle) {
  // No-ops on devices and platforms without a haptic engine.
  Haptics.impactAsync(style).catch(() => {});
}

export function celebrateCorrect(alsoSay?: string | null): void {
  buzz(Haptics.ImpactFeedbackStyle.Light);
  speakSequence([randomFrom(careMode ? carePraisePhrases : praisePhrases), alsoSay]);
}

export function nudgeRetry(hint?: string | null): void {
  buzz(Haptics.ImpactFeedbackStyle.Soft);
  speakSequence([randomFrom(encouragePhrases), hint]);
}

export function celebrateFinish(message: string): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  speak(message);
}

/** Every tappable thing says its own label (PRD §4.1). */
export function speakLabel(label: string): void {
  buzz(Haptics.ImpactFeedbackStyle.Light);
  speak(label);
}
