# Composition plan, part two: strokes that follow the layout, skins that keep their own, and a library that grows

**Status:** Built, 2026-11-13; approved by the owner the same day.
**Base:** `main` at the merge of pull request 585.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-175-paths-presence-by-beats-and-events-on-a-clock.md`,
`plan/composition-plan.md` section 4a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A stroke can follow the measured layout, a skin's own look survives the motion, and a move proved in pieces can
join the library with its recipe shown.**

The fourth rebuild (`showreel-d`, 242 k tokens) named four gaps. A path is fixed when the cast is built, so a stroke
that should sit under a measured word is drawn at guessed points and stretched by hand from `restOf`. The stage sizes
a stroke member but does not place it, so the skin restates the path's box. A text member no skin names falls back to
48 px. `applyValue` writes `transformOrigin` on every frame, so a skin cannot keep its own pivot.

Beside them, from the bricks-and-presets discussion: nothing turns a proved local move into a library move; the
catalog says what a move does but not what it is made of; squash from another value's speed is not a one-line brick;
and `trail` re-simulates its spring history every frame, untested for real-time cost.

Transitions between scenes and layout moves are part three.

## 2. Decisions to record (D0, ADR-176)

- **A path may be a function of where things rest.** `actor({ path: (rest) => toCubics([...]) })` is evaluated after
  the stage measures, and again on each measure; a tool with no renderer calls it with the module's `rest` or
  `NO_REST`. A fixed list stays allowed. Its length, for `drawn` and `trace`, comes from the cubics it answers. The
  stage measures every other member first; a path never reads its own box, and the review reports one that does.
- **A path's points are frame px from the frame's top-left, the space `Rest` boxes are measured in,** whatever group
  the member sits in. The stage converts them to the parent's space and places the stroke member at the path's box;
  the skin never restates it.
- **Default text inherits its size.** The default skin draws text in the parent's font; the grey box stays for a
  member with no text and no path.
- **`applyValue` writes only what the value says.** On an HTML element, a value without `anchor` clears
  `transformOrigin` as it clears `opacity` and `clipPath`, so a skin's own pivot shows; CSS's own default is the
  centre, so nothing else changes. An SVG element keeps `center` by default, since SVG's own is the top-left.
- **A move is promoted, not copied.** A local move that passes the gate and is imported by two or more pieces is a
  candidate; `motion:moves -- --candidates` lists them; promotion moves the file into `@gerak/moves` and rewrites its
  imports, by a command, in one commit.
- **A move may name its recipe.** `defineMove` takes an optional `recipe`, a list of the part ids it is built from;
  the catalog prints it, and the gate refuses an id the parts list lacks.
- **Squash from speed is a brick.** `squashFromSpeed(speed, options)` turns a speed into a squash and stretch along
  its heading; `motion:moves -- --parts` lists it.
- **`trail`'s cost is measured before it is changed.** A scene builds its trails afresh each frame, so a cache
  cannot key on the input function. First measure: the time per frame of `showreel-d` in a real browser. If a frame
  takes more than 4 ms in the scene, `trail` takes an optional `key`, and a trail with one continues from its last
  state on a later time; answers are the same either way.

## 3. Slices

### D1. Strokes from the layout

- **Invariant:** a path member's `path` may be a function of `Rest`; the DOM stage calls it after each measure,
  places the member at the path's box in its parent, and redraws it; `readStageModule` and the tools accept it and
  call it with the module's `rest` or `NO_REST`.
- **Owner:** `packages/stage/src/cast.ts`, `packages/stage/src/module.ts`, `packages/dom/src/stage.ts`.
- **Test:** an underline whose path reads a word's measured box sits under it after layout and after a resize; a
  fixed path is placed without any skin rule; the tools sample a module with a path function.

### D2. Skins keep their own

- **Invariant:** `applyValue` clears `transformOrigin` when the value has no `anchor`; default text has no size of
  its own.
- **Owner:** `packages/dom/src/render.ts`, the default skin in `packages/dom/src/stage.ts` (one rule).
- **Test:** a skin's `transform-origin` survives a value without `anchor`; an unnamed text member takes its parent's
  font size; every piece's frames match before and after.

### D3. The library grows from use

- **Invariant:** `motion:moves -- --candidates` lists local moves that pass the gate and are imported by two or more
  pieces; `motion:promote <id>` moves one into `@gerak/moves`, exports it from the index, rewrites every import, and
  leaves the reference to `npm run reference -- --write`; `defineMove` takes `recipe`, the catalog prints it, the gate
  refuses an unknown part id in it; `squashFromSpeed` is a part.
- **Owner:** `packages/tools/src/scene/catalog.ts`, a new `packages/tools/src/scene/promote.ts`,
  `packages/moves/src/define.ts` (or wherever `defineMove` lives), a new `packages/moves/src/squash-speed.ts`, the
  parts list, the guide's "Writing a move" section.
- **Test:** a fixture app with a move used twice lists it; promoting it in a scratch copy moves the file and the
  imports, and the check passes there; a recipe naming `nonsense` is refused.

### D4. What a trail costs

- **Invariant:** the time per frame of `showreel-d`'s scene in a real browser is measured and recorded in this plan.
  Only if it passes 4 ms: `trail({ key })` keeps one last state per key and continues forward from it, answering the
  same as a fresh run.
- **Owner:** `packages/moves/src/trail.ts`, the plan's results.
- **Test:** the measurement's numbers; if the cache is built, the same answers for times forward, backward and
  jumping, and a forward run of 300 frames simulating at most 300 plus one memory of steps.
- **D4 result:** measured in Chrome on the Vite dev server, calling the scene of `showreel-d` directly with
  `performance.now()` over 60 evenly spaced times across the 15 s, four runs. The scene took 3.4 to 4.4 ms a frame on
  average (pooled 3.9 ms; 3.6 to 4.1 ms with 20 passes a frame; 3.5 to 4.9 ms over 900 frames), the worst frame 8 to
  18 ms. The same scene with `trail` replaced by its signal took 0.2 to 0.3 ms, so `trail` is about 3.5 ms of it,
  all from the seven `dangle` hangers. The mean sits on the 4 ms line and the rule asks for more than 4, so `trail` is
  unchanged and no `key` was built; a worst frame past 16 ms is the case that would justify it.

### D5. Proof

- **Measure, alone, fresh:** the showreel rebuilt a fifth time as `showreel-e` from the original only. Passes when
  the underline and arc are path functions of `rest` with no stretch by hand and no box restated in the skin, no
  text is sized by accident, and its frames are at least as close as `showreel-d`'s.
- **Cold review:** a Sonnet agent reviews the diff and runs what it claims, `motion:promote` in a scratch copy
  included.

## 3a. Results

| Rebuild | Worker | Tokens | Moves written, reused | Strokes from `rest`, stretched by hand | Mean frame difference |
| --- | --- | --- | --- | --- | --- |
| `showreel-d` | Opus, medium | 242 k | 2, 22 | 0 of 4, 2 | 0.1 to 5.1 |
| `showreel-e` | Opus, medium | 252 k | 1 (with a recipe), 22 | 4 of 4, 0 | 0.1 to 4.9 |

`showreel-e` passes: all four strokes are path functions of `rest`, none is stretched by hand and the skin states no
stroke box, no text is sized by accident, and six of seven frames are as close to the original as `showreel-d`'s or
closer (2704 is 1.01 against 0.98). Tokens held level. What cost it most, for part three: a draw-on and its retract
cannot combine (`drawn` replaces), and a zero-length dash still paints a dot with round caps; presence per item and a
`still` inherited from a group; the review flags a jump while a member is hidden by `on`; text cannot change over
time; and `motion:frames` cannot compare two runs, so two measures each wrote their own PNG diff.

The cold review (Sonnet, 110 k) gave seven findings, all fixed: `motion:promote` missed importers outside `src` and
left re-exports and `import *` broken while deleting the file, and published helper exports; offsets ignored a
parent's border; a path answering new points each call looped through the resize observer; a path reading another
stroke was not reported. Known: `--candidates` counts importing files, so the four showreel rebuilds count as four.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | D0, D2 | the decisions, and two small fixes in the renderer |
| 2 | Opus, medium | D1 | the stage and the cast: measuring, placing, redrawing |
| 2 | Sonnet, medium | D3, D4 | tools and moves; no file shared with the stage |
| 3 | Opus, medium, fresh | D5 measure | |
| 3 | Sonnet, medium | D5 cold review | |

Both wave 2 workers regenerate the reference for their own commits; the conductor regenerates once on combining.
One pull request, after wave 3.

## 5. Risks

- **A path function that throws** would stop the stage; the stage reports it as a scene error and keeps the last
  good path.
- **Clearing `transformOrigin`** changes pieces that relied on the default `center`. Frames before and after show it;
  a piece that needs the centre names `anchor`.
- **Promotion rewrites imports across apps.** It runs in one commit, by a command, and the check must pass after it.
- **A trail cache is state inside a pure function.** It is built only if the measure asks for it, keyed by a name
  the scene gives, holds one last state, and answers exactly as a fresh run does; a test compares them.

## 6. Done when

`showreel-e` passes, `motion:moves -- --candidates` and `motion:promote` work on the repository's own moves,
`npm run check` is green, and `docs/SESSION-STATUS.md` says so.
