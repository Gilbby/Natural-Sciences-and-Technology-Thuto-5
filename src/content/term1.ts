import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.amber;
const ATP_RANGES: Record<string, [number, number]> = {
  't1-read-newspaper': [1, 2],
  't1-read-novel': [3, 4],
  't1-persuasive': [5, 6],
  't1-short-story': [7, 8],
  't1-dialogue': [9, 10],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, textType: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 1, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
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

const newspaper = topic('t1-read-newspaper', 'Reading Newspaper Articles', '📰', 2, 'A newspaper article tells about something that happened. The headline gives the main idea in a short line.', 'newspaper-article', 'informational/report', [['a', '📰', 'a headline gives the main idea', true], ['b', '🎭', 'a headline is a stage play', false]], [['📰', 'read the headline'], ['📖', 'read the article'], ['💬', 'tell what happened']]);
const novel = topic('t1-read-novel', 'Reading A Novel', '📖', 2, 'A novel is a long story about characters. Read from the beginning and follow the characters as the story grows.', 'novel-chapters', 'story', [['a', '📖', 'a novel is a long story', true], ['b', '🍞', 'a novel is a loaf of bread', false]], [['📖', 'read the beginning'], ['🧍🏽', 'meet the characters'], ['📚', 'follow the story']]);
const persuasive = topic('t1-persuasive', 'Reading Persuasive Texts', '📢', 2, 'A persuasive text tries to make you agree. It gives a clear opinion and reasons to support it.', 'persuasive-text', 'persuasive', [['a', '📢', 'a persuasive text gives an opinion and reasons', true], ['b', '🔢', 'a persuasive text is a sum', false]], [['📢', 'find the opinion'], ['🧾', 'find the reasons'], ['💭', 'decide if you agree']]);
const shortStory = topic('t1-short-story', 'Reading A Short Story', '📚', 2, 'A short story has a beginning, a middle and an end. Follow the characters and find what happens at the end.', 'short-story-parts', 'story', [['a', '📚', 'a short story has a beginning, middle and end', true], ['b', '🪙', 'a short story is a coin', false]], [['📚', 'read the beginning'], ['🔄', 'follow the middle'], ['🏁', 'find the ending']]);
const dialogue = topic('t1-dialogue', 'Reading Dialogue', '💬', 2, 'Dialogue is the words characters say to each other. Notice who is speaking before each line.', 'dialogue-talking', 'dialogue/play', [['a', '💬', 'dialogue is the words characters say', true], ['b', '🗺️', 'dialogue is a road map', false]], [['👂', 'notice who speaks'], ['💬', 'read each line'], ['💭', 'imagine the talk']]);

const challenge = buildTopic({ id: 't1-star-challenge', term: 1, weeks: [10, 10], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 1 Star Challenge', emoji: '⭐', colour: C, parentNote: 'A friendly review of reading. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 1 Reading Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 1 Star Challenge', emoji: '⭐', kind: 'challenge', badge: termBadge(1, 'Term 1 Reading Star'), activities: [select('a1', 'Tap the headline idea.', 'one', [['a', '📰', 'a headline gives the main idea', true], ['b', '🎲', 'a headline keeps secrets', false]]), select('a2', 'Tap the novel idea.', 'one', [['a', '📖', 'a novel is a long story', true], ['b', '🪨', 'a novel is a stone', false]]), listenChoose('a3', 'Choose the persuasive idea.', [['q', 'What does a persuasive text give?', [['a', '📢', 'an opinion with reasons'], ['b', '🧵', 'a loose piece of thread', 'A persuasive text gives an opinion with reasons.']], 'a']]), sequence('a4', 'Build the short story.', [['a', '📚', 'beginning'], ['b', '🔄', 'middle'], ['c', '🏁', 'ending']]), select('a5', 'Tap the dialogue idea.', 'one', [['a', '💬', 'notice who is speaking', true], ['b', '🙃', 'ignore all the words', false]])] }] });

export const TERM_1 = collect([newspaper, novel, persuasive, shortStory, dialogue, challenge]);
