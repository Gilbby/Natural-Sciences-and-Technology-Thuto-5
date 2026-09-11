import { TERM_PLANS } from '@/content/calendar';
import type { TermPlan } from '@/content/calendar';
import type { Lesson, Subject, TermNumber, Topic } from '@/types';

/**
 * Subject → Term → Topic → Lesson — PRD §5.3.
 *
 * The content files only ever state where a thing belongs (`subjectId`,
 * `topicId`, `term`). This is the layer that turns those pointers into the
 * hierarchy every screen presents, which is why adding Home Language or Life
 * Skills later is data and not code (PRD §5.4, §11).
 */

export interface TopicGroup {
  topic: Topic;
  lessons: Lesson[];
}

export interface TermGroup {
  plan: TermPlan;
  term: TermNumber;
  topics: TopicGroup[];
  lessons: Lesson[];
}

export interface SubjectGroup {
  subject: Subject;
  terms: TermGroup[];
  topics: TopicGroup[];
  /** Every lesson in the subject, flattened, in teaching order. */
  lessons: Lesson[];
}

function topicOrder(a: Topic, b: Topic): number {
  return a.term - b.term || a.weekStart - b.weekStart || a.weekEnd - b.weekEnd;
}

/**
 * Builds the full hierarchy.
 *
 * Subjects with no lessons yet are kept — a child seeing Maths sitting there
 * waiting is the point (PRD §5.4). Topics with no lessons are dropped rather
 * than rendering an empty tile; `scripts/check-content.ts` is what stops that
 * reaching a build in the first place.
 */
export function groupBySubject(
  subjects: Subject[],
  topics: Topic[],
  lessons: Lesson[],
): SubjectGroup[] {
  return [...subjects]
    .sort((a, b) => a.order - b.order)
    .map((subject) => {
      const subjectTopics = topics
        .filter((topic) => topic.subjectId === subject._id)
        .sort(topicOrder);

      const topicGroups: TopicGroup[] = subjectTopics
        .map((topic) => ({
          topic,
          lessons: lessons
            .filter((lesson) => lesson.topicId === topic._id)
            .sort((a, b) => a.orderInTopic - b.orderInTopic),
        }))
        .filter((group) => group.lessons.length > 0);

      const terms: TermGroup[] = TERM_PLANS.map((plan) => {
        const inTerm = topicGroups.filter((group) => group.topic.term === plan.term);
        return {
          plan,
          term: plan.term,
          topics: inTerm,
          lessons: inTerm.flatMap((group) => group.lessons),
        };
      }).filter((group) => group.topics.length > 0);

      return {
        subject,
        terms,
        topics: topicGroups,
        lessons: topicGroups.flatMap((group) => group.lessons),
      };
    });
}

export function findSubjectGroup(
  groups: SubjectGroup[],
  subjectId: string | undefined,
): SubjectGroup | null {
  return groups.find((group) => group.subject._id === subjectId) ?? null;
}

export function findTopicGroup(
  groups: SubjectGroup[],
  topicId: string | undefined,
): TopicGroup | null {
  for (const group of groups) {
    const found = group.topics.find((entry) => entry.topic._id === topicId);
    if (found) return found;
  }
  return null;
}

export interface Completion {
  done: number;
  total: number;
  /** True only when there is something to do and all of it is done. */
  complete: boolean;
}

export function completionOf(
  lessons: Lesson[],
  isComplete: (lessonId: string) => boolean,
): Completion {
  const done = lessons.filter((lesson) => isComplete(lesson._id)).length;
  return { done, total: lessons.length, complete: lessons.length > 0 && done === lessons.length };
}

/** A subject a child can open now, as opposed to one still being written. */
export function isPlayable(group: SubjectGroup): boolean {
  return group.subject.status === 'active' && group.lessons.length > 0;
}
