# Making motion as an agent

A **scene** is a function from time, and the events so far, to one value per target. You build it from **moves**:
named pieces of motion, each declared with what it is for. You write the scene in code; the repo plays it, renders it
and checks it. Look up any function or command in [the reference](./agent-reference.md) by searching it for the name,
not by reading package source. `<pieces>` is your pieces folder, the one `gerak.pieces` in your package.json names
(`apps/pieces` in this repository). Read a part below only when the brief needs it:

| The brief has | Read |
| --- | --- |
| Hover, press, click, scroll into view, or one target answering another's moment | [events](./agent-events.md) |
| Many bodies, collisions, a pile, things thrown and falling | [physics](./agent-physics.md) |
| An arm, a leg, a figure: bones that reach | [rigs](./agent-rigs.md) |
| Weight, life, character or polish: anticipation, arcs, follow-through, settle | [principles](./agent-principles.md) |
| Depth, turns about several axes, a moving camera: a Three.js scene | [3D](./agent-3d.md) |
| A motion with a name that no catalogued move gives | [writing a move](./agent-moves.md) |
| A value from where the layout puts a member; a route change, a card that opens, a list that reorders | [layout](./agent-layout.md) |
| A supplied drawing or SVG to animate, or a character to draw and rig | [artwork](./agent-artwork.md) |
| Numbers arriving while it plays: a microphone, a slider, a recorded session | [live inputs](./agent-inputs.md) |
| A person watching edits land as you save | [live editing](./live.md) |
| A page outside this repository, or a real site's own elements | [outside the stage](./agent-outside.md) |
| A piece in another brief's style, or turning your brief into a style | [styles](./agent-style.md) |
| A reel: several shots, a hook, a story and a call to action | [reels](./agent-reel.md) |

## The loop

1. **Find the idea before any code.** Name the obvious answer to the brief in one line: the piece most people would
   make. Then write three other ideas, one line each, that differ from it and from each other in what moves and how
   (what the thing is made of, where it comes from, what it does while it holds), not in colour or type. Pick the
   one that serves the brief best and is not the obvious one.
2. **Write the chosen idea in three lines,** and keep them, with the obvious answer and the two you dropped, for
   your report: what moves, and in what order; its character (heavy or light, quick or slow, stiff or loose, playful
   or calm); the one moment the eye must not miss. Every choice after this answers to those lines.
