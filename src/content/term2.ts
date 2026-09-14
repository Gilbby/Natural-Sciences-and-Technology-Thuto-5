import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.teal;
const ATP_RANGES: Record<string, [number, number]> = {
  't2-read-instructions': [1, 2],
  't2-read-story': [3, 4],
  't2-read-poem': [5, 6],
  't2-read-info-text': [7, 8],
  't2-prepare-test': [9, 10],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, textType: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 2, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
  parentNote: `She is learning about ${title.toLowerCase()} in reading. Ask her to tell you the story in her own words.`, badge: { emoji, title: `${title} Star` }, words: [], textTypes: [textType], colour: C,
  lessons: [
    { id: 'meet', title: `Meet ${title}`, emoji, activities: [
      readText('a1', 'Read and listen.', { mode: 'app-first', textType, title, emoji, factRef, lines: [['l1', text], ['l2', 'A text tells a story and shares ideas. Read to find what really happened.'], ['l3', 'Read the text and picture the scene in your mind.']] }),
      select('a2', 'Tap the true idea.', 'one', choices),
      sequence('a3', 'Put the reading steps in order.', order.map(([e, l], i) => [`${i}`, e, l] as [string, string, string])),
      listenChoose('a4', 'Listen, then choose.', [['q', `What is the key idea about ${title.toLowerCase()}?`, [['a', emoji, title], ['b', '❓', 'something unrelated', 'That does not describe this topic.']], 'a']]),
    ] },
    { id: 'do', title: 'Look and do', emoji: '🔎', activities: [
      select('b1', 'Tap the best speaking action.', 'one', [['a', '🗣️', 'speak clearly and with feeling', true], ['b', '😶', 'mumble and hide', false]]),
      sortBaskets('b2', 'Sort the reading examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', emoji, 'a story passage', 'yes'], ['i2', '🎲', 'a shopping list', 'no']]),
      readText('b3', 'Read the reminder.', { mode: 'app-first', textType, title: 'Reading reminder', emoji: '💡', lines: [['l1', 'Read the text and record what you find.'], ['l2', 'Look for what the text tells you about this topic.']] }),
      practise('b4', 'Try the performance.', { space: 'standing', safety: 'Stay in a clear safe place and speak clearly.', kit, steps: [['s1', '🗣️', 'Read one line aloud with feeling.', 'Read one line aloud with feeling.'], ['s2', '🎭', 'Add a simple action.', 'Add a simple action.'], ['s3', '👂', 'Ask somebody what they heard.', 'Ask somebody what they heard.']] }),
    ] },
  ],
});

const instructions = topic('t2-read-instructions', 'Reading Instructional Texts', '📋', 2, 'An instructional text tells you how to do something step by step. Follow the steps in order to reach the end result.', 'instructional-text', 'instructional', [['a', '📋', 'an instructional text gives steps in order', true], ['b', '🎭', 'an instructional text is a stage play', false]], [['📖', 'read the heading'], ['🔢', 'follow the steps in order'], ['🏁', 'do the task']]);
const story = topic('t2-read-story', 'Reading A Story', '📖', 2, 'A story has characters, a setting and a plot. Read to find what happens to the characters from start to finish.', 'story-elements', 'story', [['a', '📖', 'a story has characters, a setting and a plot', true], ['b', '🍞', 'a story is a loaf of bread', false]], [['📖', 'meet the characters'], ['🗺️', 'find the setting'], ['📚', 'follow what happens']]);
const poem = topic('t2-read-poem', 'Reading A Poem', '🎵', 2, 'A poem uses words to make pictures and can have rhythm or rhyme. Read the words and feel the way they sound.', 'poem-words', 'poem', [['a', '🎵', 'a poem uses words to make pictures', true], ['b', '🔢', 'a poem is a sum', false]], [['🎵', 'read the words'], ['👂', 'hear the rhythm'], ['💭', 'picture the scene']]);
const infoText = topic('t2-read-info-text', 'Reading Information Texts', '🌦️', 2, 'An information text shares facts and details, like a weather report telling what the day will be like.', 'info-text-facts', 'information', [['a', '🌦️', 'an information text shares facts', true], ['b', '🧵', 'an information text is thread', false]], [['🗞️', 'read the heading'], ['📊', 'find the facts'], ['💬', 'share what you learned']]);

const revise = topic('t2-prepare-test', 'Revising All The Texts', '📝', 2, 'Revising helps you remember. Look back at instructions, stories, poems and information texts to get ready for the test.', 'term-2-revision', 'story', [['a', '📝', 'revision helps you remember the texts', true], ['b', '🎭', 'revision is a stage play', false]], [['📚', 'recap each text type'], ['💭', 'remember the key ideas'], ['✅', 'get ready for the test']], ['paper']);

const challenge = buildTopic({ id: 't2-star-challenge', term: 2, weeks: [10, 10], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 2 Star Challenge', emoji: '⭐', colour: C, parentNote: 'A friendly review of reading. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 2 Reading Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 2 Star Challenge', emoji: '⭐', kind: 'challenge', badge: termBadge(2, 'Term 2 Reading Star'), activities: [select('a1', 'Tap the instructional idea.', 'one', [['a', '📋', 'follow steps in order', true], ['b', '🎲', 'skip any step', false]]), select('a2', 'Tap the story idea.', 'one', [['a', '📖', 'read what happens to characters', true], ['b', '🪨', 'a story is a stone', false]]), listenChoose('a3', 'Choose the poem idea.', [['q', 'What does a poem use words to do?', [['a', '🎵', 'make pictures'], ['b', '🧵', 'hold a button', 'A poem uses words to make pictures.']], 'a']]), sequence('a4', 'Build a weather report.', [['a', '🗞️', 'heading'], ['b', '📊', 'facts'], ['c', '💬', 'share']]), select('a5', 'Tap the information idea.', 'one', [['a', '🌦️', 'shares facts and details', true], ['b', '🙃', 'hides all the facts', false]])] }] });

export const TERM_2 = collect([instructions, story, poem, infoText, revise, challenge]);
