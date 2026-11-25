# Studio canvas: a piece as connected cards

## Goal

A person directing agent-written motion opens `gerak live <piece>` and sees the piece as a canvas of connected cards: its look, its cast, its sources, timing, moves and outputs. They scrub one shared timeline, see where each cast element is and goes, tune knobs, colours, type and text, wire in audio, captions and clips, and run render and check from the canvas, without reading the scene file or the page. The agent keeps writing those files, and the canvas redraws from them. The code adds a graph model built from the compiled stage and the page, a node canvas in `live.html` with a clean modern design system, live card previews driven by one playhead, a real-page preview card, and a small set of code patches for the edits a canvas may make.

Status: planned 2026-11-25. It replaces the old Studio plan's stage, provenance and timeline decisions; `plan/studio-agent-plan.md` builds the agent bus and pins on top of it. Five pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `live.html` (`packages/tools/src/pages/live/`: `host.tsx`, `stage-view.tsx`, `timeline.tsx`, `code-panel.tsx`, `guard.ts`) plays one scene with a timeline, speed and loop controls, hot swaps, and range-checked number scrubbing in `-scene.ts` files.
- `stage-view.tsx` injects the page's markup into a `<div>` without running `<name>-main.ts`, so 3D binders, sticky `100vh` sections and `@media` rules do not run; a saved `<name>.html` reloads the whole page.
- `compileScene()` (`packages/stage/src/run/compile.ts`) flattens sub-scenes and `shot(...)` entries into `stage.members` and `stage.beats` and keeps no record of which scene, shot or move each came from.
- A piece's sources are scattered: cue JSON is imported by the scene module, clip `src` lives in the HTML, audio for a render is a `gerak render --audio` flag.
- A piece has two sources of truth: the scene file owns motion, and `<name>.html` owns the look (markup, `<style>`, linked CSS) and the cast (`data-cast` elements). `scanHtmlCasts` (`packages/tools/src/page/cast-file.ts`) already reads the cast statically, and `gerak measure` caches each element's rest box in `<name>.measure.json`.
- `@gerak/tools` already depends on React and `typescript` (peer); it has no node-canvas library.

## Decisions

### 1. The code is the source; the canvas is a view of it (`@gerak/tools`)

- The scene file stays the single source of truth for motion (ADR-170). The canvas never stores motion.
- One pure function owns the graph: `graphOf(stage, sources): StudioGraph` in `packages/tools/src/studio/graph.ts`, built from the compiled stage (Decision 2) and the piece's sources (Decision 3). The canvas, the CLI and tests all read this one value.
- Card ids derive from code identity (`member:<name>`, `beat:<name>`, `shot:<name>`, `source:<path>`, `output:<kind>`), so they survive edits; renaming a member in code renames its card.
- One sidecar, `.gerak/canvas/<piece>.json`, holds only what is not motion: card positions and collapsed state, the canvas viewport, and output settings (Decision 6). Ids no longer in the graph are dropped on save.
- `gerak graph <piece> [--json]` prints the graph: cards, wires, stale jobs and patch refusals. Agents and tests read structure without a browser.

### 2. Provenance on the compiled stage (`@gerak/stage`)

- `compileScene()` records on each compiled `Member` an optional `scene?: string` (from `scene({ name })` across merged sub-scenes and `shot(...)` entries) and `steps: readonly StepSummary[]`. A step is a closed union read with an exhaustive `switch`: `travel` (target, fit), `motion` (label, beat or window, joins), `modifies`, `shows` (windows), `limits`.
- Each compiled beat records `scene?: string`; `stage.shots` already records shot order and ms.
- Provenance is data on the stage, never behaviour: `frame()` ignores it.

### 3. Sources, read statically (`@gerak/tools`)

- `packages/tools/src/studio/sources.ts` reads a piece's sources with the TypeScript compiler API and an HTML scan, no execution:
  - JSON imported by the scene module: `*.cues.json` and `*.words.json`, with the `cues` option they feed;
  - `<video>` and `<audio>` `src` on cast elements that a `box(name, { media: true })` binds;
  - files under the piece's `audio/` and `media/` folders not yet wired anywhere, shown as loose source cards.
- A source it cannot place (a computed path, a dynamic import) becomes a card marked "set in code", with no wires.

### 4. Cards and wires

- Cards are a closed union `CardKind`, read with exhaustive `switch`es:

  | Group | Kinds | Body |
  | --- | --- | --- |
  | Source | `audio`, `captions`, `clip`, `image`, `model`, `input` | waveform, transcript lines, poster frame, thumbnail |
  | Tool (a job) | `beats`, `cues` | cue ticks; state chip and Run |
  | Timing | `beat`, `shot`, `scene` | a bar in the piece's ms, overlap badge |
  | Look | `look` | colour swatches, type, space (Decision 10) |
  | Cast | `box`, `text`, `shape`, `object`, `list` | mini frame with box and trail, tag and text (Decision 9) |
  | Move | `motion`, `code` | sparkline of each field; knobs |
  | Output | `preview`, `check`, `render` | the real page; findings; render progress |

