# Agent call examples

Hand-written call examples and notes, by package. The exports themselves, with signatures, are generated per package at
`packages/<package>/docs/reference/README.md`. How to put them together is in [the agent guide](./agent-motion.md).
Units everywhere: stage px, y down, degrees clockwise, ms on clocks and events, seconds inside physics.

## Index

- [`@gerak/moves`](#gerakmoves)
- [`@gerak/player`](#gerakplayer)
- [`@gerak/dom`](#gerakdom)
- [`@gerak/react`](#gerakreact)
- [`@gerak/rig`](#gerakrig)
- [`@gerak/physics`](#gerakphysics) and [`@gerak/rapier`](#gerakrapier)
- [`@gerak/three`](#gerakthree)
- [Commands](#commands)

## @gerak/moves

Time, lanes, moves, eases, poses and events: everything a scene is made of. A `Time` is `{ progress, clock }` and
`progress` runs 0 to 1.

```ts
drop({ distance: 300 }, atProgress(0.5));
scene(liveAt(1200), events);
const ms = elapsedOf(time.clock) ?? 0;
const turnRate = ((heading(timeAt(time, ms + 8)) - heading(timeAt(time, ms - 8))) * 1000) / 16;

const flight = span(400, 2400);
hop(options, flight.of(time, ease.quadOut));
const landMs = flight.at(hop.moments(options).lastLanding);

const card = (time: Time) => sequence(time, [[enter, (t) => rise(options, t)], [leave, (t) => fade({}, reversed(t))]]);
const shots = chain([2000, 1500, 3000], { overlap: 300 });
const drift = loop(4000, { yoyo: true }).of(time);

const LETTERS = lanes([1, 1, 1, 1], 0.25);
const BURST = lanes([1, 1, 1, 1, 1], 0.2, { from: "center", spacing: ease.quadOut });
const RIPPLE = lanes([1, 1, 1, 1], 0.2, { by: distances });
drop(options, LETTERS.of(word.of(time), i));
```

Each move is `move(options, time)`. `move.options` lists its options with ranges; `move.moments(options)` gives named
shares of its progress. The catalog, not this page, says what each move does and takes: `npx gerak moves` prints
one line per move, `--role <role>` one role, and `<id>` one move in full with the shape of its call. By role:

- `exit`: none of its own; `reversed(time)` turns any move into one
- `enter`: **`drop`**, **`hop`**, **`rise`**, **`slide`**, **`pop`**, **`fade`**, **`unfold`**, **`swing`**
- `emphasis`: **`pulse`**, **`shake`**, **`wobble`**, **`nod`**
- `travel`: **`arc`**
- `reveal`: **`wipe`**, **`trace`**
- `follow`: **`rope`**
- `modifier`: **`anticipate`**, **`overshoot`**

What a move answers, which the catalog does not print:

- An `enter`, `emphasis` or `travel` move answers a `Pose2d`. `hop` adds `contact: { hits, justHit }`: `hits` counts
  the landings so far, and `justHit` runs 1 at a landing to 0 a fifth of a flight away, for what the landing touches.
- `wipe` answers a `Pose2d` of `clipX`, `clipY` and `clipRadius`, and `trace` one of `drawn` and `drawnFrom`; `trace`'s
  `tail` (default 1) is the share of the path kept drawn behind the head. `applyValue` writes both.
- `rope` takes the points it follows as a third argument and answers anchors for `toCubics`.
- `reversed(time)` and `repeated(time, count)` are functions of time, not moves: each answers a time, and any move
  or value can be played through it. `anticipate` and `overshoot` are moves that take another move's answer as a
  third argument, a `(time) => pose` function, and act on every number that adds, `custom` numbers included.

```ts
applyPath(path, toCubics(rope(options, time, { points })));
rise(options, reversed(time));
pulse(options, repeated(time, 3));
overshoot({ share, amount }, time, (t) => anticipate({}, t, (u) => slide(options, u)));
```

Eases are `(share) => share`; feed `springEase` to values, not to a move's progress. `trail`, `follow` and `velocity`
take the scene's time, never an eased one.

```ts
span(0, 600).of(time, ease.backOut);
const crouch = mix(0, 400, leap.of(time, backEase({ amount: 3, direction: "in" })).progress);
const scale = mix(0, 1, pop.of(time, springEase({ stiffness: 170, damping: 10 })).progress);
const { offset } = spring(-1, 0, 0.2, { stiffness: 170, damping: 12 });

const tail = trail((t) => body(t).rotation ?? 0, { damping: 10 });
tail(time, events);

const hand = mixPoint(REST, CATCH, lunge.of(time, ease.cubicInOut).progress);
const lean = keyframes(0, [{ at: 1700, to: -9, ease: ease.sineInOut }, { at: 2400, to: 0 }], mix);
lean(time);

const random = seeded(5);
const x = 400 + random() * 200;
```

A pose may carry `custom`, a record of numbers the piece names itself; each rests at 0 and adds.

```ts
const carry: Pose2d = { x: 10, anchor: "bottom" };
combine([drop(options, time), { opacity: 0.5 }]);
combine([slide, squashed(0.3, hit, "right")]);
const pose = along(toCubics(anchors), ease.cubicInOut(time.progress), { turn: true });
const { vx, vy } = velocity(ball, time, events);
const { pose, heading } = smear(velocity(ball, time, events), { stretch: 0.2, max: 2 });
```

3D poses are `Pose3d`: y up, turns in degrees on the Z-X-Y Euler (`rotation` is about z). A `Pose2d` is refused where a
`Pose3d` goes; every 2D move reaches 3D through `lift2d`.

```ts
const lid: Pose3d = { y: 0.4, rotationX: -70 };
const ball = lift2d(hop({ height: 260, bounces: 2 }, time), { unitsPerPx: 0.01 });
combine3d([ball, { rotationY: spin }]);
const head = mixPose3d(LOOK_LEFT, LOOK_RIGHT, turn.of(time, springEase({ stiffness: 170, damping: 12 })).progress);
const head = trailTurn((t) => body(t), { damping: 12 });
head(time, events);
combine3d([squashed3d(0.3, landing), ball]);
const pose = along3d(toCubics3d(anchors), flight.of(time, ease.sineInOut).progress, { face: true });
const { pose, turn } = smear3d(velocity3d(body, time, events), { stretch: 0.08, max: 1.8 });
const camera = { ...eye, ...aim(eye, { x: 0, y: 0.5, z: 0 }) };
const eye = orbit({ target: { x: 0, y: 0, z: 0 }, radius: 6, azimuth: mix(-30, 30, pan.of(time).progress), elevation: 20 });
```

Events are `{ name, at, target?, x?, y? }`, `at` in ms and `x`, `y` from the watched element's corner.

```ts
const lift = follow({ start: 0, on: { enter: -12, leave: 0 }, target: "card" });
lift(time, events);
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26 });
give(time, events);
const all = mergeEvents(events, sim.events(time));
```

Writing a move: `defineMove` checks the options against `options` (kinds, `min`, `max`, `enum`) and fills defaults;
`run(options, time, input)` takes an optional third argument of any type, which callers must then pass. `VALUE_FIELDS`
is the one table of what a value's fields are (`rest`, how it combines, whether its path must be `smooth`, whether a
reveal `shows` it); beside the transform and `opacity` its rows are `blur`, `drawn`, `drawnFrom`, `clipX`, `clipY` and
`clipRadius`. `checkMove(move)` from `@gerak/tools/scene` is the gate: it samples the example, and the example at each
ranged option's least and greatest, and answers a list of findings, empty when the move holds its role's rest, stays
finite, has its descriptions and takes no jump. `describeFinding(id, finding)` turns one into a line.

```ts
const slide = defineMove({
  id: "slide", role: "enter", description: "Slides in.",
  options: { distance: { kind: "number", min: 0, description: "px" } },
  example: { options: { distance: 300 } },
  moments: () => ({}),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) }),
});
```


## @gerak/player

A scene is `(time, events) => targets`; `play` runs it on a driver.

```ts
const player = play(scene, clock(), { cues });
player.on("catch", () => sound.play());

const driver = manualDriver({ durationMs });
play(scene, driver);
driver.seekMs(1200);
```


## @gerak/dom

Writes a value onto an element, and the drivers that move a scene on the page's frames, scroll or pointer events.

```ts
player.subscribe("title", (pose) => applyValue(title, pose));
applyValue(cover, wipe({ radius: 1500, x: 640, y: 360 }, time));

export const clock = () => clockDriver({ duration: durationMs });
const scrolled = () => scrollDriver({ start: 0, end: 1200, length: durationMs });
export const clock = () => eventDriver({ introMs: 900 });
```


## @gerak/react

Hooks that play a scene while a component stays and write each target onto its element with no render. Define the
scene, driver factory and cues outside the component. For a list target, give each element its own `useTarget` on the
list with a `render` that picks its index.

```tsx
const playing = usePlayer(scene, clock, cues);
const ball = useTarget(playing?.player, "ball");
const Letter = ({ player, i, char }: { player: Player<Frame> | undefined; i: number; char: string }) => {
  const render = useCallback((el: HTMLElement, poses: Frame["letters"]) => applyValue(el, poses[i] ?? {}), [i]);
  return <span ref={useTarget(player, "letters", render)}>{char}</span>;
};
const landed = useValue(playing?.player, "ball", (pose) => (pose.y ?? 0) === 0);
const hit = useWatch(playing?.driver, "card");
const centre = centreIn(dot, stage);
```


## @gerak/rig

Joint chains: `buildChain` checks a bone tree, `ik` solves it to goals, `fk` and `chainPoses` read it back as poses.
Exports below that no scene calls (matrices, quaternions, 3D chain solving) are there for other packages.

```ts
const arm = buildChain([{ id: "upper", length: 170 }, { id: "lower", parentId: "upper", length: 150 }]);
const { rotations } = ik(arm, { lower: { x: 486, y: 412 } }, { base, flip: true });
const tips = fk(arm, { rotations, base });
const { bones, tips } = chainPoses(arm, { rotations, base });
```


## @gerak/stage

Who is on stage and when. A cast member is a proxy: `actor`, `many` and `group` say only what the scene's motion
needs (a name, how many parts, the text, when it is shown, whether it is watched); how it looks is the renderer's
skin. `story` names the beats and owns the piece's length; `restOf` reads where a member rests once laid out.

```ts
export const beats = story(4000, { arrive: [0, 1600], hold: [1600, 4000] });
export const cast = { word: letters("NIGHT", { on: [["arrive", "hold"]] }), dot: actor() };
```


## @gerak/physics

The pure engine and `simulate`, which makes a seekable simulation from a world and a build function.

```ts
world.addBody({ id: "ball", shape: { kind: "circle", radius: 20 }, x: 640, y: 0, restitution: 0.5 });
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


## @gerak/rapier

The same worlds on Rapier, loaded once. `RapierWorld`s are `PhysicsWorld`s with `native` and `rigidBody(id)`.

```ts
const rapier = await rapierEngine();
const sim = simulate(rapier(), build);
```


## @gerak/three

Writes poses onto Three.js objects; its React hook comes from `@gerak/three/react`, listed after it.

```tsx
player.subscribe("ball", (pose) => applyPose2d(mesh, pose));
player.subscribe("ball", (pose) => applyPose3d(mesh, pose));
const ball = useTarget3d(playing?.player, "ball");
return <mesh ref={ball} />;
```


## @gerak/three/react


## @gerak/three/skeleton


## Commands

Run from your project's folder. A page is a path inside the site with no leading `/`; the site is the pieces folder,
`--root <dir>` or else the `gerak.pieces` folder of the nearest `package.json` naming one (`apps/pieces` here), unless
`--url <address>` names a running server; `--root` and `--out` are read from the folder you run in. Page tools open the page in Chrome or Edge under a paused clock that also holds CSS
and Web Animations, seed `Math.random`, print JSON, and exit `1` on page errors. Each takes `--size WxH` and
`--action`: `hover:sel@ms`, `leave:sel@ms`, `click:sel@ms`, `press:sel@ms`, `release:sel@ms`, `scroll:px@ms`, with
`(x,y)` after the ms for a point on the element; a selector the page lacks fails at once.

- **`gerak init [folder] [--refresh]`**: sets up your project, found as the nearest `package.json`: writes the
  page files into `folder` (default `pieces`, from where you run), `"gerak": { "pieces": "<folder>" }` into the
  `package.json`, the make-motion skill into `.claude/skills/make-motion/` and an `AGENTS.md`. It refuses, naming
  each file, and writes nothing when any of them exists or the `package.json` already names `gerak.pieces`.
  `--refresh` rewrites only the six page files of the pieces folder, and nothing else.
- **`gerak live <name> [--root dir] [--port number]`**: starts the dev server (or reuses one) and prints the
  address of `live.html?scene=<name>`. Every scaffolded scene plays in it with no change to its files.
- **`gerak style measure <brief> [--root dir]`**: writes `<brief>/style.ts`, a style card measured from the scene modules
  in `<brief>/src/*.ts`: per field, the range of the share of lively motions (overshoot, rings or windup) across the pieces that move it at least three times, widened a little. Prints the file and each field's lively share; an unknown brief or an existing `style.ts` is refused (exit `1`).
- **`gerak style check <brief> [--root dir]`**: prints `ok`, or one finding per line and exits `1`: the card's load problems, imports
  the brief's moves and parts may not make, the part and move gates on the brief, and the lively-share findings of the review of every piece of the brief and of any brief that exports `style = "<brief>"` (a piece's other findings are its own).
- **`gerak new <name> [--in <brief>] [--three]`**: writes `<brief>/<name>.html`, its entry, a component and `<brief>/src/<name>-scene.ts` in
  `apps/pieces` (the brief is the name unless `--in` names one); a name any brief already holds is refused; `--three` makes the component a Three.js stage, one mesh per target bound with `useTarget3d`, and
  the scene returns `Pose3d` targets. Every target rests (`{}`) and the scene imports no move.
- **`gerak new-move <id> --in <brief> [--root dir]`**: writes `<brief>/src/moves/<id>.ts`, a `defineMove` declaration (role `"enter"`,
  empty description, one option) whose `run` is not at rest at progress 1, so `gerak moves --check` refuses it until
  you write the description and the `run`. The id is lower kebab-case; an existing file is never overwritten.
- **`gerak import-svg <file.svg> --name <piece> [--root dir] [--margin px] [--force]`**: writes `<root>/<piece>/src/<piece>.ts`, a stage
  module of the SVG's shapes as flat parts in frame px (the frame is the viewBox with `--margin` px of room on every side), one `actor({ still: true, path })`
  per shape in document order named from its `inkscape:label` or `id`, with fill, stroke, opacity and paint order in the
  skin and gradients in `skins.dom.defs`. It prints one JSON object: the members, the defs count, the frame, and
  `leftOut`, every element it cannot carry with the reason (text, image, filter, mask, clipPath, marker,
  `foreignObject`, a pattern it cannot place, a stroke scaled unevenly). It refuses to overwrite without `--force`.
- **`gerak moves [<id>] [--role role] [--find words] [--fields a,b] [--like quality] [--renderer dom|three] [--move field[:quality]] [--uses kind,part] [--design file --target name] [--near id] [--far id] [--in brief] [--all] [--check] [--json] [--parts] [--anatomy] [--candidates] [--root dir]`**: one search over every source of moves the root declares
  in `"gerak": { "moves": [...] }` of its `package.json` (a package name, or a folder glob such as `./*/src/moves`; absent, `["@gerak/moves", "./*/src/moves"]`).
  With no query it prints a summary of at most 20 lines: moves per role and per source, the qualities `--like` knows, example queries. A query
  prints at most 10 rows (`--all` lifts it), each: id (or `source/id` where two sources share an id), source (`own` for the `--in` brief's), role, fields moved,
  the description's first sentence and the import, relative to `<root>/<in>/src` when `--in` names a brief. The filters combine: `--role`; `--find` (every word in the id,
  description or an option name); `--fields x,scale` (moves all of them). The rankings order by fit, then by id, never by source: `--like heavy|light|quick|calm|playful|stiff|loose`
  (descriptors in a range: peak, overshoot, rings, windup, settle), `--near id`, `--far id`. `<id>` (or `<source>/<id>`) prints one move in full: options, fields, descriptors, parts, the briefs that import it, a pasteable example, its import and file.
  A search leaves out the moves the gate has findings on (a row says `passes` or `<n> findings`; the line after the rows says how many were left out) unless `--all`; `--renderer dom|three` keeps the moves all of whose fields that renderer writes (`three`: its 2D list), and a move in full lists, per renderer, the fields it leaves unwritten and why.
  `--move field[:quality]` (repeatable; a custom number as `custom.name`), `--uses kind,part` and `--design file --target name` (the `design` export of a piece, one target) ask for the moves that answer a design: each move is scored at the example and at every option set, the best kept; rows order by how closely the requested fields have their qualities (`fieldFit`, least first), then by the share of `--uses` the move's file imports, then by id, and each row ticks or crosses every field and use with the value that decided it and names the option (`at option=value`) when not the example. A move answers when it moves every requested field and each is inside its quality (every mark a tick); when none does, it prints `No move does this closely.`, what was asked, the move for each field alone to combine in the scene, the `gerak new-move` command, and the three nearest moves with what each misses.
  `--check` runs the move gate on the selected moves, refuses an id declared twice in one source and exits `1` on a finding; `--anatomy` prints the vocabulary card in at most 90 lines (`--json`: one object of `fields`, `parts`, `shapes`, `qualities`): each field with its group, meaning, unit, dimension and the renderers that write it, each part with its call, its first sentence and a sampled example, the shape words and the qualities' ranges; `--parts` prints the building blocks of `@gerak/moves` that are not
  moves, by the folder that declares them, each with its call shape and the first sentence of its doc comment; `--candidates` lists the local moves that pass the gate
  and are used by two or more briefs of `<root>` (the folders holding a `src`), one line each: id, file, briefs. Records are cached in `<root>/node_modules/.cache/gerak/moves.json`, a move sampled again only when its file (or its package's version) changes.
- **`gerak promote <id> [--root dir]`**: moves a candidate move's file from `<root>/<brief>/src/moves` into
  the folder the root's `"gerak": { "promoteTo": "<path>" }` names (`apps/pieces`: `packages/moves/src/moves`), rewrites its own imports from `@gerak/moves` to relative ones, exports it from the package
  index beside that folder and points every file of the app that imports it at `@gerak/moves`; prints each change. It refuses, and
  changes nothing, with no `promoteTo` set, for a move that is not a candidate, one whose file exports a helper or a name the library has, or
  one some file names in a form it cannot rewrite (a re-export, `import *`, a dynamic import). Run `npm run format` and `npm run reference -- --write` after it.
- **`gerak review <page> --watch sel,sel --to ms [--at ms,ms] [--out dir] [--full]`**: `check` and `frames` at once:
  prints the findings and the `sheet` path; `--full` adds `read`'s first 40 moves; frames, up to 10, picked where the motion is fast or turns (labelled with the time and why) unless `--at` names them; exits `1` on a finding.
  On a Three.js page watch `canvas`: the sheet shows its pixels, and the scene-file form below checks its values.
- **`gerak review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n]`**: no page: samples
  every field of every target each 16 ms and finds a step over its limit in one frame (positions over `--jump`, default
  150 for px; turns the short way round over `--turn`, default 150; scales and opacity over `--ratio`, default 1.5), a
  final hold under `--hold`, and a target still moving at the end. For a 3D scene give `--jump` in world units.
  For a stage module (it exports `beats` and `cast`) a finding that names a time also names the beat there, and it
  adds: a cast member the scene never moves that is not `still`, a `still` member or group the scene moves, a target
  the scene answers that is not cast, a member whose value changes outside its `on` stretches (before the first, in a
  gap, or after the last), a path that reads its own box, paths that read each other in a loop, and a text function
  that throws or answers something other than a string. A step while a member, its group or its list is hidden by
  `on` is not a jump. A module may export `limits`, `{ target: { jump?, turn?, ratio? } }`, to judge one target by its own
  limits instead of the flags; a `custom` value is judged as a ratio.
- **`gerak check <page> --watch sel,sel --to ms`**: every 16 ms: watched elements overlapping over `--overlap`
  frames (12), a centre jumping over `--jump` px a frame (150), a final hold under `--hold` ms (500), anything still
  moving at the end; on the last frame, text under WCAG contrast (3:1 large, 4.5:1 other) and text off the page's
  edge. Overlaps compare what a viewer sees: hidden, transparent or clipped-out boxes are left out. An element with
  `data-motion-touch="<selector>"` may touch what the selector matches; empty, anything.
- **`gerak read <page> --select sel,sel --to ms`**: each element's own moves, one line each: channel (`x`, `y`,
  `rotation`, `scaleX`, `scaleY`, `opacity`), from and to, start and end, and the ease by name, or the nearest name
  and a fitted `cubic-bezier`. A move splits where it turns back.
- **`gerak frames <page> --at ms,ms [--out dir]`**: a PNG per time and a labelled `sheet.png`; read the sheet.
  `--onion sel --from ms --to ms --every ms` draws an element at each step on one frame, with its path.
  `--compare dir` (with `--at`) also compares the new frames with an earlier run's, and `gerak frames --compare
  dirA dirB` compares two folders with no page. Each shared `frame-*.png` prints `<ms> ms  mean <m>  over32 <p>%`:
  the mean difference over R, G and B out of 255, and the share of pixels whose channel mean differs by over 32.
  Frames one side lacks, or of different sizes, are named; it reports and never fails. Reads 8-bit RGB/RGBA PNGs.
- **`gerak fps <page> [--to ms] [--size WxH] [--show]`**: runs the page on the machine's real clock for `--to` ms
  (default 10000) and prints `{ kind: "fps", windows, over16, over33, worst, renderer, software, vsync }`: frames per
  second per 500 ms window, frame gaps over 16.7 and 33.4 ms, the five slowest frames split into `scene`, `write` and
  `rest` ms, and the WebGL renderer. Headless frames run uncapped (`vsync: false`); `--show` opens a window with a counter.
- **`gerak compare <page> --reference <svg> [--at ms] [--margin px] [--size WxH] [--out dir]`**: the page's stage frame at `--at` (default 0), at
  its frame size, against the SVG drawn from its `viewBox` grown by `--margin` px on every side, as the import's margin, at
  that size; each pixel is compared with the nearest within one pixel both ways, so smoothing is forgiven and a missing
  part is not. Writes `piece.png`, `reference.png`,
  `side-by-side.png` and `difference.png` (brighter is more different), and prints `{ kind: "compared", mean, members,
  notes, out }`: `mean` the frame's mean difference over R, G and B out of 255, `members` every cast member with the mean
  inside its box, worst first. A viewBox whose aspect differs from the frame's by over 1% is noted, never stretched.
- **`gerak probe <page> --at ms,ms --select sel`**: each match's box, centre, transform, colours, opacity, z-index.
- **`gerak render <page> --to ms [--out file] [--format gif]`**: an MP4 at 62.5 frames a second, the same bytes each
  run, or a 640 px GIF at 25; needs `ffmpeg`.
- **`gerak sample <scene.ts> (--at ms,ms | --progress p,p) [--nodes id,id] [--fields a,b] [--events list]`**: exact
  values with no browser; reads the module's `cues`.
- **`gerak timeline <scene.ts> [--events list]`**: one bar per target from its first change to its rest.
- **`gerak points <points.json> --spacing px`**: a list of `{ x, y }` resampled to an even spacing, for a rope.
- **`gerak joints <model.glb> [--out file]`**: writes `<model>.joints.json` beside a skinned glTF: every bone's world rest
  point and parent, for `jointOf(table.joints, name)` in a scene module.
