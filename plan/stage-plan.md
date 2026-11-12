# Stage plan: the cast and the story

**Status:** Draft for the owner's review.
**Base:** `main` at `924c6451`.
**Read first:** `AGENTS.md`, `docs/SESSION-STATUS.md`, `docs/ARCHITECTURE.md` (section 2a, the five layers),
`plan/roadmap.md` stage 3, `.claude/skills/wave-build/SKILL.md`, then this plan.

## 1. Goal

**A piece is one file: who is on stage, how it looks, when each beat happens and how each thing moves, written as
data a tool can read and check, and played by one stage that needs no component and no page of its own.**

This is layer 3 of `docs/ARCHITECTURE.md`. Today a piece is three files: a scene, a component and a page. The
component is the cast: hand-written JSX, one `useTarget` per element (17 in the second showreel). The page holds the
look as CSS. The scene names targets but cannot say what they are, and its beats are raw numbers: 71 `span(...)`
calls in the second showreel, and a `BEATS` list used only for a corner label. So no tool can tell whether a thing
shows before its beat, whether every cast member is used, or what the piece's beats are called. The rebuild worker
hit the first of these twice: exits that showed at rest before their span, hidden by hand with 16 ms fades.

## 2. The shape

```ts
export const beats = story(15000, {
  origin: [0, 1250],
  anticipate: [1000, 3550],
  weight: [3460, 6260],
});

export const stage = frame({ width: 1280, height: 720 });

export const cast = {
  dot: shape("circle", { size: 36, className: "dot" }),
  word: letters("ANTICIPATE", { className: "title", enters: "anticipate", leaves: "weight" }),
  card: shape("rect", { width: 320, height: 200, className: "card", watch: true }),
  mark: markup(`<svg viewBox="0 0 24 24">...</svg>`, { className: "mark" }),
};

export const look = css`
  .dot { background: #ff5533; border-radius: 50%; }
  .title { font: 900 120px "Arial Black", sans-serif; color: #f3ead8; }
`;

export const scene = (time: Time, events: Events) => ({
  dot: sequence(time, [[beats.origin, (t) => launch({ ... }, t)], ...]),
  word: rise({ distance: 60 }, beats.anticipate.of(time)),
});
```

- **The story owns the duration.** `story(durationMs, { name: [from, to] })` answers one `span` per beat and the
  length; the module's `durationMs` is `beats.durationMs`, so the length is stated once.
- **A cast member says when it is on stage.** `enters` and `leaves` name beats on the member itself, so presence has
  one place; the stage hides the member outside them.
- **A cast member is described, not drawn.** `shape`, `text`, `letters`, `words`, `image`, `path`, `group` and
  `markup` answer plain records: a kind, its size or content, a `className` and a `style` the piece chooses, and
  `watch: true` when the scene reads its pointer events. They carry no look of their own.
- **The look lives in the file too.** `look` is CSS the stage puts on the page, scoped to the stage, so a piece needs
  no HTML file of its own.
- **One stage plays any piece.** `<Stage module={...} />` in `@gerak/react` and `mountStage(element, module)` in
  `@gerak/dom` read the module, make one element per cast member, bind each with `applyValue`, wire `watch` members
  to the event driver, fit the frame to its container, and replay on a click. One page, `stage.html?piece=<name>`,
  shows any piece, and the live page plays it.

## 3. Decisions to record (P0, ADR-174)

- **`@gerak/stage` is a pure package** for the cast's records, `frame`, `story` and the checks. It knows no DOM;
  `@gerak/dom` and `@gerak/react` render it. A cast for Three.js is a later slice, when a 3D piece needs it.
- **There is one way to make a piece.** A stage module. What used to need its own component becomes a cast member:
  `markup` for an SVG or HTML fragment, `group` for nesting. The component path stays only for the worked examples,
  which tests read and nothing new copies; the scaffold no longer writes one.
- **A cast member's look is the piece's.** Makers set no colour, font or size the piece did not give. `look` and
  `style` decide.
- **Text in parts is a cast kind.** `letters` and `words` make one element each and one list target, laid out in a
  line by the browser; the stage measures each part's rest centre after layout and hands it to the scene through
  `layout`, as `centreIn` does today.
- **Layout is the browser's.** A member sits in normal flow inside the frame, or at `at: [x, y]` from its centre.
- **The story is the one source of beat names.** The timeline's marks, the review's labels and the sheet's captions
  read it; `_MS` constants and `cues` keep working for the examples.
- **A member the scene never moves says so.** `still: true` on the member; the check refuses a member that is
  neither moved nor still.

## 4. Slices

### P1. Cast, frame, story and look

- **Invariant:** the makers, `frame`, `story` and `css` answer frozen records; `story` refuses a beat that runs
  backwards or past the duration; a member's `enters` and `leaves` must be beats of the module's story, checked
  where the module is read.
- **Owner:** `packages/stage/src/`.
- **Test:** each maker's record holds only what it was given; `story`'s spans equal `span(from, to)`; bad beats are
  refused.

### P2. The stage, the page and the live page

- **Invariant:** `mountStage` and `<Stage />` build the cast, inject `look`, fit the frame, bind targets with
  `applyValue`, measure `letters` and `words` before the first value, wire `watch` members, hide a member outside
  its presence, and replay on a click. `apps/pieces/stage.html?piece=<name>` shows any stage module, and the live
  page plays one.
- **Owner:** `packages/dom/src/stage.ts`, `packages/react/src/stage.tsx`, `apps/pieces`.
- **Test:** a module with four kinds renders four elements with their class names and the injected CSS; a member
  outside its presence has `visibility: hidden`; letters report their centres; a `watch` member's hover reaches the
  scene's events; the live page swaps a stage module in place.

### P3. Tools read the story

- **Invariant:** the live timeline marks beats by name; `motion:review` labels picked frames with their beat; a
  scene-file review reports a member the scene never moves and is not `still`, a target the scene moves that is not
  cast, and a member whose value changes before it enters or after it leaves.
- **Owner:** `apps/pieces/src/live/timeline.tsx`, `packages/tools/src/scene/review.ts`, `packages/tools/src/page/`.
- **Test:** one finding of each kind on a fixture; a clean fixture has none.

### P4. Scaffold, guide, and the pieces moved

- **Invariant:** `motion:new <name>` writes one stage module with a story of one beat, one cast member at rest and an
  empty `look`; no component and no page. The guide's loop names the cast, the look and the story. The reference
  covers `@gerak/stage` by the generator. Two small pieces (`saved`, `tempo`) are rewritten as stage modules, by
  script where it can, and sample the same.
- **Owner:** `packages/tools/src/scene/new.ts` and templates; `docs/guide/agent-motion.md`; the skill; the two pieces.
- **Test:** the scaffold's module mounts and samples to rest; the two pieces' samples and frames match before and
  after.

### P5. Proof

- **Measure, alone in its worker:** the hand-made showreel rebuilt a third time as one stage module. New columns:
  files per piece and lines of component code (the second rebuild: 4 files, a 250-line component). Passes when it is
  one file with no component, no `fade` hides a member outside its beat, and the frames match the second rebuild's.
- **Cold run:** one Sonnet agent at medium effort makes a piece from a new brief with the guide alone, then is asked
  the interview's questions about the cast, the look and the story.

## 5. Team and order

| Wave | Who | Slices | Why |
| --- | --- | --- | --- |
| 1 | Conductor | P0, P1 | the records' shapes decide the rest |
| 2 | Opus, medium | P2 | a renderer with layout, measuring and events, touching dom, react and the app |
| 2 | Sonnet, medium | P3 | tools only, against P1's records |
| 3 | Sonnet, medium | P4 | after the stage exists |
| 4 | Opus, medium, alone | P5 measure | the measure runs alone, so its tokens are its own |
| 4 | Sonnet, medium | P5 cold run, then the cold review | independent eyes |

One pull request, after wave 4.

## 6. Risks

- **A generic stage tempts a house look.** The makers set no visual default; each maker's test checks its record
  holds nothing it was not given.
- **CSS in a string has no checking.** A typo in `look` shows only on the sheet. The review's sheet is the check, as
  it is for CSS in a page today.
- **Measuring letters after layout** needs a frame before the first value; the stage holds the first frame until the
  measure lands.
- **`markup` takes trusted strings.** It is the piece's own code, not user input; the reference says so.
- **The examples keep components.** They are tests of the runtime; the guide never names them, so they are not a
  second way an agent learns.

## 7. Done when

A new piece is one file, the showreel's third rebuild is one file with no component, the tools read beat names,
`npm run check` is green, and `docs/SESSION-STATUS.md` says so.
