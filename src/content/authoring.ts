import { colours } from '@/theme/tokens';
import type {
  Activity,
  AssignSlotActivity,
  AudioPrompt,
  Badge,
  BeatAlongActivity,
  ChanceTrialActivity,
  ClockFaceActivity,
  ContentArea,
  DrawCanvasActivity,
  ExploreCardsActivity,
  FigureId,
  FlowDiagramActivity,
  FractionBarActivity,
  HabitTrackerActivity,
  Lesson,
  ListenChooseActivity,
  ListenChooseRound,
  LocalisedText,
  MatchConnectActivity,
  MemoryMatchActivity,
  MoveAlongActivity,
  MovementSpace,
  NumberLineActivity,
  PlaceColumn,
  PlaceValueActivity,
  ReadTextActivity,
  LineRole,
  SelectActivity,
  SequenceActivity,
  SortBasketsActivity,
  SoundItem,
  SpellWordActivity,
  TermNumber,
  TextLayout,
  TextLine,
  TextType,
  Topic,
} from '@/types';

/**
 * Authoring helpers — PRD §11.
 *
 * A whole year of lessons is a lot of JSON, and JSON that is painful to read is
 * JSON that quietly goes wrong. These builders take compact tuples and produce
 * exactly the documents described in PRD §10, so a content author writes the
 * curriculum and never the plumbing: ids, subject links, ordering and colours
 * are all derived.
 *
 * Nothing here adds a field the data model does not already have — the output
 * is the same shape a MongoDB collection would hand back.
 */

export const SUBJECT_ID = 'en-fal-g6';

export function txt(en: string): LocalisedText {
  return { en };
}

export function prompt(en: string): AudioPrompt {
  return { text: { en } };
}

/* ------------------------------------------------------------------ items */

/** `[id, emoji, label]` */
export type PicTuple = [string, string, string];
/** `[id, emoji, label, colour]` */
export type BinTuple = [string, string, string, string];

/* ------------------------------------------------------------- activities */

/** `[id, emoji, label, basketId]` */
export function sortBaskets(
  id: string,
  ask: string,
  baskets: BinTuple[],
  items: Array<[string, string, string, string]>,
  hint?: string,
): SortBasketsActivity {
  return {
    id,
    type: 'sort-baskets',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    baskets: baskets.map(([bid, emoji, label, colour]) => ({
      id: bid,
      emoji,
      label: txt(label),
      colour,
    })),
    items: items.map(([iid, emoji, label, basketId]) => ({
      id: iid,
      emoji,
      label: txt(label),
      basketId,
    })),
  };
}

/** `[id, emoji, label, correct]` */
export function select(
  id: string,
  ask: string,
  selectMode: 'all' | 'one',
  items: Array<[string, string, string, boolean]>,
  hint?: string,
): SelectActivity {
  return {
    id,
    type: 'select',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    selectMode,
    items: items.map(([iid, emoji, label, correct]) => ({
      id: iid,
      emoji,
      label: txt(label),
      correct,
    })),
  };
}

/** Order is the order the tuples are written in. */
export function sequence(
  id: string,
  ask: string,
  items: PicTuple[],
  hint?: string,
): SequenceActivity {
  return {
    id,
    type: 'sequence',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    items: items.map(([iid, emoji, label], index) => ({
      id: iid,
      emoji,
      label: txt(label),
      order: index + 1,
    })),
  };
}

/** `[id, leftEmoji, leftLabel, rightEmoji, rightLabel]` */
export function matchConnect(
  id: string,
  ask: string,
  pairs: Array<[string, string, string, string, string]>,
  hint?: string,
): MatchConnectActivity {
  return {
    id,
    type: 'match-connect',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    pairs: pairs.map(([pid, le, ll, re, rl]) => ({
      id: pid,
      left: { id: `${pid}-l`, emoji: le, label: txt(ll) },
      right: { id: `${pid}-r`, emoji: re, label: txt(rl) },
    })),
  };
}

/** `[id, emoji, label, slotId]` */
export function assignSlot(
  id: string,
  ask: string,
  slots: BinTuple[],
  items: Array<[string, string, string, string]>,
  hint?: string,
): AssignSlotActivity {
  return {
    id,
    type: 'assign-slot',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    slots: slots.map(([sid, emoji, label, colour]) => ({
      id: sid,
      emoji,
      label: txt(label),
      colour,
    })),
    items: items.map(([iid, emoji, label, slotId]) => ({
      id: iid,
      emoji,
      label: txt(label),
      slotId,
    })),
  };
}

/** `[id, emoji, label, fact]` */
export function exploreCards(
  id: string,
  ask: string,
  cards: Array<[string, string, string, string]>,
): ExploreCardsActivity {
  return {
    id,
    type: 'explore-cards',
    prompt: prompt(ask),
    cards: cards.map(([cid, emoji, label, fact]) => ({
      id: cid,
      emoji,
      label: txt(label),
      fact: prompt(fact),
    })),
  };
}

