# ADR-203: Multi-shot reels, safe zones and audio render

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

A timed reel of several shots wrote every beat in the reel's ms. `apps/pieces/launch-day` places its beats at 0, 700,
1000, 2900 and 3500 ms by hand, so making the first shot longer means editing every later beat. Sub-scenes passed to
`scene(...)` all start at the reel's 0, which suits scroll sections that share one page but not shots that follow
one another.

## Decision

1. **A shot is a sub-scene on its own clock (`@gerak/stage`).**
   - `shot(scene, { name?, length?, until?, overlap? })` is a `SceneItem`. `scene` places each shot after the one
     before it: it starts at the previous shot's end minus `overlap` (never below 0), and lasts `length`, or until the
     scene ms `until`, or until its last clock beat ends. `scene` refuses `length` with `until`, an `until` at or
     before the shot's start, a shot with no clock beat and no `length`, a shot that holds shots, and a shot with a
     scroll or trigger beat or a scroll `.shows` window, since a shot plays on the clock. A scene holding shots may
     join another scene only while that one has no shots, and later shots follow its last.
   - Inside a shot, motions get the shot's time: ms since the shot started (never below 0), progress across its
     length, and events with each `at` moved back by its start, moved again whenever a growing log grows.
     `context.read` of a member in another shot, or of a member of the reel, converts back to the scene's time, so a
     shot never needs another shot's ms.
   - The shot's clock beats become `<shot>.<beat>` on the scene's clock, and a beat named after the shot spans it, so
     `stage.beats`, the default length and `.shows` windows read scene ms.
   - Each member a shot owns shows only during the shot unless it shows a window of its own. During an overlap both
     shots show.
   - The compiled `Stage` lists `shots: { name, index, from, to, overlap }[]`, which `gerak timeline` draws above its
     targets.
   - `@gerak/stage` is the one owner of shot timing and shot presence.

2. **Safe zones are named platform profiles (`@gerak/tools`).**
   - `packages/tools/src/page/safe-zone.ts` owns the profiles and the margin test: `safeZone(name)` gives a platform's
     native frame and reserved margins in px, `unsafeEdges(box, zone, stage)` the edges a box enters, in top, right,
     bottom, left order. The box is first cut to the stage; a box with no area on stage enters none. Margins scale
     with the stage (left and right by width, top and bottom by height), and an edge counts only when the box passes
     into its band strictly.

     | Platform | Frame | Top | Right | Bottom | Left | Source, checked 2026-11-25 |
     | -------- | ----- | --- | ----- | ------ | ---- | -------------------------- |
     | `tiktok` | 1080x1920 | 220 | 140 | 480 | 60 | TikTok publishes safe-zone files, not px; revid.ai/tiktok-safe-zone states 220 top, 480 bottom, 140 right, 60 left, checked 2026-11-25; manypixels.co/blog/social-media-design/tiktok-ad-specs cites 240 top, 660 bottom, 120 sides |
     | `reels` | 1080x1920 | 269 | 65 | 672 | 65 | Meta guidance of 14% top, 35% bottom, 6% sides, which is 269, 672 and 65 px at 1080x1920; quoted by third-party guides, Meta's own page was not readable on 2026-11-25 (lilachbullock.com/instagram-reels-safe-zone) |
     | `shorts` | 1080x1920 | 288 | 192 | 672 | 48 | No official figure found; revid.ai/youtube-shorts-safe-zone states 288 top, 672 bottom, 192 right, 48 left, checked 2026-11-25; adaptlypost.com/blog/social-media-safe-zones-2026-complete-guide gives 120 top, 300 bottom, 96 right |
     | `youtube` | 1920x1080 | 54 | 96 | 54 | 96 | No YouTube figure found; broadcast convention is 5% action-safe and 10% title-safe margins (dev.to/utilitylab/how-to-calculate-title-safe-and-action-safe-margins-for-video-1ifj); 54 px is 5% of the height |

     The code values are the stricter published guidance, each from the source named above on 2026-11-25. A box that enters all four bands once cut to the stage is a full-frame layer and is not judged.
   - `gerak check` and `gerak review` take `--safe-zone tiktok|reels|shorts|youtube`. With neither `--size` nor
     `--sizes`, the viewport is the platform's native size; with either, the margins scale.
   - Under the flag, every sampled 16 ms frame also measures each visible element's own text glyph box, named as the
     final-frame text findings name it, and the watched elements. A `Finding` of kind `unsafe-zone` names the element,
     platform and edge, once per element and edge, at the first sampled ms of the first run in the band that lasts
     for longer than 12 sampled frames (192 ms) in a row, or that lasts to the last frame; an element only passing
     through a band, or missing from a frame, does not count. Without the flag, sampling is unchanged.
   - `zoneFindings` in `check.ts` is the one place frames become `unsafe-zone` findings; `review` passes the flag to
     the same sampling and prints the same lines.

