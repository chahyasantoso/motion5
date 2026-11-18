# 3D objects in a stage

## Goal

People and agents making a 3D piece cast its Three.js objects in a stage, so the objects get beats, `on` windows,
the cast check and stage review, and are posed on the same clock as any DOM labels. The code adds one member kind,
one builder and one binding in `@gerak/three`.

Status: approved 2026-11-18. Starts after `plan/shapes-plan.md` and `plan/principles-plan.md` land. One branch, one
pull request.

Read `AGENTS.md` first; every rule there applies.

## Where things stand

- `@gerak/stage` is 2D only. ADR-190 removed pose `"3d"` "until a renderer needs them".
- `@gerak/player` already plays a signal of any value shape, `Pose3d` included.
- The 3D pieces (`overlay3d`, `principles3d`, `character3d`, `avatar-3d`, `dragon-intro`) play scene modules through
  the player, and write poses with `@gerak/three`'s `applyPose3d` and `useTarget3d`.
- `gerak new --three` writes such a scene module.
- Some code reads `Member.kind` with a predicate, not a `switch`, so a new kind would pass unnoticed:
  - `packages/tools/src/scene/review.ts` reads `!== "list"`, `=== "actor"` and `!== "group"`;
  - `packages/tools/src/scene/scene.ts` reads `writtenOut`'s list;
  - `packages/dom/src/stage.ts` reads in its target lookup and readout.
- `mountStage` in `@gerak/dom` returns `MountedStage`, which carries its `player`.

## Decisions

### 1. Every read of `Member.kind` is a `switch`

The predicate reads above become exhaustive `switch` statements, as `AGENTS.md` requires, before any new kind exists.
This changes no behaviour.

### 2. `m.object()`

- A new member kind, `"object"`, joins the `Member` union. Its scene value is a `Pose3d`.
- It has no DOM element, rest box, skin or content.
- `m.object()` returns an `ObjectSpec`. Its type allows only `.on(...)`, `.static()`, `.ambient()` and `.settle()`:
  - no pointer event reaches an object, so it has no `.watch()`;
  - its origin is the `Object3D`'s, so it has no `.pivot()`.
- `m.group` and `m.many` do not accept an `ObjectSpec`, so an object is a top-level member, and the Three.js scene
  graph nests objects. Types enforce all of this, so `compileStage` adds no check.
- `Targets` maps an object to `Pose3d`. `check` refuses a non-pose for it.
- Each `switch` from Decision 1 gains the `"object"` case:
  - `signatureOf` keys it by name and kind;
  - `mountStage` makes no element for it;
  - scene review and `gerak sample` sample and judge it as they judge a 3D scene module's target, with `--jump` in
    world units and per-target `limits`;
  - readouts, strokes, morphs and shape findings do not apply to it.
- Page tools (`frames`, `check`, `fps`, `render`, `compare`, and `review` on a page) see an object only as canvas
  pixels, because `--watch` selects DOM elements. `commands.md` states this in one line.
- Test first:
  - an object compiles with kind `"object"`;
  - a type test that `Targets` gives `Pose3d`, and that an object inside `m.group` fails to type-check;
  - `mountStage` makes no element for an object.

### 3. `bindStage3d`

- `@gerak/three` exports
  `bindStage3d(player, stage, objects: Readonly<Record<string, Object3D>>, draw: () => void): () => void`.
- On each player step it writes each object's pose with `applyPose3d`, sets `visible` from `stage.visibleAt`, then
  calls `draw` once. The canvas therefore draws on the player's step, as ADR-183 requires.
- It throws when a cast object has no entry in `objects`, and returns the unsubscribe.
- `@gerak/three` gains a dependency on `@gerak/stage`. Both are group `core`.
- Test first: one step writes a pose and `visible`, and calls `draw` once.

### 4. Scaffold and worked example

- `gerak new --three` writes a stage with one `m.object()` bound through `bindStage3d`. `pack:check`'s
  `tsc after new --three` stays green.
- `overlay3d` moves to a stage: objects and DOM labels on one clock. Its frames match the baseline.
- `stage.md` gains one row in the cast table and one bullet under "How the DOM renderer draws". `@gerak/three`'s docs
  state `bindStage3d`.

### 5. The 3D exercise

`principles3d`, `character3d`, `avatar-3d` and `dragon-intro` move onto stages one at a time, each moved by a fresh
agent. Each agent:
- reads only `AGENTS.md`, the package docs and `overlay3d`, never this plan;
- reports every fact it had to learn from package source or by trial.

Each such fact is stated in the docs as behaviour, not as a recipe, before the next piece starts. Each moved piece's
frames match the baseline, and its review gains no finding.

### 6. Record and docs

- `docs/ADR-193-3d-objects-in-a-stage.md` records Decisions 1 to 4. It supersedes ADR-190's clause on pose `"3d"`.
  Then run `npm run adr-index:write`.
- Rewrite `docs/SESSION-STATUS.md` and the roadmap's "Done and not done" table.

## Execution

1. **Baseline,** as `plan/shapes-plan.md` takes it: frames of every page under `apps/pieces`, each piece's
   `gerak review` output, and every command's output on `tempo`, `card` and `overlay3d`.
2. Decisions 1 to 6 in order. `npm run check` is green after each.
3. Compare against the baseline. No frame may change, and command output changes only where `overlay3d` and the
   exercise pieces became stages.
4. In the pull request, report:
   - `npm run check` with no `packages/*/dist`;
   - `npm run pack:check`;
   - the stage benchmark;
   - the comparison;
   - what each exercise agent reported;
   - one cold review by an agent that has not read this plan.
5. Last, the NADI measure exactly as `plan/measure-nadi.md` states, measuring all three plans together.

## Not in this plan

Objects inside groups or lists; pointer events on objects; React Three Fiber.
