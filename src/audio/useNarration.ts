import { useCallback, useEffect, useRef } from 'react';

import { speak, stopSpeaking } from './speech';

/**
 * Speaks a prompt when a screen or activity appears, and hands back a `replay`
 * for the always-available "Hear it again" control (PRD §6.2, §6.3).
 */
export function useNarration(text: string | null | undefined, options?: { autoPlay?: boolean }) {
  const autoPlay = options?.autoPlay ?? true;
  const latest = useRef(text);
  latest.current = text;

  useEffect(() => {
    if (autoPlay && text) speak(text);
    // Intentionally keyed on the text itself: a new prompt is a new utterance.
  }, [text, autoPlay]);

  useEffect(() => stopSpeaking, []);

  const replay = useCallback(() => {
    speak(latest.current);
  }, []);

  return { replay };
}
