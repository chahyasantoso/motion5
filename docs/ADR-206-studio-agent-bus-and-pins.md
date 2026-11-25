# ADR-206: The Studio command bus, follow mode and pins

**Date:** 2026-11-25
**Status:** Accepted, 2026-11-25. Decision 1 is built; Decisions 2 to 4 are planned in `plan/studio-agent-plan.md`.

## Context

Every page inspection (`gerak check`, `review`, `probe`, `frames`) starts Chromium and a Vite server and reloads the
page's assets, 3 to 7 s per command, and none can reach an open Studio canvas. A coding agent and a person want to
work in the same canvas: the agent moves it from the terminal and reads exact values; the person points at things
on it without describing them in words.

## Decision

1. **One command bus.** `npx gerak studio <status|focus|viewport|seek|play|select|inspect|check|graph>` reads
   `<pieces>/.gerak/studio.json`, which `gerak studio open` writes, and posts one `StudioCommand` to
   `POST /__gerak/bus?piece=<piece>` on the studio's dev server. The server answers `graph` and `check` itself. It
   relays the other commands to the open canvas over Vite's socket and answers with the first reply that carries the
   command's id, or 504 when no canvas answers in time. The canvas runs every command through the same state the
   person's clicks change, so a card id selected by the CLI is the selection the canvas shows.
   - `StudioCommand`, `StudioReply` and their envelopes live in `packages/studio/src/protocol.ts`. One parser,
     `parseCommand`, validates a command wherever one arrives.
   - `check` runs on the server through one headless browser per studio session, launched on first use and reused.
     `gerak studio open --headless` opens the canvas in that same browser, so an unattended run gets the same warm
     commands. The tools package's `launchBrowser` is the one place a browser is launched, and
     `PageTarget.browser` lets a tool reuse an open one.
2. **Follow mode.** Who the visible canvas obeys is one closed state: `idle`, `following`, `detached`. A command
   that changes the canvas moves `idle` to `following`. Status and inspect change nothing. A trusted pointer, key
   or wheel input on the canvas or inside the preview page moves `following` to `detached`. While detached, the
   agent's commands run on a hidden worker frame of the same page with its own playhead. "Resume follow" hands the
   worker's focus, preview, selection and time back to the visible canvas and removes the worker.
3. **Pins, recorded presets and prompt seams** follow the plan: pins in `.gerak/pins.json` with
   `gerak studio pins`, recorded `Events` presets under `.gerak/presets/`, and `StudioPromptContext` with a closed
   `StudioAgentPort` union.

## Rejected alternatives

- **A second HTTP or WebSocket server beside Vite:** a second port to find and secure. Vite's socket already
  reaches the canvas, and its middleware already guards the Studio's routes to their own origin.
- **Running each command in a fresh Playwright page:** that is the cold path this bus exists to avoid.
- **The agent and the person sharing one playhead:** each would undo the other's seek. The worker frame keeps the
  agent's work going without moving what the person is looking at.

## Consequences

- A warm command round trip through the bus takes 1 to 50 ms. A CLI call adds its own process start: about 0.8 s
  from the repository's TypeScript sources, and more through `npx`.
- A warm `check` saves the server and browser start, but still samples every 16 ms of the scene: about 4.5 s for
  `reel` against 6.5 s cold.
- `render` and `frame` on the bus wait for `<name>.render.json` and the canvas's job cards
  (`plan/studio-canvas-plan.md` PR 7).
- The page server config loads Vite only when it is called, so a command that never serves a page does not load it.
