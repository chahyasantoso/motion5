# Making motion as an agent

You write motion as code: a **scene** is a function from time to values, one value per target. The repo gives you
the moves, the rig, a player, renderers, and tools that report back in numbers and pictures, so you can correct your
own work without watching it play. This guide assumes a checkout of this repository. Every function, type and command, with a
short example each, is in [the agent reference](./agent-reference.md): look things up there, not in package source.

## The loop

1. `npm run motion:new -- <name>` writes a page, its entry, a component and a scene module in `apps/react-demo`.
2. Choose the look the brief calls for: background, palette, type and shapes. The scaffold sets none, and the
   examples' looks are theirs, not a house style.
3. Lay the page out as the final frame, then write the scene so each target arrives at that layout.
4. `npm run motion:review -- <name>.html --watch <selectors> --to <ms>`, with `--action` for anything a person
   does, gives in one call what `motion:check` finds, the moves `motion:read` reads, and a labelled frame `sheet`.
5. Fix what it flags and what looks wrong on the sheet, then review again. Stop when the findings are empty and the
   sheet looks right. Run `npm run typecheck` once at the end.

Each call costs time and tokens: reach for `motion:sample`, `motion:timeline`, `motion:probe`, `motion:read` or
`motion:frames` only to dig into something a review showed. Read the sheet before you call anything finished.
Values can be right while the picture is wrong: a wrong pivot, a color that merges, a letter colliding with its
neighbor. None of those raises an error.

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
and none in the component. Five worked examples, each held by a test:

| Example | Shows | Served at |
| ------- | ----- | --------- |
| `apps/react-demo/src/timing-scene.ts` | moves, lanes, a wipe measured from the page | `timing.html`, by `TimingBeat.tsx` |
| `apps/react-demo/src/catch-scene.ts` | an IK arm, one target timed to another's moment, eases, a carry | `catch.html`, by `Catch.tsx` |
| `apps/react-demo/src/splash-scene.ts` | lists of targets, keyframes, rings and droplets timed off one impact, letters rising out of clipped water | `splash.html`, by `splash.tsx` |
| `apps/react-demo/src/card-scene.ts` | events from the page: a card that drops in, lifts on hover, sinks when pressed | `card.html`, by `HoverCard.tsx` |
| `apps/react-demo/src/pile-scene.ts` | physics: letters dropped as boxes that bounce and settle, squashing on each contact | `pile.html`, by `Pile.tsx` |

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
| A live time, for a test or by hand | `liveAt(ms)` |
| A clock's ms, whatever kind | `elapsedOf(time.clock)`, `undefined` under scroll |

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

## Events

A scene can answer the page: a hover, a press, a click, scrolling into view. It gets a second argument, the events
so far, oldest first, each `{ name, at, target }` with `at` in ms, and a pointer event's `x` and `y` in px from the
watched element's top left corner, so a burst can start where the click landed:

```ts
import { eventDriver } from "@motion5/dom";
import { follow, type Events, type Time } from "@motion5/moves";

const lift = follow({ start: 0, on: { enter: -14, leave: 0 }, target: "card" });

export const scene = (time: Time, events: Events) => ({ card: { y: lift(time, events) } });
export const clock = () => eventDriver({ introMs: 900 });
```

- **`follow({ start, on, target, stiffness, damping })`** is a spring: each event named in `on` sends it towards that
  value, from wherever it is and as fast as it is going, so a leave half way through a hover turns back with no jump.
  `stiffness` defaults to 170 and `damping` to 26; lower damping overshoots more. Use one `follow` per number.
- **`eventDriver({ introMs, settleMs })`** is a live clock: `time.clock` is `{ kind: "live", elapsed }` in ms since
  the page started, and `time.progress` stays 0. Place an intro with `span`, which reads a live clock's ms. Frames
  run through `introMs`, then for `settleMs` (default 2000) after each event, then stop.
- **Watching.** In React, `useWatch(playing?.driver, "card")` gives a ref; the element it lands on logs `enter`,
  `leave`, `down`, `up`, `click`, `focus` and `blur` as events for `card`. Put it on a still wrapper and the moving
  pose on a child, or a card that lifts away from the pointer gets a `leave` it did not earn. The driver's
  `watchView(target, element)` logs `in-view` and `out-of-view`, and its `emit(name, target)` logs anything else.
