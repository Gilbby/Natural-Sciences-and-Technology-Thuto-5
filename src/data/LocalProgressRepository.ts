import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, emptyDailyRecord } from '@/types';
import type {
  ActivityResult,
  AppSettings,
  ChildProfile,
  DailyRecord,
  EarnedBadge,
  HabitWeek,
  LessonProgress,
  WordWallEntry,
} from '@/types';

import type { ProgressRepository } from './ProgressRepository';

/**
 * On-device progress (PRD §6.8). Everything stays local in v1 — no child data
 * leaves the phone, which is what keeps this POPIA-clean.
 */

const KEY = {
  child: 'nstthuto5:child',
  progress: (childId: string) => `nstthuto5:progress:${childId}`,
  badges: (childId: string) => `nstthuto5:badges:${childId}`,
  daily: (childId: string, date: string) => `nstthuto5:day:${childId}:${date}`,
  habitWeek: (childId: string, weekStart: string) => `nstthuto5:habits:${childId}:${weekStart}`,
  /** The personal dictionary. One key for the whole year (PRD §6.6). */
  wordWall: (childId: string) => `nstthuto5:wall:${childId}`,
  settings: 'nstthuto5:settings',
  yearStart: 'nstthuto5:school-year-start',
};

/** v1 ships one local profile; profile selection arrives in v1.1 (PRD §6.2). */
export const DEFAULT_CHILD_ID = 'child-1';

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    // A corrupt or unreadable value must never block a child from playing.
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage failures are non-fatal: the session still works in memory.
  }
}

/**
 * Runs read-modify-write cycles one at a time.
 *
 * Progress and badges are each stored as a single JSON array, so a cycle that
 * reads before an earlier one has written silently drops the earlier update.
 * The last activity of a lesson is recorded while the child is already tapping
 * "I'm done", which is exactly that race — without this, the result of the
 * activity they just finished can vanish. Writes are tiny and rare, so a single
 * queue is enough.
 */
let writeQueue: Promise<unknown> = Promise.resolve();

function serialise<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  // A failed task must not poison the queue for everything behind it.
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function emptyProgress(childId: string, lessonId: string): LessonProgress {
  return {
    _id: `prog-${childId}-${lessonId}`,
    childId,
    lessonId,
    status: 'not-started',
    starsEarned: 0,
    attempts: 0,
    activityResults: [],
    startedAt: null,
    completedAt: null,
  };
}

export class LocalProgressRepository implements ProgressRepository {
  async getChild(): Promise<ChildProfile> {
    const existing = await readJson<ChildProfile | null>(KEY.child, null);
    if (existing) return existing;

    const child: ChildProfile = {
      _id: DEFAULT_CHILD_ID,
      name: null,
      avatar: 'owl',
      grade: 5,
      audioLang: 'en',
      createdAt: new Date().toISOString(),
    };
    await writeJson(KEY.child, child);
    return child;
  }

  async saveChild(child: ChildProfile): Promise<void> {
    await writeJson(KEY.child, child);
  }

  async getAllProgress(childId: string): Promise<LessonProgress[]> {
    return readJson<LessonProgress[]>(KEY.progress(childId), []);
  }

  async getLessonProgress(childId: string, lessonId: string): Promise<LessonProgress | null> {
    const all = await this.getAllProgress(childId);
    return all.find((entry) => entry.lessonId === lessonId) ?? null;
  }

  private async upsert(
    childId: string,
    lessonId: string,
    mutate: (entry: LessonProgress) => LessonProgress,
  ): Promise<LessonProgress> {
    return serialise(async () => {
      const all = await this.getAllProgress(childId);
      const index = all.findIndex((entry) => entry.lessonId === lessonId);
      const current = index >= 0 ? all[index] : emptyProgress(childId, lessonId);
      const next = mutate(current);

      if (index >= 0) all[index] = next;
      else all.push(next);

      await writeJson(KEY.progress(childId), all);
      return next;
    });
  }

  async recordActivity(
    childId: string,
    lessonId: string,
    result: ActivityResult,
  ): Promise<LessonProgress> {
    return this.upsert(childId, lessonId, (entry) => {
      const results = entry.activityResults.filter((r) => r.activityId !== result.activityId);
      results.push(result);
      return {
        ...entry,
        status: entry.status === 'completed' ? 'completed' : 'in-progress',
        startedAt: entry.startedAt ?? new Date().toISOString(),
        activityResults: results,
      };
    });
  }

