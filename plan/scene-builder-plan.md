# Scene builder

## Goal

People and agents making a piece create elements and beats as values, and attach motions to each element in one
chain. Each answer about an element then sits in one place. The code replaces `defineStage`, the cast builder and member
modifiers with `sceneBuilder` in `@gerak/stage`, and moves every piece to it.

Status: proposed 2026-11-19. Starts after `plan/principles-plan.md` lands, and uses its principles and `state`. One
branch, one pull request, built in waves.

Read `AGENTS.md` first. Every rule there applies.

## Where things stand

- A piece is one `defineStage({ beats, cast, scene, ... })` object. It also holds `layouts`, `cues`, `limits`,
  `skins`, `frame`, `rest` and `durationMs`.
- `@gerak/stage` owns `defineStage`, cast builders (`m.box`, `m.text`, `m.letters`, `m.words`, `m.many`, `m.group`,
  `m.stroke`, `m.morph`, `m.readout`), member modifiers (`.on`, `.watch`, `.settle`, `.ambient`, `.static`, `.pivot`),
  `compileStage`, `frame`, `check`, layouts and `carry`.
- The scene is one pure function from time to every member's pose.
- The 3D pieces play scene modules through the player, outside any stage. They stay that way until
  `plan/stage-3d-plan.md`.
- Of the 33 scene files under `apps/pieces`, about 13 are entrances, staggers and loops on elements that do not depend
  on each other. The rest need one or more of these:
  - one element that reads another.
  - one calculation for several parts.
  - state shared by several elements.
  - a layout that changes while the piece plays.
- `@gerak/tools`, `@gerak/dom` and the scaffold read `Member.kind`, some with a predicate. The builder replaces
  `Member`, and Decision 3 reads every kind with an exhaustive `switch`.
- The roadmap rules out a second way to make motion. The builder therefore replaces `defineStage` in the same pull
  request, and does not sit beside it.

## Decisions

### 1. The shape

```ts
const fall = beat("fall", 600);
const held = beat("held", 800, { after: fall });

const hand = anchor("hand", { at: { x: 400, y: 300 } });
const ball = shape("ball", circle(20), { at: { x: 520, y: 440 } });
const word = text("word", "CATCH", { split: "letters", at: { x: 640, y: 600 } });

export default sceneBuilder()
  .element(ball).motion(
    drop({ distance: 300 }).in(fall),
    squashStretch({ stretch: 0.1 }),
    stayWith(hand).in(held).take(),
  )
  .element(word).motion(stagger(fadeUp(), { spread: 0.3 }).after(fall));
```

- **Elements are values,** created once with a name. Each type says what the element is:
  - `box`: a page element styled by CSS.
  - `shape`: a drawn path.
  - `text`: text. With `split`, it has a part per letter or word.
  - `image`, `video`.
  - `anchor`: an invisible point.
  - `parts`: an element with named parts, for a rig.
  - `many(name, count, make)`: an element with numbered parts.
- An element's options hold what stays true in any scene: `at` (its rest), `pivot`, `mask`, `split`.
- `group(name, children)` is a helper. It makes an anchor and adds `stayWith` on each child. Group is not a type.
- **Beats are values:** `beat(name, length, { at? | after?, gap? })`. `beat.end` is a time.
- **The scene** is `sceneBuilder({ frame?, cues?, length?, layouts? })`, then a chain:
  - `.element(x)` selects an element. An element may be selected again later.
  - `.motion(...motions)` appends motions to that element's list.
  - `.show(...beats)` sets when the element exists. Calls add windows.
  - `.limits({ jump?, turn?, ratio? })` sets review limits. A field set twice is refused.
  - Only `.motion` order matters. `.show` and `.limits` may appear anywhere after `.element`.
- **A motion** is a function that returns a signal. Timing methods: `.in(beat)`, `.after(beat)`, `.with(beat)`. A
  motion with no timing plays over the whole piece.
- **Shared values:** `state`, `springTo` and `easeTo` from core. `bind({ y: lift })` sets fields from signals.
- **Reading another element:** `stayWith(hand)` reads `hand`'s pose. The builder runs motions in the order they read
  each other, and refuses a loop by naming every element in it.
- **Layouts:** `layouts: { state, pick }` in the options. `carry({ ms, ease, mode })` is a motion.
- **Free code:** a plain function `(time, context) => pose` is a motion.

### 2. Exports of `@gerak/stage`

