import { termColours } from '@/theme/tokens';
import type { LocalisedText, TermNumber } from '@/types';

/**
 * The Grade 5 school year — PRD §5.5.
 *
 * Terms are defined as *week offsets from the start of the school year* rather
 * than fixed calendar dates. That keeps one description working for both cases
 * the PRD asks for: a real SA year anchored to January, and the v1 simulation
 * that lays the year out from the day a child first opens the app. Only this
 * file changes when a school sets its own dates.
 *
 * ── The windows are 11 / 12 / 10 / 10, and they were counted ───────────────
 *
 * **[changed] Not the 10 / 12 / 11 / 10 the Life Skills lineage carries.** PRD
 * §5.5 is explicit about this and about why: *"Do not inherit the term windows
 * from the Life Skills lineage. Read the ATP's own header row, count the
 * columns, and set the windows from that."*
 *
 * So they were counted, off `2026_ATP_Mathematics_Grade 5.pdf`:
 *
 * | Term | Printed week columns | Window |
 * | ---: | -------------------: | -----: |
 * |    1 | WEEK 1 … WEEK 11     | **11** |
 * |    2 | WEEK 1 … WEEK 12     | **12** |
 * |    3 | WEEK 1 … WEEK 10     | **10** |
 * |    4 | WEEK 1 … WEEK 10     | **10** |
 *
 * **Term 2 is the twelve-week one**, which is the opposite of the Life Skills
 * document, and a fork that inherited that app's windows would have run Term 3
 * one week long and had nowhere to put the Term 2 test.
 *
 * ── The one contradiction, resolved here and named in the README ───────────
 *
 * PRD §16.6 finding 2: *"When two parts of this document disagree, resolve it
 * in writing and in the code. A contradiction silently resolved is a
 * contradiction the next fork inherits."*
 *
 * **The ATP's Term 4 prints ten week columns; the real South African term 4 is
 * about nine teaching weeks and closes in the second week of December.** They
 * cannot both be honoured. **Resolved in favour of the ATP's printed ten**,
 * because §5.5 says to read the windows off the ATP's own grid and because the
 * alternative is to drop a week the document accounts twenty-one hours to.
 *
 * **It costs the child nothing.** Those twenty-one hours are the ATP's revision
 * and end-of-year test, and the app puts nothing in them (PRD §1.1). The last
 * thing this app actually schedules is the **Term 4 Star Challenge in week 7**,
 * which lands in the last week of November — inside the real school year with
 * a fortnight to spare. The window is a container, and its final three weeks
 * are deliberately empty.
 *
 * ── Four assessment blocks, and the app is in none of them ─────────────────
 *
 * | Term | What the ATP prints | What the app puts there |
 * | ---: | ------------------- | ----------------------- |
 * |    1 | wk 7 assignment · wk 10 revision · wk 11 test | Star Challenge in **week 10** |
 * |    2 | wk 1 investigation · wk 11–12 revision and test | Star Challenge in **week 11** |
 * |    3 | the project (spanning) · wk 9–10 revision and test | Star Challenge in **week 9** |
 * |    4 | wk 7–10 revision and test (21 h) | Star Challenge in **week 7** |
 *
 * > **Term 1 week 7 is an assignment in the middle of the term, and the app
 * > leaves it alone** (PRD §5.5). *Adding And Taking Away* runs weeks 4–6 and
 * > *Times* runs weeks 8–9, straight through it. An app that put a celebration
 * > in week 7 would be celebrating in the middle of the one topic in this year
 * > a child most needs to stay inside.
 *
 * **`atpDays` is not printed in this ATP.** The field is kept and filled from
 * the South African school calendar, and it is labelled as such below — a
 * number nobody can trace is worse than a number labelled as an estimate.
 */

export interface TermPlan {
  term: TermNumber;
  title: LocalisedText;
  /** The term's theme, spoken to the child. */
  subtitle: LocalisedText;
  emoji: string;
  colour: string;
  /** Weeks after the start of the school year that this term's week 1 begins. */
  weekOffset: number;
  /** Weeks in the term — **the ATP's own printed week columns** (PRD §5.5). */
  weeks: number;
  /**
   * Teaching days in the term.
   *
   * **These are South African school-calendar figures, not the ATP's own** —
   * this ATP prints no day count on any page (PRD §5.5, §18.1 finding 3).
   */
  atpDays: number;
}

/**
 * Default anchor: the Monday on or after 14 January. SA public schools open in
 * the second or third week of January; a school that differs edits this.
 *
 * In 2026 that Monday is **19 January**.
 */
export const SCHOOL_YEAR_START = { month: 0, day: 14 } as const;

/**
 * The app calendar is a complete 52-week learning year. Each quarter has a
 * 13-week window so lessons and review space fill all twelve months.
 */
export const TERM_PLANS: TermPlan[] = [
  {
    term: 1,
    title: { en: 'Term 1' },
    // The five topics are all number: counting it, writing it, adding it,
    // taking it away, timesing it (PRD §8.1).
    subtitle: { en: 'Life and living' },
    emoji: '🌿',
    colour: termColours[1],
    weekOffset: 0,
    // Eleven printed columns: nine topic weeks, the week 7 assignment, and the
    // week 11 test.
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 2,
    title: { en: 'Term 2' },
    // Division, fractions, two blocks of pattern, and the flat shapes.
    subtitle: { en: 'Matter and materials' },
    emoji: '⚙️',
    colour: termColours[2],
    weekOffset: 13,
    // **Twelve, and it is the long term in this document.** Week 1 is the
    // investigation and weeks 11–12 are revision and the test.
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 3,
    title: { en: 'Term 3' },
    // Solids, the data cycle, probability, and the first of the measurement.
    subtitle: { en: 'Energy and change' },
    emoji: '🔌',
    colour: termColours[3],
    weekOffset: 26,
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 4,
    title: { en: 'Term 4' },
    // Time, capacity, mass, and the shapes that move.
    subtitle: { en: 'Planet Earth and beyond' },
    emoji: '🌍',
    colour: termColours[4],
    weekOffset: 39,
    // Ten printed columns; the last four are the ATP's revision and its
    // end-of-year test, and the app puts nothing in them. See the header.
    weeks: 13,
    atpDays: 65,
  },
];

export function termPlan(term: TermNumber): TermPlan {
  const plan = TERM_PLANS.find((entry) => entry.term === term);
  if (!plan) throw new Error(`No plan for term ${term}`);
  return plan;
}

/** Weeks from the first Monday of term 1 to the last Friday of term 4. */
export const SCHOOL_YEAR_WEEKS = Math.max(
  ...TERM_PLANS.map((plan) => plan.weekOffset + plan.weeks),
);
