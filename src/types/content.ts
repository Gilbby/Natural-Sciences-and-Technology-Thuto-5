/**
 * Content model — PRD §10.
 *
 * These shapes are deliberately MongoDB-collection-friendly: every document has
 * an `_id`, text is keyed by language code, and nothing here knows about React,
 * storage or the network. Moving to a real backend is a transport change only.
 *
 * *Mathematics Thuto 5* is the family's **third vertical fork** — same subject,
 * next grade, same phase. Its engine came from *Life Skills Thuto 5* rather
 * than from *Mathematics Thuto 4*, because the Grade 4 Mathematics repo was not
 * on disk and only its APK was, exactly as PRD §14 decision 1 and §16.6 finding
 * 1 warned it might not be.
 *
 * **Six things change here, and they are the largest type delta in this
 * family's history** (PRD §15.1):
 *
 *   1. **`ContentArea` replaces `StudyArea`** — CAPS Intermediate Phase
 *      Mathematics has exactly five: NUM, PAT, SPA, MEA, DAT. **It is a label
 *      on a topic and a column in the progress record, and it is not a spine.**
 *      In Life Skills a topic was four lessons because it had three study
 *      areas; here a topic is one content area and **its lessons are sized by
 *      the hours the ATP gives it** (PRD §5.2, §5.3);
 *   2. **`atpHours` arrives on `Topic`, and it looks like documentation and is
 *      not.** It is the only place the ATP's own weighting survives into the
 *      codebase, and the validator checks `lessons.length` against
 *      `round(atpHours / 3)` clamped 2–6. **This ATP gives one topic eighteen
 *      hours and another six**, and without this field the next author gives
 *      them the same four lessons (PRD §5.3, §10, §11);
 *   3. **`teaches` and `requires` arrive on `Topic`** — the prerequisite
 *      ladder, and **this is the file this fork exists to write.** Mathematics
 *      is the first subject in this family whose content is strictly cumulative
 *      within itself, the ATP prints a `PREREQUISITE SKILL OR PRE-KNOWLEDGE`
 *      row under every single topic, and the app makes that row executable. **A
 *      forward reference fails the build** (PRD §1.1 rule 3, §8.2, §11 check 1);
 *   4. **`ChoiceOption.why` is re-pointed and `fromStepId` arrives.** The shape
 *      is borrowed from *Life Skills Thuto 5*'s open question and **pointed the
 *      opposite way**: there a `why` says what an answer *commits you to* and
 *      there is no right one; here it says what an answer *did* and there is
 *      exactly one right one. **It never says the child was wrong**
 *      (PRD §1.1 rule 2, §6.5b, §11 check 2);
 *   5. **Six activity types arrive** — `place-value`, `number-line`,
 *      `fraction-bar`, `flow-diagram`, `clock-face`, `chance-trial`. That is
 *      more than the previous eight forks added between them, and it is not
 *      scope creep: **fifteen apps' worth of components are about words and
 *      pictures, and a number is not a word** (PRD §7.2, §7.3);
 *   6. **`read-text` gains `worked-example`**, and it is this subject's spine.
 *      In the language apps a topic is held together by a text the child reads;
 *      here it is held together by a worked example she reads — same component,
 *      same tap-to-hear-every-word, same anchoring of questions back to a line
 *      (PRD §6.5a, §7.4).
 *
 * **Nothing is deleted and nothing is re-levelled.** `careful` survives on
 * `Topic` and `src/content/care.ts` ships with an empty register, because
 * *"mathematics cannot hurt a child"* is the shared care guide's own sentence —
 * the exact mirror of the `ladder.ts` that shipped dead in *Life Skills Thuto
 * 5* and is load-bearing here (PRD §15.2, §18.1 finding 1).
 *
 * A `Gloss` is still a meaning **and a picture**, both required. This child is
 * taught Mathematics in a language she does not speak at home, so a meaning
 * written in English explains one unknown word with five more. **The
 * mathematical vocabulary is exempt from the word budget and never from the
 * gloss** (PRD §1.1 rule 5, §8.3).
 *
 * > **And note what is deliberately absent, for the first time in a subject
 * > where every competitor has it:** there is no field anywhere in this file or
 * > in `progress.ts` for **time taken**, for a **streak**, for a **best score**
 * > or for **how many a child got wrong in a row**. A field that does not exist
 * > cannot be surfaced by a later feature (PRD §1.1 rule 1, §10, §11 check 5).
 */

/** English first; the model holds the rest for later (PRD §2.2, §12). */
export type LanguageCode = 'en' | 'nso' | 'ts' | 've' | 'zu' | 'xh' | 'af';

/** Every user-facing string is keyed by language. `en` is always present. */
export type LocalisedText = Partial<Record<LanguageCode, string>> & { en: string };

/**
 * What the app says out loud. `audio` points at pre-recorded voice-over once it
 * exists; until then `text` is spoken by device TTS through the same helper, so
 * swapping in real VO never touches a component.
 *
 * For a FAL app that swap matters more than anywhere else in the family, for
 * the homograph reason in PRD §9.1: a device voice that reads *read* wrong does
 * not confuse this child, it teaches them a wrong word.
 */
export interface AudioPrompt {
  audio?: string;
  text: LocalisedText;
}

/**
 * The five content areas of CAPS Intermediate Phase Mathematics (PRD §5.2).
 *
 *   NUM  Numbers, Operations and Relationships
 *   PAT  Patterns, Functions and Algebra
 *   SPA  Space and Shape (Geometry)
 *   MEA  Measurement
 *   DAT  Data Handling, including Probability
 *
 * Carried unchanged from *Mathematics Thuto 4*, spoken labels and all. This
 * ATP's eighteen topics fall into exactly these five.
 *
 * > **Note what this list does *not* do. It does not drive the lesson split.**
 * > In *Life Skills Thuto 5* — the repo this engine came from — a topic was
 * > four lessons because it had three study areas, and `studyAreas` was a
 * > plural on both `Topic` and `Lesson`. **Here a topic is exactly one content
 * > area and its lessons are sized by hours** (PRD §5.3). The area is a label
 * > on the topic and a column in the progress record, and the singular is the
 * > point: a topic that needed two of these would be two topics.
 */
export type ContentArea = 'LIF' | 'MAT' | 'ENE' | 'EAR';

/**
 * One nameable thing a child can do — PRD §8.2. **[new, and load-bearing.]**
 *
 * *"Fractions"* is not a skill. *"Adding two fractions that have the same
 * denominator"* is. Roughly sixty of them across the year, each **taught in
 * exactly one topic** and each **used by an activity in that topic**.
 *
 * Two rules keep the list honest, and the validator enforces both:
 *
 *   1. **A skill's `name` is what the app would say to the child**, not what a
 *      teacher would write on a report. `'rounding to the nearest thousand'`,
 *      never `'rounding to a specified place value'`;
 *   2. **A skill taught in two places is a bug in the sheet, not a feature of
 *      the subject.** If two topics both want to teach *estimating*, one of
 *      them requires it and the other teaches it.
 *
 * **The child never meets this type.** It is a check on the author, run at
 * build time. It is not adaptivity, it does not track what this child knows,
 * and it unlocks and locks nothing (PRD §8.2c, §2.2).
 */
export interface Skill {
  /** `'round-to-nearest-1000'` — `{verb}-{object}`, lower kebab (PRD §18.4). */
  id: string;
  /** Said out loud, in the child's words. Never in a teacher's. */
  name: string;
}

/**
 * One topic's rung of the prerequisite ladder — PRD §8.2.
 *
 * The check, and it is check 1: walk the topics in schedule order; for every
 * topic, every id in `requires` must appear in the `teaches` of a **strictly
 * earlier** topic, or in `ARRIVES_WITH`. **A forward reference fails the
 * build.**
 */
export interface LadderEntry {
  topicId: string;
  /** Skills first taught here. A skill appears in exactly one `teaches`. */
  teaches: string[];
  /** Skills that must already have been taught, or be in `ARRIVES_WITH`. */
  requires: string[];
}

