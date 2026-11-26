# Test strategy: fewer, meaningful, fast tests

## Goal

A person or an agent changing this repository gets an answer from `npm run check` in about a minute and from CI in about three, and a red result means something is really broken. The code keeps one test where a behaviour needs proving and deletes the rest, moves what does not need a browser out of the browser suite, removes waits on real time, fixes the product slowness the waits hid, and splits the browser suite across CI runners.

Status: built 2026-11-26 in the canvas PR 3 pull request.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

Measured on CI for one run of the canvas PR 3 branch, and on a Windows laptop:

- CI's wall time is the browser job: 5.5 min, 35 files run one at a time (each starts its own page server), 300 s of test time. The other jobs (quality with typecheck and unit tests, boundaries, performance) finish within about 1 min, in parallel.
- `npm run check` runs every Vitest project, the browser suite included, so a local check takes about 5 min.
- Start-ups are cheap: launching Chromium takes about 0.5 s, and a page server with one visit 0.4–1.1 s. Over the suite they cost about a tenth of the time, so sharing one browser is not the main lever.
- Time sits in a few files: eight files take two thirds of it. The Studio canvas files open the whole canvas page per test and wait on real time; `compositor-browser` compares 50 scroll positions at two sizes.
- One test waited 20 s for nothing: `pins add` with a studio server running and no canvas open waits out the 10 s bus time limit twice. A person running `gerak studio pins add` without a canvas waits the same 20 s.
- Flakes come from tests that assume how much real time passes (a playing clock's time grew; a page mounts within N s) and from Windows refusing to delete a temp folder a process still holds.

## Decisions

### 1. A browser test only for what needs a browser

- A browser test proves what only a real browser shows: layout and measured boxes, scroll and sticky sections, rendering and capture, an iframe page, the canvas's wiring end to end. Logic that a pure function owns (spans, wire sides, parsing, the graph) is proved by unit tests.
- One browser test per feature walks its main path end to end; edge cases are unit tests.

### 2. Delete tests that do not earn their place

- A test is deleted when its assertions are already made by another test, when it proves a mechanism a unit test already proves, or when it checks how code is shaped rather than what it does. Each deletion is listed with its reason in the pull request.
- A long test is shortened before it is split: fewer sample points, sizes or steps, while it still fails without the behaviour it guards.

### 3. No waits on real time

- A test waits for a condition, never a fixed time: `waitForTimeout` and sleeps go, polling for the state goes in.
- A test never assumes how far a clock moves in real time: it asserts that time changed, or it seeks a held clock.
- Time limits stay as a guard only, generous, and never as the thing a test waits out.

### 4. Fix the product slowness a test hid

- The studio server answers a bus command at once with `failed` when no canvas is connected, instead of after its time limit; `pins add` without a canvas then returns at once.

### 5. Fast local check, full CI

- `npm run check` runs the fast gates and the unit project; the browser suite runs as `npm run test:browser`, and always on CI. `AGENTS.md` and `docs/CI-WORKFLOW.md` say so.
- CI splits the browser suite across three runners (`vitest --shard`).

### 6. Temp folders

- Tests remove their temp folders through one helper that retries and then leaves a folder Windows still holds to the system's own cleanup; a leftover temp folder is not a test failure.

## Not in this plan

- Sharing one Chromium or one page server across test files: measured at about a tenth of the time, and tests then share state.
- Engines other than Chromium.
