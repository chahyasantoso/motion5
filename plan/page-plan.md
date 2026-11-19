# Pages

## Goal

People and agents making a landing page animate the page's own elements on scroll, pointer and clock, section by
section. Some elements travel across sections. The code lets a beat choose its driver. It adds a pointer signal, a
page mode with no frame, sections with a placement, and slots that an element travels between.

Status: proposed 2026-11-19. Starts after `plan/scene-builder-plan.md` lands. One branch, one pull request. The web
overlay in `plan/roadmap.md` builds on its page mode.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- Beats are in milliseconds. `@gerak/dom` has `scrollDriver`, injected by a source key (ADR-030), but a stage drives
  one whole piece from one clock.
- Pointer events are discrete: `enter`, `leave`, `down`, `up`, `click`, `focus`, `blur`. Live inputs arrive as samples,
  events with a value (`plan/live-inputs-plan.md`).
- The DOM renderer draws inside a fixed frame, 1280 by 720 by default, scaled to fit its host.
- `box` and `text` are page elements, and the renderer measures their rests.

## Decisions

### 1. A beat chooses its driver

- A clock beat is `beat(name, ms, { at? | after?, gap? })`. Its points are times in ms.
- A scroll beat is `beat(name, { scroll: { from, to } })`. Its points are scroll positions in px.
- Types keep the two apart: a scroll beat refuses a time, and a clock beat refuses a scroll position.
- The driver stays in `@gerak/dom`. A scroll beat names its source by key, as ADR-030 states.
- One scene may mix clock and scroll beats. `.in(beat)` reads the same for both.

### 2. Triggers

- `beat(name, ms, { when: point.reached, back })` starts a clock beat when the scroll reaches a point.
- `back` says what scrolling back past the point does: `"reverse"`, `"stay"` or `"replay"`. It has no default.
- The crossing is an event in the event log, so a recorded session replays and scrubs.

### 3. The pointer signal

- `pointer.x` and `pointer.y` are signals from 0 to 1 across the viewport.
- They are a `state` (`plan/principles-plan.md` Decision 5) over pointer samples, so a recording replays them.

### 4. Page mode

- `sceneBuilder({ page: true })` has no frame, no scaling and no clipping.
- `el(selector)` makes an element from an existing page element: `text("title", el("#hero h1"), { split: "lines" })`.
- Rests are measured from the page, again on every resize.
- `text` gains `split: "lines"`, measured from the page's own line breaks.

### 5. Sections

- `section(scene, placement?)` places a scene on the page. `page(...sections)` joins them.
- A placement is one of:
  - flow, the default: the section takes space and scrolls away.
  - `pin: { length }`: the section takes space and stays on screen for `length` px of scroll.
  - `fixed: { from, to }, layer: "above" | "below"`: the section takes no space and stays on screen over that scroll
    range.
- A section gives its edges as scroll points: `hero.top`, `hero.end`, with `.plus(px)` and `.minus(px)`.
- A section whose range is off the screen is not computed.

### 6. One owner across sections

- An element belongs to one scene. The builder refuses an element passed to two scenes, and names both.
- Scenes affect each other only through shared values: beats, `state` and signals.

### 7. Slots and travel

- A slot is an `anchor` made from a page element: `anchor("slotHero", el("#hero .drink-slot"))`. The page's CSS places
  it at every screen size.
- `travel({ to: slot, arc? })` moves an element from where it is to a slot, over its beat.

### 8. Tests first

- A scroll beat refuses a time, and a clock beat refuses a scroll position, at type level.
- A trigger with each `back` value gives the right progress when the scroll passes the point and returns.
- `pointer.x` replays the same from a recorded session.
- A fixed section stays on screen over its range only. A pinned section adds its length to the page.
- An element in two scenes is refused.
- `travel` ends on the slot at two viewport sizes.

### 9. Proof and measure

- One landing page in `apps/pieces`, with:
  - a hero with a line-by-line headline.
  - a features section.
  - a pinned story section.
  - a gallery.
  - a drink image in a fixed section. It starts in the hero and travels to a slot in each of the next two sections.
- A separate fresh agent writes the same page with plain HTML, CSS, GSAP and ScrollTrigger from the same brief.
- The report gives both versions' line counts and tokens, and the gerak version's review. It adds contact sheets of
  both at three scroll positions and two viewport sizes.

### 10. Record and docs

- A new ADR records Decisions 1 to 7, with the next free number. Then run `npm run adr-index:write`.
- Page mode, scroll beats, triggers, sections and slots go on a new page, `packages/stage/docs/page.md`, read on
  demand. `stage.md` gains one line that points to it.
- The roadmap's web overlay entry names page mode as its base.
- Rewrite `docs/SESSION-STATUS.md`.

## Execution

1. **Baseline:** frames and review output of every piece, and every command's output on `tempo`, `card` and
   `overlay3d`.
2. Decisions 8, then 1 to 7 in order, then 9 and 10. `npm run check` is green after each.
3. Compare against the baseline. No existing frame may change.
4. In the pull request, report `npm run check`, `npm run pack:check`, the comparison, the proof and its measure, and
   one cold review by an agent that has not read this plan.

## Not in this plan

- Shader effects as a renderer plugin.
- Transitions between routes.
- The visual editor.
