# Studio agent bus, pins and recorded interactions

## Goal

A coding agent and a person work in the same open Studio canvas: the agent drives it from the terminal (focus a shot, seek, select a card, read exact poses and checks) in milliseconds instead of cold-booting a browser, and the person leaves numbered pins on cards and on stage that the agent resolves without screenshots. The code adds one Studio command bus with a `gerak studio` CLI and a headless mode, `.gerak/pins.json` pins with `gerak studio pins`, recorded interaction presets for `gerak review --events`, and narrow seams for a later in-canvas prompt.

Status: planned 2026-11-25 on top of `plan/studio-canvas-plan.md`, amended the same day: it runs after that plan's PR 2 and before its PR 3, and all of it lives in `@gerak/studio`. Three pull requests in order.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- Every page inspection (`gerak check`, `review`, `probe`, `frames`) cold-boots Chromium and a Vite server and reloads `.glb` and WASM assets (3–6 s per command), and none can reach an open Studio canvas.
- `plan/studio-canvas-plan.md` gives the `@gerak/studio` package, the canvas (`gerak studio open`), the graph (`graphOf`, `gerak studio graph`), card ids from code identity, the preview card and the timeline; nothing lets an agent drive them or a person annotate them.
- Interactive bursts (cookie's adds and jar seal) can be replayed only from hand-written `--action` lists.

## Decisions

### 1. One Studio command bus (`@gerak/studio`)

- Every canvas action dispatches through one `StudioController` state and command bus, served by the Vite dev server at `/__gerak/studio` (WebSocket plus JSON over HTTP) and driven by `npx gerak studio <subcommand>`:
  - `status`: piece, focus (scene or shot), viewport and safe-zone profile, `atMs`, `scrollY`, selected card, compile and job health;
  - `focus --scene <name|all> | --shot <name|index|all>`, `viewport <WxH|tiktok|reels|shorts|youtube>`;
  - `seek --ms <n> | --scroll <px|selector>`, `play [--from ms] [--to ms] [--speed n]`;
  - `select <card-id>`, `inspect [<card-id>]`: live pose, DOM rect, 3D bounds, slot geometry and the member's `steps`;
  - `check [--sizes WxH,...] [--safe-zone name]`, `render [--fps n] [--audio file[@ms][:gain]] [--out file]`: the canvas's job cards, run through the same endpoint, reading `<name>.render.json` with flags overriding it;
  - `graph`: the live `StudioGraph`, the same value as `gerak studio graph <piece>`;
  - `frame [--crop <card-id|x,y,w,h>] [--out file]`: a PNG only when a picture is asked for.
- Subcommands sit beside the canvas plan's `open` and `graph` under `gerak studio`. Card ids are the canvas's ids (`member:<name>`, `shot:<name>`, ...), so a CLI selection and a canvas selection are the same value.
- `gerak studio --headless` starts the server and one persistent headless tab on the canvas when no browser is connected, so unattended runs get the same warm commands.
- Follow mode: while commands arrive, the canvas shows "Agent driving" and mirrors the agent's focus and playhead. Any human input on the canvas detaches it ("Manual, resume follow"), and the agent's commands continue on a hidden worker tab, so the two never fight over the playhead. The state is a closed union: `idle`, `following`, `detached`.

### 2. Pins on cards and on stage (`@gerak/studio`)

- In pin mode (`P`), clicking a card, a point on stage, or a moment on the timeline creates a pin in `.gerak/pins.json`: `{ id, piece, card, scene, shot, file, part, viewport, atMs, scrollY, preset, pose, restBox, note, status: "open" | "resolved", createdAt }`.
- The canvas draws numbered pins on their cards, over their element on stage at their moment, and on the timeline ruler; clicking one restores its viewport, shot, scroll and time.
- `npx gerak studio pins list | show <id> | add | resolve <id> | clear` gives any agent an image-free punch list; a resolve updates the open canvas live.

### 3. Recorded interaction presets (`@gerak/studio`)

- `● Record` on the preview card captures real pointer, scroll and `mounted.send(...)` events from the iframe into `.gerak/presets/<piece>/<preset>.json` (an `Events` list), shown as event pins on the timeline so the burst scrubs at any speed.
- `gerak review <scene.ts> --events @<preset>` and `gerak studio act '<action-list>' [--save-preset <name>]` read and write the same files.

### 4. Seams for a later in-canvas prompt

- `StudioPromptContext` (`packages/studio/src/protocol.ts`): one JSON payload built whenever a card is selected, an error banner is clicked or a pin is dropped: `{ piece, card, scene, shot, file, viewport, atMs, scrollY, preset, target: { pose, restBox, steps }, findings, prompt }`. `Copy @card` and pins both serialise this type.
- `StudioAgentPort` (`packages/studio/src/agent-port.ts`): a closed capability union `{ kind: "pin-only" } | { kind: "live"; provider: string }`, read with an exhaustive `switch`, with `submit(ctx): AsyncIterable<StudioAgentEvent>` and `cancel(runId)`. The default, `pinOnlyAgentPort`, saves the context as an open pin and copies a compact `@card` token.
- A selection-toolbar slot, an error-banner "Queue fix pin" slot, and a Vite plugin hook (`registerStudioAgentTransport`) where a later transport mounts.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: `gerak studio` bus, follow mode and headless | 1 | `status`, `focus`, `viewport`, `seek`, `select`, `inspect`, `check`, `graph` round-trip against an open canvas and a `--headless` session in under 200 ms warm, and human input detaches follow without aborting the agent's check |
| PR 2: Pins and recorded presets | 2, 3 | pins persist, draw on cards, stage and ruler, and restore their moment; `gerak studio pins resolve` updates the canvas live; a recorded cookie burst replays in `gerak review --events @preset` |
| PR 3: Prompt seams | 4 | `StudioPromptContext` and `pinOnlyAgentPort` ship with a mock `live` port, and the slots render with nothing mounted in them |

## Tests first, per slice

- PR 1: each subcommand round-trips over WebSocket against a warm session in under 200 ms; simulated mouse input moves the state from `following` to `detached` while a background `check` completes; `--headless` boots once and serves several commands; `select member:<name>` selects the same card the canvas shows.
- PR 2: a pin on `member:builderCrumbs` at `(3100 ms, 8450 px, 390x844)` and one on shot 2 of a `1080x1920` reel are written, and clicking each restores its viewport, shot, scroll and time; recording two clicks and a scroll writes an `Events` file that `gerak review --events` accepts.
- PR 3: exhaustive `switch` tests over both port kinds; the mock `live` port streams events and cancels.

## Proof and measure

- A fresh agent given only `gerak studio` and `gerak studio pins` resolves three pins across `cookie` (desktop and mobile) and a `9:16` reel (`--safe-zone tiktok`) with zero screenshots, each warm check under 100 ms.

## Docs and record

- Write `docs/ADR-206-studio-agent-bus-and-pins.md` recording Decisions 1–4; run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, `npm run format`.
- Add the `gerak studio` subcommands, `gerak studio pins` and `--events @preset` to `packages/studio/docs/studio.md`, with `--events @preset` also in `packages/tools/docs/commands.md`; update `docs/SESSION-STATUS.md` as slices land.

## Not in this plan

- The prompt transport itself (a `Cmd+K` popover streaming to a local agent over ACP or a CLI subprocess): deferred until pins and the bus prove the workflow; Decision 4 is its seam.
- Cloud LLM SDKs, API keys or a chat backend inside `@gerak/studio` or `@gerak/tools`.
- Raycasting inside `@gerak/stage`.
