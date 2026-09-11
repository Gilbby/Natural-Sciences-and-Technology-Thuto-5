# Product Requirements Document — Natural Sciences and Technology Thuto 5

**Product name:** *Natural Sciences and Technology Thuto 5* (the Grade 5 NS&Tech app in the *Thuto* family)
**Version:** 0.9 — **build-ready spec**
**Author:** Product / with Claude
**Date:** 11 September 2026
**Status:** Not yet forked. Every engineering and design decision below is **made**. The ATP is in hand — `2026_ATP_NS & Tech_Grade 5.pdf`, in this folder, seven pages, four knowledge strands and one process-and-design-skills page — so §8 carries a real proposed year rather than empty slots.

**Relationship to other products:** *Natural Sciences and Technology Thuto 5* is **the family's eighteenth app and the fourth in Grade 5**, after *English FAL Thuto 5*, *Life Skills Thuto 5* and *Mathematics Thuto 5* (built the week before). It is a **new subject in this grade**, not a vertical fork of a Grade 5 app, so it takes its engine from the sibling whose machinery fits it best — and **that is *Life Skills Thuto 5*, not *Mathematics Thuto 5*** (§14 decision 1). Three things come across: *English FAL Thuto 5*'s **word ledger, read one term behind** (§8.3); *Life Skills Thuto 5*'s **`doItYourself` calls, its `care.ts` safety register and its `factRef` discipline** (§16); and *Social Sciences Thuto 4*'s **`SourceFigure`**, now in its fifth lineage (§7.5).

**Source of content:** *2026 Annual Teaching Plan — Natural Sciences and Technology: Grade 5* (DBE). Seven pages. **It is a strand ATP** — four knowledge strands, one per term, each a column of `CAPS Topics · Core Concepts, Skills and Values · Resources · Informal Assessment`, plus a page of seventeen `Major Process and Design Skills`. It prints **durations in weeks**, not hours and not cycles.

---

## ▶ BUILD DIRECTIVE — read this if you were handed this document and told to build the app

**You have everything you need. This document plus this folder is the whole
brief.** If the instruction was *"generate this app using this PRD"*, do exactly
the following, in order, and do not redesign anything — every design and
engineering decision is already made below.

**Inputs, all already present:**
- **this PRD** — the full spec. §14 is the list of decisions already taken; do
  not re-open them. §8 is the proposed year, read off the ATP.
- **`2026_ATP_NS & Tech_Grade 5.pdf`** — in this folder. The curriculum.
- **the fork base** — §14 decision 1 names it (*Life Skills Thuto 5*) and its
  fallback. **The exact tech stack, dependency versions, repo layout and build
  commands are in Appendix C** — copy them, do not re-derive them.

**Do this:**
1. **Confirm the fork base exists** (§14 decision 1, §16.6). If the named repo is
   not on disk, use the fallback and take the brand identity out of the Grade 4
   APK — colour `#7E57C2`, package `za.co.thuto.nstech4` are already established
   in §14.2. Fork it (§16.2), `npm install`, confirm it runs, **and diff the
   tree to measure §15.3's three numbers.**
2. **Build the spine** (§16.3): the lesson-count rule, the four strands, the
   empty ladder (§8.2a), the facts register (§8.5), the care/safety register
   (§8.2b), the `doItYourself` material contract (§7.4), the ledger and ramp
  (§8.3–8.4), the rolling 52-week calendar with four 13-week windows (§5.5).
3. **STOP and show the human the proposed year (§8.1) and the safety register
   (§8.2b)** — the first checkpoint. Do not author the year until it is
   confirmed. *(If running unattended, proceed on §8.1 as written and flag
   Appendix A's four ambiguities for later review.)*
4. **Wire the five validator checks** (§11) and the docs they gate — `facts.md`,
   `care-guide.md`, `do-it-yourself.md` — **before authoring, not after.**
5. **Build `label-diagram`** (§7.2) over the extracted `SourceFigure`, then four
   figures (§16.4).
6. **Author the year term by term** (§8.1), running `npm run check` after every
   topic. **The validator is the spec; a topic is not done until the check is
   green.**
7. **Verify** (§17): the eight acceptance tests, the green banner, a clean
   `npx expo export --platform web`. **Build the release APK** arm64-v8a per
   Appendix C.6 and §16.6, and confirm `aapt2 dump permissions` shows `VIBRATE`
   only.

**The five rules in §1.1 outrank everything and are never traded away**: teach-
show-call-never-fake · never send a child alone toward fire or mains · every
claim sourced · spend the FAL ledger one term behind · nothing timed or scored.

**Definition of done is Appendix C.8.** The §18.7 kickoff brief is the same
instruction in paste-in form. Everything else in this document is the *why*
behind these steps; read it when a step needs a decision.

---

## 0. How to build this app

This document exists so that the whole build is one upload and one instruction.

**To start:**

1. Paste the kickoff brief in **§18.7**, with this PRD and the ATP already in the folder.
2. **Find the fork base before writing a line.** §14 decision 1 names it — *Life Skills Thuto 5* — and names the fallback, because the last three builds in this family all discovered mid-fork that the repo they were told to fork was not on disk.
3. Review the topic sheet (**§8.1**) and the safety register (**§8.2b**) when they come back — the first human checkpoint. **§8.1 already contains a proposed year read off the ATP**; the checkpoint is to confirm or correct it, not to invent it. **The safety register is the second thing a person signs, and this time a person who has been in a two-room house with a paraffin stove signs it** (§17 test 5).
4. **Read §1.1 before anything else.** It is five rules. The first is about a phone that must refuse to do the experiment; the second is about a child alone in a kitchen with a box of matches.

Everything else — which repo to fork, the rename values, the strand-to-term split, the one new component, the safety register, the ledger rule, the naming conventions and the validator checks — is **already decided in this document**. Five questions are open (§18.8), and each carries a recommendation.

**Estimated effort:** fork + rename + spine — **half a day**. Component work — **a day and a half**, most of it one new component and the extraction (§7.2). Validator work — **a day**. Content (~16 topics, ~50 lessons, ~200 activities) — **6–7 days of authoring**, plus **two days of figures**, because this subject is made of diagrams even more than mathematics was.

### How to read this document

| Part | What it is |
| --- | --- |
| **§1–§14** | The product spec. Items that differ from *Life Skills Thuto 5* are marked **[changed]**; items not built in v1 are marked **[deferred]**. |
| **§15** | The planned delta from the source app — including **§15.3, the three numbers**. |
| **§16** | Fork guide — the mechanical, the one new component, the three borrows, with exact values. **§16.6 is what the last three builds learned the hard way.** |
| **§17** | How to verify the fork is healthy. **Eight acceptance tests, and three of them are new to this subject.** |
| **§18** | **ATP conversion guide** — including §18.1: **the two files Mathematics carried dead that this subject is built on**, and the phone that is honest by refusing. |

Companion documents inside the repo: `docs/authoring-guide.md`, `docs/topic-sheet.md`, `docs/support-ramp.md`, **`docs/facts.md`** (inherited, and here it is the busiest file in the repo — §18.1 finding 1), **`docs/care-guide.md`** (inherited, and here it governs fire and electricity rather than abuse — §18.1 finding 2), `docs/do-it-yourself.md` (**new** — the kit-and-safety guide for hands-on calls, §7.4) and `docs/ladder.md` (**inherited, and dead again** — this subject's knowledge is not strictly cumulative, so the prerequisite ladder ships empty, §8.2a).

---

## 1. Summary

*Natural Sciences and Technology Thuto 5* is a mobile learning app for **Grade 5 learners (~10–11 years old)** in the South African Intermediate Phase. It carries the whole Grade 5 NS&Tech year — **four CAPS knowledge strands across four terms, ~16 topics**, worked as two to five lessons each, sized by the weeks the ATP gives them.

A child opens the app to a friendly **calendar of the school year**: the days that carry a lesson are marked, and tapping one opens it. Everything is **spoken as well as shown**, every word of every text is one tap from being read aloud, and the app is operated entirely by tapping.

### 1.1 The subject the phone cannot do — and must not pretend to

Every app in this family is built for a child alone at home with a phone. *Life Skills Thuto 4* found the first subject **that can hurt a child**. **Natural Sciences and Technology Thuto 4 found the first ATP whose method a phone cannot host.** *Social Sciences Thuto 4* found the first subject **whose content can be false**. *Mathematics Thuto 5* found the subject **the whole market gets wrong with stopwatches**, and it found that **its two least-used files — `care.ts` and `docs/facts.md` — belonged to some other subject.**

**This is that other subject.**

Natural Sciences and Technology is a **practical**. Its ATP does not ask a child to think about metals; it asks her to *investigate, compare and record the properties of some metal objects*. It does not ask her to know about circuits; it asks her to *make a complete simple circuit* out of a cell, a wire and a bulb. It asks her to *burn three different fuels and compare the output energy*, to *build a skeleton out of straws and tape*, to *mix plaster of Paris and water*, to *make a fossil in play-dough*. **A phone is none of these things. It is not a laboratory, it is not a workbench, and it is not a box of matches — and the last one is the point.**

**Five rules follow. The first two are the hard constraints of this product.**

> **1. The app teaches the science, shows the investigation, and calls the practical into the child's own hands — but it never performs the experiment and never fakes a result.** Where the ATP says *"investigate"*, *"make"*, *"build"*, *"burn"*, the app does not simulate a burning candle or a lighting bulb and call it done. It explains the idea, draws the apparatus (§7.5), and **hands the doing to the child through `doItYourself`** (§7.4), with the things she actually has. **This is *Mathematics Thuto 5* rule 4 turned the other way.** There, the phone was a better die than a die, so it ran the experiment. **Here the phone is a worse everything, so it refuses to.** A rusted nail on a screen is a drawing; the child rusts a real nail (§18.1 finding 3).

> **2. Nothing sends a child alone toward danger.** This ATP prints ***Safety with fire*** and ***Safety with electricity*** as topics, and its investigations involve **burning fuels, a lit candle, a hot stove, and mains sockets**. A ten-year-old is alone in the house. **So fire and mains electricity are taught as knowledge and as safety, and they are never a solo hands-on call.** *"Burn three fuels"* becomes *"here is what happens when each burns, and this one you do with a grown-up watching"*; *"trace the electricity to the wall socket"* becomes *"never put anything into a socket, and here is why"*. **Only genuinely safe materials are ever called for a child on her own** — straws, tape, elastic bands, a torch cell, magnets, soil, water, seeds, play-dough (§7.4, §11 check 1).
>
> **This is the file that was dead in *Mathematics Thuto 5*.** That app carried `src/content/care.ts` forward with an empty register because *"mathematics cannot hurt a child"*. **Here it is load-bearing again** — not for the emotional reason it is in *Life Skills*, but for a physical one: fire burns and sockets kill. §18.1 finding 2.

> **3. Every claim the app makes about the real world is sourced, and a wrong one is caught at build time.** Natural Sciences is **made of facts** — *green plants make their own food from air, water and sunlight*; *only iron rusts*; *the Earth takes about 365 days to travel around the Sun*; *limestone is used to make cement*; *the Cradle of Humankind is in South Africa*. **A child carries a wrong science fact for life.** Every cause, property, process, unit and place-claim carries a **`factRef`** into `docs/facts.md`, and the validator fails the build on a claim with no source (§11 check 3).
>
> **This is the other file that was nearly dead in *Mathematics Thuto 5*** — where the only claims were the metric units and the calendar. **Here it is the busiest file in the repo.** §18.1 finding 1.

> **4. No English word is assumed beyond what the Grade 5 FAL app has taught by that term.** `CORE_WORDS` is ***English FAL Thuto 5*'s finished ledger, read one term behind**, exactly as in *Life Skills Thuto 5* and *Mathematics Thuto 5*. **This is the third app to spend that ledger, which settles it as the family's rule** (§18.1 finding 4). Scientific vocabulary — *vertebrate*, *invertebrate*, *photosynthesis*, *malleable*, *ductile*, *circuit*, *sedimentary*, *fossil*, *orbit* — is **exempt from the budget and never from the gloss**.

> **5. Nothing is timed, nothing is scored, and nothing is a mark.** Inherited from seventeen apps. This ATP prints a **practical task/investigation** and a **test** as the formal assessment of every term (Term 4 a test alone), and it prints a **skeleton-building project** with a marked rubric. **None of it reaches the child.** Stars and encouragement only, and finishing always earns three stars.

**And two things are true of this subject and worth saying before §7 starts.**

**a) The subject is two subjects wearing one name.** *Natural Sciences* is knowledge — observe, compare, classify, explain. *Technology* is **design-and-make** — *design, draw, make and evaluate a skeleton*; *make a complete simple circuit*; *process materials to make new ones*. The ATP weaves the two together: every strand carries a make-task. **The app carries both**: the science is taught on the phone, and **the Technology brief is called off the phone, into the child's hands, as the term's biggest `doItYourself`** (§6.5b). This is the mirror of *Life Skills Thuto 5*'s three study areas — one subject, more than one thing to do.

**b) This subject is made of diagrams.** A skeleton, a food chain, a life cycle, a circuit, the journey of electricity from the power station, the Earth's orbit, the layers of soil, a sedimentary rock, a trace fossil. **`SourceFigure` does more work here than in any previous app** — more even than in *Mathematics Thuto 5* — and this is the fifth lineage to hold it (§7.5).

The app ships as a **single-subject Grade 5 app — NS&Tech, the entire year**. The multi-subject machinery is inherited and intact and is deliberately not used.

All content is **bundled locally**. The data layer is abstracted so a **MongoDB-backed API** can drop in later with no change to the UI.

**Primary context of use:** a child alone at home on a **low- or mid-range Android phone**, frequently **offline** or on limited data, **with no laboratory, no workbench and nobody to ask**, and in a household where the language of the app is not the language of the house.

---

## 2. Goals & non-goals

### 2.1 Goals (v1)

1. Let a **ten-year-old** open the app, find today's lesson on the calendar, and complete it with **no adult help** — and know which practicals to save for when an adult is there.
2. Deliver the **complete Grade 5 NS&Tech year** — all four knowledge strands, all ~16 CAPS topics, and the four Technology make-tasks — as tap/listen/read/look/do lessons (§8.1).
3. **[new] Teach the investigation, show it, and call it into her hands — never fake it** (§1.1 rule 1, §7.4).
4. **[new] Never send a child alone toward fire or mains electricity.** §1.1 rule 2, §8.2b, §11 check 1.
5. **[changed, and load-bearing] Source every real-world claim, and fail the build on an unsourced one.** §1.1 rule 3, §11 check 3.
6. **[changed] Spend the sibling app's vocabulary budget rather than inventing one.** §1.1 rule 4, §8.3. **Third time of asking, and it is now how this family builds a grade.**
7. Give the child a real thing to **do** — build, mix, connect, observe — with things she has, and a spoken description of the science behind it.
8. Work **fully offline** and feel fast on a budget Android device.
9. Keep children **safe** in every sense — no ads, no open text input, no external links, no microphone, no camera, no contacts, no PII beyond a first name and avatar; **and no instruction that puts a child in physical danger.**
10. **Never show a child a mark.** Stars and encouragement only. Finishing always earns three stars.
11. Give parents a glanceable view. The per-topic parent note ships, and **in this subject it names the practical the fortnight is building toward** and **flags the ones that need a grown-up**.

### 2.2 Non-goals (v1)

- No real backend / cloud accounts yet (local simulation only).
- No teacher dashboard yet — but progress is captured per **knowledge strand** from day one (§10).
- No multiplayer, social, or chat features.
- **No keyboard and no free text input, ever.** Inherited from seventeen apps.
- **No timer, no stopwatch, no countdown, no streak, no speed, no lives, ever.** §1.1 rule 5.
- **No leaderboard and no comparison to another child, ever.**
- **No marks, no percentages, no tests, no rubrics, no SBA language.** §1.1.
- **[new] No simulated experiment presented as a real result.** The app does not "burn" a fuel, "light" a bulb as evidence, or "grow" a plant and call the investigation done. A circuit *model* that shows the closed-path idea is allowed (§7.2); a circuit that claims *"your bulb is now lit, the experiment worked"* is not. §1.1 rule 1.
- **[new] No solo instruction involving fire, flame, burning, a hot surface, or mains electricity.** Permanent. §1.1 rule 2.
- **No adaptivity and no remediation path.** A wrong answer gets an explanation, not a different route.
- **No microphone, no camera, no contacts.**
- **No network of any kind**, and no `INTERNET` permission in the manifest (§12).
- No multilingual audio yet (English first; the model holds nso/ts/ve/zu/xh/af for later).
- No other subjects present.

