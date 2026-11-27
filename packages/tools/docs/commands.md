# gerak commands

Run from your project's folder. A page is a path inside the site with no leading `/`, and a page the server does not have is an error; the site is the pieces folder (served on an ephemeral localhost port `0`),
`--root <dir>` or else the `gerak.pieces` folder of the nearest `package.json` naming one, unless
`--url <address>` names a running server; `--root` and `--out` are read from the folder you run in. Page tools open the page in Chrome or Edge under a held clock (while stepping `"live"` mounts deterministically through the host driver hook and keeping gerak elements in the synchronous engine alongside held document-timeline CSS/Web Animations), seed `Math.random`, print JSON, and exit `1` on page errors. A held clock draws one frame at each requested ms. Each takes `--size WxH` (default
`1280x720`, landscape; a portrait piece wants a portrait size such as `540x960`) and
`--action`: `hover:sel@ms`, `leave:sel@ms`, `click:sel@ms`, `press:sel@ms`, `release:sel@ms`, `scroll:px|sel[±px]@ms` (resolving `sel`'s document top `+ ±px` in the active viewport; negative offsets follow `]`, `)`, or space), with
`(x,y)` after the ms for a point on the element; repeatable `--action` flags join in order, and a selector the page lacks fails at once.

- **`gerak init [folder] [--refresh]`**: sets up your project, found as the nearest `package.json`: writes the
  page files into `folder` (default `pieces`, from where you run), `"gerak": { "pieces": "<folder>" }` into the
  `package.json`, the make-motion skill into `.claude/skills/make-motion/`, `AGENTS.md` and `tsconfig.json`. It refuses, naming
  each file, and writes nothing when any of them exists or the `package.json` already names `gerak.pieces`.
  `--refresh` rewrites only the page files of the pieces folder, and nothing else.
- **`gerak new <name> [--in <brief>] [--three] [--root dir]`**: writes `<brief>/<name>.html` (the look and the cast, tagged `data-cast`), `<brief>/src/<name>.ts`, one `scene` piece, and `<brief>/src/<name>-main.ts`, which mounts it (the brief
  is the name unless `--in` names another; open as `<brief>/<name>.html`); `--three` writes `<brief>/<name>.html`, `<brief>/src/<name>-main.ts`, which builds the world with `createStage3d` and mounts the piece with `mount`, and `<brief>/src/<name>-scene.ts`, a
  `scene` piece with one `object` and a label, instead. Refuses a name any brief already holds; its one element
  is static and the piece imports no move.
- **`gerak review <page> --watch sel,sel --to ms [--size WxH | --sizes WxH,WxH] [--safe-zone tiktok|reels|shorts|youtube] [--at ms,ms] [--out dir] [--full]`**: `check` and `frames` at once across one shared server and browser session:
  takes `check`'s `--safe-zone` and reports its findings; prints the findings and the `sheet` path; `--full` adds `read`'s first 40 moves; frames, up to 10, picked where the motion is fast or turns (labelled with the time and why) unless `--at` names them; exits `1` on a finding.
  With `--sizes`, runs each viewport in turn, prefixes findings, frames and errors with `[WIDTHxHEIGHT]`, and writes labelled `sheet-<WIDTHxHEIGHT>.png` files.
  On a Three.js page watch `canvas`: the sheet shows its pixels, and the scene-file form below checks its values.
- **`gerak review <scene.ts> [--to ms] [--events list|@preset] [--hold ms] [--jump units] [--turn degrees] [--ratio n] [--budget ms] [--measure]`**: no page, isolated from caller `RuntimeStore` cursors: samples
  every field of every target each 16 ms in 3 consolidated passes and finds a step over its limit in one frame or a step slower than `--budget` (default 8 ms) (positions over `--jump`, default
  150 for px; turns the short way round over `--turn`, default 150; scales and opacity over `--ratio`, default 1.5), a
  final hold under `--hold`, and a target still moving at the end. For a 3D scene give `--jump` in world units.
  `--events` injects synthetic `name=value@ms` or `name:target@ms` events alongside `cues`; `--events @<name>` reads the recorded preset `<pieces>/.gerak/presets/<piece>/<name>.json`, where the piece is the scene file's name without `.ts` and `-scene`.
  For a `scene` piece a finding that names a time also names the beat there, and it
  adds: an element whose value changes outside its `.shows` windows (before the first, in a gap, or after the last),
  frame `shape_mismatch` errors, a path that reads its own box, paths that read each other in a loop, and a readout
  function that throws. Unmoved `"settle"` members driven by scroll, sticky ranges, trigger, pointer, or watched DOM events (`enter`, `down`, `click`, `focus`) are probed across their
  reported drivers before being flagged as never moved. A step while an element, its parent or its parts are hidden by `.shows` is not a jump. An
  element's `.limits({ jump?, turn?, ratio? })` judges it by its own limits instead of the flags; a `custom` value is
  judged as a ratio.
- **`gerak check <page> --watch sel,sel --to ms [--size WxH | --sizes WxH,WxH] [--safe-zone tiktok|reels|shorts|youtube] [--overlap frames] [--hold ms] [--jump px]`**: every 16 ms: watched elements overlapping over `--overlap`
  frames (12), a centre jumping over `--jump` px a frame (150), a final hold under `--hold` ms (500), anything still
  moving at the end; on the last frame, text under WCAG contrast (3:1 large, 4.5:1 other), text off the page's
  edge, and any `media: true` clip shorter than its show window (`media-short`). Every page tool waits for media clips to finish seeking before each frame. With `--sizes`, checks every viewport and prefixes finding lines with `[WIDTHxHEIGHT]`. Overlaps compare what a viewer sees: hidden, transparent or clipped-out boxes are left out. An element with
  `data-motion-touch="<selector>"` may touch what the selector matches; empty, anything.
  `--safe-zone` reports each text glyph box and watched element whose box enters that platform's reserved margin, once per element and edge at the first 16 ms sample of a stay in the margin for longer than 12 sampled frames (192 ms) in a row, or at the end; without `--size` or `--sizes` it opens the platform's native size (1080x1920, YouTube 1920x1080), and at another size the margins scale with the stage; a box that enters all four margins is a full-frame layer and is not reported; text with the same name in one frame is named `... #2`, `... #3`.
- **`gerak read <page> --select sel,sel --to ms`**: each element's own moves, one line each: channel (`x`, `y`,
  `rotation`, `scaleX`, `scaleY`, `opacity`), from and to, start and end, and the ease by name, or the nearest name
  and a fitted `cubic-bezier`. A move splits where it turns back.