3. `npx gerak new <name> [--in <brief>]` writes `<pieces>/<brief>/src/<name>.ts` (the brief is the name
   unless `--in` names another), one stage module: a story of one beat, one actor at rest and an empty skin. Open it
   as `stage.html?piece=<name>`. Name who is on stage in `cast`, the beats in `beats`, and give each member the look
   the brief calls for in `skins.dom.css` (see [The stage module](#the-stage-module)). Name the look most people
   would give it, and choose another the brief supports as well. Lay the skin out as the final frame.
4. **Learn the primitives, once.** `npx gerak moves --anatomy` is one card: every **field** a target can
   change (place, turn, size, look, colour, reveal, order), with its meaning, unit and which renderers draw it; every
   **part** by kind (ease, envelope, oscillation, path, blend, coupling, signal, ...) with its call and a worked
   sample (`taper(p, 2): 1, 0.25, 0`); and the **qualities** (`heavy`, `light`, `quick`, `calm`, `playful`,
   `stiff`, `loose`) as ranges of a motion's shape.
5. **Write the design before choosing any move.** Turn your three lines into the piece's spec, in the module:
   `export const design = { ball: { y: { fall: "heavy" }, scaleY: { land: "loose" } } };`, each member's fields
   with the quality their motion should have, by beat where its character changes. A design names actors and
   groups; a list member (`letters`, `words`, `many`) holds its intent for every item, and `"word.3"` names one item.
   Name the beat in which the field actually moves, since the review measures it there. In your report, write under each
   line the fields and the parts by kind it needs: "the fall: `y` heavy, a `ballistic` path; the landing: `scaleY`
   loose, an `envelope` times an `oscillation`".
6. **Ask the catalog with the design.** `npx gerak moves --design <pieces>/<brief>/src/<name>.ts --target
   ball --in <brief>` scores every move that passes the gate against that member's design, says per field what
   matched and at which options, and gives the import. `--move y:heavy --uses envelope` asks the same by hand;
   `--far <the obvious move>` finds ideas unlike it; `--renderer three` keeps moves a 3D page draws. Read a move in
   full (`gerak moves <id>`) before using it.
7. **Decide each line, in this order:** use a move as it is; use it at the options its row names; combine moves in
   the scene, one per field (when no move does it all, the answer names the move for each field); drive the field in
   the scene with parts (a `mix` on an ease, an envelope), when no move has it and only this piece needs it, as a
   colour turning or a shadow following a height often is; or write a move from the parts you named ([writing a
   move](./agent-moves.md)). Then compose (see [Composing](#composing)) and
   choose every number from your three lines. In your report, give each line's choice and why.
8. `npx gerak review <pieces>/<brief>/src/<name>.ts` checks the cast against the scene with no browser,
   and measures every field your design names: "`ball.y` (fall): peak 0.30, heavy wants 0.60 to 1" means the fall
   does not yet have the quality you wrote. `npx gerak review "stage.html?piece=<name>" --watch
   '[data-cast="<member>"]' --to <ms>`, with `--action` for what a person does, adds a `sheet` of frames picked where
   the motion is fast; on a page, `--full` adds the moves with their eases.
9. Fix what it flags, the design's findings first, and what looks wrong on the sheet; review again. Stop when the
   findings are empty and the sheet shows the three lines you wrote. Run `npx tsc --noEmit` once at the end where the project has a `tsconfig.json`.

The other scene files in `<pieces>/*/src` are other people's pieces. Do not open them: a piece begun from one
comes out as its copy. Use the other tools only to dig into what a review showed. Values can be right while the
picture is wrong, so read the sheet before calling anything finished.

## The stage module

A piece is one file that exports `beats`, `cast`, `skins` and `scene`, and optionally `frame` (default 1280 by 720)
and `rest`; a piece that changes place adds `layouts` and `layout` ([layout](./agent-layout.md)).

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

- **Cast.** A member is a name. `actor()` takes one value, `many(n)` a list with one value per item, `group({...})`
  one value that moves its members; a member's own value is relative to its group. A `many` moves only item by item:
  to move a whole row of letters, wrap it in a `group`. `letters(text)` and `words(text)` make a `many` of text.
- **Readout.** `actor({ text: (time) => … })` is a readout written each frame, for a timecode or a counter; it is
  not a value and does not ease. Only an `actor` takes one: the items of `letters` and `words` keep their text.
- **Stroke.** `actor({ path: toCubics([...anchors]) })` is a stroke that `drawn`, `trace` and the like draw on; skin
  it by `[data-path="<name>"]` (`stroke`, `stroke-width`). `toCubics` comes from `@gerak/moves`; each anchor is
  `{ id, x, y, inX, inY, outX, outY }`, its handles relative to the point, and a closed outline repeats its first
  anchor last. Its points are frame px from the frame's top-left, in any
  group, and the stage places the member at the path's box. To follow the layout, pass `path: (rest) => toCubics([...])`
  reading other members by name with `restOf`, other strokes too, which are drawn first; it is drawn again on each measure,
  and never reads its own box. Two paths that read each other are a loop: neither is drawn, and both are reported.
- **Names** are the keys, unique across the cast; an item is `dust.3`. `on: ["land", ["rise", "fall"]]` shows a
  member only while one of its stretches runs, a beat or a pair from the first's start to the second's end, so
  `["rise", "fall"]` is two beats and `[["rise", "fall"]]` one stretch (a member without `on` takes its group's); `watch: true` sends its hover and click to the scene's events under its name;
  `still: true` says the scene never moves that member; on a group it says nothing of the group's members.
  `ongoing: true` says it moves through the story's end on purpose, such as falling snow, so the review does not ask
  it to rest; a group's members and a list's items take it from the group or list.
- **Story.** `beats.enter.of(time)` is the beat's own time; beats may overlap, and the story is the piece's length.
- **Skin.** `skins.dom.css` styles members by `[data-cast="<name>"]`, an item by `[data-cast="dust.3"]` or all of a
  list's by `[data-cast^="dust."]`, scoped to the stage. A member it leaves out is a grey box with its name, or its
  text. By default the frame and every group or `many` lay their members out in a centred, wrapping row (gaps 24 and
  8 px), each `position: relative`. To place one yourself, give it `position: absolute` with `left` and `top` from
  its parent's top-left. Never `position: static` or `display: contents`: its rest box would be wrong.
- **Colour and shadow.** The fields `hue`, `lightness` and `tint` move a member's colour from the one its skin gives
  it, and `shadowX`, `shadowY` and `shadowBlur` its drop shadow; the skin places them:
  `background: oklch(from color-mix(in oklch, #f53, var(--gerak-tint-to, white) calc(var(--gerak-tint, 0) * 100%))
  calc(l + var(--gerak-lightness, 0)) c calc(h + var(--gerak-hue, 0)))`, and `--gerak-shadow` the shadow's colour
  (dark grey when absent). Never animate a colour through a `custom` number.
- **Rest.** `restOf(rest, "dot")` is the measured box of a member after layout, `{ x, y, width, height }` from its
  centre in the frame; it is a zero box under a tool with no browser.
- `R`, or a click on the background, replays.

## Composing

Each line shows one function on a plain target. A bare name such as `distance` or `fromMs` stands where your own
number goes.

```ts
// Every helper below, and every built-in move, comes from this package; a move `gerak moves` lists from
// `<pieces>/<brief>/src/moves` is imported from `./moves/<id>`.
import { combine, ease, lane, lanes, mix, repeated, reversed, span, type Time } from "@gerak/core";
import { rise } from "@gerak/moves";

const enter = span(fromMs, toMs); // a stretch in ms, placed by the clock of the time it is given
rise({ distance }, enter.of(time)); // a move placed on it
rise({ distance }, reversed(leave.of(time))); // the same move as an exit
overshoot({ amount }, enter.of(time), (t) => slide({ distance }, t)); // past its end, then settling
anticipate({ amount }, enter.of(time), (t) => slide({ distance }, t)); // the other way first
nod({ distance }, repeated(beat.of(time), count)); // several times in one span
combine([rise({ distance }, enter.of(time)), fade({}, enter.of(time))]); // two moves on one target
lane(enter.of(time), i, lanes([1, 1, 1], stagger)); // target i's own time, each starting after the last
enter.at(drop.moments(options).landing); // the ms a move's moment falls on, to time something else to it
mix(from, to, turn.of(time, ease.sineInOut).progress); // a value of your own, eased
```

- `scene` returns one object with a key per cast member. Add a key per member and a span per move, in the order of
  your first line. Every number of motion lives in the scene, none in the skin.
- `reversed(time)` and `repeated(time, count)` reshape a time and wrap any move. `anticipate` and `overshoot` take
  the move they reshape as a function of time, and nest: an `anticipate` inside an `overshoot` winds up, goes,
  passes and settles.
- A move holds still outside its span, on the side its role says: an `enter` waits at its start and stays at rest
  after, an `emphasis` rests on both sides. So one target that arrives, is stressed and leaves is a `combine` of
  three moves, each on its own span.
- `sequence(time, [[span, (t) => answer], ...])` answers the last phase that has started, in its own time, and holds
  an ended one until the next begins. Use it for phases on one target that replace one another rather than add, and
  for a longer piece: each beat is a function of time written from 0, and `sequence` places the beats.
- A pose is `{ x, y, rotation, scale, scaleX, scaleY, opacity, anchor }`, all optional; `anchor` is the point that
  stays still while it turns or scales, the centre when absent. A plain pose built with `mix`, `keyframes` or an
  `ease` goes into `combine` beside a move.

## What a quality asks

Reasoning to choose numbers by, not numbers. Guess from your three lines, read the sheet, and move the number the way
the quality asks.

| The brief wants | Ask of the numbers |
| --- | --- |
| Heavy | less squash, lower and fewer rebounds, a slower start, a longer settle; what it lands on answers |
| Light | more height, a faster start, more time near the top, a short settle |
| Quick, sharp | short spans, most of the travel early, little overshoot, small stagger |
| Calm, gentle | longer spans, easing at both ends, small amounts, no rebound |
| Playful | a wind-up before, an overshoot after, a wider stagger, a second thing that answers the first |
| Stiff, mechanical | even speed, no squash, no overshoot, parts that stop together |
| Loose, soft | parts that arrive at different times, a trailing part, an overshoot that rings |
| The moment to see | everything else holds still round it; it gets the largest contrast, and a hold after |

Two pieces with the same moves and the same numbers have the same character, so a different brief changes one of them.

## A step's cost

A scene runs whole on every frame, about sixty times a second, and a 60 fps frame has 16.7 ms for everything. So a
step reads the present, never all of the past.

- **Ask what has passed, do not replay it.** How much of a stream has passed is `tally`; where a body touched is
  the contact event's own `point`, with `other` naming what it hit, so never seek a simulation back
  to learn where something was. A loop from 0 to the time, a `follow` summed in small steps, or a sample at an
  earlier time on every frame makes a step that costs more the longer the piece plays.
- **`gerak review` times every step.** It reports `cost grows with time: a step reads all of the past` when the
  last fifth of the run costs over four times the first, and a step over `--budget` ms (default 8). Fix the first
  by reading the present; the second can be a busy machine, so review again before chasing it.
- **`gerak fps` measures a running page.** `npx gerak fps <page> --to 10000` plays the page on its real
  clock and prints frames a second per 500 ms window and the worst frames, split into the scene, the writes and the
  rest (drawing and the browser). It names the renderer: headless Chrome draws on the GPU where there is one but
  has no vsync, so it can pass 60; on SwiftShader compare windows with each other only. `--show` opens a visible
  window, locked to the screen, with a live counter.
- **Look closer before guessing.** `gerak frames <page> --at <ms> --crop x,y,width,height --zoom 4` captures one
  region scaled up; `gerak sample <file>.ts --watch <target>.<field> --from 0 --to 2000 --every 16` prints one value
  over time.

## Traps

- Never cast with `as` or assert with `!`: type a pose literal, `const carry: Pose2d = { x: 1 }`, and read a field a
  pose may lack as `pose.x ?? 0`.
- A span is not a time: pass `span.of(time)` to a move or `lane`. It needs a clock in ms, so a scroll-driven scene
  gives `scrollDriver` a `length`.
- An ease that overshoots goes on a value through `mix`, never into a move's time: a move is not defined past its
  ends. To overshoot a move, use the `overshoot` modifier.
- A squash widens a letter into its neighbour; a shape drawn after another passes in front of it unless `z-index`
  sends it behind; a shape the colour of what it crosses merges with it. Check those frames.
- Frames fall every 16 ms, so compare a page with `gerak sample` at multiples of 16.
- A `many` or `group` sits in its parent's centred row; place its items with `position: absolute` and the container
  is still in the row, so pin the container too (`position: absolute; inset: 0`).
- The page tools see elements, not pixels a `<canvas>` draws.
