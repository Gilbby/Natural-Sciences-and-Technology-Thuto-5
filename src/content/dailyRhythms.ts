import { cycleOrdinal } from '@/content/ladder';
import { resolveSchoolYear, termOn, weekNumberOn } from '@/domain/schoolYear';
import { colours } from '@/theme/tokens';
import type { Activity, DailyRhythm, TermNumber } from '@/types';

import { listenChoose, placeValue, select, spellWord, txt } from './authoring';

/**
 * The daily rhythms — PRD §6.6, §18.2.
 *
 * ── This is the first ATP in the family with no repeated daily row ────────
 *
 * Life Skills printed *"Basic hygiene principles"* in every block; English FAL
 * printed the reading log in every cycle. **This ATP prints nothing daily** —
 * its rows are `TOPICS, CONCEPTS AND SKILLS`, `PREREQUISITE SKILL OR
 * PRE-KNOWLEDGE` and `HOURS PER TOPIC`, and that is all.
 *
 * > **So these three come from CAPS's own daily mental-mathematics
 * > requirement, not from this document, and this comment says so out loud**
 * > rather than implying the ATP asked for them (PRD §18.1 finding 3). The
 * > habit of writing *"this is the ATP's own row"* is only worth having if it
 * > is false when it is false.
 *
 *   🔢 **Number of the Day** — one number, built with `place-value` and named
 *      with `spell-word`. Never typed (PRD §18.2).
 *   🧠 **Ten In Your Head** — ten calculations from the term's number range.
 *      **No clock.**
 *   📏 **Look And Guess** — estimate, then find out. Being close is not scored.
 *
 * ── The mark fields are inherited unchanged (PRD §10) ─────────────────────
 *
 * `DailyRecord` keeps `wordAdded`, `movedToday`, `washDone` from the Life
 * Skills lineage — the progress model is inherited unchanged — so the three
 * rhythms reuse those three flags. The names are internal and never reach the
 * child; Number of the Day writes the day's number through the `wordAdded`
 * path, exactly as the word wall wrote a word.
 *
 * ── One PRD contradiction, resolved here in writing (PRD §16.6 finding 2) ──
 *
 * §18.2 gives Ten In Your Head the prompt *"There is no hurry and nothing is
 * counting."* But §11 check 5 bans the token **hurry** from every string in the
 * app. Both cannot hold. **Resolved in favour of the token ban**, because that
 * is the harder guarantee and the one a later contributor is most likely to
 * erode: the prompt keeps the meaning without the word — *"Take all the time
 * you like. Nothing is counting."*
 */

/* ------------------------------------------------------------ the numbers */

/** A place-value column set for a six-digit number. */
const SIX = ['hundred thousands', 'ten thousands', 'thousands', 'hundreds', 'tens', 'ones'] as const;

/** `[digits, said]` for a number-of-the-day. */
function numberDay(id: string, value: number, columns: number, say: string): Activity[] {
  const cols = SIX.slice(SIX.length - columns);
  const target = cols.map((column) => {
    const worth =
      column === 'hundred thousands' ? 100000 :
      column === 'ten thousands' ? 10000 :
      column === 'thousands' ? 1000 :
      column === 'hundreds' ? 100 :
      column === 'tens' ? 10 : 1;
    return Math.floor(value / worth) % 10;
  });
  return [
    placeValue(`${id}-build`, 'Build the number of the day.', {
      mode: 'build',
      start: value,
      columns: [...cols],
      target,
      say,
    }),
  ];
}