- Elements: `box`, `shape`, `text`, `image`, `video`, `anchor`, `parts`, `many`, and the helper `group`.
- Time: `beat`.
- Scene: `sceneBuilder`, `bind`, `stayWith`, `carry`.
- Run: the compile, frame and check functions the renderers and tools need, renamed only where the old name says
  "stage".
- Removed: `defineStage`, `CastBuilder`, `Members`, `Meta`, `Modifiers`, `Targets`, `SceneContext`, `Spec`, and every
  type that exists only for them.

### 3. One element, one owner

- An element value holds its name, its kind, its pose type (2D or 3D) and its parts. The builder never reads `kind`.
- Each renderer reads `kind` over its own closed union with an exhaustive `switch`. For `@gerak/dom` it is
  `"box" | "shape" | "text" | "image" | "video" | "anchor"`.
- Rendering refuses an element that no renderer draws, and names it.
- A rig is a `parts` element. `@gerak/rig` gives motions that return a pose per part, and keeps its dependency on core
  only.

### 4. Layering and take

- The motions on an element run in list order. Each one gets the pose of the motions above it, joined by core's
  `combine`.
- A motion with `.take()` gets the pose of the motions above it at its start as `from`. From its start on, its fields
  replace theirs.
- A principle in the list is applied to every motion above it. To change one motion only, wrap it. This uses the
  settings-first form decided in `plan/principles-plan.md`.

### 5. Inference

- Pointer events reach an element when a `state` or `follow` names it as a target.
- An element with no motion is static, one with a looping motion is ambient, and every other element settles.
- The length is the end of the last beat, unless the options give `length`.
- Draw order is the order of each element's first `.element` call.

### 6. The renderer

- `@gerak/dom` draws the builder's elements as `mountStage` does today, with skins passed at render time.

### 7. Every piece moves

- `card`, `catch`, `shop` and `nadi` move first. Together they use every part of Decision 1. Each place where
  the shape needed a verb, an option or a type it did not have changes Decision 1 here before the next wave.
- Then every other piece and worked example that uses `defineStage` moves. 3D scene modules do not move.
- `gerak new` writes a builder piece. `gerak new --three` does not change.
- Each moved piece's frames match its baseline, and its review gains no finding.

### 8. Tests first

- One test per layering rule, `.take()`, refused loops, refused duplicate limits, each inference, and a renderer
  refusing an unknown kind.
- A type test that `.motion` cannot be called before `.element`.

### 9. Record and docs

- A new ADR records Decisions 1 to 6, with the next free number. It supersedes in part ADR-174, ADR-175, ADR-190 and
  the stage clauses of ADR-178. Grep `docs/ADR-INDEX.md` for any other record that names `defineStage` or cast
  builders, then run `npm run adr-index:write`.
- `stage.md` is rewritten for the builder, under the ceiling from `plan/principles-plan.md` Decision 6. How the DOM
  renderer draws moves to a page in `@gerak/dom`'s docs, read on demand, and `stage.md` keeps three lines of it. The guide, `commands.md`, the make-motion skill,
  `README.md`, `docs/MAP.md` and `docs/ARCHITECTURE.md` lose every line that names `defineStage`.
- The roadmap loses the "chain API" bullet under "Waiting for a brief", which this plan answers.
- Rewrite `docs/SESSION-STATUS.md`.

## Execution

1. **Baseline:** frames of every page under `apps/pieces` and `apps/examples`, each piece's `gerak review` output,
   and every command's output on `tempo`, `card` and `overlay3d`.
2. Waves, `npm run check` green after each:
   - Decisions 8, then 2 to 6 in `@gerak/stage` and `@gerak/dom`, with `defineStage` still present.
   - `card`, `catch`, `shop` and `nadi`, and any change to Decision 1 they force.
   - The other pieces and examples, a few per builder.
   - Delete `defineStage` and its types, then Decision 9.
3. Compare against the baseline. No frame may change. Command output changes only where a name changed.
4. In the pull request, report:
   - `npm run check` with no `packages/*/dist`.
   - `npm run pack:check`.
   - the stage benchmark.
   - the comparison.
   - `npm run metrics`.
   - the line count of `packages/` before and after.
   - every change to Decision 1 from the first four pieces.
   - one cold review by an agent that has not read this plan.
5. Last, the NADI measure exactly as `plan/measure-nadi.md` states, with a plain HTML and JavaScript agent beside it.

## Not in this plan

- Scroll, pointer position, page mode and sections (`plan/page-plan.md`).
- 3D objects in a scene (`plan/stage-3d-plan.md`).
- The visual editor.
