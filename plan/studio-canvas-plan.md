# Studio canvas: a piece as connected cards

## Goal

A person directing agent-written motion opens `gerak studio open <piece>` and sees the piece as a canvas of connected cards: its look, its cast, its sources, timing, moves and outputs. They scrub one shared timeline, see where each cast element is and goes, tune knobs, colours, type and text, wire in audio, captions and clips, and run render and check from the canvas, without reading the scene file or the page. The agent keeps writing those files, and the canvas redraws from them. The code adds a separate `@gerak/studio` package holding a graph model built from the compiled scene and the page, a node canvas with a clean modern design system, live card previews driven by one playhead, a real-page preview card, and a small set of code patches for the edits a canvas may make; one data subpath of `@gerak/stage` and a render settings file read by `gerak render` are its only changes outside that package.

Status: planned 2026-11-25, amended the same day after an owner interview. It replaces the old Studio plan's stage, provenance and timeline decisions, and replaces `gerak live`. `plan/studio-agent-plan.md` runs between this plan's PR 2 and PR 3. Five pull requests.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `live.html` (`packages/tools/src/pages/live/`: `host.tsx`, `stage-view.tsx`, `timeline.tsx`, `code-panel.tsx`, `guard.ts`), served by `gerak live` and `motionLivePlugin()` (`packages/tools/src/vite/index.ts`), plays one scene with a timeline, speed and loop controls, hot swaps, and range-checked number scrubbing in `-scene.ts` files.
- `stage-view.tsx` injects the page's markup into a `<div>` without running `<name>-main.ts`, so 3D binders, sticky `100vh` sections and `@media` rules do not run; a saved `<name>.html` reloads the whole page.
- `compileScene()` (`packages/stage/src/author/scene.ts`) flattens sub-scenes and `shot(...)` entries into `stage.members` and `stage.beats` and keeps no record of which scene, shot or move each came from.
- A piece's sources are scattered: cue JSON is imported by the scene module, clip `src` lives in the HTML, audio for a render is a `gerak render --audio` flag.
- A piece has two sources of truth: the scene file owns motion, and `<name>.html` owns the look (markup, `<style>`, linked CSS) and the cast (`data-cast` elements). `scanHtmlCasts` (`packages/tools/src/page/cast-file.ts`) already reads the cast statically, and `gerak measure` caches each element's rest box in `<name>.measure.json`.
- `@gerak/tools` owns the `gerak` binary with a fixed command table (`packages/tools/bin/commands.mjs`); it depends on React and `typescript` (peer) and has no node-canvas library.

## Decisions

### 1. The Studio is its own package; making a piece never needs it

- `packages/studio` publishes `@gerak/studio` in the `modules` group: it depends on `@gerak/core`, `@gerak/stage`, `@gerak/dom` and `@gerak/tools`, and nothing in `core` depends on it.
- It holds the graph, the sources reader, the patches, the canvas page, its theme, React Flow (`@xyflow/react`, MIT) and its own docs. A project that only makes pieces never installs it, and `core.md`, `stage.md` and the authoring reference pages never mention it.
- `gerak studio <subcommand>` is the one entry: the `gerak` binary forwards `studio` to the installed `@gerak/studio` bin, and without it prints how to install it. `gerak studio open <piece>` opens the canvas; `gerak studio graph <piece> [--json]` prints the graph; `plan/studio-agent-plan.md` adds its subcommands under the same prefix.
- The Studio replaces `gerak live`: in PR 2, `live.html`, the `live` command and the live parts of `motionLivePlugin()` move into `@gerak/studio` or are deleted, with the tests they make obsolete.

### 2. The code is the source; the canvas is a view of it

