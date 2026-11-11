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

`npm run check` runs once per wave, each slice is one commit, and each wave is one pull request.

## 7. Done when

The five proof pieces pass section A8, the ranked list of A9 is acted on, `npm run check` is green, the guide names no worked example, and
`docs/SESSION-STATUS.md` says so.
