# Pages

## Goal

People and agents making a landing page animate the page's own elements on scroll, pointer and clock, section by
section, and move one element between sections. The code keeps one clock, takes scroll and pointer as inputs, adds a
mount that animates existing page nodes, and measures sections and slots from the page's own CSS.

Status: approved 2026-11-20. Starts after PR 604 (the scene builder) merges. Four slices, one pull request each, in
order. The web overlay in `plan/roadmap.md` builds on the page mount.

Read `AGENTS.md` first. Every rule there applies. Any agent can run this plan; it needs no harness-specific skill.

## Where things stand

- A piece is a `sceneBuilder` chain plus `export const skin` (`packages/stage/docs/stage.md`, ADR-193).
  `compileScene(scene, { skin })` gives a `Stage`; `mountStage` (`@gerak/dom`) draws it in a shadow-DOM frame it
  builds itself, scaled to fit its host.
- A stage runs on one clock. Events (`{ name, at, target, value? }`) arrive beside time; core's `state` folds them
  (`packages/core/docs/core.md`, "State from events").
- `@gerak/dom` has `scrollDriver` (ADR-030) and an outside-the-stage path that writes a pose onto any element
  (`packages/dom/docs/agent-outside.md`). The pose-to-CSS writer is shared by both.
- Page tools accept `--action scroll:px@ms` (`packages/tools/docs/commands.md`).
- Elements are `box`, `shape`, `text`, `many`, `group`; `anchor` is deferred. A motion's context carries `rest`
  (measured boxes), `index` and `count`.

## Decisions

### 1. One clock; scroll and pointer are inputs

- The scene keeps one clock. Scroll position and pointer position arrive as sample events with a value, like any
  live input, so a recording replays and scrubs.
- Core gains `scroll` and `pointer` states (built on `state`): `scroll.y` in px, `pointer.x` and `pointer.y` from 0 to
  1 across the viewport.
- A scroll beat is a window over scroll position: `beat(name, { scroll: [from, to] })`, with `from` and `to` scroll
  points. `.in(scrollBeat)` gives the motion progress 0 to 1 from the folded scroll value, holding before and after,
  exactly as a clock beat does from time.
- Types keep the two apart: a scroll beat takes scroll points, a clock beat takes ms.
- A trigger is a state change: `beat(name, ms, { when: point.reached })` starts a clock beat at the moment scroll first
  passes the point. `back: "reverse" | "stay" | "replay"` says what scrolling back past it does; it has no default.
- Smooth scroll is `springTo` on the scroll state; nothing new.
- Headless review sees scroll motion only from scripted scroll: `cues` in the piece, or `--action scroll:px@ms`.

### 2. A page mount in `@gerak/dom`

- `mountPage(scene, { root? })` animates existing nodes. It builds no frame, no shadow DOM and no element, and takes
  no skin: the site's CSS is the look.
- `el(selector)` binds an element to an existing node: `text("title", "", { node: el("#hero h1") })`. In a page scene
  every element has a node; `compileScene` refuses one without, and names it.
- Poses are written by the same pose-to-CSS writer `mountStage` uses; it stays the one owner.
- Rests are measured from the page, and again on resize.
- `mountStage` does not change.

### 3. Lines are measured, not counted

- `text(..., { split: "words" })` keeps a fixed part count from the text. In a page mount each word's context gains
  `line`, measured from layout; headless it is 0.
- A line-by-line headline is a stagger by `line`: `stagger` gains `by: "index" | "line"`, default `"index"`.
- No part count changes on resize; only `line` does.

### 4. Sections and slots are measured from CSS

- gerak never changes page layout. A pinned section is a tall wrapper with a `position: sticky` inner; a fixed layer is
  `position: fixed`. The page's CSS writes both; `packages/dom/docs/page.md` states the convention.
- `section(name, el(selector))` reads a section's edges as scroll points: `.top`, `.end`, with `.plus(px)` and
  `.minus(px)`. Scroll beats use them.
- A slot is an element bound to an empty node the page's CSS places, with no motion:
  `box("slotHero", { node: el("#hero .slot") })`. `anchor` stays deferred.
- `travel({ to: slot, arc? })` moves an element from where it is to the slot's measured box over its beat, at any
  viewport size.
- An element belongs to one scene; the builder refuses an element in two scenes and names both. Scenes share beats,
  states and signals, never elements.

## Slices

| Slice | Decisions | Done when |
| --- | --- | --- |
| A. Inputs | 1 | scroll and pointer states, scroll beats, triggers; every existing piece samples the same |
| B. Page mount | 2, 3 | `mountPage`, `el`, `node`, measured rests and `line`, `stagger` by line |
| C. Sections | 4 (sections, ownership) | `section` edges as scroll points; the sticky and fixed convention documented |
| D. Slots and the proof | 4 (slots, travel), proof | `travel`; the landing page and its measure |

## Tests first, per slice

- A: a scroll beat refuses ms and a clock beat refuses a scroll point, at type level; `.in(scrollBeat)` holds before
  and after; a trigger with each `back` value gives the right progress as scroll passes the point and returns;
  `pointer.x` replays the same from a recorded session.
- B: `mountPage` writes a pose onto an existing node and creates none; a page scene element with no node is refused;
  `line` is measured in the browser and 0 headless; `stagger` by line.
- C: a section's edges match its measured box at two viewport sizes.
- D: `travel` ends on the slot at two viewport sizes; an element in two scenes is refused.

## Proof and measure

- One landing page in `apps/pieces` with its own HTML and CSS: a hero with a line-by-line headline, a features section,
  a pinned story section, a gallery, and a drink image in a fixed layer that starts in the hero and travels to a slot
  in each of the next two sections.
- A separate fresh agent writes the same page with plain HTML, CSS, GSAP and ScrollTrigger from the same brief.
- The report gives both versions' line counts and tokens, the gerak version's review, and contact sheets of both at
  three scroll positions and two viewport sizes.

## Docs and record

- `packages/dom/docs/page.md`: how a page mount works, written tersely as behaviour (inputs, nodes, lines, the CSS
  convention for pinning and fixed layers, sections, slots). `stage.md` and `core.md` explain scroll beats, the
  `scroll` and `pointer` states and triggers where they belong, and link the new page.
- A new ADR records Decisions 1 to 4, with the next free number; then `npm run adr-index:write`.
- The roadmap's web overlay entry names the page mount as its base. Rewrite `docs/SESSION-STATUS.md` per slice.

## Execution

1. **Baseline,** kept outside the repository: `npx gerak sample <file> --at 0,250,500,750,1000,1500,2000,3000,4000,6000,8000,12000`
   for every `apps/pieces/*/src/*.ts` outside `moves/`, and `npx gerak frames` of every page.
2. Slices A to D in order, one pull request each, test first. `npm run check` is green before each pull request.
3. After each slice, compare samples by value (keys in any order, 1e-9). No existing piece may change.
4. In each pull request, report `npm run check`, `npm run pack:check`, the comparison, and one cold review by an
   agent that has not read this plan. Slice D also reports the proof and its measure.

## Working notes for any harness

- Windows, Git Bash. Run git as plain commands.
- Browser tests (`*-browser.test.ts`) can time out under full-suite load. Rerun a failing one alone with
  `npx vitest run <file>` before treating it as a failure; never weaken it.
- Regenerate reference pages with `npm run reference -- --write` and `docs/MAP.md` with `npm run map -- --write`
  after any export or folder change.
- Docs are terse statements of behaviour, never recipes.

## Not in this plan

- Shader effects as a renderer plugin.
- Transitions between routes.
- `anchor` for stage pieces.
- The visual editor.
