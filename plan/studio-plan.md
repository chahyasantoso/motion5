# Visual studio, spatial pins, and autonomous agent bus

## Goal

Creators and autonomous coding agents inspect, scrub, pick casts on, annotate, and tune live 2D and 3D web pages and multi-shot vertical/widescreen reels (`9:16` TikTok/Shorts/Reels, `16:9` YouTube) in one shared visual panel (`gerak live` / Studio), with agents driving the panel and reading numerical checks over CLI rather than screenshots. The code upgrades `live.html` to host real `<name>.html` pages and fitted reel frames inside a responsive `<iframe>` with non-destructive hot-swap, adds per-scene/per-shot storyboard tabs, platform safe-zone overlays, a Cast & Move inspector, `[Show Slots]`, and 2D/3D stage picking, adds a time/scroll/audio-waveform scrubber with beat bars, pose sparklines, `[● Record]` presets, and one-click MP4 export, adds `.gerak/pins.json` spatial frame pins (`gerak pins`), adds a bidirectional Studio Command & Inspection Bus (`gerak studio`), and lays transport-agnostic `StudioAgentPort` seams for a deferred in-canvas `Cmd+K` ACP prompt bar.

Status: planned 2026-11-24 to follow `plan/authoring-ergonomics-plan.md` and `plan/reels-plan.md` (fulfilling `plan/roadmap.md` Stage 18 live kit & web overlay for human + agent co-authoring). Four pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `packages/tools/src/pages/live/` (`host.tsx`, `stage-view.tsx`, `timeline.tsx`, `code-panel.tsx`, `clock-driver.ts`, `guard.ts`) already provides timed play/pause, `16 ms` frame stepping, `0.25x`/`0.5x`/`1x` speed, loop brackets, cue marks, error-guarded hot swaps on React/2D stage modules, and range-checked numeric literal scrubbing in `-scene.ts` files.
- `LiveStageView` (`packages/tools/src/pages/live/stage-view.tsx`) injects `markup` into an inline `<div>` with `frame: "fit"` and `clock: "timed"`, without running `<name>-main.ts`. Full multi-section scroll + Three.js + Rapier pages like `apps/pieces/cookie/cookie.html` cannot run in `live.html` with their 3D binders, sticky CSS `100vh` viewports, or `@media` breakpoints intact, `<name>.html` currently does a full page reload on save (`packages/tools/docs/live.md`), and timed reels lack `9:16` / `16:9` aspect presets, platform safe-zone overlays, synced audio waveform scrubbing, and one-click MP4 export.
- `compileScene()` (`packages/stage/src/run/compile.ts`) flattens merged sub-scenes (`scene(...)`) and sequential `shot(...)` entries (`plan/reels-plan.md`) into `stage.members` and `stage.beats` without recording which sub-scene (`SceneOptions.name`) or `shot(...)` owns each member/beat or what move stack was attached, so an inspector cannot group casts by section/shot or display applied moves.
- Every CLI page inspection (`gerak check`, `gerak review`, `gerak probe`, `gerak frames`) cold-boots a fresh headless Chromium + Vite server and reloads `.glb` / WASM assets from scratch (3–6 s per command), with no connection to an already-open `gerak live` window and no way for an agent to drive the live panel while a human watches (or hands back).
- Reviewers scrubbing a page or reel have no built-in way to click a 2D or 3D cast on stage and attach timestamped, scroll- and viewport-exact notes for an agent to resolve without screenshots.

## Decisions

### 1. Real-page & reel `<iframe>` stage, aspect/safe-zone presets, and last-good-frame hot-swap (`@gerak/dom`, `@gerak/tools`)

