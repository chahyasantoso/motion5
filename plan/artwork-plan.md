# Artwork plan: rigging vector artwork

**Status:** Built, 2026-11-13; approved by the owner the same day.
**Base:** `main` at `8b157254`, the merge of pull request 589.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `plan/roadmap.md` section 5 (stage 6), `docs/ADR-174` to
`docs/ADR-179`, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**An SVG drawn by someone else becomes a stage module in named parts that turn about their joints, so an agent can
rig it and animate it.**

The flow: a person drops an SVG into `apps/pieces/references/` and says what it should do. The agent imports it with
one command, which turns every shape into a path member of a new stage module. The agent then rigs it: it names
the parts by what moves, sets a pivot at each joint, and builds a chain for what carries what (body, neck, head).
Then it animates the chain's joints and the free parts with moves. The import is mechanical; deciding the parts, the
joints and the chain is the agent's.

Rebuilding artwork from a raster picture is out of this plan. A Three.js model belongs with 3D, roadmap stage 8. Driving the rig from live inputs, such as an avatar's mouth
and blinks from tracking, is the next small plan, roadmap stage 7; this plan's rig is its base.

Today three things stop it. A part cannot turn about its joint: for an SVG member the renderer sets the transform
origin to its centre. A path member draws one outline, so a shape with several outlines gets joined by stray lines.
And a skin is CSS only, so an SVG's gradients have nowhere to live.

## 2. Decisions to record (H0, ADR-180)

- **A rigged artwork is an ordinary stage module.** Each part is a cast member, named for what moves (`flipperLeft`,
  not `path12`); its outline is a path member's cubics in frame px, filled and stroked by its skin. There is no
  artwork format beside the stage module.
- **`motion:import-svg <file> --name <piece>`** writes `apps/pieces/src/<piece>.ts`. Every drawable shape (`path`,
  `rect`, `circle`, `ellipse`, `polygon`, `polyline`, `line`) becomes a path member, its transforms flattened into
  frame px (a stroke's width scaled with them) and its arcs, lines and quadratics turned into cubics. Every part is a
  top-level member, named from the element's `id` or label, otherwise `part1`, `part2` in document order, and each
  name is written so one find-and-replace of `"part7"` renames it everywhere. Fill, stroke and opacity go into the
  skin by `[data-path="<name>"]`, with the SVG's paint order as each part's `z-index`; gradients go into the skin's
  `defs`. The frame is the SVG's `viewBox`, whatever its `width` and `height` say. What it cannot carry (text, images,
  filters, masks, clip paths) it lists by element, never drops in silence.
- **A path member draws every outline it is given.** Where a cubic does not start where the last one ended, a new
  outline starts, so a shape with a hole or several pieces draws as the SVG did.
- **A skin may carry SVG `defs`:** `skins.dom.defs`, markup of paint servers (gradients, patterns) the stage mounts
  once inside its root, so `fill: url(#id)` in the skin reaches them.
- **A part turns about its pivot.** A member may declare `pivot: { x, y }`, a point in frame px, usually its joint.
  The stage sets the member's transform origin there from its measured box, on mount and on every re-measure. A pose's
  `anchor`, the named side a squash keeps still, wins on the frames that give one. Without either, an HTML member
  keeps its skin's origin and an SVG member its centre, as today.
- **Paint order is a value.** `layer` is a field of a value, a number written as `z-index`, that replaces rather than
  adds and may step, so a scene puts a part behind another while it moves, such as a leg crossing behind in a walk.
  Without it a part keeps its skin's order.
- **Parts stay flat; a chain carries them.** Grouping changes paint order, since a transformed group paints as one
  layer, so a rigged piece keeps every part at the top level in the SVG's paint order. What carries what is a chain
  from `@gerak/rig`: `chainFromRest(chain, rest, options)` answers, for each bone, the pose that moves its part from
  where it was drawn, `{ x, y, rotation }` of its start joint against the rest chain's, so a part whose `pivot` is that
  joint follows the bone. `chainPoses` stays for elements laid out at the chain's base. A `group` is only for parts
  that move as one rigid piece and sit next to each other in paint order, such as an eye's white and pupil.
