# Reels, multi-shot sequencing, audio sync, and export

## Goal

Creators and autonomous agents build, sequence, check, and export multi-shot vertical (`9:16` TikTok/Reels/Shorts) and widescreen (`16:9` YouTube) videos from modular scenes synced to voiceover or music, without hand-shifting timestamps when a shot's length changes. The code adds sequential `shot(subScene, options?)` composition inside `scene(...)` in `@gerak/stage`, audio cue/beat extraction, platform safe-zone checks (`--safe-zone`) in `@gerak/tools`, and exact `30`/`60 fps` H.264 MP4 rendering with muxed audio in `gerak render`.

Status: planned 2026-11-24 to follow `plan/authoring-ergonomics-plan.md` PR 4 (`scene(...)`) and precede `plan/studio-plan.md` (fulfilling the video half of `plan/roadmap.md` Stage 18). Three pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- Passing sub-scenes directly into `scene({ ... }, sectionA, sectionB)` (`plan/authoring-ergonomics-plan.md` PR 4, replacing `sceneBuilder().include(scene)`) merges scenes onto `t = 0` of one shared clock, which fits spatial scroll sections (`apps/pieces/cookie/`) but forces timed reels (`apps/pieces/launch-day/src/launch-day.ts`) to hardcode cumulative `at:` timestamps (`0`, `700`, `1000`, `2900`, `3500`) across the entire video. Lengthening Shot 1 requires editing every later beat by hand.
- `mount(scene, { clock: "timed", frame: "fit", root })` (`packages/dom/src/mount.ts`) already scales fixed-aspect reel frames (`1080x1920`, `1920x1080`, `1080x1080`) cleanly, and `text(name, { split: "words" })` + `cues` (`apps/pieces/overlay3d/`) already drive kinetic captions, but there is no CLI tool to extract beat/onset or word-timing cues into a `.cues.json` table and no safe-zone check for TikTok/Shorts/Reels UI overlays.
- `gerak render` (`packages/tools/src/page/render.ts`) steps at a fixed `RENDER_STEP_MS = 16` (`62.5 fps` rather than standard `60` or `30 fps`) and pipes silent PNGs into `ffmpeg` with no `--audio` track muxing.

## Decisions

### 1. Sequential `shot(subScene, options?)` reel orchestration (`@gerak/stage`)

- Export `shot(subScene: Scene, options?: ShotOptions): Shot` (`{ readonly kind: "shot"; readonly scene: Scene; readonly options?: ShotOptions }`, `ShotOptions`: `{ readonly name?: string; readonly length?: number; readonly overlap?: number }`) and add `Shot` to the `SceneItem` union accepted by `scene([options,] ...entries)`, read with an exhaustive `switch` (`scene({ name: "launch-reel" }, shot(hookScene), shot(productScene, { overlap: 200 }), shot(ctaScene))`):
  - Each shot scene authors its beats starting at local `0 ms`. Its local duration is `options.length` when given, otherwise the end of its last beat (refusing a zero-length shot with no beats and no `length`).
  - Each `shot(next, { overlap })` offsets every beat and cue inside `next` by `cursor - (overlap ?? 0)` (clamped `>= 0`) and advances `cursor` to the end of `next`, so lengthening Shot 1 shifts Shots 2..N automatically.
  - Every element owned by a shot without an explicit `.shows(...)` is automatically scoped to `.shows([shotStart, shotEnd])` so off-shot DOM and 3D casts hide cleanly outside their shot; during an `overlap` window both the outgoing and incoming shots are visible so dissolves, whip-pans, or `carry` match-cuts compose cleanly.
  - Record ordered `shots: readonly ShotSummary[]` (`{ name, index, from, to, overlap }`) on compiled `Stage` so `gerak timeline`, `gerak review`, and Visual Studio (`plan/studio-plan.md`) display and solo individual shots.
  - Single owner of shot timing and automatic shot presence remains `@gerak/stage`.

### 2. Platform safe-zone checks and reel aspect presets (`@gerak/tools`)

- Add named aspect/safe-zone profiles in `packages/tools/src/page/` read with an exhaustive `switch`:
  - `"tiktok"` (`1080x1920`: top `140 px`, bottom `320 px`, right `132 px`, left `36 px` reserved for status bar, caption/music tray, and action rail).
  - `"reels"` (`1080x1920`: top `140 px`, bottom `300 px`, right `120 px`, left `36 px`).
  - `"shorts"` (`1080x1920`: top `140 px`, bottom `340 px`, right `128 px`, left `36 px`).
  - `"youtube"` (`1920x1080`: 5% title-safe inset `96 px` horizontal, `54 px` vertical).
