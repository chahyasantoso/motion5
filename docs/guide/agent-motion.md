# Making motion as an agent

You write a project as data. The repo evaluates it and reports back, in numbers and in pictures, so you can correct your own work without watching it play. This guide assumes a checkout of this repository.

## The loop

1. `npm run motion:catalog` lists every plugin and model as JSON. Read it once per task.
2. Write the project as JSON.
3. `npm run motion:sample` validates it and reports values at named times.
4. `npm run motion:new` writes a page; bind your nodes to its DOM.
5. `npm run motion:timeline`, `motion:probe`, `motion:frames` and `motion:check` show it as bars, measurements, pictures and findings.
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

Each sampled node has a `status`. `ready` carries `progress` and `outputs`. `blocked` and `error` carry `diagnostics`. `absent` means a track that has published nothing yet, such as a `manual` motion's track that has not moved. `unknown` means the project holds no such id.

```bash
npm run motion:frames -- timing.html --at 0,500,1300
```

The page is a path inside the site, with no leading `/`. By default the site is `apps/react-demo`; `--root <dir>` serves any other folder, and `--url <address>` uses a server you already run, so these tools work on any web page, not only motion5 ones. Paths given to `--root` and `--out` are read from the folder you ran the command in. The command serves the site, opens the page in an installed Chrome or Edge under a paused fake clock, and prints paths as JSON: one PNG per time, and a labelled `sheet.png`. Read `sheet.png` rather than each frame. Frames repeat byte for byte, and land on animation frames, so use `motion:sample` when you need an exact number. A non-empty `pageErrors` exits `1`.

```bash
npm run motion:timeline -- apps/react-demo/src/timing-beat.json
```

One text bar per track, from its first change to its rest, sampled every 16 ms. Read it to check order, overlaps and how long the last pose holds, before looking at any frame. It needs `time` motions that do not repeat forever.

```bash
npm run motion:probe -- timing.html --at 2300 --select .beat-dot
```

Measures each match of a CSS selector at each time: box, centre, computed transform, colours, opacity and `z-index`. Use it for pixel values such as a `wipe` origin, instead of reading them off a frame.

```bash
npm run motion:frames -- timing.html --onion .beat-dot --from 880 --to 1880 --every 40
```

Draws the element at each step onto one faded frame, with its centre path, so its arc and spacing show without playback. Even gaps mean even speed; bunched gaps mean easing. A ghost is a capture of the element's box, so it can include whatever lies behind it, and nothing is drawn while the element is off the stage. It prints each step's box as well.

```bash
npm run motion:check -- timing.html --watch .beat-dot,.beat-glyph --to 3000
```

Samples every 16 ms up to `--to` and reports, each with its duration: two watched elements overlapping for more than `--overlap` frames (default 12), a centre moving more than `--jump` px in one frame (default 150), a final hold shorter than `--hold` ms (default 500), and an element still moving on the last frame. It exits `1` when it finds anything. An overlap compares boxes, so it ignores `z-index` and the empty space around a glyph: a dot passing behind a letter still counts. On the worked example a dot crossing a letter lasts 7 to 9 frames, which is why the default tolerates 12.

## Sequencing

| You want | Use |
| -------------------------------------- | -------------------------------------------------- |
| A motion to start later | `delay` on its `time` trigger, in milliseconds |
| Tracks to start one after another | `stagger` on the Motion, in track lengths |
| A move placed inside a longer Motion | `from` and `to` on the move, as shares of progress |

`duration` is the whole Motion, including its stagger. For a chosen track length, set `duration` to `length * (1 + (tracks - 1) * stagger)`. Stagger applies to every track in a Motion, so give a part that should not stagger its own Motion.

## Rest poses

A move ends at its rest pose, which is the element's layout position. Lay the page out as the final frame, then let moves bring things there: `drop` waits `distance` above rest, and `hop` arrives from `dx` to the left. Make `distance` and `dx` large enough to start off the stage, and clip the stage with `overflow: hidden`.

## Node ids

A track's node id is `motionId/trackId`, such as `letters/t`; a free track's is `~/trackId`. Hooks, `--nodes`
and `motion:sample` output all use node ids. Inside `requires`, a bare track id names a track in the same Motion,
and `motionId/trackId` names one in another Motion.

