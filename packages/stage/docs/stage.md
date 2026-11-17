# @gerak/stage

Read this page whole before making a piece. A scene is a function from time and the events so far to one value per
target; you write it in code, and the tools play and check it. `import { actor, group, story } from "@gerak/stage"`.
Look names up in the groups below, in [@gerak/core](../../core/docs/core.md), and in the other packages' docs, never in
package source. `<pieces>` is the folder `gerak.pieces` in your package.json names. Which page to read for which brief
is in [README.md](./README.md).

<!-- generated:reference:start -->
Groups: [index](#index) 48.

## index

- **`actor`** `(options?: Behaviour & { readonly text?: ActorText; readonly path?: ActorPath; …`: One thing on stage, saying `text` or drawing the stroke `path` when given one.
- **`castNames`** `(cast: Cast, beats?: readonly string[]): readonly CastName[]`: Every name the cast makes, in order, with presence taken from the nearest group that states it.
- **`presentAt`** `(on: readonly (readonly [string, string])[], spanOf: (beat: string) => { readon…`: Whether a member on these stretches shows at `ms`; a stretch reaching the story's end holds past it.
- **`group`** `(members: Cast, options?: Behaviour): Group`: Members moved together; their keys join the cast's, so each must be unique across it.
- **`letters`** `(text: string, options?: Behaviour): Many`: A word or line split into its letters, one text actor each, in order; a letter is a grapheme, so an accented letter or an emoji is one.
- **`many`** `(count: number, options?: Behaviour): Many (+1 overloads)`: `count` things, or one per entry of `list` made by `make`; the scene answers one value per item.
- **`pathOf`** `(path: ActorPath, rest: Rest): readonly Cubic2d[]`: A path's cubics where things `rest`: a fixed list as it is, a function's answer checked and frozen; throws when the function throws or answers no cubics.
- **`words`** `(text: string, options?: Behaviour): Many`: A line split into its words at spaces, one text actor each, in order.
- **`Actor`** `type Actor`: One thing on stage; the scene answers one value for it, and a renderer's skin decides what it looks like.
- **`ActorPath`** `type ActorPath`: A stroke as joined cubics in frame px from the frame's top-left, fixed or answered from where the other members rest; the stage places the member at the stroke's box.
- **`ActorText`** `type ActorText`: What an actor says: fixed text, or a readout the renderer writes from the time on each frame.
- **`Behaviour`** `type Behaviour`: What a member does beside being moved: when it is shown, whether its pointer events reach the scene.
- **`Cast`** `type Cast`: Who is on stage, by name; every key is unique across the whole cast, groups included.
- **`CastName`** `type CastName`: One name the cast makes: a member's key, or a key and an index for an item of `many`.
- **`Group`** `type Group`: Members moved together: the group's value applies to them, and each member's is relative to it.
- **`Many`** `type Many`: A list of things; the scene answers one value per item.
- **`Member`** `type Member`: A cast member: what the scene's motion depends on, and nothing of how it looks.
- **`Pivot`** `type Pivot`: A point in frame px from the frame's top-left.
- **`Stretch`** `type Stretch`: A stretch of the story: one beat, or a pair from the first beat's start to the second's end.
- **`blendShapes`** `(matched: readonly (readonly Cubic2d[])[], shape: number): readonly Cubic2d[]`: The cubics `shape` asks of matched outlines: 0 is the first, 1 the second, between them each control point is blended; clamped to the first and the last.
- **`matchOutlines`** `(outlines: readonly (readonly Cubic2d[])[]): { readonly matched: readonly (read…`: Outlines made to blend, the first being the path: the same pieces in the same order, each with as many cubics in every outline; or why they cannot.
- **`piecesOf`** `(cubics: readonly Cubic2d[]): readonly (readonly Cubic2d[])[]`: An outline split into its pieces: a cubic that does not start where the last ended starts another.
- **`DEFAULT_FRAME`** `const DEFAULT_FRAME: Frame`: The frame a module gets when it names none.
- **`frame`** `(size: Frame): Frame`: A stage `width` by `height` px.
- **`story`** `<const B extends string>(durationMs: number, beats: Readonly<Record<B, readonly…`: Beats by name, each `[fromMs, toMs]` inside a piece `durationMs` long; beats may overlap.
- **`Frame`** `type Frame`: The stage's size in px; a renderer fits it to its container.
- **`Story`** `type Story<B>`: A piece's beats as named spans, its length, and the beats' names in the order they were given.
- **`cssVariables`** `(tokens: Readonly<Record<string, string>>): string`: A `:host` rule setting each token as a custom property, in the tokens' order; empty for none.
- **`isTokenName`** `(name: string): boolean`: Whether `name` is a custom property name a token may have: `--` then letters, digits, `-` or `_`.
- **`carried`** `(options: CarriedOptions): Pose2d`: The pose of a member carried to the box `at` names after each event, over `ms` each, setting off from where it is drawn; with no clock it has arrived.
- **`carry`** `(own: Box, given: Box, target: Box, progress: number, size?: CarrySize): Pose2d`: The pose drawing a member resting at `own` on `from` at 0 and `to` at 1; `"clip"` only crops, never past `own`.
- **`CarriedOptions`** `type CarriedOptions`: What `carried` is given: where the member rests now, and where `at` says it belongs after the events.
- **`CarrySize`** `type CarrySize`: How a carried member takes a box's size: `"scale"` stretches it, `"keep"` leaves it, `"clip"` leaves it and hides all outside the box.
- **`NO_LAYOUTS`** `const NO_LAYOUTS: Readonly<Record<never, Readonly<Record<string, Box>>>>`: The layouts a module with none passes: no layout, no boxes.
- **`NO_REST`** `const NO_REST: Readonly<Record<string, Box>>`: The rest a tool with no renderer passes: no boxes.
- **`restOf`** `(rest: Rest, name: string): Box`: The box `name` rests in, or a zero box when nothing measured it, so a scene never throws on a tool's run.
- **`Box`** `type Box`: Where a member rests once laid out: its centre and size in px, in the frame's own space.
- **`Layouts`** `type Layouts<L>`: Each named layout's `Rest`, as a renderer measured every one.
- **`Rest`** `type Rest`: Each member's rest box by its cast name, as a renderer measured it after layout.
- **`readStageModule`** `(value: unknown): StageModule | { readonly reason: string; }`: A stage module read from what a file exports, or why it is not one; it never throws.
- **`Skins`** `type Skins`: How the cast looks on each renderer; a member a skin leaves out gets the renderer's default.
- **`StageModule`** `type StageModule<B, V, L>`: What a stage module exports: its story, its cast, their skins and a scene answering `V`.
- **`describeLoop`** `({ loop, behind }: StrokeLoop): string`: The loop said in one line: `paths "a" and "b" read each other`, and any stroke reading them.
- **`drawInPasses`** `(paths: readonly (readonly [string, ActorPath])[], rest: Rest, settle: (name: s…`: Draws strokes in passes over `rest` and the strokes drawn so far; a path reading an undrawn stroke waits, and `settle` answers a drawn one's box.
- **`restOfBounds`** `(bounds: Box): Box`: Where a stroke of these bounds rests: their centre and size, as a rest box is.
- **`thickened`** `(box: Box): Box`: A box never thinner than 1 on a side, so a straight line still shows: a side with no size opens to 1 about where it was.
- **`PathAnswer`** `type PathAnswer`: What a path answered in its pass: its cubics, or what it threw.
- **`StrokeLoop`** `type StrokeLoop`: The strokes no pass could draw: those reading each other in a loop, and those reading one of them.
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
