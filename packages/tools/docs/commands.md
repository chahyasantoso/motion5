# gerak commands

Run from your project's folder. A page is a path inside the site with no leading `/`; the site is the pieces folder,
`--root <dir>` or else the `gerak.pieces` folder of the nearest `package.json` naming one, unless
`--url <address>` names a running server; `--root` and `--out` are read from the folder you run in. Page tools open the page in Chrome or Edge under a paused clock that also holds CSS
and Web Animations, seed `Math.random`, print JSON, and exit `1` on page errors. Each takes `--size WxH` (default
`1280x720`, landscape; a portrait piece wants a portrait size such as `540x960`) and
`--action`: `hover:sel@ms`, `leave:sel@ms`, `click:sel@ms`, `press:sel@ms`, `release:sel@ms`, `scroll:px@ms`, with
`(x,y)` after the ms for a point on the element; a selector the page lacks fails at once.

- **`gerak init [folder] [--refresh]`**: sets up your project, found as the nearest `package.json`: writes the
  page files into `folder` (default `pieces`, from where you run), `"gerak": { "pieces": "<folder>" }` into the
  `package.json`, the make-motion skill into `.claude/skills/make-motion/`, `AGENTS.md` and `tsconfig.json`. It refuses, naming
  each file, and writes nothing when any of them exists or the `package.json` already names `gerak.pieces`.
  `--refresh` rewrites only the six page files of the pieces folder, and nothing else.
- **`gerak live <name> [--root dir] [--port number]`**: starts the dev server (or reuses one) and prints the
  address of `live.html?scene=<name>`. Every scaffolded scene plays in it with no change to its files. It keeps
  running until stopped, so start it in the background; page tools start their own server and need no `live`.
- **`gerak new <name> [--in <brief>] [--three] [--root dir]`**: writes `<brief>/src/<name>.ts`, one stage module (the brief
  is the name unless `--in` names another; open as `stage.html?piece=<name>`); `--three` writes `<brief>/<name>.html`, its
  entry, a component and `<brief>/src/<name>-scene.ts` instead. Refuses a name any brief already holds; every target rests
  (`{}`) and the scene imports no move.
- **`gerak import-svg <file.svg> --name <piece> [--root dir] [--margin px] [--force]`** (or **`--into <piece> --at x,y --prefix <word> [--scale s] [--root dir]`**): `--name` writes `<root>/<piece>/src/<piece>.ts`, a stage
  module of the SVG's shapes as flat parts in frame px (the frame is the viewBox with `--margin` px of room on every side), one `m.stroke(path).static()`
  per shape in document order named from its `inkscape:label` or `id`, with fill, stroke, opacity and paint order in the
  skin and gradients in `skins.dom.defs`. It prints one JSON object: the members, the defs count, the frame, and
  `leftOut`, every element it cannot carry with the reason (text, image, filter, mask, clipPath, marker,
  `foreignObject`, a pattern it cannot place, a stroke scaled unevenly). It refuses to overwrite without `--force`.
- **`gerak review <page> --watch sel,sel --to ms [--at ms,ms] [--out dir] [--full]`**: `check` and `frames` at once:
  prints the findings and the `sheet` path; `--full` adds `read`'s first 40 moves; frames, up to 10, picked where the motion is fast or turns (labelled with the time and why) unless `--at` names them; exits `1` on a finding.
  On a Three.js page watch `canvas`: the sheet shows its pixels, and the scene-file form below checks its values.
- **`gerak review <scene.ts> [--to ms] [--hold ms] [--jump units] [--turn degrees] [--ratio n] [--budget ms]`**: no page: samples
  every field of every target each 16 ms and finds a step over its limit in one frame or a step slower than `--budget` (default 8 ms) (positions over `--jump`, default
  150 for px; turns the short way round over `--turn`, default 150; scales and opacity over `--ratio`, default 1.5), a
  final hold under `--hold`, and a target still moving at the end. For a 3D scene give `--jump` in world units.
  For a stage module (`defineStage`) a finding that names a time also names the beat there, and it
  adds: a `"settle"` member the scene never moves (unless `.watch()` or `.ambient()`), a `.static()` member the scene moves or poses, a target
  the scene answers that is not cast, a member whose value changes outside its `.on()` stretches (before the first, in a
  gap, or after the last), frame `shape_mismatch` errors, a path that reads its own box, paths that read each other in a loop, and a readout function
  that throws. A step while a member, its group or its list is hidden by
  `.on()` is not a jump. `limits` in `defineStage`, `{ target: { jump?, turn?, ratio? } }`, judges one target by its own
  limits instead of the flags; a `custom` value is judged as a ratio.
- **`gerak check <page> --watch sel,sel --to ms [--overlap frames] [--hold ms] [--jump px]`**: every 16 ms: watched elements overlapping over `--overlap`
  frames (12), a centre jumping over `--jump` px a frame (150), a final hold under `--hold` ms (500), anything still
  moving at the end; on the last frame, text under WCAG contrast (3:1 large, 4.5:1 other) and text off the page's
  edge. Overlaps compare what a viewer sees: hidden, transparent or clipped-out boxes are left out. An element with
  `data-motion-touch="<selector>"` may touch what the selector matches; empty, anything.
- **`gerak read <page> --select sel,sel --to ms`**: each element's own moves, one line each: channel (`x`, `y`,
  `rotation`, `scaleX`, `scaleY`, `opacity`), from and to, start and end, and the ease by name, or the nearest name
  and a fitted `cubic-bezier`. A move splits where it turns back.
- **`gerak frames <page> (--at ms,ms [--compare dir] [--crop x,y,w,h [--zoom 1-8]] | --onion sel --from ms --to ms --every ms) [--out dir]`**: a PNG per time and a labelled `sheet.png`; read the sheet.
  `--crop` enlarges one region by `--zoom` (1 to 8). `--onion` draws an element at each step on one frame, with its path.
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
- **`gerak sample <scene.ts> (--at ms,ms | --progress p,p | --watch path [--from ms] [--to ms] [--every ms]) [--nodes id,id] [--fields a,b] [--events list]`**: exact
  values with no browser (`--watch` prints a dotted field's trajectory); reads the module's `cues`.
- **`gerak timeline <scene.ts> [--events list]`**: one bar per target from its first change to its rest.
- **`gerak points <points.json> --spacing px [--prefix p]`**: a list of `{ x, y }` resampled to an even spacing, for a rope.
- **`gerak joints <model.glb|model.gltf> [--out file]`**: writes `<model>.joints.json` beside a skinned glTF: every bone's world rest
  point and parent, for `jointOf(table.joints, name)` in a scene module.