- **Tools.** Every page tool takes `--action hover:.card-hit@1000,leave:.card-hit@1120,click:.button@2000`, with
  `hover`, `leave`, `click`, `press`, `release` and `scroll:<px>`, done with the real mouse at those exact ms, in the
  element's middle or at a point after the time: `click:.stage@300(200,150)`. `motion:sample` and `motion:timeline`
  take `--events enter:card@1000,click:stage@1200(640,360)` instead, with no browser.
- **Keep it in the scene.** Read where and when things happened from `events`, never from variables a click handler
  sets: the tools replay events, and they cannot see a variable.

A scene has events of its own too: a landing, a catch, an impact. Export them as `cues`, made from moments, and pass
them to the player; the scene gets them merged with the page's:

```ts
export const cues: Events = [{ name: "catch", at: flight.at(hop.moments(BOUNCE).lastLanding), target: "ball" }];
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26, decay: 7, frequency: 2.2 });
// in the scene: hand goal y + give(time, events); in React: usePlayer(scene, clock, cues)
```

- **`react({ on, target, kind, amplitude, decay, frequency })`** adds a damped answer to every past event it names:
  `wobble` starts at rest and swings, like a hand taking a weight; `recoil` jumps to `amplitude` and swings back;
  `flash` jumps and fades, for a glow; `shake` jitters and dies. It is exactly 0 before the event. `decay` defaults to
  6 a second and `frequency` to 4 swings a second.
- **`player.on(name, listener)`** calls back each time forward play reaches an event of that name, a cue or the
  page's, for a sound or a class; a seek back calls nothing. The tools read a scene module's `cues` export.

## Physics

Use a move when the motion is designed: a squash on the beat, an overshoot of a set size. Use physics when it should
follow forces: many bodies, collisions, a pile settling.

```ts
import { builtinWorld, simulate } from "@motion5/physics";

const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 }, { restitution: 0.35 });
  world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: -40, restitution: 0.5 });
});

export const scene = (time: Time, events: Events) => ({
  ball: sim.pose("ball", time),
  contacts: mergeEvents(events, sim.events(time)),
});
```

- **Units.** Stage px, degrees and seconds, y down and turns clockwise, gravity in px a second squared. A body's `x`
  and `y` are its centre.
- **Turning.** Bodies turn when hit off centre: boxes tip and stack, balls roll. A body takes `angle` and `spin` (in
  degrees a second) to start with, and `fixedRotation: true` to never turn. `sim.pose` gives `rotation` too, turning
  around the body's centre, so leave the element's anchor at its centre and put a squash on a child element, as
  `Pile.tsx` does.
- **The port.** A world adds bodies (`circle` or `box`) and fixed colliders: `floor { y }`, `wall { x, side:
  "left" | "right" }`, and `segment { from, to }` for a ramp. A body takes `vx`, `vy`, `restitution` (bounce kept, 0
  to 1), `friction`, `drag` (speed lost a second) and `mass` (default its area). Two touching surfaces average
  their restitution and friction.
- **`simulate(world, build)`** builds once and steps at a fixed 1/120 s, keeping snapshots, so `sim.at(time)`,
  `sim.pose(id, time)` and `sim.events(time)` give the same answer at a time however the player got there.
  `sim.pose` is the move from the body's start: lay each element out where its body starts, centred on it and
  upright. Bodies still for half a second sleep until something fast hits them, so a heap comes to rest.
- **Bodies from events.** `simulate(world, build, { spawn })` calls `spawn(event, world)` for each event as play
  reaches it, and `spawn` may add bodies with `world.addBody`, ids new and the same for the same event, such as
  `` `bit${event.at}-${i}` ``; every click's bodies land in one world and pile on the last ones. Pass the scene's
  events to every question: `sim.at(time, events)`, `sim.bodies(time, events)` for the ids there, in order. Lay a
  spawned body's element out centred on the stage's top left corner and move it with `sim.place(id, time, events)`,
  which gives its place on the stage and opacity 0 until it exists; render a fixed pool of elements, one per id.
