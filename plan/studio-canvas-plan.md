# Studio canvas: a piece as connected cards

## Goal

A person directing agent-written motion opens `gerak studio open <piece>` and sees the piece as a canvas of connected cards: its look, its cast, its sources, inputs and state, timing, moves and outputs. They wire the whole piece or one of its scenes into a player card and play it there and watch the cards and wires that are active light up, tune knobs, edit hand-written motion code in a side panel, colours, type and text, wire in audio, captions and clips, and run render and check from the canvas, without opening the scene file or the page. The agent keeps writing those files, and the canvas redraws from them. The code adds a separate `@gerak/studio` package holding a graph model built from the compiled scene, its source and the page, a node canvas with a clean modern design system, a real-page player card driving one playhead, and a small set of code patches for the edits a canvas may make; one data subpath of `@gerak/stage` and a render settings file read by `gerak render` are its only changes outside that package.

Status: planned 2026-11-25. PR 1 and PR 2 have landed, then `plan/studio-agent-plan.md` and `plan/mount-driver-plan.md`; PR 3 is next. Eight pull requests.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `@gerak/studio` holds the graph (`graphOf`, `readSources`), `gerak studio open` and `gerak studio graph`, the themed canvas, the preview card and the bottom timeline. `gerak live` is gone.
- `@gerak/stage/provenance` gives `provenanceOf(scene)`: each member's scene or shot and its steps, and each beat's scene or shot. A member's scene is recorded only for a sub-scene given `scene({ name })`; cookie's five sub-scenes have no name, so its graph shows one scene card holding about 100 members.
- A move that wraps a known move in a local helper (`backwards(slide(...))` in `saved`) reads as a `code` card; the inner move and its knobs are not shown.
- Wires attach to fixed sides (out on the right, in on the left), so a card dragged past the card it feeds loops its wire back.
- The timeline drives the page's clock (play, pause, seek, speed, loop, solo): a timed mount's own, or the seekable driver the canvas hands a live page such as cookie (`plan/mount-driver-plan.md`), whose take is the preset picked in the preview's menu, and which adds Replay.
- One preview card shows the whole piece; a sub-scene or shot cannot be previewed alone.
- `check` and `render` output cards are drawn and wired but do nothing.

## Decisions

### 1. The Studio is its own package; making a piece never needs it

- `packages/studio` publishes `@gerak/studio` in the `modules` group: it depends on `@gerak/core`, `@gerak/stage`, `@gerak/dom` and `@gerak/tools`, and nothing in `core` depends on it.
- It holds the graph, the sources reader, the patches, the canvas page, its theme, React Flow (`@xyflow/react`, MIT), the code editor and its own docs. A project that only makes pieces never installs it, and `core.md`, `stage.md` and the authoring reference pages never mention it.
- `gerak studio <subcommand>` is the one entry: the `gerak` binary forwards `studio` to the installed `@gerak/studio` bin, and without it prints how to install it. `gerak studio open <piece>` opens the canvas; `gerak studio graph <piece> [--json]` prints the graph; `plan/studio-agent-plan.md` adds its subcommands under the same prefix.

### 2. The code is the source; the canvas is a view of it

- The scene file stays the single source of truth for motion (ADR-170), and the page for the look and the cast. The canvas never stores either.
- One pure function owns the graph: `graphOf(piece, sources): StudioGraph` in `packages/studio/src/graph.ts`, built from the compiled stage and its provenance (Decision 3) and the piece's sources (Decision 4). The canvas, the CLI and tests all read this one value.
- Card ids derive from code identity (`member:<name>`, `beat:<name>`, `shot:<name>`, `scene:<name>`, `move:<member>.<step>`, `state:<name>`, `input:<kind>`, `source:<path>`, `job:<output path>`, `output:<kind>`), so they survive edits; renaming a member in code renames its card.
- One sidecar, `.gerak/canvas/<piece>.json`, holds only canvas state: card positions, collapsed and pulled-out state, the viewport, the preview card's size and the player settings (Decision 9). Ids no longer in the graph are dropped on save.
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
  - each `.moves(...)` argument of a statically named element, classified as a library `motion` (a call to a package function) or hand-written `code` (a local or relative function, `motion(...)` or an inline function), with its file and line;
  - a sub-scene with no `{ name }` takes the name of the `const` it is assigned to (`export const heroScene = scene(...)` gives `heroScene`); a written `{ name }` wins;
  - a call to a local function whose only argument is a library move (`backwards(slide({ ... }))`) reads as that library move with the local function as a wrapper; a wrapper inside a wrapper, or a wrapper around anything else, stays a `code` card;
  - for each `code` motion: its doc comment, the inputs it reads (`scroll`, `pointer`, a `state`, `context.read` of a member), the pose fields its returned literals set, and the trigger and length of a `transition` it calls with a literal `ms`;
  - each `state(...)` and `shared(springTo(...))` bound to a `const`, with the event names and `target` it folds.