## The page

Run `npm run motion:new -- <name>` with a lowercase, dash-joined name; add `--root <dir>` to write into another Vite and React project that depends on motion5. It writes `<name>.html`, its entry, a component and a starter project that already samples and renders, and refuses a name whose files exist. Edit the markup and the project from there. `useMotionProject(project, plugins, interpolator)` loads and mounts the project and answers `loading`, `ready` with a `handle` and `replay`, or `refused` with `diagnostics`; switch over all three. Register every plugin your project names in that `PluginCatalog`. Keep motion out of the component: no arithmetic, easing or timing belongs there.

Bind one node to one element with `useDomPatch`, and a word to a Motion's tracks with `Word`. To bind two nodes to one element, combine their refs: `ref={mergeRefs(first, second)}`.

Each plugin a project names must be in the page's `PluginCatalog`, imported from its own path:

| Plugin | Import |
| ------ | ------ |
| `drop`, `hop`, `rope`, `trace`, `wipe` | `@motion5/plugins/motion/<id>`, as `dropPlugin`, `hopPlugin` and so on |
| `anchorsToCubic` | `@motion5/plugins/path/anchors-to-cubic` |
| `bezier` | `@motion5/plugins/path/bezier` |
| `svgPath` | `@motion5/plugins/path/svg-path` |
| Every built-in model | `builtinModels` from `@motion5/plugins/models` | See [Rendering patches](./rendering-patches.md).

[`timing-beat.json`](../../apps/react-demo/src/timing-beat.json) is the worked example, and `apps/react-demo/test/timing-beat.test.ts` shows how to pin a project's poses with `sampleProject`.

## Paths

A path is a chain of tracks. `rope` takes the points of a shape as its `values` table and publishes anchors for a chain that never stretches: straight along `angle` at the start, bending into the shape by the end. `anchorsToCubic` turns any anchors into a cubic path. `svgPath` publishes that path as `d`, for an SVG `<path>`, and `trace` publishes a stroke dash that draws the same path on from its start. Two hooks may bind one element, so one `<path>` can take `d` from one node and its dash from another. The chain, as tracks in one Motion:

```json
[
  { "id": "shape", "output": { "plugin": "rope" }, "input": { "values": [], "param": { "ripple": 0.5 } } },
  { "id": "path", "output": { "plugin": "anchorsToCubic" }, "input": { "requires": { "anchors": "shape" } } },
  { "id": "d", "output": { "plugin": "svgPath" }, "input": { "requires": { "path": "path" } } },
  { "id": "ink", "output": { "plugin": "trace" }, "input": { "requires": { "path": "path" } } }
]
```

`values` holds the shape's points as rows, `{ "id": "p0", "cells": { "x": 260, "y": 437 } }`.

`npm run motion:points -- shape.json --spacing 12` turns a JSON array of `{ x, y }` points into those rows, resampled
to fixed spacing, so every link of the rope is the same length.

Tuning `rope`, as starting points rather than rules:

- `release` `pin` (the default) forms the shape in drawing order from the pinned end, which reads as writing;
  `free` whips the far end in first.
- `ripple` near `0.6` passes the bend along visibly; lower bends everything at once.
- `overshoot` between `0.3` and `0.6` reads as a relaxing rope; `0` lands without one.
- `pin` `end` keeps the last point still instead, with the straight rope running from it along `angle`.
- The straight rope is as long as the shape's path, so a long word starts mostly off the stage.

## Traps

- `validateV5` cannot know ease names, because the interpolator owns them. `motion:sample` loads the project, so it refuses an unknown ease as `ease-unknown`.
- A `wipe` takes pixel coordinates. Rather than typing them, let the page measure them: `useAnchor(handle, node, { x: "x", y: "y" })` returns `from` and `to` refs, and writes the layout centre of the `from` element, measured from the `to` element's corner, into those param fields. Combine its refs with others through `mergeRefs`. Keep placeholder numbers in the project, because the param is required.
- `svgPath` writes `d` as a CSS `path()` value, which Chromium and Firefox render and Safari does not.
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