/**
 * `[id, emoji, label]` or `[id, emoji, label, why]` — **the wrong-answer
 * option** (PRD §6.5b). The fourth element is what this answer *did*, and it is
 * set only on a wrong option. `undefined` for a bare distractor.
 */
export type OptionTuple =
  | [string, string, string]
  | [string, string, string, string | undefined];

/**
 * `[id, question, options, answerId]` or
 * `[id, question, options, answerId, fromStepId]` — the last points at a step
 * of the topic's worked example, replayed on a wrong tap (PRD §7.4).
 */
export type RoundTuple =
  | [string, string, OptionTuple[], string]
  | [string, string, OptionTuple[], string, string];

/**
 * `listen-choose` — hear a question, tap the answer (PRD §7).
 *
 * **The wrong answers are the whole lesson in this subject** (PRD §6.5b). An
 * option's fourth element names what that answer *did*, flatly; the round's
 * fifth element points at the step of the worked example the answer came from,
 * which a wrong tap replays. The validator refuses a `why` on the right option
 * and a `why` that scolds (§11 check 2).
 */
export function listenChoose(
  id: string,
  ask: string,
  rounds: RoundTuple[],
  hint?: string,
): ListenChooseActivity {
  return {
    id,
    type: 'listen-choose',
    prompt: prompt(ask),
    ...(hint ? { hint: prompt(hint) } : {}),
    rounds: rounds.map((round) => {
      const [rid, question, options, answerId, fromStepId] = round as [
        string,
        string,
        OptionTuple[],
        string,
        string?,
      ];
      const built: ListenChooseRound = {
        id: rid,
        question: prompt(question),
        options: options.map(([oid, emoji, label, why]) => ({
          id: oid,
          emoji,
          label: txt(label),
          ...(why ? { why: txt(why) } : {}),
        })),
        answerId,
        ...(fromStepId ? { fromStepId } : {}),
      };
      return built;
    }),
  };
}

/** `[id, emoji, label, why]` — the `why` is not optional here. */
export type OpenTuple = [string, string, string, string];

/**
 * **The open question — PRD §6.5f, §7.2. The shape this year exists for.**
 *
 * This ATP is the first in the family to print *"Asks critical questions which
 * do not have obvious answers"* and *"Responds thoughtfully to critical
 * questions"*, and in Term 4 weeks 3–4 it prints both in **both** the Listening
 * and the Reading column. Six of this year's cycles carry one.
 *
 * Every option is accepted. Each carries a `why` that says **what that answer
 * commits you to**, and stops:
 *
 *   *"Maybe she was scared."*
 *     → *"Then the part where she looks at the door matters a lot."*
 *   *"Maybe she wanted to fix it herself."*
 *     → *"Then she is braver than she sounds."*
 *
 * **None of them says *yes*, *good* or *that's right*.** A `why` that praises
 * has reintroduced the right answer through the back door, and it is the exact
 * mistake this shape exists to prevent. `scripts/check-content.ts` fails the
 * build on a praise token in a `why`.
 *
 * One round only, on purpose: an open question is the point of a lesson, not a
 * texture, and a second one in the same sitting means neither was really open.
 */
export function openChoose(
  id: string,
  ask: string,
  question: string,
  options: OpenTuple[],
): ListenChooseActivity {
  return {
    id,
    type: 'listen-choose',
    prompt: prompt(ask),
    rounds: [
      {
        id: `${id}-open`,
        question: prompt(question),
        open: true,
        options: options.map(([oid, emoji, label, why]) => ({
          id: oid,
          emoji,
          label: txt(label),
          why: txt(why),
        })),
      },
    ],
  };
}

/**
 * Hang a drawn figure above an activity — PRD §7.4.
 *
 * Written as a wrapper rather than a parameter on every builder because a
 * visual-text lesson names **the same figure in three of its four activities**,
 * and `withFigure('fig-bar-how-we-travel', ...)` reads as what it is: one
 * picture, several questions.
 */
export function withFigure<T extends Activity>(figure: FigureId, activity: T): T {
  return { ...activity, figure };
}

export function drawCanvas(id: string, ask: string, palette?: string[]): DrawCanvasActivity {
  return {
    id,
    type: 'draw-canvas',
    prompt: prompt(ask),
    ...(palette ? { colours: palette } : {}),
  };
}

/**
 * **Hang a claim about the real world on an activity** — PRD §1.1 rule 2,
 * §11 check 4.
 *
 * Written as a wrapper for the same reason `withFigure` is: a health lesson
 * names one claim across three of its four activities — read what TB is,
 * sort how it spreads, hear that the clinic is free — and
 * `withFact('health-tb-treatment', ...)` reads as what it is.
 *
 * **The value must have a line in `docs/facts.md`** naming a South African
 * public-health or DBE source, and the build fails without one.
 */
export function withFact<T extends Activity>(factRef: string | string[], activity: T): T {
  return { ...activity, factRef: Array.isArray(factRef) ? factRef.join(' ') : factRef };
}

