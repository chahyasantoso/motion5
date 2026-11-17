# @gerak/stage

Read this page whole before making a piece. A scene is a function from time and the events so far to one value per
target; you write it in code, and the tools play and check it. `import { actor, group, story } from "@gerak/stage"`.
Look export names up below ([reference/index.md](./reference/index.md)), primitives in [@gerak/core](../../core/docs/core.md),
and brief-specific pages in [README.md](./README.md), never in package source. `<pieces>` is the folder `gerak.pieces`
in your package.json names.

<!-- generated:reference:start -->
- [index](./reference/index.md) (48): `actor`, `castNames`, `presentAt`, `group`, `letters`, `many`, `pathOf`, `words`, `Actor`, `ActorPath`, `ActorText`, `Behaviour`, `Cast`, `CastName`, `Group`, `Many`, `Member`, `Pivot`, `Stretch`, `blendShapes`, `matchOutlines`, `piecesOf`, `DEFAULT_FRAME`, `frame`, `story`, `Frame`, `Story`, `cssVariables`, `isTokenName`, `carried`, `carry`, `CarriedOptions`, `CarrySize`, `NO_LAYOUTS`, `NO_REST`, `restOf`, `Box`, `Layouts`, `Rest`, `readStageModule`, `Skins`, `StageModule`, `describeLoop`, `drawInPasses`, `restOfBounds`, `thickened`, `PathAnswer`, `StrokeLoop`
<!-- generated:reference:end -->

## The loop

1. **Find the idea before any code.** Name the obvious answer to the brief in one line, then write three other ideas,
   one line each, that differ from it and from each other in what moves and how (what the thing is made of, where it
   comes from, what it does while it holds), not in colour or type. Pick the one that serves the brief best and is not
   the obvious one.
2. **Write the chosen idea in three lines** and keep them, with the obvious answer and the two dropped, for your
   report: what moves, and in what order; its character (heavy or light, quick or slow, stiff or loose, playful or
   calm); the one moment the eye must not miss. Every later choice answers to those lines.
3. `npx gerak new <name> [--in <brief>]` writes `<pieces>/<brief>/src/<name>.ts`, one stage module (the brief is the
   name unless `--in` names another). Open it as `stage.html?piece=<name>`. Name who is on stage in `cast`, the beats in
   `beats`, and the look in `skins.dom.css`. Lay the skin out as the final frame.
4. **Learn the primitives once.** With `@gerak/core` alone, use the primitives in [core.md](../../core/docs/core.md)
   (`span`, `chain`, `lanes`, `loop`, `sequence`, `mix`, `mixPose`, `keyframes`, `ease`, `wave`, `arch`, `attack`,
   `decay`, `taper`, `ballistic`, `along`, `toCubics`). When `@gerak/moves` and `@gerak/moves-tools` are installed, `npx gerak moves --anatomy`
   prints the fields, parts and qualities (`heavy`, `light`, `quick`, `calm`, `playful`, `stiff`, `loose`).
5. **Plan each member's motion from your three lines.** Use [What a quality asks](#what-a-quality-asks) to choose spans,
   eases and amplitudes. When `@gerak/moves` and `@gerak/moves-tools` are installed, write `export const design = { ball: { y: { fall: "heavy" } } };`
   so `gerak review` checks each field against its quality.
6. **Build the motion.** With `@gerak/core` alone, write each member's pose directly in `scene` (or shared `(t) => Pose2d`
   helpers in your brief) from `@gerak/core` and arrange time with `span`, `chain`, `lanes`, `loop` and `sequence`. When
   `@gerak/moves` and `@gerak/moves-tools` are installed, query `npx gerak moves --design <pieces>/<brief>/src/<name>.ts --target <member> --in <brief>`
   (`--move`, `--far`, `--renderer`, `gerak moves <id>`), then use, adjust, combine, drive with parts, or write a move (`gerak new-move`).
7. `npx gerak review <pieces>/<brief>/src/<name>.ts` checks the cast against the scene with no browser (and checks
   `design` when `@gerak/moves-tools` is installed). `npx gerak review "stage.html?piece=<name>" --watch '[data-cast="<member>"]' --to <ms>` adds a `sheet` of
   frames picked where the motion is fast; `--action` says what a person does, `--full` adds the moves with their eases.
8. Fix what it flags and what looks wrong on the sheet; review again. Stop when the findings are empty and the sheet
   shows your three lines. Run `npx tsc --noEmit` once at the end where the project has a `tsconfig.json`.

The other scene files in `<pieces>/*/src` are other people's pieces: do not open them, or yours comes out as a copy.
Values can be right while the picture is wrong, so read the sheet before calling anything finished.

## The stage module

A piece is one file that exports `beats`, `cast`, `skins` and `scene`, optionally `frame` (default 1280 by 720) and
`rest`; a piece that changes place adds `layouts` and `layout`.

