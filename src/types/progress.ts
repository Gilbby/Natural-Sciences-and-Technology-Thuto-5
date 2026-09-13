/**
 * Progress model — PRD §10.
 *
 * Nothing here is shown to the child as a mark or a code. `attempts` and
 * per-activity correctness are captured so the later teacher view can report
 * formative assessment **per study area** (PRD §10) without a migration.
 *
 * **This ATP contains a written task, an assignment, a project, four Physical
 * Education tasks of 30 marks, four Creative Arts practical assessments of 40,
 * two controlled tests and a rubric for every one of them.** None of it reaches
 * this file (PRD §1.1).
 *
 * ── And two things are deliberately absent (PRD §8.4) ──────────────────────
 *
 * **There is no field for which trusted adult a child tapped**, and there is no
 * field for which option she chose in an open question. `whoCanITell` is an
 * `explore-cards` activity in which every card is correct and **the tap is
 * written nowhere** — not to the day record, not to progress, not anywhere. A
 * record of which adult a ten-year-old considered telling would be the most
 * dangerous row in this family's data model, and it does not exist.
 */

import type { LanguageCode } from './content';

/** v1 stores a single local profile; multi-profile lands in v1.1 (PRD §6.2). */
export interface ChildProfile {
  _id: string;
  /** First name only, optional. No other PII, ever. */
  name: string | null;
  avatar: string;
  /** The first grade in this family outside Foundation Phase (PRD §18.1). */
  grade: 5;
  audioLang: LanguageCode;
  createdAt: string;
}

export interface ActivityResult {
  activityId: string;
  correct: boolean;
  attempts: number;
}

export type LessonStatus = 'not-started' | 'in-progress' | 'completed';

export interface LessonProgress {
  _id: string;
  childId: string;
  lessonId: string;
  status: LessonStatus;
  starsEarned: number;
  attempts: number;
  activityResults: ActivityResult[];
  startedAt: string | null;
  completedAt: string | null;
}

export interface EarnedBadge {
  badgeId: string;
  childId: string;
  earnedAt: string;
}

/**
 * One school day's rhythms — PRD §6.6, §10.
 *
 * Three rhythms, and all three are rows this ATP prints in **every block of
 * every term** (PRD §6.6):
 *
 *   `washDone`    *"Basic hygiene principles"* — Wash and Check. The
 *                 most-repeated row in the whole document and the one an app is
 *                 best at.
 *   `movedToday`  the Physical Education row — Move Today. One short movement
 *                 call, with its space and its safety line (PRD §6.5b).
 *   `wordAdded`   *"Reading skills: reading with understanding and using a
 *                 dictionary"* — New Words.
 *
 * `spelledCorrectly` **is gone**, inherited from the Grade 4 app and staying
 * gone: the word wall collects words, it does not test them.
 *
 * `readingMinutes` is kept as the count of minutes the child chose to spend on
 * something, never against a target — **nothing in this app is timed**
 * (PRD §4 principle 10).
 */
export interface DailyRecord {
  _id: string;
  childId: string;
  /** `YYYY-MM-DD` in local time. */
  date: string;
  /** The word that went on the wall today, or null. */
  word: string | null;
  wordAdded: boolean;
  washDone: boolean;
  /** Minutes of the child's own book, tapped onto the strip. Never a target. */
  readingMinutes: number;
  movedToday: boolean;
}

/**
 * The persistent personal dictionary — PRD §6.6, §10. **New to this app.**
 *
 * "Records words and their meanings in a personal dictionary or word wall"
 * appears in every block of this ATP without exception, which is why the wall
 * outlives the day's record: a `DailyRecord` is thrown away with the week, and
 * a word the child collected in February is still on the wall in November.
 */
export interface WordWallEntry {
  _id: string;
  childId: string;
  word: string;
  /** How to say it, where TTS would get it wrong (PRD §9.1). */
  say: string;
  /** The gloss picture. A word wall a child cannot read is a blank wall. */
  picture: string;
  meaning: string;
  /** The topic the child met it in. */
  metIn: string;
  /** `YYYY-MM-DD`. */
  addedOn: string;
}

/**
 * One week of the reading star chart — the ATP's "Uses reading log/ card to
 * manage reading progress", printed in every cycle of all four terms.
 *
 * `weekStart` is the Monday date key; each entry key is `${habitId}:${dayIndex}`
 * with dayIndex 0 (Mon) … 6 (Sun).
 */
export interface HabitWeek {
  _id: string;
  childId: string;
  weekStart: string;
  entries: Record<string, boolean>;
}

export interface AppSettings {
  audioEnabled: boolean;
  /** Narration speed multiplier — an accessibility control (PRD §12). */
  narrationRate: number;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  audioEnabled: true,
  // Up from the Grade 3 chassis's 0.85, because a Grade 6 child follows
  // connected speech; still below normal, because they are following it *in
  // print at the same time* and *in an additional language* (PRD §12, §14.7).
  narrationRate: 0.95,
  reducedMotion: false,
};

export function emptyDailyRecord(childId: string, date: string): DailyRecord {
  return {
    _id: `day-${childId}-${date}`,
    childId,
    date,
    word: null,
    wordAdded: false,
    washDone: false,
    readingMinutes: 0,
    movedToday: false,
  };
}