/** `[id, emoji, label, call]` */
export function moveAlong(
  id: string,
  ask: string,
  steps: Array<[string, string, string, string]>,
  mode: 'guided' | 'freeze-go' = 'guided',
): MoveAlongActivity {
  return {
    id,
    type: 'move-along',
    prompt: prompt(ask),
    mode,
    steps: steps.map(([sid, emoji, label, call]) => ({
      id: sid,
      emoji,
      label: txt(label),
      call: prompt(call),
    })),
  };
}

/* ------------------------------------------------- the movement, and rule 1 */

export interface PractiseSpec {
  /** Where the child has to be able to stand. Required. */
  space: MovementSpace;
  /**
   * **One sentence, spoken before the first step.** Required.
   *
   * A plain instruction about where to stand — *"Stand next to a wall so you
   * can touch it. Bare feet are best."* — and **never a warning about what
   * could go wrong**. A ten-year-old alone in a room does not need to be
   * frightened; she needs to be told where to put her feet.
   */
  safety: string;
  /**
   * What it needs. Required, and every entry must be a thing the child probably
   * has or the string `'nothing'`, which is the year's most common answer.
   */
  kit: string[];
  /** `[id, emoji, label, call]`, exactly as `moveAlong()` takes them. */
  steps: Array<[string, string, string, string]>;
}

/**
 * **A movement call — PRD 7.2, 6.5b. Rule 1 lives here.**
 *
 * Physical Education is one lesson per topic, seventeen in the year, plus ten
 * more in the Move Today rhythm, and **the app calls every one of them into a
 * room it cannot see**: a two-room house, a concrete floor, no equipment, no
 * adult, and a bucket of water standing in the corner.
 *
 * So this builder takes three things an author cannot omit — a `space`, a
 * `safety` line and a `kit` — and the validator refuses the build without them
 * (PRD 11 check 1). It also refuses any call that names a word from the closed
 * never-list:
 *
 * > **water, swim, dive, pool, dam, river, bucket, height, roof, climb, road,
 * > street, traffic, railway, train, fire, match, candle, knife, blade,
 * > scissors**
 *
 * -- Why this is not an alias for `moveAlong()` ----------------------------
 *
 * `moveAlong()` stays, for everything that is not a movement: *"go and tell
 * somebody"*, *"tap when you have"*. **A movement authored with `moveAlong()`
 * has no safety line and the validator fails the build**, which is the whole
 * point of having two names for one component. Do not "simplify" them into one.
 *
 * -- And the ATP's own *or* -------------------------------------------------
 *
 * Term 4's cell reads *"basic field and track athletics **or** swimming"*.
 * **The app takes athletics**, permanently, and `docs/movement-guide.md`
 * carries the reasoning so that the next person who reads the ATP and notices
 * the gap finds the answer instead of the gap (PRD 18.8 #2).
 */
export function practise(id: string, ask: string, spec: PractiseSpec): MoveAlongActivity {
  return {
    ...moveAlong(id, ask, spec.steps),
    safety: txt(spec.safety),
    space: spec.space,
    kit: spec.kit,
  };
}

/* ---------------------------------------------------------------- the beat */

export interface BeatSpec {
  /** 60-100. Below 60 the pulse is lost; above 100 a budget motor smears it. */
  tempo: number;
  pattern: Array<'semibreve' | 'minim' | 'crotchet' | 'quaver' | 'rest'>;
  /** Spoken before the pattern plays. */
  ask: string;
  /** The same pattern written down, if the lesson shows it. */
  figure?: FigureId;
}

/**
 * **A rhythm the app plays — PRD 7.3. The one new component in this fork.**
 *
 * *"Rhythm patterns of different note values (semibreve, minim, crotchet,
 * quaver and the equivalent rests)"* is printed across three of four terms of
 * the Creative Arts half. **A crotchet is a sound.** Taught as a picture alone
 * it is a shape with a name and no meaning, and a child with no instrument, no
 * teacher and no audio files has met nothing.
 *
 * **This is not a timer.** It times nothing about the child, scores nothing and
 * compares nothing; the child taps when she has clapped along and she cannot be
 * wrong. The family's rule forbids timing the child — **it does not forbid the
 * app playing a beat** (PRD 1.1, 4 principle 10).
 */
export function keepTheBeat(id: string, ask: string, spec: BeatSpec): BeatAlongActivity {
  return {
    id,
    type: 'beat-along',
    prompt: prompt(ask),
    tempo: spec.tempo,
    pattern: spec.pattern,
    ask: prompt(spec.ask),
    ...(spec.figure ? { figure: spec.figure } : {}),
  };
}

/* ------------------------------------------------ the card, and care rule 2 */