- **The review holds a skin to its cast:** a `[data-cast]` or `[data-path]` selector naming no member is a finding, so
  a rename that missed the skin shows.
- **`motion:compare <page> --reference <svg>`** renders the piece at `--at` ms (default 0) and the reference SVG from its
  `viewBox` at the frame's size, writes the two side by side and a difference image, and prints the whole frame's mean difference out
  of 255 and, per cast member, the mean difference inside its box, worst first. It checks that importing and rigging
  kept the drawing; it judges nothing else.
- **References live in `apps/pieces/references/`,** each with its source and licence in that folder's README. Only
  artwork whose licence allows changing and keeping it goes there.

## 3. Slices

### H1. Outlines, defs and pivots on the stage

- **Invariant:** a path member with two separate outlines draws two; `skins.dom.defs` gradients fill members; a
  member with `pivot` turns about it, a pose `anchor` overrides it on that frame, and a resize keeps it right; a
  value's `layer` is written as `z-index` and cleared when a later value leaves it out.
- **Owner:** `packages/dom/src/render.ts` (`pathData`, `layer`), `packages/dom/src/stage.ts` (defs, the origin from
  the measured box), `packages/stage/src/cast.ts` and `module.ts` (`pivot`, `defs`), `VALUE_FIELDS` in
  `packages/moves/src/pose.ts` (`layer`).
- **Test:** a two-outline path's data has two `M`; a gradient id in `defs` resolves inside the stage's root; an SVG
  path member and an HTML member, each with an off-centre pivot, rotated 90: the pivot stays where it rests.

### H1b. A chain from rest

- **Invariant:** with the chain at its rest angles, `chainFromRest` answers zero poses; turning one bone moves its
  part's pivot exactly onto the solved joint, and every bone after it follows.
- **Owner:** `packages/rig/src/chain.ts`, beside `chainPoses`.
- **Test:** a three-bone chain drawn at an angle: rest gives `{}` per bone; a 30-degree shoulder turn puts the elbow
  and wrist joints where `fk` says.

### H2. `motion:import-svg`

- **Invariant:** as decided above; the imported module passes `readStageModule` and the scene review; every element it
  cannot carry is listed.
- **Owner:** `packages/tools/src/scene/import-svg.ts` and its bin.
- **Test:** fixtures with a scaled and rotated group, an arc, a rect, a gradient fill, a stroke under a scale and a
  `text` element: the shapes come through in frame px within half a pixel, the stroke width scaled, the paint order as
  `z-index`, the gradient in `defs`, the text in the list. The review finds a skin rule naming no member.

### H3. `motion:compare`

- **Invariant:** as decided above; a piece compared with the SVG it was imported from scores near 0; a part drawn in
  the wrong colour is first in the list.
- **Owner:** `packages/tools/src/page/compare.ts` and its bin, beside `frames.ts`, reusing its PNG reader.
- **Test:** a fixture piece and SVG that differ in one member's box: that member is first and the others are near 0.

### H4. Guide

- A section of `docs/guide/agent-motion.md`, "Rigging artwork": import, name the parts by what moves, set each
  joint's `pivot`, build the chain of what carries what and drive it with `chainFromRest`, check with
  `motion:compare`, then animate. Keep parts flat; group only a rigid piece. The reference gains `pivot`, `defs`,
  `chainFromRest` and both commands by their doc comments.

### H5. Proof

