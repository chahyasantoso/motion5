# Mount driver: a page plays on a driver it is handed

## Goal

A person directing a live page in the Studio, such as cookie, plays, pauses, seeks, loops and replays it the way they play a reel, and a recorded take wired into the player replays on top of their own clicks and hovers; an agent gets the same through `gerak studio seek` and `play`. The code lets `mount` take a `Driver` (the one `@gerak/player` already defines) in place of building its own, lets a host hand that driver to a page's own `mount` call without editing the piece, and gives the Studio one driver built from its playhead and the take wired into the player.

Status: built 2026-11-26 (ADR-207), in one pull request. Until take cards exist (canvas PR 3), the take is the preset picked in the preview's Events preset menu.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `@gerak/player` defines `Driver` (`now(): Time`, `events?(): Events`, `subscribe`), and `play(scene, driver)` runs any scene on any driver. `@gerak/dom` ships `eventDriver` (live), `clockDriver` (timed, seekable) and `scrollDriver`.
- `mount(scene, { clock })` takes `clock: "live" | "timed"` and builds its own driver from it; `onDriver` only reads that driver afterwards.
- A timed mount runs a `clockDriver` that watches members and records their events at its time, keeps the log across a seek and clears it on replay (ADR-175). It does not listen to scroll or pointer.
- A live mount records scroll, pointer and watched events into its own log at wall-clock time. It cannot seek, so the Studio's timeline can only scrub a live page's scroll position, and cannot play it.
- A piece's page calls `mount` itself (`cookie-main.ts` passes `clock: "live"`). Tools hold a page's clock through a global the page reads (`Symbol.for("@gerak/dom/held-clock")`).

## Decisions

### 1. `mount` takes a driver

- `MountClock` becomes a closed union, `"live" | "timed" | { readonly kind: "driver"; readonly driver: Driver }`, read by one exhaustive `switch` in `mount`, the single owner of which driver a mount runs on.
- On a handed driver the mount takes its time and its steps from the driver; it schedules no frames of its own.
- It still records the page's real input, as a live mount does: scroll, pointer, watched elements and `mounted.send`, each stamped at the driver's elapsed ms.
- The scene sees the mount's recorded log merged with the driver's `events()`, through the merge `play` already does for cues; recorded and handed events add, neither replaces the other.
- A seek keeps the recorded log, as ADR-175 has it for the clock driver; the player already hands the scene only events at or before the time.
- `"live"` and `"timed"` keep their meaning and their code paths; no piece changes.

### 2. A host hands a page its driver

- `Symbol.for("@gerak/dom/driver")` on the page's `globalThis` may hold a function `(info) => Driver | undefined`, set before the page's main module runs. `info` gives the scene's length and the mount's root.
- A mount whose options say `"live"` calls it once, and runs on the driver it returns; `undefined` keeps the live clock. A `"timed"` mount ignores it, since the Studio already drives its clock driver.
- The hook is read in one place, beside `HELD_CLOCK` in `packages/dom/src/frames.ts`, and is left out of the authoring reference pages: it is for hosts, not pieces.

### 3. The Studio's driver

- `packages/studio/src/canvas/studio-driver.ts` makes the driver the Studio hands a live page: time from the preview card's `Playhead`, events from the take wired into that card (`plan/studio-canvas-plan.md`, Decision 5) with its scroll samples removed. The driver is not a card: its time is always the card's player, and only its events vary.
- A take's scroll samples are not handed as events: the driver scrolls the page to them as time passes, and the mount records the real scroll. Sticky sections are the browser's layout of the real scroll, so a scroll handed only as an event would draw a frame the page never shows.
- With no take wired, Play sweeps the page's scroll from top to bottom at the card's speed, through the same path.
- The timeline's length on a driven page is the longest of the scene's length, the take's last event plus the mount's settle time, and the sweep.
- Replay reloads the page at the top, which clears the recorded log.
- The Studio serves the hook through its page transform under `?gerakStudio=1`: an inline script ahead of the page's own reads the driver from the parent canvas. The hidden worker frame of the agent bus gets its own driver from its own playhead.

## Slices

One pull request, built in three slices in order.

| Slice | Decisions | Done when |
| --- | --- | --- |
| 1: `mount` on a handed driver | 1 | a fixture page mounted on a handed driver seeks back and forward, a watched click logged at 400 ms stays across a seek to 200 ms and back, and a handed event and a real one both reach the scene |
| 2: The host hook | 2 | a page whose main calls `mount(scene, { clock: "live" })` runs on the hook's driver when one is set and on the live clock when none is, and a timed page ignores it |
| 3: The Studio driver | 3 | in the canvas, cookie plays, pauses, seeks back and loops from the timeline and from `gerak studio seek` and `play`; with `take-1` wired in its clicks replay while a real hover on the call to action still lands; Replay reloads at scroll 0; reel and saved play as before |

## Tests first, per slice

- 1: on a handed driver, the scene's events at `t` are the recorded log and the driver's events at or before `t`, merged in time order; a seek back keeps the log; the mount requests no animation frame of its own; `"live"` and `"timed"` mounts pass their existing tests unchanged.
- 2: with the hook set, a `"live"` mount's time is the hook driver's; without it, wall time; a `"timed"` mount never calls the hook.
- 3: the Studio driver's time equals the playhead's at every step; a take's scroll samples scroll the frame and never reach the scene as handed events; with no take, Play at speed 1 reaches the page's bottom at the sweep's length; a seek on cookie through the bus answers `done` and moves the page's poses.

## Proof and measure

- Open cookie in the Studio and play it hands-free, seek back to the hero, loop the spotlight's stretch, and replay a recorded take with a live hover on top.
- `npm run metrics` does not grow; the authoring pages (`core.md`, `stage.md`, the reference pages) gain nothing.

## Docs and record

- `docs/ADR-207-mount-driver.md` records Decisions 1–3. Run `npm run adr-index:write`, `npm run reference -- --write`, `npm run format`.
- `packages/dom/docs/page.md` "Clock and frame modes" states the handed driver; `packages/studio/docs/studio.md` states the driven player.
- Update `docs/SESSION-STATUS.md` when it lands.

## Not in this plan

- Moving tools off the paused fake clock onto a handed driver (`gerak check`, `review`, `frames`).
- Isolating one sub-scene on a page: mounting it alone while the rest sits at rest.
- Editing the event log from the timeline.