/**
 * **The trusted-adult card — PRD 6.5e, 8.3. Inherited word for word.**
 *
 * Every `careful` topic ends its **last PSW lesson** with this, and it is
 * identical in all eight, on purpose: **a child who has met it four times knows
 * what it is before it finishes speaking**, and that recognition is the point
 * of it. It is exempt from every ramp and budget limit for the same reason
 * (PRD 8.2b).
 *
 * It takes an activity id and nothing else, because there is no argument an
 * author could get wrong.
 *
 * Four things about it are absolute:
 *
 *   1. **Every card is correct.** It is an `explore-cards` activity, there is
 *      no answer, and no tap is better than another.
 *   2. **The tap is written nowhere** — not to the day record, not to progress,
 *      not anywhere (PRD 8.4). A record of which adult a ten-year-old
 *      considered telling would be the most dangerous row in this family's data
 *      model, and it does not exist.
 *   3. **The number is real, it is sourced, and it is spoken as digits.** 116
 *      is the South African national child helpline: free, always open, from
 *      any phone. It is the one real-world fact this app is glad to carry, and
 *      `docs/facts.md` has its line (`number-childline`).
 *   4. **It is never dialled.** A tap that opens a dialler leaves a number in a
 *      call log on a phone the child may not own alone, and `CALL_PHONE` is on
 *      the blocked list in `app.json` (PRD 12, 14 decision 14).
 *
 * **The position moved in this grade and the validator moved with it**: the
 * card is the last activity of **lesson 2**, not of lesson 4, because lesson 4
 * is Creative Arts and a card that follows a drumming lesson has been filed
 * under drumming (PRD 11 check 2).
 */
export function whoCanITell(id: string): ExploreCardsActivity {
  return withFact(
    'number-childline',
    exploreCards(id, 'Who can you tell? Tap each one and listen.', [
      [
        'grown-up-home',
        '🏠',
        'A grown-up at home you trust',
        'Somebody at home you trust. A parent, a gogo, an aunt, an older brother or sister. Tell them what happened. If they do not listen, tell somebody else.',
      ],
      [
        'teacher',
        '🏫',
        'Your teacher',
        'A teacher at school. Teachers are told what to do when a child tells them something like this. You can ask to speak to them on your own.',
      ],
      [
        'nurse',
        '🏥',
        'The nurse at the clinic',
        'The nurse at the clinic. The clinic is free. A nurse will listen to you, and a nurse knows who else to phone.',
      ],
      [
        'childline',
        '📞',
        'Childline: one, one, six',
        'Childline. The number is one, one, six. It is free, and you can phone it from any phone. Somebody there listens to children all day and all night. You do not have to say your name.',
      ],
      [
        'keep-telling',
        '🔁',
        'Somebody else, if the first one does not listen',
        'If the first person you tell does not listen, tell somebody else. Keep telling until somebody helps you. It is not telling tales, and it is not your fault.',
      ],
    ]),
  );
}

export function memoryMatch(id: string, ask: string, cards: PicTuple[]): MemoryMatchActivity {
  return {
    id,
    type: 'memory-match',
    prompt: prompt(ask),
    cards: cards.map(([cid, emoji, label]) => ({ id: cid, emoji, label: txt(label) })),
  };
}

/**
 * Speaking, without a microphone — PRD §6.5a.
 *
 * **Copied across from *English FAL Thuto 2*, and the only thing this app takes
 * from its Grade 2 namesake** (PRD §15.4). Take the mechanic and nothing else:
 * every prompt, praise line, set size and text length in that app is two grades
 * and one phase too young.
 *
 * Formal Assessment Task 1 is Read Aloud and Task 7 is an oral presentation.
 * **The app never listens.** The pattern is three beats, and the order is the
 * whole pedagogy — the child hears the correct form **last**, whatever they
 * said:
 *
 *   1. the app says the word, phrase or line, slowly;
 *   2. it says "Now you say it", and waits. Nobody hears the child;
 *   3. it says it again, so the model is the last thing in the child's ear.
 *
 * Nothing is recorded, nothing is scored, and the child cannot be wrong.
 *
 * > Speech recognition for ten-year-old South African FAL accents is not
 * > reliable enough to grade a child on, and a false "wrong" here does exactly
 * > the damage PRD §2.1 goal 9 exists to prevent.
 *
 * This is `move-along` with a fixed shape and **no code change** — the line
 * sits in the picture slot so it is shown large, and the call underneath is the
 * instruction. An author writes one line, not four.
 */
export function speakAlong(
  id: string,
  ask: string,
  lines: Array<string | [string, string]>,
): MoveAlongActivity {
  const steps: Array<[string, string, string, string]> = [];

  lines.forEach((entry, index) => {
    const [line, emoji] = typeof entry === 'string' ? [entry, '🗣️'] : entry;
    const slug = line
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 24);
    const key = `${slug || 'line'}-${index + 1}`;
    // Beat 1: the model, at a pace a FAL ear can follow.
    steps.push([`${key}-hear`, line, line, line]);
    // Beat 2: the child's turn, and the held step is the silence.
    steps.push([
      `${key}-you`,
      line,
      line,
      'Now you say it. Nobody is listening. Tap when you have said it.',
    ]);
    // Beat 3: the model again, so the correct form is heard last.
    steps.push([`${key}-again`, line, line, line]);
  });

  return moveAlong(id, ask, steps);
}

