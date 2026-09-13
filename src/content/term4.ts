import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.purple;
const ATP_RANGES: Record<string, [number, number]> = {
  't4-listen-folktales': [7, 8],
  't4-read-folktales': [7, 8],
  't4-tell-folktales': [7, 8],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 4, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
  parentNote: `She is learning about ${title.toLowerCase()} in folklore. Ask her to tell you the story in her own words.`, badge: { emoji, title: `${title} Star` }, words: [], textTypes: ['folklore'], colour: C,
  lessons: [
    { id: 'meet', title: `Meet ${title}`, emoji, activities: [
      readText('a1', 'Read and listen.', { mode: 'app-first', textType: 'folklore', title, emoji, factRef, lines: [['l1', text], ['l2', 'A folktale is a story passed down long ago, often about clever or brave characters.'], ['l3', 'Read the tale and picture the setting and the characters in your mind.']] }),
      select('a2', 'Tap the true idea.', 'one', choices),
      sequence('a3', 'Put the story steps in order.', order.map(([e, l], i) => [`${i}`, e, l] as [string, string, string])),
      listenChoose('a4', 'Listen, then choose.', [['q', `What is the key idea about ${title.toLowerCase()}?`, [['a', emoji, title], ['b', '❓', 'something unrelated', 'That does not describe this topic.']], 'a']]),
    ] },
    { id: 'do', title: 'Look and do', emoji: '🔎', activities: [
      select('b1', 'Tap the best telling action.', 'one', [['a', '🗣️', 'speak clearly and retell the tale in your own words', true], ['b', '😶', 'mumble and keep the ending secret', false]]),
      sortBaskets('b2', 'Sort the folklore examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', emoji, 'a story told from long ago', 'yes'], ['i2', '🧾', 'a shopping receipt', 'no']]),
      readText('b3', 'Read the reminder.', { mode: 'app-first', textType: 'folklore', title: 'Folklore reminder', emoji: '💡', lines: [['l1', 'A folktale has a beginning, a middle and an ending.'], ['l2', 'Retell it in your own words so others can follow the story.']] }),
      practise('b4', 'Try the storytelling.', { space: 'standing', safety: 'Stay in a clear safe place and speak clearly.', kit, steps: [['s1', '📖', 'Say the beginning and name the characters.', 'Say the beginning and name the characters.'], ['s2', '🗣️', 'Retell the middle of the tale.', 'Retell the middle of the tale.'], ['s3', '👂', 'Tell the ending to somebody and ask what they liked.', 'Tell the ending to somebody and ask what they liked.']] }),
    ] },
  ],
});

const listenFolk = topic('t4-listen-folktales', 'Listening To A Folktale', '📖', 2, 'A folktale is a story passed down long ago. When you listen, follow who the characters are and how the tale moves from beginning to end.', 'folklore-listening', [['a', '📖', 'a folktale is a story passed down long ago', true], ['b', '🧾', 'a shopping list is a folktale', false]], [['👂', 'listen to the tale'], ['🐉', 'notice the characters'], ['💬', 'discuss the story']]);
const readFolk = topic('t4-read-folktales', 'Reading A Folktale', '🐉', 2, 'A folktale often has a hero, a challenge and a lesson. As you read, look for the setting and the order of events.', 'folklore-reading', [['a', '🐉', 'a folktale often has a hero and a lesson', true], ['b', '🍞', 'a folktale is always a recipe', false]], [['📖', 'read the tale'], ['🌄', 'find the setting'], ['🧭', 'follow the order of events']]);
const tellFolk = topic('t4-tell-folktales', 'Retelling A Folktale', '🗣️', 2, 'To retell a folktale, use a clear beginning, middle and ending, and say the events in your own words so others can follow.', 'folklore-retelling', [['a', '🗣️', 'a retelling needs a beginning, middle and ending', true], ['b', '➗', 'a retelling is a sum', false]], [['🟢', 'say the beginning'], ['🟡', 'retell the middle'], ['🔴', 'end and share the lesson']]);
const challenge = buildTopic({ id: 't4-star-challenge', term: 4, weeks: [9, 9], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 4 Folklore Star', emoji: '⭐', colour: C, parentNote: 'A friendly review of folklore. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 4 Folklore Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 4 Folklore Star', emoji: '⭐', kind: 'challenge', badge: termBadge(4, 'Term 4 Folklore Star'), activities: [select('a1', 'Tap the folklore idea.', 'one', [['a', '📖', 'a story passed down long ago', true], ['b', '🧾', 'a shopping list', false]]), listenChoose('a2', 'Choose the parts of a retelling.', [['q', 'What does a good retelling have?', [['a', '🔁', 'a beginning, middle and ending'], ['b', '🧵', 'a loose piece of thread', 'A retelling has a beginning, middle and ending.']], 'a']]), select('a3', 'Tap the hero idea.', 'one', [['a', '🐉', 'a folktale often has a hero and a lesson', true], ['b', '🔌', 'always a hidden switch', false]]), select('a4', 'Tap the listening idea.', 'one', [['a', '👂', 'follow the characters as the tale moves', true], ['b', '🫗', 'still water in a cup', false]]), select('a5', 'Tap the honest telling idea.', 'one', [['a', '🗣️', 'retell the tale in your own words', true], ['b', '🙃', 'pretend you forgot the ending', false]])] }] });
export const TERM_4 = collect([listenFolk, readFolk, tellFolk, challenge]);
