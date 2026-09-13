import type { TermNumber, TextType } from '@/types';

/**
 * The support ramp — PRD §8.4. **[borrowed unchanged from *Life Skills Thuto
 * 5*, and not one number moves.]**
 *
 * ── What the ramp is ───────────────────────────────────────────────────────
 *
 * Every text in this app can be heard in full, at any point, on one tap. What
 * changes across the year is only **the default**: early in the year the app
 * reads first and the child follows; by term 3 the child reads first and the
 * app waits behind a tap. **Support is never withdrawn — only demoted.**
 *
 * ── Where these four rows come from, and why they did not change ──────────
 *
 * They are *Life Skills Thuto 5*'s rows, **copied**. That app's ramp was
 * already *English FAL Thuto 5*'s ramp dropped one term, for the same reason
 * `CORE_WORDS` is that app's ledger read one term behind.
 *
 * | Term | Words | Paragraphs | Sentence | Entry mode |
 * | ---: | ----: | ---------: | -------: | ---------- |
 * |    1 |    70 |          2 |     ≤ 11 | app-first |
 * |    2 |    80 |          2 |     ≤ 12 | app-first |
 * |    3 |   110 |          3 |     ≤ 13 | child-first, app-first for a worked example |
 * |    4 |   130 |          3 |     ≤ 15 | child-first, app-first for a worked example |
 *
 * > **A Mathematics word problem is not easier to read than a Life Skills
 * > text.** *"Comparing two or more quantities of the same kind"* is the ATP's
 * > own phrasing and it is harder than anything in Life Skills. So the numbers
 * > stay where they are (PRD §8.4).
 *
 * **The one thing that moved is `appFirstFor`**, and it moved to one value:
 * **the worked example keeps the app's voice for the whole year.** It is the
 * text in a topic that carries the method, and a child who decodes it slowly
 * has decoded it wrong.
 *
 * ── Three exemptions from the word ceiling ────────────────────────────────
 *
 *   1. **A figure's spoken description is outside the word count.** Inherited.
 *      It has to answer the question without the picture, and that takes the
 *      words it takes (PRD §7.5).
 *   2. **[new] The *working* in a worked example is outside it.** See
 *      `isWorkingLine` below. `342 706 = 300 000 + 40 000 + 2 000 + 700 + 6`
 *      is not seven words of English.
 *   3. **[new] A unit is not a word.** *mm*, *cm*, *m*, *km*, *mℓ*, *ℓ*, *g*,
 *      *kg* are read aloud in full by the `say` string and do not count.
 *
 * ── The rules that fall out of it ──────────────────────────────────────────
 *
 *   1. **A prompt is never something the child must read.** Prompts, hints and
 *      figure descriptions are the app's own voice, always spoken. The ramp
 *      does not govern them, and neither does the ledger.
 *   2. **Tap-to-hear never withdraws.** Not in term 4, not in a Star Challenge,
 *      not on a worked example, not ever. The ramp moves `mode`; it never
 *      touches the speaker button. **This is why a child who cannot read term 4
 *      still finishes term 4.**
 *   3. **The ramp is per term, not per topic.** A term is the granularity a
 *      person can actually check, and this table is meant to be checked by one.
 *
 * The acceptance test is PRD §17 test 3, the stranger test: walk a term 4 word
 * problem as Sipho, who reads about two years behind. Every text must still be
 * completable — slowly, with the speaker on, tapping half the words.
 */

export interface RampRule {
  term: TermNumber;
  /** The longest a single `read-text` may run. */
  maxWords: number;
  /** Paragraphs in the longest text. */
  maxParagraphs: number;
  /** The longest sentence in it. */
  maxSentenceWords: number;
  /**
   * What happens **on entry**, and nothing else. The speaker button is in the
   * same place in every term (rule 2 above).
   */
  entryMode: 'app-first' | 'child-first';
  /** Text types where the app still reads first, whatever the term's default. */
  appFirstFor: TextType[];
  /** Plain-language description, printed by the validator. */
  describe: string;
}

export const SUPPORT_RAMP: RampRule[] = [
  {
    term: 1,
    maxWords: 70,
    maxParagraphs: 2,
    maxSentenceWords: 11,
    entryMode: 'app-first',
    // Everything. It is term 1, after a holiday, in a subject taught in a
    // language the child does not speak at home.
    appFirstFor: [],
    describe: '70w · 2 paras · sentences ≤ 11 · app reads first',
  },
  {
    term: 2,
    maxWords: 80,
    maxParagraphs: 2,
    maxSentenceWords: 12,
    entryMode: 'app-first',
    // Instructional texts: recipes, directions, imperatives, sequence words,
    // dictionary work — and the first formal read-aloud, read aloud and
    // marked. This is not the term to demote the app's voice: a child who must
    // stand and read instructions aloud should not be meeting the text class
    // alone on the page.
    appFirstFor: [],
    describe: '80w · 2 paras · sentences ≤ 12 · app reads first',
  },
  {
    term: 3,
    maxWords: 110,
    maxParagraphs: 3,
    maxSentenceWords: 13,
    entryMode: 'child-first',
    // **The worked example keeps the app's voice for the whole year.** It is
    // the one text in a topic that carries the skill, and a child who decodes
    // it slowly has decoded it wrong. Everything else goes child-first here.
    appFirstFor: ['worked-example'],
    describe: '110w · 3 paras · sentences ≤ 13 · child first, app first for a worked example',
  },
  {
    term: 4,
    maxWords: 130,
    maxParagraphs: 3,
    maxSentenceWords: 15,
    entryMode: 'child-first',
    // Same rule as term 3, and it does not withdraw in the last term either.
    appFirstFor: ['worked-example'],
    describe: '130w · 3 paras · sentences ≤ 15 · child first, app first for a worked example',
  },
];