/**
 * **The making call — PRD §6.5c.**
 *
 * *"Create in 3D"*, *"African body adornment"*, *"models of the human figure"*,
 * *"joining recyclable materials"*. The app calls the steps, waits, and **never
 * sees the result**. There is no camera and there is no *"submission of
 * artwork"* row in this app, whatever the ATP prints (PRD §2.2).
 *
 * > **It names three materials and accepts none of them.** *"A ball of clay, or
 * > wet soil, or bread dough, or nothing at all — you can do this one with your
 * > hands in the air."* Principle 11: **a Life Skills lesson that requires the
 * > child to own something has failed the child it was written for.**
 *
 * A making call that asks the child to move about carries a safety line like
 * any other — author it with `practise()` instead (PRD §11 check 1).
 */
export function doItYourself(
  id: string,
  ask: string,
  steps: Array<[string, string, string]>,
): MoveAlongActivity {
  return moveAlong(
    id,
    ask,
    steps.map(([sid, emoji, call]) => [sid, emoji, call, call] as [string, string, string, string]),
  );
}

/* ------------------------------------------------------------- read-text */

/**
 * `[id, text]`, `[id, text, emoji]` or `[id, role, text, emoji?]`.
 *
 * A leading `¶` on the text starts a new paragraph. The four-element form
 * carries a `LineRole` and is used only by a laid-out text (PRD §7.2).
 */
export type LineTuple =
  | [string, string]
  | [string, string, string]
  | [string, LineRole, string, string?];

/**
 * `[meaning, picture]`, `[meaning, picture, say]` or
 * `[meaning, picture, say, sayAlt]`.
 *
 * **The picture is not optional** (PRD §8.2b). `say` is for a homograph a
 * device voice would get wrong; `sayAlt` is the second reading, and it is only
 * ever set where the two readings are the lesson — *"homophones, homonyms,
 * polysemy"*, Term 2 weeks 3–4 and Term 4 weeks 3–4 (PRD §9.1).
 */
export type GlossTuple =
  | [string, string]
  | [string, string, string]
  | [string, string, string, string];

export interface ReadTextSpec {
  /** `app-first` reads on entry; `child-first` waits. The ramp sets it. */
  mode: 'app-first' | 'child-first';
  textType: TextType;
  /** Absent means `prose` — every inherited text stays valid (PRD §7.2). */
  layout?: TextLayout;
  title: string;
  emoji: string;
  lines: LineTuple[];
  /**
   * Every word in the text that is not in the cumulative ledger, with what it
   * means **and a picture** (PRD §8.2b). A gloss without a picture fails the
   * build.
   */
  gloss?: Record<string, GlossTuple>;
  /** `[ask, options, answerId, fromLineId?]` */
  question?: [string, PicTuple[], string, string?];
  /** A deliberate departure from the term's ramp row, with its reason. */
  rampException?: string;
  /**
   * A drawn figure above the text — PRD §7.4. Its spoken description does not
   * count against the term's word ceiling.
   */
  figure?: FigureId;
  /**
   * **The claim this text makes about the real world** — PRD §1.1 rule 2.
   *
   * Required on every cause, symptom, treatment, festival, custom, dietary
   * guideline and phone number, and it keys into `docs/facts.md`. A text with
   * none is asserting that it makes no claim, which is true of a story about
   * Naledi and false of a paragraph on how malaria spreads.
   */
  factRef?: string;
}

const LINE_ROLES: LineRole[] = [
  'headline', 'byline', 'lead', 'body', 'image', 'caption', 'label', 'value',
  'fine-print',
  // table — PRD §7.3
  'column-head', 'row-head', 'cell',
  // message — PRD §7.3, §6.5d
  'sender', 'subject', 'said-to-me', 'said-by-me', 'time', 'sign-off',
];

function isLineRole(value: string): value is LineRole {
  return (LINE_ROLES as string[]).includes(value);
}

/**
 * The centre of this app — PRD §7.1, §7.2.
 *
 * A text the child reads, with **every word one tap from being spoken**. The
 * builder does nothing clever: it exists so that an author writes the text, the
 * meanings and the pictures, and never the plumbing.
 *
 * `¶` at the start of a line starts a new paragraph. The validator counts them
 * against the term's paragraph ceiling (PRD §8.2c).
 *
 * A laid-out text — a poster, a chart, an article — gives **every** line a
 * role, and a prose text gives **none**. The validator fails the build either
 * way round, because a poster with three unroled lines renders as a stack and
 * silently stops being a poster.
 */