/**
 * Where the child has to be able to stand to do a movement — PRD §6.5b.
 *
 * **Required on every movement or making call**, and it is the first half of
 * rule 1: the app calls a movement only when it can be sure of the room it
 * cannot see. The four values are the whole vocabulary, deliberately, because a
 * fifth would be a judgement call and this is not the file for one.
 *
 *   `standing`      you can do it without moving your feet or your arms far
 *   `one-arm`       you need to be able to stretch one arm out and turn round
 *   `a-few-steps`   you need three or four steps in one direction
 *   `outdoors-open` you need to be outside with room to run
 *
 * The last one is the only one that assumes anything, and every call that uses
 * it says so in its safety line.
 */
export type MovementSpace = 'standing' | 'one-arm' | 'a-few-steps' | 'outdoors-open';

/** The four school terms. */
export type TermNumber = 1 | 2 | 3 | 4;

/**
 * The kinds of text this subject reads. **Three, and it is a rendering hint.**
 *
 * *English FAL Thuto 5* had eleven of these because in a language ATP the text
 * type **is** the curriculum — a topic is *named* for the text it reads. **This
 * one is not.** A mathematics ATP names topics, concepts and skills, and the
 * text is how the app carries them. **A fork that grows this union has
 * misunderstood what it is for** (PRD §7.4).
 *
 *   `worked-example`  **this subject's spine** — PRD §6.5a. Every topic opens
 *                     with one. Its lines are numbered **steps**, the working
 *                     is set aligned, every step speaks on tap, and any
 *                     question in the topic may point back at one with
 *                     `fromStepId`. It is what `read-text` is *for* here.
 *   `word-problem`    the ATP's own contexts — *financial*, *measurement*,
 *                     *comparing two or more quantities of the same kind
 *                     (ratio)*, *comparing two quantities of different kinds
 *                     (rate)*. **Every topic ends in one** (PRD §5.3).
 *   `information`     a definition, a unit table, a set of instructions.
 *
 * > **The worked example is not decoration and it is not a hint.** It is the
 * > thing the lesson is about, and the child comes back to it three times: it
 * > opens the lesson, the build activity does what it did with the numbers
 * > changed, and a wrong tap replays the step the answer came from. **An app
 * > that shows a worked example once at the top and never refers to it again
 * > has printed a textbook page** (PRD §6.5a).
 *
 * > **A text *type* is what it is; a *layout* is how it is set.** They are
 * > different fields and they do not have to agree. `TextLayout` is inherited
 * > whole and was not cut down (PRD §15.2).
 */
export type TextType =
  | 'worked-example'
  | 'word-problem'
  | 'information';

/**
 * The interaction component library — PRD §7. **Twenty types: fourteen
 * inherited, none deleted, and six added.**
 *
 * Third fork running with an empty deletion table, and **the largest component
 * delta in this family's history** (PRD §7.2). It is not scope creep. It is the
 * first fork where **the subject's content cannot be expressed in the existing
 * shapes.** Fifteen apps' worth of components are about words and pictures —
 * sort them, order them, match them, choose one. **A number is not a word and a
 * shape is not a picture of a shape.** A child cannot learn place value by
 * sorting cards that say *"hundreds"*; she has to build 342 706 and watch the 7
 * sit in the hundreds column.
 *
 * ── The six, and what each exists for ─────────────────────────────────────
 *
 *   `place-value`   build and break down a number in columns to six digits.
 *                   Tap a digit to hear its **value**, not its name: the 7 in
 *                   342 706 says *"seven hundred"*
 *   `number-line`   a line with marks. Place a number, jump along it, see which
 *                   of two marks it is nearer. **The ATP names this tool by
 *                   name** — *"using a number line"* — so the app uses the tool
 *   `fraction-bar`  a bar cut into equal parts. Shade, compare two bars, add
 *                   two with the same denominator, see two names for one amount
 *   `flow-diagram`  input, a rule, output. **Fill any one of the three from the
 *                   other two.** The ATP prints *"input and output values"*
 *                   four times
 *   `clock-face`    an analogue face and a digital readout, side by side and
 *                   **always agreeing**. Set one, read the other
 *   `chance-trial`  toss, roll or spin, up to twenty trials, with a tally that
 *                   builds. **Real randomness** (PRD §1.1 rule 4)
 *
 * Four of the ATP's five content areas are about quantities the child has to
 * hold **two ways at once**, and each of the first four components is that made
 * literal. **The one thing a phone is genuinely better at than a worksheet is
 * showing the same quantity two ways at once** (PRD §4 principle 7, §6.5c).
 *
 * ── What deliberately did *not* become a seventh ──────────────────────────
 *
 * PRD §7.3 is the list, and it is longer than the list above: a 2-D or 3-D
 * shape is `SourceFigure` + `sort-baskets`; a net to fold is `SourceFigure` +
 * `sequence` + `doItYourself`; area by counting squares is `SourceFigure` on a
 * grid + `select`; tessellation is `draw-canvas` on a grid; a tally chart is
 * `select` + `SourceFigure`; a graph to *read* is `SourceFigure`; a graph to
 * **build** is `assign-slot`; a balance scale is `SourceFigure`. **A calculator
 * is nothing, ever.**
 *
 * > **`spell-word` survives and is used.** It looks like a language type and it
 * > is not: it is how *forty-two thousand three hundred and six* gets built out
 * > of parts, and it is how the Term 3 data vocabulary — *pictograph*,
 * > *frequency*, *mode* — goes onto the word wall. **Do not delete it because
 * > the subject changed** (PRD §7.1).
 */
export type ActivityType =
  | 'sort-baskets'
  | 'select'
  | 'sequence'
  | 'match-connect'
  | 'assign-slot'
  | 'explore-cards'
  | 'listen-choose'
  | 'draw-canvas'
  | 'memory-match'
  | 'move-along'
  | 'habit-tracker'
  | 'read-text'
  | 'spell-word'
  | 'beat-along'
  // ── the six, PRD §7.2 ──
  | 'place-value'
  | 'number-line'
  | 'fraction-bar'
  | 'flow-diagram'
  | 'clock-face'
  | 'chance-trial';

/**
 * A drawn figure — PRD §7.5. **Borrowed. Fourth lineage to hold this
 * component, and the one that needs it most.**
 *
 * **Thirty-six for the year** — three and a half times the Life Skills app's
 * ten, and more than the three existing lineages have between them. This
 * subject is *made* of figures (PRD §7.5, §18.5).
 *
 * > **The extraction is overdue and this build did not do it.** PRD §18.8 #1
 * > recommends extracting `SourceFigure.tsx` and `src/figures/` into a shared
 * > package **before** this fork, and §13 makes it phase 0. It did not happen
 * > here: there is no monorepo or workspace across the Thuto repos to extract
 * > *into*, and inventing one is a change to how five shipped apps are built —
 * > which is a bigger and riskier decision than this build is allowed to make
 * > on its own. **So this is the fourth copy, and the README says so.** The
 * > count-based trigger has now fired twice and been ignored twice; it is still
 * > the trigger that works (PRD §18.1 finding 6).
 *
 * The house rules come across with the file:
 *
 *   - **Figures are drawn, not photographed.** Strokes tint for a theme, scale
 *     to a 360 dp screen and can have one part lit when the child taps a label.
 *   - **Every figure carries a spoken description that answers the question
 *     without the picture** (PRD §4 principle 9, §7.5). **In this subject that
 *     rule bites hardest, because half the figures *are* the question.**
 *     *"A bar graph with four bars — walk is 24, taxi is 16, bus is 9, car is
 *     5"* lets a child who cannot see it answer *"which is the most?"*.
 *     *"A bar graph of how we get to school"* does not, and it passes a length
 *     check. The validator fails the build on a description with no numbers in
 *     it where the figure carries numbers (PRD §11).
 *   - The description does not count against the ramp's word ceiling — it is
 *     the app's own voice, in the same class as a prompt (PRD §8.4).
 *
 * ── Two of them are wrong on purpose ──────────────────────────────────────
 *
 * `fig-bar-graph-read-wrongly` and `fig-pictograph-read-wrongly` exist because
 * the ATP's verb is ***"critically read and interpret"*** — a bar graph with no
 * zero on its axis, and a pictograph where the key says one picture is five but
 * a row has been counted as ones. **A child who has only ever been shown
 * correct graphs has not been taught to read one critically.** Both are listed
 * in `docs/facts.md` as deliberately misleading, because a register that only
 * names the honest figures does not tell you which the others are.
 */
