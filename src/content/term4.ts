import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.purple;
const ATP_RANGES: Record<string, [number, number]> = {
  't4-listen-folktales': [1, 2],
  't4-read-folktales': [1, 2],
  't4-tell-folktales': [1, 2],
  't4-instructional-text': [3, 4],
  't4-poems': [5, 6],
  't4-revision': [7, 8],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, textType: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 4, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
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

const listenFolk = topic('t4-listen-folktales', 'Listening To A Folktale', '📖', 2, 'A folktale is a story passed down long ago. When you listen, follow who the characters are and how the tale moves from beginning to end.', 'folklore-listening', 'folklore', [['a', '📖', 'a folktale is a story passed down long ago', true], ['b', '🧾', 'a shopping list is a folktale', false]], [['👂', 'listen to the tale'], ['🐉', 'notice the characters'], ['💬', 'discuss the story']]);
const readFolk = topic('t4-read-folktales', 'Reading A Folktale', '🐉', 2, 'A folktale often has a hero, a challenge and a lesson. As you read, look for the setting and the order of events.', 'folklore-reading', 'folklore', [['a', '🐉', 'a folktale often has a hero and a lesson', true], ['b', '🍞', 'a folktale is always a recipe', false]], [['📖', 'read the tale'], ['🌄', 'find the setting'], ['🧭', 'follow the order of events']]);
const tellFolk = topic('t4-tell-folktales', 'Retelling A Folktale', '🗣️', 2, 'To retell a folktale, use a clear beginning, middle and ending, and say the events in your own words so others can follow.', 'folklore-retelling', 'folklore', [['a', '🗣️', 'a retelling needs a beginning, middle and ending', true], ['b', '➗', 'a retelling is a sum', false]], [['🟢', 'say the beginning'], ['🟡', 'retell the middle'], ['🔴', 'end and share the lesson']]);
const instructionalText = topic('t4-instructional-text', 'Reading Instructional Text', '📋', 2, 'An instructional text tells you how to do something, step by step. Look for the clear steps and the order they should happen in.', 't4-instructional-text', 'instructional', [['a', '📋', 'an instructional text gives steps in order', true], ['b', '🎬', 'an instructional text is a film', false]], [['📋', 'read the title'], ['🔢', 'follow the steps'], ['✅', 'do them in order']]);
const poems = topic('t4-poems', 'Reading Poems', '🎵', 2, 'A poem uses words to paint a picture or share a feeling. Notice the words that rhyme and the rhythm as you read.', 't4-poems', 'poem', [['a', '🎵', 'a poem uses words to share a feeling', true], ['b', '🪙', 'a poem is a coin', false]], [['📖', 'read the poem'], ['🎵', 'notice the rhythm'], ['💭', 'say what it makes you feel']]);
const revision = topic('t4-revision', 'Revision And Transactional Writing', '📝', 2, 'Transactional writing shares everyday messages like notes and letters. Give the main idea clearly and end with something polite.', 't4-transactional', 'transactional', [['a', '📝', 'transactional writing is for everyday messages', true], ['b', '🪨', 'transactional writing is a stone', false]], [['✍️', 'plan your message'], ['📝', 'write it clearly'], ['📮', 'share it politely']]);

const challenge = buildTopic({ id: 't4-star-challenge', term: 4, weeks: [9, 10], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 4 Star Challenge', emoji: '⭐', colour: C, parentNote: 'A friendly review of reading. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 4 Reading Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 4 Star Challenge', emoji: '⭐', kind: 'challenge', badge: termBadge(4, 'Term 4 Reading Star'), activities: [select('a1', 'Tap the folklore idea.', 'one', [['a', '🐉', 'a folktale often has a hero and a lesson', true], ['b', '🧾', 'a shopping list', false]]), listenChoose('a2', 'Choose the instructional idea.', [['q', 'What does an instructional text give?', [['a', '📋', 'clear steps in order'], ['b', '🧵', 'a loose piece of thread', 'An instructional text gives clear steps in order.']], 'a']]), select('a3', 'Tap the poem idea.', 'one', [['a', '🎵', 'poems use words to share a feeling', true], ['b', '🪨', 'poems are made of stone', false]]), sequence('a4', 'Build the transactional message.', [['a', '✍️', 'plan'], ['b', '📝', 'write'], ['c', '📮', 'share']]), select('a5', 'Tap the story idea.', 'one', [['a', '📖', 'a folktale is a story passed down long ago', true], ['b', '🙃', 'pretend you forgot the words', false]])] }] });

export const TERM_4 = collect([listenFolk, readFolk, tellFolk, instructionalText, poems, revision, challenge]);