```ts
import type { Events, Time } from "@gerak/core";
import { actor, group, letters, many, story, type Rest } from "@gerak/stage";

export const beats = story(3000, { enter: [0, 600], hold: [600, 2400], leave: [2400, 3000] });
export const cast = {
  card: group({ dot: actor(), word: letters("HELLO", { on: [["enter", "leave"]] }), dust: many(6) }),
};
export const skins = { dom: { css: `[data-cast="dot"] { width: 36px; height: 36px; background: #f53 }` } };
export const scene = (time: Time, events: Events, rest: Rest) => ({ card: {}, dot: {}, word: [], dust: [] });
```

- **Cast.** A member is a name, unique across the cast; an item is `dust.3`. `actor()` takes one value, `many(n)` one
  per item, `group({...})` one value that moves its members; a member's value is relative to its group. A `many`
  moves item by item: to move a whole row, wrap it in a `group`. `letters(text)` and `words(text)` make a `many` of text.
- **Readout.** `actor({ text: (time) => … })` is a readout written each frame (a timecode, a counter), not a value and
  never eased. Only a top-level `actor` takes one: not an item of `many`, `letters` or `words`, and not a `group`'s
  list. For several live numbers (bar labels, legend totals) make one named `actor` per number.
- **Stroke.** `actor({ path: toCubics([...anchors]) })` is a stroke that `drawn` and `drawnFrom` draw on; skin it
  by `[data-path="<name>"]` (`stroke`, `stroke-width`). Each anchor is `{ id, x, y, inX, inY, outX, outY }`, handles
  relative to the point; a closed outline repeats its first anchor last. Points are frame px from the frame's top-left.
  To follow the layout pass `path: (rest) => toCubics([...])` reading other members with `restOf`, other strokes too,
  which are drawn first; it never reads its own box, and two paths that read each other are a loop (neither is drawn).
- **Showing.** `on: ["land", ["rise", "fall"]]` shows a member only while one of its stretches runs, a beat or a pair
  from the first's start to the second's end (a member without `on` takes its group's). `watch: true` sends its hover
  and click to the scene's events under its name. `still: true` says the scene never moves it; on a group it says
  nothing of its members. `ongoing: true` says it moves through the story's end on purpose, such as falling snow;
  members and items take it from their group or list.
- **Story.** `beats.enter.of(time)` is the beat's own time; beats may overlap, and the story is the piece's length.
- **Skin.** `skins.dom.css` styles members by `[data-cast="<name>"]`, an item by `[data-cast="dust.3"]`, all of a
  list's by `[data-cast^="dust."]`, scoped to the stage. A member it leaves out is a grey box with its name or text.
  The frame and every group or `many` lay members out in a centred, wrapping row (gaps 24 and 8 px), each
  `position: relative`; to place one yourself give it `position: absolute` with `left` and `top` from its parent's
  top-left, and pin its container too (`position: absolute; inset: 0`). Never `position: static` or `display: contents`.
- **Colour and shadow.** The fields `hue`, `lightness` and `tint` move a colour from the one the skin gives, and
  `shadowX`, `shadowY`, `shadowBlur` a drop shadow; the skin places them:
  `background: oklch(from color-mix(in oklch, #f53, var(--gerak-tint-to, white) calc(var(--gerak-tint, 0) * 100%)) calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)))`,
  and `--gerak-shadow` is the shadow's colour. Never animate a colour through a `custom` number.
- **Rest.** `restOf(rest, "dot")` is a member's measured box after layout, `{ x, y, width, height }` from its centre in
  the frame; a zero box under a tool with no browser. `R`, or a click on the background, replays.

## What a quality asks

Reasoning to choose numbers by. Guess from your three lines, read the sheet, and move the number the way the quality asks.

- Heavy: less squash, lower and fewer rebounds, a slower start, a longer settle; what it lands on answers.
- Light: more height, a faster start, more time near the top, a short settle.
- Quick, sharp: short spans, most travel early, little overshoot, small stagger. Calm, gentle: longer spans, easing at
  both ends, small amounts, no rebound.
- Playful: a wind-up before, an overshoot after, a wider stagger, a second thing that answers the first.
- Stiff, mechanical: even speed, no squash, no overshoot, parts that stop together. Loose, soft: parts that arrive at
  different times, a trailing part, an overshoot that rings.
- The moment to see: everything else holds still round it; it gets the largest contrast, and a hold after.

## A step's cost

A scene runs whole every frame, so a step reads the present, never all of the past.

- Ask what has passed, do not replay it: how much of a stream has passed is `tally`; where a body touched is the
  contact event's `point`, with `other` naming what it hit. A loop from 0 to the time, a `follow` summed in small
  steps, or a sample at an earlier time each frame costs more the longer the piece plays.
- `gerak review` times every step: it reports `cost grows with time` when the last fifth of the run costs over four
  times the first, and a step over `--budget` ms (default 8); review again before chasing the second.
- `npx gerak fps <page> --to 10000` plays the page on its real clock and prints frames a second per 500 ms and the
  worst frames split into scene, writes and rest. Headless Chrome has no vsync, so compare windows with each other only.
- `gerak frames <page> --at <ms> --crop x,y,width,height --zoom 4` captures one region scaled up; `gerak sample <file>.ts --watch <target>.<field> --from 0 --to 2000 --every 16` prints one value over time.

## Traps

- Never cast with `as` or assert with `!`: type a pose literal, `const carry: Pose2d = { x: 1 }`, and read a field a
  pose may lack as `pose.x ?? 0`.
- A squash widens a letter into its neighbour; a shape drawn after another passes in front of it unless `z-index`
  sends it behind; a shape the colour of what it crosses merges with it. Check those frames.
- Frames fall every 16 ms, so compare a page with `gerak sample` at multiples of 16.
- The page tools see elements, not pixels a `<canvas>` draws.
- Transforms apply as CSS `translate`, then `rotate`, then `scale`, about the `anchor` (default the centre). For a 2D
  camera, move one container holding the scene and counter-move its members for depth; a rotation turns about the
  container's centre, so offset `x`, `y` by the amount that turn moves the point you want to keep still.
- The stage draws inside a shadow root: put the surround colour on `:host { background: #000 }` in `skins.dom.css`. A
  stroke's `<svg>` keeps `overflow: visible` and the `viewBox` of its first `path`, so a `shape` morph may leave it.
- `gerak review` also judges a member while it is clear (`opacity: 0`) or hidden by `on`: a value it reads must stay
  continuous, so do not reset `scale` or a position between two beats while hidden, and read a shared value only inside
  the beats the member is shown in.
