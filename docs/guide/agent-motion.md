# Making motion as an agent

You write motion as code: a **scene** is a function from time to values, one value per target. The repo gives you
the moves, the rig, a player, renderers, and tools that report back in numbers and pictures, so you can correct your
own work without watching it play. This guide assumes a checkout of this repository.

## The loop

1. `npm run motion:new -- <name>` writes a page, its entry, a component and a scene module in `apps/react-demo`.
2. Choose the look the brief calls for: background, palette, type and shapes. The scaffold sets none, and the
   examples' looks are theirs, not a house style.
3. Lay the page out as the final frame, then write the scene so each target arrives at that layout.
4. `npm run motion:timeline -- apps/react-demo/src/<name>-scene.ts` shows when each target moves, as text bars.
5. `npm run motion:sample -- apps/react-demo/src/<name>-scene.ts --at 0,500` prints exact values, with no browser.
6. `npm run motion:frames`, `motion:probe` and `motion:check` show the real page as pictures, measurements and
   findings.
7. Adjust, then repeat from step 4.

Look at frames before you call anything finished. Values can be right while the picture is wrong: a wrong pivot, a
color that merges, a letter colliding with its neighbor. None of those raises an error.

## A scene

```ts
import { clockDriver } from "@motion5/dom";
import { drop, hop, lane, lanes, span, wipe, type Time } from "@motion5/moves";

export const durationMs = 3000;
const LETTERS = lanes([1, 1, 1, 1, 1, 1], 0.25);
const word = span(0, 1000, durationMs);
const flight = span(880, 1870, durationMs);
const cover = span(2400, 3000, durationMs);

export const scene = (time: Time) => ({
  letters: [0, 1, 2, 3, 4, 5].map((i) =>
    drop({ distance: 700, squash: 0.18 }, lane(word.of(time), i, LETTERS)),
  ),
  dot: hop({ height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: 1300 }, flight.of(time)),
  cover: wipe({ radius: 1500, x: 974, y: 415 }, cover.of(time)),
});

export const clock = () => clockDriver({ duration: durationMs });
```

A scene module exports `scene` and `durationMs`; the tools read those two. Keep every number of motion in the scene
and none in the component. Three worked examples, each held by a test:

| Example | Shows | Served at |
| ------- | ----- | --------- |
| `apps/react-demo/src/timing-scene.ts` | moves, lanes, a wipe measured from the page | `timing.html`, by `TimingBeat.tsx` |
| `apps/react-demo/src/catch-scene.ts` | an IK arm, one target timed to another's moment, eases, a carry | `catch.html`, by `Catch.tsx` |
| `apps/react-demo/src/splash-scene.ts` | lists of targets, keyframes, rings and droplets timed off one impact, letters rising out of clipped water | `splash.html`, by `splash.tsx` |

Read the one closest to your brief before writing, and copy its patterns, not its colours or type.

## Time

A move takes `time`: `{ progress, clock }`. `progress` runs from 0 to 1; `clock` is `{ kind: "timed", elapsed,
length }` in ms under a clock driver, or `{ kind: "untimed" }` under scroll or by hand, and you switch on `kind`
before reading `elapsed`.

| You want | Use |
| -------------------------------------- | ------------------------------------------------------------------- |
| A move inside part of the scene | `const s = span(fromMs, toMs, durationMs)` once, then `s.of(time)` |
| A value through several keyed times | `keyframes(durationMs, start, [{ at, to, ease }], mix)` once, then call it with `time` |
| That move eased | `s.of(time, ease.cubicInOut)` |
| A share to blend with, eased | `s.of(time, ease.cubicInOut).progress`: `of` gives a time, not a number |
| The ms a move reaches a moment | `s.at(hop.moments(options).lastLanding)` |
| Several targets one after another | `lanes(lengths, stagger)` once, then `lane(time, index, lanes)` |
| A start delay, repeats, or a yoyo | `clockDriver({ duration, delay, repeat, yoyo })` |
| Motion driven by the page's scroll | `scrollDriver({ start, end })`, in px |
| A move at a progress, by hand | `atProgress(0.5)` |

Time one target to another's moment by computing the ms once, outside `scene`, then starting or ending a span
there:

```ts
const BOUNCE = { height: 330, bounces: 2, decay: 0.35, dx: -1100 };
const flight = span(400, 2400, durationMs);
const LAND_MS = flight.at(hop.moments(BOUNCE).lastLanding);
const lunge = span(1450, LAND_MS, durationMs); // the hand arrives as the ball lands
```

`stagger` is in lane lengths: `0.25` starts each lane a quarter of a lane after the one before, and every lane is
at rest when `time` reaches 1.

## Moves

Each move is a function `move(options, time)`, typed from its declaration, so a wrong option name fails to compile.
`hop.options` and its siblings hold each option's range and a one-line description.

