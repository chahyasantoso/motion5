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
  and each `.moves(...)` argument of a statically named element.

A card's id comes from code identity, so it survives edits: `scene:<name>`, `shot:<name>`, `beat:<name>`,
`member:<name>`, `move:<member>.<step>`, `job:<cue file>`, `source:<path>`, `output:<kind>`.

- A move is a `motion` card when it calls a package function such as `rise` or `travel`, and a `code` card at its file
  and line when it is hand-written: a local or relative function, `motion(...)`, `bind`, `bindEach` or an inline
  function. `stagger` takes the kind of what it staggers.
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
- **Timeline.** One strip along the bottom: a time ruler, one bar per shot, one per beat, play and pause, speed (0.25, 0.5, 1, 2), loop and a playhead that follows the page's clock. Dragging on the ruler seeks it, to 100 ms steps (hold Alt for exact ms). Clicking a shot card or its bar solos and loops that shot; a second click clears it. A page on a live clock has no length to seek, so the ruler scrubs its scroll position from top to bottom.
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
npx gerak studio check --sizes 390x844,1440x900 --safe-zone tiktok
npx gerak studio graph                         # the open piece's graph as JSON
```

- **Follow.** A command that changes the canvas shows "Agent driving", and the canvas follows it. `status` and
  `inspect` change nothing. A real click, key or wheel on the canvas or inside the preview page switches to
  "Manual". After that, the agent's commands run on a hidden copy of the page, so they never move what the person
  sees. "Resume follow" gives the canvas the agent's focus, size, selection and time.
- **Check.** `check` runs on the server in one headless browser that the session keeps open. It watches every cast
  element on the page, from 0 to the scene's length, at 1440×900 unless `--sizes` says otherwise.
- **No canvas.** When no canvas page is open, a command fails after 10 s and tells you to run
  `gerak studio open`. A headless session always has its canvas open.
