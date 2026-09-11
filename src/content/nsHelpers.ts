import { colours } from '@/theme/tokens';
import type { ContentArea, TermNumber } from '@/types';
import { buildTopic, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const ATP_RANGES: Record<string, [number, number]> = {
  't2-metals-non-metals': [1, 3],
  't2-what-metals-can-do': [4, 6],
  't2-making-new-materials': [7, 9],
  't2-materials-we-make': [9, 10],
  't3-energy-in-fuels': [1, 3],
  't3-energy-electricity': [4, 6],
  't3-stored-energy-movement': [7, 8],
  't4-earth-moves': [1, 2],
  't4-ground-beneath-us': [3, 4],
  't4-rocks-remember': [5, 6],
  't4-fossils': [7, 9],
};

export function scienceTopic(config: { id: string; term: TermNumber; area: ContentArea; title: string; emoji: string; atpWeeks: number; text: string; factRef: string; skills?: string[]; makeTask?: string; colour?: string; kit?: string[] }) {
  const colour = config.colour ?? colours.teal;
  const lessons = config.atpWeeks >= 2.5 ? 4 : config.atpWeeks >= 1.5 ? 3 : 2;
  const baseActivities = [
    readText('a1', 'Read and listen.', { mode: 'app-first', textType: 'information', title: config.title, emoji: config.emoji, factRef: config.factRef, lines: [['l1', config.text], ['l2', 'Observe, compare and explain what you notice.'], ['l3', 'Science uses evidence from the real world.']] }),
    select('a2', 'Tap the true idea.', 'one', [['a', config.emoji, config.title, true], ['b', '❓', 'an unrelated idea', false]]),
    sequence('a3', 'Put the investigation steps in order.', [['a', '👀', 'observe'], ['b', '📝', 'record'], ['c', '💬', 'communicate']]),
    listenChoose('a4', 'Listen, then choose.', [['q', `What are we learning about?`, [['a', config.emoji, config.title], ['b', '🎲', 'a game', 'This lesson is about the science topic.']], 'a']]),
  ];
  const doActivities = [
    sortBaskets('b1', 'Sort the examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', config.emoji, config.title, 'yes'], ['i2', '🎲', 'unrelated object', 'no']]),
    select('b2', 'Tap the careful action.', 'one', [['a', '👀', 'observe carefully', true], ['b', '🙈', 'pretend to see a result', false]]),
    readText('b3', 'Read the reminder.', { mode: 'app-first', textType: 'information', title: 'Keep investigating honestly', emoji: '💡', lines: [['l1', 'The app teaches the idea and shows the steps.'], ['l2', 'You observe and record the real result yourself.']] }),
    practise('b4', config.makeTask ? 'Make and evaluate.' : 'Try the observation.', { space: 'standing', safety: 'Work on a clear table and use only the materials listed.', kit: config.kit ?? ['paper'], steps: [['s1', '📝', 'Plan what you will do.', 'Plan what you will do.'], ['s2', config.emoji, config.makeTask ?? 'Observe one example.', config.makeTask ?? 'Observe one example.'], ['s3', '🔎', 'Record or evaluate what you noticed.', 'Record or evaluate what you noticed.']] }),
  ];
  const lessonList = Array.from({ length: lessons }, (_, index) => ({ id: `lesson-${index + 1}`, title: index === lessons - 1 ? 'Do it yourself' : index === 0 ? `Meet ${config.title}` : 'Look more closely', emoji: index === lessons - 1 ? '🛠️' : config.emoji, activities: index === 0 ? baseActivities : doActivities }));
  const weekRange = ATP_RANGES[config.id] ?? [1, Math.max(1, Math.ceil(config.atpWeeks))] as [number, number];
  return buildTopic({ id: config.id, term: config.term, weeks: weekRange, atpWeeks: config.atpWeeks, area: config.area, atpHours: 0, requires: [], teaches: [], skills: config.skills ?? ['observe', 'compare', 'communicate'], makeTask: config.makeTask, title: config.title, emoji: config.emoji, colour, parentNote: `She is learning about ${config.title.toLowerCase()}. Ask her to explain one observation.`, badge: { emoji: config.emoji, title: `${config.title} Explorer` }, words: [], textTypes: ['information'], lessons: lessonList });
}