- **`gerak frames <page> (--at ms,ms [--compare dir] [--crop x,y,w,h [--zoom 1-8]] | --onion sel --from ms --to ms --every ms) [--out dir]`**: a PNG per time and a labelled `sheet.png`, waiting for media clips to finish seeking before each frame; read the sheet.
  `--crop` enlarges one region by `--zoom` (1 to 8). `--onion` draws an element at each step on one frame, with its path.
  `--compare dir` (with `--at`) also compares the new frames with an earlier run's, and `gerak frames --compare
  dirA dirB` compares two folders with no page. Each shared `frame-*.png` prints `<ms> ms  mean <m>  over32 <p>%`:
  the mean difference over R, G and B out of 255, and the share of pixels whose channel mean differs by over 32.
  Frames one side lacks, or of different sizes, are named; it reports and never fails. Reads 8-bit RGB/RGBA PNGs.
- **`gerak fps <page> [--to ms] [--size WxH] [--action list] [--show]`**: runs the page on the machine's real clock for `--to` ms
  (default 10000), executing any `--action` sequence in real time, and prints `{ kind: "fps", windows, over16, over33, worst, renderer, software, vsync }`: frames per
  second per 500 ms window, frame gaps over 16.7 and 33.4 ms, the five slowest frames split into `scene`, `write` and
  `rest` ms, and the WebGL renderer. Headless frames run uncapped (`vsync: false`); `--show` opens a window with a counter.
- **`gerak compare <page> --reference <svg> [--at ms] [--margin px] [--size WxH] [--out dir]`**: the page's stage frame at `--at` (default 0), at
  its frame size, against the SVG drawn from its `viewBox` grown by `--margin` px on every side, at
  that size; each pixel is compared with the nearest within one pixel both ways, so smoothing is forgiven and a missing
  part is not. Writes `piece.png`, `reference.png`,
  `side-by-side.png` and `difference.png` (brighter is more different), and prints `{ kind: "compared", mean, members,
  notes, out }`: `mean` the frame's mean difference over R, G and B out of 255, `members` every cast member with the mean
  inside its box, worst first. A viewBox whose aspect differs from the frame's by over 1% is noted, never stretched.
- **`gerak probe <page> --at ms,ms --select sel`**: each match's box, centre, transform, colours, opacity, z-index.
- **`gerak render <page> [--to ms] [--fps 60|30|25] [--audio file[@ms][:gain]]... [--format mp4|gif] [--out file]`**: renders one lossless PNG frame per `1000 / fps` ms (waiting for media clips to finish seeking before each frame) to a deterministic `mp4` (default `--fps` `60`; also accepts `30` or `25`) or a 640 px `gif` (default and only `--fps` `25`, because GIF frame delays are whole centiseconds); needs `ffmpeg`. When `--size` is omitted, sizes the viewport from the first timed mount's `measure().frame` (or the first mount's). When `--to` is omitted, reads the longest `durationMs` from the page's timed mounts. Repeated `--audio` tracks are delayed by `@ms` (default `0`), scaled by `:gain` (default `1`), mixed, and encoded as AAC trimmed to the video length. Returns `{ kind: "rendered", path, width, height, frames, fps, to, seconds, speed: { framesPerSecond, wallMs }, pageErrors }`.
- **`gerak measure <brief>/<name>.html [--size WxH]`**: opens the page once and writes `<name>.measure.json` and `<name>.cast.ts` (`cast` handles, `DomCast`, `ObjectCast`, `CastName`) beside it:
  the frame, each cast element's rest box and placement, each split's lines, each element's cast parent, and optional
  3D `objects` bounds (`{ width, height, depth }`) and 3D list `counts`, as its mounts measured them (`<name>.cast.ts` is also synced from static HTML + `Binder.casts()` even when a stale scene throws during `mount`). `sample`, `timeline` and `review` of a
  builder scene `<brief>/src/<name>.ts` read `.measure.json` with no
  browser, and refuse the scene while its page HTML, linked stylesheets, bootstrap scripts/local imports, or `.glb`/`.gltf` assets have changed since (pure scene files are excluded so editing motion keeps the fast headless loop; pass `--measure` to `review` or `sample` to refresh a missing or stale cache or missing `.cast.ts` on demand).
- **`gerak sample <scene.ts> (--at ms,ms | --progress p,p | --watch path [--from ms] [--to ms] [--every ms]) [--nodes id,id] [--fields a,b] [--events list] [--measure]`**: exact
  values with no browser (`--watch` prints a dotted field's trajectory); reads the module's `cues`. `--measure` refreshes a missing or stale measure cache before sampling.
- **`gerak timeline <scene.ts> [--events list]`**: one bar per target from its first change to its rest, under a bar per shot
  made with `shot`.
- **`gerak points <points.json> --spacing px [--prefix p]`**: a list of `{ x, y }` resampled to an even spacing, for a rope.
- **`gerak joints <model.glb|model.gltf> [--out file]`**: writes `<model>.joints.json` beside a skinned glTF: every bone's world rest
  point and parent, for `jointOf(table.joints, name)` in a scene module.
- **`gerak beats <audio.wav|mp3|m4a> [--out file.cues.json] [--threshold n] [--levels name@ms]`**: decodes an audio file with `ffmpeg`, extracts `"beat"` onset cues over 20 ms windows stepped by 5 ms hops (`--threshold`, default `1.5`, requiring a rise above `0.02` over the history mean) and optional sampled level cues (`--levels name@ms`), and writes a sorted JSON array of `{ name, at, value }` cues to `--out` or `<audio>.cues.json` beside the input so a scene can import it as its `cues`.
- **`gerak cues <captions.srt|.vtt|whisper.json> [--out file.cues.json] [--name word]`**: turns SubRip (`.srt`), WebVTT (`.vtt`) or Whisper JSON (`.json`) into `{ name, at, value }` cue events (`--name`, default `word`, one per word when word timings are present or one per line otherwise), writes the cues JSON to `--out` or `<captions>.cues.json` and a sibling `.words.json` array of single words; `value` `n` means the first `n` words show for both timings (a line-timed file reveals a whole line at its cue), so a scene can pass the cues JSON to `text(name, { split: "words" })`.
