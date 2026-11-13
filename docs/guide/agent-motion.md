# Making motion as an agent

A **scene** is a function from time, and the events so far, to one value per target. You build it from **moves**:
named pieces of motion, each declared with what it is for. You write the scene in code; the repo plays it, renders it
and checks it. Look up any function or command in [the reference](./agent-reference.md) by searching it for the name,
not by reading package source. Read a part below only when the brief needs it:

| The brief has | Read |
| --- | --- |
| Hover, press, click, scroll into view, or one target answering another's moment | [events](./agent-events.md) |
| Many bodies, collisions, a pile, things thrown and falling | [physics](./agent-physics.md) |
| An arm, a leg, a figure: bones that reach | [rigs](./agent-rigs.md) |
| Weight, life, character or polish: anticipation, arcs, follow-through, settle | [principles](./agent-principles.md) |
| Depth, turns about several axes, a moving camera: a Three.js scene | [3D](./agent-3d.md) |

## The loop

1. **Find the idea before any code.** Name the obvious answer to the brief in one line: the piece most people would
   make. Then write three other ideas, one line each, that differ from it and from each other in what moves and how
   (what the thing is made of, where it comes from, what it does while it holds), not in colour or type. Pick the
   one that serves the brief best and is not the obvious one.
2. **Write the chosen idea in three lines,** and keep them, with the obvious answer and the two you dropped, for
   your report: what moves, and in what order; its character (heavy or light, quick or slow, stiff or loose, playful
   or calm); the one moment the eye must not miss. Every choice after this answers to those lines.
3. `npm run motion:new -- <name>` writes `apps/pieces/src/<name>.ts`, one stage module: a story of one beat, one
   actor at rest and an empty skin. Open it as `stage.html?piece=<name>`.