export function readText(id: string, ask: string, spec: ReadTextSpec): ReadTextActivity {
  const lines: TextLine[] = spec.lines.map((tuple) => {
    const [lid, second, third, fourth] = tuple as [string, string, string?, string?];
    const roled = third !== undefined && isLineRole(second);
    const rawText = roled ? (third as string) : second;
    const emoji = roled ? fourth : third;
    const paragraphBreak = rawText.startsWith('¶');
    return {
      id: lid,
      text: (paragraphBreak ? rawText.slice(1) : rawText).trim(),
      ...(roled ? { role: second as LineRole } : {}),
      ...(emoji ? { emoji } : {}),
      ...(paragraphBreak ? { paragraphBreak: true } : {}),
    };
  });

  const activity: ReadTextActivity = {
    id,
    type: 'read-text',
    prompt: prompt(ask),
    mode: spec.mode,
    textType: spec.textType,
    ...(spec.layout && spec.layout !== 'prose' ? { layout: spec.layout } : {}),
    title: txt(spec.title),
    emoji: spec.emoji,
    lines,
    gloss: Object.fromEntries(
      Object.entries(spec.gloss ?? {}).map(([word, entry]) => {
        const [meaning, picture, say, sayAlt] = entry;
        return [
          word,
          {
            meaning: txt(meaning),
            picture,
            ...(say ? { say: txt(say) } : {}),
            ...(sayAlt ? { sayAlt: txt(sayAlt) } : {}),
          },
        ];
      }),
    ),
    ...(spec.rampException ? { rampException: spec.rampException } : {}),
    ...(spec.figure ? { figure: spec.figure } : {}),
    ...(spec.factRef ? { factRef: spec.factRef } : {}),
  };

  if (spec.question) {
    const [ask_, options, answerId, fromLineId] = spec.question;
    activity.question = {
      ask: prompt(ask_),
      options: options.map(([oid, emoji, label]) => ({ id: oid, emoji, label: txt(label) })),
      answerId,
      ...(fromLineId ? { fromLineId } : {}),
    };
  }

  return activity;
}

/* ------------------------------------------------------------ spell-word */

/**
 * `[id, label, say]` for a tile; the `say` is written the way a person makes
 * the sound and never derived from the letters, because a device asked to read
 * a bare letter group gives you the letter *names* (PRD §9.1).
 * `scripts/check-content.ts` fails the build on a missing or lazy one.
 */
export type SoundTuple = [string, string, string];

export interface SpellWordSpec {
  word: string;
  /** How the whole word is said, if TTS would get it wrong. Defaults to the word. */
  say?: string;
  sentence: string;
  emoji: string;
  /** The language item or cycle this word belongs to; a rung of the ladder. */
  pattern: string;
  /** The word's own tiles plus two or three distractors, in any order. */
  tiles: SoundTuple[];
}

/**
 * My Word Wall's build step, and the draft step of the writing process —
 * PRD §6.6, §6.5b.
 *
 * "Records words and their meanings in a personal dictionary or word wall"
 * appears in **every block of this ATP without exception**. This is that row,
 * as a tap: hear the word, hear it used in a sentence, see its picture, build
 * it from tiles, and watch it join the wall.
 *
 * **The Word Wall collects; it does not test.** `spelledCorrectly` is gone from
 * the daily record on purpose (PRD §10): a child building their first personal
 * dictionary in a language they do not speak at home is not being marked.
 *
 * The tiles must spell the word exactly, in order, when the right ones are
 * tapped — the validator checks that, because a word that cannot be built is a
 * screen a child can never leave.
 */
export function spellWord(id: string, ask: string, spec: SpellWordSpec): SpellWordActivity {
  const tiles: SoundItem[] = spec.tiles.map(([tid, label, say]) => ({
    id: tid,
    label: txt(label),
    say: txt(say),
  }));

  return {
    id,
    type: 'spell-word',
    prompt: prompt(ask),
    word: txt(spec.word),
    say: txt(spec.say ?? spec.word),
    sentence: prompt(spec.sentence),
    emoji: spec.emoji,
    pattern: spec.pattern,
    tiles,
  };
}

export function habitTracker(id: string, ask: string, habits: PicTuple[]): HabitTrackerActivity {
  return {
    id,
    type: 'habit-tracker',
    prompt: prompt(ask),
    habits: habits.map(([hid, emoji, label]) => ({ id: hid, emoji, label: txt(label) })),
  };
}

/* ══════════════════════════════════════════════ the six builders, §7.2 ══ */

/**
 * **The worked example** — PRD §6.5a, §7.4. **This subject's `read-text`.**
 *
 * A thin wrapper over `readText` with `textType: 'worked-example'`. Its lines
 * are numbered steps and their ids (`l1`, `l2`, …) are what a wrong tap on a
 * later `listen-choose` replays through `fromStepId`. The app reads it first in
 * every term (see `ramp.ts`).
 *
 * The steps that are pure arithmetic are not counted against the ramp's word
 * ceiling — `isWorkingLine` in `ramp.ts` decides which those are — so a step
 * like `407 = 3 hundreds, 10 tens, 7 ones` costs nothing.
 */
export interface WorkedExampleSpec {
  title: string;
  emoji: string;
  steps: Array<[string, string]>;
  gloss?: Record<string, GlossTuple>;
}

export function workedExample(id: string, ask: string, spec: WorkedExampleSpec): ReadTextActivity {
  return readText(id, ask, {
    mode: 'app-first',
    textType: 'worked-example',
    title: spec.title,
    emoji: spec.emoji,
    lines: spec.steps.map(([lid, text]) => [lid, text] as LineTuple),
    gloss: spec.gloss ?? {},
  });
}