export type FigureId =
  // 2D shapes
  | 'fig-triangle-kinds'
  | 'fig-quadrilaterals'
  | 'fig-regular-and-irregular'
  | 'fig-pentagon-hexagon-heptagon'
  | 'fig-circle-parts'
  | 'fig-sides-straight-and-curved'
  | 'fig-line-symmetry'
  | 'fig-shapes-on-grid-paper'
  // 3-D objects and their nets
  | 'fig-rectangular-prism'
  | 'fig-net-of-a-rectangular-prism'
  | 'fig-cube'
  | 'fig-net-of-a-cube'
  | 'fig-cylinder'
  | 'fig-net-of-a-cylinder'
  | 'fig-cone-and-pyramid'
  | 'fig-net-of-a-pyramid'
  // Graphs
  | 'fig-tally-table'
  | 'fig-pictograph-many-to-one'
  | 'fig-bar-graph-how-we-get-to-school'
  | 'fig-bar-graph-read-wrongly'
  | 'fig-pie-chart-what-we-drink'
  | 'fig-pictograph-read-wrongly'
  // Instruments
  | 'fig-ruler-against-a-pencil'
  | 'fig-tape-measure'
  | 'fig-trundle-wheel'
  | 'fig-measuring-jug'
  | 'fig-kitchen-scale'
  | 'fig-bathroom-scale'
  // Grids
  | 'fig-area-by-counting-squares'
  | 'fig-irregular-area-on-a-grid'
  | 'fig-tessellation-of-hexagons'
  | 'fig-slide-turn-flip'
  // Number and fraction
  | 'fig-stave-of-number-lines'
  | 'fig-fraction-wall'
  | 'fig-array-6-by-4'
  | 'fig-place-value-chart';

export const ALL_FIGURES: readonly FigureId[] = [
  // 2D shapes
  'fig-triangle-kinds',
  'fig-quadrilaterals',
  'fig-regular-and-irregular',
  'fig-pentagon-hexagon-heptagon',
  'fig-circle-parts',
  'fig-sides-straight-and-curved',
  'fig-line-symmetry',
  'fig-shapes-on-grid-paper',
  // 3-D objects and their nets
  'fig-rectangular-prism',
  'fig-net-of-a-rectangular-prism',
  'fig-cube',
  'fig-net-of-a-cube',
  'fig-cylinder',
  'fig-net-of-a-cylinder',
  'fig-cone-and-pyramid',
  'fig-net-of-a-pyramid',
  // Graphs
  'fig-tally-table',
  'fig-pictograph-many-to-one',
  'fig-bar-graph-how-we-get-to-school',
  'fig-bar-graph-read-wrongly',
  'fig-pie-chart-what-we-drink',
  'fig-pictograph-read-wrongly',
  // Instruments
  'fig-ruler-against-a-pencil',
  'fig-tape-measure',
  'fig-trundle-wheel',
  'fig-measuring-jug',
  'fig-kitchen-scale',
  'fig-bathroom-scale',
  // Grids
  'fig-area-by-counting-squares',
  'fig-irregular-area-on-a-grid',
  'fig-tessellation-of-hexagons',
  'fig-slide-turn-flip',
  // Number and fraction
  'fig-stave-of-number-lines',
  'fig-fraction-wall',
  'fig-array-6-by-4',
  'fig-place-value-chart',
] as const;

interface ActivityBase {
  id: string;
  type: ActivityType;
  prompt: AudioPrompt;
  /** Spoken when the child needs a nudge. Falls back to the prompt. */
  hint?: AudioPrompt;
  /**
   * A drawn figure shown above the activity — PRD §7.4.
   *
   * It sits on the base rather than on one activity type because a visual-text
   * lesson names **the same figure in three of its four activities**: read the
   * graph, say what it says, turn it into sentences. The child keeps looking at
   * one picture while the questions change, which is what the ATP's *"transfers
   * information from the visual to narrative form"* actually asks for.
   *
   * A figure named here must have an entry in `FIGURE_DESCRIPTIONS`; the
   * validator fails the build without one.
   */
  figure?: FigureId;
  /**
   * **The claim this activity makes about the real world** — PRD §1.1 rule 2,
   * §11 check 4. **[new, and load-bearing.]**
   *
   * Set on any activity presenting a **cause, a symptom, a treatment, a
   * festival, a custom, a dietary guideline or a phone number**. The value is a
   * key into `docs/facts.md`, which carries the claim, a South African
   * public-health or DBE source, and — for a festival or a food — how the word
   * is said. **A ref with no line in that file fails the build.**
   *
   * > **An activity with no `factRef` is asserting that it makes no claim about
   * > the real world.** That is a perfectly good thing to assert about a story
   * > where Naledi drops her lunch. **It is a lie about a paragraph on how
   * > malaria spreads**, and this field is how the app says which of the two it
   * > is doing.
   *
   * This is *Social Sciences Thuto 4*'s facts discipline, pointed at health
   * instead of history. Note that *English FAL Thuto 5* was told explicitly
   * **not** to copy `docs/facts.md`, and it was right: its figures were
   * invented data about invented schools. **This is the app that does copy it**
   * (PRD §18.1 finding 4).
   */
  factRef?: string;
}

/** A tappable picture. Emoji + colour now, illustrated art later (PRD §9). */
export interface PictureItem {
  id: string;
  emoji: string;
  label: LocalisedText;
}

export interface Basket {
  id: string;
  emoji: string;
  label: LocalisedText;
  colour: string;
}

/**
 * Tap an item, tap the basket it belongs in. Naming words and doing words,
 * past and present, fact and opinion, statement or question.
 */
export interface SortBasketsActivity extends ActivityBase {
  type: 'sort-baskets';
  baskets: Basket[];
  items: Array<PictureItem & { basketId: string }>;
}

/**
 * Tap all the correct items (or just one).
 *
 * **This is the editing step of the writing process** (PRD §6.5b) and the best
 * fit in the whole ATP for a tap app: tap the word that is wrong, tap where the
 * full stop goes, tap every verb, tap the words that try to persuade you.
 */
export interface SelectActivity extends ActivityBase {
  type: 'select';
  /** `all` = find every correct item; `one` = a single right answer. */
  selectMode: 'all' | 'one';
  items: Array<PictureItem & { correct: boolean }>;
}

/**
 * Tap the cards in the right order. Retell the events; order the recipe steps;
 * put the paragraphs in order; Who · What · When · Where · Why · How.
 */
export interface SequenceActivity extends ActivityBase {
  type: 'sequence';
  items: Array<PictureItem & { order: number }>;
}

/**
 * Tap a pair to link them. Word ↔ meaning, word ↔ picture, character ↔ what
 * they did, singular ↔ plural, idiom ↔ what it really means.
 */
export interface MatchConnectActivity extends ActivityBase {
  type: 'match-connect';
  pairs: Array<{ id: string; left: PictureItem; right: PictureItem }>;
}

/**
 * Place one item into each labelled slot — the writing frame, the mind map,
 * headline / by-line / lead paragraph.
 *
 * Unlike `sort-baskets`, every slot takes exactly one item, so the child sees a
 * completed set at the end rather than an emptied tray. That is why it is the
 * **planning** step of the writing process (PRD §6.5b).
 */
export interface AssignSlotActivity extends ActivityBase {
  type: 'assign-slot';
  slots: Array<{ id: string; emoji: string; label: LocalisedText; colour: string }>;
  items: Array<PictureItem & { slotId: string }>;
}

/**
 * Tap a card to hear a fact about it. The glossary of the cycle; what a by-line
 * is; what a limerick is; **the punctuation marks, shown as glyphs and named
 * aloud** (PRD §9.1 rule 3).
 */
