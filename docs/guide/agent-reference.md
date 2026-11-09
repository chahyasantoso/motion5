# Agent reference

Every export a scene uses, by package, with a line on what it does and a short example. Look things up here instead
of reading source. How to put them together is in [the agent guide](./agent-motion.md). Units everywhere: stage px,
y down, degrees clockwise, ms on clocks and events, seconds inside physics.

## Index

- [`@motion5/moves`](#motion5moves): [time](#time), [lanes](#lanes), [moves](#moves), [eases and blends](#eases-and-blends), [poses](#poses), [events](#events), [writing a move](#writing-a-move)
- [`@motion5/player`](#motion5player)
- [`@motion5/dom`](#motion5dom): [rendering](#rendering), [drivers](#drivers)
- [`@motion5/react`](#motion5react)
- [`@motion5/rig`](#motion5rig)
- [`@motion5/physics`](#motion5physics) and [`@motion5/rapier`](#motion5rapier)
- [`@motion5/three`](#motion5three)
- [Commands](#commands)
- [Not for scenes](#not-for-scenes)

## @motion5/moves

### Time

**`Time`**: `{ progress, clock }`, what every move and scene takes. `progress` runs 0 to 1.

**`Clock`**: `{ kind: "timed", elapsed, length }`, `{ kind: "live", elapsed }` or `{ kind: "untimed" }`; ms.

**`UNTIMED`**: the untimed clock.

**`atProgress(progress)`**: a time at a progress with no clock, for tests.
```ts
drop({ distance: 300 }, atProgress(0.5));
```

**`liveAt(ms)`**: a live time `ms` after the page started; progress stays 0.
```ts
scene(liveAt(1200), events);
```

**`elapsedOf(clock)`**: a clock's ms, or `undefined` for an untimed one.
```ts
const ms = elapsedOf(time.clock) ?? 0;
```

**`timeAt(time, ms)`**: `time` moved to `ms` on its own clock, to read a signal a moment earlier or later, such as a
turn rate; an untimed time stays as it is. Pass it the scene's time, not an eased one.
```ts
const ms = elapsedOf(time.clock) ?? 0;
const turnRate = ((heading(timeAt(time, ms + 8)) - heading(timeAt(time, ms - 8))) * 1000) / 16;
```

**`span(fromMs, toMs, durationMs)`**: a stretch of the scene; `.of(time, ease?)` is a move's time inside it, `.at(share)`
the ms a share falls on. Reads a live clock's ms directly. **`Span`** is its type.
```ts
const flight = span(400, 2400, durationMs);
hop(options, flight.of(time, ease.quadOut));
const landMs = flight.at(hop.moments(options).lastLanding);
```

**`window(time, from, to)`**: `time` inside the shares `from` to `to`; prefer `span`. **`windowed(progress, from, to)`**
does the same to a bare number.
```ts
window(time, 0.25, 0.5);
```

### Lanes

**`lanes(lengths, stagger, { from, spacing })`**: lanes for staggered targets; `stagger` is a share of a lane's length.
`from` picks which start first, a **`LaneOrigin`**: `"start"` (default), `"end"`, `"center"`, `"edges"` or `{ seed }`;
`spacing`, an ease, bends the start times. **`Lanes`** (with each lane's `starts`) and **`LanesOptions`** are its types.
```ts
const LETTERS = lanes([1, 1, 1, 1], 0.25);
const BURST = lanes([1, 1, 1, 1, 1], 0.2, { from: "center", spacing: ease.quadOut });
```

**`lane(time, index, lanes)`**: lane `index`'s time inside `time`.
```ts
drop(options, lane(word.of(time), i, LETTERS));
```

**`laneTime(position, index, lanes, durationMs?)`**: the same from a bare progress.

### Moves

Each move is `move(options, time)` and gives a pose or a shape. `move.options` lists its options with ranges;
`move.moments(options)` gives named shares of its progress.

**`drop`**: falls from `distance` px above rest and lands with `squash`; moment `landing`.
```ts
drop({ distance: 700, squash: 0.18 }, time);
```

**`hop`**: `bounces + 1` landings, each `decay` as high, arriving from `dx` px left (negative: right); also gives
`contact: { hits, justHit }`: `hits` counts the landings so far, and `justHit` runs 1 at a landing to 0 a fifth of a
flight away, for what the landing touches; moments `landings`, `lastLanding`. `bounces: 0` is one arc.
```ts
const ball = hop({ height: 260, bounces: 2, decay: 0.35, squash: 0.45, dx: -1100 }, time);
const give = ball.contact.hits === 3 ? squashed(0.1, ball.contact.justHit) : {};
```

**`wipe`**: a reveal circle `{ x, y, radius }` growing to `radius` from `x`, `y`.
```ts
applyReveal(cover, wipe({ radius: 1500, x: 640, y: 360 }, time));
```

**`trace`**: a drawn share `{ drawn }` from 0 to 1, for a stroke.
```ts
applyDrawn(path, trace({}, time));
```

**`rope`**: anchors of a rope following `{ points }`, the third argument; options `angle`, `pin`, `release`, `overshoot`,
`ripple`.
```ts
applyPath(path, toCubics(rope({ angle: 0, pin: "start" }, time, { points })));
```

### Eases and blends

**`ease`**: named curves, each `(share) => share`: `linear`, and `sine`, `quad`, `cubic`, `quart`, `expo`, `back`
with `In`, `Out` and `InOut`, plus `elasticOut`, `bounceOut`, `bounceIn`. **`Ease`** is their type.
```ts
span(0, 600, durationMs).of(time, ease.backOut);
```

**`backEase({ amount, direction })`**: a back curve that pulls back by `amount` before it goes (`"in"`), overshoots by it
as it ends (`"out"`), or both (`"inOut"`); `amount: 0` is the cubic. **`EaseDirection`** is the direction's type.
```ts
const crouch = mix(0, 400, leap.of(time, backEase({ amount: 3, direction: "in" })).progress);
```

**`springEase({ stiffness, damping })`**: a spring from 0 settling on 1, fitted to the span; lower damping rings more.
Feed it to values, not to a move's progress.
```ts
const scale = mix(0, 1, pop.of(time, springEase({ stiffness: 170, damping: 10 })).progress);
```

**`spring(offset, speed, seconds, { stiffness, damping })`**: where a unit-mass spring is after `seconds`, as a
**`SpringState`** `{ offset, speed }`. **`SpringOptions`** is its options' type.
```ts
const { offset } = spring(-1, 0, 0.2, { stiffness: 170, damping: 12 });
```

**`trail(signal, { stiffness, damping, stepMs, rest })`**: a value chasing `signal(time, events)` on a spring, for
follow-through and drag; the signal itself with no clock. Pass the scene's time: the signal applies its own spans
and eases, since an eased time cannot be moved to another ms. **`TrailOptions`** is its options' type.
```ts
const tail = trail((t) => body(t).rotation ?? 0, { damping: 10 });
tail(time, events);
```

**`mix(a, b, share)`**, **`mixPoint(a, b, share)`**, **`mixAngle(a, b, share)`** (the short way round),
**`mixPose(a, b, share)`** (a missing field at its rest).
```ts
const hand = mixPoint(REST, CATCH, lunge.of(time, ease.cubicInOut).progress);
```

**`keyframes(durationMs, start, keys, blend)`**: a value through keys `{ at, to, ease }` in ms, then holding.
**`Key`** is a key's type.
```ts
const lean = keyframes(durationMs, 0, [{ at: 1700, to: -9, ease: ease.sineInOut }, { at: 2400, to: 0 }], mix);
lean(time);
```

**`seeded(seed)`**: repeatable random numbers from 0 up to 1; use it, never `Math.random()`.
```ts
const random = seeded(5);
const x = 400 + random() * 200;
```

### Poses

**`Pose2d`**: `{ x, y, rotation, scale, scaleX, scaleY, opacity, anchor }`, all optional. **`Anchor`**: `"center"`,
`"bottom"`, `"top"`, `"left"`, `"right"`.
```ts
const carry: Pose2d = { x: 10, anchor: "bottom" };
```

**`combine(poses)`**: poses on one target as one; offsets and turns add, scales multiply, the first anchor stays.
```ts
combine([drop(options, time), { opacity: 0.5 }]);
```

**`squashed(squash, weight, anchor?)`**: a squash pose `weight` of the way in against the `anchor` side, `"bottom"`
when absent; `"left"` and `"right"` squash sideways.
```ts
combine([slide, squashed(0.3, hit, "right")]);
```

**`POSE_2D_FIELDS`**: every field name of `Pose2d`.

**`Point2d`**, **`Anchor2d`**, **`Cubic2d`**, **`Reveal`**, **`Drawn`**: the shapes moves give: a point with an id, a rope
anchor, a path segment, a reveal circle, a drawn share.

**`toCubics(anchors)`**: a rope's anchors as path segments for `applyPath`.

**`along(cubics, share, { turn })`**: the `{ x, y }` pose `share` of the way along a path by distance, relative to the
target's rest, so a path ending at 0,0 arrives at rest; `turn: true` adds `rotation`, the heading in degrees (down is 90).
```ts
const pose = along(toCubics(anchors), ease.cubicInOut(time.progress), { turn: true });
```

**`velocity(signal, time, events, stepMs?)`**: the `{ vx, vy }` px per second a pose signal moves at `time`; zero with no clock. Pass the scene's time, not an eased one.
```ts
const { vx, vy } = velocity(ball, time, events);
```

**`smear({ vx, vy }, { stretch, max })`**: a pose stretching a body along its travel, area kept, and the `heading`; wrap
content that must not turn in an inner element posed `{ rotation: -heading }`.
```ts
const { pose, heading } = smear(velocity(ball, time, events), { stretch: 0.2, max: 2 });
```

### 3D poses

**`Pose3d`**: `{ x, y, z, rotation, rotationX, rotationY, scale, scaleX, scaleY, scaleZ, opacity }`, all optional; y up,
turns in degrees on the Z-X-Y Euler (`rotation` is about z). A `Pose2d` is refused where a `Pose3d` goes.
```ts
const lid: Pose3d = { y: 0.4, rotationX: -70 };
```

**`lift2d(pose, { unitsPerPx })`**: a 2D pose on the 3D xy plane, px scaled to units, y and the turn flipped, the
anchor dropped; every 2D move reaches 3D through it.
```ts
const ball = lift2d(hop({ height: 260, bounces: 2 }, time), { unitsPerPx: 0.01 });
```

**`combine3d(poses)`**: poses on one target as one; offsets add, scales multiply, turns compose in order, and turns
about one shared axis add exactly, so a spin keeps its winding.
```ts
combine3d([ball, { rotationY: spin }]);
```

**`mixPose3d(a, b, share)`**: blends two poses, turns along the short arc and past the ends for a share past 1; a
missing field at its rest. **`mixPoint3d(a, b, share)`** blends `{ x, y, z }`.
```ts
const head = mixPose3d(LOOK_LEFT, LOOK_RIGHT, turn.of(time, springEase({ stiffness: 170, damping: 12 })).progress);
```

**`trailTurn(signal, { stiffness, damping, stepMs, rest })`**: a turn chasing a `Pose3d` signal's turn on a spring,
the short way round, resting exactly on it; give it the scene's time. Trail a position with three `trail` calls.
```ts
const head = trailTurn((t) => body(t), { damping: 12 });
head(time, events);
```

**`squashed3d(squash, weight, axis?)`**: shortens `axis` (`"y"` when absent) and widens the other two, keeping volume.
```ts
combine3d([squashed3d(0.3, landing), ball]);
```

**`Anchor3d`**, **`Cubic3d`**: the 3D path anchor and segment, `Anchor2d` and `Cubic2d` with `z`, `inZ`, `outZ`.
**`toCubics3d(anchors)`**: 3D anchors as path segments.

**`along3d(cubics, share, { face })`**: the `{ x, y, z }` `share` of the way along a 3D path by distance; `face: true`
adds the turn of local +x onto the path, with no roll.
```ts
const pose = along3d(toCubics3d(anchors), flight.of(time, ease.sineInOut).progress, { face: true });
```

**`velocity3d(signal, time, events, stepMs?)`**: the `{ vx, vy, vz }` units per second a `Pose3d` signal moves at the
scene's time, never read past the clock's ends; zero with no clock.

**`smear3d({ vx, vy, vz }, { stretch, max })`**: `{ pose, turn }`: `pose` turns local +x onto the travel and stretches
it by `stretch` per unit a second up to `max`, volume kept; an inner object takes `turn` so its content stays upright.
```ts
const { pose, turn } = smear3d(velocity3d(body, time, events), { stretch: 0.08, max: 1.8 });
```

**`aim(from, to, up?)`**: the turn that points local -z, a camera's forward, from `from` at `to`, `up` +y when absent,
no roll; `{}` when they meet.
```ts
const camera = { ...eye, ...aim(eye, { x: 0, y: 0.5, z: 0 }) };
```

**`orbit({ target, radius, azimuth, elevation })`**: a point `radius` from `target`, azimuth in degrees about +y from +z
toward +x, elevation up from the ground plane; a camera move is a `span` on `azimuth`.
```ts
const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 6, azimuth: mix(-30, 30, pan.of(time).progress), elevation: 20 });
```

### Events

**`MotionEvent`**: `{ name, at, target?, x?, y? }`; `at` in ms, `x` and `y` from the watched element's corner.
**`Events`**: a list of them, oldest first. **`NO_EVENTS`**: the empty list.

**`follow({ start, on, target, stiffness, damping, rest })`**: a spring each named event sends towards its value,
turning back with no jump. **`FollowOptions`** is its options' type.
```ts
const lift = follow({ start: 0, on: { enter: -12, leave: 0 }, target: "card" });
lift(time, events);
```

**`react({ on, target, kind, amplitude, decay, frequency })`**: a damped answer to each past event: `recoil`, `wobble`,
`flash` or `shake`; 0 before. **`ReactOptions`** and **`ReactionKind`** are its types.
```ts
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26 });
give(time, events);
```

**`mergeEvents(...lists)`**: lists as one, oldest first.
```ts
const all = mergeEvents(events, sim.events(time));
```

**`createLoopCycle({ duration, delay, repeat, yoyo })`**: the delay, repeat and yoyo arithmetic a clock driver uses;
`.advance(ms)` gives a **`LoopCycleStep`**. **`LoopCycle`** and **`LoopCycleOptions`** are its types.

### Writing a move

**`defineMove({ id, description, options, moments, run })`**: makes a move from one declaration. The call checks
the options against `options` (kinds, `min`, `max`, `enum`) and fills defaults; `run(options, time, input)` takes an
optional third argument of any type, which callers must then pass. Its types: **`Move`**, **`MoveDeclaration`**,
**`Moments`**, **`OptionField`**, **`OptionFields`**, **`Options`**, **`OptionsIn`**, **`InputArgs`**.
```ts
const slide = defineMove({
  id: "slide", description: "Slides in.",
  options: { distance: { kind: "number", min: 0, description: "px" } },
  moments: () => ({}),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) }),
});
```

## @motion5/player

**`Scene`**: `(time, events) => targets`.

**`play(scene, driver, { cues })`**: runs a scene on a driver; **`Player`** has `.values`, `.time`,
`.subscribe(target, fn)`, `.refresh()`, `.replace(scene, cues?)` (a new scene, and cues when given, at the same time, keeping the driver and listeners), `.on(name, fn)` for events passed going forward, `.dispose()`.
**`PlayOptions`** holds `cues`.
```ts
const player = play(scene, clock(), { cues });
player.on("catch", () => sound.play());
```

**`manualDriver({ durationMs })`**: a driver moved by hand; `.seek(progress)`, `.seekMs(ms)`. **`ManualDriver`** is its
type; **`Driver`** is what any driver gives: `now()`, `events?()`, `subscribe(fn)`, and `options` it was made with, so a host can tell a changed driver from the same one.
```ts
const driver = manualDriver({ durationMs });
play(scene, driver);
driver.seekMs(1200);
```

## @motion5/dom

### Rendering

**`applyPose(element, pose)`**: writes a pose as a CSS transform, origin and opacity.
```ts
player.subscribe("title", (pose) => applyPose(title, pose));
```

**`applyReveal(element, reveal)`**: clips to a circle. **`applyDrawn(path, drawn, length?)`**: draws a stroke a share
of the way. **`applyPath(path, cubics)`**: sets an SVG path's `d`.
```ts
applyReveal(cover, wipe({ radius: 1500, x: 640, y: 360 }, time));
```

**`cssTransform(values)`**, **`cssOrigin(anchor)`**, **`cssClip(reveal)`**, **`cssDash(drawn, length)`**,
**`pathData(cubics)`**: the CSS strings the above write. **`TRANSFORM_KEYS`**: the pose keys a transform reads.
**`RenderTarget`** and **`RenderStyle`**: an element, or anything with a `style`.

### Drivers

**`clockDriver({ duration, delay, repeat, yoyo, autoplay, frames, reducedMotion })`**: a timed clock on the page's
frames; `.play()`, `.pause()`, `.seek(p)`, `.replay()`, `.dispose()`. When the person prefers reduced motion it shows the
last frame and never ticks; `reducedMotion: "play"` opts out. **`ClockDriver`** and **`ClockOptions`** are its types.
```ts
export const clock = () => clockDriver({ duration: durationMs });
```

**`scrollDriver({ start, end, target })`**: progress 0 to 1 as the page scrolls from `start` to `end` px; untimed.
**`ScrollTarget`** is what it listens to.
```ts
const scrolled = () => scrollDriver({ start: 0, end: 1200 });
```

**`eventDriver({ introMs, settleMs })`**: a live clock that logs events: `.watch(target, element)` for `enter`,
`leave`, `down`, `up`, `click`, `focus`, `blur` with `x` and `y`; `.watchView(target, element)` for `in-view` and
`out-of-view`; `.emit(name, target, point)`. **`EventDriver`**, **`EventDriverOptions`**, **`EventSource`** and
**`PointerLike`** are its types; **`WATCHED`** maps DOM event names to motion event names.
```ts
export const clock = () => eventDriver({ introMs: 900 });
```

**`FrameSource`**: where frames come from, for a test's fake frames.

## @motion5/react

**`usePlayer(scene, createDriver, cues?)`**: plays while the component stays; gives **`Playing`** `{ player, driver }` or
`undefined`. Define all three outside the component. **`OwnedDriver`**: a driver it may dispose.
```ts
const playing = usePlayer(scene, clock, cues);
```

**`PlayerHostProvider`** gives every `usePlayer` below it a **`PlayerHost`** `{ createDriver?, guard? }`: `createDriver(own)` answers the
driver to play on, which the host owns and `usePlayer` never disposes; `guard(scene)` wraps each scene. Under a host a
saved file swaps in place: a new `scene` or `cues` calls `player.replace` and keeps the player and its time.
**`driverKeeper()`** makes a **`DriverKeeper`**, one driver per host: while a factory makes a driver of the same members
and equal `options`, it keeps the old one with its state; otherwise it takes the new one, seeks it to the old time, plays
it and disposes the old. `current()` reads it and `subscribe` tells each time it changes. With no host, nothing changes.
**`useTarget(player, target, render?)`**: a ref that writes a target onto the element every step, with no render. For a
list target, such as one pose per letter, give each element its own `useTarget` on the list with a `render` that picks
its index, as `Letter` in `apps/react-demo/src/principles.tsx` does.
```tsx
const ball = useTarget(playing?.player, "ball");
const Letter = ({ player, i, char }: { player: Player<Frame> | undefined; i: number; char: string }) => {
  const render = useCallback((el: HTMLElement, poses: Frame["letters"]) => applyPose(el, poses[i] ?? {}), [i]);
  return <span ref={useTarget(player, "letters", render)}>{char}</span>;
};
```

**`useValue(player, target, select)`**: re-renders when `select`'s answer changes.
```ts
const landed = useValue(playing?.player, "ball", (pose) => (pose.y ?? 0) === 0);
```

**`useWatch(driver, target)`**: a ref whose element's events the driver logs as `target`'s; put it on a still element.
```ts
const hit = useWatch(playing?.driver, "card");
```

**`centreIn(from, to)`**: `from`'s layout centre measured from `to`'s corner, an **`Offset`**; **`LayoutBox`** is what
it measures. **`mergeRefs(...refs)`**: one ref that sets several.
```ts
const centre = centreIn(dot, stage);
```

## @motion5/rig

**`buildChain(bones)`**: a checked bone tree from **`Bone2d`** rows `{ id, parentId?, length, rotation?, minRotation?,
maxRotation? }`; ids type every answer. **`Chain2d`** is its type.
```ts
const arm = buildChain([{ id: "upper", length: 170 }, { id: "lower", parentId: "upper", length: 150 }]);
```

**`ik(chain, goals, { base, flip })`**: rotations that bring each goal's bone tip to its **`Goal2d`** `{ x, y }`; a
**`SolveResult`** with `rotations` and a **`SolveQuality`** `quality.kind` (`"too-far"` past reach). `flip` bends the
elbow the other way.
```ts
const { rotations } = ik(arm, { lower: { x: 486, y: 412 } }, { base, flip: true });
```

**`fk(chain, { rotations, base })`**: each bone's tip as a **`WorldFrame`** `{ x, y, rotation }`. **`ChainPose`** is the
options' type.
```ts
const tips = fk(arm, { rotations, base });
```

**`chainPoses(chain, { rotations, base })`**: **`BonePose`**s for bone elements laid out at the base, and **`TipPose`**
offsets for joints.
```ts
const { bones, tips } = chainPoses(arm, { rotations, base });
```

**`ORIGIN`**: the world frame at 0, 0, unturned.

## @motion5/physics

**`builtinWorld()`**: the pure engine, a **`PhysicsWorld`**: `addBody`, `addCollider`, `setGravity`, `step`, `body`,
`drainContacts`, `snapshot`, `restore`.

**`BodySpec`**: `{ id, shape, x, y, vx?, vy?, angle?, spin?, fixedRotation?, restitution?, friction?, drag?, mass? }`;
**`Shape`** `{ kind: "circle", radius }` or `{ kind: "box", width, height }`. **`Surface`**: `{ restitution?, friction? }`.
**`Collider`**: `{ kind: "floor", y }`, `{ kind: "wall", x, side }`, `{ kind: "segment", from, to }`.
**`BodyState`**: `{ x, y, rotation, vx, vy, spin }`. **`Contact`**: `{ a, b }` ids that started touching.
```ts
world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: 0, restitution: 0.5 });
```

**`simulate(world, build, { dt, checkpointMs, maxCheckpoints, durationMs, spawn })`**: a **`Simulation`**, seekable:
`at(time, events)` states, `bodies(time, events)` ids, `pose(id, time, events)` the move from its start,
`place(id, time, events)` a **`Placed`** on the stage with opacity 0 before it exists, `events(time, events)` its
`contact` events. **`SimulateOptions`** are its options; `spawn(event, world)` adds bodies through a **`Spawner`**.
```ts
const sim = simulate(builtinWorld(), (world) => {
  world.setGravity(0, 2600);
  world.addCollider("floor", { kind: "floor", y: 600 });
}, {
  spawn: (event, world) => {
    if (event.name === "click")
      world.addBody({ id: `bit${event.at}`, shape: { kind: "box", width: 14, height: 8 }, x: event.x ?? 0, y: event.y ?? 0 });
  },
});
sim.place(`bit${click.at}`, time, events);
```

## @motion5/rapier

**`rapierEngine()`**: loads Rapier once and gives a factory of **`RapierWorld`**s, which are `PhysicsWorld`s with
`native` and `rigidBody(id)` for joints and the rest of Rapier.
```ts
const rapier = await rapierEngine();
const sim = simulate(rapier(), build);
```

## @motion5/three

**`applyPose2d(object, pose, rest?)`**: writes a 2D pose on a Three.js object, flipping y and turns for its axes.
```ts
player.subscribe("ball", (pose) => applyPose2d(mesh, pose));
```

**`applyPose3d(object, pose, rest?)`**: writes a `Pose3d` on a Three.js object, y up, turns in degrees on Z-X-Y; a
missing field writes its rest.
```ts
player.subscribe("ball", (pose) => applyPose3d(mesh, pose));
```

**`useTarget3d(player, target, { invalidate })`** from `@motion5/three/react`: a ref for an `Object3D` that writes the
target's `Pose3d` every step with no render; in React Three Fiber pass `invalidate` when the canvas renders on demand.
```tsx
const ball = useTarget3d(playing?.player, "ball");
return <mesh ref={ball} />;
```

## Commands

Run from the repository root. A page is a path inside the site with no leading `/`; the site is `apps/react-demo`
unless `--root <dir>` serves another folder or `--url <address>` names a running server, and `--root` and `--out` are
read from the folder you run in. Page tools open the page in Chrome or Edge under a paused clock that also holds CSS
and Web Animations, seed `Math.random`, print JSON, and exit `1` on page errors. Each takes `--size WxH` and
`--action`: `hover:sel@ms`, `leave:sel@ms`, `click:sel@ms`, `press:sel@ms`, `release:sel@ms`, `scroll:px@ms`, with
`(x,y)` after the ms for a point on the element; a selector the page lacks fails at once.

- **`motion:new <name> [--three]`**: writes `<name>.html`, its entry, a component and `src/<name>-scene.ts` in
  `apps/react-demo`; `--three` makes the component a Three.js stage, one mesh per target bound with `useTarget3d`, and
  the scene returns `Pose3d` targets.
- **`motion:review <page> --watch sel,sel --to ms [--at ms,ms] [--out dir]`**: `check`, `read` and `frames` at once:
  `findings`, `motion` (the first 40 moves) and `sheet`; frames at six even times by default; exits `1` on a finding.
  On a Three.js page watch `canvas`: the sheet shows its pixels, and the scene-file form below checks its values.
- **`motion:review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n]`**: no page: samples
  every field of every target each 16 ms and finds a step over its limit in one frame (positions over `--jump`, default
  150 for px; turns the short way round over `--turn`, default 150; scales and opacity over `--ratio`, default 1.5), a
  final hold under `--hold`, and a target still moving at the end. For a 3D scene give `--jump` in world units.
- **`motion:check <page> --watch sel,sel --to ms`**: every 16 ms: watched elements overlapping over `--overlap`
  frames (12), a centre jumping over `--jump` px a frame (150), a final hold under `--hold` ms (500), anything still
  moving at the end; on the last frame, text under WCAG contrast (3:1 large, 4.5:1 other) and text off the page's
  edge. Overlaps compare what a viewer sees: hidden, transparent or clipped-out boxes are left out. An element with
  `data-motion-touch="<selector>"` may touch what the selector matches; empty, anything.
- **`motion:read <page> --select sel,sel --to ms`**: each element's own moves, one line each: channel (`x`, `y`,
  `rotation`, `scaleX`, `scaleY`, `opacity`), from and to, start and end, and the ease by name, or the nearest name
  and a fitted `cubic-bezier`. A move splits where it turns back.
- **`motion:frames <page> --at ms,ms [--out dir]`**: a PNG per time and a labelled `sheet.png`; read the sheet.
  `--onion sel --from ms --to ms --every ms` draws an element at each step on one frame, with its path.
- **`motion:probe <page> --at ms,ms --select sel`**: each match's box, centre, transform, colours, opacity, z-index.
- **`motion:render <page> --to ms [--out file] [--format gif]`**: an MP4 at 62.5 frames a second, the same bytes each
  run, or a 640 px GIF at 25; needs `ffmpeg`.
- **`motion:sample <scene.ts> (--at ms,ms | --progress p,p) [--nodes id,id] [--fields a,b] [--events list]`**: exact
  values with no browser; reads the module's `cues`.
- **`motion:timeline <scene.ts> [--events list]`**: one bar per target from its first change to its rest.
- **`motion:points <points.json> --spacing px`**: a list of `{ x, y }` resampled to an even spacing, for a rope.

## Not for scenes

These are exported for other packages, and a scene does not use them. They are named so this reference stays
complete.

- **`@motion5/rig`**: `composeChain`, `Link2d`, `PivotOffset`, `eulerFromMatrix3d`, `IDENTITY_MATRIX3`, `matrixFromEuler3d`, `matrixFromQuaternion`, `multiplyMatrix3`, `quaternionFromEuler3d`, `slerpQuaternion`, `swingFrame3d`, `swingTwist3d`, `transposeMatrix3`, `Euler3d`, `Matrix3`, `PivotOffset3d`, `Quaternion`, `SwingTwist3d`, `Vec3`, `WorldFrame3d`, `UNBOUND_POLE3D`, `Pole3d`, `ChainMember3d`, `FREE_JOINT3D`, `JointLimit3d`, `chainShape3d`, `solveChain3d`, `ChainShape3d`.