### 2.3 Success metrics

| Metric | Target (v1) |
| --- | --- |
| A child finishes a lesson unaided | ≥ 80% of started lessons |
| **Every word of content on screen is one tap from being spoken** | **100% of activities, every term — a build gate** (§17 test 2) |
| **The app is fully operable with all content text covered** | **the chrome test — a build gate** (§17 test 1) |
| **Real-world claims without a `factRef` in `docs/facts.md`** | **0. Build fails otherwise** (§11 check 3) |
| **Hands-on calls involving fire or mains electricity as a solo activity** | **0. Build fails otherwise** (§11 check 1) |
| **Hands-on calls whose kit is not on the allowed-materials list** | **0. Build fails otherwise** (§11 check 1) |
| **Anything that measures elapsed time anywhere in the app** | **0. Build fails otherwise** (§11 check 5) |
| Words outside the ledger without a glossed picture | **0. Build fails otherwise** |
| Texts outside their term's ramp | **0. Build fails otherwise** |
| Every figure has a spoken description that answers the question without it | **100% — a build gate** (§11) |
| Daily return (Look Closely + I Wonder) | ≥ 3 of 5 weekdays for active users |
| Cold start on a 2019 budget Android | < 2.5 s |

---

## 3. Users & personas

**Naledi, 10, Grade 5.** **The same child *Mathematics Thuto 5* was written for.** She is being taught every subject in English and speaks Sesotho at home. She is curious about how things work and she has never seen a laboratory. **She has a torch, some elastic bands, soil in the yard and an old cereal box — and that is her science kit**, which is why §7.4 is built the way it is.

**Sipho, 11, Grade 5.** Reading about two years behind, and NS&Tech is **thick with new words** — *invertebrate*, *photosynthesis*, *malleable*, *sedimentary*. He will tap the speaker on every one, and he is why §8.3's ledger and §8.4's ramp exist in a science app.

**The child alone in the kitchen.** **This persona governs every hands-on call in this app** and it is new. She is ten, she is on her own after school, and the ATP she is following asks her to *burn three fuels* and *trace the electricity to the wall socket*. **Everything in §1.1 rule 2 is written for her**: the app never tells her to strike a match, never tells her to touch a socket, and marks every practical that needs heat or a flame as *"do this when a grown-up is there"*.

**The child who is told science is not for people like her.** She is ten and she has decided science is white coats and things she will never touch. **The whole product answers her**: the science is the spaza, the taxi, the soil in her yard, the rust on the gate, the food chain that starts with the grass the goat eats. Real quantities, real contexts, South African plants and animals and the Cradle of Humankind down the road.

**A parent or gogo.** Gets one sentence per topic saying what the fortnight is building toward, and **a clear flag on the practicals that need an adult** — *"this week she may ask to light a candle; please be there"*.

---

## 4. Design principles (the hard constraints)

1. **Tap only.** No typing, no gesture a ten-year-old has to learn.
2. **Text is the content, never the interface.** Content text is displayed, large, and every word speaks on tap. **Chrome text carries no answer, ever.**
3. **No English word is assumed beyond the sibling app's ledger, one term behind.** Every word outside it is glossed, and every gloss carries a picture. §1.1 rule 4.
4. **[new] The app teaches and calls; it does not perform.** Where the method is hands-on, the doing is the child's, with real things (§7.4). §1.1 rule 1.
5. **[new] Nothing the app says can put a child in physical danger.** Fire and mains electricity are knowledge and safety, never a solo call. §1.1 rule 2.
6. **[changed] Every real-world claim is sourced.** `factRef` into `docs/facts.md`, checked at build time. §1.1 rule 3.
7. **The picture supports the text; it never replaces it and it never carries the answer alone.** **A figure carries a spoken description that answers the question without the picture** (§7.5). **In this subject that is harder and more important than in any previous one**, because the diagram *is* the content half the time.
8. **Nobody fails.** A wrong tap replays the step or line the answer came from — never a red X, never a score.
9. **South African science.** Indigenous plants and animals, the goat and the mielie, the paraffin stove and the coal fire, the rust on a corrugated roof, South African soil, South African fossils. The ATP asks for this by name — *"South Africa has a wide variety of indigenous plants and animals"*, *"South Africa's fossil record"*, *"the Cradle of humankind"*.
10. **Real materials, real investigations.** The ATP names the resources — straws, tape, magnets, a torch cell, wire, a bulb, soil, seeds, play-dough, a candle. **The app's hands-on calls use only what a child in this country actually has**, and it says so.
11. **56 dp minimum target, 0.95 narration, four activities a sitting.** **Inherited and not re-derived. Not one of them moves** (§15.3).
12. **Write for eleven.** Flat, short, respectful praise; no exclamation marks; no cute emoji; and **no fear**. A lesson about fire is calm and factual, not a warning poster.

---

## 5. Information architecture & content model

### 5.1 The calendar is the navigation surface — *reused untouched*

The child sees a month of the Grade 5 learning year. Topics sit on their ATP weeks as coloured emoji tiles; tapping one speaks the title and opens it. The same lesson pattern is generated for previous and future calendar years, so browsing into 2027 or 2028 still shows the lessons. Under the grid: today's lesson, the three daily rhythms, "my lessons", completion stars, term badges. Everything self-narrating.

### 5.2 One subject, four knowledge strands — **[changed] the strand is the term**

CAPS Intermediate Phase NS&Tech has four knowledge strands, and **this ATP prints one per term, in order**:

- **LIF — Life and Living** (Term 1)
- **MAT — Matter and Materials** (Term 2)
- **ENE — Energy and Change** (Term 3)
- **EAR — Planet Earth and Beyond** (Term 4)

`ContentArea = 'LIF' | 'MAT' | 'ENE' | 'EAR'` is the strand. **Unlike *Mathematics Thuto 5*, where a topic's area was a label and the split was by hours, here the strand *is* the term**: every Term 1 topic is LIF, every Term 2 topic is MAT, and so on. Confirm the four spoken labels in `src/i18n/index.ts` in the fork step.

> **And the fifth thing the subject teaches, woven through all four strands, is Technology.** *Technology* is not a strand and not a term — it is a **design-and-make brief inside each strand**: build a skeleton (LIF), process materials (MAT), make a circuit (ENE), make an Earth model or a fossil (EAR). It is carried as a `makeTask` on the topic and delivered as a `doItYourself` call (§6.5b), not as a content area. **Do not add a fifth `ContentArea` for it** (§7.3).

### 5.3 Content hierarchy — **[changed] the topic is a CAPS topic and its length is the ATP's weeks**

```
Subject → Term(=Strand) → Topic → Lesson → Activity
                                    └ Term "Star Challenge" (light review)
```

**This ATP prints durations in weeks against each topic**, and they run from **one week to three**. A one-week topic and a three-week topic are not the same size:

| Term 3 topic | Weeks |
| --- | ---: |
| Stored energy in fuels | 3 |
| Energy and electricity | 3 |
| Energy and movement | 2 |

> **The rule: `lessons = round(weeks × 4 / 3)`, clamped to 2 and 5.** Three weeks is about four sittings' worth of new idea in a subject that moves one concept at a time; one week is two. The clamp exists because a two-lesson topic still needs a beginning and an end, and because nothing in this family has ever needed more than five lessons for one science topic.

**§8.1 records the resolved number for every topic**, because it is a judgement and the checkpoint is to confirm it.

| Lesson | What it is |
| ---: | --- |
| 1 | **Meet it.** The idea, shown and named. Opens with the topic's **investigation account** (§6.5a) — a `read-text` that walks the observation the way the ATP's investigation would. |
| 2 … n−1 | **Look at it.** One new concept per lesson, each anchored back to a line of the account, most carrying a `SourceFigure`. |
| n | **Do it.** The topic's Technology make-task or its investigation, as a `doItYourself` call, with a spoken description of the science and a clear safety line (§7.4). |

### 5.4 Subjects at launch

One: `ns-tech-g5`. Storage prefix `nstthuto5:`. **A household can now hold four Thuto apps on one phone — Mathematics 5, Life Skills 5, English FAL 5 and this — plus their Grade 4 selves.** §14.2 and §17 test 8 are about that.

### 5.5 Scheduling model — *reused, and read §16.6 first*

Inherited whole:

- Terms are **week offsets** inside a rolling 52-week learning year. On first launch the year starts on the current week's Monday, giving the child a complete twelve-month calendar. The resolved start Monday is stored, then advances by 52 weeks when the cycle ends.
- **Topics occupy their ATP week ranges**, computed from the printed **durations** (§18.2), and `src/domain/schedule.ts` spreads a topic's lessons across its teaching days.
- The calendar can be browsed across years. Previous and future years generate the same lesson schedule from the same curriculum data.
- When a new 52-week cycle begins, lesson completion and yearly badges start fresh; the child profile, settings and word wall remain.
- **Daily rhythms** appear every school day, all year.
- **`grade: 5`.**

> **[changed] The app calendar uses four 13-week windows inside a 52-week year.** The ATP durations still determine each topic's relative placement and lesson count, but the app leaves review and breathing space so the complete curriculum spans twelve months. The windows begin at week offsets **0 / 13 / 26 / 39**. This is an app-calendar decision, not a claim that the ATP has thirteen printed teaching weeks per strand.

**The assessment weeks, and what the app puts in them:**

| Term | The ATP's assessment | What the app puts there |
| --- | --- | --- |
| **Term 1** | ATP assessment and revision | **Term 1 Star Challenge** in week 13 |
| **Term 2** | ATP assessment and revision | **Term 2 Star Challenge** in week 13 |
| **Term 3** | ATP assessment and revision | **Term 3 Star Challenge** in week 13 |
| **Term 4** | ATP assessment and revision | **Term 4 Star Challenge** in week 13 |

### 5.6 The "simulate now → MongoDB later" seam — *inherited untouched*

`ContentRepository` and `ProgressRepository` interfaces, local implementations, one swap point in `src/data/index.ts`. No change, ninth fork running.

### 5.7 What is cumulative, and what is not

Four constraints govern content in this app. **Two are inherited-and-alive, one is borrowed, and one comes across dead.**

| Constraint | Where | What is new in Grade 5 NS&Tech |
| --- | --- | --- |
| **The facts register** | `src/content/facts.ts` (via `factRef`), `docs/facts.md` | **[alive, and the busiest file in the repo].** Every property, process, cause and place-claim is sourced (§8.5, §11 check 3). **This is the file *Mathematics Thuto 5* carried nearly empty** (§18.1 finding 1) |
| **The care / safety register** | `src/content/care.ts`, `docs/care-guide.md` | **[alive again, for a physical reason].** Fire, flame, burning, hot surfaces and mains electricity. **This is the file *Mathematics Thuto 5* carried empty** (§18.1 finding 2) |
| **The word ledger and gloss budget** | `src/content/ledger.ts` | **[borrowed] It is *English FAL Thuto 5*'s ledger, one term behind**, plus a scientific-vocabulary exemption list (§8.3) |
| **The prerequisite ladder** | `src/content/ladder.ts`, `docs/ladder.md` | **[inherited, and dead].** NS&Tech's four strands are largely independent — Term 1 food chains are not a prerequisite for Term 3 circuits — so the ladder ships **empty**, its check passing trivially. **This is the file *Mathematics Thuto 5* wrote from scratch**; here it goes quiet again (§8.2a, §18.1 finding 5) |

> **The dead-file pattern, now shown three times across the family.** `ladder.ts` was dead in *Life Skills*, alive in *Mathematics*, and dead here. `care.ts` was alive in *Life Skills*, dead in *Mathematics*, and alive here. `facts.md` was alive in *Social Sciences*, nearly dead in *Mathematics*, and alive here. **A fork's dead files are the next subject's spine; carry them, empty, with their checks wired** (PRD §18.1 finding 1 of *Mathematics Thuto 5*, confirmed a third time).

---

## 6. Features (v1)

### 6.1 Calendar home — *reused untouched*

### 6.2 Onboarding & child profiles — **[deferred to v1.1]**

A single local profile (`child-1`) created silently on first launch.

### 6.3 Lesson player — *reused untouched* (`app/lesson/[id].tsx`)

**Two lines change**, both inherited from siblings: a wrong tap on an option carrying a `why` speaks that `why` (borrowed from *Mathematics Thuto 5* §6.5b), and a `doItYourself` call renders its safety line before its steps (borrowed from *Life Skills Thuto 5*).

### 6.4 Interaction types — *thirteen reused, one edited, one new* (§7)

### 6.5 The four shapes this year needs

#### 6.5a The investigation account — **[new use of `read-text`], and it is this subject's spine**

Every topic opens with one. It is a `read-text` with `textType: 'investigation'` and **nothing else changes**: every word speaks on tap, the lines are numbered observations, and every question in the topic may point back at one with `fromLineId`.

1. **`read-text`** — the investigation account, at this term's ramp, every word speaking on tap. *"We put a nail in water. We left it for a week. The nail went orange and rough. This is rust."*
2. **A `SourceFigure`** — the apparatus or the diagram, tappable, with a spoken description (§7.5).
3. **`listen-choose` or `select`** — *what did we observe? why did it happen?* — anchored to a line of the account.
4. **A `doItYourself`** — the child does the real thing, safely (§7.4).

> **The account is not the experiment.** It is an honest, plain description of an investigation the child can then do herself. **It never says "and so your nail is now rusty" — the child's nail rusts in the child's yard** (§1.1 rule 1).

#### 6.5b The hands-on call — **[borrowed and made central], and rules 1 and 2 live here**

`doItYourself` comes across from *Life Skills Thuto 5*'s making lessons. **It is the most-used component in this app after `SourceFigure`**, because the Technology half of the subject and every investigation live in it.

```ts
doItYourself('a4', 'Now make a circuit that lights the bulb.', {
  need: ['a torch cell', 'a piece of wire', 'a small bulb'],   // from the allowed list
  safety: 'A torch cell is safe to hold. Never use the plugs in the wall.',
  steps: [
    ['s1', 'Touch one end of the wire to the bottom of the cell.'],
    ['s2', 'Touch the bulb to the top of the cell.'],
    ['s3', 'Touch the other wire to the side of the bulb.'],
    ['s4', 'When the path is joined all the way round, the bulb lights.'],
  ],
  factRef: 'circuit-complete-path',
});
```

- **`need` lists only things on the allowed-materials list** (`docs/do-it-yourself.md`). A call for *"a lit candle"* or *"the wall socket"* fails the build (§11 check 1).
- **`safety` is required on every call**, and it is a plain instruction, never a fright. *"A torch cell is safe to hold"*, not *"batteries can be dangerous"*.
- **A call that needs heat, flame or an adult carries `withAdult: true`**, which the player renders as *"Do this when a grown-up is there"* and which the parent note names in advance. **A call may not be both `withAdult: false` and involve a forbidden material** — the validator enforces it.

#### 6.5c The labelled diagram — **[new component `label-diagram`], and it is the one this subject earns**

The ATP's most repeated verb, across all four strands, is **label / identify / draw with correct symbols**:

- *Label a diagram of the human skeleton.*
- *Draw simple circuit diagrams with correct symbols and labels.*
- *Describe and identify the main features of the Earth.*
- *Identify and describe different soil types.*

**`label-diagram` is a `SourceFigure` whose parts are tap targets, with a bank of names to place on them.** The child hears a name — *"the skull"*, *"the cell"*, *"the topsoil"* — and taps the part it belongs to; the part lights when it is right. **When every part is placed, the diagram is complete** — and for a circuit, a complete set of labels *is* a closed path, so the drawn bulb lights (a model, not a claimed experiment — §7.2, §7.3).