export interface ExploreCardsActivity extends ActivityBase {
  type: 'explore-cards';
  cards: Array<PictureItem & { fact: AudioPrompt }>;
}

/**
 * One option in a `listen-choose` round.
 *
 * `why` is required when the round is open and forbidden when it is not — the
 * validator enforces both ends, because a `why` on a closed question is a
 * second answer key and an open round without one is a shrug.
 */
export interface ChoiceOption extends PictureItem {
  /**
   * **What this answer *did*** — PRD §1.1 rule 2, §6.5b, §11 check 2.
   * **[re-pointed, and rule 2 lives here.]**
   *
   * `407 − 8 = 401` is not carelessness. It is one specific, nameable,
   * extremely common thing: **subtracting the smaller digit from the larger
   * one, column by column.** A wrong option may carry a `why` that names it —
   * flatly, in the child's own arithmetic, without scoring it:
   *
   *     ['b', '🔢', '401', 'That takes the 8 away from the 9 in the tens.
   *                         The 0 is in the way, so we take a ten from the
   *                         4 hundreds first.']
   *
   * Four rules, and the validator enforces all four:
   *
   *   1. **Only on a wrong option.** A `why` on the right answer is a second
   *      answer key;
   *   2. **It never says *wrong*, *no*, *not right*, *incorrect*, *mistake*,
   *      *careless*, *silly*, *should have*, *you failed* or *try harder*.**
   *      A closed list, and the build fails on any of them;
   *   3. **No praise either.** The inherited praise bank stays banned here —
   *      a `why` that congratulates has reintroduced the mark;
   *   4. **It is optional.** A distractor that exists only to be a third option
   *      carries none. **Inventing a misconception for one is worse than
   *      leaving it bare** (PRD §18.5).
   *
   * > **This is the borrow that makes this app different from every maths app
   * > on a phone.** The shape comes from *Life Skills Thuto 5*'s open question
   * > and it is **pointed the opposite way**: there a `why` says what an answer
   * > *commits you to* and there is no right one; here it says what an answer
   * > *did* and there is exactly one right one.
   *
   * **The validator prints every `why` in the app and a person reads the list**
   * — by preference somebody who was bad at maths at school, who will hear a
   * tone a mathematician cannot (PRD §17 test 5).
   */
  why?: LocalisedText;
}

/**
 * Hear a question, tap the matching picture or word card. Comprehension after a
 * text — literal, inferential, and "what does the writer want you to do?".
 *
 * ── The open mode — PRD §7.2, §6.5f. **The one component edit of this fork.**
 *
 * This ATP is the first in the family to print *"Asks critical questions which
 * do not have obvious answers"* and *"Responds thoughtfully to critical
 * questions"* — in Term 4 weeks 3–4 it prints both, in **both** the Listening
 * and the Reading column — alongside *"Expresses and justifies own opinion with
 * reasons"* in six cycles.
 *
 * A round with `open: true` has **no `answerId`**. Every option is accepted on
 * the first tap, the option's `why` is spoken back, the option is marked
 * *chosen* rather than *correct*, and there is no second attempt because there
 * is nothing to attempt.
 *
 * Three rules keep it from becoming a way to avoid writing distractors:
 *
 *   1. **`open` and `answerId` are mutually exclusive**, and this type says so
 *      as well as the validator.
 *   2. **An open round never appears in a Star Challenge** (PRD §6.9). A
 *      challenge is the app's celebration shape and it counts taps; an open
 *      question does not count, and mixing the two makes one of them dishonest.
 *   3. **A lesson carries at most one.** An open question is the point of a
 *      lesson, not a texture.
 *
 * And what is *not* stored: which option the child tapped (PRD §8.3). The app's
 * job was to ask.
 */
export type ListenChooseRound =
  | {
      id: string;
      question: AudioPrompt;
      options: ChoiceOption[];
      answerId: string;
      open?: undefined;
      /**
       * **The step of the worked example this answer comes from** — PRD §7.4,
       * §6.5b. **[new.]**
       *
       * The direct inheritance of `fromLineId` from the language apps, and it
       * does the same job: **a wrong tap replays that step**, exactly as a
       * wrong tap in the language apps replays the line of the text the answer
       * came from.
       *
       * It points at a `TextLine.id` in the topic's `worked-example` — `'l4'`,
       * `'l7'` — and the validator checks that the step exists.
       */
      fromStepId?: string;
    }
  | {
      id: string;
      question: AudioPrompt;
      options: ChoiceOption[];
      answerId?: undefined;
      open: true;
      fromStepId?: undefined;
    };

export interface ListenChooseActivity extends ActivityBase {
  type: 'listen-choose';
  rounds: ListenChooseRound[];
}

/**
 * Finger-draw with big crayons. Design the poster; draw the setting; draw what
 * the idiom would look like if it were literal.
 */
export interface DrawCanvasActivity extends ActivityBase {
  type: 'draw-canvas';
  /** Crayon colours offered to the child. */
  colours?: string[];
}

/**
 * A letter, letter group or word part the child sees and hears.
 *
 * `say` is separate from `label` on purpose. A device asked to read a bare `ck`
 * gives you two letter names, which is the one thing a language app must never
 * teach (PRD §9.1). A missing `say` fails the build (PRD §11).
 */
export interface SoundItem {
  id: string;
  label: LocalisedText;
  say: LocalisedText;
}

/**
 * The Word Wall's build step, and the draft step of the writing process —
 * PRD §6.6, §6.5b.
 *
 * The child hears a word and builds it from tiles. At Grade 5 FAL this is not a
 * phonics drill: it is how a word the child has just met gets into their hands
 * before it goes on the wall. **The Word Wall collects, it does not test.**
 */
export interface SpellWordActivity extends ActivityBase {
  type: 'spell-word';
  /** The word being built. */
  word: LocalisedText;
  /** How to say it — separate from the spelling, as always (PRD §9.1). */
  say: LocalisedText;
  /** Heard once the word is built, so it lands in a meaning. */
  sentence: AudioPrompt;
  emoji: string;
  /** The language item or cycle this word belongs to; a rung of the ladder. */
  pattern: string;
  /** The tiles offered — the word's own parts plus two or three distractors. */
  tiles: SoundItem[];
}

/**
 * How a text's lines are laid out — PRD §7.3.
 *
 * `prose` is the default and always has been, so every inherited text stays
 * valid unchanged. **The union closes at six**: `table` and `message` are this
 * fork's two additions, and adding a seventh is a design decision, not an
 * authoring convenience.
 *
 *   `table`    T2 w7–8 *"tables/ charts/ graphs"*, T4 w5–6 *"maps/ graphs/
 *              charts/ tables"*. A real grid — column heads, row heads, cells.
 *   `message`  T1 w1–2 *"Reads social texts, e.g., SMS/ email"*. A thread or an
 *              email: sender, subject, bubbles, time, sign-off.
 *
 * > **Every region is still a `TextLine` with real words in it, and every word
 * > still speaks on tap.** A table is not an image; it is a text with a shape.
 * > **If a region cannot be read aloud, it does not belong in the activity** —
 * > which is exactly why a bar graph is a `figure` and not a layout (PRD §7.4).
 */
export type TextLayout = 'prose' | 'poster' | 'chart' | 'article' | 'table' | 'message';

/**
 * What a line *is* within a laid-out text. Absent in prose.
 *
 * The ATP asks the child to read the **layout** — "Identifies features of
 * text", "Identifies the way the text is organised", "Uses headline, by-line,
 * lead paragraph", "Presents work neatly using the proper format such as
 * headings, spacing for paragraphs" — and a stack of lines has no layout to
 * read.
 *
 * Nine roles are inherited; nine are new, and they are the two new layouts'
 * regions. **A role belongs to exactly one layout family**, which is what lets
 * the validator catch a `sender` line inside a table.
 */
