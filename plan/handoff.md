# Handoff to the next conductor session

**Written:** 2026-11-13, after the live-inputs plan was approved. Read this, then `docs/SESSION-STATUS.md`,
`plan/live-inputs-plan.md` (the whole plan; it has had one round of critique) and `.claude/skills/wave-build/SKILL.md`.
Delete this file in the pull request that builds the plan.

## Where things stand

- `main` is at `42a22c4a`: roadmap stages 1 to 6 are merged, the last being rigging vector artwork (pull request 590,
  ADR-180). The branch `feat/live-inputs` holds the approved plan and nothing built; work on it and open one pull
  request after wave 3. The owner merges by hand.
- Order after this plan: 3D (stage 8), then a motion-atlas brainstorm that ends in a decision (stage 9,
  `plan/motion-atlas-plan.md`), then the live kit, web overlay and video (stage 10). The instrument is deferred.
- Workers run on Opus or Sonnet at medium effort, fresh, from short briefs; a measure always runs in a fresh worker.

## Start here: wave 1 is the conductor's

The decision record is ADR-181 (ADR-180 is the last). Slice I1 touches these, checked against the tree:

- `packages/moves/src/events.ts`: `MotionEvent` (`name`, `at`, `target?`, `x?`, `y?`), `isMotionEvent` (one owner,
  used by the stage reader and the tools), and `follow`, whose loop replays every event from the start on each call.
- `packages/dom/src/drivers.ts`: `clockDriver` runs past the end only while `watching > 0`, and clears its recorder
  when a loop wraps (`recorder.clear()`); the event driver in `events.ts` already has `emit`, the clock driver does not.
- `packages/dom/src/stage.ts`: `MountedStage` and the `cues` it already plays (`play(scene, driver, { cues })`).
- `packages/tools/src/scene/scene.ts`: `parseEvents` reads `name:target@ms(x,y)`; it gains `name=0.6@ms`.

## What this session learned

- Check every fact a brief states against the tree before sending it; both wrong briefs in part four were unchecked.
- Run `npm run check` from a clean state when a change adds a build: delete `packages/*/dist` first.
- Grep a combined diff for control characters. Shell heredocs and Python strings in this environment turn `\b` into a
  backspace; write such text with the file tool, or with a script file that builds the character by code.
- `motion:compare` looks both ways within one pixel; a faithful import scores a mean under 1 and parts up to about 11,
  so the per-part bar is 15.

## Open items

- The plan grew after approval, by the owner's choice: slice I5 fixes the artwork review's four open findings, slice
  I6 imports a drawing `--into` a bigger scene, and the measure is now `penguin-scene`, the penguin talking on an ice
  floe with snow, which also ends the clipped flipper of the old `penguin` piece (made before `--margin`). The plan's
  team table splits I5 by owner so one worker holds `packages/dom/src/stage.ts`.
- Per-part gradients copy a shared gradient once per part that uses it; the owner asked for a note, which is in the
  plan's risks. Revisit it if a scene has hundreds of parts on one gradient.
- AGENTS.md forbids `!` (a non-null assertion), but no gate holds it, and a rough grep finds about 170 lines with one in package and app
  sources (`grep -rnE '[A-Za-z0-9_)\]]!(\.|;|,|\))' packages/*/src apps/*/src`). `chainThrough`'s are fixed on this
  branch. A scan like `scan:comments`, with a baseline that may only shrink, would hold it; a plan of its own.
- Deferred: the `trail` cache (ADR-176), a clip that grows.