| Move | Gives | Options | Moments |
| ----- | ----- | ------- | ------- |
| `drop` | a pose | `distance` above rest; `squash` on landing | `landing` |
| `hop` | a pose, and `contact` with `hits` and `justHit` | `height`, `bounces`; `decay`, `squash`, `dx` from the left, negative from the right | `landings`, `lastLanding` |
| `wipe` | a reveal circle `{ x, y, radius }` | final `radius`, centre `x` and `y` in px | none |
| `trace` | a drawn share `{ drawn }` | none | none |
| `rope` | anchors, from `{ points }` as its third argument | `angle`, `pin`, `release`, `overshoot`, `ripple` | none |

`hop` with `bounces: 0` is one arc: up `height` and down again, landing at rest, so a droplet thrown up and falling
back is a hop with `dx: 0`.

`move.moments(options)` gives where in its progress the move reaches each moment, as shares from 0 to 1: pass it
to a span's `at` for the ms. `contact` says whether a hop is landing now; moments say when it will.

A pose, the type `Pose2d` from `@motion5/moves`, is `{ x, y, rotation, scale, scaleX, scaleY, opacity, anchor }`,
each optional; `anchor` is `"center"`,
`"bottom"`, `"top"`, `"left"` or `"right"`, the point that stays still while the target turns or scales, and an
absent anchor is the centre. `combine(poses)` puts several poses on one target: offsets and turns add, scales and
opacity multiply, and the first anchor stays. `toCubics(anchors)` turns a rope's anchors into path segments.

## Eases and blends

`@motion5/moves` holds what a move does not cover:

| You want | Use |
| -------- | --- |
| An eased share | `ease.sineInOut`, `quadIn`, `cubicOut`, `quartInOut`, `expoOut`, `backOut`, `elasticOut`, `bounceOut`, and the other `In`, `Out`, `InOut` forms |
| A number, point or angle between two | `mix(a, b, share)`, `mixPoint(a, b, share)`, `mixAngle(a, b, share)` the short way round |
| A pose between two | `mixPose(a, b, share)`, a missing field at its rest |
| Several poses on one target | `combine([a, b])` |
| A value through keyframes | `keyframes(durationMs, start, keys, blend)`: from `start` at 0 ms to each key's `to` by its `at`, eased by its `ease`, linear without one, then holding; repeat a value to hold it |

Look through the exports of `@motion5/moves` before writing a helper, and write your own only for a curve this table
lacks.

## Rest poses

A move ends at its rest pose, which is the element's layout position. Lay the page out as the final frame, then let
moves bring things there: `drop` waits `distance` above rest, and `hop` arrives from `dx` to the left, or from the right when `dx` is negative; at progress 0 it sits on its rest line `dx` from rest. Make
`distance` and `dx` large enough to start off the stage, and clip the stage with `overflow: hidden`.

## Rendering

In React, the scaffold already does this:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget(player, target)` writes a pose to the element on every step with no React render; pass a third argument
for anything else, such as `useTarget(player, "cover", applyReveal)` or a function that picks one pose out of a list,
as `Glyph` in `Catch.tsx` does for each letter.
`useValue(player, target, select)` re-renders only when `select`'s answer changes; use it for rare values such as
a count. Define `scene` and `clock` outside the component, because `usePlayer` restarts when either changes.

On a plain page:

```ts
const player = play(scene, clock());
player.subscribe("title", (pose) => applyPose(element, pose));
```

| Value | DOM and SVG, from `@motion5/dom` | Three.js, from `@motion5/three` |
| ----- | -------------------------------- | ------------------------------- |
| A pose | `applyPose(element, pose)` | `applyPose2d(object, pose)`, page y down |
| A reveal | `applyReveal(element, reveal)` | not yet |
| A drawn share | `applyDrawn(path, drawn)`, measuring the path itself | not yet |
| Path segments | `applyPath(path, cubics)`, setting `d` | not yet |

A value the page must measure, such as where a wipe starts, is measured after layout: `centreIn(from, to)` gives
`from`'s rest centre measured from `to`'s corner. Write it into an object the scene reads, then call
`player.refresh()`. `TimingBeat.tsx` does this for the wipe.

## Rigs

```ts
import { buildChain, chainPoses, ik } from "@motion5/rig";

const SHOULDER = { x: 250, y: 300 };
const base = { ...SHOULDER, rotation: 0 };
const arm = buildChain([
  { id: "upper", length: 170 },
  { id: "lower", parentId: "upper", length: 150 },
]);