export type LineRole =
  // prose, poster, chart, article — inherited
  | 'headline'
  | 'byline'
  | 'lead'
  | 'body'
  | 'image'
  | 'caption'
  | 'label'
  | 'value'
  | 'fine-print'
  // table — the grid the ATP calls a table (PRD §7.3)
  | 'column-head'
  | 'row-head'
  | 'cell'
  // message — the SMS and the email (PRD §6.5d, §7.3)
  | 'sender'
  | 'subject'
  | 'said-to-me'
  | 'said-by-me'
  | 'time'
  | 'sign-off';

/**
 * One line of a text. The line break is content, not layout: a Grade 5 FAL
 * reader loses their place in a paragraph block exactly as a Grade 3 reader
 * does, and the ramp's paragraph ceiling only means something because of it.
 */
export interface TextLine {
  id: string;
  text: string;
  /** An optional picture beside the line. It supports the text; it never
   * carries the meaning (PRD §4.4). */
  emoji?: string;
  /** Present only when the activity carries a non-prose layout (PRD §7.2). */
  role?: LineRole;
  /** Starts a new paragraph. Counted by the ramp check (PRD §8.3). */
  paragraphBreak?: boolean;
}

/**
 * A budgeted word, explained — PRD §8.2b. **The picture is required.**
 *
 * In the Grade 3 Home Language app a gloss was a meaning string, and that was
 * enough: the child spoke English and was short one word. This child does not
 * speak English at home, so a meaning written in English explains an unknown
 * word with five more unknown words. The picture is the part that actually
 * lands, and `scripts/check-content.ts` fails the build without one.
 */
export interface Gloss {
  meaning: LocalisedText;
  /** Required. PRD §1.1's second prohibition, made executable. */
  picture: string;
  /**
   * How to say the word, when a device voice would get it wrong (PRD §9.1).
   *
   * Inherited behaviour: *read*, *live*, *lead*, *wind*, *tear*, *row*,
   * *close*, *record*, *present*, *object*, *content*, *minute*, *use*,
   * *refuse*, *produce*, *project*. A device picks one, and the wrong one in a
   * First Additional Language app teaches a wrong word to a child with no way
   * to know.
   */
  say?: LocalisedText;
  /**
   * **[new] The same written word, said the other way** — PRD §9.1 caveat 2.
   *
   * *"Homophones, homonyms, polysemy"* is printed in this ATP's word-meaning
   * row twice, in term 2 weeks 3–4 and again in term 4 weeks 3–4. **In Grade 4
   * a device voice saying one spelling two ways was a defect the `say` field
   * suppressed. In Grade 5 it is the content the `say` field has to produce.**
   *
   * Set it only where the two readings are the lesson; the activity chooses
   * which to speak.
   */
  sayAlt?: LocalisedText;
}

/**
 * The component this app is for — PRD §7.1, §7.2.
 *
 * A text the child reads. Every word is a tap target and speaks itself, for
 * ever, in every term. The speaker button reads the whole thing with line
 * highlighting. `mode` sets **what happens on entry and nothing else**:
 * `app-first` reads the text once before the child does anything, `child-first`
 * waits in silence. That is the entire mechanical difference between term 1 and
 * term 4 — support is never withdrawn, only demoted (PRD §8.2c).
 *
 * `layout` is what this fork adds. A third of this ATP's texts are not prose: a
 * poster has a headline and fine print, a weather chart is a grid of labels and
 * values, a newspaper article has three named regions the child must be able to
 * point at. Every region is still a `TextLine` with real words in it, and every
 * word still speaks on tap — a poster here is a text with a shape, never an
 * image.
 */
export interface ReadTextActivity extends ActivityBase {
  type: 'read-text';
  /** `app-first` reads on entry; `child-first` waits. The ramp sets it. */
  mode: 'app-first' | 'child-first';
  textType: TextType;
  /** Absent means `prose` — the Grade 3 behaviour, exactly (PRD §7.2). */
  layout?: TextLayout;
  title: LocalisedText;
  emoji: string;
  lines: TextLine[];
  /**
   * The word budget made explicit (PRD §8.2b): every word in this text that is
   * not in the cumulative ledger, with what it means **and a picture**. At most
   * five; an unglossed one, or a gloss with no picture, fails the build.
   */
  gloss: Record<string, Gloss>;
  /** An optional comprehension question asked after the reading. */
  question?: {
    ask: AudioPrompt;
    options: PictureItem[];
    answerId: string;
    /** The line the answer came from, replayed on a wrong tap. Never a red X. */
    fromLineId?: string;
  };
  /**
   * A one-line reason this text departs from its term's ramp row. Present only
   * where an author has deliberately opted out, and printed by the validator so
   * that the exception is visible rather than silent (PRD §11).
   */
  rampException?: string;
}

/** Flip pairs from memory — synonym and antonym pairs, word and meaning. */
export interface MemoryMatchActivity extends ActivityBase {
  type: 'memory-match';
  /** Each becomes two face-down cards. Eight to ten pairs suits Grade 5. */
  cards: PictureItem[];
}

/**
 * Hear each step called, do it, tap done (PRD §7, §7.2).
 *
 * This carries everything the phone cannot do and must not pretend to: the
 * movement call, the making call, the speaking prompt, and the go-and-do-it
 * prompt. **The app calls the step and never watches, never listens, never
 * sees the result** (PRD §2.2).
 *
 * ── The safety line — PRD §1.1 rule 1, §7.2. **This fork's one component edit
 * that is a hard constraint rather than a feature.**
 *
 * Two-thirds of this ATP is a body, in a room the app cannot see, with no adult
 * in it. So a movement call carries three things an author cannot omit:
 *
 *   `space`   where the child has to be able to stand
 *   `safety`  **one sentence, spoken before the first step** — and it is a
 *             plain instruction about where to stand, never a warning about
 *             what could go wrong
 *   `kit`     what it needs, every entry a thing the child probably has, or
 *             `'nothing'`, which is the most common answer in the year
 *
 * They are optional on the *type* because `moveAlong()` still authors
 * everything that is not a movement — *"go and read it to somebody"*, *"tap
 * when you have"*. **A movement is authored with `practise()`, which requires
 * all three, and a movement authored with `moveAlong()` fails the build**
 * (PRD §7.2, §11 check 1). That is the point of having two names for one
 * component.
 *
 * The safety line renders **as content**: large, above the prompt, speaking on
 * tap like every other line, and spoken first on entry. It is not a toast, not
 * a footnote and not grey (PRD §12).
 */
export interface MoveAlongActivity extends ActivityBase {
  type: 'move-along';
  /** Each step is called out in turn; the child taps when they have done it. */
  steps: Array<{ id: string; emoji: string; label: LocalisedText; call: AudioPrompt }>;
  /** `freeze-go` adds the inhibitory-control game on top of the steps. */
  mode?: 'guided' | 'freeze-go';
  /**
   * Required on every movement or making call. **Spoken BEFORE the prompt.**
   *
   * Never a warning about what could go wrong — a plain instruction about where
   * to stand. *"Do this on a soft floor or on grass. Not on a bed, and not near
   * a table."* (PRD §1.1 rule 1, §11 check 1.)
   */
  safety?: LocalisedText;
  /** Required alongside `safety`. */
  space?: MovementSpace;
  /**
   * What it needs. Every entry is a thing the child probably has, or
   * `'nothing'` — and a lesson that requires the child to own something has
   * failed the child it was written for (PRD §4 principle 11).
   */
  kit?: string[];
}