- **State.** `sim.at(time)` gives each body's `x`, `y`, `rotation`, `vx`, `vy` and `spin`, in px, degrees and seconds.
- **Contacts are events.** `sim.events(time)` holds a `contact` event per body, with the body's id as `target`, for
  every contact that started. Merge it with the page's events and answer with `react`: rigid bodies never squash,
  so a squash on landing is a `recoil` on `contact`.
- **Engines.** `builtinWorld()` is pure TypeScript with no dependency, and steps a few hundred turning bodies in
  about half a millisecond. Rapier does the same and more, and is the one for a thousand bodies or more: `const
  rapier = await rapierEngine()` from `@motion5/rapier` once at the top of the module, then pass `rapier()` instead
  of `builtinWorld()`. Its world's `native` and `rigidBody(id)` reach joints and the rest of Rapier; a scene that
  uses them needs Rapier. It loads about 2.4 MB of WebAssembly.
- **Heaps.** Bodies resting on each other overlap as boxes; mark them `data-motion-touch` with their own selector so
  `motion:check` reads the heap as meant.
- **Randomness.** Scatter with `seeded(seed)` from `@motion5/moves`, never `Math.random()`, so the scene is the same
  on every run and in every tool.

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
a count. Define `scene` and `clock` outside the component, because `usePlayer` restarts when either changes. To hand
the player to a child component, type the prop `Player<ReturnType<typeof scene>> | undefined` from
`@motion5/player`, or the whole `Playing<ReturnType<typeof scene>, EventDriver>` from `@motion5/react` when the child
also needs the driver.

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
npm run motion:review -- catch.html --watch .catch-ball,.catch-hand,.catch-word --to 4800
```

The one call of the loop: `motion:check`, `motion:read` and `motion:frames` together, each in its own browser at
once, printing `findings` (empty when clean), `motion` (the moves, the first 40), and the `sheet` path. Frames fall
at six even times unless `--at` names them; `--action` and `--out` work as below. It exits `1` on any finding.
The tools after it are for digging.

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
npm run motion:read -- timing.html --select .beat-dot,.beat-glyph --to 3000
```

Reads each match's own motion as moves, one line each, such as
`.beat-glyph[0] "T" y -700 → 0, 0-336 ms (336 ms), quadIn`: the channel (`x`, `y`, `rotation`, `scaleX`,
`scaleY`, `opacity`), from and to, start and end, and the ease named as `@motion5/moves` names it. A move that no named
ease fits gets the nearest name and a fitted `cubic-bezier`. A move splits where it turns back, so a hop reads as
rising and falling halves. Read it to check timing and eases in numbers before looking at frames. It reads any page,
including CSS and Web Animations, which the tools hold to the same paused clock. The page tools see elements, not
pixels a `<canvas>` draws: draw moving things as elements when you want `read` and `check` to judge them.

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
an ancestor's overflow is left out, but a dot passing behind a letter still counts. Mark an element meant to touch
another with `data-motion-touch="<selector>"`, such as `data-motion-touch=".ball"` on a foot, and their overlap is not
reported; an empty value lets it touch anything watched.

On the last frame it also reads every piece of text on the page, watched or not: text whose contrast against what is
behind it is under WCAG's 3:1 for large text or 4.5:1 for the rest, after its opacity, and text running off the
page's edge. The page tools seed `Math.random`, so a page that scatters things scatters them alike on every run.

```bash
npm run motion:render -- splash.html --to 4800 --out splash.mp4
```

Plays the page on the paused clock and writes a video, one frame per 16 ms at 62.5 frames a second, the same bytes on
every run. `--format gif` writes a 640 px GIF at 25 frames a second instead. Without `--out` it prints where it wrote
the file. It needs `ffmpeg` on the `PATH` and says so when it is missing. A person watches it at full speed; an agent
reads `motion:read` and frame sheets instead.

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
- A `recoil` or `flash` jumps on its event's frame; for a push that should start smoothly, use `wobble`.
- A move under a live clock needs a span: `drop(options, time)` with a live `time` sits at its start, because a
  live clock has no progress.

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