4. **Cast, story, skin** (see [The stage module](#the-stage-module)). Name who is on stage in `cast`, the beats in
   `beats`, and give each member the look the brief calls for in `skins.dom.css`. Name the look most people would
   give it, and choose another the brief supports as well. Lay the skin out as the final frame.
5. **Read the catalog.** `npm run motion:moves` prints one line per move: id, role, what it does, its options with
   their ranges, its moments. `-- --role enter` lists one role; `-- <id>` prints one move in full with its call.
   Choose by role and by the character you wrote down.
   `-- --parts` lists the building blocks moves are made from (`trail`, `sequence`, `springEase`, `along`, ...).
6. **Compose.** Place each move on a span, reshape it with a modifier, add moves together on one target (see
   [Composing](#composing)). Choose every number from your three lines and [what a quality asks](#what-a-quality-asks).
7. **Where nothing fits, write a move** (see [Writing a move](#writing-a-move)) and use it like any other. A
   motion with a name that another piece could use is a move, even when `keyframes` could draw it here.
8. `npm run motion:review -- apps/pieces/src/<name>.ts` checks the cast against the scene with no browser. `npm run motion:review --
   "stage.html?piece=<name>" --watch '[data-cast="<member>"]' --to <ms>`, with `--action` for what a person does,
   gives the findings and a `sheet` of frames picked where the motion is fast; `--full` adds the moves with their eases.
9. Fix what it flags and what looks wrong on the sheet; review again. Stop when the findings are empty and the sheet
   shows the three lines you wrote. Run `npm run typecheck` once at the end.

The other scene files in `apps/pieces/src` are other people's pieces. Do not open them: a piece begun from one
comes out as its copy. Use the other tools only to dig into what a review showed. Values can be right while the
picture is wrong, so read the sheet before calling anything finished.

## The stage module

A piece is one file that exports `beats`, `cast`, `skins` and `scene`, and optionally `frame` (default 1280 by 720)
and `rest`; a piece that changes place adds `layouts` and `layout` ([Changing place](#changing-place)).

```ts
import type { Events, Time } from "@gerak/moves";
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
  it by `[data-path="<name>"]` (`stroke`, `stroke-width`). Its points are frame px from the frame's top-left, in any
  group, and the stage places the member at the path's box. To follow the layout, pass `path: (rest) => toCubics([...])`
  reading other members by name with `restOf`, other strokes too, which are drawn first; it is drawn again on each measure,
  and never reads its own box. Two paths that read each other are a loop: neither is drawn, and both are reported.
- **Names** are the keys, unique across the cast; an item is `dust.3`. `on: ["land", ["rise", "fall"]]` shows a
  member only while one of its stretches runs, a beat or a pair from the first's start to the second's end, so
  `["rise", "fall"]` is two beats and `[["rise", "fall"]]` one stretch (a member without `on` takes its group's); `watch: true` sends its hover and click to the scene's events under its name;
  `still: true` says the scene never moves that member; on a group it says nothing of the group's members.
- **Story.** `beats.enter.of(time)` is the beat's own time; beats may overlap, and the story is the piece's length.
- **Skin.** `skins.dom.css` styles members by `[data-cast="<name>"]`, an item by `[data-cast="dust.3"]` or all of a
  list's by `[data-cast^="dust."]`, scoped to the stage. A member it leaves out is a grey box with its name, or its
  text. By default the frame and every group or `many` lay their members out in a centred, wrapping row (gaps 24 and
  8 px), each `position: relative`. To place one yourself, give it `position: absolute` with `left` and `top` from
  its parent's top-left. Never `position: static` or `display: contents`: its rest box would be wrong.
- **Rest.** `restOf(rest, "dot")` is the measured box of a member after layout, `{ x, y, width, height }` from its
  centre in the frame; it is a zero box under a tool with no browser.
- `R`, or a click on the background, replays.

## Composing

Each line shows one function on a plain target. A bare name such as `distance` or `fromMs` stands where your own
number goes.

```ts
// Every helper below, and every built-in move, comes from this package; a move `motion:moves` lists from
// `apps/pieces/src/moves` is imported from `./moves/<id>`.
import { combine, ease, lane, lanes, mix, repeated, reversed, rise, span, type Time } from "@gerak/moves";

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

## Writing a move

Write one when the motion in your three lines has a name and no catalogued move, modified or combined, gives it.
`keyframes` and `mix` in a scene are for a value this piece alone needs; a tick, a flip, a wave or any motion you
can name goes in `src/moves`, where the next piece finds it.
Glue that only this piece needs stays in the scene as a `mix`.

1. `npm run motion:new -- --move <id>` writes `apps/pieces/src/moves/<id>.ts`, a declaration the gate refuses.
2. Fill it in: the `role`, a `description` the next agent will choose it by, each option with its range and a
   description, an `example`, and `run`, which answers a pose from the options and `progress` alone. Make an option of
   what another brief would change, not of this piece's numbers. [`defineMove`](./agent-reference.md#writing-a-move)
   lists the roles and what each must hold.
3. `npm run motion:moves -- --check` until it prints no finding. It samples the move and refuses one that breaks its
   role's rest, jumps between frames, or lacks a description.
4. Import it into the scene from `./moves/<id>` and use it like a built-in. Name it in your report.
5. Name the parts your move is built from in `recipe: ["span", "squashFromSpeed"]` (ids from `--parts`); the catalog
   shows it and the gate refuses an unknown id. A move used by pieces from two briefs is listed by `motion:moves -- --candidates`
   (a piece names its brief with `export const brief = "<name>"`; a piece with none is its own), and
   `motion:promote <id>` moves it into the library; a person decides when.

## Live

When a person is watching, `npm run motion:live -- <name>` prints the address of `live.html?scene=<name>` (see
[the live guide](./live.md)): each save of `src/<name>.ts` lands on their stage in place, keeping the time.

## Layout

- An entrance ends at its rest pose, the member's layout position, and starts away from it by its options. Start far
  enough out to be off the stage; the frame clips what leaves it.
- A value the layout decides, such as the point a reveal grows from, is `restOf(rest, "dot")`, not a number you guess.

## Changing place

A route change, a card opening and a reordering list move a member from one place the layout decides to another.
Never compute those places: name the layouts, let the stage measure them, and carry the member with `carried`.

```ts
import { ease, type Events, type Time } from "@gerak/moves";
import { carried, restOf, type Layouts, type Rest } from "@gerak/stage";

export const layouts = ["list", "detail"] as const;
type Layout = (typeof layouts)[number];
export const layout = (events: Events): Layout =>
  events.findLast((event) => event.name === "click")?.target === "card" ? "detail" : "list";
export const scene = (time: Time, events: Events, rest: Rest, all: Layouts<Layout>) => ({
  card: carried({
    own: restOf(rest, "card"),
    at: (past) => restOf(all[layout(past)], "card"),
    events, time, ms: 450, ease: ease.cubicOut, size: "clip",
  }),
});
```

- **Layouts.** `layouts` names them; `skins.dom.css` styles each under `[data-layout="<name>"] [data-cast="…"]`. The
  stage measures every layout and passes them all as the scene's fourth argument; `rest`, the third, is the layout in
  force. `layout(events)` answers which one is in force from the events alone, never the time, so the moment of a
  change is its event's. Without `layout`, the first layout is in force.
- **A route is a layout.** A member one route does not show is `display: none` under that layout; its box there is
  zero, and carrying from or to it throws, so let it enter or exit instead.
- **`carried`** carries the member from where it is drawn to the box `at` names after each event, over `ms`, so a
  second click mid-flight sets off from where the member is, never from its old rest. `size` is `"scale"` (default),
  `"clip"` (crops without stretching text, for a card that opens; it never draws larger than the member's own box) or
  `"keep"`.
- **Scripted clicks.** Export `cues`, events at known ms such as `{ name: "click", at: 1500, target: "card" }`; the
  stage plays them beside the page's own, so the tools and `stage.html` show each change without a hand on the mouse.
- **A reorder needs no layout.** The items stay where the page put them; `at` answers the slot box each item takes
  after the events, `(past) => restOf(rest, \`list.${slotOf(past, index)}\`)`. The page's own order, and so its tab
  order, stays the first one until the site reorders its data.

## On a real site's elements

A stage module needs none of this. To bind a page's own elements, define `scene` and `clock` outside the component,
or `usePlayer` restarts:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget` writes a pose every step with no render; its third argument writes anything else, such as one pose out of
a list (the reference's `useTarget` entry shows it). To pass the player to a child, type the prop
`Player<ReturnType<typeof scene>> | undefined`. On a plain page, `play(scene, clock())` and
`player.subscribe("title", (pose) => applyValue(element, pose))`.

## Traps

- Never cast with `as` or assert with `!`: type a pose literal, `const carry: Pose2d = { x: 1 }`, and read a field a
  pose may lack as `pose.x ?? 0`.
- A span is not a time: pass `span.of(time)` to a move or `lane`. It needs a clock in ms, so a scroll-driven scene
  gives `scrollDriver` a `length`.
- An ease that overshoots goes on a value through `mix`, never into a move's time: a move is not defined past its
  ends. To overshoot a move, use the `overshoot` modifier.
- A squash widens a letter into its neighbour; a shape drawn after another passes in front of it unless `z-index`
  sends it behind; a shape the colour of what it crosses merges with it. Check those frames.
- Frames fall every 16 ms, so compare a page with `motion:sample` at multiples of 16.
- The page tools see elements, not pixels a `<canvas>` draws.