  async completeLesson(
    childId: string,
    lessonId: string,
    starsEarned: number,
  ): Promise<LessonProgress> {
    return this.upsert(childId, lessonId, (entry) => ({
      ...entry,
      status: 'completed',
      // Replaying can only ever add stars, never take them away (PRD §4.4).
      starsEarned: Math.max(entry.starsEarned, starsEarned),
      attempts: entry.attempts + 1,
      startedAt: entry.startedAt ?? new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }));
  }

  async getBadges(childId: string): Promise<EarnedBadge[]> {
    return readJson<EarnedBadge[]>(KEY.badges(childId), []);
  }

  async awardBadge(childId: string, badgeId: string): Promise<EarnedBadge[]> {
    // Finishing a Star Challenge can award the lesson, topic and year badges in
    // one go, so these cycles land back to back.
    return serialise(async () => {
      const badges = await this.getBadges(childId);
      if (badges.some((badge) => badge.badgeId === badgeId)) return badges;

      const next = [...badges, { badgeId, childId, earnedAt: new Date().toISOString() }];
      await writeJson(KEY.badges(childId), next);
      return next;
    });
  }

  async getDailyRecord(childId: string, date: string): Promise<DailyRecord> {
    return readJson<DailyRecord>(KEY.daily(childId, date), emptyDailyRecord(childId, date));
  }

  /** One read per day is fine for a week strip; batched so the UI waits once. */
  async getDailyRecords(childId: string, dates: string[]): Promise<DailyRecord[]> {
    return Promise.all(dates.map((date) => this.getDailyRecord(childId, date)));
  }

  async saveDailyRecord(record: DailyRecord): Promise<void> {
    await writeJson(KEY.daily(record.childId, record.date), record);
  }

  /** The personal dictionary, kept for the whole year (PRD §6.6). */
  async getWordWall(childId: string): Promise<WordWallEntry[]> {
    return readJson<WordWallEntry[]>(KEY.wordWall(childId), []);
  }

  /**
   * Add a word to the wall.
   *
   * Idempotent on the word itself: a child who meets a word twice gets one card
   * on the wall, not two, and the earlier `addedOn` is the one that stands —
   * the wall is a record of when a word was *met*.
   */
  async addWordWallEntry(
    childId: string,
    entry: Omit<WordWallEntry, '_id' | 'childId'>,
  ): Promise<WordWallEntry[]> {
    return serialise(async () => {
      const wall = await readJson<WordWallEntry[]>(KEY.wordWall(childId), []);
      if (wall.some((existing) => existing.word === entry.word)) return wall;
      const next: WordWallEntry[] = [
        ...wall,
        { ...entry, _id: `wall-${childId}-${entry.word}`, childId },
      ];
      await writeJson(KEY.wordWall(childId), next);
      return next;
    });
  }

  async getHabitWeek(childId: string, weekStart: string): Promise<HabitWeek> {
    return readJson<HabitWeek>(KEY.habitWeek(childId, weekStart), {
      _id: `habits-${childId}-${weekStart}`,
      childId,
      weekStart,
      entries: {},
    });
  }

  async saveHabitWeek(week: HabitWeek): Promise<void> {
    await writeJson(KEY.habitWeek(week.childId, week.weekStart), week);
  }

  async getSettings(): Promise<AppSettings> {
    const stored = await readJson<Partial<AppSettings>>(KEY.settings, {});
    return { ...DEFAULT_SETTINGS, ...stored };
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await writeJson(KEY.settings, settings);
  }

  async getSchoolYearStart(): Promise<string | null> {
    return readJson<string | null>(KEY.yearStart, null);
  }

  async setSchoolYearStart(dateKey: string): Promise<void> {
    await writeJson(KEY.yearStart, dateKey);
  }

  async resetChild(childId: string): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const mine = keys.filter((key) => key.includes(`:${childId}`));
      await AsyncStorage.multiRemove([...mine, KEY.yearStart]);
    } catch {
      // Nothing to do — a failed reset leaves progress intact, which is safe.
    }
  }
}