> **This is the one new component, and §7.3 is the list of things that looked like a second and are not.** A circuit builder, a food-chain sequencer, a classification sorter — all of them are inherited types over a `SourceFigure`, and building them new would be the scope creep the family spent *Mathematics Thuto 5* learning to avoid.

#### 6.5d The fact — **[borrowed and made central], and rule 3 lives here**

Every activity that states something about the real world carries a **`factRef`**, keyed into `docs/facts.md`, which holds the claim and a source. **In this subject that is most activities**, because the subject is knowledge. *"Only iron rusts"*, *"the Earth takes 365 days to orbit the Sun"*, *"limestone makes cement"* — each is a line in the register, checked at build time. §8.5, §11 check 3.

---

## 7. Interaction component library

Thirteen types inherited from *Life Skills Thuto 5*, none deleted:

`read-text` · `listen-choose` · `select` · `sequence` · `match-connect` · `sort-baskets` · `assign-slot` · `explore-cards` · `draw-canvas` · `memory-match` · `move-along` · `habit-tracker` · `spell-word`

Plus **`doItYourself`**, inherited from the same base and made central (§6.5b).

### 7.1 The component that leaves

**None.** Fourth fork running with an empty deletion table. **The `move-along` and `beat-along` and `habit-tracker` types come across unused** — this subject has no movement row and no music row — and they are kept, wired, for the reason §5.7 gives: a fork's dead types are the next subject's spine.

### 7.2 The one component that arrives — **`label-diagram`**

| Component | Lines | What it is for | ATP rows it serves |
| --- | ---: | --- | --- |
| **`label-diagram`** | ~180 | Tap the named part of a drawn diagram; the part lights when right; a complete set completes the picture (and closes a circuit) | *label the skeleton*; *draw circuit diagrams with correct symbols and labels*; *identify the main features of the Earth*; *identify and describe soil types*; *distinguish body and trace fossils* |

**~180 lines of new component, over `SourceFigure`.** For comparison, *Mathematics Thuto 5* added six components and ~1 800 lines; **this subject needs one**, because its interactions are *classify, sequence, match, observe and label*, and four of those five already exist as types.

> **This is not scope creep and it is the honest count.** The subject is about knowledge and observation, and the family already has thirteen shapes for knowledge and observation. The single thing it does not have is *point at the part of the picture that has this name*, and that is what `label-diagram` is (§6.5c).

### 7.3 What did **not** become a component, and why

| Looked like a component | Is actually |
| --- | --- |
| A food chain to build (grass → buck → lion) | **`sequence`.** A food chain is an order, and the inherited component orders picture cards; the ATP's verb is *"sequence… to make up a proper food chain"* |
| Classifying animals (vertebrate/invertebrate, herbivore/carnivore) | **`sort-baskets`.** Applying criteria to sort into groups is exactly what it does, and the ATP's verb is *"classify"* and *"sort"* |
| A life cycle (egg → tadpole → frog) | **`sequence` on a ring**, or `sort-baskets` by stage. A cycle is an order that returns |
| A circuit to build so a bulb lights | **`label-diagram`.** Placing the symbols so the path is closed *is* completing the labels, and the drawn bulb lights as a model. A separate physics simulator would be the thing §1.1 rule 1 forbids — and the *real* circuit is a `doItYourself` with a cell, a wire and a bulb |
| Matching a property to a material (shiny → metal) | **`match-connect`** |
| Reading a diagram of the electricity journey | **`SourceFigure`** with its spoken description |
| A skeleton to build | **`doItYourself`.** The ATP's own words are *"design, draw, make and evaluate a skeleton"* out of straws and tape — the making is in the child's hands, off the phone |
| A rusting nail, a burning candle, a growing seed | **Nothing on the phone. `doItYourself` + `SourceFigure`.** The app never simulates the result (§1.1 rule 1) |

### 7.4 The component that is borrowed and made central — **`doItYourself`, with a real allowed-materials list**

A `doItYourself` call names what to `need`, a `safety` line, numbered `steps`, an optional `withAdult`, and a `factRef`. **`docs/do-it-yourself.md` holds the allowed-materials list**, and the validator reads it (§11 check 1), exactly as *Life Skills Thuto 5* read its movement-guide's allowed-kit list.

**The allowed list is the things a South African child in a poor household actually has, and only the safe ones:**

> straws · sticky tape · wooden sticks or dowels · paper · cardboard · a cereal box · string · elastic bands · a metal spring · a torch cell · a small bulb · a short piece of wire · magnets · a nail · a coin · soil · sand · clay · water · a jar or bottle · seeds · play-dough · a ruler

**And the list of what a call may never `need` for a child on her own:**

> a match · a lighter · a candle (lit) · a flame · a fire · a stove · a hot plate · boiling water · a wall socket · a plug · mains electricity · a knife · a blade · anything sharp or hot

> **A call that needs anything on the second list fails the build unless it is `withAdult: true`**, and even then fire and mains electricity are only ever *watched*, never *done by the child* — the ATP's *"burn three fuels"* becomes *"watch a grown-up burn three fuels and describe what you see"* (§11 check 1, §17 test 5).

### 7.5 The component that is borrowed — **`SourceFigure`, and this is the fifth lineage**

A drawn, themed, tappable `react-native-svg` figure with a **required spoken description**, plus the `src/figures/` convention.