const numberOfDay: DailyRhythm = {
  _id: 'number-of-day',
  title: txt('Science Word of the Day'),
  subtitle: txt('Hear a science word and say what it means.'),
  emoji: '🔬',
  colour: colours.primary,
  // Reuses the inherited `wordAdded` flag; the day's number is the "word".
  marks: 'wordAdded',
  required: true,
  variants: [
    [
      ...numberDay('n1', 4271, 4, 'four thousand, two hundred and seventy-one'),
      spellWord('n1-name', 'Build the word for one thousand.', {
        word: 'thousand',
        say: 'thousand',
        sentence: 'A thousand is ten hundreds.',
        emoji: '🔢',
        pattern: 'number words',
        tiles: [
          ['thou', 'thou', 'thow'],
          ['sand', 'sand', 'sand'],
          ['hun', 'hun', 'hun'],
          ['dred', 'dred', 'dred'],
        ],
      }),
    ],
    numberDay('n2', 60418, 5, 'sixty thousand, four hundred and eighteen'),
    numberDay('n3', 342706, 6, 'three hundred and forty-two thousand, seven hundred and six'),
  ],
};

/* ------------------------------------------------------------ mental maths */

const tenInYourHead: DailyRhythm = {
  _id: 'ten-in-your-head',
  title: txt('Ten In Your Head'),
  subtitle: txt('Ten little sums. Take all the time you like.'),
  emoji: '🧠',
  colour: colours.blue,
  marks: 'movedToday',
  required: false,
  variants: [
    [
      listenChoose('h1', 'Take all the time you like. Nothing is counting.', [
        ['h1a', 'What is 7 plus 8?', [['a', '🔢', '15'], ['b', '🔢', '13'], ['c', '🔢', '16']], 'a'],
        ['h1b', 'What is 40 plus 30?', [['a', '🔢', '70'], ['b', '🔢', '60'], ['c', '🔢', '80']], 'a'],
        ['h1c', 'What is double 25?', [['a', '🔢', '50'], ['b', '🔢', '45'], ['c', '🔢', '52']], 'a'],
        ['h1d', 'What is half of 18?', [['a', '🔢', '9'], ['b', '🔢', '8'], ['c', '🔢', '10']], 'a'],
      ]),
    ],
    [
      listenChoose('h2', 'Take all the time you like. Nothing is counting.', [
        ['h2a', 'What is 6 times 4?', [['a', '🔢', '24'], ['b', '🔢', '20'], ['c', '🔢', '28']], 'a'],
        ['h2b', 'What is 100 take away 40?', [['a', '🔢', '60'], ['b', '🔢', '70'], ['c', '🔢', '50']], 'a'],
        ['h2c', 'What is 9 times 3?', [['a', '🔢', '27'], ['b', '🔢', '24'], ['c', '🔢', '30']], 'a'],
        ['h2d', 'What is 8 times 5?', [['a', '🔢', '40'], ['b', '🔢', '35'], ['c', '🔢', '45']], 'a'],
      ]),
    ],
    [
      listenChoose('h3', 'Take all the time you like. Nothing is counting.', [
        ['h3a', 'What is 250 plus 250?', [['a', '🔢', '500'], ['b', '🔢', '400'], ['c', '🔢', '550']], 'a'],
        ['h3b', 'What is 12 times 10?', [['a', '🔢', '120'], ['b', '🔢', '112'], ['c', '🔢', '1200']], 'a'],
        ['h3c', 'What is 1000 take away 1?', [['a', '🔢', '999'], ['b', '🔢', '990'], ['c', '🔢', '909']], 'a'],
        ['h3d', 'What is 7 times 6?', [['a', '🔢', '42'], ['b', '🔢', '48'], ['c', '🔢', '36']], 'a'],
      ]),
    ],
  ],
};

/* ------------------------------------------------------------ estimation */

