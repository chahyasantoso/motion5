# gerak

gerak makes motion for web pages from code. A **scene** is a pure function from time, and the events so far, to one
value per target. `@gerak/player` plays it on a clock, the page's scroll or by hand, and `@gerak/dom`,
`@gerak/react` and `@gerak/three` write the values onto elements and Three.js objects.

> **Using it?** Start with [the user guide](docs/guide/README.md). Everything else in `docs/` is written for implementors.

> **Status:** [SESSION-STATUS.md](docs/SESSION-STATUS.md) is the only document allowed to claim what has landed.

> **Contributing?** Read [the PR workflow](docs/PR-WORKFLOW.md) and [the CI workflow](docs/CI-WORKFLOW.md) first.

> **An AI implementor?** [AGENTS.md](AGENTS.md) is your entry point.

## Why a scene is a function

A value that is a function of time can be sampled at any moment, sought backwards, tested without a browser, and read
back by a tool. So every number of motion lives in the scene: moves such as `drop`, `hop`, `wipe` and `along`, eases,
springs, rigs with FK and IK, and seekable physics. Drivers only report time and events, and renderers only write.

## Packages

| Package | Group | Holds |
| --- | --- | --- |
| `@gerak/core` | core | fields, poses (2D and 3D), time, blends, eases, envelopes, geometry, paths, measures, events |
| `@gerak/stage` | core | cast, story, skins, layouts, `carried` |
| `@gerak/player` | core | plays a scene on a driver |
| `@gerak/dom` | core | CSS writes and the page drivers: clock, scroll, events |
| `@gerak/react` | core | `usePlayer`, `useTarget`, `useValue` |
| `@gerak/three` | core | writes a pose on a Three.js object |
| `@gerak/tools` | core | the `gerak` command: `init`, `new`, `sample`, `review`, `render` |
| `@gerak/rig`, `@gerak/rig-three` | modules | bones, chains, FK and IK (2D and 3D), and Three.js skeleton binding |
| `@gerak/physics`, `@gerak/rapier` | modules | a seekable physics world, built in or on Rapier |
| `@gerak/moves`, `@gerak/moves-tools` | library | parts that carry a choice, named moves, qualities, styles, and their commands |

The worked examples and the pieces made with gerak live in `apps/pieces`, one folder per brief.

## Use it in another project

Nothing is on npm yet. Pack the packages and install the tarballs:

1. Run `npm run pack:check -- --keep`; it prints the folder that holds the tarballs.
2. In your project, run `npm install <path>/*.tgz` (or install only the core set), plus `react` or `three` when you use
   those packages, and `@types/react` or `@types/three` with TypeScript. `@gerak/rapier`'s types need `"lib": ["esnext", "dom"]`.
3. Run `npx gerak init`; it writes the page files, `tsconfig.json`, the skill and an `AGENTS.md` naming [core.md](packages/core/docs/core.md), [stage.md](packages/stage/docs/stage.md) and each installed package's docs.

## Toolchain and commands

Node 24, ESM, TypeScript, Vitest, and Prettier.

```bash
npm install
npm run check
npm run format
npm run typecheck
npm test
```

`package-lock.json` is committed and CI uses `npm ci`; run `npm install` after any manifest change.

## History

The JSON engine that gerak began as (`@gerak/core` and `@gerak/plugins`) was retired by ADR-170. It is kept on the
branch `archive/core-plugins`, and the decision records under `docs/` still describe it.

## License

MIT.
