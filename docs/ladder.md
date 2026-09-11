# The prerequisite ladder — Mathematics Thuto 5

**A build gate** (PRD §8.2, §11 check 1). This document explains the ladder that
`src/content/ladder.ts` encodes and `scripts/check-content.ts` enforces. It is
new to this app, and it is the file this fork exists to write.

## Why this subject has one and the others did not

Mathematics is the first subject in this family whose content is **strictly
cumulative within itself**. A child cannot do the Term 2 division block without
the Term 1 multiplication block; she cannot carry across a zero without place
value. **The ATP already knows this** — it prints a `PREREQUISITE SKILL OR
PRE-KNOWLEDGE` row under every single topic. The app makes that row executable.

> This is the `ladder.ts` that shipped **dead** in *Life Skills Thuto 5* — an
> empty rung list with a check that passed trivially, because Life Skills
> teaches no grammar. Here it is the most important file in the repo
> (PRD §18.1 finding 1). Its mirror, `care.ts`, ships dead **here** and is kept.

## The three pieces

- **`ARRIVES_WITH`** — 46 skills a Grade 5 child is assumed to hold on the first
  morning, **copied verbatim from the ATP's own prerequisite rows** across all
  four terms. Not invented. The set inherits; the assumption does not, so Term 1
  re-teaches place value from four digits up, every topic opens with a worked
  example, and PRD §17 test 5 walks Term 2 as a child who has never seen the app.
- **`SKILLS`** — 73 skills the year teaches, each **taught in exactly one topic**
  and each **used by an activity in that topic**. A skill's `name` is what the
  app would say to a child (*"rounding to the nearest thousand"*), never a
  teacher's phrase.
- **`LADDER`** — one rung per topic, listing what it `teaches` and what it
  `requires`.

## The check

Walk the topics in schedule order. For every topic, every id in `requires` must
appear in the `teaches` of a **strictly earlier** topic, or in `ARRIVES_WITH`.
Every skill appears in exactly one `teaches`. **A forward reference fails the
build.** A topic cannot satisfy its own requirement (requires are checked before
that topic's teaches are added to the pool).

## Two recorded departures

1. **`ARRIVES_WITH` is read off all four terms' prerequisite rows, not only Term
   1's** (PRD §8.2a expects 15). Terms 2–4 print the same row under every topic,
   naming Grade 4 skills — naming a shape, collecting data with tallies, reading
   a scale — that no earlier topic in this app teaches. Without them the check
   fails on a skill the child genuinely arrives with. The alternative was to
   invent teaching for content the ATP says she already has.
2. **Where a term's prerequisite row repeats that topic's own content row
   verbatim, it is a printing artefact and the skill is `teaches`, not
   `requires`** (Appendix A finding 2). The ATP's Term 3 page does this for
   *measure perimeter* and *find areas by counting squares*. A skill cannot be
   its own prerequisite.

## What it is not

It is **not adaptivity and not a knowledge model**. It tracks nothing about this
child, unlocks and locks nothing, routes her nowhere. It is a check on the
author, run at build time, and the child never meets it (PRD §8.2c, §2.2).
