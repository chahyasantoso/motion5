# Shapes and curves

## Goal

People and agents making a piece learn core's three shapes from one table (a timing, a curve, a signal) and call
every curve the same way: build it from its settings, then give it progress. The code gains two exported types,
changes how seven curve functions are called, and drops a second name for a signal.

Status: approved 2026-11-18. Base: `refactor/points-and-reference` at `161afe6e`; one branch, one pull request.
First of three plans: `plan/principles-plan.md` and `plan/stage-3d-plan.md` build on this one.

Read `AGENTS.md` first; every rule there applies.

## Where things stand

- Core already has three shapes, unnamed:
  - **Timing**, a time in and a time out: `span(...).of`, `lanes`, `chain`, `loop`, `reversed`, `repeated`,
    `timeAt`, `withProgress`. Its `Timing` type is exported.
  - **Curve**, a progress from 0 to 1 in and a value out: `Ease`, `arch`, `wave`, `attack`, `decay`, `taper`,
    `ballistic`, `along`, `along3d`, `mix*`.
  - **Signal**, `(time, events) => value`: the parameter type of `velocity` and `velocity3d`, written out each time.
- `@gerak/player` calls the same shape `Scene<T>`. `@gerak/dom`, `@gerak/react` and the live page in `@gerak/tools`
  use that name.
- Curves are called two ways:
  - Eases are built from settings and return a curve: `springEase(options)`, `backEase(options)`.
  - The others take progress with loose settings: `wave(progress, count, phase?)`, `attack(progress, rate)`,
    `decay(progress, rate)`, `taper(progress, power)`, `ballistic(progress, options)`, `along(cubics, share,
    options?)`, `along3d(cubics, share, options?)`.
- `packages/tools/src/page/curves.ts` keeps its own copies of the eases under a local `Curve` type, for
  `NAMED_CURVES`.

## Decisions

### 1. Core names its shapes

- `packages/core/src/time/shapes.ts` owns and exports two types:
  - `type Curve<T = number> = (progress: number) => T`;
  - `type Signal<T = Pose2d> = (time: Time, events: Events) => T`.
- `Ease` stays exported, defined as `Curve<number>`.
- `velocity` takes `Signal<Pose2d>`, and `velocity3d` takes `Signal<Pose3d>`.
- A function of `time` alone is a `Signal`; it may ignore `events`.
- `@gerak/player` drops `Scene` and uses `Signal`. There is no alias; `@gerak/dom`, `@gerak/react` and
  `@gerak/tools` follow.
- `core.md` opens its API part with a three-row table: shape, type, and core's functions of that shape.
- Test first: a type test that assigns `arch` to `Curve`, a `(time) => Pose2d` function to `Signal`, and a `Signal` to
  `velocity`.

### 2. A curve with settings is built from them

| Now | After |
| --- | --- |
| `wave(progress, count, phase?)` | `wave({ count, phase? }): Curve` |
| `attack(progress, rate)` | `attack({ rate }): Curve` |
| `decay(progress, rate)` | `decay({ rate }): Curve` |
| `taper(progress, power)` | `taper({ power }): Curve` |
| `ballistic(progress, options)` | `ballistic(options): Curve<{ x: number; y: number }>` |
| `along(cubics, share, options?)` | `along(cubics, options?): Curve<Pose2d>` |
| `along3d(cubics, share, options?)` | `along3d(cubics, options?): Curve<Pose3d>` |

- Unchanged: `arch`, `mix*`, `ease.*`, `spring`, `springEase`, `backEase`, `springMemory`.
- Every call site in `packages/` and `apps/` moves over, with no old form left; that includes
  `packages/physics/src/builtin.ts` and `packages/tools/src/scene/import-svg.ts`. A curve with fixed settings is
  built once, outside the scene.
- Test first: sample each new curve at progress 0, 0.25, 0.5, 0.75 and 1, against values written down from the old
  call before the change.

### 3. One owner for the eases

`NAMED_CURVES` in `packages/tools/src/page/curves.ts` is built from core's `ease` and `Curve`, and its local copies
go. A name core lacks stays local. Its comment and the `motion-read` test stop naming `@gerak/moves`. The boundary
scan lets `packages/tools/src/page/` import `@gerak/core`, and still no library or renderer.

### 4. Record and docs

- `docs/ADR-191-shapes-and-curves.md` records Decisions 1 to 3; then run `npm run adr-index:write`.
- Update `core.md` and every doc or guide line that shows an old curve call or `Scene`.
- Rewrite the **Now** entry of `docs/SESSION-STATUS.md`.

## Execution

1. **Baseline,** kept outside the repository:
   - frames of every page under `apps/pieces`, with `gerak frames <page> --at 0,500,1000,2000,4000,8000 --size <the
     piece's frame>`;
   - the JSON output of every command in `packages/tools/docs/commands.md`, run once in the form its own line shows,
     on `tempo` (a stage piece), `card` (a 2D scene module) and `overlay3d` (a 3D scene module).
2. Decision 1, then 2, then 3, then 4. Each is at least one commit, and `npm run check` is green after each.
3. Compare against the baseline: no frame and no command output may change. This plan changes no behaviour.
4. In the pull request, report:
   - `npm run check` with no `packages/*/dist`;
   - `npm run pack:check`;
   - `node performance/stage-benchmark.mjs --compare performance/stage-baseline.json`;
   - the comparison;
   - one cold review by an agent that has not read this plan.

   A browser test that times out in the full run but passes alone is reported as such, never weakened.

## Not in this plan

The principles and `@gerak/moves` (`plan/principles-plan.md`); 3D objects in a stage (`plan/stage-3d-plan.md`).
