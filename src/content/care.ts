import type { TermNumber } from '@/types';

/**
 * **The care register — PRD §8.3. The one file this fork re-levels.**
 *
 * ── Why this file is different from every other file in the fork ───────────
 *
 * *English FAL Thuto 5* was this family's first vertical fork and its
 * re-levelling column was **zero**: same phase, same subject, nothing to
 * re-tune. This fork is the second vertical one and it deletes nothing and
 * re-levels nothing **except this file** (PRD §15.3, §18.1 finding 1).
 *
 * > **Nine and ten are the same child for a touch target, a narration rate, a
 * > set size, a praise line and an English word. They are not the same child
 * > for child abuse, substance abuse and HIV stigma** — and this ATP hands all
 * > three to the older one and none to the younger.
 * >
 * > **A vertical fork copies everything, and the one file it must not copy is
 * > the one it is most tempted to copy**, because it copied everything else
 * > that day and it was right to.
 *
 * ── The four rules are inherited, and not one word of them changes ─────────
 *
 * They live in `docs/care-guide.md` and they are restated here because this is
 * the file an engineer opens:
 *
 *   1. **The child is never in the question.** Every question about a risk is
 *      asked about a character, so that a child living it has somewhere to
 *      stand. *"Whose fault is it when a child is hurt?"* — never *"has this
 *      happened to you?"*.
 *   2. **Every `careful` topic ends in the trusted-adult card.** [changed] The
 *      card is the last activity of the last **PSW** lesson — lesson 2, not
 *      lesson 4 — because lesson 4 is Creative Arts and a card that follows a
 *      drumming lesson has been filed under drumming (PRD §6.5e, §11 check 2).
 *   3. **Factual, never frightening.** No sirens, no red, no statistics, no
 *      photographs of injury, no described incident. Where a fact is
 *      frightening on its own, the thing to do goes next to it in the same
 *      breath.
 *   4. **The app teaches and names a person. It does not diagnose and does not
 *      counsel.** Term 4 lists symptoms because the ATP does; **the app never
 *      asks a child to match herself against one.**
 *
 * ── The gate, and it is the cheapest item on the roadmap ───────────────────
 *
 * `CARE_SIGN_OFF` below is **not decoration**. `docs/care-guide.md`'s own gate
 * says a person who works with children reads this register before any
 * `careful` topic is authored, and reads all eight end to end, as a child
 * would, before the APK is built. A school counsellor, a Childline trainer, a
 * social worker or a Life Orientation HOD. **Half a day of somebody else's
 * time and one round of edits.**
 *
 * **It is the item most likely to be dropped. If it is dropped, it is written
 * into the README by name** — which is what the care guide instructs, and what
 * `CARE_SIGN_OFF.note` is for.
 */

export interface CareEntry {
  /** The topic this governs. */
  topicId: string;
  term: TermNumber;
  title: string;
  /** What can hurt a child reading it. One line, plainly. */
  risk: string;
  /** Whether *Life Skills Thuto 4* carried this topic, and under what name. */
  inGrade4: string;
  /**
   * **What this topic must say, in this order.** Not a style note — the order
   * is the pedagogy, and reversing it changes what the child is left holding.
   */
  mustSay: string[];
  /** **What this topic never says.** A closed list, per topic. */
  neverSay: string[];
}

/**
 * **Eight `careful` topics — up from Grade 4's six, and four consecutive.**
 *
 * The order is the year's order, so the register reads the way the child meets
 * them.
 */
/**
 * **The care register — inherited from the Life Skills lineage, and empty on
 * purpose** (PRD §8.3, §14 decision 14, §15.2, §18.1 finding 1).
 *
 * *"Mathematics cannot hurt a child"* is the shared care guide’s own sentence.
 * No topic in this app is `careful`, so the register ships **empty** and the
 * forward-reference-style checks that read it pass over an empty array — the
 * exact mirror of the `ladder.ts` that shipped dead in *Life Skills Thuto 5*
 * and is load-bearing here.
 *
 * > **When you inherit a file you cannot use, do not delete it — read it.**
 * > It is a finished, validated answer to a question your subject has not asked
 * > yet. `care.ts`, `docs/care-guide.md` and the four rules stay, wired and
 * > unused, for the next fork into a subject that can hurt a child.
 */
export const CARE_REGISTER: CareEntry[] = [];

/**
 * **Number 8 is marked `careful` on purpose and it is the one an engineer would
 * remove.**
 *
 * *"Responsibilities of boys and girls in different cultural contexts"* is not
 * a risk topic. **But it asks a ten-year-old to look at the division of labour
 * in her own house**, and for some children the honest answer is one they
 * cannot say out loud.
 *
 * Marking it `careful` costs one trusted-adult card and buys care rule 1 over
 * every question in it. **That is a cheap trade and this register takes it.**
 */
export const CAREFUL_TOPIC_IDS: string[] = CARE_REGISTER.map((entry) => entry.topicId);

export function isCareful(topicId: string): boolean {
  return CAREFUL_TOPIC_IDS.includes(topicId);
}

export function careEntry(topicId: string): CareEntry | null {
  return CARE_REGISTER.find((entry) => entry.topicId === topicId) ?? null;
}

/**
 * **The gate** — PRD §8.3, §13 phase 0, §17 test 4, §18.8 #1.
 *
 * `signed` is `false` until a person who works with children has read this
 * register and all eight topics end to end, as a child would, and said so.
 * **Term 2 is not authored until the register comes back**; terms 1, 3 and 4
 * are not blocked and are authored while it is out (PRD §16.4 step 2).
 *
 * `scripts/check-content.ts` prints this block in its banner, and the three
 * signature lists beside it. **A build whose banner says `signed: false` is a
 * build that has not passed §17 test 4**, whatever else is green.
 */
export const CARE_SIGN_OFF = {
  /** No careful topics in this subject, so there is nothing to sign off. */
  signed: true,
  by: "not applicable — mathematics cannot hurt a child" as string | null,
  date: null as string | null,
  note:
    'The register is empty (PRD §14 decision 14, §18.1 finding 1). The file, ' +
    'docs/care-guide.md and the four rules are kept, wired and unused, for the ' +
    'next fork into a subject that can hurt a child.',
} as const;

/**
 * **The three lists a machine cannot judge** — printed by the validator for a
 * person to sign (PRD §11, §17 test 4).
 *
 * A validator can see that a second-person sentence opens an activity inside a
 * `careful` topic. It cannot see whether that sentence puts the child in the
 * question. A validator can see that an open question sits inside a `careful`
 * topic. **It cannot tell *"how should people treat her?"* from *"is it safe to
 * share a cup with her?"* — and the two sit one line apart in the same lesson.
 * A person can.**
 *
 * So the build lists and does not fail, and a person signs the list.
 */
export const SIGNATURE_LISTS = [
  'second-person openings inside careful topics',
  'open questions inside careful topics',
  'never-list words outside a movement builder',
] as const;