- Upgrade `gerak live <name>` (`packages/tools/src/pages/live/`) to host page and reel pieces inside a resizable `<iframe src="/<brief>/<name>.html?gerakStudio=1">` reading `window.__gerakMounts` (`packages/dom/src/mount.ts`), while preserving component-bundle support for standalone React examples (`timing`, `card`, `pile`).
- Provide viewport & aspect controls in the Studio header:
  - **Page presets:** `Desktop (1440x900)`, `Mobile (390x844)`, `Fill`, custom `WxH`, and `Split (Desktop + Mobile)` synchronized to the same clock/scroll state.
  - **Reel presets (`frame: "fit"`):** `TikTok / Reels / Shorts (1080x1920, 9:16)`, `YouTube (1920x1080, 16:9)`, and `Square (1080x1080, 1:1)` letterboxed cleanly inside the Studio canvas, plus a toggleable **`[Safe Zones]`** overlay (`tiktok`, `reels`, `shorts`, `youtube` — sharing the single safe-zone profile table from `plan/reels-plan.md` Decision 2) drawing status-bar, caption-tray, and action-rail masks over the frame.
- Non-destructive hot-swap: Vite module updates pre-compile and validate before swapping into the active mount (`mounted.replace(nextStage)` when only scene logic changed; double-buffered iframe swap preserving `{ ms, scrollY, events }` when HTML/CSS/`<name>-main.ts` changed). If compilation or frame evaluation fails, the visible iframe freezes on the last good frame and Studio shows a non-blocking error banner with file, line, and message.

### 2. Scene & shot introspection, Storyboard Strip, Cast & Move tree, and 2D/3D Pick Mode (`@gerak/stage`, `@gerak/three`, `@gerak/tools`)

- Preserve authoring provenance in `compileScene()` (`packages/stage/src/author/` and `run/compile.ts`):
  - Record optional `scene?: string` (from `scene({ name })` across merged sub-scenes and `shot(...)` entries) and `steps: readonly StepSummary[]` (`travel` target + `fit`, motion label + beat/window + joins, `modifies`, `shows` windows, `limits`) on each compiled `Member`, and `scene?: string` on each compiled beat.
- Render context-appropriate top navigation:
  - **Page Focus Tabs (`[All | <Scene>...]`):** For multi-section scroll pages, selecting a sub-scene scrolls the stage to that scene's measured top/pin range, filters the left Cast & Move tree and bottom timeline tracks to that scene's members and beats, and scopes loop playback to its range.
  - **Reel Shot Storyboard Strip (`[All] [1. Hook 2.2s] → [2. Product 3.3s] → ...`):** When `stage.shots` (`plan/reels-plan.md` Decision 1) is present, render sequential shot cards with durations and overlap badges. Clicking a shot solos and loops `[shot.from, shot.to]` and filters the Cast & Move tree; dragging a shot card's duration or overlap edge patches `shot(scene, { length, overlap })` literals in `.ts` via `guard.ts` so downstream shots shift automatically.
- Add `[Show Slots]` overlay (drawing labelled dashed outlines over static/referenced layout slots) and **Pick Mode (`C`)**:
  - Hovering/clicking resolves `[data-cast]` DOM boxes and, when `threeBinder` is active, raycasts bound `Object3D`s (via an optional `pick?(ndcX, ndcY, camera)` / bound-object registry hook on `threeBinder` / Studio overlay — keeping raycasting strictly out of `@gerak/stage`), selecting the cast (and `part` index for `parts: true` lists) in the tree and timeline.

### 3. Time, scroll & audio-waveform scrubber, beat bars, sparklines, `[● Record]` presets, and `[Export MP4]` (`@gerak/tools`)

