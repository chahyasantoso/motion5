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
3. `npm run motion:new -- <name>` writes `<name>.html`, its entry, a component and `src/<name>-scene.ts` in
   `apps/react-demo`. The scene leaves its one target at rest and the page sets no look.
4. Choose the look the brief calls for: background, palette, type, shapes. Name the look most people would give
   it, and choose another the brief supports as well. Lay the page out as the final frame.
5. **Read the catalog.** `npm run motion:moves` prints one line per move: id, role, what it does, its options with
   their ranges, its moments. `-- --role enter` lists one role; `-- <id>` prints one move in full with its call.
   Choose by role and by the character you wrote down.
6. **Compose.** Place each move on a span, reshape it with a modifier, add moves together on one target (see
   [Composing](#composing)). Choose every number from your three lines and [what a quality asks](#what-a-quality-asks).
7. **Where nothing fits, write a move** (see [Writing a move](#writing-a-move)) and use it like any other. A
   motion with a name that another piece could use is a move, even when `keyframes` could draw it here.
8. `npm run motion:review -- <name>.html --watch <selectors> --to <ms>`, with `--action` for what a person does,
   gives in one call the findings, the moves read back with their eases, and a labelled frame `sheet`.
9. Fix what it flags and what looks wrong on the sheet; review again. Stop when the findings are empty and the sheet
   shows the three lines you wrote. Run `npm run typecheck` once at the end.

The other scene files in `apps/react-demo/src` are tests of the runtime. Do not open them: a piece begun from one
comes out as its copy. Use the other tools only to dig into what a review showed. Values can be right while the
picture is wrong, so read the sheet before calling anything finished.

## Composing

Each line shows one function on a plain target. A bare name such as `distance` or `fromMs` stands where your own
number goes.

```ts
// Every move, modifier and helper below is imported from this one package.
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

- The scaffolded scene file is the whole shape: `scene` returns one object with a key per target, and the module
  exports `durationMs`, which the tools read, and `clock`. Add a key per element and a span per move, in the order
  of your first line. Every number of motion lives in the scene, none in the component.
- `reversed(time)` and `repeated(time, count)` reshape a time and wrap any move. `anticipate` and `overshoot` take
  the move they reshape as a function of time, and nest: an `anticipate` inside an `overshoot` winds up, goes,
  passes and settles.
- A move holds still outside its span, on the side its role says: an `enter` waits at its start and stays at rest
  after, an `emphasis` rests on both sides. So one target that arrives, is stressed and leaves is a `combine` of
  three moves, each on its own span.
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

1. `npm run motion:new -- --move <id>` writes `apps/react-demo/src/moves/<id>.ts`, a declaration the gate refuses.
2. Fill it in: the `role`, a `description` the next agent will choose it by, each option with its range and a
   description, an `example`, and `run`, which answers a pose from the options and `progress` alone. Make an option of
   what another brief would change, not of this piece's numbers. [`defineMove`](./agent-reference.md#writing-a-move)
   lists the roles and what each must hold.
3. `npm run motion:moves -- --check` until it prints no finding. It samples the move and refuses one that breaks its
   role's rest, jumps between frames, or lacks a description.
4. Import it into the scene from `./moves/<id>` and use it like a built-in. Name it in your report.

## Live

When a person is watching, `npm run motion:live -- <name>` prints the address of `live.html?scene=<name>` (see
[the live guide](./live.md)): each save of `src/<name>-scene.ts` lands on their stage in place, keeping the time.

## Layout

- An entrance ends at its rest pose, the element's layout position, and starts away from it by its options. Start far
  enough out to be off the stage, and clip the stage with `overflow: hidden`.
- A `span` element needs `display: inline-block` before a transform moves it.
- A value the page must measure, such as the point a reveal grows from, comes from `centreIn(from, to)` after layout:
  write it into an object the scene reads, then refresh the player.
  ```tsx
  useLayoutEffect(() => {
    Object.assign(origin, centreIn(dot, stage));
    playing?.player.refresh();
  }, [playing]);
  ```

## Rendering

In React the scaffold does this; define `scene` and `clock` outside the component, or `usePlayer` restarts:

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
