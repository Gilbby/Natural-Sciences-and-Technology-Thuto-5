import { ALL_LESSONS, DAILY_RHYTHMS, SUBJECTS, TOPICS } from '@/content';
import type { DailyRhythm, Lesson, Subject, Topic } from '@/types';

import type { ContentRepository } from './ContentRepository';

/**
 * v1 content: a whole year bundled with the app, so nothing a child does needs
 * a network (PRD §6.8). Async on purpose — the remote implementation will be
 * too, and the UI should never have to change shape.
 */
export class LocalContentRepository implements ContentRepository {
  async getSubjects(): Promise<Subject[]> {
    return [...SUBJECTS].sort((a, b) => a.order - b.order);
  }

  async getTopics(subjectId?: string): Promise<Topic[]> {
    return subjectId ? TOPICS.filter((topic) => topic.subjectId === subjectId) : TOPICS;
  }

  async getTopic(topicId: string): Promise<Topic | null> {
    return TOPICS.find((topic) => topic._id === topicId) ?? null;
  }

  async getLessons(): Promise<Lesson[]> {
    return ALL_LESSONS;
  }

  async getLesson(lessonId: string): Promise<Lesson | null> {
    return ALL_LESSONS.find((lesson) => lesson._id === lessonId) ?? null;
  }

  async getDailyRhythms(): Promise<DailyRhythm[]> {
    return DAILY_RHYTHMS;
  }
}