/**
 * **The beat — PRD §7.3. The one new component in this fork, and it exists
 * because a crotchet is a sound.**
 *
 * The Creative Arts half of this ATP prints, across three of four terms:
 * *"Rhythm patterns of different note values (semibreve, minim, crotchet,
 * quaver and the equivalent rests), using body percussion and percussive
 * instruments"* · *"Notation of rhythms on single line stave"* · *"Musical
 * phrases with contrasts in dynamics"*.
 *
 * **Taught as a picture alone, a crotchet is a shape with a name and no
 * meaning**, and a child with no instrument, no teacher and no audio files has
 * met nothing. So the app plays it: `expo-haptics` for the pulse, `expo-speech`
 * for the count, the pattern twice, and the child taps when she has clapped
 * along. Nothing is measured, nothing is compared, and **the child cannot be
 * wrong** — it is `speakAlong`'s design applied to a beat instead of a
 * sentence.
 *
 * Three constraints, and they are all in the component's header comment too,
 * because this is exactly the kind of thing a later contributor deletes on
 * principle:
 *
 *   1. **It is not a timer.** The family's rule forbids timing the *child* —
 *      no countdown, no stopwatch, no "in a row". A played beat times nothing
 *      and scores nothing; it is the content, in the only medium the content
 *      has (PRD §1.1, §4 principle 10).
 *   2. **It never plays while another sound is playing.** A beat under a spoken
 *      line is noise (PRD §9.1 caveat 6).
 *   3. **Tempo stays between 60 and 100.** Below 60 a ten-year-old loses the
 *      pulse; above 100 the haptic motor on a budget Android smears the beats
 *      together (PRD §9.1 caveat 7).
 */
export interface BeatAlongActivity extends ActivityBase {
  type: 'beat-along';
  /** Beats per minute. **60–100**, and the validator fails outside it. */
  tempo: number;
  /**
   * One entry per beat position, 4, 8 or 16 of them.
   *
   * `rest` is silence, and it is half the lesson: the ATP names the rests
   * beside the notes every time it names the notes, and a child who has only
   * ever clapped has not met one.
   */
  pattern: Array<'semibreve' | 'minim' | 'crotchet' | 'quaver' | 'rest'>;
  /** Spoken before the pattern plays: *"Four beats. Clap on the long ones."* */
  ask: AudioPrompt;
  /** Optional stave figure showing the same pattern written down. */
  figure?: FigureId;
}

/**
 * Weekly star chart — the ATP's "Uses reading log/ card to manage reading
 * progress", printed in every cycle of the year (PRD §6.6).
 */
export interface HabitTrackerActivity extends ActivityBase {
  type: 'habit-tracker';
  habits: PictureItem[];
}

/* ══════════════════════════════════════════════════════════════════════════
 *  The six — PRD §7.2.
 *
 *  ~790 lines of new component, and it is the largest delta in this family's
 *  history. Every one of them exists because **the two-ways-at-once is the
 *  lesson**: a number is six digits in six columns, a fraction is parts of a
 *  bar, a rule is a machine with an input and an output.
 *
 *  **Every digit, every part and every mark in these six is a `size.touchMin`
 *  target** (PRD §12). They are the first components in this family where the
 *  *content itself* is the tap target rather than a card containing it.
 * ══════════════════════════════════════════════════════════════════════════ */

/** The six place-value columns this year uses, largest first. */
export type PlaceColumn =
  | 'hundred thousands'
  | 'ten thousands'
  | 'thousands'
  | 'hundreds'
  | 'tens'
  | 'ones';

/**
 * **Build and break down a number in columns** — PRD §7.2, §6.5c.
 *
 * The component that proves the whole idea, and the reason it is built first
 * (PRD §16.4): **342 706** is a number *and* six digits in six columns, and a
 * child who can only hold one of those cannot round it, cannot carry across a
 * zero, and cannot say why 40 000 is bigger than 9 999.
 *
 * **Tapping a digit speaks its *value*, not its name.** The 7 in 342 706 says
 * *"seven hundred"*. A component that said *"seven"* would have taught the
 * child to read a number left to right as a row of digits, which is exactly the
 * misreading place value exists to fix.
 *
 * Three modes, and they are the ATP's own three verbs:
 *
 *   `build`      make this number in the columns — *"count, order and
 *                represent"*
 *   `break-down` split it into what each column is worth — the ATP's
 *                *"building up and breaking down numbers"*
 *   `regroup`    **the hard one.** Make 407 into 3 hundreds, 9 tens and 17
 *                ones. This is carrying across a zero, and it is where the
 *                biggest topic in the year actually breaks (PRD §18.9)
 */
export interface PlaceValueActivity extends ActivityBase {
  type: 'place-value';
  mode: 'build' | 'break-down' | 'regroup';
  /** The number the activity starts from. */
  start: number;
  /** Which columns are on screen, largest first. */
  columns: PlaceColumn[];
  /**
   * The value each column must hold when the child is done, in `columns`
   * order. In `regroup` these need not be single digits — that is the point of
   * the mode: `[3, 9, 17]` is a correct answer for 407.
   */
  target: number[];
  /**
   * How the whole number is said, the South African way, **with the *and***
   * (PRD §9.1 caveat 3). *"three hundred and forty-two thousand, seven hundred
   * and six"* — never left to the device voice, which drops the *and*.
   */
  say: LocalisedText;
}

/**
 * **A line with marks** — PRD §7.2.
 *
 * The ATP names this tool by name — *"using a number line"* is one of the six
 * calculation techniques it lists — so the app uses the tool rather than a
 * picture of it.
 *
 * **Rounding lives here and not in `place-value`**, because rounding 4 738 to
 * the nearest 100 is not a rule about the tens digit, it is **a position
 * between two marks**: 4 738 sits between 4 700 and 4 800, nearer to 4 700.
 * A child who has seen that does not need to remember which way five goes.
 */
export interface NumberLineActivity extends ActivityBase {
  type: 'number-line';
  mode: 'place' | 'jump' | 'round';
  /** The ends of the line. */
  from: number;
  to: number;
  /** The gap between drawn marks. Marks are tappable at `size.touchMin`. */
  step: number;
  /** The number the child is placing, jumping from, or rounding. */
  value: number;
  /** Where she has to get to. In `round`, the nearer of the two marks. */
  target: number;
  /** In `jump`: the size of one hop, so the line can be walked in equal steps. */
  jump?: number;
  /**
   * Fraction mode — Term 2's *"count forwards and backwards in fractions"*.
   * When set, the line is marked in `1/denominator` and the labels are said as
   * fractions, not as decimals (PRD §9.1 caveat 4).
   */
  denominator?: number;
  say: LocalisedText;
}

/**
 * **A bar cut into equal parts** — PRD §7.2, §6.5c.
 *
 * *Three quarters* is a fraction *and* three of four equal parts of a bar, and
 * the whole of Term 2's common-fractions block is about holding both at once.
 *
 * Four modes, and the last is the one the ATP asks for by name:
 *
 *   `shade`      shade three of the four parts
 *   `compare`    two bars, which is more — *"compare and order common
 *                fractions to at least twelfths"*
 *   `add`        two bars with the **same denominator**, added. The ATP limits
 *                addition and subtraction to same denominators in Grade 5, and
 *                the type limits it too: `denominator` is one number
 *   `equivalent` **two names for one amount.** A half and two quarters are the
 *                same length of bar, and *"recognize and use the equivalence of
 *                division and fractions"* is this mode beside a division
 *                sentence (PRD §7.6)
 */
export interface FractionBarActivity extends ActivityBase {
  type: 'fraction-bar';
  mode: 'shade' | 'compare' | 'add' | 'equivalent';
  /** Parts in one whole bar. Same for both bars — Grade 5 adds like this. */
  denominator: number;
  /** Parts shaded to begin with, one entry per bar on screen. */
  bars: number[];
  /** Parts shaded when the child is right, one entry per bar. */
  target: number[];
  /**
   * In `equivalent`: the second name for the same amount, as
   * `[numerator, denominator]` — `[1, 2]` beside four eighths.
   */
  equivalentTo?: [number, number];
  /**
   * The number sentence shown beside the bars, if any — a division sentence in
   * `equivalent` mode, an addition in `add`. **Shown, never computed for her.**
   */
  sentence?: LocalisedText;
  /** *"three quarters"*, never *"three slash four"* (PRD §9.1 caveat 4). */
  say: LocalisedText;
}

/**
 * **Input, a rule, output** — PRD §7.2.
 *
 * The ATP prints *"input and output values"* four times across the two pattern
 * blocks, and *"determine the equivalence of different descriptions of the same
 * rule"* twice. This component is the first half; **the second half is that the
 * same screen shows the flow diagram beside a table beside a number sentence**,
 * and the child sees that all three say one thing (PRD §7.6).
 *
 * **Any one of the three can be the blank.** That is the whole component: given
 * the input and the rule, find the output; given the input and the output, find
 * the rule; given the rule and the output, find the input. The third is the one
 * a worksheet almost never asks and the one that shows whether she has it.
 */
