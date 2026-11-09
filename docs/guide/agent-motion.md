# Making motion as an agent

A **scene** is a function from time, and the events so far, to one value per target. You write it in code; the repo
plays it, renders it and checks it. Look up any function or command in [the reference](./agent-reference.md) by
searching it for the name, not by reading package source. Read a part below only when the brief needs it:

| The brief has | Read |
| --- | --- |
| Hover, press, click, scroll into view, or one target answering another's moment | [events](./agent-events.md) |
| Many bodies, collisions, a pile, things thrown and falling | [physics](./agent-physics.md) |
| An arm, a leg, a figure: bones that reach | [rigs](./agent-rigs.md) |

## The loop

1. `npm run motion:new -- <name>` writes `<name>.html`, its entry, a component and `src/<name>-scene.ts` in
   `apps/react-demo`.
2. Choose the look the brief calls for: background, palette, type, shapes. The scaffold sets none, and the examples'
   looks are not a house style.
3. Lay the page out as the final frame, then write the scene so each target arrives there.
4. `npm run motion:review -- <name>.html --watch <selectors> --to <ms>`, with `--action` for what a person does,
   gives in one call the findings, the moves read back with their eases, and a labelled frame `sheet`.
5. Fix what it flags and what looks wrong on the sheet; review again. Stop when the findings are empty and the sheet
   looks right. Run `npm run typecheck` once at the end.

Use the other tools only to dig into what a review showed; each call costs time and tokens. Values can be right while
the picture is wrong, so read the sheet before calling anything finished.

## A scene

```ts
import { clockDriver } from "@motion5/dom";
import { drop, hop, lane, lanes, span, type Time } from "@motion5/moves";

export const durationMs = 3000;
const LETTERS = lanes([1, 1, 1, 1, 1, 1], 0.25);
const word = span(0, 1000, durationMs);
const flight = span(880, 1870, durationMs);

export const scene = (time: Time) => ({
  letters: [0, 1, 2, 3, 4, 5].map((i) =>
    drop({ distance: 700, squash: 0.18 }, lane(word.of(time), i, LETTERS)),
  ),
  dot: hop({ height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: 1300 }, flight.of(time)),
});

export const clock = () => clockDriver({ duration: durationMs });
```

- A scene module exports `scene` and `durationMs`, which the tools read, and `clock`. Every number of motion lives in
  the scene, none in the component.
- Place a move in the scene with a `span` in ms; `span.of(time, ease)` eases it, and `.progress` of that is a share to
  `mix` with. Stagger targets with `lanes`; `0.25` starts each a quarter of a lane after the last.
- Blend with `mix`, `mixPoint`, `mixAngle`, `mixPose` and the named `ease` curves; key a value through times with
  `keyframes`; put several poses on one target with `combine`. Write your own helper only for what the reference
  lacks.
- A pose is `{ x, y, rotation, scale, scaleX, scaleY, opacity, anchor }`, all optional; `anchor` is the point that
  stays still while it turns or scales, the centre when absent.

Five worked examples, each held by a test. Read the one closest to the brief and copy its patterns, not its look:

| Example | Shows |
| --- | --- |
| `apps/react-demo/src/timing-scene.ts` | moves, lanes, a wipe from a measured point |
| `apps/react-demo/src/catch-scene.ts` | an IK arm timed to a ball's landing, a carry, a cue |
| `apps/react-demo/src/splash-scene.ts` | lists of targets, keyframes, letters rising from clipped water |
| `apps/react-demo/src/card-scene.ts` | a card that lifts on hover and sinks when pressed |
| `apps/react-demo/src/pile-scene.ts` | physics: letters tumbling into a pile |

## Layout

- A move ends at its rest pose, the element's layout position: `drop` waits `distance` above it, `hop` arrives from
  `dx` to the left, or the right when negative. Start far enough out to be off the stage, and clip the stage with
  `overflow: hidden`.
- A `span` needs `display: inline-block` before a transform moves it.
- A value the page must measure, such as where a wipe starts, comes from `centreIn(from, to)` after layout: write it
  into an object the scene reads, then call `player.refresh()`, as `TimingBeat.tsx` does.

## Rendering

In React the scaffold does this; define `scene` and `clock` outside the component, or `usePlayer` restarts:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget` writes a pose every step with no render; its third argument writes anything else, such as one pose out of
a list, as `Glyph` in `Catch.tsx` does. To pass the player to a child, type the prop
`Player<ReturnType<typeof scene>> | undefined`. On a plain page, `play(scene, clock())` and
`player.subscribe("title", (pose) => applyPose(element, pose))`.

## Traps

- Never cast with `as` or assert with `!`: type a pose literal, `const carry: Pose2d = { x: 1 }`, and read a field a
  pose may lack as `pose.x ?? 0`.
- A span is not a time: pass `span.of(time)` to a move or `lane`.
- A squash widens a letter into its neighbour; a dot drawn after a word passes in front of it unless `z-index` sends it
  behind; a shape the colour of what it crosses merges with it. Check those frames.
- Frames fall every 16 ms, so compare a page with `motion:sample` at multiples of 16.
- The page tools see elements, not pixels a `<canvas>` draws.

## Starting values

From the worked examples; defaults to begin from, not rules: letter `squash` `0.18` at a 170 px font, dot `squash`
`0.45`, `hop` `decay` `0.35` with `bounces` `2`, letter `stagger` `0.25` at about 450 ms a letter, a wipe of 600 ms, and
a final hold long enough to read the last words.

Motion can also be a JSON project run by the engine: see [Making motion with the engine](./agent-motion-engine.md). A
code scene needs none of it.
