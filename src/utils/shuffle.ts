/**
 * Fisher–Yates. Activities shuffle their items so a lesson replayed tomorrow is
 * not the same tap-pattern as today (PRD §4.8 — repeating is rewarded).
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