3. **Audio cues and exact-fps mixed-audio render (`@gerak/tools`).**
   - `packages/tools/src/audio/levels.ts` is the one owner of RMS (`rms`), level (`levelOf`, `levelCues`) and onset
     (`beatCues`) maths, shared by `packages/tools/src/pages/talk-page.ts` (`rms`, `levelOf`) and `gerak beats`
     (`beatCues`, `levelCues`).
   - `gerak beats` (`packages/tools/src/audio/beats.ts`, `decode.ts`) decodes audio via `ffmpeg` to mono 48 kHz float32
     (`-ac 1 -ar 48000 -f f32le`). `beatCues` evaluates RMS over 20 ms windows (`BEAT_WINDOW_MS = 20`) stepped by
     5 ms hops (`BEAT_HOP_MS = 5`) against `threshold` (default `1.5`) times a 40-window history mean
     (`HISTORY_WINDOWS = 40`, 200 ms) with a minimum rise above that mean (`MIN_BEAT_RISE = 0.02`) and a 100 ms
     refractory period (`REFRACTORY_WINDOWS = 20`). `--levels name@ms` samples
     `levelCues` every `ms` (`levelOf(rmsValue)` with floor `0.02`, gain `6`, capped at `1`), sorted with beats first
     on timestamp ties.
   - `gerak cues` (`packages/tools/src/audio/captions.ts`, `cues.ts`) parses SubRip (`.srt`, line-timed), WebVTT (`.vtt`,
     line-timed) and Whisper JSON (`.json`, word-timed when `words` or `segments[].words` are present, else
     line-timed). `captionCues` emits `{ name, at, value }` cues (`--name`, default `word`) where `value` is the
     cumulative count of words shown, plus a sibling `.words.json` array of single words (`<stem>.words.json`).
   - `gerak render` (`packages/tools/src/page/render.ts`) steps the paused clock at exact frame timestamps
     `Math.round((i * 1000) / fps)` while `(i * 1000) / fps <= to` for `--fps 60|30|25` (`mp4` default `60`; `gif` at
     `640 px`, `25` only). Without `--size`, it resizes the viewport to the `measure().frame` of the first timed mount
     (or the first mount) before capturing. Repeated `--audio file[@ms][:gain]` tracks are delayed (`adelay=<at>:all=1`), scaled
     (`volume=<gain>`), mixed (`amix=inputs=N:normalize=0:duration=longest` when > 1), padded (`apad`) and encoded as
     one AAC stream (`-c:a aac -b:a 192k`) trimmed with `-t` to `times.length / fps`. Omitting `--to` reads the
     maximum finite `durationMs` from `Symbol.for("@gerak/dom/mounts")` on a timed mount. The result reports
     `width`, `height`, and `speed: { framesPerSecond, wallMs }`.

## Consequences

- A reel is written shot by shot from 0; lengthening one shot moves every later one.
- A member seen across shots belongs to the reel and is written on its clock.
- A shot's events are a moved copy of the scene's list, so a `state` read inside a shot folds from the start each
  frame; reels hold few events, and a long live event log in a shot would cost more per frame.
- A safe-zone run samples every visible text element on every frame, not only the last, so a long page costs more
  under `--safe-zone`; the profiles are estimates and a platform may change its interface without notice.
- `gerak beats` depends on `ffmpeg` on `PATH`; sustained beds with weak transients may need a custom `--threshold`,
  and line-timed captions (`.srt`, `.vtt`) increment `value` per line rather than per word.
- Measured 60 fps `1080x1920` render throughput on 2026-11-25: `22.9` frames/s on the 2D piece (`launch-day`, 325 frames,
  14,202 ms) and `19.9` frames/s on the 3D piece (`reel`, 721 frames, 36,142 ms), bounded by headless screenshot
  round-trips and software piping.
