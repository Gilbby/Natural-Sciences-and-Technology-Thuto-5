# The support ramp

**PRD §8.2b. [changed] It is not this app's ramp.**

`src/content/ramp.ts` is the executable copy of this file, and
`scripts/check-content.ts` fails the build on any text outside its term's row.

---

## What the ramp is

Every text in this app can be heard in full, at any point, on one tap. What
changes across the year is only **the default**: early on, the app reads first
and the child follows; by term 4 the child reads first and the app waits behind
a tap.

> **Support is never withdrawn — only demoted.**

## Where these four rows come from

**They are *English FAL Thuto 5*'s ramp, dropped one term.** Same reason as the
word ledger: **the Life Skills child and the FAL child are the same child**, she
has one English vocabulary, and it is being built next door (PRD §1.1 rule 5,
§8.2).

| Term | FAL Thuto 5 says | This app takes | Which is |
| ---: | ---: | ---: | --- |
| 1 | 80w · 2 paras · ≤12 | **70w · 2 paras · ≤11** | one step below FAL term 1 |
| 2 | 110w · 3 paras · ≤13 | **80w · 2 paras · ≤12** | FAL term 1 |
| 3 | 130w · 3 paras · ≤15 | **110w · 3 paras · ≤13** | FAL term 2 |
| 4 | 150w · 4 paras · ≤16 | **130w · 3 paras · ≤15** | FAL term 3 |

Term 1 has no FAL term 0 to copy, so it is one honest step below FAL term 1.

> **Read the FAL app's `ramp.ts` and confirm each row is one term behind it
> before trusting these numbers.** If that app's ramp moved after its build,
> this one moves with it. **The relationship is the specification; the numbers
> are a copy of it.**

## The entry mode is one term slower too

| Term | On entry |
| ---: | --- |
| 1 | **app-first, all of it** |
| 2 | **app-first, all of it** — four consecutive `careful` blocks |
| 3 | app-first for a story or an information text; the child opens the rest |
| 4 | **child-first**, except an information text, which the app still reads once |

The FAL app goes child-first from its term 2. This one does not, and the reason
is the subject: **in Life Skills the child is decoding a text *and* meeting a
hard idea in it, and the two costs do not add, they multiply.** A child meeting
the word *abuse* for the first time should not also be meeting it alone on the
page.

Term 4 keeps the app's voice on information texts for a different reason: **a
device voice mispronouncing *diarrhoea* in a lesson about diarrhoea teaches a
wrong word to a child with no way to know** (PRD §9.1 caveat 1).

---

## The five rules that fall out of it

1. **A prompt is never something the child must read.** Prompts, hints, **safety
   lines** and the spoken call under a `move-along` step are the app's own
   voice, always spoken. The ramp does not govern them, and neither does the
   ledger.
2. **Tap-to-hear never withdraws.** Not in term 4, not in a Star Challenge, not
   on a safety line, not ever. The ramp moves `mode`; **it never touches the
   speaker button.** This is why a child who cannot read term 4 still finishes
   term 4.
3. **The ramp is per term, not per block.** A term is the granularity a person
   can actually check, and this table is meant to be checked by one.
4. **A figure's spoken description does not count against the ceiling.** It has
   to answer the question without the picture, and that takes the words it takes
   (PRD §7.4).
5. **[new] A trusted-adult card is outside every limit.** `whoCanITell` is
   identical in all eight topics and it is longer than a term 1 text. **A child
   who has met it four times knows what it is before it finishes speaking**, and
   that recognition is the point of it. A ramp check that shortened it would
   destroy the thing that makes it work.

---

## The word budget, and the three exemptions

**`CORE_WORDS` is *English FAL Thuto 5*'s ledger, read one term behind.** A Life
Skills text in term 2 may use any word that app had taught by the end of term 1.

| Term | May use |
| ---: | --- |
| 1 | the FAL Grade 4 ledger (~1 850 words) |
| 2 | + FAL Grade 5 term 1 |
| 3 | + FAL Grade 5 term 2 |
| 4 | + FAL Grade 5 term 3 |

Everything else is **budgeted**: at most **five** words outside the ledger per
text, and **every one of them glossed, with a picture**.

**Three exemptions, and they are the subject:**

1. **A `careful` topic's own vocabulary is never rationed.** *Abuse*, *safe*,
   *unsafe*, *report*, *violence*, *right*. **A lesson about abuse that ran out
   of budget before the word *abuse* would be the single worst thing this app
   could ship.**
2. **A health term is glossed and exempt**, and every one carries an explicit
   `say`.
3. **An arts term is glossed and exempt** — *crotchet*, *stave*, *timbre*,
   *proportion*, *adornment*.

> **They are exemptions from the budget, never from the gloss.** The validator
> counts them separately and prints all three counts, because a term whose
> exemption list is longer than its text is an authoring problem, not a budget
> one.

---

## The test this file cannot run

**PRD §17 test 3, the stranger test.** Walk a term 4 lesson as Sipho, who reads
about two years behind. Every text must still be completable — slowly, with the
speaker on, tapping half the words. **And cover the figure**: with it hidden, its
spoken description still answers the question.
