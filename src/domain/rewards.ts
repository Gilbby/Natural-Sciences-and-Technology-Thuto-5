import type { Badge, TermNumber } from '@/types';

/**
 * Reward rules — PRD §6.9.
 *
 * Finishing a lesson always earns the full three stars. Nobody fails (PRD §4.6);
 * the attempt counts still land in the progress record for the later teacher
 * view, they are simply never turned into a mark for the child.
 *
 * **In a Grade 5 Mathematics app this matters more than it ever has, and for a
 * reason that is about the subject rather than about this child.** This ATP
 * carries an assignment, an investigation, a project and four tests, and
 * mathematics is the subject a South African child is most likely to have
 * already been told she is bad at. **Every other mathematics app on her phone
 * is a stopwatch** — speed drills, streaks, three lives, beat your best time —
 * and a child who is behind is told so in the first ninety seconds (PRD §1.1).
 *
 * **This app is the one that does not count.** Finishing always earns three
 * stars. There is no field in the progress record for elapsed time, for a
 * streak, or for a best score, and `scripts/check-content.ts` check 5 fails the
 * build if one appears (PRD §1.1 rule 1, §10, §11 check 5).
 */
export const STARS_PER_LESSON = 3;

export function starsForCompletion(): number {
  return STARS_PER_LESSON;
}

/** The badge for finishing a whole term's Star Challenge (PRD §6.9). */
export function termBadgeId(term: TermNumber): string {
  return `term-${term}-badge`;
}

/**
 * One emoji per term, and each is what the term is actually about: term 1 is
 * numbers you can hold, term 2 is parts of a whole, term 3 is data and how big,
 * term 4 is time (PRD §8.1, §16.2).
 */
const TERM_BADGE_EMOJI: Record<TermNumber, string> = {
  1: "🔢",
  2: "🍕",
  3: "📊",
  4: "🕐",
};

export function termBadge(term: TermNumber, title: string): Badge {
  return { id: termBadgeId(term), emoji: TERM_BADGE_EMOJI[term], title: { en: title } };
}

/** Finishing all four terms earns the year's top award (PRD §8.1). */
export const YEAR_BADGE: Badge = {
  id: 'grade-5-mathematics-star',
  emoji: '🏆',
  title: { en: 'Grade 5 Mathematics Star' },
};

export function hasAllTermBadges(earnedBadgeIds: string[]): boolean {
  return ([1, 2, 3, 4] as TermNumber[]).every((term) => earnedBadgeIds.includes(termBadgeId(term)));
}
