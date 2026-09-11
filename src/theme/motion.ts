/**
 * Reduced-motion is an accessibility setting (PRD §12). Kept as module state,
 * like narration, so leaf components can respect it without wiring context
 * through every animation.
 */
let reducedMotion = false;

export function setReducedMotion(next: boolean): void {
  reducedMotion = next;
}

export function isReducedMotion(): boolean {
  return reducedMotion;
}

/** Scales a duration to 0 when the child has asked for less movement. */
export function motionDuration(ms: number): number {
  return reducedMotion ? 0 : ms;
}
