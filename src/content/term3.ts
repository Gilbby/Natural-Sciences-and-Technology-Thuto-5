import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.clay;
const ATP_RANGES: Record<string, [number, number]> = {
  't3-listen-drama': [7, 8],
  't3-read-reviews': [7, 8],
  't3-write-dialogue': [7, 8],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 3, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
  parentNote: `She is learning about ${title.toLowerCase()} in drama. Ask her to tell you the story in her own words.`, badge: { emoji, title: `${title} Star` }, words: [], textTypes: ['dialogue/play'], colour: C,
  lessons: [
    { id: 'meet', title: `Meet ${title}`, emoji, activities: [
      readText('a1', 'Read and listen.', { mode: 'app-first', textType: 'dialogue/play', title, emoji, factRef, lines: [['l1', text], ['l2', 'A drama tells a story through what characters say and do.'], ['l3', 'Read the dialogue and picture the scene in your mind.']] }),
      select('a2', 'Tap the true idea.', 'one', choices),
      sequence('a3', 'Put the drama steps in order.', order.map(([e, l], i) => [`${i}`, e, l] as [string, string, string])),
      listenChoose('a4', 'Listen, then choose.', [['q', `What is the key idea about ${title.toLowerCase()}?`, [['a', emoji, title], ['b', '❓', 'something unrelated', 'That does not describe this topic.']], 'a']]),
    ] },
    { id: 'do', title: 'Look and do', emoji: '🔎', activities: [
      select('b1', 'Tap the best speaking action.', 'one', [['a', '🗣️', 'speak clearly and with feeling', true], ['b', '😶', 'mumble and hide', false]]),
      sortBaskets('b2', 'Sort the drama examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', emoji, 'a play script', 'yes'], ['i2', '🎲', 'a shopping list', 'no']]),
      readText('b3', 'Read the reminder.', { mode: 'app-first', textType: 'dialogue/play', title: 'Drama reminder', emoji: '💡', lines: [['l1', 'A script names the character before each line.'], ['l2', 'Show feeling through the words, not just the actions.']] }),
      practise('b4', 'Try the performance.', { space: 'standing', safety: 'Stay in a clear safe place and speak clearly.', kit, steps: [['s1', '🗣️', 'Read one line aloud with feeling.', 'Read one line aloud with feeling.'], ['s2', '🎭', 'Add a simple action.', 'Add a simple action.'], ['s3', '👂', 'Ask somebody what they heard.', 'Ask somebody what they heard.']] }),
    ] },
  ],
});

const listenDrama = topic('t3-listen-drama', 'Listening To A Drama', '🎭', 2, 'A drama is a story told on stage. When you listen, follow what each character says and how the story moves from beginning to end.', 'drama-listening', [['a', '🎭', 'a character speaks lines in a drama', true], ['b', '📰', 'a newspaper headline is a drama', false]], [['👂', 'listen to the drama'], ['🎭', 'notice each character'], ['💬', 'discuss the story']]);
const readReviews = topic('t3-read-reviews', 'Reading Play Reviews', '🎟️', 2, 'A review is when someone shares what they thought of a play. A good review says what happened and gives a reason.', 'drama-review', [['a', '🎟️', 'a review tells what someone thought of a play', true], ['b', '🍞', 'a review is a recipe for bread', false]], [['📖', 'read the review'], ['⭐', 'find the opinion'], ['🧾', 'find a reason']]);
const writeDialogue = topic('t3-write-dialogue', 'Writing A Short Play Script', '📜', 2, 'A script tells actors what to say. Write the character name, then a colon, then the line they speak.', 'drama-script', [['a', '📜', 'a script names the character before their line', true], ['b', '📞', 'a script is a telephone call', false]], [['✍️', 'choose a character'], ['📜', 'write a line after a colon'], ['🎭', 'rehearse and improve']]);
const challenge = buildTopic({ id: 't3-star-challenge', term: 3, weeks: [9, 9], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 3 Drama Star', emoji: '⭐', colour: C, parentNote: 'A friendly review of drama. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 3 Drama Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 3 Drama Star', emoji: '⭐', kind: 'challenge', badge: termBadge(3, 'Term 3 Drama Star'), activities: [select('a1', 'Tap the drama idea.', 'one', [['a', '🎭', 'characters speak lines', true], ['b', '🪨', 'ordinary stone', false]]), listenChoose('a2', 'Choose the review idea.', [['q', 'What does a play review share?', [['a', '⭐', 'an opinion with a reason'], ['b', '🧵', 'a loose piece of thread', 'A review shares an opinion with a reason.']], 'a']]), select('a3', 'Tap the script rule.', 'one', [['a', '📜', 'name the character, then a colon, then the line', true], ['b', '🔌', 'write the ending first, always', false]]), select('a4', 'Tap the listening idea.', 'one', [['a', '👂', 'follow each character as the story moves', true], ['b', '🫗', 'still water in a cup', false]]), select('a5', 'Tap the honest drama idea.', 'one', [['a', '🗣️', 'speak your line clearly', true], ['b', '🙃', 'pretend you forgot your line', false]])] }] });
export const TERM_3 = collect([listenDrama, readReviews, writeDialogue, challenge]);
