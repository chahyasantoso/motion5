# Composition plan, part four: things that change place

**Status:** Built, 2026-11-13; approved by the owner the same day.
**Base:** `main` at `e6957839`, the merge of pull request 587, plus `smudge` promoted on `feat/composition-four`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ADR-174` to `docs/ADR-177`,
`plan/composition-three-plan.md` section 3a, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A site's route change, a reordering list and a card opening are each a few lines of scene.**

Today a member rests in one place: the stage measures one `Rest` and the scene moves things relative to it. Nothing
can say "this card rests here on the list and there on the detail page", so carrying an element from one layout to
another, the core of every route change and reorder, is hand arithmetic over boxes nobody measured. The showreel
cannot exercise this, so part four has a measure of its own: a small site built cold from a brief.

## 2. Decisions to record (F0, ADR-178)

- **A layout is named, and the stage measures every one.** A stage module may export `layouts`, a list of names; the
  DOM skin styles each under `[data-layout="<name>"]` on the frame. The stage measures each layout's `Rest` in turn
  at mount and on every re-measure, and passes the scene a fourth argument, `layouts: Readonly<Record<L, Rest>>`.
  `rest`, the third, stays the rest of the layout in force, so every existing piece reads as before.
- **Which layout is in force is a function of the events alone.** A module with `layouts` exports
  `layout: (events) => L`; the stage sets `data-layout` when the answer changes, before it writes that frame's
  values. With no `layout`, the first layout is in force. A route is a layout: a member a route does not show is
  hidden by its skin, and its box in that layout is zero. Answering from events alone makes the moment of each change
  the time of the event that caused it, so nothing else has to store it.
- **Carrying is one function of boxes.** `carry(own, from, to, progress, size?)` in `@gerak/stage` answers the pose
  that puts a member resting at `own` on `from` at progress 0 and on `to` at 1. `size` is `"scale"` (default),
  `"clip"` (the member rests at the larger box and is clipped to the smaller, so a card opening does not stretch its
  text) or `"keep"`. It is not a `defineMove`: its options are boxes.
- **`carried` owns every change of place, interrupted ones included.** `carried({ own, at, events, time, ms, ease,
  size })` takes `at: (events) => Box`, where the member should be after the events so far, finds each event that
  changed the answer, and carries from where the member was drawn at that event to the new box. A click mid-flight
  starts from the drawn place, never jumps back to the old rest. A layout change passes
  `(events) => restOf(layouts[layout(events)], name)`; a reorder passes the slot box its item takes after the events,
  with no layout change at all. Scenes call `carried`; `carry` is what it is built from.
- **Tools with no renderer read layouts too.** A module with `layouts` may give `rest` per layout for tools, and
  `readStageModule` checks that every name in `layout`'s answers is declared.
- **Joining two modules waits for the video stage.** On a site, two scenes are two layouts of one module. Two stage
  modules played one after the other, with a cut or a dissolve, belong with the camera and the beat driver.
- **A move is promoted when pieces from two different briefs import it.** A piece file, stage module or plain scene,
  may export `const brief = "<name>"`; `motion:moves -- --candidates` reads it from source as it reads imports,
  counts distinct briefs, and counts a file with none as its own. Rebuilds of one brief count once.

## 3. Slices

### F1. Layouts measured and switched

- **Invariant:** `mountStage` measures every declared layout, passes `layouts` to the scene, and sets `data-layout`
  from `layout(events)` before writing the frame's values; a re-measure measures every layout again and leaves the
  layout in force as it found it.
- **Owner:** `packages/dom/src/stage.ts`; the types and `readStageModule` in `packages/stage/src/module.ts` (F0).
- **Test:** a two-layout module where a member sits left in one and right in the other reads both boxes; a click
  event switches the attribute on the frame that answers it; measuring every layout does not start a second
  measure through the resize observer; a module without layouts samples and frames as before.

### F2. `carry` and `carried`

- **Invariant:** at progress 0 the member's drawn box equals `from`, at 1 it equals `to`, for each `size`; with
  `own` equal to `to`, progress 1 is the rest pose. `carried` is continuous across every event that changes `at`.
- **Owner:** `packages/stage/src/carry.ts`.
- **Test:** boxes of different centre and size, each `size`, checked at 0, 0.5 and 1; nothing is carried
  from or to a box with no size, as a tool with no renderer measures; two changes 100 ms apart
  in a 400 ms carry draw no jump at the second; seeking backwards answers what playing forwards did.

### F3. Tools read layouts

- **Invariant:** `motion:sample`, `motion:review` and `motion:frames` run a module with layouts on its per-layout
  `rest`; a module with `layouts` and no `rests` rests nowhere in each layout, as one without `rest` does.
- **Owner:** `packages/tools/src/scene/`.
- **Test:** a module whose `layout` names an undeclared layout is refused by name; a module without `rests` samples on empty layouts.

### F4. Smaller costs the showreel named

- `motion:moves -- --candidates` counts briefs (owner the catalog in `packages/tools/src/scene/`); the six showreel
  rebuilds, two of them plain scenes, export `brief = "showreel"`.
- `motion:promote` writes the description as the move's doc comment, so the generated reference holds without a
  hand edit (owner `packages/tools/src/scene/promote.ts`).
- `jolt`'s `count` and `push`'s `to` state the ranges they throw outside of, so the catalog and the gate show them.
- The scene review does not report a follow move still ringing while its member is hidden.
- **Test:** each item gets the test that fails without it.

### F5. Proof

- **Measure, alone, fresh:** a small site built cold from a brief by an Opus worker at medium effort: a list of
  cards with a sort control that reorders them, and a route from a card to its detail page and back, the card
  carried across. It records tokens, tool calls, moves written and reused, and frames at each layout change. It
  passes when the scene does no arithmetic on boxes outside `carried`, the review finds no jump at any layout change
  or at a second click mid-flight, and the review is otherwise clean. Its row starts a table of its own; the
  showreel's rows are not its baseline, and no run on today's tools is made to compare against.
- **Cold review:** a Sonnet agent reviews the diff and runs what it claims.

## 3a. Results

| Site | Worker | Tokens | Tool calls | Moves written, reused | Box arithmetic outside `carried` | Jumps |
| --- | --- | --- | --- | --- | --- | --- |
| `shop` | Opus, medium | 112 k | 33 | 0, 0 (`carried` and one fade) | none | none at any cue or mid-flight |

`shop` passes: six cards sort, sort again mid-flight and turn back from where they are, and a card opens into a
detail view while the other five fold into a rail; the browser review is clean. The review without a browser still
calls three members unmoved, since nothing is measured there.

What cost it most: two axes, sort and view, became fourteen layouts, one per pair, where one layout per view and a
slot per order would do (the guide now says so); `carried` crashed in the tools without a browser, fixed by the cold
review's findings before this run was combined; a `many` whose items are placed absolutely still sat in the centred
row; and `"clip"` cannot draw a closing card larger than its own box, so the card was carried by `"scale"` with its
text in members of its own.

The cold review (Sonnet, 91 k) gave ten findings; eight are fixed (`carried` walks back only through changes still
moving and starts a change at 0, an empty box carries nothing, a swap to no layouts measures with none on the frame,
a failed measure restores the layout, a loop is reported once, a module without `rests` rests nowhere, `layout` must
answer before any event, a brief may hold an apostrophe). Unsorted events and `"clip"` never growing are the
documented contract.

## 4. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | F0 | the ADR, the types, `readStageModule`; every slice builds on them |
| 2 | Opus, medium | F1 | owns `stage.ts` |
| 2 | Sonnet, medium | F2 | one new file |
| 2 | Sonnet, medium | F3, F4 | tools, one worker for `packages/tools` |
| 3 | Conductor | guide, reference, `make-motion` skill | what the measure reads |
| 3 | Opus, medium, fresh | F5 measure | |
| 3 | Sonnet, medium | F5 cold review | |

Each wave 2 worker regenerates the reference for its own commits; the conductor regenerates once on combining.
One pull request, after wave 3.

## 5. Risks

- **Measuring every layout** sets the attribute and reads offsets once per layout; a module with many layouts pays
  that on each resize. The stage measures only on mount, font load and resize, never per frame.
- **Clip-sized carries** depend on the `clip` value field reading the member's own box; F2 checks it on the DOM.
- **A reorder moves items by transform only**, so the page's order, tab order and what a screen reader reads stay
  the first order. That is the site's to fix by reordering its data at rest; the guide says so.
- **`carried` folds every past change** on each frame; a page clicked hundreds of times pays for each. It reads only
  changes still inside `ms` of the time asked, plus the last settled one.
- **A route as a layout** keeps every route's members in one cast. A site with many routes may need more; the measure
  says whether it does.

## 6. Deferred

- `trail` costs about 3.5 ms a frame on a seven-pendulum scene; a keyed cache is designed (ADR-176) but not built.
  It is built when a measure or a site shows `trail` in its frame budget.
- Named by the showreel, not scheduled: one `on` for all of a `many`'s items; enter and exit moves holding their
  end; `anticipate` holding its lift; `dangle` tying swing rate and lag to one length. The site measure decides
  whether any of them costs it.
- Every move except `smudge` is imported by showreel rebuilds alone and waits for a second brief.
- A clip that grows: `"clip"` crops to the member's own box, so a closing card is scaled. A clip larger than the box
  needs the member to rest at the larger box in every layout it crosses.
- The review without a browser measures no box, so a piece that moves only by `carried` reads as unmoved there.

## 7. Done when

The site measure passes, its tokens are recorded, `npm run check` is green, and `docs/SESSION-STATUS.md` says so.