**It is now in five lineages — *Social Sciences Thuto 4*, *English FAL Thuto 5*, *Life Skills Thuto 5*, *Mathematics Thuto 5* and this — and the extraction is more overdue than ever** (§18.8 #1). This app needs more figures than any before it.

**This app's figures, and there are more of them than in any previous app:**

| Figure group | Count | What they carry |
| --- | ---: | --- |
| Life and living | ~10 | a human skeleton (labelled), a fish/bird/frog skeleton, vertebrate vs invertebrate, a crab's shell, a food chain, a food web, a flowering-plant life cycle, an animal life cycle, herbivore/carnivore teeth |
| Matter and materials | ~8 | metal vs non-metal objects, a magnet test, a rusting nail over a week, plaster/concrete/clay-brick, raw vs processed material, weaving |
| Energy and change | ~8 | fuels burning, a candle under jars of three sizes, a cell, a simple circuit (labelled), circuit symbols, the electricity journey (power station → pylons → substation → home), a stretched elastic and a compressed spring |
| Planet Earth and beyond | ~10 | the Earth's orbit, the Earth's axis and day/night, the Earth's main features, soil layers (topsoil/subsoil/rock), sandy/clayey/loamy soil, the formation of sedimentary rock, rock layers, a body fossil, a trace fossil, a map of South African fossil sites |

**~36 figures.** As many as *Mathematics Thuto 5*, and half of them carry claims — so every one has a `factRef` where it states something real, and `docs/facts.md` lists it (§18.1 finding 1).

> **Every one carries a spoken description that answers the question without the picture** (§4 principle 7). *"A food chain: grass, then a buck eating the grass, then a lion eating the buck, with arrows pointing from each one to the next"* lets a child who cannot see it answer *"what does the arrow mean?"*; *"a food chain"* does not.

### 7.6 What the phone can and cannot do — **[new], and it is the heart of this subject**

| ATP concept | The phone does it |
| --- | --- |
| ***"Label a diagram of the human skeleton"*** | **`label-diagram`. Directly** — the one thing the phone does better than paper here (§6.5c) |
| ***"Sequence plants and animals to make a food chain"*** | **`sequence`** |
| ***"Classify animals as herbivores, carnivores…"*** | **`sort-baskets`** |
| ***"Explore various ways of making a complete simple circuit"*** | **`label-diagram`** for the closed-path idea, **`doItYourself`** for the real cell-wire-bulb |
| ***"Investigate, compare and record the properties of metals"*** | **`SourceFigure` + `sort-baskets`** on the phone; **`doItYourself`** with a coin, a nail and a magnet in her hand |
| ***"Investigate how rust occurs"*** | **`SourceFigure`** of the week-long change; **`doItYourself`** — the child puts a real nail in water and looks in a week. **The app never rusts a nail on screen** |
| ***"Burn three fuels and compare the output energy"*** | **`SourceFigure` + a described investigation**; the burning is `withAdult` and *watched*, never a solo call (§7.4, §1.1 rule 2) |
| ***"Investigate how long a candle burns under different jars"*** | **`SourceFigure`** of the three jars; the real one is `withAdult`. **The lesson — that the flame goes out when the oxygen is used up — is told and shown, not simulated** |
| ***"Design, draw, make and evaluate a skeleton"*** | **`doItYourself`** with straws, dowels and tape — the Technology make-task of Term 1 |
| ***"Make models of the Earth" · "make a fossil"*** | **`doItYourself`** with play-dough and plaster |
| ***Practical task · investigation · project · test*** | **Nothing.** Marks (§1.1) |

---

## 8. Subject spec — NS&Tech, the whole Grade 5 year

**§8.1 and §8.2 are the deliverable of §18.6 steps 3–4 and the first human checkpoint.** They arrive **filled in**, read off the ATP that is already in this folder.

**~16 CAPS topics plus a Star Challenge in each of four terms = ~20 topics. ~50 lessons. ~200 activities.** Lessons per topic are `round(weeks × 4/3)` clamped 2 and 5 (§5.3); a Star Challenge is one lesson of five.

### 8.1 The proposed year

Each topic is a **CAPS topic** read off the ATP's `CAPS Topics` column, with the weeks the ATP gives it. **🔬 marks a topic whose last lesson is a hands-on investigation · 🔧 marks a topic whose last lesson is a Technology make-task · ⚠️ marks a topic that touches fire or mains electricity and therefore the care register.**

#### Term 1 — *Life and living* (amber · 5 topics · 13 lessons)

| Topic | Weeks | Lessons | What it is |
| --- | ---: | ---: | --- |
| **Living Things Around Us** 🌿 🔬 | 2½ | 3 | many different plants and animals in different habitats · **indigenous South African** plants and animals · interdependence of living and non-living things · animals with bones and without (vertebrates and invertebrates) |
| **Animal Skeletons** 🦴 | 1 | 2 | a vertebrate skeleton is bones and joints, inside the body · skull protects the brain, backbone the spinal cord, ribs the lungs and heart · the five groups of vertebrates · label the human skeleton (`label-diagram`) |
| **Skeletons As Structures** 🏗️ 🔧 | 2 | 3 | a skeleton is a frame structure · a crab's shell is a shell structure · **the Technology make-task: design, draw, make and evaluate a skeleton from straws, dowels and tape** (`doItYourself`) |
| **Food Chains** 🌾 🔬 | 1½ | 2 | green plants make their own food from air, water and sunlight · animals depend on plants · herbivores, carnivores, omnivores, scavengers, decomposers · predators and prey · **build a food chain** (`sequence`) |
| **Life Cycles** 🐸 | 2 | 3 | plants and animals grow and develop · a life cycle and reproduction · the four stages of a flowering plant · the stages of an animal · many animals care for their young |
| **Term 1 Star Challenge** ⭐ | — | 1 | one challenge lesson, five activities |

#### Term 2 — *Matter and materials* (teal · 4 topics · 13 lessons)

| Topic | Weeks | Lessons | What it is |
| --- | ---: | ---: | --- |
| **Metals And Non-Metals** ⚙️ 🔬 | 2½ | 3 | metals are shiny, hard, strong, malleable, ductile, melt at high heat · metals are mined · non-metals are dull and brittle · **investigate and compare metal and non-metal objects** (`sort-baskets` + `doItYourself`) |
| **What Metals Can Do** 🧲 🔬 | 2½ | 3 | metals conduct heat · some are magnetic · **only iron rusts** · uses of metals — coins, wire, roofs, bridges · **the magnet test** (`doItYourself`) · **investigate rust** (a real nail, over a week) |
| **Making New Materials** 🧱 🔧 | 2½ | 3 | materials can be processed to make new ones · mixing and setting (plaster, concrete) · mixing (glue paste) · mixing and cooking (dough — **`withAdult`**) · mixing and drying (clay bricks) · new properties · **the Technology make-task: mix and set a real material** |
| **Materials We Make** 🏺 | 1½ | 2 | plaster, concrete, fabric, ceramics, glass, plastic, paint and their properties · processed materials are strong, durable, waterproof, fire-resistant · raw vs natural vs processed |
| **Term 2 Star Challenge** ⭐ | — | 1 | five activities |

#### Term 3 — *Energy and change* (clay · 3 topics · 11 lessons)

| Topic | Weeks | Lessons | What it is |
| --- | ---: | ---: | --- |
| **Energy In Fuels** 🔥 🔬 ⚠️ | 3 | 4 | energy is stored in fuels, including food · everyday fuels — coal, wood, petrol, paraffin, gas, candle wax · burning gives heat and light · **fuels need heat to light and air to keep burning** · **Safety with fire** · **the candle-under-jars investigation — watched, `withAdult`** |
| **Energy And Electricity** 🔌 🔬 ⚠️ | 3 | 4 | energy stored in cells and batteries · a circuit transfers electrical energy · **make a complete simple circuit** (`label-diagram` + `doItYourself` with a torch cell) · circuit symbols and diagrams · the electricity journey from the power station · a power station needs a fuel · **Safety with electricity — never the wall socket** |
| **Stored Energy That Moves** 🪀 🔧 | 2 | 3 | stretched or twisted elastic and compressed springs store energy · releasing them gives movement energy · **make something move with an elastic band or a spring** — a catapult, an elastic-powered toy (`doItYourself`, safe) |
| **Term 3 Star Challenge** ⭐ | — | 1 | five activities |

#### Term 4 — *Planet Earth and beyond* (purple · 4 topics · 11 lessons)

| Topic | Weeks | Lessons | What it is |
| --- | ---: | ---: | --- |
| **The Earth Moves** 🌍 | 1½ | 2 | the Earth orbits the Sun · **about 365 days is a year** · the Earth spins on its axis · **about 24 hours is a day** · the Earth's main features · **make a model of the Earth** (`doItYourself`) |
| **The Ground Beneath Us** 🪨 🔬 | 2 | 3 | the crust is rock and soil · soil, air, water and sunlight support life · topsoil forms slowly from broken rock · sandy, clayey and loamy soil · **once topsoil is lost it cannot be replaced** · **investigate soil types** (real soil from the yard) |
| **Rocks That Remember** 🧱 | 2 | 3 | sedimentary rock forms over a very long time in layers · shale, sandstone, limestone · **limestone makes cement**, sandstone and shale build houses · sedimentary rock has visible layers |
| **Fossils** 🦕 🔧 | 2½ | 3 | fossils are the remains of ancient plants and animals in rock · body fossils and trace fossils · **South Africa's rich fossil record — the Coelacanth, African dinosaurs, the Cradle of Humankind** · **make a fossil impression** (play-dough or plaster, `doItYourself`) |
| **Term 4 Star Challenge** ⭐ | — | 1 | five activities |

**Term colours are inherited and kept:** Term 1 amber · Term 2 teal · Term 3 clay · Term 4 purple. **Fifth grade running**, and note the subject's own colour `#7E57C2` is the launcher's, not the term tiles' (§14.2).

**Reward ladder:** every lesson → 3 stars · every topic → its topic badge · every term → its term badge · all four → the **Grade 5 Science Star 🏆**.

**Term badge emoji, provisional:** 🌿 ⚙️ 🔌 🌍 — confirm once the topic sheet is signed off.

**The strand spread across the year:**

| Strand | Topics | Lessons |
| --- | ---: | ---: |
| LIF — Life and Living | 5 | 13 |
| MAT — Matter and Materials | 4 | 11 |
| ENE — Energy and Change | 3 | 11 |
| EAR — Planet Earth and Beyond | 4 | 11 |

### 8.2 The process-and-design skills — **[changed] a named list, not an executable ladder**

The ATP's seventh page prints **seventeen `Major Process and Design Skills`** — accessing information, observing, comparing, measuring, sorting and classifying, raising questions, predicting, hypothesising, planning and doing investigations, recording, interpreting, designing, making, evaluating, communicating.

**These are not a prerequisite ladder.** Unlike *Mathematics Thuto 5*, where a skill was taught once and could not be used before it, **NS&Tech's process skills are cross-cutting** — a child observes and compares in Term 1 and again in Term 4, and neither is a prerequisite for the other. So:

#### a) `ladder.ts` ships empty, and its check passes trivially

The inherited prerequisite ladder comes across with an **empty rung list**, exactly as it did in *Life Skills Thuto 5*. **The knowledge strands are largely independent** — food chains do not gate circuits — so there is no forward reference to catch. **Leave the check in and let it pass on an empty list; deleting it is a re-merge cost the next fork pays** (§5.7, §18.1 finding 5).

#### b) The process skills are recorded, and each topic names the ones it exercises

`Topic.skills` is a list of process-skill ids (`observe`, `compare`, `classify`, `predict`, `investigate`, `design`, `make`, `evaluate`, `communicate`). **It drives no gate** — it is a label for the parent note and the later teacher view — but the validator checks that **every topic whose last lesson is a `doItYourself` names `make` or `investigate`**, so a make-task cannot be filed as pure recall (§11).

### 8.3 The word ledger — **[borrowed] it belongs to another app, for the third time**

> **`CORE_WORDS` for this app is *English FAL Thuto 5*'s finished ledger, read one term behind**, exactly as *Life Skills Thuto 5* and *Mathematics Thuto 5* read it. An NS&Tech text in term 2 may use any word that app had taught by the end of **term 1**. Everything else is glossed, with a picture, inside a budget of five per text.

**This is the third app to do it, and that settles it.** *Mathematics Thuto 5* argued that a second app spending the ledger turned a one-off into the family's rule; **a third app makes it the way this family builds a grade, full stop** (§18.1 finding 4). **NS&Tech and Social Sciences were both named in *Mathematics Thuto 5* §18.1 as the two that should do this and not re-cut a ledger. This is one of them, doing it.**

| Term | May use | Budget |
| ---: | --- | --- |
| 1 | FAL Grade 4's whole taught ledger (~1 400 words) | ≤ 5 words outside it per text, every one glossed with a picture |
| 2 | + FAL Grade 5 term 1 | same |
| 3 | + FAL Grade 5 term 2 | same |
| 4 | + FAL Grade 5 term 3 | same |

**One exemption list, and it is the subject:**

> **A scientific term is glossed and exempt.** *Habitat*, *interdependence*, *vertebrate*, *invertebrate*, *skeleton*, *joint*, *muscle*, *organ*, *skull*, *vertebra*, *photosynthesis*, *herbivore*, *carnivore*, *omnivore*, *scavenger*, *decomposer*, *predator*, *prey*, *generation*, *reproduction*, *metal*, *non-metal*, *malleable*, *ductile*, *brittle*, *magnetic*, *rust*, *tarnish*, *conduct*, *material*, *process*, *plaster*, *concrete*, *ceramic*, *fuel*, *energy*, *circuit*, *cell*, *battery*, *electricity*, *pylon*, *substation*, *appliance*, *elastic*, *spring*, *orbit*, *axis*, *crust*, *soil*, *topsoil*, *subsoil*, *sandy*, *clayey*, *loamy*, *humus*, *sedimentary*, *limestone*, *sandstone*, *shale*, *fossil*, *coelacanth*.
>
> **These are the words the subject exists to give her.** They are glossed with a picture like everything else, **they carry an explicit `say`** (§9.1), and **they do not count against the budget**.

**The exemption is from the budget and never from the gloss.** The validator counts them and prints them.

### 8.4 The support ramp — **[borrowed unchanged from *Life Skills Thuto 5* / *Mathematics Thuto 5*]**

| Term | Words per text | Paragraphs | Sentence length | Entry mode |
| ---: | ---: | ---: | ---: | --- |
| 1 | **70** | 2 | ≤ 11 | app-first |
| 2 | **80** | 2 | ≤ 12 | app-first |
| 3 | **110** | 3 | ≤ 13 | child-first, app-first for an investigation account |
| 4 | **130** | 3 | ≤ 15 | child-first, app-first for an investigation account |

**Not one number changes**, and the reason is worth stating: an NS&Tech investigation account is not easier to read than a Life Skills text or a Mathematics word problem. *"Sedimentary rocks are formed over a very long time"* is the ATP's own phrasing.

**Two exemptions, both inherited:** a figure's spoken description is outside the word count; and the `steps` of a `doItYourself` call are the app's own voice (an instruction spoken aloud), outside the ramp — a five-step making call is not a five-sentence text.

---

## 8.5 The facts register — **[borrowed and made central], and rule 3 lives here**

Every activity that states something about the real world carries a **`factRef`**, and `docs/facts.md` holds the claim and a source. **This is the borrow from *Social Sciences Thuto 4* by way of *Life Skills Thuto 5*, and here it is the busiest file in the repo.**

The register's rows are grouped by strand, and every claim in §8.1's content is one of them. Examples:

| Ref | Claim | Source |
| --- | --- | --- |
| `plants-make-food` | Green plants make their own food from carbon dioxide, water and sunlight, and release oxygen. | CAPS Gr 5 Life & Living |
| `vertebrates-have-inner-skeleton` | A vertebrate has a skeleton of bones and joints inside its body. | CAPS Gr 5 |
| `only-iron-rusts` | Of the common metals, only iron rusts; others may tarnish. | CAPS Gr 5 Matter & Materials |
| `metals-conduct-heat` | Metals conduct heat and electricity. | CAPS Gr 5 |
| `fuel-needs-air` | A fuel needs heat to light and air (oxygen) to keep burning. | CAPS Gr 5 Energy & Change |
| `earth-orbits-in-365-days` | The Earth takes about 365 days to travel once around the Sun. | CAPS Gr 5 Planet Earth |
| `earth-spins-in-24-hours` | The Earth takes about 24 hours to spin once on its axis. | CAPS Gr 5 |
| `limestone-makes-cement` | Limestone is used to make cement. | CAPS Gr 5 |
| `cradle-of-humankind-sa` | The Cradle of Humankind, a site of important human fossils, is in South Africa. | CAPS Gr 5 · SAHRA |

> **A closed forbidden list rides on top of the register** (§11 check 3, borrowed from the Life Skills facts check): no dose, no brand, no medical instruction, and — new to this subject — **no unsourced superlative** (*"the biggest"*, *"the oldest"*, *"the only"*) unless the ref carries the claim. *"South Africa has a particularly rich fossil record"* is the ATP's own wording and is sourced; *"the oldest fossils in the world"* is not, and the build fails on it.

---

## 9. Technical architecture

Inherited whole from *Life Skills Thuto 5* — which is the exact stack *Mathematics Thuto 5* shipped and this app copies. **The pinned versions and the full repo layout are in Appendix C, and they are not aspirational — they are read out of the working Mathematics Thuto 5 `package.json`.**

- **Expo SDK 57** (`expo ^57.0.21`), **React Native 0.86.3**, **React 19.2.3**, TypeScript **~6.0.3** strict, **expo-router ~57**, new architecture enabled. *(The exact set is Appendix C.1. Do not "upgrade to the latest" — pin these; an Expo SDK bump changes RN, the gradle plugin and the build invocation all at once.)*
- **Expo Go compatible — no custom native modules.** A hard constraint. **`react-native-svg` and `expo-haptics` do not break it, and `label-diagram` is plain React Native over `SourceFigure`.**
- **State:** React context (`AppProvider` in `src/context/`) over the repositories.
- **Local persistence:** `@react-native-async-storage/async-storage`, keys namespaced **`nstthuto5:`**.
- **Audio:** `expo-speech` (device TTS, **`en-ZA`**, falling back `en-GB` → `en-US`) behind a single `speak()` helper in `src/audio/speech.ts`.
- **Drawing:** `react-native-svg` (**15.15.4**) + `PanResponder`; **`src/figures/` arrives with `SourceFigure`** (§7.5).
- **Feedback:** RN `Animated` + `expo-haptics`. **Feedback only.**
- **Routing:** `expo-router` file-based routes under `app/`; `experiments.tsconfigPaths: true` in `app.json` powers the `@/*` → `src/*` alias.
- **Tooling:** `tsx` runs the content validator and the topic-sheet generator as plain TypeScript (`npm run check`, `npm run print:topics`); no compile step, no bundler for the scripts.
- **No randomness.** This subject runs no on-screen experiment (§1.1 rule 1), so there is no `Math.random()` anywhere in content or components.

**No new dependency.** Ninth fork, and the fourth in a row that adds nothing to `package.json` — **`label-diagram` needs only `react-native-svg`, which is already there.** Confirm this against Appendix C.1 in the fork step; if the base's versions differ from Appendix C, **keep the base's own `package.json` and `package-lock.json` and do not hand-edit versions** (§16.6).

### 9.1 TTS and figure caveats

1. **Every scientific term carries an explicit `say`.** *Invertebrate*, *photosynthesis*, *malleable*, *ductile*, *sedimentary*, *coelacanth*. **A device voice saying *"see-la-canth"* for *coelacanth* has taught a wrong word to a child with no way to know** — and *coelacanth* is a South African fish the ATP names with pride.
2. **Every measurement is said the South African way**, inherited from *Mathematics Thuto 5*: *365 days* is *"three hundred and sixty-five days"*, with the *and*.
3. **South African English is the register**, and `en-GB` mispronounces the place names — *Coelacanth*, *the Cradle of Humankind*. Run the smoke test in §18.6 step 1 before writing a line of content.
4. **Never say a mark, a percentage or a rubric level aloud, in any string, anywhere.**
5. **A figure is read before it is shown, not after.** Its spoken description answers the question without it (§7.5, §4 principle 7).
6. **A `doItYourself` safety line is always spoken and always app-first**, in every term, and it is never behind a tap — a safety instruction the child has not heard is a safety instruction that failed (§7.4).

**Device targets:** Android 8+ (primary), iOS 14+; phone-first, tablet-friendly.

---

## 10. Data model (MongoDB-ready)

Inherited whole from *Life Skills Thuto 5*, with five changes and no removals.

```ts
// changed
interface Topic {
  /** [new] The knowledge strand. One per topic, and it IS the term. §5.2. */
  area: 'LIF' | 'MAT' | 'ENE' | 'EAR';
  /** [new] The weeks the ATP gives this topic. `lessons` is derived from it
   *  at authoring time and recorded, never recomputed. §5.3. */
  atpWeeks: number;
  /** [new] The process/design skills this topic exercises. A label, not a
   *  gate. §8.2b. */
  skills: string[];
  /** [new] The Technology make-task, if the topic carries one. Rendered as a
   *  doItYourself in the last lesson. §5.2, §6.5b. Optional. */
  makeTask?: string;
}

// changed
interface ChoiceOption {
  /** [borrowed from Mathematics Thuto 5] On a WRONG option: what this answer
   *  observed or concluded, flatly, never that it was wrong. §6.5, §11. */
  why?: LocalisedText;
}

// added — the one new type, §7.2
interface LabelDiagramActivity {
  figure: FigureId;                 // a SourceFigure with tappable parts
  parts: Array<{ id: string; name: LocalisedText; say: LocalisedText }>;
  /** [new] When true, the drawn figure completes when all parts are placed —
   *  a circuit's bulb lights as a MODEL, never as a claimed experiment. */
  completes?: boolean;
}

// changed — doItYourself gains a real material contract, §7.4
interface DoItYourselfActivity {
  need: string[];                   // every entry on the allowed-materials list
  safety: LocalisedText;            // required, always spoken app-first
  steps: Array<{ id: string; text: LocalisedText }>;
  withAdult?: true;                 // fire, heat, mains — never a solo call
  factRef?: string;
}

// changed
interface Activity { factRef?: string }   // §8.5, and here it is on most activities
```

**`atpWeeks` looks like documentation and is not.** It is the only place the ATP's own weighting survives into the codebase, and **the validator checks the lesson count against it** (§11).

Everything else — `Subject`, `Lesson`, `DailyRecord`, `ChildProfile`, `Progress` — is inherited unchanged. **`ChildProfile.grade` becomes `5`.**

> **And note what is deliberately absent, inherited from *Mathematics Thuto 5*:** no field for time taken, no streak, no best score. A field that does not exist cannot be surfaced by a later feature. §1.1 rule 5.

---

## 11. Content authoring & the validator

`scripts/check-content.ts` is inherited. **Nothing leaves. Five checks are the load-bearing ones this subject needs.**

| # | Check | Fails or warns |
| ---: | --- | --- |
| 1 | **The safety check.** Every `doItYourself.need` entry is on `docs/do-it-yourself.md`'s allowed list. **No call needs a forbidden material** (match, flame, candle, stove, hot, socket, plug, mains, knife, blade) **unless it is `withAdult: true`** — and even then fire and mains are `watched`, never done. **No string anywhere tells a child to light, burn, strike or plug in.** §1.1 rule 2 | **fails** |
| 2 | **The wrong-answer check**, borrowed from *Mathematics Thuto 5*. A `why` is allowed only on a wrong option, may not scold (*wrong*, *no*, *mistake*, *should have*), and may not praise. The validator prints every `why` for a person to read | **fails**, plus a list |
| 3 | **The facts check.** Every activity and figure that states something real carries a **`factRef`**, and `docs/facts.md` has a line for each. **The forbidden list rides on top**: no dose, no brand, no medical instruction, **no unsourced superlative** (§8.5). The validator prints every claim; a person reads the list | **fails**, plus a list |
| 4 | **The no-simulation check.** **No content or component runs an experiment on screen.** Grep-level: `Math.random()` appears in no content and no component; no `doItYourself` step contains *"and now it works"*, *"your … is now …"*, *"the experiment shows"* — the app calls the doing, it does not report the result (§1.1 rule 1) | **fails** |
| 5 | **The clock check**, inherited from *Mathematics Thuto 5*. **No string contains a timing or racing token**, and **no source file outside the inherited animation helpers calls `Date.now`, `performance.now` or `setInterval`.** §1.1 rule 5 | **fails**, plus a list |

**Re-pointed:** **the lesson-count check.** `lessons.length` must equal `round(atpWeeks × 4/3)` clamped 2–5 (§5.3). Change this in the spine step, before any content.

**Promoted from warn to fail:**

- **The `say`-check on any scientific term** (§9.1 caveat 1). *coelacanth*, *sedimentary*, *photosynthesis*.
- **The figure-description check.** A description that names the picture without reporting what is in it fails.
- **The safety-line check**: every `doItYourself` has a non-empty `safety`, and it may not contain a fright word (*dangerous*, *you could get hurt*) — it is a plain instruction (§7.4).

**Inherited and kept, all of them:** the word-budget check with its exemption list · the gloss-picture check · the support-ramp check · the `say`-string check · a `basketId` pointing at nothing · an answer that is not one of its options · a topic scheduled outside its term's weeks · a duplicate id · an empty prompt · a lesson landing on a weekend · two lessons on one calendar day · the four-activities rule · the Star Challenge coverage check · **the marks check, which has a practical, a test and a project to refuse this year** · **the ladder check, which passes trivially on the empty rung list** (§8.2a).

Note what the checks do **not** catch: a `doItYourself` that is technically safe and practically impossible in a two-room house; a fact that is accurately sourced and beyond a ten-year-old; a figure that is correct and unreadable. **Those are judgement, and they are §17 tests 3, 5 and 6 — and one of the three is run by somebody who has cooked on a paraffin stove.**

---

## 12. Non-functional requirements

- **Accessibility:** audio-first. **Tap-to-hear on every word of content, every term, permanently.** Replay on every screen, `narrationRate` 0.5–1.4 with **0.95 default**, **56 dp minimum targets**, high-contrast palette, `reducedMotion` honoured. **Not one of these numbers changes** (§15.3).
- **[new] Every tappable part of a `label-diagram` is a 56 dp target.** A bone the child cannot hit is a label component that does not work.
- **The reading type scale is a requirement, not a style.** Running text at 18 dp minimum, line height 1.6, a tapped word highlighted with a background.
- **Performance:** cold start < 2.5 s · **bundle < 45 MB** · 60 fps scroll on a 2019 budget Android · progress written after every activity · an unrecognised activity type renders a friendly card, never a blank screen.
- **[changed] The bundle ceiling is 45 MB**, matching *Mathematics Thuto 5* — thirty-six figures and one new component. **Build for `arm64-v8a` only** (§16.6).
- **Offline and network:** fully offline, no analytics, **no network request of any kind.** **The Android manifest must not request `INTERNET` or `ACCESS_NETWORK_STATE`** — carry `expo.android.blockedPermissions` across, and **check the built APK with `aapt2 dump permissions`, not the source manifest** (§16.6).
- **No `CALL_PHONE`, no `READ_CONTACTS`, no camera, no microphone.**
- **Localisation-ready:** every string is `LocalisedText`.
- **Privacy:** POPIA-aligned; no child PII off-device. **And no record of how long anything took** (§10).

---

## 13. Roadmap

| Phase | What | Status |
| --- | --- | --- |
| **0** | **The extraction.** `SourceFigure.tsx` and `src/figures/` into a shared package. **Half a day, owed since the *Life Skills* build, and this is the fifth lineage** (§18.8 #1) | **pending — and the count-based trigger has now fired four times** |
| **0b** | **Find the fork base.** §14 decision 1, fifteen minutes that saves a day (§16.6) | pending |
| 1 | Fork *Life Skills Thuto 5*, rename, the spine, the lesson-count rule, the empty ladder, the ledger, `label-diagram`, the five checks | pending |
| 2 | The year — four strands, ~16 topics, ~36 figures, the four make-tasks | pending |
| 2.5 | **Eight acceptance tests** (§17) | pending |
| 3 | **Pre-recorded science-term audio.** Device TTS reads *coelacanth* and *sedimentary* wrong; a recorded set would fix them | open |
| 4 | Pre-recorded voice-over for the investigation accounts | open |
| 5 | **Social Sciences Thuto 5** — the last of the Grade 5 set, behind one grade picker, spending the same FAL ledger | later |
| 6 | Backend: MongoDB + API; `RemoteContentRepository`; offline sync | later |
| 7 | **Home-language track** — a science taught in Sesotho is a different piece of teaching, and this subject's vocabulary is where that bites | later |

---

## 14. Decisions already taken

**Do not re-ask these. Ask only the five in §18.8.**

| # | Question | Decision |
| ---: | --- | --- |
| 1 | **Which repo to fork** | ***Life Skills Thuto 5*.** It is the closest engine: the **`care.ts` safety register, `doItYourself` with a kit-and-safety contract, the `factRef` discipline, `SourceFigure` and the FAL ledger** are all live in it, and this subject needs every one. **Confirm the repo exists first.** The last three builds were told to fork a repo that was not on disk. **The fallback is *Mathematics Thuto 5*** (newer engine, but it carries six unused numeric components; if you fork it, take the same three files and delete nothing). **Take the NS&Tech identity out of `Natural Sciences and Technology Thuto 4.apk`** the way §14.2 says |
| 2 | **The content areas** | **`LIF · MAT · ENE · EAR`, and the strand is the term.** CAPS NS&Tech has four knowledge strands and this ATP prints one per term |
| 3 | **Technology** | **Not a fifth area. A `makeTask` on a topic, delivered as a `doItYourself`** in the last lesson (§5.2, §7.3) |
| 4 | **The unit of a topic** | **A CAPS topic off the ATP's own column.** ~16 of them |
| 5 | **How many lessons a topic gets** | **`round(atpWeeks × 4/3)`, clamped 2–5, recorded on the topic.** This ATP prints weeks, from 1 to 3 (§5.3) |
| 6 | **The term windows** | **Four 13-week app windows in a rolling 52-week year**; ATP durations still place and size topics inside them (§5.5) |
| 7 | **The experiment** | **The app never performs it and never fakes it.** It teaches, shows (`SourceFigure`) and calls it into the child's hands (`doItYourself`). §1.1 rule 1, §11 check 4 |
| 8 | **Safety** | **Fire and mains electricity are never a solo hands-on call.** Taught as knowledge and safety; any real practical with heat or flame is `withAdult` and watched. `care.ts` is alive. §1.1 rule 2, §11 check 1 |
| 9 | **Facts** | **Every real-world claim carries a `factRef` into `docs/facts.md`, checked at build time.** §1.1 rule 3, §11 check 3 |
| 10 | **The new component** | **One: `label-diagram`.** §7.2, and §7.3 is the list of things that are not a second |
| 11 | **The figure component** | **`SourceFigure`, borrowed. Fifth lineage. Extract it first if you can** (§7.5, §18.8 #1) |
| 12 | **The ledger and the ramp** | ***English FAL Thuto 5*'s ledger one term behind, and the ramp unchanged**, with one science-vocabulary exemption list (§8.3, §8.4). **Third app to spend the ledger** |
| 13 | **The prerequisite ladder** | **Empty.** NS&Tech's strands are not strictly cumulative; the ladder ships with no rungs and its check passes (§8.2a) |
| 14 | **Ergonomics** | **Nothing moves.** `touchMin` 56, narration 0.95, four activities, praise bank copied verbatim |
| 15 | **Timing** | **Nothing is timed, ever.** §1.1 rule 5. Permanent |
| 16 | **Marks, tests, the project** | **Out of scope for a child-facing build** |
| 17 | **Storage, package, subject id** | `nstthuto5:` · `za.co.thuto.nstech5` · `ns-tech-g5` |

**Assumptions carried into the build:**

- English-only audio for v1; device TTS stands in for pre-recorded voice-over, and §9.1 is the price of that.
- The ATP's `Informal Assessment` column is **the source of the investigations and the questions**, not a warning list — *"Investigate how rust occurs"*, *"Sequence plants and animals to make a food chain"*, *"Label a diagram of the human skeleton"* are the activities, read straight off it.
- The ATP's `Resources to Enhance Learning` column is **the source of the allowed-materials list** (§7.4) — straws, tape, a torch cell, magnets, soil, play-dough are named there.
- The `SBA (FORMAL ASSESSMENT)` rows and the skeleton project are **teacher logistics**. None of it reaches the app.

### 14.2 The brand — **[changed] read it from the APK, do not choose it**

| | |
| --- | ---: |
| Colour | **NS&Tech's colour, identical to *Natural Sciences and Technology Thuto 4*: `#7E57C2`.** Read out of `Natural Sciences and Technology Thuto 4.apk`'s own `app.config` — **it is already established** (a deep violet). Do not choose one |
| Glyph | **NS&Tech's glyph.** Read off the Grade 4 launcher icon in `res/`; copy, do not choose. If it cannot be read, a plain science glyph on the violet is the fallback, confirmed at the checkpoint |
| Badge | the shared orange circle with a white **5** |
| Launcher label | **`NST 5`** — six characters |

> **The four-plus-icon problem.** A household may hold *Mathematics* 5 (blue), *Life Skills* 5 (green), *English FAL* 5 (red) and this (violet) — and their Grade 4 selves. **Four subject colours, and the badge digit does the grade work** (§17 test 8). The violet `#7E57C2` is close to *Mathematics Thuto 5*'s term-4 purple but distinct from its blue launcher; confirm they are told apart at a glance in test 8.

---

## 15. Planned delta from *Life Skills Thuto 5*

### 15.1 What changes

One new component (`label-diagram`), the investigation-account and word-problem text types, the wrong-answer `why` borrowed from *Mathematics Thuto 5*, `area`/`atpWeeks`/`skills`/`makeTask` on the topic, the lesson-count rule, the borrowed ledger with a science exemption, the `doItYourself` material contract, five validator checks, thirty-six figures, the brand, and **the year**. Everything else is inherited.

### 15.2 What gets deleted

**Nothing.**

| Delete | Lines | Why |
| --- | ---: | ---: |
| — | **0** | — |

**Fourth fork in a row with an empty deletion table.** The Life Skills movement/music types and the Mathematics numeric types (if forked from Maths) come across **unused and undeleted**, for the reason §5.7 gives.

### 15.3 The three numbers

**Line counts below are *estimates*. Measure in fork step 1 with a diff against the repo you actually forked, and correct this table before quoting it** (§16.6).

| | Lines | What it is |
| --- | ---: | --- |
| **Deleted** | **0** | §15.2 |
| **Re-levelled for the grade** | **0** | **This is a new subject in the grade, not a vertical fork, so there is no prior-grade file to re-level.** The finding is that a sideways fork re-levels nothing because there is nothing at the same grade to level against — the mirror of *Mathematics Thuto 5*'s zero, reached a different way (§18.1 finding 6) |
| **Rewritten / new for the subject** | **~3 200** | `label-diagram` (~180), the figures (~1 000), the validator's five checks and the re-point (~450), the ladder left empty (~10), the ledger and ramp (~230), the facts register (~250), the care register (~250), the do-it-yourself guide and its check (~200), the spine and authoring (~300), the daily rhythms (~350) |
| **Content** | **~5 500** | The year — ~16 topics, ~50 lessons, ~200 activities |

### 15.4 What comes from a sibling

| From | What | Notes |
| --- | --- | --- |
| ***English FAL Thuto 5*** | **`CORE_WORDS` and the taught ledger** | §8.3. **Third app to spend it** (§18.1 finding 4) |
| ***Life Skills Thuto 5*** | **`care.ts`, `doItYourself`, `factRef`, `ramp.ts`, `SourceFigure`** | §5.7, §7.4, §7.5. The engine |
| ***Mathematics Thuto 5*** | **The wrong-answer `why`, the clock check, the empty-`care`/empty-`ladder` discipline, the facts.md re-animation** | §6.5, §11. **Take the newest validator and the wrong-answer shape from here even though the base is *Life Skills*** |
| ***Social Sciences Thuto 4*** (via extraction) | **`SourceFigure.tsx` + `src/figures/`** | §7.5. **Fifth lineage. Extract it first** (§18.8 #1) |

### 15.5 What does not change

**Nothing in `app/`, `src/components/ui/`, `src/audio/`, `src/domain/`, `src/data/`, `src/context/`, `src/utils/` or `src/theme/`.** Nine forks, five grades and two phases have crossed this boundary and it holds.

And, specific to this fork: **the praise bank, every ergonomic constant, the calendar screen, the reward ladder, the gloss contract, the daily-rhythm plumbing, and the care machinery** (§15.2).

---

## 16. Fork guide

### 16.1 The seven layers

| Layer | Files | What you do |
| --- | --- | --- |
| **Extraction** | `SourceFigure.tsx`, `src/figures/` | **Do this first, in a shared package.** Half a day (§18.8 #1) |
| **Engine** | `app/`, `src/components/ui/`, `src/audio/`, `src/domain/`, `src/data/`, `src/context/`, `src/utils/`, `src/theme/` | **Nothing.** Copy as is |
| **Deletion** | — | **Nothing** (§15.2) |
| **Identity** | `app.json`, `package.json`, `assets/`, storage prefix, `SUBJECT_ID`, badges, `ui.appName` | Rename — mechanical, ~20 minutes (§16.2) |
| **Curriculum spine** | `src/types/content.ts`, `ladder.ts` (empty), `ledger.ts`, `ramp.ts`, `calendar.ts`, `subjects.ts`, `facts.ts`, `care.ts` | Adapt — **a day** |
| **Components** | `label-diagram` (new), `doItYourself` (material contract), `read-text` (investigation type), the wrong-answer `why` | **A day and a half** |
| **Content** | `src/content/term1–4.ts`, `dailyRhythms.ts`, `docs/*` | Write the year — **6–7 days** |

### 16.2 Step 1 — copy and rename

Copy the fork base, **excluding** `node_modules/`, `.expo/`, `dist/`, `android/`, `ios/`, `.git/` and any `.apk`. Keep `package-lock.json`. Then `npm install`.

**And before anything else: `wc -l` the whole `src/` tree, and diff it against the base, so §15.3 can be corrected with measurements.**

| What | Where | **Set to** |
| --- | --- | --- |
| Package name | `package.json` → `name` | `natural-sciences-and-technology-thuto-5` |
| App name, slug, scheme | `app.json` | `Natural Sciences and Technology Thuto 5`, `natural-sciences-and-technology-thuto-5`, `nstthuto5` |
| Bundle / package id | `app.json` | `za.co.thuto.nstech5` |
| Brand colour | `app.json`, `src/theme/tokens.ts` | **`#7E57C2`** — the Grade 4 value, copied (§14.2) |
| **Blocked permissions** | `app.json` → `expo.android.blockedPermissions` | **carry across unchanged**; confirm `INTERNET`, `ACCESS_NETWORK_STATE`, `CALL_PHONE`, `CAMERA`, `RECORD_AUDIO`, `READ_CONTACTS` are all on it |
| Icons and splash | `assets/*.png` (6 files) | the NS&Tech glyph with a **5** — run `scripts/make-icons.mjs` with the master, as *Mathematics Thuto 5* did (§16.6 finding 5) |
| **Storage key prefix** | `src/data/LocalProgressRepository.ts` → `KEY` | **`nstthuto5:`** on every key |
| Subject id | `src/content/authoring.ts` → `SUBJECT_ID` | `ns-tech-g5` |
| **Grade** | `src/types/progress.ts` → `ChildProfile.grade` | **`5`** |
| Subject entry | `src/content/subjects.ts` | `Natural Sciences and Technology` · the Grade 4 glyph · `#7E57C2` |
| Year badge | `src/domain/rewards.ts` | `grade-5-science-star` · `Grade 5 Science Star` · `🏆` |
| Term badge emoji | `src/domain/rewards.ts` | `🌿 ⚙️ 🔌 🌍` (provisional — §8.1) |
| Spoken app name | `src/i18n/index.ts` → `ui.appName`, `ui.subtitle` | `Thuto 5`, `Natural Sciences and Technology` |
| Launcher label | `NST 5` |
| **Praise bank** | `src/i18n/index.ts` | **do not touch it** |
| Validator banner | `scripts/check-content.ts` | `Natural Sciences and Technology Thuto 5 — content check` |
| README | `README.md` | whole file — **including the three numbers from §15.3, measured** |

> **Do not reuse `lsthuto5:` or `mathsthuto5:`.** A house with three Thuto apps is the ordinary case.

**Confirm the app runs with the old content before changing anything else.** Thirty seconds, and it separates "my fork is broken" from "my edit was wrong".

### 16.3 Step 2 — the spine

1. **The lesson-count rule.** `atpWeeks` on `Topic`, and the validator check that reads it. **Twenty lines, before any content** (§5.3, §11).
2. **The strand.** `area` on `Topic`, four values, the strand is the term (§5.2); the four spoken labels confirmed.
3. **The ladder, left empty.** Keep `ladder.ts` and its check; ship no rungs (§8.2a).
4. **The facts register.** `factRef`, `docs/facts.md`, check 3 (§8.5).
5. **The care register.** `care.ts` with the fire/electricity entries, `docs/care-guide.md` adapted from Life Skills' abuse guide to physical safety, check 1 (§8.2b, §11).
6. **The `doItYourself` material contract.** `need`/`safety`/`withAdult`, `docs/do-it-yourself.md` with the allowed and forbidden lists, check 1 (§7.4).
7. **The `why` on a wrong option**, borrowed from *Mathematics Thuto 5*; check 2.
8. **The ledger and the ramp.** Copy `CORE_WORDS` shifted one term, plus the science exemption list; ramp unchanged (§8.3, §8.4).
9. **The calendar.** Term subtitles, four 13-week windows, a 52-week rolling year, recurring schedules for any viewed year, and fresh yearly completion state (§5.5).

### 16.4 Step 3 — the component, then the year

1. **`label-diagram` first**, over the extracted `SourceFigure` — it needs one figure with tappable parts to prove the 56 dp targets work (§6.5c). Do the **human skeleton** first, because labelling it is the clearest case and the ATP names it.
2. **The five checks** (§11), `docs/facts.md`, `docs/care-guide.md`, `docs/do-it-yourself.md`. **Before authoring, not after.**
3. **`SourceFigure` from the extracted package, plus four figures** — the skeleton, a food chain, a simple circuit, the Earth's orbit. **Do the circuit first**, because it is the one that has to double as a `label-diagram` and a model.
4. **Cut the content to one topic and get `npm run check` green.** This is the moment the fork becomes the new app.
5. **Author term by term**, `npm run check` after every topic.
6. **The rhythms**, once the terms are in.
7. **The four Star Challenges**, last.

### 16.5 Rules the fork inherits — do not break these

- **Every prompt is spoken.** Write prompts the way you would say them.
- **Content text is shown; chrome text never carries an answer.**
- **Every word of content on screen speaks on tap** — every term, every account, every figure label, permanently.
- **Every word outside the ledger is glossed, and every gloss carries a picture.** The science exemption is from the budget, not from the gloss.
- **Nobody fails.** A wrong tap replays the line it came from.
- **[new] The app teaches and calls; it does not perform.** §1.1 rule 1.
- **[new] Nothing sends a child alone toward fire or mains electricity.** §1.1 rule 2.
- **[new] Every real-world claim is sourced.** §1.1 rule 3.
- **Four activities per lesson, five only in a Star Challenge. Two to five lessons per topic, sized by weeks.**
- **No calculator, no number pad, no free text, no camera, no microphone, no network.**
- **South African science throughout.**

### 16.6 What the last three builds learned the hard way — **read this before you start**

1. **The repo you are told to fork may not be there.** All three Grade 5 builds so far discovered mid-fork that only the previous grade's **APK** was on disk. **Check first** (§14 decision 1). And when it happens, `unzip` the APK, read `assets/app.config` for the colour, the package and the scheme, and pull the launcher icon out of `res/`. **That is how `#7E57C2` and `za.co.thuto.nstech5` in §14.2 were established for this document.**
2. **When two parts of this document disagree, resolve it in writing and in the code.** *Mathematics Thuto 5* did this for its term windows; do the same here for anything the ATP's messy duration column leaves ambiguous (§18.2, Appendix A).
3. **Measure the line counts; do not quote §15.3.**
4. **Build the APK for one architecture.** The default is four and produces a ~104 MB APK; `-PreactNativeArchitectures=arm64-v8a` produces ~42 MB. On this machine:

```bash
npx expo prebuild --platform android --no-install
cd android && JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" \
  ./gradlew assembleRelease --no-daemon -PreactNativeArchitectures=arm64-v8a
aapt2 dump permissions app/build/outputs/apk/release/app-release.apk
```

`java` is not on the PATH; Android Studio's bundled JBR 21 is. **And `local.properties` must set `sdk.dir` with forward slashes** — `sdk.dir=C:/Users/…/Android/Sdk` — because a backslash path is read as an invalid escape and the build fails with a misleading *"Invalid file path"* at the React plugin. **This cost the *Mathematics Thuto 5* build two failed runs**; it is the single most likely thing to trip you.

5. **The icons are a script, not a design session.** *Mathematics Thuto 5* ships `scripts/make-icons.mjs`, which decodes one master PNG, floods the background out for the adaptive layer, and writes all six files. **Copy that script, drop in the NS&Tech master, and run it.**

---

## 17. Verifying the fork

```bash
npm install
npm run check      # typecheck + content validation, with a per-term inventory
npm start          # scan the QR code with Expo Go
```

`npm run check` should end with `All content checks passed.` and print something like:

```
Natural Sciences and Technology Thuto 5 — content check
  Subjects: 1 (1 active)
  Term 1: 6 topics, 13 lessons   LIF 12 · challenge 1   weeks: 2.5,1,2,1.5,2
  Term 2: 5 topics, 13 lessons   MAT 12 · challenge 1   weeks: 2.5,2.5,2.5,1.5
  Term 3: 4 topics, 11 lessons   ENE 10 · challenge 1   weeks: 3,3,2
  Term 4: 5 topics, 11 lessons   EAR 10 · challenge 1   weeks: 1.5,2,2,2.5
  Total: 20 topics, 50 lessons, ~200 activities
  Lesson counts: every topic inside round(weeks×4/3) clamped 2-5 — 0 exceptions
  Ladder: empty (this subject's strands are not cumulative) — check passes
  Wrong answers: NN options carry a why — LISTED, needs a read
    forbidden tokens in a why: 0
  Safety: NN do-it-yourself calls, every kit on the allowed list ·
    fire/mains calls: all withAdult and watched · 0 solo danger calls
  Facts: NN claims, all in docs/facts.md · forbidden strings: 0 · superlatives: all sourced
  No simulation: 0 Math.random in content or components · 0 "the experiment shows" strings
  Clock: 0 timing tokens in any string · 0 elapsed-time calls outside the animation helpers
  Figures: 36, every one with a spoken description
  Word ledger: English FAL Thuto 5's ledger, one term behind ·
    NN glossed within budget · NN exempt (science NN) · every gloss carries a picture
  Support ramp: t1 70w · t2 80w · t3 110w · t4 130w — no violations
  Star Challenges: 4
  Scheduled: 2026-01-19 -> 2026-12-04
```

**Eight acceptance tests. Three are new to this subject.**

| # | Test | How | Who |
| ---: | --- | --- | --- |
| 1 | **Chrome test** *(inherited)* | Turn the brightness down until text is a blur. Every button, navigation choice and reward is still operable | anyone |
| 2 | **Read-aloud test** *(inherited)* | Open a lesson from each term and tap every word — the account, the options, the labels, the gloss, **every science term**. Every one speaks, and **every science term speaks correctly** — *coelacanth*, *sedimentary*, *photosynthesis* | anyone |
| 3 | **Stranger test** *(inherited)* | Walk a term 4 lesson as Sipho. Every word outside the ledger is glossed with a picture; every figure, covered, is still answerable from its spoken description | anyone |
| 4 | **[new] Safety test** | **Walk every `doItYourself` in the year and ask: could a ten-year-old alone in a kitchen hurt herself doing this?** No solo call touches fire, flame, heat or a socket; every one that does is marked *"with a grown-up"* and *watched*; every kit is a thing she has. **Run by somebody who has cooked on a paraffin stove** — they will see the hazard an engineer misses | **a parent** |
| 5 | **[new] Fact test** | **Read every `factRef`'d claim aloud and check it against CAPS and reality.** No wrong science. **Run by a Grade 5 science teacher** — they will catch the photosynthesis over-claim and the "only iron rusts" edge case | **a science teacher** |
| 6 | **[new] No-simulation test** | **Use the app for twenty minutes and find anything that claims an experiment happened.** A bulb that "lit", a nail that "rusted", a candle that "went out". The expected result is a `label-diagram` model and nothing else; the doing is always called into the child's hands | anyone |
| 7 | **Do-it-yourself test** | **Try three make-tasks with only what the app said to `need`** — the straw skeleton, the torch-cell circuit, the play-dough fossil. Each must be genuinely doable in a poor household with no extra shopping | a child |
| 8 | **Four-icon test** *(inherited, and it is now four)* | *Mathematics 5* (blue), *Life Skills 5* (green), *English FAL 5* (red) and this (violet) on one home screen. A ten-year-old opens the right one first try | a ten-year-old |

For a release build, see §16.6 — and **check the `aapt2` output for `INTERNET` and `CALL_PHONE` explicitly.**

---

## 18. From an Annual Teaching Plan to a shipped app

§16 says what to change in the repo. **This section says how to get from a PDF of an ATP to the content that fills it.**

### 18.1 The two dead files that come alive, the phone that is honest by refusing, and the ledger that is now a rule

The family has learned one thing per build. **Natural Sciences and Technology Grade 4 found the first ATP whose method a phone cannot host.** *Social Sciences Grade 4* found a subject whose content can be false. *Mathematics Grade 5* found the subject the market gets wrong, and found that its two least-used files belonged to some other subject.

**This build finds six things, and the first two are the same finding from two directions.**

**1. `docs/facts.md`, nearly dead in Mathematics, is the busiest file in this repo.**

*Mathematics Thuto 5* carried the facts register with almost nothing in it — the metric units and the calendar — and said so: the only place a maths app can be factually wrong is a unit table. **Natural Sciences is nothing but real-world claims.** Photosynthesis, rust, conduction, the orbit, the day, cement from limestone, the Cradle of Humankind. **Every one is a line in `docs/facts.md`, and the check that was nearly idle in Mathematics runs on every activity here.**

**2. `src/content/care.ts`, dead in Mathematics, is load-bearing again — for a physical reason.**

*Mathematics Thuto 5* shipped `care.ts` empty because *"mathematics cannot hurt a child"*. **Natural Sciences can.** Not the way Life Skills can — not abuse, not fear — but fire, flame, a hot stove, a mains socket. So the register comes alive with a **new kind of entry**: not *"the child is never in the question"* but *"the child is never told to strike the match"*.

> **The general form, now shown three times and ready to state as a law of this family: `ladder.ts`, `care.ts` and `facts.md` are each dead in some subjects and load-bearing in others, and which is which is a property of the subject, not the code.** Cumulative subjects need the ladder; dangerous subjects need care; factual subjects need facts. **Carry all three, empty where they sleep, wired where they wake.** Mathematics proved the pattern with `ladder.ts`; this build proves it with the other two.

**3. The phone is honest by refusing — the exact inverse of the Mathematics finding.**

*Mathematics Thuto 5* found that **the phone is a better die than a die**, so it should run the probability experiment — twenty honest tosses, never rigged. **Natural Sciences finds the opposite: the phone is a worse everything.** It cannot burn a fuel, rust a nail or grow a seed, and — this is the finding — **it must not pretend to.** A simulated rusting nail teaches that science happens on a screen, which is the lie this whole product exists to refute (§4 principle 10). **So the app's honesty is refusal**: it teaches, it shows, it calls the doing into the child's hands, and it stops.

> **The general form: when the phone cannot host an ATP's method, the failure mode is not "simulate it badly" — it is "simulate it well and call it done." Guard against the good fake, not the bad one.** Mathematics guarded against a rigged experiment; this app guards against a convincing one.

**4. One app's word ledger is now three apps' budget, which makes it law.**

*Life Skills Thuto 5* spent *English FAL Thuto 5*'s ledger and argued it was the same child's one vocabulary. *Mathematics Thuto 5* did it again and said a second time makes a rule. **This is the third**, and *Mathematics Thuto 5* named this very app as one of the two that should do it. **Build the language app first; every other subject of the grade spends its ledger; nobody re-cuts one.** Social Sciences Grade 5 is the last, and it does the same.

**5. The prerequisite ladder is dead again, and that is information.**

*Mathematics Thuto 5* wrote `ladder.ts` from scratch because arithmetic is strictly cumulative. **Natural Sciences is not**: its four strands are independent, and food chains are not a prerequisite for circuits. So the ladder goes quiet again, its check passing on an empty list. **That a subject needs no ladder is a fact about the subject worth recording**, not an omission to apologise for.

**6. A sideways fork re-levels zero, the same as a vertical one, reached the other way.**

*Mathematics Thuto 5*'s re-levelling count was zero because its one re-levellable file (`care.ts`) did not exist in that subject. **This build's re-levelling count is also zero, for a different reason: it is a new subject in the grade, so there is no prior-grade file at the same level to re-level against at all.** Two zeroes, two reasons, one rule holding: **a fork re-levels only what genuinely changes with the grade, and often that is nothing** (§15.3).

### 18.2 What this ATP gives you, and where each piece lands

| In the ATP | Lands in | Notes |
| --- | --- | --- |
| **The four strand pages** | **The four terms** | §5.2. One strand, one term |
| **The `CAPS Topics` column** | **The topic** | §5.3. One CAPS topic, one app topic |
| **The `Duration` column (weeks)** | **`Topic.atpWeeks`, and the lesson count** | §5.3. The weighting of the year, and the thing an app most easily flattens |
| **The `Core Concepts, Skills and Values` column** | **The investigation account and the lessons** | §6.5a. The knowledge |
| **The `Informal Assessment` column** | **The activities** — *sequence a food chain*, *label the skeleton*, *investigate rust*, *classify animals* | The ATP writes the activities for you; read them off it |
| **The `Resources to Enhance Learning` column** | **`docs/do-it-yourself.md`'s allowed-materials list** | §7.4. Straws, tape, a torch cell, magnets, soil, play-dough |
| **The `Major Process and Design Skills` page** | **`Topic.skills`, and the daily rhythms** | §8.2b, §18.3. Not a ladder |
| **Every property, process, cause and place-claim** | **A `factRef` into `docs/facts.md`** | §8.5. The busiest file |
| **`Safety with fire` · `Safety with electricity`** | **`care.ts`, and `withAdult` on the calls** | §8.2b, §7.4 |
| **`design, draw, make and evaluate`** | **The topic's `makeTask`, a `doItYourself`** | §5.2, §6.5b. The Technology half |
| **`SBA (FORMAL ASSESSMENT)` / `Test`** | **Nothing** | Marks (§1.1) |
| **Nothing daily** | **The three rhythms come from the process-skills page, and the PRD says so** | §18.1, §18.3 |

**The three daily rhythms**, and **all three come from the `Major Process and Design Skills` page, not from a printed daily row:**

| Rhythm | Variants | What it is |
| --- | ---: | --- |
| 🔍 **Look Closely** | 10 | Observe one real thing — a leaf, a nail, the sky, an ant — and tap what you notice. Process skills 2 and 3, *observing* and *comparing* |
| 🤔 **I Wonder** | 10 | A question about the world, and a guess before you find out. Process skills 7 and 8, *raising questions* and *predicting*. **No right answer is scored** |
| 🔤 **Science Words** | 12 | One science word onto the word wall, built with `spell-word`, heard in a sentence, seen in a picture |

Variants cycle by date; the same day always shows the same one.

### 18.3 ATP verb → interaction type

| The ATP says | Use |
| --- | --- |
| **identify / describe the main features** | `SourceFigure` + `select`, or **`label-diagram`** |
| **label a diagram** | **`label-diagram`** |
| **draw circuit diagrams with correct symbols and labels** | **`label-diagram`** (place the symbols so the path closes) |
| **sequence… to make a food chain** | `sequence` |
| **classify / sort** animals or materials | `sort-baskets` |
| **compare** two things | `match-connect`, or `sort-baskets` with two baskets |
| **describe the stages of a life cycle** | `sequence` on a ring |
| **investigate** (rust, soil, metals, candle) | `SourceFigure` + a described account, then **`doItYourself`** with real materials |
| **design, draw, make and evaluate** | **`doItYourself`** — the make-task |
| **explain how / why** | `read-text` account + `listen-choose` |
| **safety with fire / electricity** | `read-text` + `select`; **never a solo `doItYourself`** |
| **research and write** | `read-text` (`information`) + `select` |
| **SBA / test / project** | **Nothing** |

If nothing fits, pick the nearest and simplify. **Do not simulate an experiment, do not put a flame in a solo call, and do not state a fact without a `factRef`.**

### 18.4 Naming conventions

| Thing | Pattern | Example |
| --- | --- | --- |
| Topic id | `t{term}-{kebab}` | `t1-animal-skeletons` |
| Star Challenge | `t{term}-star-challenge` | `t2-star-challenge` |
| Lesson id | short kebab, unique in topic | `label-the-skeleton` |
| Activity id | `a1`–`a4` (`a5` in a challenge) | `a4` |
| Account line id | `l1`, `l2`, … in reading order | `l3` |
| Diagram part id | `{part}`, lower kebab | `skull`, `topsoil`, `cell` |
| Figure id | `fig-{kebab}` | `fig-human-skeleton` |
| Fact ref | `{kind}-{kebab}` | `only-iron-rusts`, `earth-orbits-in-365-days` |
| Care ref | `{hazard}-{kebab}` | `fire-never-alone`, `mains-never-socket` |
| Gloss key | the word exactly as it appears, lower-cased | `photosynthesis` |
| Topic badge | a child-facing noun phrase | `Skeleton Reader`, `Circuit Maker`, `Fossil Finder` |

### 18.5 Budgeting the year

| | Guide |
| --- | --- |
| Topics | one per CAPS topic, plus 4 Star Challenges — **~20** |
| Lessons per topic | **`round(weeks × 4/3)`, clamped 2–5** — recorded, not recomputed |
| Activities per lesson | **4. Five only in a Star Challenge** |
| Lesson composition | **Lesson 1 opens with the investigation account**; the last lesson is a `doItYourself` (a make-task or an investigation); nothing new in the last lesson |
| Investigation accounts | **one per topic** |
| Hands-on calls | **one per topic minimum**, every kit on the allowed list; fire and mains `withAdult` and watched |
| Figures | **~36** (§7.5) |
| Facts | **most activities carry a `factRef`**; every one has a line in `docs/facts.md` |
| Hard limits | **the safety list, the facts register, the lesson count, the ramp, the gloss budget and the clock check.** The validator will not let you past any of them |

### 18.6 Work order

Each step ends with a green `npm run check`.

1. **The extraction** (§18.8 #1). **Half a day, before the fork.**
2. **Fork *Life Skills Thuto 5* and rename** (§16.2). `npm install`, `npm run check`, `npm start`. **Confirm it runs first**, and **diff the tree to correct §15.3**. Run the TTS smoke test over the science terms while you are here (§9.1).
3. **The spine** (§16.3) — the lesson-count rule first, then the strand, the empty ladder, the facts register, the care register, the `doItYourself` contract, the ledger and the ramp. **A day.**
4. **Confirm the topic sheet** (§8.1) and the safety register (§8.2b) — **the human checkpoint, before content.**
5. **The five checks** (§11), `docs/facts.md`, `docs/care-guide.md`, `docs/do-it-yourself.md`. **Before authoring, not after.**
6. **`label-diagram`** (§7.2), the human skeleton first.
7. **`SourceFigure` and four figures**, the circuit first (§16.4 step 3).
8. **Cut to one topic, green check.** The fork becomes the app.
9. **Author term by term**, `npm run check` after every topic.
10. **The rhythms**, then **the four Star Challenges**, then all eight acceptance tests (§17) — **including the three that are new and the two that are not yours to run.** Then build (§16.6).

**Definition of done for the year:**

- every CAPS topic appears in its own ATP-relative weeks, with lessons sized by its duration;
- the calendar spans 52 weeks, repeats the same lessons in every year, and shows those lessons when the child browses previous or future years;
- a new yearly cycle starts the lesson completion state afresh while preserving the child profile, settings and word wall;
- `npm run check` passes with **zero warnings**;
- **the safety check reads zero solo danger calls, and every fire/mains call is `withAdult` and watched**;
- **every real-world claim has a `factRef` and a line in `docs/facts.md`, read by a science teacher** (§17 test 5);
- **no simulated experiment is presented as a result** (§17 test 6);
- **the clock line reads zero**;
- every gloss carries a picture; every text is inside its term's ramp;
- **every word of content on screen speaks on tap, including every science term**;
- **every figure has a spoken description that answers its question without the picture**;
- **no field anywhere in the data model records elapsed time, a streak or a score**;
- **not one ergonomic constant and not one praise line was changed** (§15.3).

### 18.7 The kickoff brief

Paste this together with the ATP:

```
Build Natural Sciences and Technology Thuto 5 — the Grade 5 NS&Tech app in the
Thuto family. It is a NEW SUBJECT in this grade, not a vertical fork.

Inputs:
  - Natural_Sciences_and_Technology_Thuto_5_PRD.md (this document) — the full
    spec. Every design and engineering decision is already made in it. Follow
    it; do not redesign.
  - 2026_ATP_NS & Tech_Grade 5.pdf — the curriculum, already in this folder.
    A STRAND ATP: four knowledge strands, one per term, and a page of 17
    process-and-design skills. It prints DURATIONS IN WEEKS, not hours. 8.1 is a
    proposed year read off it; confirm or correct, do not re-derive.
  - Life Skills Thuto 5 repo — the ENGINE to fork. CHECK IT EXISTS FIRST. The
    last three builds were told to fork a repo that was not on disk. It is the
    closest engine: care.ts (safety register), doItYourself (kit + safety),
    factRef, SourceFigure and the FAL ledger are all live in it. Fallback:
    Mathematics Thuto 5 (newer, but carries six unused numeric components).
    Take the NS&Tech identity out of Natural Sciences and Technology Thuto
    4.apk — colour #7E57C2, package za.co.thuto.nstech4 (PRD 14, 16.6).
  - English FAL Thuto 5 repo — copy CORE_WORDS and the taught ledger, ONE TERM
    BEHIND (PRD 8.3). Third app to spend it; do not re-cut a ledger.
  - Mathematics Thuto 5 repo — take the wrong-answer `why` shape, the clock
    check, and the newest validator; take make-icons.mjs (PRD 15.4, 16.6).

BEFORE THE FORK: extract SourceFigure.tsx and src/figures/ into a shared
package. It is in FIVE lineages now. Half a day (PRD 18.8 #1).

There is NO deletion step and NO re-levelling step. Inherited types this
subject does not use (move-along, beat-along, and if forked from Maths the six
numeric components) ship UNUSED and are not deleted (PRD 15.2).

Work in the order given in 18.6, running `npm run check` after every topic.
STOP after 18.6 step 4 and show me the topic sheet (8.1) and the safety
register (8.2b).

Five rules outrank everything:
  - TEACH, SHOW, CALL — NEVER PERFORM OR FAKE (1.1 rule 1). Where the method is
    hands-on, the app explains it, draws it, and hands the doing to the child
    through doItYourself. It never simulates a burning candle, a lighting bulb
    or a rusting nail and calls the investigation done;
  - NEVER SEND A CHILD ALONE TOWARD DANGER (1.1 rule 2). Fire and mains
    electricity are taught as knowledge and safety, never a solo call. Any real
    practical with heat or flame is withAdult and WATCHED. care.ts is alive
    again, for a physical reason. This is the file that shipped DEAD in
    Mathematics Thuto 5;
  - EVERY REAL-WORLD CLAIM IS SOURCED (1.1 rule 3). factRef into docs/facts.md,
    checked at build time. This is the file Mathematics Thuto 5 carried nearly
    empty, and here it is the busiest in the repo;
  - NO ENGLISH WORD BEYOND THE FAL LEDGER, ONE TERM BEHIND (1.1 rule 4). One
    exemption list: scientific vocabulary, exempt from the budget, never from
    the gloss, every one with an explicit `say`;
  - NOTHING IS TIMED, SCORED OR A MARK (1.1 rule 5). No stopwatch, no streak.
    The ATP's practicals, tests and skeleton project do not reach the child.

And the inherited rules hold: content text is shown and every word of it speaks
on tap; chrome text carries no answer; nobody fails; the app builds nothing a
child types; there is no network.

A topic is a CAPS topic and its lessons are round(weeks × 4/3) clamped 2-5.
One new component, and it is the only one this subject earns: label-diagram
(tap the named part of a drawn diagram; a complete set completes the picture
and closes a circuit). 7.3 is the list of things that look like a second and
are not.

Record the three numbers in the README (15.3), MEASURED not estimated. Two of
them are zero, and both zeroes are findings.
```

### 18.8 Decisions to bring back to a human

Numbers 1–17 are **already answered in §14**. Five remain, and each carries a recommendation.

**1. The extraction — do it now, or copy the file a fifth time.**

| Option | Cost |
| --- | --- |
| **A — Extract `SourceFigure.tsx` and `src/figures/` before the fork** *(recommended)* | **Half a day, owed since the *Life Skills* build.** This app needs ~36 figures, and it is the fifth lineage |
| B — Copy it a fifth time and extract later | Five lineages of drift |

**Recommendation: A.** The count-based trigger has now fired four times and been ignored four times. **It works; act on it or retire it honestly.**

**2. Is the fork base actually there?**

| Option | Cost |
| --- | --- |
| **A — Look for *Life Skills Thuto 5* in the first fifteen minutes; fall back to *Mathematics Thuto 5* if it is missing** *(recommended)* | **Fifteen minutes** |
| B — Assume it is there and discover otherwise on day two | What the last three builds did |

**Recommendation: A**, and if it is missing, **say so in the README the way the last builds did.**

**3. The circuit — a model that lights, or a diagram that does not?**

The ATP says *"explore various ways of making a complete simple circuit"* and *"draw simple circuit diagrams with correct symbols and labels"*.

| Option | Cost |
| --- | --- |
| **A — `label-diagram` where completing the labels closes the path and the drawn bulb lights, as a model** *(recommended)* | Zero. It teaches the closed-path idea honestly — a diagram that responds, not an experiment that "worked". The real circuit is a `doItYourself` with a cell, a wire and a bulb |
| B — A full circuit simulator with switches and a battery meter | Scope creep, and it edges toward the good fake §1.1 rule 1 forbids |
| C — A static diagram the child only labels | Loses the one thing the phone does better than paper — showing the path complete |

**Recommendation: A**, and **write into `docs/authoring-guide.md` that the lit bulb is a model of a closed path, never a claim that an experiment ran.**

**4. The Technology make-tasks — how many, and which?**

The ATP embeds a design-and-make task in each strand: the skeleton (LIF), processing a material (MAT), the circuit (ENE), an Earth model or a fossil (EAR).

| Option | Cost |
| --- | --- |
| **A — One make-task per strand, four in the year, each the topic's last-lesson `doItYourself`** *(recommended)* | Zero, and it is what the ATP asks. Every one uses allowed materials; the material-cooking one (dough) is `withAdult` |
| B — A make-task in every topic | Too many; some topics are pure knowledge and a forced make-task is busywork |
| C — No make-tasks; describe them only | Drops the Technology half of the subject, which is half its name |

**Recommendation: A**, and record the four in `docs/topic-sheet.md`.

**5. The candle-under-jars and the fuel-burning investigations — watched, or dropped?**

The ATP's own investigations for the Energy strand involve **a lit candle** and **burning three fuels**.

| Option | Cost |
| --- | --- |
| **A — Keep them as `withAdult` *watched* activities: the child watches a grown-up, and records and describes what she sees** *(recommended)* | Zero, and it is honest to the ATP. The child does the observing and the recording — real process skills — while an adult does the dangerous part |
| B — Drop them and teach the concept only | Loses the ATP's best Energy investigations, and a child with a present adult is denied a real one |
| C — Let the child do them alone | **Forbidden. §1.1 rule 2.** A ten-year-old alone with a candle is the exact thing this app refuses |

**Recommendation: A**, and **the parent note names them a week ahead** so an adult can plan to be there.

### 18.9 One topic, worked end to end

**Grade 5 NS&Tech, Term 3, Energy and Change. *Energy And Electricity*. Three weeks, four lessons — and it is the topic where every one of this subject's rules shows at once: a real fact, a safe hands-on call, a dangerous one refused, a diagram that models rather than simulates.**

**Step 1 — the ATP cell, condensed:**

> **Core concepts:** energy is stored in cells and batteries · a circuit transfers electrical energy · electricity from the power station reaches our homes in a circuit · a power station needs a fuel (coal) · **Safety with electricity: precautions should be taken.**
> **Informal assessment:** investigate the source of electricity in a torch · explore ways of making a complete simple circuit · draw circuit diagrams with correct symbols and labels · trace the electricity from the power station to home · explain safety tips for using electricity.
> **Resources:** cells (batteries), lengths of wire, light bulbs.

**Step 2 — the topic-sheet row** (the reviewable artefact, before any code):

| Term | Weeks | Topic | Strand | Lessons | Make-task | Care |
| ---: | ---: | --- | :---: | ---: | --- | :---: |
| 3 | 3 | Energy And Electricity | ENE | 4 | make a torch-cell circuit | ⚠️ mains |

**Step 3 — the four lessons:**

| # | Lesson | Opens with | Built with |
| ---: | --- | --- | --- |
| 1 | **Where the energy hides** | the investigation account: taking a torch apart | `SourceFigure` (a cell) + `select` · `factRef: cell-stores-energy` |
| 2 | **The path all the way round** | the account of a bulb lighting | **`label-diagram`** — place cell, wire, bulb so the path closes and the drawn bulb lights (a model) · `factRef: circuit-complete-path` |
| 3 | **From the power station to the plug** | a new account | `SourceFigure` (the electricity journey) + `sequence` · `factRef: mains-from-power-station` · **the safety lesson: never the wall socket** (`care`, read-and-`select`, no hands-on) |
| 4 | **Make it light** | — | **`doItYourself`**: a torch cell, a wire, a small bulb — safe, allowed materials — with the science spoken and the safety line *"a torch cell is safe to hold; never use the plugs in the wall"* |

**Step 4 — the code, lesson 4:**

```ts
{
  id: 'make-it-light',
  title: 'Make it light',
  activities: [
    readText('a1', 'Listen. I will read it to you.', {
      textType: 'investigation',
      title: 'A circuit is a full path',
      emoji: '🔌',
      lines: [
        ['l1', 'A cell holds energy.'],
        ['l2', 'A wire carries the energy.'],
        ['l3', 'The energy can only flow if the path is joined all the way round.'],
        ['l4', 'When the path is full, the bulb lights.'],
      ],
      factRef: 'circuit-complete-path',
    }),

    withFigure('fig-simple-circuit',
      labelDiagram('a2', 'Put the parts in the circuit.', {
        figure: 'fig-simple-circuit',
        parts: [
          ['cell', 'the cell', 'the cell'],
          ['wire', 'the wire', 'the wire'],
          ['bulb', 'the bulb', 'the bulb'],
        ],
        completes: true,          // the drawn bulb lights — a MODEL, not an experiment
      })),

    // The wrong answers are the lesson. Borrowed from Mathematics Thuto 5.
    listenChoose('a3', 'Listen, then tap the answer.', [
      ['q1', 'The bulb will not light. What is wrong?', [
        ['a', '🔌', 'the path is not joined all the way round'],
        ['b', '🔌', 'the cell is too small',
          'A small cell still lights a bulb. If the path is broken anywhere, no energy can flow.'],
      ], 'a', 'l3'],
    ]),

    // The real thing, in her hands, with only safe materials. §7.4.
    doItYourself('a4', 'Now make a circuit that lights a bulb.', {
      need: ['a torch cell', 'a piece of wire', 'a small bulb'],
      safety: 'A torch cell is safe to hold. Never use the plugs in the wall.',
      steps: [
        ['s1', 'Touch one end of the wire to the bottom of the cell.'],
        ['s2', 'Hold the bulb to the top of the cell.'],
        ['s3', 'Touch the other end of the wire to the side of the bulb.'],
        ['s4', 'When the path is joined all the way round, the bulb lights.'],
      ],
      factRef: 'circuit-complete-path',
    }),
  ],
}
```

**What the conversion did:** it taught the closed-path idea with a `label-diagram` that **models** a lit bulb rather than claiming an experiment; it sourced every claim (`circuit-complete-path`, `cell-stores-energy`, `mains-from-power-station`); it put the **real** circuit in the child's hands with a torch cell — safe, allowed materials; and it taught mains electricity as **knowledge and a safety line only, never a hands-on call.**

**What it did not do:** it did not simulate an experiment and call it done; it did not let the child near a socket; it did not state a fact without a `factRef`; and it did not time anything.

---

## Appendix A — what to read off the printed page before authoring

Text extraction from this PDF is fair, but **the `Duration` column is the messy one** — the weeks (2½, 1, 2, 1½) sit in a narrow left column and do not always align cleanly with the topic they belong to. **Check these four on the printed page:**

1. **Term 1's durations.** Extraction gives `2½ · 1 · 2 · 1½ · 2 · 1` against six rows (five topics plus remediation). **Confirm which topic each week-count belongs to** — §8.1's lesson counts follow from it. The likeliest reading is Living Things 2½, Animal Skeletons 1, Skeletons as Structures 2, Food Chains 1½, Life Cycles 2.
2. **Where the strand boundaries fall.** Each strand is a page with its own header; confirm no topic straddles two. The app calendar gives each strand a 13-week window, while topic placement and lesson counts still follow the ATP durations (§5.5).
3. **Which investigations involve fire or mains.** Confirm on the page that the candle-under-jars and the fuel-burning investigations are Energy-strand (Term 3), and mark them `withAdult` (§18.8 #5). **If any other strand hides a flame or a socket, it moves to the care register too.**
4. **The Technology make-tasks.** Confirm the four — skeleton (LIF), processed material (MAT), circuit (ENE), Earth model or fossil (EAR) — and which materials each needs, against the `Resources` column, so `docs/do-it-yourself.md`'s allowed list is complete.

## Appendix B — what this app deliberately does not teach or do

- **No experiment on the phone, ever.** The app teaches, shows and calls; the doing is the child's. §1.1 rule 1.
- **No solo fire, flame, heat or mains electricity.** Taught as knowledge and safety; the practical is `withAdult` and watched. §1.1 rule 2.
- **No unsourced claim about the real world.** Every fact has a `factRef`. §1.1 rule 3, §8.5.
- **No photosynthesis detail beyond the ATP's own line.** The ATP says *"no further detail is required in this grade"* — the app teaches that green plants make their own food from air, water and sunlight, and stops. Over-teaching a Grade 5 is as wrong as under-teaching.
- **No muscle-and-joint detail.** The ATP says *"details about how muscles are attached, and the structure of joints, are not required"*. The app names them and stops.
- **No second new component.** The subject earns exactly one, `label-diagram`. §7.2, §7.3.
- **No speed, no ranking, no comparison, no mark.** §1.1 rule 5.

---

*This PRD is a standalone, build-ready specification for Natural Sciences and Technology Thuto 5, written with the ATP already in hand — which is why §8 carries a proposed year rather than empty slots. **§1.1 rules 1 and 2 are the part that did not exist in this shape before**: seventeen apps have taught knowledge, and this is the first where the method is a hands-on practical the phone cannot host, and where some of that practical is dangerous. The answer is a phone that is honest by refusing — it teaches, it shows, it calls the doing into the child's hands, and for fire and mains electricity it refuses to send her at all. **The second thing this document proves is §18.1's law**: `ladder.ts`, `care.ts` and `facts.md` are each dead in some subjects and load-bearing in others, and which is which is a property of the subject. Mathematics carried the last two nearly dead; **this subject is what they were waiting for.***

---

## Appendix C — the exact tech stack, repo layout and build environment (handoff)

**This appendix exists so a fresh agent reproduces the app that shipped, not a plausible cousin of it.** Every version, path and command below is read out of the working *Mathematics Thuto 5* repo and the machine it was built on — the app whose APK is already on this disk. **Match these exactly.** Where a value here disagrees with a rounded number in the prose above, this appendix wins.

### C.1 Exact dependencies — copy `package.json` from the fork base, do not retype it

`package.json` (the shipped *Mathematics Thuto 5* set; change only `name`):

```json
{
  "name": "natural-sciences-and-technology-thuto-5",
  "version": "0.1.0",
  "main": "expo-router/entry",
  "dependencies": {
    "@expo/metro-runtime": "~57.0.15",
    "@react-native-async-storage/async-storage": "2.2.0",
    "expo": "^57.0.21",
    "expo-constants": "~57.0.17",
    "expo-haptics": "~57.0.2",
    "expo-linking": "~57.0.9",
    "expo-router": "~57.0.20",
    "expo-speech": "~57.0.2",
    "expo-splash-screen": "~57.0.8",
    "expo-status-bar": "~57.0.1",
    "expo-system-ui": "~57.0.3",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-native": "0.86.3",
    "react-native-safe-area-context": "~5.7.0",
    "react-native-screens": "~4.26.0",
    "react-native-svg": "15.15.4",
    "react-native-web": "^0.21.2"
  },
  "devDependencies": {
    "@types/node": "^22.20.1",
    "@types/react": "~19.2.4",
    "tsx": "^4.23.12",
    "typescript": "~6.0.3"
  },
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit",
    "check:content": "tsx scripts/check-content.ts",
    "check": "npm run typecheck && npm run check:content",
    "print:topics": "tsx scripts/print-topics.ts"
  },
  "private": true
}
```

> **This app adds no dependency** (§9). `label-diagram` uses `react-native-svg`, already present. **The correct way to get these versions is to copy the fork base's `package.json` and `package-lock.json` and run `npm install` — never to hand-write versions**, because Expo pins a mutually-compatible set and a single wrong caret breaks the native build.

**Toolchain the shipped app was built with** (host machine):

| Tool | Version | Note |
| --- | --- | --- |
| Node | **22.21.0** | Node 20 LTS or 22 is fine; `tsx` needs ≥ 18 |
| npm | **10.9.4** | ships with Node 22 |
| Expo SDK | **57** | `expo ^57.0.21` |
| React Native | **0.86.3** | pinned by Expo 57 |
| React | **19.2.3** | |
| TypeScript | **~6.0.3** | strict |

### C.2 `tsconfig.json` — verbatim

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "types": ["node"],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

The `@/*` → `src/*` alias resolves at runtime because `app.json` sets `experiments.tsconfigPaths: true`. **Both must be present** or imports like `@/theme/tokens` fail — the app screens and every component use the alias.

### C.3 `app.json` — the parts that matter

```jsonc
{
  "expo": {
    "name": "Natural Sciences and Technology Thuto 5",
    "slug": "natural-sciences-and-technology-thuto-5",
    "scheme": "nstthuto5",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#7E57C2"
    },
    "ios": { "supportsTablet": true, "bundleIdentifier": "za.co.thuto.nstech5" },
    "android": {
      "package": "za.co.thuto.nstech5",
      "adaptiveIcon": {
        "backgroundColor": "#7E57C2",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "blockedPermissions": [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CALL_PHONE",
        "android.permission.READ_CONTACTS",
        "android.permission.READ_SMS",
        "android.permission.RECEIVE_SMS",
        "android.permission.SEND_SMS",
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": { "favicon": "./assets/favicon.png", "bundler": "metro" },
    "plugins": [
      "expo-router",
      "expo-status-bar",
      ["expo-splash-screen", { "image": "./assets/splash-icon.png", "resizeMode": "contain", "backgroundColor": "#7E57C2" }]
    ],
    "experiments": { "typedRoutes": false, "tsconfigPaths": true }
  }
}
```

> **`blockedPermissions` is a hard requirement, not a nicety.** `expo-haptics` pulls in `VIBRATE` (allowed); everything else is blocked so the built APK requests **no network**. Verify on the built APK with `aapt2 dump permissions`, not the source manifest (§16.6, §17 test 8). The shipped Mathematics APK's only permissions are `VIBRATE` and an internal dynamic-receiver permission — this app must match.

### C.4 The repo layout — every directory, and what lives in it

**The build must not change `app/`, `src/components/ui/`, `src/audio/`, `src/domain/`, `src/data/`, `src/context/`, `src/utils/` or `src/theme/` (§15.5). It changes `src/content/`, `src/types/`, `src/figures/`, `src/components/activities/` and `scripts/`.**

```
app/                         expo-router file-based routes (DO NOT CHANGE)
  _layout.tsx                root stack
  index.tsx                  the calendar home
  +not-found.tsx
  trophies.tsx               the reward wall
  daily/[id].tsx             a daily-rhythm player
  lesson/[id].tsx            THE lesson player — renders activities in order
  subject/[id].tsx           a subject's topic list
  topic/[id].tsx             a topic's lesson list + parent note

src/
  audio/
    speech.ts                the single speak() helper (expo-speech, en-ZA)
    feedback.ts              celebrateCorrect / nudgeRetry / celebrateFinish + care mode
    useNarration.ts          the "hear it again" hook
  components/
    activities/              ONE component per interaction type + the renderer
      ActivityRenderer.tsx   the switch: activity.type -> component (add label-diagram here)
      types.ts               ActivityViewProps contract
      ReadText.tsx SelectItems.tsx SortBaskets.tsx SequenceCards.tsx
      MatchConnect.tsx AssignSlot.tsx ExploreCards.tsx ListenChoose.tsx
      DrawCanvas.tsx MemoryMatch.tsx MoveAlong.tsx HabitTracker.tsx SpellWord.tsx
      SourceFigure.tsx       the drawn-figure host (borrowed; extract per 18.8 #1)
      BeatAlong.tsx          (inherited, unused here)
      useGridSize.ts
      (Mathematics-only, present if you fork Maths and unused here:
       PlaceValue NumberLine FractionBar FlowDiagram ClockFace ChanceTrial)
      -> ADD: LabelDiagram.tsx (7.2)
    ui/                      chrome (DO NOT CHANGE): BigButton, RoundButton,
                             PictureCard, LessonRow, TopicRow, SubjectTile,
                             DailyCard, ProgressDots, Celebration
  content/
    authoring.ts             the tuple builders (sortBaskets, listenChoose,
                             readText, doItYourself, ...) + buildTopic/collect
                             -> ADD: labelDiagram() builder
    subjects.ts              the one Subject entry
    calendar.ts              TERM_PLANS, term windows, week offsets
    ladder.ts                the word ledger + prerequisite ladder
                             (ship the ladder EMPTY here — 8.2a)
    ramp.ts                  the support ramp + word-count helpers
    care.ts                  the safety register (ALIVE here — 8.2b)
    facts.ts / facts refs    the facts register plumbing (ALIVE here — 8.5)
    dailyRhythms.ts          the three rhythms + variant scheduling
    term1.ts term2.ts term3.ts term4.ts   THE YEAR (write these)
    index.ts                 exports TOPICS, ALL_LESSONS, SUBJECTS, DAILY_RHYTHMS
  context/AppProvider.tsx    app state over the repositories (DO NOT CHANGE)
  data/                      repository interfaces + local impls + one swap point
    index.ts ContentRepository.ts LocalContentRepository.ts
    ProgressRepository.ts LocalProgressRepository.ts   (KEY prefix -> nstthuto5:)
  domain/                    schedule.ts schoolYear.ts curriculum.ts rewards.ts
  figures/
    index.tsx                the FIGURES registry + Figure() renderer (SVG)
    descriptions.ts          FIGURE_DESCRIPTIONS — the spoken text for each figure
  i18n/index.ts              LocalisedText helpers, ui strings, praise bank (DO NOT touch praise bank)
  theme/tokens.ts            colours, size (touchMin 56), type scale, digitStyle
  theme/motion.ts            the only file allowed timing calls (11 check 5 allowlist)
  types/
    content.ts               the data model (Topic, Lesson, Activity union, ...)
    progress.ts              ChildProfile (grade: 5), DailyRecord
    index.ts                 re-exports
  utils/                     dates.ts shuffle.ts

scripts/
  check-content.ts           THE VALIDATOR (npm run check) — the five checks + banner
  print-topics.ts            generates docs/topic-sheet.md (npm run print:topics)
  make-icons.mjs             decodes assets/source/icon-master.png -> the six icon PNGs

docs/
  authoring-guide.md  topic-sheet.md  support-ramp.md
  facts.md            (build gate — 8.5, 11 check 3)
  care-guide.md       (build gate — 8.2b, 11 check 1)
  do-it-yourself.md   (build gate — allowed/forbidden materials, 7.4)
  ladder.md           (present; empty-ladder note — 8.2a)

assets/
  icon.png splash-icon.png favicon.png
  android-icon-foreground.png android-icon-background.png android-icon-monochrome.png
  source/icon-master.png     (the 1024x1024 master make-icons.mjs derives from)
```

### C.5 How the pieces connect (the mental model a new agent needs)

1. **Content is data, not code.** `src/content/term*.ts` call tuple-builders in `authoring.ts` to produce plain `Topic`/`Lesson`/`Activity` objects (MongoDB-collection-shaped). `content/index.ts` flattens them into `TOPICS` and `ALL_LESSONS`.
2. **The lesson player is generic.** `app/lesson/[id].tsx` walks a lesson's `activities` and hands each to `ActivityRenderer`, which switches on `activity.type` to the matching component in `components/activities/`. **Adding an interaction type = one new component + one `case` in the renderer + one builder in `authoring.ts` + one entry in the `ActivityType` union in `types/content.ts`.** That is the whole of what `label-diagram` touches.
3. **Figures are separate from activities.** An activity may carry `figure: FigureId`; `ActivityRenderer` draws it above the activity via `SourceFigure`, which looks the id up in `figures/index.tsx` and its spoken text in `figures/descriptions.ts`. `label-diagram` is the one activity that owns its figure and makes its parts tappable.
4. **The validator is the spec, executable.** `scripts/check-content.ts` imports the real content and fails the build on every rule in 11. **Run `npm run check` after every topic.** It is the difference between "looks done" and "is done".
5. **The data layer is swappable.** Everything reads through `ContentRepository`/`ProgressRepository`; the local implementations are the only thing bound today, and a MongoDB implementation drops in at `data/index.ts` with no UI change.

### C.6 Commands — the whole lifecycle

```bash
# --- develop ---
npm install                 # after copying package.json + package-lock.json from the base
npm run check               # tsc --noEmit  +  tsx scripts/check-content.ts  (THE GATE)
npm run print:topics        # regenerate docs/topic-sheet.md from the data
npm start                   # Expo dev server; scan the QR with Expo Go
node scripts/make-icons.mjs # regenerate the six icons from assets/source/icon-master.png

# --- release APK (arm64-v8a, ~42 MB) ---
npx expo prebuild --platform android --no-install
# write android/local.properties FIRST, with FORWARD SLASHES (see C.7):
#   sdk.dir=C:/Users/<you>/AppData/Local/Android/Sdk
cd android && JAVA_HOME="/c/Program Files/Android/Android Studio/jbr" \
  ./gradlew assembleRelease --no-daemon -PreactNativeArchitectures=arm64-v8a
# APK: android/app/build/outputs/apk/release/app-release.apk
aapt2 dump permissions app/build/outputs/apk/release/app-release.apk   # expect VIBRATE only
```

### C.7 Build gotchas that cost the *Mathematics Thuto 5* build real time — do not rediscover them

1. **`android/local.properties` must use forward slashes.** `sdk.dir=C:/Users/.../Android/Sdk`. A backslash path (`C:\Users\...`) is parsed as invalid Java-properties escapes, and Gradle fails with a **misleading** `Invalid file path` pointing at `com.facebook.react.rootproject` — which sends you chasing the wrong thing (the project's spaces). **It is the SDK path. Two build runs were lost to this.**
2. **`java` is not on PATH; use Android Studio's bundled JBR 21.** `JAVA_HOME="/c/Program Files/Android/Android Studio/jbr"` on the gradle invocation. Verify `"$JAVA_HOME/bin/java.exe"` exists first.
3. **Build one architecture.** The default builds four ABIs → a **~104 MB** APK. `-PreactNativeArchitectures=arm64-v8a` → **~42 MB**, which meets the < 45 MB ceiling (12). This excludes 32-bit phones — a real decision, not a build detail.
4. **Spaces in the project path are *not* the blocker.** The path `.../DBE apps/Grade 5/...` has spaces; a directory junction to a space-free path was tried and was unnecessary — the failures above were the SDK path and the ABIs, never the spaces. Do not waste time on a junction.
5. **The release APK is debug-signed** (Expo's default debug keystore). Fine for sideloading; **generate an upload key before Google Play.**
6. **`aapt2` lives in the SDK build-tools** (e.g. `.../Android/Sdk/build-tools/37.0.0/aapt2.exe`); pick the highest installed. Use it to prove the permission set on the *built* APK, per 17 test 8.
7. **A pasted image is not on disk.** If the icon master arrives as a chat paste, it must be saved to `assets/source/icon-master.png` before `make-icons.mjs` can use it. The script decodes that PNG, floods the background out for the adaptive foreground (so a coloured glyph touching the edge stays opaque), and writes all six files.

### C.8 The definition of "as correct as the Mathematics app"

A handoff is complete when, for *Natural Sciences and Technology Thuto 5*:

- `npm run check` ends with **`All content checks passed.`** and its banner matches the shape in 17 (right topic/lesson/activity counts, ladder empty, safety 0 solo-danger calls, facts all sourced, no-simulation 0, clock 0, 36 figures all described);
- the app **bundles** (`npx expo export --platform web` completes with no import error — the fast smoke test);
- the release APK builds at **~42 MB** and `aapt2 dump permissions` shows **VIBRATE only**;
- the four acceptance tests that need a person (17 tests 4, 5, and the two-icon test 8) are scheduled, and the safety test is signed by an adult who has cooked on a paraffin stove (8.2b);
- the README carries the three numbers **measured**, and names any ATP contradiction it resolved (16.6).