- Extend `gerak check <page>` and `gerak review <page>` with `[--safe-zone tiktok|reels|shorts|youtube]`:
  - Defaults viewport `--size` to the profile's native dimensions (`1080x1920` or `1920x1080`) when neither `--size` nor `--sizes` is passed.
  - Checks visible text glyphs and watched elements on sampled frames against the safe rectangle, reporting `{ kind: "unsafe-zone", element, zone, at }` findings so agents keep captions, badges, and CTAs clear of platform chrome without reading screenshots.

### 3. Audio cue extraction and `30`/`60 fps` muxed `gerak render` (`@gerak/tools`)

- Add `gerak beats <audio.wav|mp3|m4a> [--out <file.cues.json>] [--threshold n]` in `@gerak/tools`:
  - Decodes PCM audio via `ffmpeg` and writes deterministic `{ name: "beat", at, value }` energy/onset events as JSON importable directly into a scene's `cues` (keeping scenes 100% pure and deterministic with zero runtime Web Audio dependency in `@gerak/core` or `@gerak/stage`).
- Upgrade `gerak render` (`packages/tools/src/page/render.ts`):
  - Add `[--fps 60|30|25]` (default `60` for `mp4`, `25` for `gif`), stepping the paused clock at exact rational millisecond timestamps `Math.round((frameIndex * 1000) / fps)` (or sub-ms float clock ticks) and passing `-framerate <fps>` to `ffmpeg` so exported reels play at true `60 fps` or `30 fps` without audio drift.
  - Add `[--audio <file>] [--audio-offset ms]`, muxing AAC audio (`-c:a aac -b:a 192k`) trimmed to `--to` alongside deterministic H.264 video (`libx264`, `yuv420p`, `+bitexact`, `+faststart`).
  - Allow `--to` to default to the mounted stage's `durationMs` on `"timed"` reel pages when omitted.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: Multi-shot `shot(...)` sequencing in `@gerak/stage` | 1 | `scene(..., shot(sceneA), shot(sceneB, { overlap }))` shifts local beats/cues, auto-scopes `.shows()`, records `stage.shots`, and passes `gerak review` & `gerak timeline` |
| PR 2: Platform `--safe-zone` checks & presets in `@gerak/tools` | 2 | `gerak check` and `gerak review` enforce `tiktok`, `reels`, `shorts`, and `youtube` safe margins and default `9:16` / `16:9` sizes |
| PR 3: `gerak beats` audio cues & `30`/`60 fps` muxed `gerak render` | 3 | `gerak beats` emits deterministic `.cues.json`; `gerak render` exports exact `60 fps` MP4 with synced AAC audio and optional auto `--to`; proved on a 4-shot `9:16` reel piece |

## Tests first, per slice

- PR 1: two shots with local `[0, 600]` and `[0, 800]` beats compile to `[0, 600]` and `[600, 1400]` (or `[450, 1250]` with `overlap: 150`); lengthening Shot 1 shifts Shot 2 automatically; Shot 1's elements report `visible === false` at `700 ms` unless given an explicit wider `.shows()`; two shots claiming ownership of the same element name are refused unless handed off via `carry` / distinct shot casts; `gerak review` validates per-shot jumps and final hold.
- PR 2: a `1080x1920` page placing caption text at `y = 1780` or `x = 1010` triggers an `unsafe-zone` finding under `--safe-zone tiktok` and passes when centered inside `[36..948, 140..1600]`.
- PR 3: `gerak beats` on a synthetic click-track WAV outputs exact beat timestamps within `10 ms`; `gerak render --fps 60 --audio track.wav` produces an `ffprobe`-verified `60 fps` `1080x1920` MP4 with an AAC audio stream matching `--to` duration.

## Proof and measure

- Build a 4-shot `1080x1920` (`9:16`) reel piece (Hook → 3D Product Reveal → Kinetic Caption Proof → CTA) synced to an audio track via `shot(...)` and `cues`, passing `gerak check --safe-zone tiktok`, `gerak review`, and `gerak render --fps 60 --audio ...` with `pageErrors: []`.

## Docs and record

- Write `docs/ADR-203-multi-shot-reels-safe-zones-and-audio-render.md` recording Decisions 1–3.
- Run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, and `npm run format`.
- Update `packages/stage/docs/stage.md` (`shot`), `packages/tools/docs/commands.md` (`--safe-zone`, `gerak beats`, `gerak render --fps --audio`), `plan/roadmap.md` (Stage 18 video), and `docs/SESSION-STATUS.md`.

## Not in this plan

- Non-linear video editing of raw camera footage: keying, rotoscoping, color grading, or optical-flow tracking (`plan/roadmap.md` §7; `<video>` clips play as ordinary cast elements when needed).
- Runtime Web Audio FFT analysis inside `@gerak/core` or `@gerak/stage` (keeps scenes pure functions of `(time, events)`; `gerak beats` extracts audio cues ahead of time).