// handGoal(time) eases the hand's goal between points, as in catch-scene.ts
export const scene = (time: Time) => {
  const { rotations } = ik(arm, { lower: handGoal(time) }, { base, flip: true });
  const { bones, tips } = chainPoses(arm, { rotations, base });
  return { upper: bones.upper, lower: bones.lower, elbow: tips.upper, hand: tips.lower };
};
```

- **Units.** Stage px with y down, angles in degrees, and a positive angle turns clockwise on screen, as in CSS.
  A bone at rotation 0 points right, so a base with `rotation: -90` points the chain up.
- **Ids.** `buildChain` keeps the ids it was given, so `rotations.upper`, `tips.lower` and `bones.upper` are always
  there, with no `?? 0`. It refuses an unknown parent or a cycle by name.
- **Rotations.** `ik` gives, and `fk` takes, each bone's rotation against its parent. `fk` gives each bone's tip in
  stage px, with its rotation on the stage.
- **Goals.** A goal is in stage px, like `base`. To move a hand smoothly, move its goal with `mixPoint` and an ease,
  and solve every frame.
- **Elbow side.** By default the elbow bends clockwise of the line from base to goal: below it when reaching right.
  `flip: true` bends it the other way. `minRotation` and `maxRotation` limit a bone against its parent.
- **Out of reach.** A goal past the chain's length points the chain straight at it, and the `quality.kind` that `ik`
  returns beside `rotations` is `"too-far"`.
- **Elements.** Lay every rig element out at the base. A bone element points right from the base, its left end
  vertically centred on it; a joint or hand element is centred on it. `chainPoses` gives `bones`, poses with `anchor:
  "left"` so they turn on the left end, and `tips`, offsets from the base. Size a bone element's width to its length.

To make something ride a hand, add the hand's movement since the catch to its own pose, as `catch-scene.ts` does.

## Tools

```bash
npm run motion:timeline -- apps/react-demo/src/timing-scene.ts
```

One text bar per target, from its first change to its rest, sampled every 16 ms. Read it to check order, overlaps
and how long the last pose holds, before looking at any frame.

```bash
npm run motion:sample -- apps/react-demo/src/timing-scene.ts --at 0,500,1500 --nodes dot --fields x,y
```

Exact values at each time, or at each `--progress`. `--nodes` keeps those targets and `--fields` those fields.

```bash
npm run motion:frames -- timing.html --at 0,500,1300
```

The page is a path inside the site, with no leading `/`. By default the site is `apps/react-demo`; `--root <dir>`
serves any other folder, and `--url <address>` uses a server you already run, so these tools work on any web page.
Paths given to `--root` and `--out` are read from the folder you ran the command in. The command opens the page in
an installed Chrome or Edge under a paused fake clock, and prints paths as JSON: one PNG per time, and a labelled
`sheet.png`. Read `sheet.png` rather than each frame. A non-empty `pageErrors` exits `1`. The page shows the last
frame it drew, and frames fall every 16 ms, so ask for multiples of 16 to compare a page with `motion:sample` exactly.

```bash
npm run motion:probe -- timing.html --at 2300 --select .beat-dot
```

Measures each match of a CSS selector at each time: box, centre, computed transform, colours, opacity and
`z-index`.

```bash
npm run motion:frames -- timing.html --onion .beat-dot --from 880 --to 1880 --every 40
```

Draws the element at each step onto one faded frame, with its centre path, so its arc and spacing show without
playback. Even gaps mean even speed; bunched gaps mean easing.

```bash
npm run motion:check -- timing.html --watch .beat-dot,.beat-glyph --to 3000
```

Samples every 16 ms up to `--to` and reports, each with its duration: two watched elements overlapping for more than
`--overlap` frames (default 12), a centre moving more than `--jump` px in one frame (default 150), a final hold
shorter than `--hold` ms (default 500), and an element still moving on the last frame. It exits `1` when it finds
anything. An overlap compares the parts of boxes a viewer can see: a box hidden, at zero opacity or clipped out by
an ancestor's overflow is left out, but a dot passing behind a letter still counts. Leave out of `--watch` an
element meant to touch another, such as a foot on a ball.

```bash
npm run motion:points -- shape.json --spacing 12
```

Resamples a JSON array of `{ x, y }` points to fixed spacing, so every link of a rope is the same length.

## Traps

- A letter's squash widens it, and it can touch its neighbor. Check the landing frames.
- A dot drawn after a word passes in front of it. Use `z-index` to send it behind.
- An element the same color as what it crosses merges with it. Check the crossing frames.
- A `span` needs `display: inline-block` before a transform moves it.
- `usePlayer` restarts when `scene` or the driver factory changes identity; define both outside the component.
- Never cast with `as` or assert with `!`. Give a pose literal its type, `const carry: Pose2d = { x: 1 }`, and read
  a field a pose may lack as `pose.x ?? 0`.
- A span is not a time: pass `span.of(time)` to a move or `lane`, never the span itself.

## Starting values

These worked once, in the worked example. They are defaults to begin from, not rules.

| Move or setting | Value |
| ------------------ | -------------------------------------------- |
| Letter `squash` | `0.18` at a 170 px font |
| Dot `squash` | `0.45` |
| `hop` `decay` | `0.35`, with `bounces` of `2` |
| Letter `stagger` | `0.25`, each letter lasting about 450 ms |
| A wipe's length | `600` ms |
| A held final frame | Long enough to read the last words |

## The engine

Motion can also be a JSON project run by the engine, with live editing, scroll triggers bound by key, and plugins
for rigs. That path is described in [Making motion with the engine](./agent-motion-engine.md); a code scene needs
none of it.
