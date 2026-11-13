# Artwork plan: rigging vector artwork

**Status:** Proposed, 2026-11-13.
**Base:** `main` at `8b157254`, the merge of pull request 589.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` section 5 (stage 6), `docs/ADR-174` to
`docs/ADR-179`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An SVG drawn by someone else becomes a stage module in named parts that turn about their joints, so an agent can
rig it and animate it.**

The flow: a person drops an SVG into `apps/pieces/references/` and says what it should do. The agent imports it with
one command, which turns every shape into a path member of a new stage module. The agent then rigs it: it names
the parts by what moves, regroups them so the body carries the head, and sets a pivot at each joint. Then it animates
the parts with moves, or with bones from `@gerak/rig`. The import is mechanical; deciding the parts and the joints is
the agent's.

Rebuilding artwork from a raster picture is out of this plan. A Three.js model belongs with 3D, roadmap stage 7.

Today three things stop it. A part cannot turn about its joint: for an SVG member the renderer sets the transform
origin to its centre. A path member draws one outline, so a shape with several outlines gets joined by stray lines.
And a skin is CSS only, so an SVG's gradients have nowhere to live.

## 2. Decisions to record (H0, ADR-180)

- **A rigged artwork is an ordinary stage module.** Each part is a cast member, named for what moves (`flipperLeft`,
  not `path12`); its outline is a path member's cubics in frame px, filled and stroked by its skin. There is no
  artwork format beside the stage module.
- **`motion:import-svg <file> --name <piece>`** writes `apps/pieces/src/<piece>.ts`. Every drawable shape (`path`,
  `rect`, `circle`, `ellipse`, `polygon`, `polyline`, `line`) becomes a path member, its transforms flattened into
  frame px and its arcs, lines and quadratics turned into cubics. The SVG's groups become `group` members, named from
  the element's `id` or label, otherwise `part1`, `part2` in document order. Fill, stroke and opacity go into the
  skin by `[data-path="<name>"]`; gradients go into the skin's `defs`. The frame is the SVG's `viewBox`. What it cannot
  carry (text, images, filters, masks, clip paths) it lists by element, never drops in silence.
- **A path member draws every outline it is given.** Where a cubic does not start where the last one ended, a new
  outline starts, so a shape with a hole or several pieces draws as the SVG did.
- **A skin may carry SVG `defs`:** `skins.dom.defs`, markup of paint servers (gradients, patterns) the stage mounts
  once inside its root, so `fill: url(#id)` in the skin reaches them.
- **A part turns about its pivot.** A member may declare `pivot: { x, y }`, a point in frame px, usually its joint.
  The stage sets the member's transform origin there from its measured box, on mount and on every re-measure. A pose's
  `anchor`, the named side a squash keeps still, wins on the frames that give one. Without either, an HTML member
  keeps its skin's origin and an SVG member its centre, as today.
- **A part hangs from its parent by grouping.** A body's group holds the head, so moving the body carries the head,
  and each member's value is relative to its group, as today. A chain from `@gerak/rig` drives the same members: its
  solved angles become each part's `rotation`.
- **`motion:compare <page> --reference <svg>`** renders the piece at `--at` ms (default 0) and the reference SVG at the
  frame's size, writes the two side by side and a difference image, and prints the whole frame's mean difference out
  of 255 and, per cast member, the mean difference inside its box, worst first. It checks that importing and rigging
  kept the drawing; it judges nothing else.
- **References live in `apps/pieces/references/`,** each with its source and licence in that folder's README. Only
  artwork whose licence allows changing and keeping it goes there.

## 3. Slices

### H1. Outlines, defs and pivots on the stage

- **Invariant:** a path member with two separate outlines draws two; `skins.dom.defs` gradients fill members; a
  member with `pivot` turns about it, a pose `anchor` overrides it on that frame, and a resize keeps it right.
- **Owner:** `packages/dom/src/render.ts` (`pathData`, no inline centre over a pivot), `packages/dom/src/stage.ts`
  (defs, the origin from the measured box), `packages/stage/src/cast.ts` and `module.ts` (`pivot`, `defs`).
- **Test:** a two-outline path's data has two `M`; a gradient id in `defs` resolves inside the stage's root; an SVG
  path member and an HTML member, each with an off-centre pivot, rotated 90: the pivot stays where it rests.

### H2. `motion:import-svg`

- **Invariant:** as decided above; the imported module passes `readStageModule` and the scene review; every element it
  cannot carry is listed.
- **Owner:** `packages/tools/src/scene/import-svg.ts` and its bin.
- **Test:** fixtures with a transformed group, an arc, a rect, a gradient fill and a `text` element: the shapes come
  through in frame px within half a pixel, the gradient in `defs`, the text in the list.

### H3. `motion:compare`

- **Invariant:** as decided above; a piece compared with the SVG it was imported from scores near 0; a part drawn in
  the wrong colour is first in the list.
- **Owner:** `packages/tools/src/page/compare.ts` and its bin, beside `frames.ts`, reusing its PNG reader.
- **Test:** a fixture piece and SVG that differ in one member's box: that member is first and the others are near 0.

### H4. Guide

- A section of `docs/guide/agent-motion.md`, "Rigging artwork": import, then name the parts by what moves, regroup by
  what carries what, set each joint's `pivot`, check with `motion:compare`, then animate. The reference gains `pivot`,
  `defs` and both commands by their doc comments.

### H5. Proof

- **Measure, alone, fresh:** an Opus worker at medium effort rigs `apps/pieces/references/penguin.svg`, a public-domain
  mascot of 21 unnamed paths with radial gradients, as the stage module `penguin`, and makes it waddle and wave a
  flipper. It passes when the parts are named for what moves, each jointed part has a pivot, `motion:compare` at rest
  stays near 0, and the wave turns about the shoulder. Tokens, tool calls and the compare scores are recorded.
- **Cold review:** a Sonnet agent reviews the diff, imports a second SVG of its choosing and runs both commands.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | H0, H1 | the decisions, and the stage, render and cast changes the rest build on |
| 2 | Sonnet, medium | H2 | tools, the import |
| 2 | Sonnet, medium | H3 | tools, the comparison; another file |
| 3 | Conductor | H4 | what the measure reads |
| 3 | Opus, medium, fresh | H5 measure | |
| 3 | Sonnet, medium | H5 cold review | |

One pull request, after wave 3, with the roadmap's reorder and the motion-atlas notes already on its branch.

## 5. Risks

- **Two owners of an origin:** `pivot` and a pose's `anchor` both set it. The rule is fixed above, a pose's `anchor`
  wins on its frames, and the test holds it.
- **SVG is wide:** CSS classes in a `<style>` element, `use` references and nested `svg` elements are common in
  exported files. The import resolves `use` and inline styles and lists what it cannot carry; it never guesses.
- **A path member's box is its outline's bounds:** a stroke wider than the outline draws past it, so a part's measured
  box can be a few px smaller than what shows. `motion:compare` scores inside the box, so it can miss a stroke's edge.

## 6. Done when

The measure passes, its tokens and scores are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says
so.
