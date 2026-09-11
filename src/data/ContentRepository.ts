import type { DailyRhythm, Lesson, Subject, Topic } from '@/types';

/**
 * The content seam — PRD §5.6.
 *
 * The UI only ever sees this interface. v1 implements it against bundled data;
 * a MongoDB-backed `RemoteContentRepository` slots in later with no UI change.
 */
export interface ContentRepository {
  getSubjects(): Promise<Subject[]>;
  getTopics(subjectId?: string): Promise<Topic[]>;
  getTopic(topicId: string): Promise<Topic | null>;
  getLessons(): Promise<Lesson[]>;
  getLesson(lessonId: string): Promise<Lesson | null>;
  /** The number chart and counting warm-up that run every school day (PRD §6.6). */
  getDailyRhythms(): Promise<DailyRhythm[]>;
}
