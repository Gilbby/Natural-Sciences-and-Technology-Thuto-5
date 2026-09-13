import { colours } from '@/theme/tokens';
import type { ContentArea, TermNumber, TextType } from '@/types';
import { buildTopic, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const ATP_RANGES: Record<string, [number, number]> = {
  't2-metals-non-metals': [1, 3],
  't2-what-metals-can-do': [4, 6],
  't2-making-new-materials': [7, 9],
  't2-materials-we-make': [9, 10],
  't3-read-fuels': [1, 3],
  't3-read-electricity': [4, 6],
  't3-read-movement': [7, 8],
  't4-read-earth-moves': [1, 2],
  't4-read-ground-beneath-us': [3, 4],
  't4-read-rocks-remember': [5, 6],
  't4-read-fossils': [7, 9],
};

export function falTopic(config: { id: string; term: TermNumber; area: ContentArea; title: string; emoji: string; atpWeeks: number; text: string; textType?: TextType; factRef: string; skills?: string[]; makeTask?: string; colour?: string; kit?: string[]; }) {
  const colour = config.colour ?? colours.teal;
  const lessons = config.atpWeeks >= 2.5 ? 4 : config.atpWeeks >= 1.5 ? 3 : 2;
  const textType: TextType = config.textType ?? 'information';
  const baseActivities = [
    readText('a1', 'Read and listen.', { mode: 'app-first', textType, title: config.title, emoji: config.emoji, factRef: config.factRef, lines: [['l1', config.text], ['l2', 'Read again, then retell the main idea in your own words.'], ['l3', 'Reading well helps you to speak, write and think.']] }),
    select('a2', 'Tap the correct idea.', 'one', [['a', config.emoji, config.title, true], ['b', '❓', 'an unrelated idea', false]]),
    sequence('a3', 'Put the reading steps in order.', [['a', '👀', 'look closely'], ['b', '📖', 'read carefully'], ['c', '💬', 'talk about it']]),
    listenChoose('a4', 'Listen, then choose.', [['q', `What are we learning about?`, [['a', config.emoji, config.title], ['b', '🎲', 'a game', 'This lesson is about the text you are reading.']], 'a']]),
  ];
  const doActivities = [
    sortBaskets('b1', 'Sort the examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', config.emoji, config.title, 'yes'], ['i2', '🎲', 'unrelated object', 'no']]),
    select('b2', 'Tap what a good reader does.', 'one', [['a', '👀', 'read carefully', true], ['b', '🙈', 'guess instead of reading', false]]),
    readText('b3', 'Read the reminder.', { mode: 'app-first', textType: 'information', title: 'Keep practising your reading', emoji: '💡', lines: [['l1', 'The app teaches the text and shows the steps.'], ['l2', 'You read, speak and write the ideas yourself.']] }),
    practise('b4', config.makeTask ? 'Make and speak.' : 'Try the reading task.', { space: 'standing', safety: 'Find a quiet, clear space and read the text aloud.', kit: config.kit ?? ['text'], steps: [['s1', '📝', 'Plan what you will do.', 'Plan what you will do.'], ['s2', config.emoji, config.makeTask ?? 'Read one example aloud.', config.makeTask ?? 'Read one example aloud.'], ['s3', '🔎', 'Say or write what you noticed.', 'Say or write what you noticed.']] }),
  ];
  const lessonList = Array.from({ length: lessons }, (_, index) => ({ id: `lesson-${index + 1}`, title: index === lessons - 1 ? 'Do it yourself' : index === 0 ? `Meet ${config.title}` : 'Look more closely', emoji: index === lessons - 1 ? '🛠️' : config.emoji, activities: index === 0 ? baseActivities : doActivities }));
  const weekRange = ATP_RANGES[config.id] ?? [1, Math.max(1, Math.ceil(config.atpWeeks))] as [number, number];
  return buildTopic({ id: config.id, term: config.term, weeks: weekRange, atpWeeks: config.atpWeeks, area: config.area, atpHours: 0, requires: [], teaches: [], skills: config.skills ?? ['read', 'speak', 'write'], makeTask: config.makeTask, title: config.title, emoji: config.emoji, colour, parentNote: `She is learning about ${config.title.toLowerCase()}. Ask her to retell or explain one part in her own words.`, badge: { emoji: config.emoji, title: `${config.title} Reader` }, words: [], textTypes: [textType], lessons: lessonList });
}

export const englishTopic = falTopic;