export function rampFor(term: TermNumber): RampRule {
  const rule = SUPPORT_RAMP.find((entry) => entry.term === term);
  if (!rule) throw new Error(`No support ramp for term ${term}`);
  return rule;
}

/** The entry mode a text of this type should carry in this term. */
export function entryModeFor(term: TermNumber, textType: TextType): 'app-first' | 'child-first' {
  const rule = rampFor(term);
  if (rule.appFirstFor.includes(textType)) return 'app-first';
  return rule.entryMode;
}

/**
 * **The closed list of things that are arithmetic rather than English** —
 * PRD §8.4 exemptions 2 and 3.
 *
 * A line of a worked example is either **prose**, which the ramp governs, or
 * **working**, which it does not. `342 706 = 300 000 + 40 000 + 2 000 + 700 +
 * 6` is not seven words of English, and counting it as though it were would
 * push every worked example in the year over its term's ceiling.
 *
 * The test is deliberately crude and deliberately closed: **a line is working
 * if every token on it is a number, an operator, a unit, or one of the number
 * and operation words below.** One ordinary English word makes the whole line
 * prose again, and it is counted. That way round is the safe one — a line the
 * check is unsure about gets counted, not exempted.
 */
const WORKING_WORDS = new Set([
  // the operations, said the way `src/i18n` fixes them (PRD §9.1 caveat 5)
  'plus', 'minus', 'take', 'away', 'times', 'multiplied', 'by', 'divided',
  'is', 'equals', 'and', 'of', 'r',
  // the number words
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
  'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty',
  'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred',
  'thousand', 'million',
  // the fraction words, which are said and not spelled (PRD §9.1 caveat 4)
  'half', 'halves', 'third', 'thirds', 'quarter', 'quarters', 'fifth',
  'fifths', 'sixth', 'sixths', 'eighth', 'eighths', 'tenth', 'tenths',
  'twelfth', 'twelfths',
  // the columns
  'ones', 'tens', 'hundreds', 'thousands',
]);

/**
 * **A unit is not a word** — PRD §8.4 exemption 3.
 *
 * `mm`, `cm`, `m`, `km`, `mℓ`, `ℓ`, `g`, `kg` are read aloud **in full** by
 * their `say` string — `km` is *"kilometres"* and never *"kay em"* (PRD §9.1
 * caveat 2) — and they do not count against the ceiling.
 */
const UNITS = new Set([
  'mm', 'cm', 'm', 'km', 'ml', 'mℓ', 'l', 'ℓ', 'g', 'kg', 'kl', 'kℓ',
  'mm2', 'cm2', 'm2', 'cm3', 'm3', 's', 'h', 'am', 'pm',
]);

/** A token with its punctuation, currency and separators stripped. */
function bareToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/[.,;:!?()"“”'’]/g, '')
    .replace(/^r(?=\d)/, '')
    .trim();
}

/** Whether a token is a number, an operator, a unit, or a working word. */
function isWorkingToken(token: string): boolean {
  const bare = bareToken(token);
  if (bare.length === 0) return true;
  if (UNITS.has(bare)) return true;
  if (WORKING_WORDS.has(bare)) return true;
  // A number, with or without space separators, and a bare fraction like 3/4.
  if (/^\d+$/.test(bare)) return true;
  if (/^\d+\/\d+$/.test(bare)) return true;
  // The operators, alone or attached.
  if (/^[+\-−×÷=<>%]+$/.test(bare)) return true;
  return false;
}

/**
 * **Whether a line is working rather than prose** — PRD §8.4 exemption 2.
 *
 * Used by `countWords` and by the validator's ramp check. **The prose lines of
 * a worked example are inside the ramp; the lines that are arithmetic are
 * not.**
 */
export function isWorkingLine(line: string): boolean {
  const tokens = line.trim().split(/\s+/).filter((token) => token.length > 0);
  if (tokens.length === 0) return false;
  // A line with no digit and no operator on it is prose whatever its words are:
  // "take away one hundred" is a sentence, not a sum.
  if (!/[\d+\-−×÷=]/.test(line)) return false;
  return tokens.every(isWorkingToken);
}

/**
 * How many words a line is — **zero if the line is working** (PRD §8.4).
 */
export function countWords(line: string): number {
  if (isWorkingLine(line)) return 0;
  return line
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    // A unit inside an otherwise ordinary sentence is still not a word.
    .filter((word) => !UNITS.has(bareToken(word)))
    .length;
}

/**
 * The sentences in a line, for the sentence ceiling.
 *
 * A line is usually one sentence — that is the house style, and the reason the
 * line break is content rather than layout — but a short line may carry two,
 * and the ceiling is about the *sentence*, not the line.
 */
export function sentencesIn(line: string): string[] {
  return line
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
