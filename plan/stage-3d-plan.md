# 3D objects in a scene

## Goal

People and agents making a 3D piece put its Three.js objects in a scene beside DOM labels and page elements. The
objects get beats, `.show` windows, review and the same clock as everything else, and a 3D object can travel to a slot
on a page. The code adds one element type, one binding in `@gerak/three`, and a screen-to-world function in core.

Status: rewritten 2026-11-19 for the scene builder. The approved 2026-11-18 version cast objects in `defineStage`,
which `plan/scene-builder-plan.md` removes. Starts after `plan/page-plan.md` lands. One branch, one pull request.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- After `plan/scene-builder-plan.md`, a piece is a `sceneBuilder` chain over element values. `@gerak/dom` reads its
  kinds with an exhaustive `switch`, and rendering refuses an element that no renderer draws.
- After `plan/page-plan.md`, a page has sections, scroll beats and slots made from page elements.
- `@gerak/player` plays a signal of any value shape, `Pose3d` included.
- The 3D pieces (`overlay3d`, `principles3d`, `character3d`, `avatar-3d`, `dragon-intro`) play scene modules through
  the player, and write poses with `@gerak/three`'s `applyPose3d` and `useTarget3d`.
- `gerak new --three` writes such a scene module.
- Core has `project3d`, from world units to the screen, and nothing from the screen to the world.

## Decisions

### 1. The `object` element

- `@gerak/stage` exports `object(name, options?)`. Its kind is `"object"`, and its pose type is `Pose3d`.
- It has no DOM element, rest box, skin, content, pointer events or pivot. Its origin is the `Object3D`'s.
- Types refuse a 2D motion on an object and a 3D motion on a 2D element.
- Review samples and judges an object as it judges a 3D scene module's target, with `--jump` in world units and its
  `.limits`.
- Page tools (`frames`, `check`, `fps`, `render`, `compare`, and `review` on a page) see an object only as canvas
  pixels. `commands.md` states this in one line.

### 2. `bindScene3d`

- `@gerak/three` exports `bindScene3d(player, scene, objects: Readonly<Record<string, Object3D>>, draw: () => void)`.
  It returns the unsubscribe.
- On each player step it writes each object's pose with `applyPose3d`, sets `visible` from the scene's `.show`
  windows, then calls `draw` once. The canvas therefore draws on the player's step, as ADR-183 requires.
- It reads `kind` over its own closed union, `"object"`, with an exhaustive `switch`.
- It throws when a scene's object has no entry in `objects`, and names it.

### 3. From a slot to the world

- Core gains `unproject3d(point, lens, stage, depth)`: a screen point to world units at a depth.
- `travel({ to: slot })` on an object moves it to the slot's screen point at its current depth.

### 4. Scaffold and pieces

- `gerak new --three` writes a builder piece with one `object` bound through `bindScene3d`. `pack:check`'s
  `tsc after new --three` stays green.
- `overlay3d` moves first: objects and DOM labels on one clock. Its frames match the baseline.
- `principles3d`, `character3d`, `avatar-3d` and `dragon-intro` then move one at a time, each moved by a fresh agent.
  Each agent reads only `AGENTS.md`, the package docs and `overlay3d`, never this plan. It reports every fact it had to
  learn from package source or by trial.
- Each such fact is stated in the docs as behaviour, not as a recipe, before the next piece starts. Each moved piece's
  frames match the baseline, and its review gains no finding.
- `page-plan`'s landing page gains a 3D drink in place of its drink image, as a second proof.

### 5. Tests first

- An object compiles with kind `"object"`, and a 3D motion on a `box` fails to type-check.
- One `bindScene3d` step writes a pose and `visible`, and calls `draw` once.
- `unproject3d` inverts `project3d` at the same depth.

### 6. Record and docs

- A new ADR records Decisions 1 to 3, with the next free number. It supersedes ADR-190's clause on pose `"3d"`. Then
  run `npm run adr-index:write`.
- 3D in a scene goes on a page in `@gerak/three`'s docs, read on demand. `stage.md` gains one line that points to it,
  under its ceiling. `core.md` gains `unproject3d` in its names by group.
- Rewrite `docs/SESSION-STATUS.md` and the roadmap's "Done and not done" table.

## Execution

1. **Baseline:** frames of every page under `apps/pieces`, each piece's `gerak review` output, and every command's
   output on `tempo`, `card` and `overlay3d`.
2. Decisions 5, then 1 to 3, then 4, then 6. `npm run check` is green after each.
3. Compare against the baseline. No frame may change. Command output changes only where a 3D piece became a builder
   piece.
4. In the pull request, report:
   - `npm run check` with no `packages/*/dist`.
   - `npm run pack:check`.
   - the comparison.
   - what each fresh agent reported.
   - one cold review by an agent that has not read this plan.

## Not in this plan

- Objects inside groups or lists, and pointer events on objects.
- React Three Fiber.