- **Measure, alone, fresh:** an Opus worker at medium effort rigs `apps/pieces/references/penguin.svg`, a public-domain
  mascot of 21 unnamed paths with radial gradients, as the stage module `penguin`, and makes it waddle and wave a
  flipper. It passes when the parts are named for what moves, each jointed part has a pivot, the wave turns about
  the shoulder, and `motion:compare` at rest gives a whole-frame mean under 2 out of 255 and no part over 15 (a faithful import of the penguin scores 10.5 at worst, a missing 1 px line about 30). Tokens,
  tool calls and the compare scores are recorded.
- **Cold review:** a Sonnet agent reviews the diff, writes a second SVG by hand with groups, transforms and a gradient,
  imports it and runs both commands. It downloads nothing.

## 3a. Results

| Measure | Worker | Tokens | Tool calls | Parts named, with pivots | Wave about the shoulder | Compare at rest |
| --- | --- | --- | --- | --- | --- | --- |
| `penguin` | Opus, medium | 180 k | 60 | 21 of 21 | yes: the flipper's x, y stay fixed while its rotation swings 150 to 172 and back twice | mean 0.97, worst part 10.55 |

`penguin` passes: every part is named for what moves and has a pivot, the flippers ride `chainThrough` chains posed by
`chainFromRest`, it waddles and waves twice, and at rest it compares exactly as the plain import does. It wrote two
moves of its own, `waddle` and `hand-wave`, and no keyframes.

What it found, now fixed: the import's frame was the drawing's edges, so a flipper turning outward was cut by the
frame for a few frames; `motion:import-svg` and `motion:compare` now take `--margin`. A pose of zeros wrote an
identity transform that redrew a part a little differently; a field at rest now writes nothing. The guide's paths
ran from `apps/pieces` instead of the repository root, and `ChainPose`'s fields were unnamed. The piece itself was
made before `--margin` and keeps those few clipped frames.

The cold review (Sonnet, 121 k) gave ten findings. Fixed: `motion:compare` looked only one way, so a thin part
missing from the piece scored 0; it now looks both ways, which moved the per-part bar from 8 to 15. An outline that
returns to its start now closes, ends that meet but for rounding join, the import says when a translucent group's
opacity goes on each part, and the skin check reads unquoted names, skips comments and finds a stroke rule on a
member with no path. `layer` is last-wins, as the guide says. Left: a 1 px horizontal line lands half a pixel off; a
dropped `use` of a symbol is listed but scores in no member; defs in a shadow root are checked in Chromium only; no
test yet holds a pose's `anchor` over a `pivot`.

While fixing them, `motion:promote`'s export check turned out to hold a backspace where a word boundary was meant,
since part four; it now refuses a class or default export, and a test holds it.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | H0, H1 | the decisions, and the stage, render and cast changes the rest build on |
| 2 | Sonnet, medium | H1b | the rig only |
| 2 | Sonnet, medium | H2 | tools, the import |
| 2 | Sonnet, medium | H3 | tools, the comparison; another file |
| 3 | Conductor | H4 | what the measure reads |
| 3 | Opus, medium, fresh | H5 measure | |
| 3 | Sonnet, medium | H5 cold review | |

One pull request, after wave 3, with the roadmap's reorder and the motion-atlas notes already on its branch.

## 5. Risks

- **Paint order against carrying:** flat parts keep the SVG's order, and a chain carries them; `layer` changes the
  order where a motion needs it, and only among siblings, since a group paints as one layer.
- **Two owners of an origin:** `pivot` and a pose's `anchor` both set it. The rule is fixed above, a pose's `anchor`
  wins on its frames, and the test holds it.
- **SVG is wide:** CSS classes in a `<style>` element, `use` references and nested `svg` elements are common in
  exported files. The import resolves `use` and inline styles and lists what it cannot carry; it never guesses.
- **A path member's box is its outline's bounds:** a stroke wider than the outline draws past it, so a part's measured
  box can be a few px smaller than what shows. `motion:compare` scores inside the box, so it can miss a stroke's edge.

## 6. Done when

The measure passes, its tokens and scores are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says
so.