export interface FlowDiagramActivity extends ActivityBase {
  type: 'flow-diagram';
  /** Which of the three is missing. */
  blank: 'input' | 'rule' | 'output';
  /** The rule, said the way the child would say it: *"times 4, then add 3"*. */
  rule: LocalisedText;
  /** How the rule is applied, so the component can check without a calculator. */
  operations: Array<{ op: 'add' | 'subtract' | 'multiply' | 'divide'; by: number }>;
  /** The input values down the left of the diagram. */
  inputs: number[];
  /** The matching outputs. Same length as `inputs`. */
  outputs: number[];
  /**
   * The index in `inputs`/`outputs` the child fills, when `blank` is `input`
   * or `output`. Ignored when the rule itself is the blank.
   */
  blankAt?: number;
  /**
   * The options offered when the **rule** is the blank — a rule cannot be
   * built out of digits, so it is chosen. Two or three, one right.
   */
  ruleOptions?: Array<{ id: string; label: LocalisedText; correct: boolean }>;
  /**
   * The same rule said a second and third way, shown beside the diagram —
   * *"in a table"* and *"by a number sentence"*. **The ATP asks for exactly
   * this three-way sameness, twice.**
   */
  alsoSaid?: { asTable?: boolean; asSentence?: LocalisedText };
}

/**
 * **An analogue face and a digital readout, side by side and always
 * agreeing** — PRD §7.2.
 *
 * Term 4's whole time block, in 12-hour and 24-hour. *"Read, tell and write
 * time in 12-hour and 24-hour formats on both analogue and digital
 * instruments"* is one ATP row, and it is one component: **set either one and
 * the other follows.** A child who moves the big hand to the 6 and watches the
 * readout say `:30` has been told what half past means.
 *
 * > **This is the only file in the app allowed to name a unit of elapsed time,
 * > and it is still not allowed to measure one** (PRD §11 check 5). The clock
 * > check exempts `ClockFace.tsx` from the `Date.now()` ban because a clock
 * > face has to draw hands; it does **not** exempt it from the token ban.
 * > **Nothing here counts how long the child took.** There is no stopwatch in
 * > the stopwatch lesson.
 */
export interface ClockFaceActivity extends ActivityBase {
  type: 'clock-face';
  mode: 'read' | 'set' | 'match';
  /** Hour in 24-hour time, 0–23. */
  hour: number;
  minute: number;
  /** Seconds, where the ATP's *"hours, minutes and seconds"* row needs them. */
  second?: number;
  /** What the child has to reach in `set` mode. */
  target?: { hour: number; minute: number; second?: number };
  /** Which readout is shown; the other is the answer. */
  show: 'analogue' | 'digital' | 'both';
  /** 24-hour puts `14:30` on the readout; 12-hour puts `2:30 pm`. */
  format: '12-hour' | '24-hour';
  /** *"half past two in the afternoon"* — the app never spells a colon. */
  say: LocalisedText;
}

/**
 * **Toss, roll or spin — and the app never rigs it** — PRD §1.1 rule 4,
 * §6.5d, §11 check 4.
 *
 * *"Perform simple repeated events and list possible outcomes for experiments
 * such as tossing a coin, rolling a die, spinning a spinner"* and *"count and
 * compare the frequency of actual outcomes for a series of trials up to 20
 * trials"*. The child taps to toss; the app tosses; the tally builds; twenty
 * trials and stop.
 *
 * > **`Math.random()` and nothing else. No seed, no filter, no "make sure it
 * > looks like ten and ten", no re-roll if the first five are all heads.**
 * >
 * > **There is no `seed` field on this type and there will never be one.** The
 * > whole content of this ATP block is that **twenty tosses do not come out ten
 * > and ten**, and a child who runs it and gets thirteen and seven has learnt
 * > the lesson. One who gets ten and ten every time has learnt a lie.
 *
 * The trap is new to this family and it is about integrity rather than
 * capability: **the same code that makes this possible makes it trivial to
 * rig.** So it is a rule (§1.1), a validator check that greps the component's
 * own source for filtering (§11 check 4), and an acceptance test that runs each
 * trial a hundred times and checks the distribution is what randomness actually
 * looks like — **including the runs that look wrong** (§17 test 7).
 */
export interface ChanceTrialActivity extends ActivityBase {
  type: 'chance-trial';
  kind: 'coin' | 'die' | 'spinner';
  /** Up to 20. **The ATP's own ceiling**, and the validator enforces it. */
  trials: number;
  /**
   * The faces, in order — `['heads', 'tails']`, `['1'…'6']`, the spinner's
   * colours. **Listing the possible outcomes is the ATP's first verb**, and it
   * happens before a single trial is run.
   */
  outcomes: Array<{ id: string; emoji: string; label: LocalisedText }>;
  /**
   * What the child is asked to notice **after** the trials — never before, and
   * never a prediction that gets marked. *"Did it come out ten and ten?"*
   */
  ask: AudioPrompt;
  /* There is no `seed` field. PRD §1.1 rule 4. Do not add one. */
}

export type Activity =
  | SortBasketsActivity
  | SelectActivity
  | SequenceActivity
  | MatchConnectActivity
  | AssignSlotActivity
  | ExploreCardsActivity
  | ListenChooseActivity
  | DrawCanvasActivity
  | SpellWordActivity
  | ReadTextActivity
  | MemoryMatchActivity
  | MoveAlongActivity
  | HabitTrackerActivity
  | BeatAlongActivity
  // ── the six, PRD §7.2 ──
  | PlaceValueActivity
  | NumberLineActivity
  | FractionBarActivity
  | FlowDiagramActivity
  | ClockFaceActivity
  | ChanceTrialActivity;

export interface Badge {
  id: string;
  emoji: string;
  title: LocalisedText;
}

/**
 * A lesson — one sitting of fifteen to twenty minutes (PRD §4.7).
 *
 * A topic has **four** lessons and `orderInTopic` is the study area:
 * **0 PSW · 1 PSW · 2 PE · 3 CA, always** (PRD §5.3, §18.4).
 *
 *   0  **Meet it.** The concept, the story, the people.
 *   1  **Use it.** Opens with the block's `read-text` — the ATP's own
 *      *"Reading skills"* row — then recall and relate. **In a `careful` topic
 *      this lesson ends in the trusted-adult card**, and it ends there rather
 *      than at the end of the topic because lesson 3 is Creative Arts and a
 *      card that follows a drumming lesson has been filed under drumming
 *      (PRD §6.5e, §11 check 2).
 *   2  **Move.** One movement call, its space and its safety line (PRD §6.5b).
 *   3  **Make or perform.** Draw it, model it, clap it, say it (PRD §6.5c–d).
 */
export interface Lesson {
  _id: string;
  subjectId: string;
  topicId: string;
  /** Position within the topic; 0 lands on the topic's first school day. */
  orderInTopic: number;
  title: LocalisedText;
  emoji: string;
  colour: string;
  /** The topic's content area, handed down. One per topic (PRD §5.2). */
  area: ContentArea;
  /** Awarded on completion, or null. */
  badge: Badge | null;
  /** `challenge` gets the Star Challenge treatment; no marks are ever shown. */
  kind: 'lesson' | 'challenge';
  activities: Activity[];
}

