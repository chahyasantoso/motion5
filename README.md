# motion5

motion5 makes motion for web pages from code. A **scene** is a pure function from time, and the events so far, to one
value per target. `@motion5/player` plays it on a clock, the page's scroll or by hand, and `@motion5/dom`,
`@motion5/react` and `@motion5/three` write the values onto elements and Three.js objects.

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
| `@motion5/moves` | time, spans, lanes, eases, poses (2D and 3D), events and the moves |
| `@motion5/rig` | bones, chains, FK and IK, 2D and 3D |
| `@motion5/player` | plays a scene on a driver |
| `@motion5/physics`, `@motion5/rapier` | a seekable physics world, built in or on Rapier |
| `@motion5/dom` | CSS writes and the page drivers: clock, scroll, events |
| `@motion5/react` | `usePlayer`, `useTarget`, `useValue` |
| `@motion5/three` | writes a pose on a Three.js object |
| `@motion5/tools` | the `motion:*` commands: scaffold, sample, review, render |

The worked examples live in `apps/react-demo`. None of the packages is published; consumers build from the workspace.

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

The JSON engine that motion5 began as (`@motion5/core` and `@motion5/plugins`) was retired by ADR-170. It is kept on the
branch `archive/core-plugins`, and the decision records under `docs/` still describe it.

## License

MIT.