const lookAndGuess: DailyRhythm = {
  _id: 'look-and-guess',
  title: txt('Look And Guess'),
  subtitle: txt('Guess first. Then find out. Being close is plenty.'),
  emoji: '📏',
  colour: colours.amber,
  marks: 'washDone',
  required: false,
  variants: [
    [
      listenChoose('g1', 'Guess first, then find out. There is no wrong guess.', [
        ['g1a', 'About how long is your hand?', [
          ['a', '📏', 'about 15 cm'],
          ['b', '📏', 'about 1 m'],
          ['c', '📏', 'about 1 mm'],
        ], 'a'],
      ]),
      select('g1s', 'Now find something else to guess, then measure it.', 'one', [
        ['a', '✅', 'I guessed, then I found out', true],
      ]),
    ],
    [
      listenChoose('g2', 'Guess first, then find out. There is no wrong guess.', [
        ['g2a', 'About how much does a full 2-litre bottle hold?', [
          ['a', '🥤', 'about 2 litres'],
          ['b', '🥤', 'about 2 millilitres'],
          ['c', '🥤', 'about 20 litres'],
        ], 'a'],
      ]),
      select('g2s', 'Now guess how many cups fill it, then pour and count.', 'one', [
        ['a', '✅', 'I guessed, then I found out', true],
      ]),
    ],
    [
      listenChoose('g3', 'Guess first, then find out. There is no wrong guess.', [
        ['g3a', 'About how heavy is a full schoolbag?', [
          ['a', '⚖️', 'about 4 kg'],
          ['b', '⚖️', 'about 4 g'],
          ['c', '⚖️', 'about 40 kg'],
        ], 'a'],
      ]),
      select('g3s', 'Now guess how many steps to the gate, then walk and count.', 'one', [
        ['a', '✅', 'I guessed, then I found out', true],
      ]),
    ],
  ],
};

/**
 * The three rhythms, in the order a school morning uses them: a number to wake
 * the head up, ten quick sums, and something to estimate.
 */
export const DAILY_RHYTHMS: DailyRhythm[] = [numberOfDay, tenInYourHead, lookAndGuess];

/**
 * The earliest point in the year each variant is legal at.
 *
 * Every rhythm has a variant at term 1 week 2, so day one is never empty. The
 * later variants use larger numbers, so a child in February is not shown a
 * six-digit number before *Big Numbers* has taught her to read one.
 */
export const VARIANT_STAGE: Record<string, Array<[TermNumber, number]>> = {
  'number-of-day': [
    [1, 2], // four digits
    [1, 6], // five digits, once addition is under way
    [2, 2], // six digits
  ],
  'ten-in-your-head': [
    [1, 2], // bonds and doubles
    [1, 8], // times tables, once multiplication has started
    [2, 2], // bigger sums
  ],
  'look-and-guess': [
    [1, 2], // length
    [4, 4], // capacity — beside the term 4 capacity block
    [4, 5], // mass — beside the term 4 mass block
  ],
};

/** Where in the year a date key falls, as a ladder ordinal. */
function ordinalForDate(dateKey: string): number {
  const floor = cycleOrdinal(1, 2);
  const [year, month, day] = dateKey.split('-').map(Number);
  if (!year || !month || !day) return floor;

  const date = new Date(year, month - 1, day);
  const schoolYear = resolveSchoolYear(date);
  if (schoolYear.simulated) return floor;

  const window = termOn(schoolYear, date);
  if (!window) return floor;
  const week = weekNumberOn(window, date);
  if (!week) return floor;
  return Math.max(floor, cycleOrdinal(window.term, week));
}

/**
 * Which variant a given day gets.
 *
 * A variant the child's year has not reached is not offered; among the rest the
 * choice is keyed on the date, so **the same day always shows the same one**
 * however many times the app is reopened (PRD §6.6).
 */
export function variantForDate(rhythm: DailyRhythm, dateKey: string): number {
  if (rhythm.variants.length <= 1) return 0;

  const stages = VARIANT_STAGE[rhythm._id];
  const reached = ordinalForDate(dateKey);
  const open = rhythm.variants
    .map((_, index) => index)
    .filter((index) => {
      const stage = stages?.[index];
      if (!stage) return true;
      return cycleOrdinal(stage[0], stage[1]) <= reached;
    });

  const pool = open.length > 0 ? open : [0];
  if (pool.length === 1) return pool[0];

  const digits = dateKey.replace(/-/g, '');
  const month = Number(digits.slice(4, 6)) || 0;
  const day = Number(digits.slice(6, 8)) || 0;
  return pool[(day + month * 3) % pool.length];
}