- A `code` card stands for a hand-written motion function: it opens the file at the function and shows its inputs and outputs, but its inside is not drawn as wires.
- Wires carry a closed union `PortType`: `time` (beat or shot into a move), `events` (cues into a scene, a beat cue into a shot's `until`), `pose` (a statically known `carry` from one member to another), `media` (a clip into a media box), `stage` (a scene into preview, check or render).
- Only statically known links are drawn. A `context.read` inside a motion function is not inferred; its card notes "reads other members at run time".
- A wire whose code no longer compiles turns red and carries the compile error.

### 5. Edits are code patches, from a closed set

- The canvas edits code only through one owner, `packages/tools/src/studio/patch.ts`, with a closed union of patches, each tested on fixture files and refused when the code is not in the shape it expects:
  - set a number (existing `guard.ts` range writer): knobs, beat ms, shot `length` and `overlap`;
  - wire a cues file into a scene: add the JSON import and the `cues` entry;
  - wire a clip into a box: add `{ media: true }` and the element's `src`;
  - reorder shots inside one `scene(...)` call;
  - set a CSS custom property's value in the page's `<style>` or linked CSS file (Decision 10);
  - set the text of a cast element whose content is plain text (Decision 9).
- A refused patch shows "edit in code" with the file and line; it never writes a partial change. A patch whose file changed since the graph was built is refused (stale write).
- Adding cast, moves or scenes from the canvas is not in this plan (see Not in this plan).

### 6. Live cards and job cards

- Live cards (timing, cast, move, look, preview) evaluate at the one playhead. The preview card's mount is the clock master; cast mini frames and move sparklines come from `frame()` and `sampleScene` in the canvas page, never from extra iframes.
- Job cards (`beats`, `cues`, `check`, `render`) run once through a dev-server endpoint, `/__gerak/job`, that calls the same functions as the CLI. A job's state is a closed union: `idle`, `running`, `done`, `stale` (an input changed since the cached output), `failed`. Outputs are cached in `.gerak/cache` by a hash of their inputs.
- Output settings (render fps, audio tracks with offset and gain, safe-zone profile, check viewports) live in the canvas sidecar and are passed to the job as flags; the CLI stays the one implementation.

### 7. The preview card and the shared timeline

- The preview card hosts the real `<name>.html` in an `<iframe>` (with `?gerakStudio=1`), so `<name>-main.ts`, 3D binders, sticky sections and media queries run. It reads the mount from `window[Symbol.for("@gerak/dom/mounts")]`.
- Size presets: Desktop `1440x900`, Mobile `390x844`, Fill, custom, and the reel frames `1080x1920`, `1920x1080`, `1080x1080` letterboxed, with a `Safe zones` overlay from the one profile table in `packages/tools/src/page/safe-zone.ts`.
- Hot swap keeps time: a scene-only change calls `mounted.replace(next)`; an HTML, CSS or main change swaps in a second iframe at the same `{ ms, scrollY, events }`. A failing compile or frame keeps the last good frame under a banner with file, line and message.
- One timeline strip runs along the bottom of the canvas: time ruler, beat and shot bars, cue ticks, the audio waveform when an audio source is wired, and loop brackets. Scrubbing it moves every live card at once. Clicking a shot card solos and loops it.
- The preview card can be maximised to fill the canvas and restored; selecting a cast card highlights its element on stage, and picking on stage (`C`, DOM boxes and raycast 3D through a pick hook on `threeBinder`, never in `@gerak/stage`) selects its card.

### 8. A clean modern design system

- One token file, `packages/tools/src/studio/theme.css`, owns every colour, radius, space, shadow and duration as CSS custom properties; no component holds a literal colour.
- Neutral surfaces (near-black canvas and dark-grey cards by default, a light theme from the same tokens), one quiet accent for selection and focus, and one colour per port type used only on ports and wires.
- Cards: 12 px radius, hairline border, 8 px spacing grid, a soft shadow only on hover and selection; header with icon, name and kind chip; body preview; ports on the edges.
- Type: the system UI font at 13 px base with one scale, monospaced numbers for ms, px and knob values.
- Wires: smooth curves, dimmed when unrelated to the selection, a moving dash while a job they feed runs.
- Canvas: dot grid, snap to grid, minimap, zoom controls; space-drag pans, `F` frames all, `/` opens a quick card palette for the canvas (find and focus, not create).
- Interface motion of 200 ms or less, none under `prefers-reduced-motion`; visible focus rings; text contrast at least 4.5:1.
- The canvas engine is React Flow (`@xyflow/react`, MIT), added as a dependency of `@gerak/tools`; gerak owns the cards, wires and theme drawn inside it.
- This design system is the Studio's own; it never styles a piece. A piece's look stays its own (Decision 10).

### 9. Cast cards join the page and the scene (`@gerak/tools`)

- A cast card stands for one name on both sides: the `data-cast` element in `<name>.html` (from `scanHtmlCasts`) and the scene member of that name. The card links to both: open the element in the page, open the member in the scene file.
- Its body is a mini frame in the stage's aspect: the element's box at the playhead, its trail across the scene (from `sampleScene`), and its rest box from the measure cache; below it the tag, first class, text (truncated) and the member's `steps`. A selected card also shows a live crop of the preview at that box.
- A list or split text shows its part count and draws each part's box in the mini frame.
- Mismatches are shown, never hidden: an element with no member gets an "unused cast" chip; a member with no element is a red card carrying the mount error; a stale measure cache shows "re-measure", which runs `gerak measure` as a job.

### 10. The look is a card too (`@gerak/tools`)

- One look card per piece reads the page's styles statically: CSS custom properties on `:root` and on the frame root, grouped as colour (swatches), type (font families, sizes, weights) and space (lengths), plus the fonts the page loads.
- Editing a swatch, a font or a length patches that custom property's value (Decision 5); the stage restyles on the next frame through the page's own hot swap, with no remount.
- A value written inline on an element, or a rule that sets a colour without a custom property, is listed as "set in CSS" with its file and line, and is not edited from the canvas.
- Contrast: each text cast card shows its contrast ratio against what is behind it at the playhead (the same measure `gerak check` uses) and turns amber under 4.5:1 (3:1 for large text), so a palette edit shows its cost at once.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Graph model, provenance, sources and `gerak graph` | 1, 2, 3, 4 | `gerak graph` prints the cards and wires of `reel`, `explainer`, `cookie` and `launch-day` with no browser; ids survive a rename-free edit |
| PR 2: Canvas shell, design system, preview card and timeline | 1, 7, 8 | `gerak live reel` opens a themed canvas laid out from the graph, the real page in the preview card with reel presets and safe zones, one timeline driving it, and layout kept in the sidecar |
| PR 3: Live previews, knobs and picking | 5 (numbers), 6 (live), 7 | cast mini frames and move sparklines follow the playhead; knob, beat and shot-edge drags patch code and refuse stale writes; picking selects cards both ways |
| PR 4: Sources, jobs and structural patches | 3, 5, 6 | captions dropped on the canvas run `gerak cues`, wire into the scene by a code patch, and a render card exports the reel with its audio, all without opening the file |
| PR 5: Cast and look | 5 (CSS, text), 9, 10 | every cast card shows its element's box, trail and mismatches; the look card edits the reel's palette and type through custom properties, text cast cards edit their words, and contrast chips update at the playhead |

## Tests first, per slice

- PR 1: `compileScene` attaches `scene` and ordered `StepSummary[]` across sub-scenes and shots; `graphOf` on `reel` gives four shot cards in order, one `beats` source wired by `events` to the scene, and `time` wires from beats to moves; a `code` card for a hand-written motion; ids unchanged after a knob edit; a dynamic import becomes a "set in code" card.
- PR 2: the canvas renders every card the graph lists and no others; a moved card's position survives a reload and a stale id is pruned; the preview card runs `cookie.html` with its 3D binder at `1440x900` and `390x844`, and a reel at `1080x1920` with the `tiktok` overlay; a throwing edit keeps the last good frame; no literal colour appears outside `theme.css` (a repo test).
- PR 3: scrubbing to `t` gives every cast card `frame(stage, t)`'s pose; dragging a beat edge rewrites its literal and a concurrent file change refuses the write; picking a 3D object selects its card.
- PR 4: each patch in the closed set applies to its fixture and refuses a reshaped one without writing; a cues job turns `stale` when its `.srt` changes; the render card's settings reach `gerak render` as flags.
- PR 5: a page with an extra `data-cast` element and a scene with a member missing from the page give one "unused cast" chip and one red card; a cast card's mini-frame box at `t` equals the element's measured box at `t`; editing a swatch rewrites only that custom property and refuses an inline colour; a text edit rewrites plain text and refuses an element with child markup; a dark-on-dark palette edit turns the affected text card's contrast chip amber.

## Proof and measure

- Open `reel`, `explainer` and `cookie` as canvases. An agent edits each scene file in code and every canvas redraws without losing positions.
- A person, without opening a file: wires a captions file through a cues card into the explainer, tunes a shot overlap, recolours the reel's accent and rewrites its call to action, and renders the reel with its music from the canvas.
- The lead reviews the canvas at Desktop and laptop sizes in both themes against Decision 8 before each PR is opened.

## Docs and record

- Write `docs/ADR-205-studio-canvas.md` recording Decisions 1–10; run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, `npm run format`.
- Rewrite `packages/tools/docs/live.md` around the canvas; add `gerak graph` to `packages/tools/docs/commands.md`; update `docs/SESSION-STATUS.md` as slices land.

## Not in this plan

- Building scenes on the canvas: adding cast, moves or scenes from cards. Each would be one more patch in Decision 5's closed set, added card by card in a later plan.
- A free-form CSS or layout editor: moving, resizing or restyling elements beyond custom properties and plain text.
- Keyframe diamonds or sidecar keyframes (ADR-170).
- The agent command bus, pins, interaction recording and the `Cmd+K` seam: `plan/studio-agent-plan.md`.
- A separate studio package: the canvas stays in `@gerak/tools` until a second app needs it (`plan/roadmap.md` Stage 18).
