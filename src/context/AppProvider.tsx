import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { resolveSpeechLanguage, setAudioEnabled, setNarrationRate } from '@/audio/speech';
import { contentRepository, progressRepository } from '@/data';
import { groupBySubject } from '@/domain/curriculum';
import type { SubjectGroup } from '@/domain/curriculum';
import { YEAR_BADGE, hasAllTermBadges, starsForCompletion } from '@/domain/rewards';
import { buildSchedule } from '@/domain/schedule';
import type { ScheduledLesson } from '@/domain/schedule';
import { resolveSchoolYear } from '@/domain/schoolYear';
import type { SchoolYear } from '@/domain/schoolYear';
import { setReducedMotion } from '@/theme/motion';
import { DEFAULT_SETTINGS, emptyDailyRecord } from '@/types';
import type {
  ActivityResult,
  AppSettings,
  Badge,
  ChildProfile,
  DailyRecord,
  DailyRhythm,
  EarnedBadge,
  HabitWeek,
  WordWallEntry,
  Lesson,
  LessonProgress,
  Subject,
  Topic,
} from '@/types';
import { startOfDay, toDateKey } from '@/utils/dates';

/**
 * The one place the UI meets the data layer (PRD §9).
 *
 * Screens read from this context; they never touch storage or content files
 * directly, which is what makes the MongoDB swap in PRD §5.6 a change to two
 * lines in `src/data/index.ts`.
 */

interface AppState {
  ready: boolean;
  child: ChildProfile | null;
  subjects: Subject[];
  topics: Topic[];
  lessons: Lesson[];
  rhythms: DailyRhythm[];
  /** Lessons arranged as Subject → Term → Topic → Lesson (PRD §5.3). */
  subjectGroups: SubjectGroup[];
  schedule: ScheduledLesson[];
  schoolYear: SchoolYear;
  progressByLesson: Record<string, LessonProgress>;
  badges: EarnedBadge[];
  /** Today's number chart and counting warm-up record (PRD §6.6). */
  today: DailyRecord;
  settings: AppSettings;
}

/** The running totals behind the trophy shelf, all of them from stored progress. */
export interface ProgressTotals {
  stars: number;
  lessonsDone: number;
}

