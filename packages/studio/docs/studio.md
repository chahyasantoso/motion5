# Studio

`@gerak/studio` reads a piece without changing it. The scene file stays the source of motion and the page the source
of the look and the cast; the Studio draws them as one graph of cards and wires.

## The graph

`graphOf(piece, sources)` builds the one `StudioGraph` the canvas, the CLI and tests read. It takes:

- the compiled stage and `provenanceOf(scene)` from `@gerak/stage/provenance`: which shot or named scene binds each
  member, its binding calls in order, and where each beat comes from;
- `readSources(sceneFile)`: what the files say, read with the TypeScript compiler and an HTML scan, never run. It finds
  the cue JSON the scene imports and the `cues` option or shot `until` each feeds, the audio or captions file under
  `audio/` of the same name, `<video>` and `<audio>` sources of cast elements, loose files under `audio/` and `media/`,
  each `.moves(...)` argument of a statically named element, and each `const x = scene(...)` with no written
  `name` with the members and beats bound inside it.

A card's id comes from code identity, so it survives edits: `scene:<name>`, `shot:<name>`, `beat:<name>`,
`member:<name>`, `move:<member>.<step>`, `job:<cue file>`, `source:<path>`, `output:<kind>`.

- A move is a `motion` card when it calls a package function such as `rise` or `travel`, and a `code` card at its file
  and line when it is hand-written: a local or relative function, `motion(...)`, `bind`, `bindEach` or an inline
  function. `stagger` takes the kind of what it staggers.
- A `scene(...)` assigned to a const with no written `name` takes the const's name: a member or beat whose
  provenance gives no scene, or only the root, and that one such scene lists, sits under `scene:<const>` with the
  root scene as parent. A written `name` wins; the entry's default export is never a sub-scene.
