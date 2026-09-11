# The movement guide

**PRD §1.1 rule 1, §6.5b, §11 check 1. This file is a build gate.**
`scripts/check-content.ts` reads the allowed-materials list below and fails the
build on any `kit` entry that is not on it.

---

## The one sentence this file exists for

**The app calls a movement into a room it cannot see.**

Two-thirds of this ATP is a body. Physical Education is gymnastics sequences,
target games, rhythmic movement, and field and track athletics. Creative Arts is
singing in canon, drumming, clay, dance in pairs, and body adornment made from
cut and tied recyclables. The app cannot do any of it, cannot watch any of it,
and must not pretend to — **and it also cannot delete two-thirds of the
subject.**

So it calls the movement, and it names the room first.

The child this is written for is in **a two-room house with a concrete floor, no
garden, no ball, no space to run, and a bucket of water standing in the corner.**
She has no adult with her. She is why the never list is a closed list and not a
judgement call, and why every movement in the app is walked past her before it
ships (PRD §17 test 5).

---

## What every movement call carries

Author it with **`practise()`**, never with `moveAlong()`. The builder requires
all three of these and the validator fails the build without them.

### 1. `space` — where she has to be able to stand

| Value | What it means |
| --- | --- |
| `standing` | She can do it standing still. |
| `one-arm` | She needs to stretch one arm out and turn round. |
| `a-few-steps` | She needs three or four steps in one direction. |
| `outdoors-open` | She needs to be outside with room to run. |

**`outdoors-open` is the only one that assumes anything**, and every call that
uses it says so in its own safety line as well. It appears four times in the
year and all four are Term 4 athletics.

### 2. `safety` — one sentence, spoken before the first step

**It is a plain instruction about where to stand. It is never a warning about
what could go wrong.**

> *"Do this on a soft floor or on grass. Not on a bed, and not near a table."*
> *"Stand next to a wall so you can touch it. Bare feet are best."*

A ten-year-old alone in a room does not need to be frightened; she needs to be
told where to put her feet. *"You could fall and hurt yourself"* is a fright, and
it is care rule 3 the other way round — the validator fails the build on the
obvious half of that and §17 test 5 catches the rest.

It renders **as content**: large, above the prompt, at the reading type scale, on
warm amber and never red, speaking on tap like every other line, and **spoken
before the activity's own prompt**. It is not a toast, not a footnote and not
grey.

### 3. `kit` — what it needs

Every entry is a thing the child probably has, or `'nothing'`, which is the
year's commonest answer.

> **A Life Skills lesson that requires the child to own something has failed the
> child it was written for.** Where the ATP names a material, the app names three
> she probably has and accepts none of them being present: *"a ball of clay, or
> wet soil, or bread dough, or nothing at all — you can do this one with your
> hands in the air."*

## Allowed materials

- nothing
- a rolled-up sock
- a plastic bottle
- a bottle top
- a stone
- a small stone
- a bit of string
- a strip of a plastic bag
- an old plastic bag
- a chair
- a towel
- an old newspaper
- a sheet of paper
- a pencil or a crayon
- a piece of chalk
- a stick
- a tin
- a jar lid
- a cardboard box
- a ball of clay
- wet soil
- bread dough

**To add to this list, add to it here.** It lives in a document rather than in a
TypeScript file so that the person who runs §17 test 5 — somebody who has been in
a two-room house with a concrete floor — can read and change it without opening
the code.

---

## The never list

**Closed. A movement or making call that contains one of these fails the build.**

> water · swim · swimming · dive · diving · pool · dam · river · bucket ·
> height · roof · climb · climbing · road · street · traffic · railway · fire ·
> match · matches · candle · candles · knife · knives · blade · scissors

**Every occurrence of one of these words anywhere else in the app is listed by
the validator for a person to read**, and it does not fail. A PSW lesson on fire
safety *must* say **fire**. A lesson on saving water *must* say **water**. The
check is on the movement builders; the list is the same list-and-sign mechanism
the care guide already uses, and for the same reason: a machine cannot tell the
two kinds apart, and a person can.

### Two words in the PRD's prose list are not enforced, and this is why

PRD §6.5b's list carries **`wall`** and **`train`**; PRD §11 check 1's list
carries neither. That is a real inconsistency between two lists in the
specification, and it is resolved here in writing rather than silently:

- **`wall`** is on §6.5b's list because of *climbing* a wall, and `climb` **is**
  enforced. But the app's own safety lines use a wall as the thing you steady
  yourself against — *"stand next to a wall so you can touch it"* — which is the
  opposite of the risk. The ATP's best Term 2 entry is an indigenous game that
  needs a stone and a wall. **Enforcing `wall` would delete the safest sentence
  in the file.**
- **`train`** is covered by `railway`, and enforcing the word itself would fire
  on *train your body* on every run. A check that fires on every run stops being
  read.

---

## Swimming

The ATP's Term 4 Physical Education cell reads:

> *"Participation in basic field and track athletics **or** swimming activities"*

and lists confidence exercises, breathing, kicking, gliding, arm and leg actions,
styles and races.

**The app takes athletics. Permanently.**

That is **the ATP's own *or***, and choosing one of two printed options is not a
deletion. The reasoning, written down here so that the next person who reads the
ATP and notices the gap finds the answer instead of the gap:

- **A child alone at home told to practise breathing, gliding or kicking is a
  child who will practise it somewhere.** The only honest number of drownings an
  app for ten-year-olds may contribute to is zero.
- A *"do this only with an adult"* line does not help. **A safety sentence a
  ten-year-old reads alone is not an adult.**
- The app already teaches water safety, properly, in Term 3's *Water Is Life*
  block, where water is the subject rather than the venue.

This is PRD §14 decision 6 and §18.8 #2, and it is not a v1 cut.

---

## The seventeen lesson calls, and the ten rhythm calls

| Term | The ATP's PE row | What the app calls |
| ---: | --- | --- |
| 1 | rotation, balance, locomotion, elevation — gymnastics sequences combining running, walking, jumping, hopping, skipping, rolling | **Every rolling call names a soft floor first.** Balance on one leg beside a wall; slow shoulder rolls on a folded towel; two movements joined into a sequence |
| 2 | target games: modified netball, basketball, soccer, rugby, hockey, an obstacle course, **indigenous and community games** | Aim a rolled-up sock at a jar lid. **The indigenous games cell is the one this app can host best**, because it needs a stone and a wall and the child already knows the rules |
| 3 | rhythmic movement, posture and style: aerobics, galloping, marching, hopping, skipping, steps, sliding, leaping | **The term PE and Creative Arts touch** — a rhythm the app plays (`beat-along`) and a movement done on it |
| 4 | field and track athletics: sprints, relays, **adapted** shot-put, discus and javelin | *Adapted* means **a rolled-up sock and never a real implement**. No high jump, no long jump into anything the app has not seen |

Every movement lesson's fourth activity is a **`habit-tracker`** row: *did you do
it? tap the day.* **Nothing timed, nothing counted against a target.**

The ten **Move Today** rhythm variants carry the same three fields and the same
never list, because a rhythm variant is a movement into the same unseen room that
a lesson is — and because in the four assessment weeks they are the only movement
the app has (PRD §5.5, §6.6).

---

## The test this file cannot run

**§17 test 5. Walk every one of the 27 movement calls in a two-room house with a
concrete floor, no equipment and a bucket of water in the corner.** Anything that
needs space the child does not have, kit she does not own, or that puts her near
the bucket, is a bug.

**It is run by somebody who lives in one, or has been in one.** Not by an
engineer, and not by this file.