interface AppActions {
  isComplete: (lessonId: string) => boolean;
  starsFor: (lessonId: string) => number;
  /** Stars and lessons won so far, summed from what is on the device. */
  totals: ProgressTotals;
  hasBadge: (badgeId: string) => boolean;
  recordActivityResult: (lessonId: string, result: ActivityResult) => Promise<void>;
  /** Marks the lesson done and awards any badge it unlocks. */
  finishLesson: (lesson: Lesson) => Promise<{ newBadges: Badge[] }>;
  updateToday: (patch: Partial<Omit<DailyRecord, '_id' | 'childId' | 'date'>>) => Promise<void>;
  loadDailyRecords: (dateKeys: string[]) => Promise<DailyRecord[]>;
  loadHabitWeek: (weekStart: string) => Promise<HabitWeek>;
  saveHabitWeek: (week: HabitWeek) => Promise<void>;
  /** The personal dictionary — PRD §6.6. It outlives the day record. */
  loadWordWall: () => Promise<WordWallEntry[]>;
  addToWordWall: (
    entry: Omit<WordWallEntry, '_id' | 'childId'>,
  ) => Promise<WordWallEntry[]>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

type AppContextValue = AppState & AppActions;

const AppContext = createContext<AppContextValue | null>(null);

const BOOT_YEAR = resolveSchoolYear(new Date());

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    ready: false,
    child: null,
    subjects: [],
    topics: [],
    lessons: [],
    rhythms: [],
    subjectGroups: [],
    schedule: [],
    schoolYear: BOOT_YEAR,
    progressByLesson: {},
    badges: [],
    today: emptyDailyRecord('child-1', toDateKey(new Date())),
    settings: DEFAULT_SETTINGS,
  }));

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /** Always the newest daily record, however it got there. See `updateToday`. */
  const todayRef = useRef(state.today);
  useEffect(() => {
    todayRef.current = state.today;
  }, [state.today]);

  useEffect(() => {
    (async () => {
      const [child, subjects, topics, lessons, rhythms, settings, storedStart] = await Promise.all([
        progressRepository.getChild(),
        contentRepository.getSubjects(),
        contentRepository.getTopics(),
        contentRepository.getLessons(),
        contentRepository.getDailyRhythms(),
        progressRepository.getSettings(),
        progressRepository.getSchoolYearStart(),
      ]);

      const now = startOfDay(new Date());
      const schoolYear = resolveSchoolYear(now, storedStart);
      const nextStartKey = toDateKey(schoolYear.start);
      const cycleChanged = Boolean(storedStart && storedStart !== nextStartKey);
      if (cycleChanged) await progressRepository.resetChild(child._id);
      // Pin the first cycle, then advance the stored anchor once each year so
      // the same curriculum repeats instead of ending after one cycle.
      if (!storedStart || cycleChanged) {
        await progressRepository.setSchoolYearStart(nextStartKey);
      }

      const [progressList, badges, today] = await Promise.all([
        progressRepository.getAllProgress(child._id),
        progressRepository.getBadges(child._id),
        progressRepository.getDailyRecord(child._id, toDateKey(now)),
      ]);

      // Narration and motion are module-level state, so push settings into them.
      setAudioEnabled(settings.audioEnabled);
      setNarrationRate(settings.narrationRate);
      setReducedMotion(settings.reducedMotion);
      // Pick the closest English voice the device actually has (PRD §9.1). Not
      // awaited: a missing voice list must never delay the calendar appearing.
      void resolveSpeechLanguage();

      if (!mounted.current) return;
      setState({
        ready: true,
        child,
        subjects,
        topics,
        lessons,
        rhythms,
        subjectGroups: groupBySubject(subjects, topics, lessons),
        schedule: buildSchedule(schoolYear, topics, lessons),
        schoolYear,
        progressByLesson: Object.fromEntries(progressList.map((p) => [p.lessonId, p])),
        badges,
        today,
        settings,
      });
    })();
  }, []);

  const isComplete = useCallback(
    (lessonId: string) => state.progressByLesson[lessonId]?.status === 'completed',
    [state.progressByLesson],
  );

  const starsFor = useCallback(
    (lessonId: string) => state.progressByLesson[lessonId]?.starsEarned ?? 0,
    [state.progressByLesson],
  );

  /**
   * Summed from the stored records rather than counted up as the child plays,
   * so the trophy shelf reads the same after the app has been closed and
   * reopened as it did the moment a lesson was finished.
   */
  const totals = useMemo<ProgressTotals>(() => {
    let stars = 0;
    let lessonsDone = 0;
    for (const entry of Object.values(state.progressByLesson)) {
      stars += entry.starsEarned;
      if (entry.status === 'completed') lessonsDone += 1;
    }
    return { stars, lessonsDone };
  }, [state.progressByLesson]);

  const hasBadge = useCallback(
    (badgeId: string) => state.badges.some((badge) => badge.badgeId === badgeId),
    [state.badges],
  );

  const recordActivityResult = useCallback(
    async (lessonId: string, result: ActivityResult) => {
      const childId = state.child?._id;
      if (!childId) return;

      const updated = await progressRepository.recordActivity(childId, lessonId, result);
      if (!mounted.current) return;
      setState((prev) => ({
        ...prev,
        progressByLesson: { ...prev.progressByLesson, [lessonId]: updated },
      }));
    },
    [state.child?._id],
  );

  /**
   * Completing a lesson can unlock up to three things at once: the lesson's own
   * badge (Star Challenges carry the term badge), the topic badge once every
   * lesson in that topic is done, and the year badge once all four terms are in.
   */
  const finishLesson = useCallback(
    async (lesson: Lesson) => {
      const childId = state.child?._id;
      if (!childId) return { newBadges: [] as Badge[] };

      const updated = await progressRepository.completeLesson(
        childId,
        lesson._id,
        starsForCompletion(),
      );

      const completedIds = new Set(
        Object.values(state.progressByLesson)
          .filter((entry) => entry.status === 'completed')
          .map((entry) => entry.lessonId),
      );
      completedIds.add(lesson._id);

      const candidates: Badge[] = [];
      if (lesson.badge) candidates.push(lesson.badge);

      const topic = state.topics.find((entry) => entry._id === lesson.topicId);
      if (topic?.badge) {
        const siblings = state.lessons.filter((entry) => entry.topicId === topic._id);
        if (siblings.every((entry) => completedIds.has(entry._id))) candidates.push(topic.badge);
      }

      let badges = state.badges;
      const newBadges: Badge[] = [];
      for (const badge of candidates) {
        if (badges.some((entry) => entry.badgeId === badge.id)) continue;
        badges = await progressRepository.awardBadge(childId, badge.id);
        newBadges.push(badge);
      }

      const earnedIds = badges.map((entry) => entry.badgeId);
      if (hasAllTermBadges(earnedIds) && !earnedIds.includes(YEAR_BADGE.id)) {
        badges = await progressRepository.awardBadge(childId, YEAR_BADGE.id);
        newBadges.push(YEAR_BADGE);
      }

      if (!mounted.current) return { newBadges };
      setState((prev) => ({
        ...prev,
        progressByLesson: { ...prev.progressByLesson, [lesson._id]: updated },
        badges,
      }));
      return { newBadges };
    },
    [state.child?._id, state.badges, state.topics, state.lessons, state.progressByLesson],
  );

  /**
   * Patches to today's record compose against a ref rather than the rendered
   * state: the number chart writes the tens and the ones as two
   * quick taps, and a stale closure would drop the first one.
   */
  const updateToday = useCallback(
    async (patch: Partial<Omit<DailyRecord, '_id' | 'childId' | 'date'>>) => {
      const next: DailyRecord = { ...todayRef.current, ...patch };
      todayRef.current = next;
      await progressRepository.saveDailyRecord(next);
      if (!mounted.current) return;
      setState((prev) => ({ ...prev, today: next }));
    },
    [],
  );

  const loadDailyRecords = useCallback(
    async (dateKeys: string[]) => {
      const childId = state.child?._id ?? 'child-1';
      return progressRepository.getDailyRecords(childId, dateKeys);
    },
    [state.child?._id],
  );

  const loadHabitWeek = useCallback(
    async (weekStart: string) => {
      const childId = state.child?._id ?? 'child-1';
      return progressRepository.getHabitWeek(childId, weekStart);
    },
    [state.child?._id],
  );

  const saveHabitWeek = useCallback(async (week: HabitWeek) => {
    await progressRepository.saveHabitWeek(week);
  }, []);

  const loadWordWall = useCallback(async () => {
    const childId = state.child?._id ?? 'child-1';
    return progressRepository.getWordWall(childId);
  }, [state.child?._id]);

  const addToWordWall = useCallback(
    async (entry: Omit<WordWallEntry, '_id' | 'childId'>) => {
      const childId = state.child?._id ?? 'child-1';
      return progressRepository.addWordWallEntry(childId, entry);
    },
    [state.child?._id],
  );

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      const next = { ...state.settings, ...patch };
      await progressRepository.saveSettings(next);
      setAudioEnabled(next.audioEnabled);
      setNarrationRate(next.narrationRate);
      setReducedMotion(next.reducedMotion);
      if (!mounted.current) return;
      setState((prev) => ({ ...prev, settings: next }));
    },
    [state.settings],
  );

  const resetProgress = useCallback(async () => {
    const childId = state.child?._id;
    if (!childId) return;
    await progressRepository.resetChild(childId);
    if (!mounted.current) return;
    setState((prev) => ({
      ...prev,
      progressByLesson: {},
      badges: [],
      today: emptyDailyRecord(childId, prev.today.date),
    }));
  }, [state.child?._id]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      isComplete,
      starsFor,
      totals,
      hasBadge,
      recordActivityResult,
      finishLesson,
      updateToday,
      loadDailyRecords,
      loadHabitWeek,
      saveHabitWeek,
      loadWordWall,
      addToWordWall,
      updateSettings,
      resetProgress,
    }),
    [
      state,
      isComplete,
      starsFor,
      totals,
      hasBadge,
      recordActivityResult,
      finishLesson,
      updateToday,
      loadDailyRecords,
      loadHabitWeek,
      saveHabitWeek,
      loadWordWall,
      addToWordWall,
      updateSettings,
      resetProgress,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside <AppProvider>');
  return value;
}