- Code remains the sole owner of motion — **no keyframe diamond editor or sidecar keyframe JSON**:
  - **Beat bars & parameter knobs:** Render clock beats (`ms`) and scroll beats (`px`) as horizontal bars. Dragging a beat bar's edges or scrubbing numeric/ease pills in the Inspector patches literals directly in the owning `.ts` file through `code-panel`'s guarded range writer (`packages/tools/src/pages/live/guard.ts`).
  - **Pose sparklines:** Sample pure trajectories every `16 ms` (`sampleScene` / `changeRows`) to draw read-only per-field curves inside the selected cast's track (`keyframes([...])` stops render as dots only when authored in code).
  - **Audio waveform track & synced preview:** When a reel declares an audio file (`data-gerak-audio` on `<script>`/`<body>` or selected in Studio) or imports `.cues.json` (`gerak beats` from `plan/reels-plan.md` Decision 3), render the audio waveform and cue/beat ticks along the time ruler and play/seek Web Audio in Studio in lockstep with the playhead (`0.25x`/`0.5x`/`1x` and shot loop brackets) while keeping scenes pure.
  - **Dual axis + `[● Record]` interaction presets:** Provide synchronized `Time (ms)` and `Scroll (px)` scrubbers (with section landmarks). Clicking `[● Record]` captures real pointer, scroll, and `mounted.send(...)` events from the iframe into `.gerak/presets/<piece>/<preset>.json` (`Events` list), displaying event pins on the timeline so interactive bursts (such as `cookie`'s 4 adds + jar seal) scrub backward/forward at `0.25x` and run directly in `gerak review <scene.ts> --events @<preset>`.
  - **One-click `[Export MP4]`:** Studio header button invokes `gerak render` (`plan/reels-plan.md` Decision 3, `60`/`30 fps` + optional `--audio`) in a background job and streams frame progress to the UI.

### 4. Bidirectional Studio Command & Inspection Bus — Option 1 (`@gerak/tools`)

- Every Studio UI action dispatches through one `StudioController` state/command bus exposed by the Vite server at `/__gerak/studio` (WebSocket + JSON HTTP) and driven from the terminal via `npx gerak studio <subcommand>`:
  - `gerak studio status` — active piece, scene/shot focus, viewport & safe-zone profile, `atMs`, `scrollY`, selected `{ cast, part }`, active preset/audio, and compile/review health.
  - `gerak studio focus [--scene <name|all>] [--shot <name|index|all>]` and `gerak studio viewport <WxH|tiktok|reels|shorts|youtube>` — switches scene/shot focus, viewport size, and safe-zone overlay live.
  - `gerak studio seek [--ms <n>] [--scroll <px|selector>]` and `gerak studio play [--from ms] [--to ms] [--speed n]` — scrubs or loops the stage.
  - `gerak studio act '<action-list>' [--save-preset <name>]` — executes pointer/scroll actions on the warm iframe and optionally saves the recorded `Events` preset.
  - `gerak studio select <cast> [--part <i>]` and `gerak studio inspect [--cast <name>]` — returns exact live poses, DOM rects, 3D `ObjectBounds3d`, parent/slot geometry, and applied move stack in `< 20 ms` with **zero screenshots**.
  - `gerak studio check [--sizes WxH,WxH] [--safe-zone tiktok|reels|shorts|youtube]` — runs warm overlap/jump/hold/contrast/text-cutoff/safe-zone + scene-value checks against the loaded session (`< 100 ms`).
  - `gerak studio render [--fps 60|30] [--audio <file>] [--out <file.mp4>]` — exports the active reel to H.264 + AAC MP4 via `gerak render`.
  - `gerak studio frame [--crop <cast|x,y,w,h>] [--out <file>]` — captures a targeted PNG only when visual confirmation is explicitly needed.
- **Headless parity (`gerak studio --headless`):** When an agent runs `gerak studio ...` with no browser tab connected, the server boots and reuses one persistent headless Chromium tab pointed at `live.html?scene=<name>`, giving identical sub-100 ms warm iteration unattended or in `/goal` runs.
- **Follow Mode & Manual Override:** While RPC commands arrive, Studio shows `[🤖 Agent Driving · Following]` and mirrors the agent's focus/scrubbing live. Any human mouse/scroll/key input on the stage or timeline detaches foreground Follow Mode (`[👁 Manual · Resume Follow]`), routing ongoing agent `check`/`inspect`/`act` calls to a hidden background worker iframe so human and agent never fight over the playhead.

### 5. Spatial Frame Pins — Option 2 (`@gerak/tools`)

- Clicking a cast on stage or a moment on the timeline in Pin Mode (`P`) creates a structured spatial directive stored in `.gerak/pins.json`:
  - `{ id, piece, scene, shot, file, cast, part, viewport, atMs, scrollY, preset, pose, restBox, note, status: "open" | "resolved", createdAt }`.
- Studio renders numbered pins (`1`, `2`, ...) over their target casts at their anchored `(atMs, scrollY)` and on the timeline ruler; clicking a pin seeks directly to its exact moment, shot, scroll offset, and viewport.
- `npx gerak pins` (`list`, `show <id>`, `add`, `resolve <id>`, `clear`) gives any external agent (T3 Code, Claude Code, Cursor, Codex) a deterministic, image-free punchlist to fix and verify in batch.

### 6. Seams for Deferred Option 4 (`Cmd+K` Inline Prompt over ACP)

- Option 4 (an in-canvas `Cmd+K` prompt bar streaming to a local agent over ACP / Agent Client Protocol or headless CLI) is **deferred**, while shipping three narrow, single-owner extension seams now so it plugs in later with zero refactoring of stage, timeline, pins, or RPC:
  1. **Canonical `StudioPromptContext` (`packages/tools/src/studio/protocol.ts`):** One typed, JSON-serializable payload produced whenever a user selects a cast, clicks an error banner, or drops a pin (`{ piece, scene, shot, file, viewport, atMs, scrollY, preset, target: { cast, part, pose, restBox, moves }, findings, prompt }`). `[Copy @cast]` and Spatial Pins both serialize this exact type.
  2. **`StudioAgentPort` interface (`packages/tools/src/studio/agent-port.ts`):** Closed capability union (`{ readonly kind: "pin-only" } | { readonly kind: "live"; readonly provider: string }`, read with exhaustive `switch`) plus `submit(ctx: StudioPromptContext): AsyncIterable<StudioAgentEvent>` and `cancel(runId: string): Promise<void>`. Default implementation is `pinOnlyAgentPort` (persists `ctx` as an open Spatial Pin and copies a compact `@cast` token to the clipboard).
  3. **UI & Vite middleware hooks:** Selection toolbar action slot, error-banner `[Queue Fix Pin]` action slot, `AgentDrivingState` (`"idle" | "following" | "detached"`) in `StudioController`, and a Vite server plugin hook (`registerStudioAgentTransport`) ready to mount an ACP WebSocket bridge later.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Real-page & reel `<iframe>` Studio, scene/shot provenance & Pick Mode | 1, 2 | `gerak live` renders both scroll pages (`cookie.html` at `1440x900` & `390x844`) and fitted reels (`1080x1920` `9:16` & `1920x1080` `16:9` with `[Safe Zones]`), last-good-frame error guard, Page Focus Tabs + Shot Storyboard Strip, Cast & Move tree, `[Show Slots]`, and 2D+3D Pick Mode |
| PR 2: Time/scroll/audio scrubber, beat bars, sparklines, `[● Record]` & `[Export MP4]` | 3 | Clock (`ms`), scroll (`px`), and synced audio-waveform scrubbers drive the iframe; beat-bar/shot-edge/knob drags patch `.ts` safely; sampled sparklines render; `[● Record]` saves `.gerak/presets` for `gerak review --events @preset`; `[Export MP4]` renders via `gerak render` |
| PR 3: Bidirectional `gerak studio` bus & headless autopilot | 4 | `gerak studio status/focus/viewport/seek/act/inspect/check/render/frame` drive both visible browser tabs (`[Following Agent]` + detach-on-touch worker fallback) and `--headless` warm sessions in `< 100 ms` |
| PR 4: Spatial Frame Pins (`gerak pins`) & `StudioAgentPort` seams | 5, 6 | Stage/timeline pins persist to `.gerak/pins.json`, `gerak pins` lists/resolves them cleanly across pages and reel shots, and `StudioPromptContext` + `StudioAgentPort` (`pinOnlyAgentPort`) ship tested for future ACP attachment |

## Tests first, per slice

- PR 1: `compileScene` attaches `scene` name and ordered `StepSummary[]` across merged sub-scenes and `shot(...)` entries; `cookie.html` mounts at `1440x900` and `390x844` while a `1080x1920` reel mounts with `tiktok` safe-zone overlay and Shot Storyboard cards; injecting a throwing edit freezes the last valid frame and surfaces the error banner until fixed; Pick Mode resolves both `[data-cast="heroHeadline"]` and 3D `flavorCookies[0]`.
- PR 2: dragging a beat bar or shot duration edge rewrites `beat(...)` / `shot(...)` literals via `guard.ts` and refuses stale-file writes; scrubbing scroll px updates sticky + 3D poses frame-accurately; waveform + cue ticks align with `.cues.json` timestamps; recording clicks/scrolls writes a valid `Events` JSON preset accepted by `gerak review --events`; `[Export MP4]` invokes `gerak render` with `--fps` and `--audio`.
- PR 3: `gerak studio focus --shot`, `viewport tiktok`, `seek`, `act`, `inspect`, and `check --safe-zone tiktok` round-trip over WebSocket against a warm session in `< 200 ms`; simulated user mouse input during an agent run transitions `AgentDrivingState` from `"following"` to `"detached"` without aborting the agent's background check; `gerak studio --headless` boots once and reuses the session across commands.
- PR 4: creating a pin on `@builderCrumbs` at `(3100 ms, 8450 px, 390x844)` or on Shot 2 of a `1080x1920` reel writes `.gerak/pins.json`, clicking the pin restores viewport/shot/scroll/time, `gerak pins resolve <id>` updates UI state live, and `StudioAgentPort` exhaustive `switch` tests cover both `"pin-only"` and mock `"live"` streaming transports.

## Proof and measure

- Scroll page proof: open `gerak live cookie` and verify all 5 sections (`Hero`, `Spotlight`, `Craft`, `Builder`, `Closing`) filter, scrub, and pick 2D + 3D casts cleanly on `1440x900` and `390x844`.
- Reel proof: open a 4-shot `1080x1920` (`9:16`) reel in `gerak live`, solo/resize shots in the Storyboard Strip, scrub against the audio waveform + `[Safe Zones: TikTok]` overlay, and export a synced `60 fps` MP4.
- Autonomous agent proof: a fresh agent given only `gerak studio` and `gerak pins` resolves 3 spatial pins across `cookie` (desktop + mobile) and a `9:16` reel (`--safe-zone tiktok`) using numerical `studio inspect` / `studio check` (0 screenshots) in `< 100 ms` per warm check.

## Docs and record

- Write `docs/ADR-204-studio-bus-spatial-pins-and-agent-port.md` recording Decisions 1–6.
- Run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, and `npm run format`.
- Update `packages/tools/docs/live.md`, `packages/tools/docs/commands.md` (`gerak studio`, `gerak pins`, `--events @preset`), `plan/roadmap.md` (Stage 18 progress when slices land), and `docs/SESSION-STATUS.md` as each slice lands.

## Not in this plan

- **Option 4 transport implementation (`Cmd+K` inline popover + ACP / local CLI subprocess streaming):** Deferred until after Slices 1–4 prove the `gerak studio` + `gerak pins` workflow; `StudioPromptContext`, `StudioAgentPort`, and UI/server mount points (Decision 6) provide the exact seam.
- Embedded cloud LLM SDKs, API-key management, or a standalone SaaS chat backend inside `@gerak/tools`.
- After Effects-style keyframe diamond editing or sidecar keyframe JSON files (`ADR-170`; TypeScript scene files stay the single source of truth).
- Raycasting inside `@gerak/stage` (3D picking lives strictly in the Studio/Three overlay layer).
