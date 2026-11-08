# Making motion as an agent

You write motion as code: a **scene** is a function from time to values, one value per target. The repo gives you
the moves, the rig, a player, renderers, and tools that report back in numbers and pictures, so you can correct your
own work without watching it play. This guide assumes a checkout of this repository.

## The loop

1. `npm run motion:new -- <name>` writes a page, its entry, a component and a scene module in `apps/react-demo`.
2. Lay the page out as the final frame, then write the scene so each target arrives at that layout.
3. `npm run motion:timeline -- apps/react-demo/src/<name>-scene.ts` shows when each target moves, as text bars.
4. `npm run motion:sample -- apps/react-demo/src/<name>-scene.ts --at 0,500` prints exact values, with no browser.
5. `npm run motion:frames`, `motion:probe` and `motion:check` show the real page as pictures, measurements and
   findings.
6. Adjust, then repeat from step 3.

Look at frames before you call anything finished. Values can be right while the picture is wrong: a wrong pivot, a
color that merges, a letter colliding with its neighbor. None of those raises an error.

## A scene

```ts
import { clockDriver } from "@motion5/dom";
import { drop, hop, lane, lanes, window, wipe, type Time } from "@motion5/moves";

export const durationMs = 3000;
const LETTERS = lanes([1, 1, 1, 1, 1, 1], 0.25);
const part = (time: Time, fromMs: number, toMs: number) =>
  window(time, fromMs / durationMs, toMs / durationMs);

export const scene = (time: Time) => {
  const word = part(time, 0, 1000);
  return {
    letters: [0, 1, 2, 3, 4, 5].map((i) => drop({ distance: 700, squash: 0.18 }, lane(word, i, LETTERS))),
    dot: hop({ height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: 1300 }, part(time, 880, 1870)),
    cover: wipe({ radius: 1500, x: 974, y: 415 }, part(time, 2400, 3000)),
  };
};

export const clock = () => clockDriver({ duration: durationMs });
```

A scene module exports `scene` and `durationMs`; the tools read those two. Keep every number of motion in the scene
and none in the component. The worked example is [`timing-scene.ts`](../../apps/react-demo/src/timing-scene.ts),
served at `timing.html` by [`TimingBeat.tsx`](../../apps/react-demo/src/TimingBeat.tsx).

## Time

A move takes `time`: `{ progress, clock }`. `progress` runs from 0 to 1; `clock` is `{ kind: "timed", elapsed,
length }` in ms under a clock driver, or `{ kind: "untimed" }` under scroll or by hand, and you switch on `kind`
before reading `elapsed`.

| You want | Use |
| -------------------------------------- | ------------------------------------------------------------------- |
| A move inside part of the scene | `window(time, from, to)`, as shares of the whole, or a helper in ms |
| Several targets one after another | `lanes(lengths, stagger)` once, then `lane(time, index, lanes)` |
| A start delay, repeats, or a yoyo | `clockDriver({ duration, delay, repeat, yoyo })` |
| Motion driven by the page's scroll | `scrollDriver({ start, end })`, in px |
| A move at a progress, by hand | `atProgress(0.5)` |

`stagger` is in lane lengths: `0.25` starts each lane a quarter of a lane after the one before, and every lane is
at rest when `time` reaches 1.

## Moves

Each move is a function `move(options, time)`, typed from its declaration, so a wrong option name fails to compile.
`hop.options` and its siblings hold each option's range and a one-line description.

| Move | Gives | Options |
| ----- | ----- | ------- |
| `drop` | a pose | `distance` above rest; `squash` on landing |
| `hop` | a pose, and `contact` with `hits` and `justHit` | `height`, `bounces`; `decay`, `squash`, `dx` from the left |
| `wipe` | a reveal circle `{ x, y, radius }` | final `radius`, centre `x` and `y` in px |
| `trace` | a drawn share `{ drawn }` | none |
| `rope` | anchors, from `{ points }` as its third argument | `angle`, `pin`, `release`, `overshoot`, `ripple` |

A pose is `{ x, y, rotation, scale, scaleX, scaleY, opacity, anchor }`, each optional; `anchor` is `"center"`,
`"bottom"`, `"top"`, `"left"` or `"right"`, the point that stays still while the target turns or scales, and an
absent anchor is the centre. `combine(poses)` puts several poses on one target: offsets and turns add, scales and
opacity multiply, and the first anchor stays. `toCubics(anchors)` turns a rope's anchors into path segments.

## Rest poses

A move ends at its rest pose, which is the element's layout position. Lay the page out as the final frame, then let
moves bring things there: `drop` waits `distance` above rest, and `hop` arrives from `dx` to the left. Make
`distance` and `dx` large enough to start off the stage, and clip the stage with `overflow: hidden`.

## Rendering

In React, the scaffold already does this:

```tsx
const playing = usePlayer(scene, clock);
const title = useTarget(playing?.player, "title");
return <div ref={title} onClick={() => playing?.driver.replay()} />;
```

`useTarget(player, target)` writes a pose to the element on every step with no React render; pass a third argument
for anything else, such as `useTarget(player, "cover", applyReveal)` or a function that picks one pose out of a list.
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
import { buildChain, fk, ik } from "@motion5/rig";

const arm = buildChain([
  { id: "upper", length: 100 },
  { id: "lower", parentId: "upper", length: 80, minRotation: -150, maxRotation: 0 },
]);
const { rotations } = ik(arm, { lower: { x: 60, y: 120 } }, { base: { x: 0, y: 0, rotation: 0 } });
const tips = fk(arm, { rotations });
```

`buildChain` checks the bones once and refuses an unknown parent or a cycle by name. `fk` gives each bone's tip as
`{ x, y, rotation }`; `ik` gives the rotations that bring each goal's bone tip to its goal, within its limits, and
`flip: true` bends the other way. Angles are degrees.

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
`sheet.png`. Read `sheet.png` rather than each frame. A non-empty `pageErrors` exits `1`.

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
anything. An overlap compares boxes, so a dot passing behind a letter still counts.

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