/** `place-value` — build, break down, or regroup a number (PRD §7.2). */
export function placeValue(
  id: string,
  ask: string,
  spec: {
    mode: PlaceValueActivity['mode'];
    start: number;
    columns: PlaceColumn[];
    target: number[];
    say: string;
  },
): PlaceValueActivity {
  return {
    id,
    type: 'place-value',
    prompt: prompt(ask),
    mode: spec.mode,
    start: spec.start,
    columns: spec.columns,
    target: spec.target,
    say: txt(spec.say),
  };
}

/** `number-line` — place, jump, or round (PRD §7.2). */
export function numberLine(
  id: string,
  ask: string,
  spec: {
    mode: NumberLineActivity['mode'];
    from: number;
    to: number;
    step: number;
    value: number;
    target: number;
    jump?: number;
    denominator?: number;
    say: string;
  },
): NumberLineActivity {
  return {
    id,
    type: 'number-line',
    prompt: prompt(ask),
    mode: spec.mode,
    from: spec.from,
    to: spec.to,
    step: spec.step,
    value: spec.value,
    target: spec.target,
    ...(spec.jump !== undefined ? { jump: spec.jump } : {}),
    ...(spec.denominator !== undefined ? { denominator: spec.denominator } : {}),
    say: txt(spec.say),
  };
}

/** `fraction-bar` — shade, compare, add, or show equivalence (PRD §7.2). */
export function fractionBar(
  id: string,
  ask: string,
  spec: {
    mode: FractionBarActivity['mode'];
    denominator: number;
    bars: number[];
    target: number[];
    equivalentTo?: [number, number];
    sentence?: string;
    say: string;
  },
): FractionBarActivity {
  return {
    id,
    type: 'fraction-bar',
    prompt: prompt(ask),
    mode: spec.mode,
    denominator: spec.denominator,
    bars: spec.bars,
    target: spec.target,
    ...(spec.equivalentTo ? { equivalentTo: spec.equivalentTo } : {}),
    ...(spec.sentence ? { sentence: txt(spec.sentence) } : {}),
    say: txt(spec.say),
  };
}

/** `flow-diagram` — fill the input, the rule, or the output (PRD §7.2). */
export function flowDiagram(
  id: string,
  ask: string,
  spec: {
    blank: FlowDiagramActivity['blank'];
    rule: string;
    operations: FlowDiagramActivity['operations'];
    inputs: number[];
    outputs: number[];
    blankAt?: number;
    ruleOptions?: Array<[string, string, boolean]>;
    alsoSaid?: { asTable?: boolean; asSentence?: string };
  },
): FlowDiagramActivity {
  return {
    id,
    type: 'flow-diagram',
    prompt: prompt(ask),
    blank: spec.blank,
    rule: txt(spec.rule),
    operations: spec.operations,
    inputs: spec.inputs,
    outputs: spec.outputs,
    ...(spec.blankAt !== undefined ? { blankAt: spec.blankAt } : {}),
    ...(spec.ruleOptions
      ? {
          ruleOptions: spec.ruleOptions.map(([rid, label, correct]) => ({
            id: rid,
            label: txt(label),
            correct,
          })),
        }
      : {}),
    ...(spec.alsoSaid
      ? {
          alsoSaid: {
            ...(spec.alsoSaid.asTable ? { asTable: true } : {}),
            ...(spec.alsoSaid.asSentence ? { asSentence: txt(spec.alsoSaid.asSentence) } : {}),
          },
        }
      : {}),
  };
}

/** `clock-face` — read, set, or match a time (PRD §7.2). */
export function clockFace(
  id: string,
  ask: string,
  spec: {
    mode: ClockFaceActivity['mode'];
    hour: number;
    minute: number;
    second?: number;
    target?: { hour: number; minute: number; second?: number };
    show: ClockFaceActivity['show'];
    format: ClockFaceActivity['format'];
    say: string;
  },
): ClockFaceActivity {
  return {
    id,
    type: 'clock-face',
    prompt: prompt(ask),
    mode: spec.mode,
    hour: spec.hour,
    minute: spec.minute,
    ...(spec.second !== undefined ? { second: spec.second } : {}),
    ...(spec.target ? { target: spec.target } : {}),
    show: spec.show,
    format: spec.format,
    say: txt(spec.say),
  };
}

/**
 * `chance-trial` — toss, roll or spin (PRD §7.2, §1.1 rule 4).
 *
 * **There is no `seed` parameter and there will never be one.** The trial is
 * `Math.random()`, unseeded and unfiltered, inside `ChanceTrial.tsx`.
 */
export function chanceTrial(
  id: string,
  ask: string,
  spec: {
    kind: ChanceTrialActivity['kind'];
    trials: number;
    outcomes: Array<[string, string, string]>;
    ask: string;
  },
): ChanceTrialActivity {
  return {
    id,
    type: 'chance-trial',
    prompt: prompt(ask),
    kind: spec.kind,
    trials: spec.trials,
    outcomes: spec.outcomes.map(([oid, emoji, label]) => ({ id: oid, emoji, label: txt(label) })),
    ask: prompt(spec.ask),
  };
}