- The scene file stays the single source of truth for motion (ADR-170), and the page for the look and the cast. The canvas never stores either.
- One pure function owns the graph: `graphOf(piece, sources): StudioGraph` in `packages/studio/src/graph.ts`, built from the compiled stage and its provenance (Decision 3) and the piece's sources (Decision 4). The canvas, the CLI and tests all read this one value.
- Card ids derive from code identity (`member:<name>`, `beat:<name>`, `shot:<name>`, `scene:<name>`, `move:<member>.<step>`, `source:<path>`, `job:<output path>`, `output:<kind>`), so they survive edits; renaming a member in code renames its card.
- One sidecar, `.gerak/canvas/<piece>.json`, holds only canvas layout: card positions, collapsed and pulled-out state, and the viewport. Ids no longer in the graph are dropped on save.
- `gerak studio graph <piece> [--json]` prints the graph: cards, wires, stale jobs and patch refusals. Agents and tests read structure without a browser.

### 3. Provenance as a data subpath (`@gerak/stage/provenance`)

- `provenanceOf(scene): ScenePlan`, exported only from `@gerak/stage/provenance`, reads a scene as written: each member's `scene` (the shot that owns it, else the innermost `scene({ name })` that binds it) and `steps: readonly StepSummary[]`, and the shot or named scene each beat comes from.
- A step is a closed union read with an exhaustive `switch`: `motion` (label, beat or window, joins, loops, reads), `travel` (target, fit, window), `modifies`, `shows` (windows), `limits`. A shot's beats appear under their compiled names (`<shot>.<beat>`).
- `Member`, `Stage` and `compileScene` stay as they are; `frame()` never reads provenance. The subpath is left out of the authoring reference pages.

### 4. Sources, read statically

- `packages/studio/src/sources.ts` reads a piece's sources with the TypeScript compiler API and an HTML scan, no execution:
  - JSON imported by the scene module: `*.cues.json` and `*.words.json`, with the `cues` option or shot `until` they feed, and the audio or captions file under the piece's `audio/` folder whose name made them;
  - `<video>` and `<audio>` `src` on cast elements that a `box(name, { media: true })` binds;
  - files under the piece's `audio/` and `media/` folders not yet wired anywhere, shown as loose source cards;
  - each `.moves(...)` argument of a statically named element, classified as a library `motion` (a call to a package function) or hand-written `code` (a local or relative function, `motion(...)` or an inline function), with its file and line.
- A source it cannot place (a computed path, a dynamic import, a spread of moves) becomes a card marked "set in code", with no wires.

### 5. Cards and wires

- Cards are a closed union `CardKind`, read with exhaustive `switch`es:

  | Group | Kinds | Body |
  | --- | --- | --- |
  | Source | `audio`, `captions`, `clip`, `image`, `model`, `input` | waveform, transcript lines, poster frame, thumbnail |
  | Tool (a job) | `beats`, `cues` | cue ticks; state chip and Run |
  | Timing | `beat`, `shot`, `scene` | a bar in the piece's ms, overlap badge; a scene lists its shots and its cast as rows (Decision 10) |
  | Look | `look` | colour swatches, type, space (Decision 11) |
  | Cast (pulled out) | `box`, `text`, `shape`, `object`, `list` | mini frame with box and trail, tag and text (Decision 10) |
  | Move | `motion`, `code` | sparkline of each field; knobs |
  | Output | `preview`, `check`, `render` | the real page; findings; render progress |