- A call to a local function or const whose only argument is a package move reads as that move, with the function in
  `wrappers` (its definition's site and doc). A wrapper in a wrapper, or around anything else, is a `code` card.
- A package move's options object gives `knobs`: each property whose value is a number (negative too), string or
  boolean literal, as `{ name, value }`.
- A `code` card's `doc` is the first paragraph of the JSDoc of the function or const it points at. The card shows it,
  its wrappers as chips titled with their doc, its knobs as rows and a code button titled `file:line`.
- A cue file becomes a `beats` job when an audio file made it and a `cues` job when captions did.
- Beats that scroll or a trigger drive get an `input` source.
- A dynamic import or a spread of moves cannot be placed: it becomes a card marked "set in code", with no wires.
- A page `data-cast` element with no member is an "unused cast".

Wires carry `time` (beat or shot into a move), `events` (cues or input into a scene, a cue file into a shot's
`until`), `pose` (a move into its cast, a travel target or `stayWith` read into a move), `media` (a file into a job, a
clip into its media box) and `stage` (the scene into preview, check and render).

## The canvas

`npx gerak studio open <piece>` serves the canvas of a piece at `/__gerak/studio?piece=<piece>` on the pieces folder's dev server, next to the pieces' own pages. The canvas holds no motion and no look: it draws the graph and the real page, and redraws when a file changes.

- **Layout.** One card per graph card, one React Flow node type per group, placed in columns: sources, jobs, scenes and shots (beats beside them), cast, moves (a cast's moves in a row), then outputs. A shot's beats and cast sit level with it. A card with no saved place gets this automatic place; a card with a saved place keeps it. Cards drag by their header and snap to an 8 px grid. Wires are curves coloured by port type, and wires that do not touch the selection are dimmed.
- **Sidecar.** Places, the viewport and the preview's choice are written to `.gerak/canvas/<piece>.json` after a drag or a move ends, a moment later. Ids the graph no longer lists are dropped on that write and ignored on load.
- **Moving about.** Dragging empty canvas, space-drag or a two-finger scroll pans; the wheel or a pinch zooms about the pointer; `F` frames all; Shift-drag box-selects.
- **Theme.** Dark is the default; the light theme comes from the same tokens, from the system setting when no choice is saved. `theme.css` holds every colour, radius, space, shadow and duration; no other file holds a colour literal.
- **Preview card.** `output:preview` hosts the piece's page in an `<iframe>` (`?gerakStudio=1`), so its main file, 3D binders, sticky sections and media queries run. Presets render the page at `Desktop 1440×900`, `Mobile 390×844`, `1080×1920`, `1920×1080` or `1080×1080`, or at the card's own size (`Fill`), scaled to fit and letterboxed. `Safe zones` draws the margins of a platform profile from the tools package's one profile table over the frame. Maximise fills the canvas and restore undoes it. The preset and profile are saved in the sidecar.
- **Timeline.** One strip along the bottom: a time ruler, one bar per shot, one per beat, play and pause, speed (0.25, 0.5, 1, 2), loop and a playhead that follows the page's clock. Dragging on the ruler seeks it, to 100 ms steps (hold Alt for exact ms). Clicking a shot card or its bar solos and loops that shot; a second click clears it. A page that mounts on a live clock is driven: the canvas hands it a seekable driver (through the global symbol keyed @gerak/dom/driver, set by an inline script the server adds to every page but the canvas), so play, pause, seek, loop and the bus's `play` and `seek --ms` work. The timeline is the longest of the scene, the picked Events preset's last event plus 2000 ms, and the scroll sweep (1 px per ms of the page's current height, which the timeline follows as the page grows or shrinks, keeping the playhead's ms); the sweep spans the whole timeline and reads the page's height as it plays. The preset's scroll samples scroll the page and its other events reach the scene at their ms beside the page's real input; with no preset Play sweeps the page from top to bottom. Changing the preset reloads the frame and returns to the same ms. Replay reloads the page at the top, with an empty log, and plays it; it shows only on a driven page.
- **Hot swap.** A scene-only change calls the mount's `replace` with the new scene and keeps time. A change to the page, its CSS or its main file reloads the frame and then restores the last ms (or scroll position) and play state once the new mount appears. A compile error, a throw in the scene or a graph that no longer builds keeps the last good frame and the last good graph under a banner with the file, line and message; the next good edit clears it.

## `gerak studio`

The tools package's `gerak` binary forwards `gerak studio` to this package when it is installed.

```sh
npx gerak studio graph reel          # the graph as an outline
npx gerak studio graph reel --json   # the graph as JSON
npx gerak studio open reel           # the canvas, in a browser
npx gerak studio open reel --headless   # the canvas in the session's own headless browser
```

### Driving an open canvas

`gerak studio open` writes `<pieces>/.gerak/studio.json` with the server's address. It removes the file on close
and on Ctrl-C. Every command below reads that file and sends one command to the open canvas. Each command takes
`--root dir` and `--piece name`, and prints the reply as JSON. A command exits with 1 when the reply is `failed`.

```sh
npx gerak studio status                        # piece, follow, focus, preset, safe zone, atMs, scrollY, playing, selected, problem
npx gerak studio focus --shot 1                # a shot by name or index (solo and loop it), --scene <name>, or all
npx gerak studio viewport tiktok               # a preset id, a preset's WxH, or a platform (its frame and safe zone)
npx gerak studio seek --ms 3000                # or --scroll <px|selector>
npx gerak studio play --from 0 --to 4000 --speed 0.5
npx gerak studio select member:hookEyebrow     # the same selection the canvas shows
npx gerak studio inspect                       # the selected card: pose, page box, rest box, 3D bounds, steps
npx gerak studio check --sizes 390x844,1440x900 --safe-zone tiktok --to 4000
npx gerak studio graph                         # the open piece's graph as JSON
```

- **Follow.** A command that changes the canvas shows "Agent driving", and the canvas follows it. `status` and
  `inspect` change nothing. A real click, key or wheel on the canvas or inside the preview page switches to
  "Manual". After that, the agent's commands run on a hidden copy of the page, so they never move what the person
  sees. "Resume follow" gives the canvas the agent's focus, size, selection and time.
- **Check.** `check` runs on the server in one headless browser that the session keeps open. It watches every cast
  element on the page, from 0 to the scene's length or `--to`, at 1440×900 unless `--sizes` says otherwise.
- **No canvas.** When no canvas page is open, a command fails after 10 s and tells you to run
  `gerak studio open`. A headless session always has its canvas open.

### Pins

A pin is a numbered note on a piece, kept in `<pieces>/.gerak/pins.json`. It records where it was left: a card, a
point on the stage, or a moment on the timeline. It also records the moment and view at that time: the scene and
shot, the size preset and safe zone, `atMs`, `scrollY`, the events preset, the card's pose and rest box, and the file
the card opens in. A number is never reused.

- **On the canvas.** Press `P` (or the toolbar's pin button), then click a card, the preview stage or the ruler.
  Escape leaves pin mode. Pins draw as numbered badges on their cards, as markers over the stage near their moment
  and preset, and as ticks on the ruler. Clicking one restores its view and moment and selects its card.
- **From the terminal**, with or without an open canvas:

```sh
npx gerak studio pins list [--piece reel] [--all] [--json]
npx gerak studio pins show 3
npx gerak studio pins add --card member:hookEyebrow --note "lands too early"   # fills the moment from an open canvas
npx gerak studio pins resolve 3
npx gerak studio pins clear [--piece reel] [--resolved]
```

An open canvas redraws whenever the file changes, whoever wrote it.

### Recorded events

A preset is a list of page events (pointer, scroll, sent samples) kept at
`<pieces>/.gerak/presets/<piece>/<name>.json`.

- **Record events** on the preview toolbar takes the events the page logs until you stop, and saves them as the next
  `take-<n>`. The **Events preset** menu picks a preset. Its events draw as ticks on the ruler, and pins made while
  it is picked name it.
- `npx gerak studio act '<action-list>' [--save-preset name]` runs a `gerak review --action` list on the piece's page
  in the session's browser, and answers the events the page logged. It loads the page once on the real clock first,
  and answers `failed` after 60 s.
- `npx gerak studio presets [--piece p]` lists the names.
- `npx gerak review <scene.ts> --events @<name>` replays a preset in a review.

### Agent seams

A place on the canvas has one context (`StudioPromptContext`): its piece, card, scene and shot, view, moment, pose,
rest box, steps, findings and a prompt. A pin is that context saved.

- With one card selected, a toolbar shows **Copy @card**, which copies a short token such as
  `@member:hookEyebrow@3000ms`.
- The error banner has **Queue fix pin**, which saves the banner's problem as an open pin.

`StudioAgentPort` is where a context goes. The only port shipped is `pinOnlyAgentPort`, which saves a pin. A live
agent can mount on the dev server through `registerStudioAgentTransport`.
