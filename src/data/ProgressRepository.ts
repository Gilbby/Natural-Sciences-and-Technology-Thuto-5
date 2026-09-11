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

/**
 * The progress seam — PRD §5.6, §9.
 *
 * v1 writes to on-device storage. A syncing implementation lands later
 * (offline-first, last-write-wins per child) behind this same interface.
 */
export interface ProgressRepository {
  getChild(): Promise<ChildProfile>;
  saveChild(child: ChildProfile): Promise<void>;

  getAllProgress(childId: string): Promise<LessonProgress[]>;
  getLessonProgress(childId: string, lessonId: string): Promise<LessonProgress | null>;
  /** Written after each activity so progress is never lost (PRD §12). */
  recordActivity(
    childId: string,
    lessonId: string,
    result: ActivityResult,
  ): Promise<LessonProgress>;
  completeLesson(childId: string, lessonId: string, starsEarned: number): Promise<LessonProgress>;

  getBadges(childId: string): Promise<EarnedBadge[]>;
  awardBadge(childId: string, badgeId: string): Promise<EarnedBadge[]>;

  /** One school day's rhythms — Reading Log, Word Wall, Word Play (PRD §6.6). */
  getDailyRecord(childId: string, date: string): Promise<DailyRecord>;
  getDailyRecords(childId: string, dates: string[]): Promise<DailyRecord[]>;
  saveDailyRecord(record: DailyRecord): Promise<void>;

  /**
   * The persistent personal dictionary (PRD §6.6, §10).
   *
   * Separate from the daily record on purpose: a `DailyRecord` is thrown away
   * with the week, and a word the child collected in February is still on the
   * wall in November. "Records words and their meanings in a personal
   * dictionary or word wall" appears in every cycle of this ATP without
   * exception, which is why the wall outlives the day.
   */
  getWordWall(childId: string): Promise<WordWallEntry[]>;
  addWordWallEntry(
    childId: string,
    entry: Omit<WordWallEntry, '_id' | 'childId'>,
  ): Promise<WordWallEntry[]>;

  getHabitWeek(childId: string, weekStart: string): Promise<HabitWeek>;
  saveHabitWeek(week: HabitWeek): Promise<void>;

  getSettings(): Promise<AppSettings>;
  saveSettings(settings: AppSettings): Promise<void>;

  /**
   * The Monday that starts this child's school year (PRD §5.5). Stored on first
   * launch so the calendar a child saw yesterday is the calendar they see today.
   */
  getSchoolYearStart(): Promise<string | null>;
  setSchoolYearStart(dateKey: string): Promise<void>;

  /** Behind the parent gate only. */
  resetChild(childId: string): Promise<void>;
}