- A `code` card stands for a hand-written motion function: it opens the file at the function and shows its inputs and outputs, but its inside is not drawn as wires.
- Wires carry a closed union `PortType`: `time` (beat or shot into a move), `events` (cues or input into a scene, a beat cue into a shot's `until`), `pose` (a move into its cast, and a statically known `travel`, `stayWith` or `carry` from one member to another), `media` (a source file into a job, a clip into a media box), `stage` (a scene into preview, check or render).
- Only statically known links are drawn. A `context.read` inside a motion function is not inferred; its card notes "reads other members at run time".
- A wire whose code no longer compiles turns red and carries the compile error.

### 6. Edits are code patches, from a closed set

- The canvas edits files only through one owner, `packages/studio/src/patch.ts`, with a closed union of patches, each tested on fixture files and refused when the file is not in the shape it expects:
  - set a number (the range writer moved from `guard.ts`): knobs, beat ms, shot `length` and `overlap`;
  - wire a cues file into a scene: add the JSON import and the `cues` entry;
  - wire a clip into a box: add `{ media: true }` and the element's `src`;
  - reorder shots inside one `scene(...)` call;
  - set a CSS custom property's value in the page's `<style>` or linked CSS file (Decision 11);
  - set the text of a cast element whose content is plain text (Decision 10);
  - set a field of `<name>.render.json` (Decision 7).
- A patch writes the code an agent would write; the canvas has no format of its own. A refused patch shows "edit in code" with the file and line; it never writes a partial change. A patch whose file changed since the graph was built is refused (stale write).
- Adding cast, moves or scenes from the canvas is not in this plan (see Not in this plan).

### 7. Render settings are a piece file (`@gerak/tools`)

- `<name>.render.json` beside the page holds a piece's output settings: fps, frame size, audio tracks with offset and gain, safe-zone profile and check viewports. An agent writes it, the canvas edits it through a patch, and `gerak render <piece>` and `gerak check` read it, so a terminal render and a canvas render are the same video.
- Flags given on the command line override the file for that run. A piece with no file renders as today.

### 8. Live cards and job cards

- Live cards (timing, cast, move, look, preview) evaluate at the one playhead. The preview card's mount is the clock master; cast mini frames and move sparklines come from `frame()` and `sampleScene` in the canvas page, never from extra iframes.
- Job cards (`beats`, `cues`, `check`, `render`) run once through a dev-server endpoint, `/__gerak/job`, that calls the same functions as the CLI. A job's state is a closed union: `idle`, `running`, `done`, `stale` (an input changed since the cached output), `failed`. Outputs are cached in `.gerak/cache` by a hash of their inputs.

### 9. The preview card and the shared timeline

- The preview card hosts the real `<name>.html` in an `<iframe>` (with `?gerakStudio=1`), so `<name>-main.ts`, 3D binders, sticky sections and media queries run. It reads the mount from `window[Symbol.for("@gerak/dom/mounts")]`.
- Size presets: Desktop `1440x900`, Mobile `390x844`, Fill, custom, and the reel frames `1080x1920`, `1920x1080`, `1080x1080` letterboxed, with a `Safe zones` overlay from the one profile table in `packages/tools/src/page/safe-zone.ts`.
- Hot swap keeps time: a scene-only change calls `mounted.replace(next)`; an HTML, CSS or main change swaps in a second iframe at the same `{ ms, scrollY, events }`. A failing compile or frame keeps the last good frame under a banner with file, line and message.
- One timeline strip runs along the bottom of the canvas: time ruler, beat and shot bars, cue ticks, the audio waveform when an audio source is wired, and loop brackets. Scrubbing it moves every live card at once. Clicking a shot card solos and loops it.
- The preview card can be maximised to fill the canvas and restored; selecting a cast card highlights its element on stage, and picking on stage (`C`, DOM boxes and raycast 3D through a pick hook on `threeBinder`, never in `@gerak/stage`) selects its card.

### 10. Casts are rows in their scene card, and can be pulled out

- A cast stands for one name on both sides: the `data-cast` element in `<name>.html` (from `scanHtmlCasts`) and the scene member of that name. It links to both: open the element in the page, open the member in the scene file.
- By default a cast is a row in its scene card, grouped under the shot that owns it in collapsible sections; members that span the whole reel sit under "Reel", and a scroll page's sub-scenes group the same way. A row shows the name, its kind, its mismatch badge, and its own ports: `time` and `pose` in from moves, `media` in for a media box, `pose` out for a `carry`, `stage` out. Pieces with dozens of casts stay readable.
- Dragging a row out of its scene card, or double-clicking it, pulls it out into a full cast card; its wires move with it, and pushing it back returns it to a row. Which casts are pulled out is kept in the sidecar. A wire always ends on one cast, row or card.
- A full cast card's body is a mini frame in the stage's aspect: the element's box at the playhead, its trail across the scene (from `sampleScene`), and its rest box from the measure cache; below it the tag, first class, text (truncated) and the member's `steps`. A selected card also shows a live crop of the preview at that box.
- A list or split text shows its part count and draws each part's box in the mini frame.
- Mismatches are shown, never hidden, on the row and on the card: an element with no member gets an "unused cast" badge (listed under "Page only" in the scene card); a member with no element is red and carries the mount error; a stale measure cache shows "re-measure", which runs `gerak measure` as a job.

### 11. The look is a card too

- The look stays where the agent writes it: the page's `<style>` and linked CSS. There is no look file.
- One look card per piece reads the page's styles statically: CSS custom properties on `:root` and on the frame root, grouped as colour (swatches), type (font families, sizes, weights) and space (lengths), plus the fonts the page loads.
- Editing a swatch, a font or a length patches that custom property's value (Decision 6); the stage restyles on the next frame through the page's own hot swap, with no remount.
- A value written inline on an element, or a rule that sets a colour without a custom property, is listed as "set in CSS" with its file and line, and is not edited from the canvas.
- Contrast: each text cast card shows its contrast ratio against what is behind it at the playhead (the same measure `gerak check` uses) and turns amber under 4.5:1 (3:1 for large text), so a palette edit shows its cost at once.

### 12. A clean modern design system

- One token file, `packages/studio/src/theme.css`, owns every colour, radius, space, shadow and duration as CSS custom properties; no component holds a literal colour.
- Neutral surfaces (near-black canvas and dark-grey cards by default, a light theme from the same tokens), one quiet accent for selection and focus, and one colour per port type used only on ports and wires.
- Cards: 12 px radius, hairline border, 8 px spacing grid, a soft shadow only on hover and selection; header with icon, name and kind chip; body preview; ports on the edges.
- Type: the system UI font at 13 px base with one scale, monospaced numbers for ms, px and knob values.
- Wires: smooth curves, dimmed when unrelated to the selection, a moving dash while a job they feed runs.
- Canvas: dot grid, minimap and zoom controls. Dragging empty canvas, space-drag or a two-finger scroll pans; the wheel or a pinch zooms about the pointer; `F` frames all; Shift-drag box-selects. A card drags by its header, snaps to the grid and keeps its place in the sidecar; dragging from a port to a matching port proposes a wire, which applies as a patch (Decision 6) or shows "edit in code". `/` opens a quick card palette (find and focus, not create).
- Interface motion of 200 ms or less, none under `prefers-reduced-motion`; visible focus rings; text contrast at least 4.5:1.
- This design system is the Studio's own; it never styles a piece. A piece's look stays its own (Decision 11).

## Slices

The agent plan (`plan/studio-agent-plan.md`) runs after PR 2 and before PR 3.

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Studio package, provenance, graph and `gerak studio graph` | 1, 2, 3, 4, 5 | `@gerak/studio` exists in the `modules` group; `gerak studio graph` prints the cards and wires of `reel`, `explainer`, `cookie` and `launch-day` with no browser; ids survive a rename-free edit; a project without `@gerak/studio` gets an install hint |
| PR 2: Canvas shell, design system, preview card and timeline; `gerak live` retired | 1, 2, 9, 12 | `gerak studio open reel` opens a themed canvas laid out from the graph, the real page in the preview card with reel presets and safe zones, one timeline driving it, and layout kept in the sidecar; `gerak live` and its page are gone from `@gerak/tools` |
| PR 3: Live previews, knobs and picking | 6 (numbers), 8 (live), 9 | cast mini frames and move sparklines follow the playhead; knob, beat and shot-edge drags patch code and refuse stale writes; picking selects cards both ways |
| PR 4: Sources, jobs, render file and structural patches | 4, 6, 7, 8 | captions dropped on the canvas run `gerak cues`, wire into the scene by a code patch, and a render card exports the reel with its audio from `reel.render.json`, all without opening the file; `gerak render reel` in a terminal gives the same video |
| PR 5: Cast and look | 6 (CSS, text), 10, 11 | casts list as rows under their shots with their own ports, pull out into cards and back with their wires, and show their element's box, trail and mismatches; the look card edits the reel's palette and type through custom properties, text cast cards edit their words, and contrast chips update at the playhead |

## Tests first, per slice

- PR 1: `provenanceOf` gives `scene` and ordered `StepSummary[]` across sub-scenes and shots, with shot beats under compiled names, and `compileScene`'s output is unchanged; `graphOf` on `reel` gives four shot cards in order, one `beats` job wired by `events` to the scene and by `media` from `audio/music.m4a`, and `time` wires from beats to moves; a `code` card for a hand-written motion; ids unchanged after a knob edit; a dynamic import becomes a "set in code" card; the boundary scan keeps every `core` package free of `@gerak/studio`.
- PR 2: the canvas renders every card the graph lists and no others; a moved card's position survives a reload and a stale id is pruned; the preview card runs `cookie.html` with its 3D binder at `1440x900` and `390x844`, and a reel at `1080x1920` with the `tiktok` overlay; a throwing edit keeps the last good frame; no literal colour appears outside `theme.css` (a repo test).
- PR 3: scrubbing to `t` gives every cast card `frame(stage, t)`'s pose; dragging a beat edge rewrites its literal and a concurrent file change refuses the write; picking a 3D object selects its card.
- PR 4: each patch in the closed set applies to its fixture and refuses a reshaped one without writing; a cues job turns `stale` when its `.srt` changes; `gerak render` reads `<name>.render.json`, a flag overrides one field, and the render card passes no settings of its own.
- PR 5: the reel's scene card lists each cast under the shot that owns it, and reel-level members under "Reel"; pulling a row out keeps its wires and its pulled-out state survives a reload; a page with an extra `data-cast` element and a scene with a member missing from the page give one "unused cast" badge and one red cast; a cast card's mini-frame box at `t` equals the element's measured box at `t`; editing a swatch rewrites only that custom property and refuses an inline colour; a text edit rewrites plain text and refuses an element with child markup; a dark-on-dark palette edit turns the affected text card's contrast chip amber.

## Proof and measure

- Open `reel`, `explainer` and `cookie` as canvases. An agent edits each scene file in code and every canvas redraws without losing positions.
- A person, without opening a file: wires a captions file through a cues card into the explainer, tunes a shot overlap, recolours the reel's accent and rewrites its call to action, and renders the reel with its music from the canvas.
- Making a piece costs no more than before: `npm run metrics` and the size of `core.md`, `stage.md` and the authoring reference pages do not grow from this plan.
- The lead reviews the canvas at Desktop and laptop sizes in both themes against Decision 12 before each PR is opened.

## Docs and record

- Write `docs/ADR-205-studio-canvas.md` recording Decisions 1–12; run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, `npm run format`.
- Write `packages/studio/docs/README.md` and `studio.md` around the canvas and `gerak studio`; remove `gerak live` from `packages/tools/docs/commands.md` and point to the Studio; document `<name>.render.json` beside `gerak render`; update `docs/SESSION-STATUS.md` as slices land.

## Not in this plan

- Building pieces on the canvas: adding cast, moves or scenes from cards. It is the Studio's later goal, for the owner first and people without an agent after; each action will be one more patch in Decision 6's closed set that writes the code an agent would write, added in a later plan after PR 5.
- A free-form CSS or layout editor: moving, resizing or restyling elements beyond custom properties and plain text.
- A look file or a typed look API.
- Keyframe diamonds or sidecar keyframes (ADR-170).
- The agent command bus, pins, interaction recording and the `Cmd+K` seam: `plan/studio-agent-plan.md`.
