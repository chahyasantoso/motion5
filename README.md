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

| Package | Holds |
| --- | --- |
| `@gerak/moves` | time, spans, lanes, eases, poses (2D and 3D), events and the moves |
| `@gerak/rig` | bones, chains, FK and IK, 2D and 3D |
| `@gerak/player` | plays a scene on a driver |
| `@gerak/physics`, `@gerak/rapier` | a seekable physics world, built in or on Rapier |
| `@gerak/dom` | CSS writes and the page drivers: clock, scroll, events |
| `@gerak/react` | `usePlayer`, `useTarget`, `useValue` |
| `@gerak/three` | writes a pose on a Three.js object |
| `@gerak/tools` | the `motion:*` commands: scaffold, sample, review, render |

The worked examples and the pieces made with gerak live in `apps/pieces`, one folder per brief.

## Use it in another project

Nothing is on npm yet. Pack the packages and install the tarballs:

1. Run `npm run pack:check -- --keep`; it prints the folder that holds the tarballs.
2. In your project, run `npm install <path>/*.tgz`, plus `react` or `three` when you use those packages, and
   `@types/react` or `@types/three` with TypeScript. `@gerak/rapier`'s types need `"lib": ["esnext", "dom"]`.
3. Point your agent at [the agent guide](https://github.com/chahyasantoso/motion5/blob/main/docs/guide/agent-motion.md).
   The `motion:*` npm scripts it names live in this repository; outside it, check by seeking the stage.

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
