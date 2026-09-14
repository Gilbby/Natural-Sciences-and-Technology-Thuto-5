import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.clay;
const ATP_RANGES: Record<string, [number, number]> = {
  't3-folklore': [1, 2],
  't3-cwp-research': [3, 4],
  't3-cwp-writing': [5, 6],
  't3-listen-drama': [7, 8],
  't3-read-reviews': [7, 8],
  't3-write-dialogue': [7, 8],
  't3-cartoons': [9, 10],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, textType: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 3, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: ['listen', 'speak', 'communicate'], title, emoji,
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

const folklore = topic('t3-folklore', 'Reading A Folk Tale', '🐉', 2, 'A folk tale is a story passed down long ago, often with a clever hero and a lesson. As you read, look for the setting and the order of events.', 't3-folklore', 'folklore', [['a', '🐉', 'a folk tale has a hero and a lesson', true], ['b', '🧾', 'a shopping receipt is a folk tale', false]], [['📖', 'read the tale'], ['🌄', 'find the setting'], ['🧭', 'follow the order of events']]);
const cwpResearch = topic('t3-cwp-research', 'Creative Writing Project: Researching', '🔎', 2, 'Before you write, research your topic. Gather clear facts and ideas that you can use for your writing.', 't3-cwp-research', 'informational/report', [['a', '🔎', 'research gathers facts before you write', true], ['b', '🎲', 'research skips all the facts', false]], [['🔎', 'choose your topic'], ['📚', 'gather clear facts'], ['📝', 'note what you found']]);
const cwpWriting = topic('t3-cwp-writing', 'Creative Writing Project: Writing', '✍️', 2, 'Now use your research to write. Put the ideas and facts into a clear, ordered piece of writing.', 't3-cwp-writing', 'transactional', [['a', '✍️', 'writing turns your research into ordered ideas', true], ['b', '🪨', 'writing leaves your ideas out', false]], [['✍️', 'plan the order'], ['📝', 'write your ideas'], ['🔍', 'check and improve']]);
const listenDrama = topic('t3-listen-drama', 'Listening To A Drama', '🎭', 2, 'A drama is a story told on stage. When you listen, follow what each character says and how the story moves from beginning to end.', 'drama-listening', 'dialogue/play', [['a', '🎭', 'a character speaks lines in a drama', true], ['b', '📰', 'a newspaper headline is a drama', false]], [['👂', 'listen to the drama'], ['🎭', 'notice each character'], ['💬', 'discuss the story']]);
const readReviews = topic('t3-read-reviews', 'Reading Play Reviews', '🎟️', 2, 'A review is when someone shares what they thought of a play. A good review says what happened and gives a reason.', 'drama-review', 'dialogue/play', [['a', '🎟️', 'a review tells what someone thought of a play', true], ['b', '🍞', 'a review is a recipe for bread', false]], [['📖', 'read the review'], ['⭐', 'find the opinion'], ['🧾', 'find a reason']]);
const writeDialogue = topic('t3-write-dialogue', 'Writing A Short Play Script', '📜', 2, 'A script tells actors what to say. Write the character name, then a colon, then the line they speak.', 'drama-script', 'dialogue/play', [['a', '📜', 'a script names the character before their line', true], ['b', '📞', 'a script is a telephone call', false]], [['✍️', 'choose a character'], ['📜', 'write a line after a colon'], ['🎭', 'rehearse and improve']]);
const cartoons = topic('t3-cartoons', 'Reading Cartoons And Comic Strips', '💬', 2, 'A comic strip tells a story in frames with speech bubbles. Read the frames in order to follow what the characters say and do.', 't3-cartoons', 'comic/art', [['a', '💬', 'a comic strip tells a story in frames with speech bubbles', true], ['b', '🪙', 'a comic strip is a coin', false]], [['🖼️', 'read the first frame'], ['💬', 'follow the speech bubbles'], ['🏁', 'find the ending frame']]);
const challenge = buildTopic({ id: 't3-star-challenge', term: 3, weeks: [10, 10], atpWeeks: 0, area: 'FAL', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 3 Star Challenge', emoji: '⭐', colour: C, parentNote: 'A friendly review of reading. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 3 Reading Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 3 Star Challenge', emoji: '⭐', kind: 'challenge', badge: termBadge(3, 'Term 3 Reading Star'), activities: [select('a1', 'Tap the folk tale idea.', 'one', [['a', '🐉', 'a folk tale has a hero and a lesson', true], ['b', '🗺️', 'a road map is a folk tale', false]]), listenChoose('a2', 'Choose the research idea.', [['q', 'What do you do before you write?', [['a', '🔎', 'research to gather clear facts'], ['b', '🧵', 'a loose piece of thread', 'Researching gathers clear facts before you write.']], 'a']]), select('a3', 'Tap the drama idea.', 'one', [['a', '🎭', 'characters speak lines in a drama', true], ['b', '🪨', 'ordinary stone', false]]), select('a4', 'Tap the comic idea.', 'one', [['a', '💬', 'read the frames in order and follow the speech bubbles', true], ['b', '🫗', 'still water in a cup', false]]), select('a5', 'Tap the speaking idea.', 'one', [['a', '🗣️', 'speak your line clearly', true], ['b', '🙃', 'pretend you forgot your line', false]])] }] });
export const TERM_3 = collect([folklore, cwpResearch, cwpWriting, listenDrama, readReviews, writeDialogue, cartoons, challenge]);
