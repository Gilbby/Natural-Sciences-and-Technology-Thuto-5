import * as Speech from 'expo-speech';

import { DEFAULT_SETTINGS } from '@/types';

/**
 * The single narration seam (PRD §9.1).
 *
 * Everything the app says goes through `speak()`. Today that is device TTS via
 * expo-speech; when pre-recorded voice-over ships, only this file changes. For
 * this app that is a v1.1 priority rather than a nice-to-have: a phonics app
 * asking a device to say a bare letter gets the letter *name* back, so every
 * sound the app teaches carries an explicit phonetic `say` string instead
 * (PRD §7.1, §9.1).
 */

/**
 * South African English first, then the nearest neighbours. A budget Android
 * phone often ships without `en-ZA`; leaving TTS to pick for itself lands on
 * `en-US`, whose vowels are the wrong ones to model an SA classroom's English.
 * The list is resolved once against the voices the device actually has.
 */
const LANGUAGE_PREFERENCE = ['en-ZA', 'en-GB', 'en-US'] as const;

let resolvedLanguage: string = LANGUAGE_PREFERENCE[0];

/**
 * Ask the device which of the preferred voices it has. Failure is not a
 * problem: `en-ZA` stays selected and TTS falls back on its own, which is what
 * happened before this existed.
 */
export async function resolveSpeechLanguage(): Promise<string> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const available = new Set(voices.map((voice) => voice.language));
    const match = LANGUAGE_PREFERENCE.find(
      (language) =>
        available.has(language) ||
        [...available].some((entry) => entry.replace('_', '-') === language),
    );
    if (match) resolvedLanguage = match;
  } catch {
    // Keep the default.
  }
  return resolvedLanguage;
}

export function speechLanguage(): string {
  return resolvedLanguage;
}

/**
 * Android occasionally drops an utterance queued in the same tick as a stop().
 * A short beat between the two makes interruption reliable.
 */
const INTERRUPT_DELAY_MS = 80;

export type SpeakOptions = {
  /** Cut off whatever is speaking. Default true. */
  interrupt?: boolean;
  rate?: number;
  pitch?: number;
  onDone?: () => void;
};

let audioEnabled = DEFAULT_SETTINGS.audioEnabled;
let narrationRate = DEFAULT_SETTINGS.narrationRate;
let pendingTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Which utterance is the current one.
 *
 * Every new utterance and every stop bumps this, and an `onDone` only runs if
 * its own utterance is still the current one. Without that, a chained sequence
 * can be brought back from the dead: on web `speechSynthesis.cancel()` fires
 * `onend` on the utterance it just killed, so interrupting line 1 would start
 * line 2 over whatever interrupted it. Android reports a stop separately and
 * never had the problem, and this app runs on both.
 */
let utterance = 0;

export function isAudioEnabled(): boolean {
  return audioEnabled;
}

export function setAudioEnabled(next: boolean): void {
  audioEnabled = next;
  if (!next) stopSpeaking();
}

export function getNarrationRate(): number {
  return narrationRate;
}

/** Narration speed is an accessibility control (PRD §12). */
export function setNarrationRate(next: number): void {
  narrationRate = Math.min(1.4, Math.max(0.5, next));
}

export function stopSpeaking(): void {
  if (pendingTimer !== null) {
    clearTimeout(pendingTimer);
    pendingTimer = null;
  }
  utterance += 1;
  Speech.stop();
}

export function speak(text: string | null | undefined, options: SpeakOptions = {}): void {
  const { interrupt = true, rate, pitch = 1.05, onDone } = options;

  if (!text || !audioEnabled) {
    onDone?.();
    return;
  }

  // Claim the queue before taking a ticket, so the stop below does not
  // immediately make this utterance stale.
  if (interrupt) stopSpeaking();
  const mine = (utterance += 1);

  /** Only the current utterance may advance whatever it was chained to. */
  const finish = () => {
    if (mine === utterance) onDone?.();
  };

  const utter = () => {
    pendingTimer = null;
    Speech.speak(text, {
      language: resolvedLanguage,
      rate: rate ?? narrationRate,
      pitch,
      onDone: finish,
      // Never leave a caller hanging on a chained callback.
      onError: finish,
    });
  };

  if (interrupt) {
    pendingTimer = setTimeout(utter, INTERRUPT_DELAY_MS);
  } else {
    utter();
  }
}

/**
 * Say one thing, then the next. Used for "prompt … then the hint".
 *
 * `onDone` fires when the last line has been said, and deliberately not when
 * something interrupts: a stopped utterance is stale and its callback is
 * dropped. That is what lets a screen hang its activity's opening line off the
 * end of the prompt without talking over a child who has already started.
 */
export function speakSequence(
  lines: Array<string | null | undefined>,
  onDone?: () => void,
): void {
  const queue = lines.filter((line): line is string => Boolean(line));
  if (queue.length === 0) {
    onDone?.();
    return;
  }

  const sayFrom = (index: number) => {
    if (index >= queue.length) {
      onDone?.();
      return;
    }
    speak(queue[index], {
      interrupt: index === 0,
      onDone: () => sayFrom(index + 1),
    });
  };
  sayFrom(0);
}

/**
 * A per-line utterance queue with a highlight callback — PRD §9.1, mitigation 2.
 *
 * Reading a whole text aloud while showing the child *where* the voice is means
 * one utterance per line, each with an `onDone` that advances the highlight. It
 * is coarser than word-level karaoke and it is the only version that works on
 * every Android version this app has to run on: `expo-speech` cannot report
 * word boundaries reliably, and a highlight that drifts out of sync is worse
 * than no highlight at all.
 *
 * **Do not attempt word-boundary events on Android in v1.**
 *
 * Returns a `cancel` so a component can stop the read when the child taps a
 * word, taps stop, or leaves the screen — which is the other half of the
 * cheap-phone audio test (PRD §17 test 4): the queue must never stack up.
 */
export function speakLines(
  lines: string[],
  options: { onLine?: (index: number) => void; onDone?: () => void; rate?: number } = {},
): () => void {
  let cancelled = false;

  const sayFrom = (index: number) => {
    if (cancelled) return;
    if (index >= lines.length) {
      options.onDone?.();
      return;
    }
    options.onLine?.(index);
    speak(lines[index], {
      // Only the first utterance interrupts; the rest follow on, so the queue
      // never fights itself.
      interrupt: index === 0,
      rate: options.rate,
      onDone: () => sayFrom(index + 1),
    });
  };

  sayFrom(0);

  return () => {
    cancelled = true;
    stopSpeaking();
  };
}
