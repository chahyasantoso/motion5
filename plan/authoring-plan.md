# Authoring plan

**Status:** Approved by the owner, 2026-11-11.
**Base:** `main` at `07336c35`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` section 1 and stage 1, then this plan.

## 1. Goal

**An agent given a brief makes a piece from named moves it chose or wrote, not from the nearest example, and a move it
wrote is kept where the next agent finds it.**

Today the base pushes the other way. The guide says to read the closest example and copy its patterns, its one scene
sample is the timing example, it ends with a list of starting values, the scaffold opens every piece with
`drop({ distance: 500, squash: 0.18 })`, and five declared moves are all there is to choose from. A move an agent
writes has no home, so it stays in its scene file and is never seen again.

## 2. The shape

```text
 brief ──▶ motion idea (three lines) ──▶ motion:moves (catalog) ──▶ compose with modifiers ──▶ scene
                                              │                                              ▲
                                        nothing fits                                         │
                                              ▼                                              │
                              src/moves/<id>.ts via defineMove ──▶ motion:moves --check ─────┘
```

- **A move says what it is for.** Its declaration carries a `role`, and the role is what the gate checks.
- **A modifier is a move whose input is another move's answer.** `defineMove` already takes an input, so there is no
  second kind of thing to declare.
- **The declaration is the one owner of what a move is.** The catalog, the reference, the gate and the live page's
  drag ranges all read it.

## 3. Decisions to record (A0, ADR-172)

- **`role` joins the declaration,** a closed union read by an exhaustive `switch`:

  | Role | Holds at | For |
  | --- | --- | --- |
  | `enter` | rest at progress 1 | arriving on stage |
  | `exit` | rest at progress 0 | leaving it |
  | `emphasis` | rest at 0 and at 1 | drawing the eye to what is already there |
  | `travel` | rest at 1 | going from one place to another |
  | `reveal` | fully shown at 1 | a wipe, a drawn stroke |
  | `follow` | no rest of its own | hanging off another target |
  | `modifier` | whatever its input holds | reshaping another move |

- **Exits are entrances reversed.** One modifier, `reversed`, plays any move from its end to its start, so the
  library carries no separate set of exits.
- **Authored moves live in `src/moves/<id>.ts`** of the app that uses them, one move per file, exported under its
  id. A move that proves general moves into `@gerak/moves` by an ordinary pull request.
- **`motion:moves` is the catalog,** over the built-in moves and the app's `src/moves`. It prints from declarations
  and from nothing else. `--check` is the gate.
- **The reference stops describing moves one by one.** It names `defineMove`, the roles and the catalog command; a
  test holds that every built-in move appears in the catalog, as today's test holds every export in the reference.
- **The guide carries no worked scene and no starting values.** Snippets show one function each on a neutral
  target. The worked examples stay in the tree as tests and are not named in the agent's path.
- **The scaffold writes a scene with one target at rest and no move.**

## 4. Slices

Each slice: invariant, owner, failing test, reference and guide entries in the same slice.

### A1. Roles and the gate

- **Invariant:** every declared move has a role, and `checkMove(move)` answers a list of findings: the role's rest
  rule broken at the default, least and greatest options; a value that is not finite; a jump between two 16 ms
  samples over a threshold at a stated length; a moment outside 0 to 1; an option with no description; an id that is
  not lower kebab-case.
- **Owner:** `packages/moves/src/declare.ts` (role), `packages/tools/src/scene/` (the check).
- **Test:** a move declared `enter` that ends 4 px off rest gets one finding naming the field and the amount; the
  five existing moves get none.

### A2. Modifiers

- **Invariant:** `reversed`, `anticipate`, `overshoot` and `repeated` take a move's answer as input and are declared
  with `defineMove`, role `modifier`. `reversed(enter)` holds rest at 0; `anticipate` moves the other way first by a
  stated share and amount and ends where its input ends; `overshoot` passes the end and settles on it; `repeated`
  plays its input `count` times inside one progress.
- **Owner:** `packages/moves/src/`.
- **Test:** each named property above, sampled; each passes `checkMove` wrapped round `drop`.

### A3. The library

- **Invariant:** a first set of moves by role, each a single file with its declaration, each passing `checkMove`:
  - enter: `rise`, `slide`, `pop`, `fade`, `unfold`, `swing`
  - emphasis: `pulse`, `shake`, `wobble`, `nod`
  - travel: `arc`
  - the five existing moves take their roles
- **Owner:** `packages/moves/src/`.
- **Test:** one test file walks every exported move through `checkMove`; a move added later is covered with no new
  test. Each move has one test of the property its description states.

### A4. The catalog

- **Invariant:** `npm run motion:moves` prints one line per move: id, role, description, options with their ranges,
  moments. `-- --role <role>` filters, `-- <id>` prints one in full, `-- --check` runs the gate and exits 1 on a
  finding, `-- --json` prints records. It reads `@gerak/moves` and `<root>/src/moves/*.ts`, and an id declared twice
  is a finding.
- **Owner:** `packages/tools/src/scene/`, `packages/tools/bin/motion-moves.mjs`.
- **Test:** a temp app with one good and one bad move in `src/moves`: the good one is listed after the built-ins,
  `--check` names the bad one and exits 1.

### A5. Scaffold

- **Invariant:** `motion:new <name>` writes a scene whose one target rests and imports no move.
  `motion:new --move <id>` writes `src/moves/<id>.ts` with a declaration that fails `--check` until its `run` and
  description are written.
- **Owner:** `packages/tools/src/scene/new.ts` and its templates.
- **Test:** the scaffolded scene samples to a rest pose at every time; the scaffolded move is refused by the gate.

### A6. Guide, skill, reference

- **Guide:** `agent-motion.md` is rewritten round the loop in section 2: write the idea and the character in three
  lines, read the catalog, compose, write a move where nothing fits, review. The example table and the starting
  values go. In their place, a short table of what a quality asks of the numbers: heavier is less squash and a
  longer settle, lighter is more height and a faster start, and so on.
- **Skill:** `make-motion` follows the same loop and says to report each move it wrote.
- **Reference:** as decided in section 3.
- **Test:** `test/repo/agent-guide.test.ts` refuses a guide that names a worked example's scene file.

### A7. The live page reads the catalog

- **Invariant:** a dragged option of any catalogued move clamps to its declared range, including a move in
  `src/moves` that the scene imports.
- **Owner:** `packages/tools/src/vite/` serves the catalog; `apps/react-demo/src/live/code-panel.tsx` reads it.
- **Test:** the endpoint lists a move from a temp `src/moves`; the panel clamps on it.

### A8. Proof

- One brief run cold three times, and two other briefs once each: five pieces. The lead reads the five sheets and
  the five scene files and records, per piece, the moves used, which were written for it, and whether any two pieces
  share a move set or a look.
- The baseline is the two pieces in the archive, made before this plan.
- **Passes when** no two of the three same-brief pieces share a move set, the two other briefs share none with
  them, and at least one piece carries a move written for it that passes the gate.

### A9. Ask the agents

- Each of the five agents is interviewed at the end of its run, in the same session, so it answers from what it
  did and not from a summary. The questions are fixed:
  1. What did you read before your first frame, and which of it did you not need?
  2. What did you look for and not find, and where did you look?
  3. Where did you open package source, and what were you missing?
  4. What failed the first time, and what told you why?
  5. Which tool output was longer than you needed, and what part of it did you use?
  6. Which step did you repeat, and what would have made once enough?
  7. What one change to gerak would have saved you the most time or the most reading?
- The lead records each run's tokens and tool calls beside its answers, and writes one ranked list: each item names
  what to change, how many of the five asked for it, and what it would save.
- **Ends with** the top items as slices in this plan when they are small, or as an entry in `plan/roadmap.md` when
  they are not. An item nobody acts on is dropped, not kept as a list.

## 5. Risks

- **A bigger library is a bigger thing to copy.** Sixteen moves could look as alike as five. The modifiers and the
  option ranges are what multiply them, and A8 measures it.
- **Agents can still open the examples.** The guide stops pointing at them, but they are in the tree. If A8 shows
  copying, the examples move under their own folder and into `.ignore`; that is not done up front because it
  touches every test and page path.
- **The catalog and the scaffold still hand out numbers.** `motion:moves -- <id>` prints each move's example with
  its values, the move scaffold writes a default, and the on-demand guide pages keep numbers in their snippets. A8
  reads the five pieces for those values; if they recur, the catalog prints the call's shape without them.
- **The rest rule may be wrong for a real move.** A move that ends off rest on purpose, such as a carry, has no
  role today. If one turns up in A3, the roles gain a member in that slice, not an exemption.
- **`overshoot` leaves 0 to 1.** A move is not defined past its ends, so the modifier reshapes the answer, never the
  progress it hands its input.

## 6. Team and order

The lead keeps the decisions, the subtle slices and every review, and reads a builder's diff, not the files again.
Builders get a brief with the invariant, the owner, the files and the failing test named.

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Lead | A0, A1 | the declaration's shape and the gate decide everything after |
| 2 | Sonnet A | A2 | four small moves against a gate that already exists |
| 2 | Sonnet B | A4, A5 | tools work, independent of A2 |
| 3 | Sonnet A, again | A3 | the library, with the modifiers and the gate in hand |
| 3 | Sonnet B, again | A7 | builds on its own catalog |
| 4 | Lead | A6 | the guide is judgment |
| 5 | five cold Sonnet runs, then the lead | A8, A9 | independent eyes, then one reading and one ranked list |

`npm run check` runs once per wave, each slice is one commit, and a pull request opens only when a wave is finished.

### What a wave costs, and the rules that came of it

| Wave | Who | Tokens | Tool calls | Time | What the lead had to fix on combining |
| --- | --- | --- | --- | --- | --- |
| 2 | Sonnet A, A2 | 82 k | 18 | 2.3 min | a whole-file line-ending rewrite of the reference; a helper duplicated in two files |
| 2 | Sonnet B, A4 and A5 | 104 k | 42 | 5.0 min | tests that hard-coded how many built-in moves there are, which A2 changed |

| 3 | Sonnet A, A3 | 90 k | 26 | 3.2 min | nothing |
| 3 | Sonnet B, A7 | 83 k | 22 | 2.1 min | nothing |
| 3 | Sonnet, cold review of waves 1 to 3 | 92 k | 8 | 1.5 min | twelve findings; seven fixed, the rest minor or by design |
| 4 | Lead, A6, in a new session | not shown | not shown | one sitting | nothing to combine |
| 4 | Sonnet, cold review of wave 4 | 88 k | 17 | 1.9 min | twelve findings; five fixed, four left for the proof to measure, three no defect |
| 5 | Sonnet, night-a (brief A), run and interview | 78 k | 21 | 2.9 min | the commit was taken as it stood |
| 5 | Sonnet, night-b (brief A) | 75 k | 16 | 2.2 min | the commit was taken as it stood |
| 5 | Sonnet, night-c (brief A) | 76 k | 19 | 2.5 min | the commit was taken as it stood |
| 5 | Sonnet, saved (brief B), started again after the limit | 75 k | 21 | 2.4 min | the commit was taken as it stood |
| 5 | Sonnet, kelvin (brief C) | 79 k | 18 | 2.3 min | the commit was taken as it stood |
| 5 | Lead, A8 and A9, two sessions | not shown | not shown | two sittings | nothing to combine |

Wave 3 ran under the rules below and combined on one run of the full check.
Combining wave 2 took the lead four runs of the full check where one was planned. None of the causes was the
builders' judgment; each was something the brief or the setup left open. So:

- **A brief names the commit to start from,** by hash, and the builder confirms it before reading anything. Both
  builders began on `main` instead of the wave's branch.
- **No test states a count or a list another slice of the same wave will change.** It reads the list from the
  package.
- **One builder per file per wave.** Where two must touch one document, the brief gives each its own section.
- **A document with mixed line endings is normalised in a commit of its own before a wave that edits it.**
- **The lead removes a builder's worktree as soon as its commits are taken.** The test runner and git now ignore
  `.claude/worktrees`, so a leftover one cannot fail a run.
- **A builder's report lists what the brief got wrong or left out.** Two of wave 2's fixes to the gate's rule came
  from there.
- **One cold review per pull request, by a reviewer that has seen neither the brief nor the build,** reading the
  diff alone. The lead wrote the briefs and so cannot be the fresh eye on them.
- **The lead starts a new session at each wave's end.** The plan, `docs/SESSION-STATUS.md` and this table carry the
  state; a long session pays for its own history on every step, and that is the largest cost a wave has.

## Proof and interviews

Run on `feat/authoring-proof`, cut from `feat/authoring-guide` (pull request 576 was still open), by five cold Sonnet
runs that read the wave 4 guide and the `make-motion` skill. The first launch stopped at the usage limit with four scene
files written and nothing committed; those four were resumed by message and `saved` was started again. The first
attempts' cost is not shown. The cost rows above are the runs that finished, interview included, 383 k tokens and 95 tool
calls in all.

### The five pieces

| Piece | Brief | Moves used | Written for it | Look |
| --- | --- | --- | --- | --- |
| `night-a` | A | `rise`, `fade`, `pop`, `repeated` of `pulse`, `combine` | none | navy ground, heavy white NIGHT and amber SHIFT, an amber dot below that pulses once |
| `night-b` | A | `slide`, `fade`, `pop`, `repeated` of `pulse`, `combine`, `lane` | none | the same navy and amber, the words slide in from either side, the dot sits at the top right of SHIFT and pulses twice |
| `night-c` | A | `rise`, `fade`, `pop`, `repeated` of `nod` and of `pulse`, `combine` | none | navy with a soft glow, serif type, a crescent moon above the words that bobs and glows |
| `saved` | B | `pop`, `fade`, `slide`, `reversed`, `combine` | none | pale card, green check and a small dark word that fade in and drift out |
| `kelvin` | C | `drop`, `fade`, `swing`, `combine` | none | near-black stage, cream serif KELVIN, a brass rule, a paper price tag that swings to rest |

`npm run motion:moves -- --check` passes: twenty moves, all built in. No agent opened package source or an example scene.

### Verdict: A8 does not pass

- **Brief A, no two share a move set: fails.** `night-a` and `night-c` use the same five moves and `night-c` adds one
  more; `night-b` swaps `rise` for `slide`. All three are a navy card, two words that arrive one after the other, and one
  small glowing thing that pulses or bobs while the words rest. The look is one look.
- **Briefs B and C against A: passes.** `saved` and `kelvin` differ in look, but every piece is built from the same
  six or seven catalogued moves, `fade`, `pop`, `combine` and an enter in all of them.
- **A move written for a piece: fails.** None of the five wrote a move. Every one said the catalog had what it needed.
- **Against the baseline:** the two archived pieces, `chrono` and `forge`, each hand-built physics and rig work and
  used `drop` with different numbers, so their move sets differed but their vocabulary was five moves and a simulator.
  The new pieces are tidier, and they are closer to each other than the baseline was.

The plan's fallback is to move the worked examples out of the agents' reach. It would not help here: no agent opened an
example, and every one reported reading the guide, the catalog and the scaffold only. The convergence comes from the
brief, the catalog and the loop: a brief that asks for words that arrive and one detail that holds is answered by an
enter, a fade and a pulse, and the catalog offers exactly those. What this run suggests instead is in the roadmap: the
guide's step that writes the idea in three lines does not ask the agent to say what its piece does that the obvious one
does not, and nothing asks it to write a move.

### Interviews and the ranked list

All five were asked the seven questions in the same session. Every one opened no package source.

| # | Change | Asked by | What it saves | Done |
| --- | --- | --- | --- | --- |
| 1 | State that `span`'s third argument is the whole scene's length, not the stretch's; ideally take it from the scene | 5 of 5 | a wrong render and one or two extra review runs each | words fixed in the guide, the reference and the source comment; the signature change is in the roadmap |
| 2 | A shorter `motion:review` output: findings and the sheet path, with the per-channel eases on request | 4 of 5 | most of a long result read and not used | roadmap |
| 3 | The catalog listing is longer than a piece needs | 4 of 5 | about twenty lines | none: the guide already names `-- --role` |
| 4 | `motion:review` threw "Cannot fast-forward to the past" on a first run without `--at` | 2 of 5 | a re-run and a guess | roadmap, to be reproduced first |
| 5 | A review finding when an entrance runs the length of the scene | 1 of 5 | the same mistake as item 1, caught later | dropped: the existing finding already caught it |
| 6 | `motion:sample` taking a scene name | 1 of 5 | one retry | dropped |
| 7 | How to draw a check mark on, with `trace` | 1 of 5 | a choice made on a guess | dropped |
| 8 | A looping or ambient move | 1 of 5 | none; `repeated` was found | dropped |

### What was not verified

No piece was watched at full speed; each was read from the `motion:review` frame sheet, and the lead read one sheet per
piece. `saved` renders small inside its page. The full `npm run check` ran once on the combined branch.

## Second proof

Run on `feat/authoring-proof-2` after one change to the guide: before any code, name the obvious answer, write three
ideas that differ from it in what moves and how, and pick one that is not it. Four cold Sonnet runs at medium effort,
started by the conductor with no session between: 295 k tokens, 64 tool calls, about 2.3 minutes each.

| Piece | Brief | Chosen idea | Moves | Written for it | Tokens |
| --- | --- | --- | --- | --- | --- |
| `night-d` | NIGHT SHIFT title card | NIGHT drops, SHIFT slides over, a small clock hand ticks through the hold | `drop`, `slide`, `pop`, `fade`, `overshoot`, `combine` | none | 74 k |
| `night-e` | the same | NIGHT rises, SHIFT slides in, a crescent moon on a thread swings to rest | `rise`, `slide`, `fade`, `swing`, `combine` | none | 72 k |
| `night-f` | the same | the words slide in from either side, a lamp breathes | `slide`, `fade`, `pulse`, `repeated`, `combine` | none | 70 k |
| `tempo` | a metronome that ticks evenly, then stops dead | a bare arm with a sliding weight, a dot that flashes at each tick | `rise`, `fade`, `combine`, and `keyframes` for the arm | none | 79 k |

The pass mark changed with this run: the same brief three times must give three motion ideas, and shared standard
moves are allowed, since a shared vocabulary is the objective and not a fault.

- **Three motion ideas from one brief: passes, narrowly.** A ticking hand, a pendulum and a pulse are three devices
  from three different moves, where the first proof gave a pulse three times. Each run named the pulsing dot as the
  obvious answer and dropped it. Each also chose the calmest of its three ideas; the bolder ones (a lamp cone wiping
  the words in, a split-flap shift, a lever thrown) were listed and left.
- **The look: fails.** All three are a navy ground with a cream NIGHT and an amber SHIFT, as all three were in the
  first proof. The conductor read one frame sheet per piece. The step asked for different motion and said nothing
  of the look, so the look stayed where the model's first thought put it.
- **A move written when the catalog has none: fails.** `tempo` needed a steady swing of constant width, saw that no
  catalogued move gives one, and drew it with `keyframes` in the scene, calling it glue. The guide said to write a
  move "where nothing fits", and `keyframes` fits anything.

What changed in the guide after this run, untested: the look step names the obvious look and chooses another; a
motion with a name another piece could use is a move even where `keyframes` could draw it; the report names any
motion built from `keyframes` and says why it is not a move.

What is not done: a third run to test those changes, and a source of difference that does not depend on the agent
choosing against its own first thought. Three runs of one model on one brief start from one place; a drawn
constraint handed to each run (a limit on colour, on the number of moving things, on what the hero is) would start
them from three. That is proposed, not built.

## A hand-made piece, rebuilt

The owner's experiment: an Opus worker at medium effort made a 15 second showreel with no gerak, as one HTML page
with one clock function (`C:\Data\dev\motion5\showreel-free\`, 141 k tokens). A second Opus worker at medium effort
rebuilt it with gerak as the piece `showreel` (198 k tokens, 66 tool calls, 15 minutes), under the rule that every
motion with a name is a move.

- **It can.** All six beats are rebuilt with the original's palette, type and layout; the conductor read one sheet
  of six frames. Three beats are faithful and three are approximated: a slower tremble, a fall without stretch, and
  letters that swing by a catalogued move where the original simulated them hanging from a moving bar.
- **The rule held when it was stated as a rule.** The worker used fifteen catalogued moves and wrote seven
  (`launch`, `spring-settle`, `jolt`, `bump`, `kick`, `shockwave`, `ballistic`), all passing the gate. The
  catalog holds 27 moves. The metronome run, told only "where nothing fits", wrote none.
- **What gerak could not say,** most limiting first: colour, blur and text that changes have no value, and about
  thirty elements needed them; a drawn stroke has a head and no tail; modifiers take a pose and nothing else; nothing
  hangs from a thing that moves; a move holds its pose outside its span, so a target with eight phases is stitched
  by time in the scene; an opacity left out keeps its last value; the gate refuses a fast tremble; the review does
  not see a parent's clip.
- **What was slow:** stitching phases by elapsed time, and spans and lanes set by hand for seventy elements.

Not verified: neither piece was watched at full speed, and the rebuild was compared with the original's clock code,
not with its frames.

## 7. Done when

The five proof pieces pass section A8, the ranked list of A9 is acted on, `npm run check` is green, the guide names no worked example, and
`docs/SESSION-STATUS.md` says so.
