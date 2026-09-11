import { termBadge } from '@/domain/rewards';
import { colours } from '@/theme/tokens';
import { buildTopic, collect, listenChoose, practise, readText, select, sequence, sortBaskets } from './authoring';

const C = colours.amber;
const ATP_RANGES: Record<string, [number, number]> = {
  't1-living-things': [1, 3],
  't1-animal-skeletons': [4, 4],
  't1-skeleton-structures': [5, 6],
  't1-food-chains': [7, 8],
  't1-life-cycles': [9, 10],
};
const topic = (id: string, title: string, emoji: string, weeks: number, text: string, factRef: string, choices: [string, string, string, boolean][], order: [string, string][], kit: string[] = ['paper']) => buildTopic({
  id, term: 1, weeks: ATP_RANGES[id] ?? [1, Math.max(1, Math.ceil(weeks))], atpWeeks: weeks, area: 'LIF', atpHours: 0, requires: [], teaches: [], skills: ['observe', 'compare', 'communicate'], title, emoji,
  parentNote: `She is learning about ${title.toLowerCase()}. Ask her to explain one thing she noticed.`, badge: { emoji, title: `${title} Explorer` }, words: [], textTypes: ['information'], colour: C,
  lessons: [
    { id: 'meet', title: `Meet ${title}`, emoji, activities: [
      readText('a1', 'Read and listen.', { mode: 'app-first', textType: 'information', title, emoji, factRef, lines: [['l1', text], ['l2', 'Look closely, compare what you see and say the idea in your own words.'], ['l3', 'Science starts with careful observations.']] }),
      select('a2', 'Tap the true idea.', 'one', choices),
      sequence('a3', 'Put the science steps in order.', order.map(([e, l], i) => [`${i}`, e, l] as [string, string, string])),
      listenChoose('a4', 'Listen, then choose.', [['q', `What is the key idea about ${title.toLowerCase()}?`, [['a', emoji, title], ['b', '❓', 'something unrelated', 'That does not describe this topic.']], 'a']]),
    ] },
    { id: 'do', title: 'Look and do', emoji: '🔎', activities: [
      select('b1', 'Tap the best science action.', 'one', [['a', '👀', 'observe carefully', true], ['b', '🙈', 'guess without looking', false]]),
      sortBaskets('b2', 'Sort the examples.', [['yes', '✅', 'belongs here', colours.green], ['no', '❌', 'does not belong', colours.rose]], [['i1', emoji, title, 'yes'], ['i2', '🎲', 'a random object', 'no']]),
      readText('b3', 'Read the reminder.', { mode: 'app-first', textType: 'information', title: 'Science reminder', emoji: '💡', lines: [['l1', 'Record what you really see.'], ['l2', 'The app does not perform the investigation for you.']] }),
      practise('b4', 'Try the observation.', { space: 'standing', safety: 'Stay in a clear safe place and use only the materials listed.', kit, steps: [['s1', '👀', 'Observe one example.', 'Observe one example.'], ['s2', '📝', 'Record one detail.', 'Record one detail.'], ['s3', '💬', 'Tell somebody what you found.', 'Tell somebody what you found.']] }),
    ] },
  ],
});

const living = topic('t1-living-things', 'Living Things Around Us', '🌿', 2.5, 'A habitat is a place where a plant or animal lives. South Africa has many indigenous plants and animals.', 'living-habitats', [['a', '🌿', 'a habitat is where a living thing lives', true], ['b', '🎲', 'a habitat is a toy', false]], [['🌿', 'look at a habitat'], ['📝', 'record living things'], ['💬', 'communicate']]);
const skeletons = topic('t1-animal-skeletons', 'Animal Skeletons', '🦴', 1, 'A vertebrate has a backbone. The skull protects the brain and ribs help protect the heart and lungs.', 'skeleton-protection', [['a', '🦴', 'a vertebrate has a backbone', true], ['b', '🐚', 'every animal has a shell', false]], [['👀', 'observe a skeleton'], ['🏷️', 'label its parts']]);
const structures = topic('t1-skeleton-structures', 'Skeletons As Structures', '🏗️', 2, 'A skeleton is a frame structure inside a body. A crab shell is a shell structure outside its body.', 'structures-frames-shells', [['a', '🦴', 'a skeleton is a frame structure', true], ['b', '💧', 'a skeleton is a liquid', false]], [['📝', 'draw a plan'], ['🥤', 'join safe materials'], ['🔎', 'evaluate the frame']], ['straws', 'tape', 'paper']);
const chains = topic('t1-food-chains', 'Food Chains', '🌾', 1.5, 'Green plants make their own food using air, water and sunlight. Animals depend on plants in food chains.', 'food-chain-roles', [['a', '🌿', 'a food chain starts with a green plant', true], ['b', '🪨', 'a food chain starts with a rock', false]], [['🌿', 'start with a plant'], ['🐐', 'add a herbivore'], ['🦁', 'add a predator']]);
const cycles = topic('t1-life-cycles', 'Life Cycles', '🐸', 2, 'Plants and animals grow and change in stages. A life cycle can begin again when adults have young.', 'life-cycle-stages', [['a', '🔁', 'a life cycle shows growth and change', true], ['b', '📅', 'a life cycle is a calendar', false]], [['🥚', 'start with an egg or seed'], ['🐸', 'observe growth'], ['🔁', 'show the cycle']]);

const challenge = buildTopic({ id: 't1-star-challenge', term: 1, weeks: [10, 10], atpWeeks: 0, area: 'LIF', atpHours: 0, requires: [], teaches: [], skills: [], title: 'Term 1 Star Challenge', emoji: '⭐', colour: C, parentNote: 'A friendly review of Life and Living. Finishing earns three stars.', badge: { emoji: '⭐', title: 'Term 1 Science Star' }, words: [], textTypes: [], lessons: [{ id: 'challenge', title: 'Term 1 Star Challenge', emoji: '⭐', kind: 'challenge', badge: termBadge(1, 'Term 1 Science Star'), activities: [select('a1', 'Tap the vertebrate.', 'one', [['a', '🐟', 'fish', true], ['b', '🐌', 'snail', false]]), sequence('a2', 'Build the chain.', [['a', '🌿', 'plant'], ['b', '🐐', 'goat'], ['c', '🦁', 'lion']]), select('a3', 'Tap the first stage.', 'one', [['a', '🌰', 'seed', true], ['b', '🌻', 'flower', false]]), listenChoose('a4', 'Choose the habitat idea.', [['q', 'What is a habitat?', [['a', '🌿', 'a place where a living thing lives'], ['b', '🎒', 'a school bag', 'A habitat is a place where a living thing lives.']], 'a']]), select('a5', 'Tap the frame structure.', 'one', [['a', '🦴', 'skeleton', true], ['b', '💧', 'water', false]])] }] });

export const TERM_1 = collect([living, skeletons, structures, chains, cycles, challenge]);
