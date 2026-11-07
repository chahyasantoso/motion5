# Making motion as an agent

You write a project as data. The repo evaluates it and reports back, in numbers and in pictures, so you can correct your own work without watching it play. This guide assumes a checkout of this repository.

## The loop

1. `npm run motion:catalog` lists every plugin and model as JSON. Read it once per task.
2. Write the project as JSON.
3. `npm run motion:sample` validates it and reports values at named times.
4. `npm run motion:new` writes a page; bind your nodes to its DOM.
5. `npm run motion:frames` shows that page at named times.
6. Adjust values, then repeat from step 3.

Look at frames before you call anything finished. Values can be right while the picture is wrong: a wrong pivot, a color that merges, a letter colliding with its neighbor. None of those raises an error.

## Commands

```bash
npm run motion:catalog
```

The catalog gives each plugin's `param`, `requires` and `outputs`, with `min`, `max` and a one-line `description` where declared. Pass `--plugins hop,drop` for only those plugins and the models they require. Each file in `packages/plugins/src/motion/` is short and opens with what the move does.

```bash
npm run motion:sample -- project.json --at 0,250,500 --nodes m/dot
```

Use `--at` for milliseconds on `time` motions, and `--progress 0,0.5,1` for `manual` motions. A project mixing the two, or using `scroll`, answers `unsupported`, naming each motion that request cannot drive. Omit `--nodes` for every track. `--fields y,scaleY` keeps only those fields of each output, and empty `diagnostics` are left out.

The result has a `kind`. The exit code is `0` only for `accepted`.

| `kind` | Meaning |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| `accepted` | `samples` holds each node at each time |
| `refused` | `diagnostics` names each rule and path; fix all of them |
| `unsupported` | `reasons` names the motions this request cannot drive |
| `usage` | The command line or the file could not be read |

Each sampled node has a `status`. `ready` carries `progress` and `outputs`. `blocked` and `error` carry `diagnostics`. `absent` means nothing has been published for that id: it is unknown, or it is a `manual` motion's track that has not moved yet.

```bash
npm run motion:frames -- timing.html --at 0,500,1300
```

The page is a path inside `apps/react-demo`, with no leading `/`. The command serves that app, opens the page in an installed Chrome or Edge under a paused fake clock, and prints paths as JSON: one PNG per time, and a labelled `sheet.png`. Read `sheet.png` rather than each frame. Frames repeat byte for byte, and land on animation frames, so use `motion:sample` when you need an exact number. A non-empty `pageErrors` exits `1`.

## Sequencing

| You want | Use |
| -------------------------------------- | -------------------------------------------------- |
| A motion to start later | `delay` on its `time` trigger, in milliseconds |
| Tracks to start one after another | `stagger` on the Motion, in track lengths |
| A move placed inside a longer Motion | `from` and `to` on the move, as shares of progress |

`duration` is the whole Motion, including its stagger. For a chosen track length, set `duration` to `length * (1 + (tracks - 1) * stagger)`. Stagger applies to every track in a Motion, so give a part that should not stagger its own Motion.

## Rest poses

A move ends at its rest pose, which is the element's layout position. Lay the page out as the final frame, then let moves bring things there: `drop` waits `distance` above rest, and `hop` arrives from `dx` to the left. Make `distance` and `dx` large enough to start off the stage, and clip the stage with `overflow: hidden`.

## The page

Run `npm run motion:new -- <name>` with a lowercase, dash-joined name. It writes `apps/react-demo/<name>.html`, its entry, a component and a starter project that already samples and renders, and refuses a name whose files exist. Edit the markup and the project from there. `useMotionProject(project, plugins, interpolator)` loads and mounts the project and answers `loading`, `ready` with a `handle` and `replay`, or `refused` with `diagnostics`; switch over all three. Register every plugin your project names in that `PluginCatalog`. Keep motion out of the component: no arithmetic, easing or timing belongs there.

Bind one node to one element with `useDomPatch`, and a word to a Motion's tracks with `Word`. See [Rendering patches](./rendering-patches.md).

[`timing-beat.json`](../../apps/react-demo/src/timing-beat.json) is the worked example, and `apps/react-demo/test/timing-beat.test.ts` shows how to pin a project's poses with `sampleProject`.

## Traps

- `validateV5` cannot know ease names, because the interpolator owns them. `motion:sample` loads the project, so it refuses an unknown ease as `ease-unknown`.
- A `wipe` takes pixel coordinates. Measure the element it should grow from, and remember the numbers go stale if the layout or font changes.
- `transformOrigin` from a move applies to HTML targets. On SVG the adapter's own pin wins, so a move pivots at the element's origin.
- A letter's squash widens it, and it can touch its neighbor. Check the landing frames.
- A dot drawn after a word passes in front of it. Use `z-index` to send it behind.
- An element the same color as what it crosses merges with it. Check the crossing frames.

## Starting values

These worked once, in the worked example. They are defaults to begin from, not rules.

| Move or setting | Value |
| ------------------ | -------------------------------------------- |
| Letter `squash` | `0.18` at a 170 px font |
| Dot `squash` | `0.45` |
| `hop` `decay` | `0.35`, with `bounces` of `2` |
| Letter `stagger` | `0.25`, each letter lasting about 450 ms |
| A wipe's `duration` | `600` |
| A held final frame | Long enough to read the last words |
