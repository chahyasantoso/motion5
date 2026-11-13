# Artwork plan: rebuilding a reference image in named parts

**Status:** Proposed, 2026-11-13.
**Base:** `main` at `8b157254`, the merge of pull request 589.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` section 5 (stage 6), `docs/ADR-174` to
`docs/ADR-179`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An agent looks at an image, rebuilds it as an SVG stage module in named parts that turn about their joints, and a
command tells it which parts differ from the reference.**

The stage already draws a part: a path member renders as an SVG `<path>` its skin can fill. Two things are missing.
A part cannot turn about its joint: for an SVG member the renderer sets the transform origin to its centre, so an arm
turns about its middle. And nothing compares a rebuild with its reference: `motion:frames --compare` diffs two runs of
frames, not a frame against an image, and says nothing per part.

A Three.js rebuild belongs with 3D, roadmap stage 7.

## 2. Decisions to record (H0, ADR-180)

- **A rebuild is an ordinary stage module.** Each part is a cast member, named for what moves (`upperArm`, not
  `shape12`); its outline is a path member's cubics in frame px, filled and coloured by its skin. A part with several
  outlines is a `group` of paths. There is no artwork format beside the stage module.
- **A part turns about its pivot.** A member may declare `pivot: { x, y }`, a point in frame px, usually its joint.
  The stage sets the member's transform origin there from its measured box, on mount and on every re-measure. A pose's
  `anchor`, the named side a squash keeps still, wins on the frames that give one. Without either, an HTML member
  keeps its skin's origin and an SVG member its centre, as today.
- **A part hangs from its parent by grouping.** An upper arm's group holds the forearm, so turning the upper arm
  carries the forearm, and each member's value is relative to its group, as today. Bones from `@gerak/rig` drive the
  same members: a chain's solved angles become each part's `rotation`.
- **The comparison is a command, the looking is the agent's.** `motion:compare <page> --reference <image>` renders
  the piece at `--at` ms (default 0), fits the reference to the frame, and writes the two side by side and a
  difference image. It prints the whole frame's mean difference out of 255 and, for each cast member, the mean
  difference inside its box, worst first. It reads any image the browser decodes. It judges nothing; the agent
  decides what to fix.
- **References live beside the piece:** `apps/pieces/references/<name>.<ext>`. A reference that is someone else's work
  is only ever a private exercise, never shipped or published.

## 3. Slices

### H1. Pivots

- **Invariant:** a member with `pivot` turns about that point: after a `rotation` of 90, the pivot is drawn where it
  rests; a pose `anchor` overrides it on that frame; a re-measure keeps it right after a resize.
- **Owner:** `packages/stage/src/cast.ts` (the field, read by `readStageModule`), `packages/dom/src/stage.ts` (the
  origin from the measured box), `packages/dom/src/render.ts` (no inline centre over a pivot).
- **Test:** an SVG path member and an HTML member, each with a pivot off-centre, rotated; the pivot stays put; a pose
  with `anchor` still squashes from that side.

### H2. `motion:compare`

- **Invariant:** as decided above; two identical images compare at 0; a part drawn in the wrong colour is first in
  the list.
- **Owner:** `packages/tools/src/page/compare.ts` and its bin, beside `frames.ts`, reusing its PNG reader.
- **Test:** a fixture page and reference that differ in one member's box: that member is first and the others are 0.

### H3. Guide

- A section of `docs/guide/agent-motion.md`, "Rebuilding artwork": look at the reference and name the parts by what
  moves; draw each outline as cubics; set each joint's `pivot` and group parts by what carries what; run
  `motion:compare` and fix the worst part first; then move it with moves or a rig. The reference gains `pivot` and
  `motion:compare` by their doc comments.

### H4. Proof

- **The reference:** a Sonnet worker draws an original flat character (head, torso, two arms in two parts each, two
  legs) as a plain SVG file, and renders it to a PNG. The rebuilding worker sees only the PNG.
- **Measure, alone, fresh:** an Opus worker at medium effort rebuilds the PNG as the stage module `artwork-wave`, then
  makes the character wave: the upper arm turns at the shoulder, the forearm at the elbow. It passes when every part
  is a named member, every jointed part has a pivot, each part's difference is under a threshold it reports, and the
  wave turns about the joints. Tokens, tool calls and the compare scores are recorded.
- **Cold review:** a Sonnet agent reviews the diff and runs `motion:compare` on the result.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | H0, H1 | the decision and the pivot touch the stage, render and cast |
| 2 | Sonnet, medium | H2 | tools only |
| 2 | Sonnet, medium | H4 reference | an SVG file and a PNG, outside the code |
| 3 | Conductor | H3 | what the measure reads |
| 3 | Opus, medium, fresh | H4 measure | |
| 3 | Sonnet, medium | H4 cold review | |

One pull request, after wave 3, with the roadmap's reorder and the motion-atlas notes already on its branch.

## 5. Risks

- **Two owners of an origin:** `pivot` and a pose's `anchor` both set it. The rule is fixed above, a pose's `anchor`
  wins on its frames, and the test holds it.
- **A mean hides a small wrong part:** per-member scores answer it; a part smaller than its neighbours' error still
  shows first when it is the one wrong.
- **Fitting:** a reference of another aspect ratio is fitted inside the frame, never stretched; the command says so.

## 6. Done when

The measure passes, its tokens and scores are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says
so.
