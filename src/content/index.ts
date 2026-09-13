import type { Lesson, Topic } from '@/types';

import { TERM_1 } from './term1';
import { TERM_2 } from './term2';
import { TERM_3 } from './term3';
import { TERM_4 } from './term4';

export { SUBJECTS } from './subjects';
export { DAILY_RHYTHMS, variantForDate } from './dailyRhythms';
export { TERM_PLANS, termPlan, SCHOOL_YEAR_START, SCHOOL_YEAR_WEEKS } from './calendar';
export { SUBJECT_ID } from './authoring';

const TERMS = [TERM_1, TERM_2, TERM_3, TERM_4];

/**
 * Everything the app ships with — the whole English First Additional Language
 * Grade 6 year: the four term plans, their topics and lessons (PRD §8).
 *
 * New topics are appended to a term file as data. No code changes are needed as
 * long as they use an activity type that already exists (PRD §11).
 */
export const TOPICS: Topic[] = TERMS.flatMap((term) => term.topics);

export const ALL_LESSONS: Lesson[] = TERMS.flatMap((term) => term.lessons);
