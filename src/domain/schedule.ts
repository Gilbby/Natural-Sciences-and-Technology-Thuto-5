import type { Lesson, TermNumber, Topic } from '@/types';
import { isSameDay, startOfDay, toDateKey } from '@/utils/dates';

import { schoolDays } from './schoolYear';
import type { SchoolYear } from './schoolYear';

/**
 * Placing lessons on the calendar — PRD §5.5.
 *
 * A topic owns a range of ATP weeks; its lessons spread across the Monday-to-
 * Friday teaching days in that range. Nothing here invents a date of its own:
 * change the school year and every lesson moves with it.
 */

export interface ScheduledLesson {
  lesson: Lesson;
  topic: Topic;
  term: TermNumber;
  date: Date;
  dateKey: string;
}

/**
 * Spread `count` lessons evenly across `days` teaching days, each sitting in
 * the middle of its own slice rather than bunched at the start of the topic.
 */
function preferredIndexes(count: number, days: number): number[] {
  if (count <= 0 || days <= 0) return [];
  if (count >= days) return Array.from({ length: count }, (_, i) => Math.min(i, days - 1));
  return Array.from({ length: count }, (_, i) => Math.floor(((i + 0.5) * days) / count));
}

/**
 * The nearest free day to `preferred`, searching outwards within the topic's
 * own week range.
 *
 * Topics can overlap — the ATP runs Animal Homes across weeks 11 and 12 and the
 * term's Star Challenge lands in week 12 as well — and a calendar square only
 * has room for one tile. Nudging the later lesson to a free neighbouring day
 * keeps one lesson per square without moving anything out of its ATP weeks. If
 * the whole range really is full, the collision is allowed and the calendar
 * shows a "+1" marker rather than hiding a lesson.
 */
function nearestFreeIndex(days: Date[], preferred: number, taken: Set<string>): number {
  if (!taken.has(toDateKey(days[preferred]))) return preferred;

  for (let offset = 1; offset < days.length; offset += 1) {
    const after = preferred + offset;
    if (after < days.length && !taken.has(toDateKey(days[after]))) return after;

    const before = preferred - offset;
    if (before >= 0 && !taken.has(toDateKey(days[before]))) return before;
  }
  return preferred;
}

export function buildSchedule(
  year: SchoolYear,
  topics: Topic[],
  lessons: Lesson[],
): ScheduledLesson[] {
  const scheduled: ScheduledLesson[] = [];
  const taken = new Set<string>();

  for (const topic of topics) {
    const days = schoolDays(year, topic.term, topic.weekStart, topic.weekEnd);
    if (days.length === 0) continue;

    const topicLessons = lessons
      .filter((lesson) => lesson.topicId === topic._id)
      .sort((a, b) => a.orderInTopic - b.orderInTopic);

    const indexes = preferredIndexes(topicLessons.length, days.length);
    topicLessons.forEach((lesson, i) => {
      const index = nearestFreeIndex(days, indexes[i], taken);
      const date = days[index];
      const dateKey = toDateKey(date);
      taken.add(dateKey);
      scheduled.push({ lesson, topic, term: topic.term, date, dateKey });
    });
  }

  return scheduled.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function groupByDate(schedule: ScheduledLesson[]): Map<string, ScheduledLesson[]> {
  const map = new Map<string, ScheduledLesson[]>();
  for (const entry of schedule) {
    const bucket = map.get(entry.dateKey);
    if (bucket) bucket.push(entry);
    else map.set(entry.dateKey, [entry]);
  }
  return map;
}

export function lessonsOn(schedule: ScheduledLesson[], date: Date): ScheduledLesson[] {
  const key = toDateKey(date);
  return schedule.filter((entry) => entry.dateKey === key);
}

/**
 * What the "Today's lesson" shortcut opens (PRD §6.1).
 *
 * Today's unfinished lesson first; then the next unfinished one anywhere ahead,
 * so the button always moves the child forward. When the whole year is done it
 * offers the last lesson again rather than nothing — repeating is rewarded and
 * the button is never a dead end (PRD §4.4, §4.5).
 */
export function resolveTodaysLesson(
  schedule: ScheduledLesson[],
  today: Date,
  isComplete: (lessonId: string) => boolean,
): { entry: ScheduledLesson; isToday: boolean } | null {
  if (schedule.length === 0) return null;

  const todays = lessonsOn(schedule, today);
  const unfinishedToday = todays.find((entry) => !isComplete(entry.lesson._id));
  if (unfinishedToday) return { entry: unfinishedToday, isToday: true };

  const at = startOfDay(today);
  const nextUnfinished =
    schedule.find((entry) => entry.date >= at && !isComplete(entry.lesson._id)) ??
    schedule.find((entry) => !isComplete(entry.lesson._id));

  if (nextUnfinished) {
    return { entry: nextUnfinished, isToday: isSameDay(nextUnfinished.date, today) };
  }

  if (todays.length > 0) return { entry: todays[0], isToday: true };
  return { entry: schedule[schedule.length - 1], isToday: false };
}