/**
 * **A CAPS topic, scheduled onto its ATP weeks** (PRD §5.3, §5.5).
 *
 * Read straight off the ATP's own `TOPICS, CONCEPTS AND SKILLS` row: one CAPS
 * topic, one app topic, **eighteen of them**, plus a Star Challenge in each of
 * four terms. Their week ranges are the ATP's own — *Adding And Taking Away* is
 * weeks 4–6 of term 1 because that is where the document draws it.
 *
 * ── The length of a topic is the ATP's hours, and that is the change ───────
 *
 * **This ATP does not print cycles and it does not print equal topics. It
 * prints hours**, and they run from 3 to 21:
 *
 * | Term 1 topic | Hours | Lessons |
 * | ------------ | ----: | ------: |
 * | Big Numbers  |     9 |       3 |
 * | Number Sentences |  6 |      2 |
 * | Adding And Taking Away | **18** | **6** |
 * | Times        |    15 |       5 |
 *
 * **`lessons.length` is `round(atpHours / 3)`, clamped to 2 and 6**, and the
 * validator enforces it. Eighteen hours and six hours are not the same topic
 * wearing different names, and **an app that gave them the same four lessons
 * would have spent three times as long per hour on number sentences as on the
 * whole of addition and subtraction.**
 *
 * Lessons carry `topicId` rather than the topic carrying `lessonIds`, so the
 * link lives in exactly one place and cannot drift; the domain layer builds the
 * topic → lesson grouping and `scripts/check-content.ts` enforces both ends.
 */
export interface Topic {
  _id: string;
  subjectId: string;
  term: TermNumber;
  /** ATP week numbers within the term, 1-based and inclusive. */
  weekStart: number;
  weekEnd: number;
  /**
   * **The content area. One per topic, and it is a label, not a spine**
   * (PRD §5.2, §10).
   */
  area: ContentArea;
  /**
   * **The hours the ATP gives this topic** — PRD §5.3, §10. **[new.]**
   *
   * **This looks like documentation and it is not.** It is the only place the
   * ATP's own weighting survives into the codebase, and the validator checks
   * `lessons.length` against `round(atpHours / 3)` clamped 2–6.
   *
   * > Without it, the next author adds a fourth lesson to *Number Sentences*
   * > because every other topic has four, and **the six-hour topic quietly
   * > becomes the same size as the eighteen-hour one.**
   *
   * `lessons` is derived from this at authoring time and **recorded, never
   * recomputed** — a derived length that recomputes is a length that changes
   * when somebody edits a comment.
   *
   * A Star Challenge has no ATP hours and carries `0`.
   */
  atpHours: number;
  /** The ATP duration in weeks; the source plan is week-based. */
  atpWeeks: number;
  /** Cross-cutting process and design skills exercised by this topic. */
  skills: string[];
  /** Optional Technology brief delivered by the final hands-on lesson. */
  makeTask?: string;
  /**
   * **Skills first taught here** — PRD §8.2. **[new, and load-bearing.]**
   *
   * A skill appears in exactly one topic's `teaches` in the whole year, and
   * **every skill named here must actually be used by an activity in this
   * topic** — a topic that claims to teach long division and never does is
   * worse than one that does not claim it (PRD §11 check 1).
   */
  teaches: string[];
  /**
   * **Skills that must already have been taught** — PRD §8.2. **[new.]**
   *
   * Every id here must appear in the `teaches` of a **strictly earlier** topic
   * in schedule order, or in `ARRIVES_WITH`. **A forward reference fails the
   * build.**
   *
   * > This is the ATP's own `PREREQUISITE SKILL OR PRE-KNOWLEDGE` row, made
   * > executable. **That row is not decoration and it is not for the teacher's
   * > comfort** — it is the list of things a child must already be able to do
   * > before the topic in the column above it can start, and mathematics is the
   * > first subject in this family where getting it wrong makes the next topic
   * > impossible rather than merely harder.
   */
  requires: string[];
  title: LocalisedText;
  emoji: string;
  colour: string;
  badge: Badge | null;
  /**
   * Plain-language note for the parent zone (PRD §6.7).
   *
   * Written for an adult who **may read English less confidently than their
   * child**: three sentences, no CAPS vocabulary, spoken on tap, ending in one
   * question the adult can ask in any language.
   */
  parentNote: LocalisedText;
  /**
   * **Dead in this app, and kept on purpose** (PRD §5.7, §15.2).
   *
   * Mathematics teaches no grammar. The field survives from the FAL lineage
   * through Life Skills, empty in both this app and the last. **Deleting it is
   * a re-merge cost the next fork pays**, and this fork deletes nothing.
   *
   * > **And this is the finding of the last build running the other way.**
   * > *Life Skills Thuto 5* carried `ladder.ts` forward with an empty rung list
   * > and a check that trivially passed, and said so in its own §5.7. **The
   * > next fork is this one, and that file is now the most important thing in
   * > the repo** (PRD §18.1 finding 1). A fork's dead files are not waste and
   * > they are not tech debt — **they are the next subject's spine, arriving
   * > early.** The cost is a loop over an empty array.
   */
  languageItems?: string[];
  /**
   * The topic's taught vocabulary — the words that go on the word wall.
   *
   * In this subject that is the **mathematical** vocabulary: *numerator*,
   * *denominator*, *quadrilateral*, *perimeter*, *tessellation*. Every one of
   * them is glossed with a picture, every one carries an explicit `say`, and
   * **they are exempt from the word budget and never from the gloss**
   * (PRD §8.3, §9.1 caveat 1).
   */
  words: string[];
  /** The kinds of text this topic reads. Usually two (PRD §7.4). */
  textTypes: TextType[];
  /**
   * **A topic that can hurt the child reading it** — PRD §8.3 in the Life
   * Skills lineage. **Inherited, unused, and not deleted** (PRD §14 decision
   * 14, §15.2, §18.1 finding 1).
   *
   * **It is set on no topic in this app, and `src/content/care.ts` ships with
   * an empty register and its four rules intact.** *"Mathematics cannot hurt a
   * child"* is the shared care guide's own sentence.
   *
   * > **This is `ladder.ts` running the other way, in the same fork.** The
   * > prerequisite ladder was dead in Life Skills and is load-bearing here; the
   * > care register is load-bearing in Life Skills and is dead here. **Both are
   * > kept, empty, with their checks still wired**, for exactly the same
   * > reason: *when you inherit a file you cannot use, do not delete it — read
   * > it. It is a finished, validated answer to a question your subject has not
   * > asked yet* (PRD §18.1 finding 1).
   *
   * And this is why **this fork re-levels zero lines**. *Life Skills Thuto 5*
   * found that a vertical fork re-levels nothing except the file that protects
   * the child; **this subject has no such file, so it re-levels nothing at all,
   * and the rule predicted the zero** (PRD §15.3, §18.1 finding 2).
   */
  careful?: true;
}

export interface Subject {
  _id: string;
  title: LocalisedText;
  emoji: string;
  colour: string;
  /** `planned` subjects are added later as data, not code (PRD §5.4). */
  status: 'active' | 'planned';
  order: number;
}

/**
 * A daily rhythm — something that appears every school day, all year, rather
 * than sitting on one square of the calendar (PRD §5.5, §6.6).
 *
 * This ATP prints three rows in **every block of every term**, and they are the
 * three rhythms (PRD §6.6). **None of them is a lesson**, because a lesson is
 * done once and for ever and these come round again tomorrow:
 *
 *   "Basic hygiene principles"                          → 🧼 Wash and Check
 *   the Physical Education row, every week of all four
 *   terms                                               → 🤸 Move Today
 *   "Reading skills: Reading with understanding and
 *    using a dictionary"                                → 📖 New Words
 *
 * **Every Move Today variant is a movement call and carries a space, a safety
 * line and a kit, exactly as a lesson's does** (PRD §6.5b, §11 check 1). Ten of
 * them, across the four PE strands, so a term's movement carries into the weeks
 * the app has no PE lesson — the four assessment weeks (PRD §5.5).
 */
export interface DailyRhythm {
  _id: string;
  title: LocalisedText;
  subtitle: LocalisedText;
  emoji: string;
  colour: string;
  /** Which field on the day's record this rhythm completes. */
  marks: 'wordAdded' | 'movedToday' | 'washDone';
  /** Required rhythms are pinned to today; optional ones sit underneath. */
  required: boolean;
  /**
   * One set of activities per day, cycled through the year so a child who opens
   * the app every morning does not meet the same one twice in a week.
   * A plain array keeps this a document, not a function — it still travels to
   * MongoDB unchanged (PRD §5.6).
   */
  variants: Activity[][];
}
