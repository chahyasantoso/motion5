# gerak commands

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
