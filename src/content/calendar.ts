import { termColours } from '@/theme/tokens';
import type { LocalisedText, TermNumber } from '@/types';

/**
 * The Grade 6 English First Additional Language school year — PRD §5.5.
 *
 * Terms are defined as *week offsets from the start of the school year* rather
 * than fixed calendar dates. That keeps one description working for both cases
 * the PRD asks for: a real SA year anchored to January, and the v1 simulation
 * that lays the year out from the day a child first opens the app. Only this
 * file changes when a school sets its own dates.
 *
 * ── The windows are four 13-week slices of a 52-week year ──────────────────
 *
 * The app calendar uses **four 13-week windows inside a 52-week year** (PRD
 * §5.5). The windows begin at week offsets **0 / 13 / 26 / 39**, so each term
 * gets the same room and the Star Challenge lands in **week 13** of every
 * quarter — the last lesson of an even, complete block.
 *
 * This is an **app-calendar decision, not a claim that the ATP has thirteen
 * printed teaching weeks per strand**. The FAL ATP schedules its assessments
 * inside the term's weeks rather than by fixed columns, and the app's four
 * equal windows keep one rhythm running all year. The term colours ride the
 * Thuto family's fifth-grade set: **amber / teal / clay / purple** (PRD line
 * 515).
 *
 * ── Four assessment blocks, and the app is in none of them ─────────────────
 *
 * | Term | What the ATP prints | What the app puts there |
 * | ---: | ------------------- | ----------------------- |
 * |    1 | FAT 2 essay (wk 5–6) · FAT 3 response to texts (wk 7–8) · FAT 1 oral read-aloud (wk 9–10) | Star Challenge in **week 13** |
 * |    2 | FAT 2 longer transactional (wk 6–7) · FAT 3 response to texts (wk 8–9) · FAT 1 oral read-aloud (wk 10–11) | Star Challenge in **week 13** |
 * |    3 | FAT 2 essay (wk 9–10) · FAT 3 response to texts (wk 11–12) · FAT 1 oral read-aloud (wk 5–6) | Star Challenge in **week 13** |
 * |    4 | FAT 2 longer transactional (wk 7–8) · FAT 3 response to texts (wk 9–10) · FAT 1 oral read-aloud (wk 2–3) · end-of-year test | Star Challenge in **week 13** |
 *
 * > **The app schedules the child's own reading, writing and speaking practice;
 * > it never schedules the ATP's formal assessments** (PRD §1.1, §5.5). Those
 * > blocks belong to the school. The app's Star Challenges are a motivational
 * > beat at the end of each even window — a celebration of a finished stretch
 * > of learning, not an exam.
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
    // Reports, news and balanced argument: reading and writing what happened,
    // what people believe, and what makes a fair point (ATP §2.1).
    subtitle: { en: 'Reports, news and argument' },
    emoji: '📰',
    colour: termColours[1],
    weekOffset: 0,
    // Baseline check-in in week 1, then reports and news, a novel or reader,
    // persuasion and radio adverts, a short story, and a play.
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 2,
    title: { en: 'Term 2' },
    // Instructions and directions: the steps that make a recipe or a route
    // followable, and how the words of a text shape what it asks of us (ATP §2.1).
    subtitle: { en: 'Instructions and directions' },
    emoji: '🧭',
    colour: termColours[2],
    weekOffset: 13,
    // A novel or reader with daily reading, instructions we follow, how we
    // speak in a register, and the term's assessments in weeks 10–11.
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 3,
    title: { en: 'Term 3' },
    // Folklore: the myths, legends and fables a people tell, the characters
    // they remember, and what a novelette carries between its covers (ATP §2.1).
    subtitle: { en: 'Folklore and the novel' },
    emoji: '📖',
    colour: termColours[3],
    weekOffset: 26,
    // A myth, legend or fable and a character sketch, then a novelette with its
    // message, plot and conflict, and half an hour of daily reading.
    weeks: 13,
    atpDays: 65,
  },
  {
    term: 4,
    title: { en: 'Term 4' },
    // Folklore carried on, the interview and the oral presentation, and the
    // habit of saying in a few words what a story meant to us (ATP §2.1).
    subtitle: { en: 'Folklore, interviews and summary' },
    emoji: '🗣️',
    colour: termColours[4],
    weekOffset: 39,
    // A legend and a myth retold, an interview and an oral presentation, and
    // writing a summary of five to ten sentences.
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