/* ------------------------------------------------------------ topic build */

export interface LessonSpec {
  /** Unique within the topic; the full id becomes `${topicId}-${id}`. */
  id: string;
  title: string;
  emoji: string;
  activities: Activity[];
  kind?: 'lesson' | 'challenge';
  /** Set only where a lesson carries a badge of its own (Star Challenges). */
  badge?: Badge;
  colour?: string;
}

export interface TopicSpec {
  id: string;
  term: TermNumber;
  /**
   * Inclusive ATP week range within the term — **the CAPS topic's own printed
   * week columns** (PRD §5.3). This ATP draws its topic headings across ranges,
   * so *Adding And Taking Away* is `[4, 6]`.
   */
  weeks: [number, number];
  /** The content area. One per topic, and it is a label, not a spine (§5.2). */
  area: ContentArea;
  /**
   * **The hours the ATP gives this topic** (PRD §5.3, §10).
   *
   * `lessons.length` must equal `round(atpHours / 3)` clamped 2–6, and the
   * validator enforces it. A Star Challenge carries `0`.
   */
  atpHours: number;
  atpWeeks: number;
  skills: string[];
  makeTask?: string;
  /**
   * **Skills first taught here** and **skills that must already exist** — the
   * prerequisite ladder (PRD §8.2). These mirror `LADDER` in `ladder.ts`; the
   * validator checks that the topic's declared `teaches`/`requires` match the
   * ladder rung and that no `requires` is a forward reference.
   */
  teaches: string[];
  requires: string[];
  title: string;
  emoji: string;
  colour: string;
  /**
   * Plain-language note for the parent zone (PRD §6.7, §2.1 goal 12).
   *
   * Written for an adult who may read English less confidently than their
   * child: two or three sentences, no CAPS vocabulary, spoken on tap. **In this
   * subject it names the one thing the fortnight is actually for**, because "we
   * did fractions" tells an adult nothing.
   */
  parentNote: string;
  /** Awarded when every lesson in the topic is finished (PRD §6.9). */
  badge: { emoji: string; title: string };
  /** Dead in this app and kept on purpose (PRD §5.7). Defaults to empty. */
  languageItems?: string[];
  /** The topic's taught mathematical vocabulary — the word wall (PRD §8.3). */
  words: string[];
  /** The kinds of text this topic reads. Usually a worked example and a word
   *  problem (PRD §7.4). */
  textTypes: TextType[];
  /**
   * Inherited from the Life Skills lineage, **unused here** — mathematics
   * cannot hurt a child (PRD §8.3, §18.1 finding 1). It ships on no topic.
   */
  careful?: true;
  /**
   * **`round(atpHours / 3)` clamped 2–6 of them**, sized by the topic's hours
   * (PRD §5.3). A Star Challenge is the only topic with one lesson.
   */
  lessons: LessonSpec[];
}

export interface BuiltTopic {
  topic: Topic;
  lessons: Lesson[];
}

/**
 * One CAPS topic and its lessons. The topic hands its subject, colour and
 * ordering down, so a lesson spec only ever states what is actually about that
 * lesson.
 */
export function buildTopic(spec: TopicSpec): BuiltTopic {
  const topic: Topic = {
    _id: spec.id,
    subjectId: SUBJECT_ID,
    term: spec.term,
    weekStart: spec.weeks[0],
    weekEnd: spec.weeks[1],
    area: spec.area,
    atpHours: spec.atpHours,
    atpWeeks: spec.atpWeeks,
    skills: spec.skills,
    ...(spec.makeTask ? { makeTask: spec.makeTask } : {}),
    teaches: spec.teaches,
    requires: spec.requires,
    title: txt(spec.title),
    emoji: spec.emoji,
    colour: spec.colour,
    badge: {
      id: `${spec.id}-badge`,
      emoji: spec.badge.emoji,
      title: txt(spec.badge.title),
    },
    parentNote: txt(spec.parentNote),
    languageItems: spec.languageItems ?? [],
    words: spec.words,
    textTypes: spec.textTypes,
    ...(spec.careful ? { careful: true as const } : {}),
  };

  const lessons: Lesson[] = spec.lessons.map((lesson, index) => ({
    _id: `${spec.id}-${lesson.id}`,
    subjectId: SUBJECT_ID,
    topicId: spec.id,
    orderInTopic: index,
    title: txt(lesson.title),
    emoji: lesson.emoji,
    colour: lesson.colour ?? spec.colour,
    area: spec.area,
    badge: lesson.badge ?? null,
    kind: lesson.kind ?? 'lesson',
    activities: lesson.activities,
  }));

  return { topic, lessons };
}

export function collect(built: BuiltTopic[]): { topics: Topic[]; lessons: Lesson[] } {
  return {
    topics: built.map((entry) => entry.topic),
    lessons: built.flatMap((entry) => entry.lessons),
  };
}

/** Shorthand palettes so tiles across a term stay in the same family. */
export const palette = colours;
