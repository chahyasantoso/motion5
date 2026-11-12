# Stage plan: the cast and the story

**Status:** Draft for the owner's review.
**Base:** `feat/apps-split` (pull request 583).
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md` (section 2a, the five layers),
`plan/roadmap.md` stage 3, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A piece is one file: who is on stage, when each beat happens, and how each thing moves, written as data a tool
can read and check, and played by one stage that needs no component.**

This is layer 3 of `docs/ARCHITECTURE.md`. Today a piece is a scene file and a component. The component is the
cast: hand-written JSX, one `useTarget` per element (17 in the second showreel), with the look in a page's CSS. The
scene names targets but cannot say what they are, and its beats are raw numbers: 71 `span(...)` calls in the second
showreel, and a `BEATS` list used only for a corner label. So no tool can tell whether a thing shows before its beat,
whether every cast member is used, or what the piece's beats are called. The rebuild worker hit the first of these
twice: exits that showed at rest before their span, hidden by hand with 16 ms fades.

## 2. The shape

```ts
export const stage = frame({ width: 1280, height: 720 });

export const cast = {
  dot: shape("circle", { size: 36, className: "dot" }),
  word: letters("ANTICIPATE", { className: "title" }),
  bar: shape("rect", { width: 780, height: 6, className: "bar" }),
};

export const beats = story(15000, {
  origin: [0, 1250],
  anticipate: [1000, 3550],
  weight: [3460, 6260],
});

export const enters = { word: "anticipate", bar: "anticipate" };   // not shown before its beat
export const leaves = { word: "weight" };                          // not shown after its beat

export const scene = (time: Time) => ({
  dot: sequence(time, [[beats.origin, (t) => launch({ ... }, t)], ...]),
  word: rise({ distance: 60 }, beats.anticipate.of(time)),
});
```

- **A cast member is described, not drawn.** `shape`, `text`, `letters`, `words`, `image`, `path` and `group` answer
  plain records: a kind, its size or content, and a `className` and `style` the piece chooses. They carry no look of
  their own, so there is no house style.
- **A beat is a named span.** `story(durationMs, { name: [from, to] })` answers one `span` per name, usable as today,
  and keeps the names for tools.
- **Presence is declared.** `enters` and `leaves` name the beat that bounds each cast member; the stage hides it
  outside, so an exit no longer shows at rest before its span.
- **One stage plays any piece.** `<Stage module={...} />` in `@gerak/react` (and a plain-DOM `mountStage` in
  `@gerak/dom`) reads `stage`, `cast` and `scene`, makes one element per cast member, binds each with `applyValue`,
  fits the frame to its container, and replays on a click. A piece that needs its own React keeps its component, as
  today; both stay.

## 3. Decisions to record (P0, ADR-174)

- **`@gerak/stage` is a pure package** for the cast's description, `frame`, `story`, presence and the checks. It knows
  no DOM; `@gerak/dom` and `@gerak/react` render it. `@gerak/three` renders a cast later, when a 3D piece needs it.
- **A cast member's look is the piece's.** Makers take `className` and `style` and nothing that sets a colour, a font
  or a size by default. A page's CSS, or `style`, decides.
- **Text in parts is a cast kind.** `letters` and `words` make one element each and one list target, laid out in a
  line by the browser; the stage measures each part's rest centre after layout and hands it to the scene, as
  `centreIn` does today.
- **Layout is the page's.** A cast member sits in normal flow inside the frame, or at `at: [x, y]` from the frame's
  centre. No layout engine.
- **A story is one source of truth for beat names.** The timeline's marks, the review's labels and the sheet's
  captions read `beats`; the `_MS` constants and `cues` keep working for pieces without a story.
- **Logic is still out.** Nothing here reacts to input beyond what scenes already do with the event log.

## 4. Slices

### P1. Cast, frame and story

- **Invariant:** the makers, `frame` and `story` answer frozen records with the shapes above; `story` refuses a beat
  that runs backwards or past the duration; presence names only cast members and beats that exist.
- **Owner:** `packages/stage/src/`.
- **Test:** each maker's record; `story` spans equal `span(from, to)`; a bad beat and a bad presence are refused.

### P2. The stage, for the DOM and React

- **Invariant:** `mountStage(element, module)` and `<Stage module />` build the cast, fit the frame, bind each target
  with `applyValue`, measure `letters` and `words`, hide a member outside its presence, and replay on a click.
- **Owner:** `packages/dom/src/stage.ts`, `packages/react/src/stage.tsx`.
- **Test:** a module with three members renders three elements with their class names; a member outside its presence
  has `visibility: hidden`; letters report their measured centres to the scene; the live page plays a stage module.

### P3. Tools read the story

- **Invariant:** the live timeline marks beats by name; `motion:review` labels picked frames with the beat they fall
  in; a scene-file review reports a cast member the scene never moves (unless it is static by name), a target the
  scene moves that is not cast, and a member that changes before it enters or after it leaves.
- **Owner:** `apps/pieces/src/live/timeline.tsx`, `packages/tools/src/scene/review.ts`, `packages/tools/src/page/`.
- **Test:** one finding of each kind on a fixture; a clean fixture has none.

### P4. Scaffold and guide

- **Invariant:** `motion:new <name>` writes one scene file with a frame, one cast member at rest, an empty story and
  a page that mounts the stage; `--component` keeps today's component scaffold. The guide's loop names the cast and
  the story, and the reference covers `@gerak/stage` by the generator.
- **Owner:** `packages/tools/src/scene/new.ts` and templates; `docs/guide/agent-motion.md`; the skill.
- **Test:** the scaffold's scene samples to rest and mounts with no component.

### P5. Proof

- **Measure:** the hand-made showreel rebuilt a third time, alone in its worker, as one stage file. New column: lines
  of component code (the second rebuild's component was 250 lines). Passes when the component is gone, no `fade`
  hides a member outside its beat, and the frames match the second rebuild's.
- **Cold run:** one Sonnet agent at medium effort makes a piece from a new brief with the guide alone, and is asked
  the interview's questions about the cast and the story.

## 5. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | P0, P1 | the records' shapes decide the rest |
| 2 | Opus, medium | P2 | a renderer with layout and measuring, touching dom and react |
| 2 | Sonnet, medium | P3 | tools only, against P1's records |
| 3 | Sonnet, medium | P4 | scaffold and guide, after the stage exists |
| 4 | Opus, medium, alone | P5 measure | the standing measure runs alone |
| 4 | Sonnet, medium | P5 cold run, then the cold review | independent eyes |

One pull request, after wave 4.

## 6. Risks

- **A generic stage tempts a house look.** The makers set no visual default; the test for each maker checks its
  record has no colour, font or size it was not given.
- **Two ways to make a piece** (a stage file, or a scene and a component). They share the scene, the moves and the
  tools; the component stays for pieces that need their own React, and the guide starts agents on the stage.
- **Measuring letters after layout** needs a frame before the first value. The stage holds the first frame until the
  measure lands, as the showreel's components do today.
- **3D waits.** A cast for Three.js is a later slice, written when a 3D piece needs it.

## 7. Done when

A piece runs from one file, the showreel's third rebuild has no component, the tools read beat names, `npm run check`
is green, and `docs/SESSION-STATUS.md` says so.