- A source it cannot place (a computed path, a dynamic import, a spread of moves) becomes a card marked "set in code", with no wires.

### 5. Cards and wires

- Cards are a closed union `CardKind`, read with exhaustive `switch`es:

  | Group | Kinds | Body |
  | --- | --- | --- |
  | Source | `audio`, `captions`, `clip`, `image`, `model`, `take` | waveform, transcript lines, poster frame, thumbnail; a take's event ticks and length |
  | Input | `input`, `state` | what the viewer does (`scroll`, `pointer`, a watched element's events, a page's sent events); a state's value at the playhead |
  | Tool (a job) | `beats`, `cues` | cue ticks; state chip and Run |
  | Timing | `beat`, `shot`, `scene` | a bar in the piece's ms, overlap badge; a scene lists its shots and its cast as rows (Decision 10) |
  | Look | `look` | colour swatches, type, space (Decision 11) |
  | Cast (pulled out) | `box`, `text`, `shape`, `object`, `list` | mini frame with box and trail, tag and text (Decision 10) |
  | Move | `motion`, `code` | name, doc comment, wrapper tags and knobs; a code card shows what it reads and sets |
  | Output | `preview`, `check`, `render` | the player; findings; render progress |

- One move card per use: `move:<member>.<step>` is one call in one `.moves(...)`, with its own beat, knobs and cast. A function used several times is one definition and several cards; its definition is never a card.
- A move card does not repeat its timing: the wire from its beat shows when it runs. Its wrapper tags (`backwards`) sit on the card and open the wrapper's code. Its file and line sit behind a small code icon.
- A `code` card shows its doc comment as its description, `reads:` chips (`scroll`, `pointer`, states, other members) and `sets:` fields; its inside is never drawn as wires and its code is never on the card (Decision 13). A `code` card with a `transition` trigger shows it, for example `⚡ zone change → 720 ms`.
- A `state` card is one per state, with one wire out to each move that reads it; a spring over it is a tag (`ctaHovered ~spring`), not a card.
- Wires carry a closed union `PortType`: `time` (beat or shot into a move), `events` (cues or an input into a scene, a beat or a state; a beat cue into a shot's `until`), `value` (a state into a move), `pose` (a move into its cast, and a statically known `travel`, `stayWith` or `carry` from one member to another), `media` (a source file into a job, a clip into a media box), `stage` (a scene into preview, check or render).
- A `take` card is one recorded events preset (`.gerak/presets/<piece>/<name>.json`). Its `events` wire into a preview, check or render card adds the take's events to the page's own input there; a card takes at most one take. Take cards never wire into a scene or state: those `events` wires come from `input` cards and code.
- A `stage` or take wire into a preview, check or render card is the person's choice, not code: it is kept in the sidecar, drawn dashed, and editing it never patches a file. Every other wire comes from code.
- Only statically known links are drawn. A `context.read` inside a motion function that the reader cannot name is noted on its card as "reads other members at run time".
- A wire whose code no longer compiles turns red and carries the compile error.
- Wires float: each wire attaches to the sides of its two cards that face each other, picked from the cards' centres on every drag frame, so a card dragged past the card it feeds never loops its wire. Ports on cast rows (Decision 10) float only left or right.

### 6. Edits are code patches, from a closed set

- The canvas edits files only through one owner, `packages/studio/src/patch.ts`, with a closed union of patches, each tested on fixture files and refused when the file is not in the shape it expects:
  - set a number (the range writer moved from `guard.ts`): knobs, beat ms, shot `length` and `overlap`;
  - replace the text of one function or `const` initializer (Decision 13);
  - wire a cues file into a scene: add the JSON import and the `cues` entry;
  - wire a clip into a box: add `{ media: true }` and the element's `src`;
  - reorder shots inside one `scene(...)` call;
  - set a CSS custom property's value in the page's `<style>` or linked CSS file (Decision 11);
  - set the text of a cast element whose content is plain text (Decision 10);
  - set a field of `<name>.render.json` (Decision 7).
- A patch writes the code an agent would write; the canvas has no format of its own. A refused patch shows "edit in code" with the file and line; it never writes a partial change. A patch whose file changed since the graph was built is refused (stale write).
- Adding or removing cast, moves or scenes from the canvas is not in this plan (see Not in this plan). Nothing on the canvas deletes: the Delete key does nothing, on cards from code and on the canvas's own cards and wires alike.

### 7. Render settings are a piece file (`@gerak/tools`)

- `<name>.render.json` beside the page holds a piece's output settings: fps, frame size, audio tracks with offset and gain, safe-zone profile and check viewports. An agent writes it, the canvas edits it through a patch, and `gerak render <piece>` and `gerak check` read it, so a terminal render and a canvas render are the same video.
- Flags given on the command line override the file for that run. A piece with no file renders as today.
- Render settings are never player settings: speed, loop and solo change only what the person watches and live in the sidecar.

### 8. Live cards and job cards

- Live cards (timing, cast, state, preview) evaluate at the one playhead. The player card's mount is the clock master; cast mini frames come from `frame()` in the canvas page, never from extra iframes.
- Job cards (`beats`, `cues`, `check`, `render`) run once through a dev-server endpoint, `/__gerak/job`, that calls the same functions as the CLI. A job's state is a closed union: `idle`, `running`, `done`, `stale` (an input changed since the cached output), `failed`. Outputs are cached in `.gerak/cache` by a hash of their inputs.
- A check or render card works on what is wired into it (Decision 9): the whole piece, or one scene's or shot's span, under the take wired into it, if any. A render of a live page under a scroll take is a video of that scroll-through.
- A check card lists its findings; clicking one moves the playhead to its moment and selects and outlines the cast it names, through the activity and picking paths (Decisions 14 and 10).

### 9. The preview card is the player

- The preview card hosts the real `<name>.html` in an `<iframe>` (with `?gerakStudio=1`), so `<name>-main.ts`, 3D binders, sticky sections and media queries run. It reads the mount from `window[Symbol.for("@gerak/dom/mounts")]`.
- A preview card plays what is wired into it (Decision 10): the scene card's own `stage` port gives the whole piece; a scene or shot row's port gives that part in context. In context means the same page and the same whole scene, with the player confined to the part's span: its ms range on a timed piece, the scroll range over which its cast is in view on a scroll page. Play loops that span.
- Several preview cards may be open, each wired to its own part. One plays live at a time, the one last used; the others hold their last frame until clicked. The bottom timeline follows the live one.
- Size presets: Desktop `1440x900`, Mobile `390x844`, Fill, custom, and the reel frames `1080x1920`, `1920x1080`, `1080x1080` letterboxed, with a `Safe zones` overlay from the one profile table in `packages/tools/src/page/safe-zone.ts`.
- The card resizes by its corner within limits: at least 320 px wide, at most the visible canvas, keeping the preset's aspect ratio. Fill follows the card's size.
- The card carries the player: play and pause, a scrubber with time, speed, loop and the size preset. These are its settings, kept in the sidecar with what is wired into it. The bottom timeline stays for beat and shot lanes, cue ticks and the waveform; the card and the timeline drive the one `Playhead`, never a second clock.
- Every page plays the same way: a timed page on its mount's clock driver, a live page on the Studio driver from `plan/mount-driver-plan.md`, which seeks, loops and replays the take wired into the card on top of the person's own input. There is no preset menu: recording on a preview card makes a new take card already wired into it. The controls read the card's state, a closed union read with an exhaustive `switch`: `waiting` (no mount yet) disables them; `ready` enables them. A live page adds Replay, which reloads it at the top so its load-time beats play again.
- Hot swap keeps time: a scene-only change calls `mounted.replace(next)`; an HTML, CSS or main change swaps in a second iframe at the same `{ ms, scrollY, events }`. A failing compile or frame keeps the last good frame under a banner with file, line and message.
- On a scroll page the timeline marks the scroll positions where a statically known trigger fires (a scroll beat's edges, a `transition` zone's bounds).
- The card can be maximised to fill the canvas and restored.

### 10. Casts are rows in their scene card, and can be pulled out

- A cast stands for one name on both sides: the `data-cast` element in `<name>.html` (from `scanHtmlCasts`) and the scene member of that name. It links to both: open the element in the page, open the member in the scene file.
- The root scene card lists its sub-scenes and shots as rows, each with its own `stage` port out, and has a `stage` port of its own for the whole piece. A sub-scene with no `{ name }` takes its `const`'s name (Decision 4).
- A move that reads a member of another sub-scene marks both rows "reads across scenes", so a part previewed in context names what it borrows.
- By default a cast is a row in its scene card, grouped under the shot or sub-scene that owns it in collapsible sections; members that span the whole reel sit under "Reel". A row shows the name, its kind, its mismatch badge, and its own ports: `time` and `pose` in from moves, `media` in for a media box, `pose` out for a `carry`, `stage` out. Pieces with dozens of casts stay readable.
- Dragging a row out of its scene card, or double-clicking it, pulls it out into a full cast card; its wires move with it, and pushing it back returns it to a row. Which casts are pulled out is kept in the sidecar. A wire always ends on one cast, row or card.
- A full cast card's body is a mini frame in the stage's aspect: the element's box at the playhead, its trail across the scene (from `sampleScene`), and its rest box from the measure cache; below it the tag, first class, text (truncated) and the member's `steps`.
- A list or split text shows its part count and draws each part's box in the mini frame.
- Mismatches are shown, never hidden, on the row and on the card: an element with no member gets an "unused cast" badge (listed under "Page only" in the scene card); a member with no element is red and carries the mount error; a stale measure cache shows "re-measure", which runs `gerak measure` as a job.
- Picking: selecting a cast outlines its element in the player. The player's select button (`⌖`), or holding Alt, turns on select mode: hovering outlines the nearest `data-cast` element with its name, a click selects its cast and leaves select mode, and an element with no cast shows "not in the cast". Outside select mode the page takes clicks as usual. A 3D object is picked as its canvas element.
- A page element that motions only read (a slot, a canvas, a section) is not a card: once the stage tells such elements apart from the cast (`plan/marks-plan.md`), a scene card lists them under a collapsed "Marks" section, a code card's `reads:` chip names them, and hovering the chip outlines the box in the player.

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
- Wires: smooth curves that float (Decision 5), dimmed when unrelated to the selection, flowing dots while active (Decision 14) or while a job they feed runs.
- Canvas: dot grid, minimap and zoom controls. Dragging empty canvas, space-drag or a two-finger scroll pans; the wheel or a pinch zooms about the pointer; `F` frames all; Shift-drag box-selects. A card drags by its header, snaps to the grid and keeps its place in the sidecar; dragging from a port to a matching port proposes a wire, which applies as a patch (Decision 6) or shows "edit in code". `/` opens a quick card palette (find and focus, not create).
- Interface motion of 200 ms or less; under `prefers-reduced-motion` nothing moves, and active cards and wires glow instead of flowing. Visible focus rings; text contrast at least 4.5:1.
- This design system is the Studio's own; it never styles a piece. A piece's look stays its own (Decision 11).

### 13. Code motions are edited in a docked panel

- A `code` card never shows code. Double-clicking it, or its `‹/›` button, opens the code panel docked at the canvas's right edge; the canvas and the playing preview stay visible beside it.
- The panel holds one editor (CodeMirror 6) at a time, showing the motion's own function or `const` initializer with its file and line. Opening another code card swaps the panel's content and asks first when there are unsaved changes.
- Saving writes exactly that function's text through the replace patch (Decision 6); the preview hot-swaps, and a compile or frame error shows on the card and in the panel. A file changed since the panel opened refuses the save and shows the newer text.
- A definition used by several move cards shows "used by N" in the panel header; clicking it highlights those cards on the canvas.
- Helpers the function calls are links that open their own code in the panel. A wrapper tag on a move card opens the wrapper's code the same way.
- The panel and every move card carry "ask agent", which pins the card through `plan/studio-agent-plan.md`'s pins.

### 14. Active cards light up as the piece plays

- At the playhead, the canvas computes the set of active cards and redraws only when that set changes:
  - a beat is active while the playhead is inside its window; a scroll beat while the scroll position is inside its range;
  - a move tied to a beat is active while its beat is;
  - a move with no beat (a `code` motion such as cookie's `jarRootMotion`) and a `state` are active while the value they give changes from one frame to the next, read from the player's mount; when that value cannot be read, the card shows a steady faint glow;
  - a cast is active while any of its moves is;
  - an input is active while its events arrive.
- A wire is active while both its ends are; an active wire shows flowing dots, drawn with CSS.
- A motion has one of three drivers, a closed union `Driver`: `timeline` (a beat at fixed ms), `scroll` (a scroll range) and `triggered` (an input starts it and time runs it, such as a `transition` or a spring). The rules above cover all three; the driver is shown on the card and decides where a timeline marks it (Decision 9).

## Slices

The agent plan (`plan/studio-agent-plan.md`) runs after PR 2 and before PR 3.

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Studio package, provenance, graph and `gerak studio graph` | 1, 2, 3, 4, 5 | landed |
| PR 2: Canvas shell, design system, preview card and timeline; `gerak live` retired | 1, 2, 9, 12 | landed |
| PR 3: Player card, scene rows, take cards and a readable graph | 4, 5, 9, 10 (scene rows), 12 | the preview card resizes within its limits and plays as the player on reel and on cookie, with Replay on cookie; cookie's scene card lists its five sub-scenes as rows named from their `const`s, and wiring `heroScene` into a second preview card plays and loops only the hero's stretch while the first plays the whole piece; two previews of the hero wired to two takes replay each take's scroll and clicks; `saved` shows `slide` and `fade` cards tagged `backwards` with their knobs; move cards show their doc comment and no file line; wires float to the facing sides |
| PR 4: Knobs | 6 (numbers) | knob, beat-edge and shot-edge drags patch their literals, the preview follows, and a concurrent file change refuses the write |
| PR 5: Inputs, state and activity | 4, 5, 9, 14 | cookie shows input and state cards with their values at the playhead, code cards with `reads:` and `sets:` and the spotlight roll's trigger; playing `saved` lights `markIn`, its moves and `mark` with flowing wires and leaves `markOut` dim; the jar's code card lights only while its pose changes; scroll mode marks trigger points |
| PR 6: Code panel | 6 (replace), 13 | editing `backwards` in the panel and saving rewrites only its text, the preview follows, "used by 4" highlights the four cards, and a concurrent file change refuses the save |
| PR 7: Sources, jobs, render file and structural patches | 4, 6, 7, 8 | captions dropped on the canvas run `gerak cues`, wire into the scene by a code patch, and a render card wired to the reel exports it with its audio from `reel.render.json` (wired to one shot, only that shot), a render card wired to cookie and a scroll take exports the scroll-through, all without opening the file; `gerak render reel` in a terminal gives the same video; clicking a check finding moves the playhead and selects its cast |
| PR 8: Cast, look and picking | 6 (CSS, text), 10, 11 | casts list as rows under their shots and sub-scenes with their own ports, pull out into cards and back with their wires, and show their element's box, trail and mismatches; select mode picks a cast from the player and selecting a cast outlines it; the look card edits the reel's palette and type through custom properties, text cast cards edit their words, and contrast chips update at the playhead |

## Tests first, per slice

- PR 3: a preview card dragged past its limits stops at 320 px wide and at the visible canvas, keeps the preset's aspect ratio, and keeps its size after a reload; the card's Play and the timeline's playhead read the same `Playhead` state; Play on cookie plays it on the Studio driver and Replay reloads it at scroll 0; `graphOf` on cookie gives `scene:heroScene` and four sibling scenes under `scene:cookie`, and a written `{ name }` wins over the `const`; a preview wired to a row plays only that row's span and keeps its wire after a reload, and a second preview holds its last frame while the first plays; recording on a preview makes a take card wired into it, and unwiring it stops its events while real input still lands; `graphOf` on `saved` gives four `motion` cards tagged `backwards`, and a wrapper inside a wrapper gives a `code` card; a card dragged to the far side of the card it feeds gets a wire attached to the facing sides.
- PR 4: dragging a knob or a beat edge rewrites its literal only; a concurrent file change refuses the write without writing.
- PR 5: at `t` inside `markIn` on `saved`, the active set is `markIn`, its two moves and `mark`, and not `markOut`; the active set is recomputed only when it changes; a beatless code motion whose pose holds still is inactive; `graphOf` on cookie gives `ctaHovered` one `state` card with one `value` wire to `lidUnseal`, and the spotlight roll's code card carries a `triggered` driver of 720 ms; under `prefers-reduced-motion` no wire animates.
- PR 6: the replace patch rewrites one function's text and leaves the rest of the file byte-identical; a reshaped or changed file refuses the save; "used by" counts every move card of the definition.
- PR 7: each structural patch applies to its fixture and refuses a reshaped one without writing; a cues job turns `stale` when its `.srt` changes; `gerak render` reads `<name>.render.json`, a flag overrides one field, and the render card passes no settings of its own; a check finding's click seeks to its time and selects its cast; a check or render card wired to a take runs under its events, and a render of cookie under a scroll take scrolls the page through it.
- PR 8: the reel's scene card lists each cast under the shot that owns it, and reel-level members under "Reel"; pulling a row out keeps its wires and its pulled-out state survives a reload; a page with an extra `data-cast` element and a scene with a member missing from the page give one "unused cast" badge and one red cast; a cast card's mini-frame box at `t` equals the element's measured box at `t`; a click in select mode on a nested element selects its nearest cast, and outside select mode the click reaches the page; editing a swatch rewrites only that custom property and refuses an inline colour; a text edit rewrites plain text and refuses an element with child markup; a dark-on-dark palette edit turns the affected text card's contrast chip amber.

## Proof and measure

- Open `reel`, `explainer`, `saved` and `cookie` as canvases. An agent edits each scene file in code and every canvas redraws without losing positions.
- A person, without opening a file: plays cookie hands-free and watches the active cards follow the scroll; rewrites `backwards` in the code panel; wires a captions file through a cues card into the explainer, tunes a shot overlap, recolours the reel's accent and rewrites its call to action, and renders the reel with its music from the canvas.
- Making a piece costs no more than before: `npm run metrics` and the size of `core.md`, `stage.md` and the authoring reference pages do not grow from this plan.
- The lead reviews the canvas at Desktop and laptop sizes in both themes against Decision 12 before each PR is opened.

## Docs and record

- `docs/ADR-205-studio-canvas.md` records Decisions 1–12; the PR that lands Decision 13 or 14 adds it there. Run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, `npm run format`.
- Keep `packages/studio/docs/README.md` and `studio.md` current with each slice; document `<name>.render.json` beside `gerak render`; update `docs/SESSION-STATUS.md` as slices land.

## Not in this plan

- Building pieces on the canvas: adding and removing cast, moves or scenes from cards. It is the Studio's later goal, for the owner first and people without an agent after; each action will be one more patch in Decision 6's closed set that writes the code an agent would write, added in a later plan after PR 8. Removing checks first: it takes a sub-scene out of its `scene(...)` call, asks before deleting its `const` or file, and refuses while other code still uses what it would remove (a `travel` to its slot, a `stayWith` or `context.read` of its members, a state it defines).
- Move curves: a sparkline per pose field over a move's window.
- Constants as knobs: a `const` a code motion uses, edited from its card.
- Setting a state's value from its card to try an input without doing it.
- Wiring a take into a preview, check or render card from the terminal, for an agent (a bus command such as `gerak studio wire take-1 --to preview`), to add once take wires exist; until then an agent records with `gerak studio act --save-preset` and replays with `gerak review --events @name`.
- Previewing a sub-scene isolated: mounting it alone while the rest of the page sits at rest.
- Picking a single 3D object inside a canvas element (a raycast pick hook on `threeBinder`).
- Floating code editors beside the docked panel.
- Telling marks apart from cast in `@gerak/stage` (`data-mark`, `marks`): `plan/marks-plan.md`.
- A free-form CSS or layout editor: moving, resizing or restyling elements beyond custom properties and plain text.
- A look file or a typed look API.
- Keyframe diamonds or sidecar keyframes (ADR-170).
- The agent command bus, pins, interaction recording and the `Cmd+K` seam: `plan/studio-agent-plan.md`.
