# Marks: page elements a scene reads but never moves

## Goal

An agent making a piece tags the elements its motions only read (a slot an object sits in, the 3D canvas, a sticky section) as marks, and stops listing them in `scene(...)` just to get them measured; a person reading the scene, or the Studio canvas, then sees only what moves as cast. The code adds a `data-mark` attribute, a `mark` element with read-only geometry in `@gerak/stage`, measuring of every mark on a page mount and in `gerak measure`, and a `marks` export in the generated cast file.

Status: planned 2026-11-25. Two pull requests in order. It runs after canvas PR 4 and before canvas PR 5, whose `reads:` chips and "Marks" section use it.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- `data-cast` tags every element a scene names. `stage.md` says it tags animated elements, but pieces also tag elements that motions only read.
- A page mount measures rest boxes only for `stage.members` (`packages/dom/src/mount.ts`). A motion that reads a box at run time (`slot3d(slot, ...)`, `context.rest.get("stageCanvas")`) gets it only when that element is a member, so `apps/pieces/cookie/src/scene-hero.ts` lists `stageCanvas`, `heroStage` and `slotHeroJar` in `scene(...)` with no moves. It also lists `heroCopy` and `offerBanner`, which nothing reads.
- `travel({ to })`, `view.canvas`, edge points and `stayWith` already register read-only geometry references when the scene sees them; a read inside a motion function is invisible to `scene(...)`.
- `gerak measure` writes `<name>.measure.json` (rest boxes) and `<name>.cast.ts` (`export const cast`, `DomCast`, `ObjectCast`, `CastName`) from `scanHtmlCasts` (`packages/tools/src/page/cast-file.ts`).
- `@gerak/core` has no members and measures nothing; it is not touched.

## Decisions

### 1. A mark is its own attribute and its own element kind

- `data-mark="<name>"` tags an element that motions read and never move. One name is a cast or a mark, never both; a page with both refuses to measure, naming it.
- `mark(name)` in `@gerak/stage` makes a `Mark`: it has the same read-only geometry as a `box` (edges `.top`, `.end`, `.pinStart`, `.pinEnd` with `.plus`, `.minus` and `.reached`) and no `.moves`, `.shows`, `.limits` or `.modifies`, so animating a mark is a type error.
- `scene(...)` refuses a mark in its list. A mark needs no listing anywhere.
- `travel({ to })`, `slot3d(slot, ...)`, `view.canvas` and scroll beat edges accept a mark wherever they accept a box.

### 2. Every mark is measured

- A page mount measures every `[data-mark]` element under its root at each measure, beside the members, into the same rest reader under the mark's name. A page has few marks, so measuring them all costs little.
- `context.rest.get(mark)` and `context.rest.has(mark)` take a `Mark` as well as a name; a string read of a mark's name keeps working.
- `gerak measure` writes marks into `<name>.measure.json` with the cast, so headless review, sample and check read the same boxes.
- A `Mark` that the scene code uses but the page lacks fails the mount with the mark's name, as a missing cast does.

### 3. The cast file exports marks

- `<name>.cast.ts` gains `export const marks` (one `mark(name)` per `data-mark` element) and a `MarkName` union, beside `cast` and `CastName`. A typo in `marks.slotHeroJr` is a type error; a mark removed from the page stops compiling where it is read.
- Pieces with no `data-mark` element get `export const marks = {}` so imports never break.

### 4. Docs say what each tag is for

- `stage.md`: `data-cast` tags what moves; `data-mark` tags what motions read (slots, canvases, sections), read through `marks.<name>`. It replaces the sentence that said only animated elements are tagged, and adds no more than four lines.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| PR 1: `mark`, measuring and the cast file | 1, 2, 3, 4 | a page with `data-mark` slots plays a scene that lists none of them, and `travel({ to: marks.slot })`, `slot3d(marks.slot, ...)` and a scroll beat on `marks.section.top` read their measured boxes on a page mount and from the measure cache |
| PR 2: Pieces use marks | 4 | cookie tags `stageCanvas`, `heroStage`, `slotHeroJar` and the other read-only slots and sections as marks, drops them and `heroCopy` and `offerBanner` from its scenes, and plays and checks as before; every piece in `apps/pieces` lists only members that move or own a window |

## Tests first, per slice

- PR 1: a mount measures a `data-mark` element that no scene lists, and `context.rest.get(mark)` returns its box; `scene(...)` refuses a mark in its list; `mark(name).moves` does not typecheck (a type test); a name tagged both `data-cast` and `data-mark` refuses to measure; `gerak measure` writes the mark's box and `export const marks`; headless `gerak review` reads a mark from the cache; a mark missing from the page fails the mount naming it.
- PR 2: cookie's hero, spotlight, builder and closing scenes list no element without moves or a window; `gerak check` on cookie at `1440x900` and `390x844` gives the same findings as before the change.

## Proof and measure

- Cookie's scenes read as their moving cast only, and `gerak studio graph cookie` shows no member card without moves.
- `npm run metrics` does not grow; `stage.md` grows by at most four lines.

## Docs and record

- Write `docs/ADR-206-marks.md` recording Decisions 1–4; run `npm run adr-index:write`, `npm run reference -- --write`, `npm run map -- --write`, `npm run format`.
- Update `stage.md`, the `author` reference page and `docs/SESSION-STATUS.md`.

## Not in this plan

- A per-piece typed `context.marks` field: marks are read through the `marks` export with `context.rest`, which keeps `MotionContext` the same for every piece.
- Studio presentation of marks: `plan/studio-canvas-plan.md` Decision 10.
- Declaring reads on a motion (`.reads(...)`): measuring every mark makes it unnecessary.
