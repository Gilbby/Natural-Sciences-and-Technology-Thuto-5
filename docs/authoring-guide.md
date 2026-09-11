# The authoring guide — Mathematics Thuto 5

How to add or change a topic without breaking anything a child depends on. Read
`docs/ladder.md` and `docs/facts.md` first; both are build gates.

## The shape of a topic

- A topic is **one CAPS topic** off the ATP's `TOPICS` row, in **one content
  area** (NUM · PAT · SPA · MEA · DAT).
- Its lesson count is **`round(atpHours / 3)` clamped 2–6**, recorded on the
  topic as `atpHours` and never recomputed. Eighteen hours is six lessons; six
  hours is two. The validator fails a mismatch.
- **Lesson 1 opens with the worked example.** The last lesson is a word problem
  in one of the ATP's own contexts (financial, measurement, ratio, rate) with
  nothing new. Four activities a lesson; five only in a Star Challenge.
- Every topic declares `teaches` and `requires` that match its rung in
  `LADDER`, and nothing may be required before an earlier topic teaches it.

## The two calculation techniques, and only two (PRD §18.8 #4)

The ATP says *"use any two techniques to perform and check"* and lists six. **We
teach exactly two, name them, and use the same two all year:**

1. **building up and breaking down** — it carries place value, so it is the one
   that keeps meaning attached to the method (`place-value`);
2. **columns** — it is the one the classroom will use, so it is the one a child
   must recognise.

**Do not teach all six.** A child who knows six methods and no reason to prefer
one has six ways to be unsure. The ATP prints *"ensure that the strategies used
do not compromise conceptual understanding"* twice — that is the DBE telling you
not to teach a trick.

## Numbers, fractions, operations and units are said, not spelled (PRD §18.8 #5)

Device TTS is wrong about all of these, and a wrong word taught to a child who
cannot check is the worst kind of wrong. So:

- **Every number read aloud as content carries its own `say`, the South African
  way, with the *and*.** `342 706` → *"three hundred and forty-two thousand,
  seven hundred and six"*. Never leave it to the device, which drops the *and*.
  (v1.1 roadmap: a composable recorded number set — PRD §13 phase 3.)
- **A fraction is said, not spelled.** `3/4` → *"three quarters"*, never *"three
  slash four"*.
- **A unit is the word, in full.** `km` → *"kilometres"*, never *"kay em"*.
- **An operation has one fixed word**, set in `src/i18n` and used everywhere:
  `−` *take away*, `×` *times*, `÷` *divided by*, `=` *is*.
- **Every mathematical term carries a `say`** in its gloss (*quadrilateral*,
  *denominator*, *tessellation*). The validator fails a maths gloss with no
  `say`.

## The wrong answer (PRD §6.5b)

A wrong `listen-choose` option may carry a `why` — the fourth element of the
option tuple — that **names what that answer did, flatly**. It never says
*wrong*, *no*, *mistake*, *should have*, and it never praises. It is optional:
a distractor with no nameable misconception carries none — inventing one is
worse than leaving it bare. The round's fifth element, `fromStepId`, points at a
step of the topic's worked example; a wrong tap replays it.

Run PRD §17 test 5: a person who was bad at maths at school reads every `why`
aloud. `npm run check` prints them all.

## The word budget (PRD §8.3)

A word problem may use any word *English FAL Thuto 5* had taught by **one term
behind**, plus five new words per text, each glossed with a picture.
**Mathematical vocabulary is exempt from the budget, never from the gloss.** If
a text trips the budget on an ordinary word, gloss it or reword to a word the
ledger already has — never edit the ledger to pass a check.

## The rules that never move

Nothing is timed. Nothing is a race. Nothing is a mark. The app builds numbers;
the child never types one and the app never computes for her. Probability is
real `Math.random()`, never seeded, never filtered. Every word of content speaks
on tap. See `src/content/ladder.ts`, `ramp.ts`, and `scripts/check-content.ts`.
