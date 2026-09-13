import type { AudioPrompt, LanguageCode, LocalisedText } from '@/types';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/** Resolve a localised string, falling back to English. */
export function t(text: LocalisedText | undefined, lang: LanguageCode = DEFAULT_LANGUAGE): string {
  if (!text) return '';
  return text[lang] ?? text.en;
}

/** The words to speak for a prompt. Pre-recorded audio replaces this later. */
export function promptText(
  prompt: AudioPrompt | undefined,
  lang: LanguageCode = DEFAULT_LANGUAGE,
): string {
  return t(prompt?.text, lang);
}

/**
 * UI strings — the app's **chrome** (PRD §1.1, §4.2).
 *
 * Every word below is spoken as well as shown, and **a child who cannot read a
 * word of it can still work the whole app**: cover every string in this object
 * and every button, every navigation choice and every reward must still be
 * operable. That is §17's chrome test.
 *
 * The words the child is *meant* to read are content, and they live in the
 * lessons, where they are displayed large and speak on tap.
 *
 * **Nothing here got longer or harder in this fork.** The register is the
 * Grade 4 one, unchanged: flat, short, respectful. A ten-year-old who decides
 * this app is for small children never opens it again (PRD §4.15).
 */
export const ui = {
  appName: { en: 'Thuto 6' },
  subtitle: { en: 'English First Additional Language' },
  homeGreeting: { en: 'Tap a day to open a lesson.' },
  todaysLesson: { en: "Today's lesson" },
  nextLesson: { en: 'Your next lesson' },
  everyDay: { en: 'Every day' },
  myLessons: { en: 'My lessons' },
  tapALesson: { en: 'Tap a lesson to start.' },
  tapATopic: { en: 'Tap a topic to see its lessons.' },
  noLessonsYet: { en: 'Nothing here yet. Check back soon.' },
  back: { en: 'Back' },
  home: { en: 'Home' },
  hearItAgain: { en: 'Hear it again' },
  next: { en: 'Next' },
  done: { en: "I'm done" },
  undo: { en: 'Undo' },
  clear: { en: 'Start again' },
  previousMonth: { en: 'Previous month' },
  nextMonth: { en: 'Next month' },
  previousTerm: { en: 'The term before' },
  nextTerm: { en: 'The next term' },
  finished: { en: 'Lesson done.' },
  alreadyDone: { en: 'You have done this one already.' },
  tryAgain: { en: 'Not that one. Try again.' },
  wellDone: { en: 'Done.' },
  starChallenge: { en: 'Star Challenge' },
  badgeEarned: { en: 'You earned a badge.' },
  comeBackTomorrow: { en: "That's today's lot. There's more tomorrow." },
  backToCalendar: { en: 'Back to my calendar' },
  holiday: { en: 'School holiday. Tap here for your next lesson.' },

  /* Daily rhythms — PRD §6.6. All three are ATP rows printed in every block. */
  washAndCheck: { en: 'Wash and Check' },
  washPrompt: { en: 'One small thing that keeps you well. Tap the day when you have done it.' },
  moveToday: { en: 'Move Today' },
  movePrompt: { en: 'Something to do with your body. Listen first, then move.' },
  wordOfTheDay: { en: 'New Words' },
  wordPrompt: { en: 'Hear the word, then build it. Then it goes on your wall.' },
  wordDone: { en: "Today's word is" },
  myWordToday: { en: 'My word today' },
  myWordWeek: { en: 'My words this week' },
  tapTheLetters: { en: 'Tap the parts, in order.' },
  tapToTakeBack: { en: 'Tap a part in the strip to take it back.' },
  doneToday: { en: 'Done today' },

  /* read-text — PRD §7.1 */
  readItToMe: { en: 'Read it to me' },
  readThisWord: { en: 'Tap any word to hear it.' },
  iHaveReadIt: { en: "I've read it" },
  stopReading: { en: 'Stop' },
  whatItMeans: { en: 'What it means' },

  /* speakAlong — PRD §6.5c. Nothing listens, and the child is told so. */
  illReadIt: { en: "I'll say it" },
  nowHearIt: { en: 'Now hear it' },
  nothingIsListening: { en: 'Nobody is listening. Say it out loud.' },

  /**
   * The safety line — PRD §7.2, §1.1 rule 1.
   *
   * The heading above it. **The line itself is content, never chrome**: it is
   * written by the author, rendered large above the prompt, and speaks on tap
   * like every other line in the app.
   */
  beforeYouStart: { en: 'Before you start' },
  spaceYouNeed: { en: 'Room you need' },
  whatYouNeed: { en: 'What you need' },
  needNothing: { en: 'Nothing at all' },

  /* beat-along — PRD §7.3. Nothing here is a count of the child. */
  listenFirst: { en: 'Listen first' },
  playItAgain: { en: 'Play it again' },
  iClappedAlong: { en: 'I clapped along' },

  /* Trophy shelf */
  myTrophies: { en: 'My trophies' },
  trophiesPrompt: { en: 'Everything you have won this year.' },
  noTrophiesYet: { en: 'Finish a topic to win your first badge.' },
  yearComplete: { en: 'You finished the whole Grade 6 English First Additional Language year.' },
  myStars: { en: 'Stars' },
  myLessonsDone: { en: 'Lessons' },
  myBadges: { en: 'Badges' },
} satisfies Record<string, LocalisedText>;

/**
 * Spoken when the child gets something right — PRD §4.15.
 *
 * **Copied verbatim from *Life Skills Thuto 4*. Do not touch this bank.**
 * Nine and ten are the same child for a praise line (PRD §15.3), and this is
 * the line a ten-year-old hears fifty times a week.
 *
 * The rules are exact. Short. Flat. **No exclamation marks. No emoji. No
 * "clever". No "little".**
 */
export const praisePhrases = [
  'Yes.',
  "That's it.",
  'Got it.',
  'Correct.',
  'Right.',
  'Good.',
];

/**
 * **The care bank — spoken inside a `careful` topic, and quieter still.**
 *
 * Inherited from *Life Skills Thuto 4* unchanged (PRD §4.15, §8.3). A child
 * who has just tapped *"the person doing it"* in a question about whose fault
 * abuse is has not done something clever, and *"Got it."* is the wrong sound to
 * make at her. **The app acknowledges and moves on.**
 *
 * Nothing here praises, nothing here congratulates, and nothing here is
 * cheerful.
 */
export const carePraisePhrases = [
  'Yes.',
  'That is right.',
  'That is the one.',
  'Yes, that is it.',
];

/**
 * Spoken when the child gets something wrong. Never a scold, never a mark, and
 * never a count of how many they have missed (PRD §4.6).
 *
 * **Nobody fails.** A wrong tap replays the line the answer came from — never a
 * red X, never a score.
 */
export const encouragePhrases = [
  'Not that one. Try again.',
  'Close. Have another go.',
  'Try a different one.',
  'Not quite — go again.',
];

export function randomFrom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}
