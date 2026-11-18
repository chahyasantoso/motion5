# Stage v3: a smaller stage that is cheaper to read and to run

## Goal

Piece authors, mostly AI agents, write one `defineStage` object and get a correct piece on the first
review with fewer tokens read; renderers and `gerak review` run that piece through a frame path that
allocates nothing of its own. The code keeps the single definition from PR 599 and replaces its
internals with one member model, a precomputed timeline and a split between the hot path and checks.

Status: approved 2026-11-18.

## Base

Branch `feat/stage-v3` from the tip of `refactor/points-and-reference` (PR 599 merged). `main` lacks
the core split and is 57 commits behind, so it is not a base. Every piece already uses `defineStage`,
so the migration of pieces is mechanical; `packages/stage/src` is rewritten whole.

## Budgets the work must meet

| Cost | PR 599 | v3 target |
| --- | --- | --- |
| `packages/stage/src` lines | 2989 | at most 1300 |
| Root value exports of `@gerak/stage` | about 40 | at most 15 |
| `stage.md` plus author reference, bytes | 9.3 K + 29 K | at most 6 K + 8 K |
| Stage work per frame, scene replayed, 12 pieces | 203 us total (`performance/stage-baseline.json`) | at most 100 us |
| Representations of one member | 3 (`tree`, `entries`, `reviewMembers`) | 1 |

`performance/stage-benchmark.mjs` times every stage piece headless, with its scene and with the scene
replayed, so the stage's own cost is apart from the piece's. Under PR 599 the stage is about 1% of a frame and
the showreel scenes take 4 to 5 ms each; skipping hidden members is where whole frames gain. The agent measure runs a plain HTML/JS agent beside a gerak agent on one brief and
counts tokens read and review rounds; v3 must beat PR 599 and the plain agent.

## Decisions

### 1. Authoring stays one object; lists become functions

```ts
export default defineStage({
  beats: { enter: [0, 500], hold: [500, 1600] },
  cast: (m) => ({
    caption: m.text("Click card").static(),
    snow: m.many(20).ambient(),
    card: m.group({ badge: m.text("READY").on("enter", ["enter", "hold"]).watch(), letters: m.letters("HELLO") }),
  }),
  scene: ({ time, beats, carry }) => {
    const t = beats.enter.of(time, ease.cubicOut).progress;
    return {
      card: carry("card", { ms: 450 }),
      badge: { scale: mix(0.85, 1, t) },
      letters: (i, n) => ({ opacity: stagger(t, i / n) }),
      snow: (i) => ({ y: (time.progress * 300 + i * 25) % 720 }),
    };
  },
});
```

- A list's value is `(index, count) => Pose`. The cast owns the count; a wrong length cannot be written.
  `each(items, (item, i) => pose)` makes that function from per-item data.
- One builder type per member kind; modifiers return the same type. `.static()` no longer changes the
  scene's type to `never`; review reports a posed static member in one line.
- The scene's return type maps cast entries with key remapping, without `UnionToIntersection`.
- `pose: "3d"`, `PoseMode` and the open `RendererSkins` interface go until a renderer needs them.

### 2. One member model

`Stage.members` is one frozen array of a closed union, in tree order, parent by index:

```ts
type Member =
  | { kind: "actor"; name; parent; content: Content; expect: Expect; watch; pivot?; on?: Window[] }
  | { kind: "list"; name; parent; items: readonly ItemContent[]; expect; watch; pivot?; on? }
  | { kind: "group"; name; parent; expect; watch; pivot?; on? };
```

Renderers build their tree from `parent`; review reads `expect` from the same entry. `Content` is the
closed union `box | text | readout | stroke | morph`; items exclude `readout`; `on` holds ms windows.
`stage.signature`, computed once at compile, is the one answer to "same cast?" for `replace` and the
live page, replacing `sameCast` and the `JSON.stringify` key.

### 3. The timeline is precomputed

`compileStage` turns beats and every `on` into sorted boundary times and one frozen visibility record
per segment. A frame finds its segment by binary search and returns that shared record, so visibility
costs nothing per frame and has one owner; review reads it too.

### 4. A hot path and a check, not one function doing both

- `frame(stage, { time, events, boxes })` returns `{ layout, visible, targets }`, where `targets` is the
  scene's output as returned. Readouts, morph blending (`morphAt`) and list poses are computed by the
  renderer for the members it draws; a hidden member is not written at all.
- `check(stage, targets)` returns `readonly StageError[]` and is the one owner of shape rules. Review
  calls it on every sample; `mountStage` calls it when `checks: true`, which the stage and live pages set.
- Review expects a settling member to move, an ambient one to keep moving inside the frame, and a
  static one to stay out of the scene.

### 5. Layouts are always named

Single layout is the degenerate case: compiled stages always hold `layouts: { names, pick, rests }`,
one, `main`, when the author gave `rest` or nothing. `boxes` is `Readonly<Record<name, RestReader>>`, so no
duck-typed union is left.

### 6. Identity is data

`defineStage` returns `{ kind: "stage-definition", ... }`, `compileStage` returns `{ kind: "stage",
scene, ... }`. Guards read `kind`; no `WeakSet` or `WeakMap`, so a second copy of the package still works.

### 7. One skin path

`DomSkin` stays `{ kind: "inline", css, defs? } | { kind: "url", css: URL, defs?: URL }`. The DOM
renderer fetches a URL skin's text and then runs the inline path, so paint parts and default-skin
markers behave the same; `ready` resolves after the fetch and re-measure.

### 8. Three entries, one per reader

| Entry | Reader | Exports |
| --- | --- | --- |
| `@gerak/stage` | authors, renderers, tools | `defineStage`, `each`, `compileStage`, `formatStageError`, `frame`, `check`, `listPose`, `poseOf` and their types |
| `@gerak/stage/render` | renderers, tools | `morphAt`, stroke resolution, `strokeBox`, `drawInPasses`, outline helpers |
| `@gerak/stage/dom` | skins | `cssVariables`, `isTokenName` |

Source folders `author/`, `run/`, `render/` and `dom/` are the reference pages, one per reader; an
author reads `stage.md` and `reference/author.md` only.

## Execution

One session builds it all in order, one commit per layer; no builder waves, because every slice
follows from the stage contract and the pieces migration is scripted.

1. Benchmark baseline on the PR 599 tip, committed with the benchmark script.
2. `packages/stage` rewritten with tests. Checks: stage tests, `tsc` for stage, `scan:cycles`.
3. `packages/dom` and `packages/react` migrated, with their tests.
4. `packages/tools`, `packages/moves-tools`, `apps/pieces` and `scripts/pack-check.mjs` migrated; list
   values converted by script.
5. Docs and reference within budget, `npm run check`, `npm run pack:check`, benchmark against the
   baseline.
6. One cold review on Sonnet that sees neither plan nor history, fixes, one pull request. The agent
   measure runs after the pull request is open, as its own task.

## Not in this plan

Three.js stages, canvas or SVG renderers, and any change to `@gerak/core` time helpers.
