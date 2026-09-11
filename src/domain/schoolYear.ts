import { SCHOOL_YEAR_START, TERM_PLANS } from '@/content/calendar';
import type { TermPlan } from '@/content/calendar';
import type { TermNumber } from '@/types';
import { addDays, startOfDay, startOfWeek } from '@/utils/dates';

/**
 * Turning the term plan into real dates — PRD §5.5.
 *
 * Everything downstream (the calendar grid, the lesson schedule, "what term is
 * it now") is derived from a single date: the Monday that starts the school
 * year. Store that one value and the whole year is reproducible.
 */

export interface TermWindow {
  plan: TermPlan;
  term: TermNumber;
  /** Monday of week 1. */
  start: Date;
  /** Friday of the final week. */
  end: Date;
}

export interface SchoolYear {
  /** Monday of term 1, week 1. */
  start: Date;
  /** Friday of term 4's final week. */
  end: Date;
  terms: TermWindow[];
  /**
   * True when the year was laid out from the child's own start day because the
   * real dates put today outside the school year (PRD §5.5).
   */
  simulated: boolean;
}

/** The Monday on or after a date. A date that is already Monday is unchanged. */
function mondayOnOrAfter(date: Date): Date {
  const week = startOfWeek(date);
  return week < startOfDay(date) ? addDays(week, 7) : week;
}

/** Monday of term 1 week 1 for a real calendar year. */
export function realYearStart(year: number): Date {
  return mondayOnOrAfter(new Date(year, SCHOOL_YEAR_START.month, SCHOOL_YEAR_START.day));
}

function windowsFor(start: Date): TermWindow[] {
  return TERM_PLANS.map((plan) => {
    const termStart = addDays(start, plan.weekOffset * 7);
    return {
      plan,
      term: plan.term,
      start: termStart,
      // Weeks are Monday-based, so the final teaching day is the Friday.
      end: addDays(termStart, plan.weeks * 7 - 3),
    };
  });
}

function yearFrom(start: Date, simulated: boolean): SchoolYear {
  const terms = windowsFor(start);
  return {
    start,
    end: terms[terms.length - 1].end,
    terms,
    simulated,
  };
}

/**
 * The rolling year the child is living in.
 *
 * A stored start date always wins, so the calendar a child saw yesterday is the
 * calendar they see today. With nothing stored: use the real SA dates if today
 * falls inside them, and otherwise start the year from this week so the
 * calendar is populated around the current day (PRD §5.5). A new installation
 * therefore receives a complete twelve-month calendar from first launch.
 */
export function resolveSchoolYear(today: Date, storedStartKey?: string | null): SchoolYear {
  if (storedStartKey) {
    const [y, m, d] = storedStartKey.split('-').map(Number);
    if (y && m && d) {
      let start = startOfDay(new Date(y, m - 1, d));
      const now = startOfDay(today);
      // Reuse the same curriculum every 52 weeks. The calendar advances to a
      // fresh cycle instead of becoming empty after its first year.
      while (now > yearFrom(start, false).end) start = addDays(start, 52 * 7);
      while (now < start) start = addDays(start, -52 * 7);
      return yearFrom(start, false);
    }
  }

  const now = startOfDay(today);
  return yearFrom(startOfWeek(now), true);
}

export function termWindow(year: SchoolYear, term: TermNumber): TermWindow {
  const found = year.terms.find((entry) => entry.term === term);
  if (!found) throw new Error(`No window for term ${term}`);
  return found;
}

/** Monday of a given ATP week inside a term. `week` is 1-based. */
export function weekMonday(year: SchoolYear, term: TermNumber, week: number): Date {
  return addDays(termWindow(year, term).start, (week - 1) * 7);
}

/** The Monday-to-Friday teaching days across an inclusive ATP week range. */
export function schoolDays(
  year: SchoolYear,
  term: TermNumber,
  weekStart: number,
  weekEnd: number,
): Date[] {
  const days: Date[] = [];
  for (let week = weekStart; week <= weekEnd; week += 1) {
    const monday = weekMonday(year, term, week);
    for (let day = 0; day < 5; day += 1) days.push(addDays(monday, day));
  }
  return days;
}

export function isSchoolDay(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

/** Which term a date falls in, or null during a holiday. */
export function termOn(year: SchoolYear, date: Date): TermWindow | null {
  const at = startOfDay(date);
  return year.terms.find((window) => at >= window.start && at <= window.end) ?? null;
}

/**
 * The term to show when the app opens: the one today sits in, or the next one
 * up during a holiday, or the last term once the year is over. Never null —
 * the calendar always has somewhere to be.
 */
export function currentTerm(year: SchoolYear, today: Date): TermWindow {
  const at = startOfDay(today);
  return (
    termOn(year, at) ??
    year.terms.find((window) => at < window.start) ??
    year.terms[year.terms.length - 1]
  );
}

/** ATP week number within a term, 1-based, or null outside the term. */
export function weekNumberOn(window: TermWindow, date: Date): number | null {
  const at = startOfDay(date);
  if (at < window.start || at > window.end) return null;
  const days = Math.round((at.getTime() - window.start.getTime()) / 86_400_000);
  return Math.floor(days / 7) + 1;
}

/** "Term 2, week 7" — spoken, so it is written the way it is said. */
export function spokenPosition(year: SchoolYear, date: Date): string {
  const window = termOn(year, date);
  if (!window) return 'School holiday';
  const week = weekNumberOn(window, date);
  return `Term ${window.term}, week ${week}`;
}

export function isYearComplete(year: SchoolYear, today: Date): boolean {
  return startOfDay(today) > year.end;
}
