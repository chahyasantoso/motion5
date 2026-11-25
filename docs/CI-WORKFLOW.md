# CI workflow

CI validates every pull request and the push branches named in [ci.yml](../.github/workflows/ci.yml). It checks the exact PR head rather than claiming to test its merge with the base. Ordinary CI has read-only repository permissions, disables persisted checkout credentials, installs with `npm ci --ignore-scripts --no-audit --no-fund`, and never repairs or publishes contributor changes.

## Jobs

- `quality (node 24.21.0)` runs the raw-template, comment and cycle scans, typecheck, read-only formatting, then the `unit` Vitest project. Each step runs after a successful install even when an earlier one fails, and none is continue-on-error.
- `browser (node 24.21.0)` runs the `browser` Vitest project, one file at a time, alongside the other jobs.
- `boundaries (node 24.21.0)` runs `node scripts/boundary-scan.mjs` against the actual repository. The scanner's own tests run in the full suite, not twice.
- `performance (node 24.21.0)` runs `npm run benchmark` and uploads its report. The benchmark exits nonzero when its structural budgets fail.

On demand, outside `npm run check`: `npm run build` emits the thirteen installable packages to `dist/`, and `npm run pack:check` packs them, installs the tarballs into an empty project and imports every export under Node. Neither publishes anything.

## Formatting and contributions

Formatting is read-only in CI: `format:check` runs against the branch head and writes nothing. Prettier is pinned at the `package.json` version, `printWidth` 100, double quotes, trailing commas everywhere and `proseWrap` preserve, and it formats code only -- markdown is outside its reach by decision, so prose is laid out by hand and never rewrapped by a toolchain. A repository-wide repair is the [format.yml](../.github/workflows/format.yml) dispatch route and never a step inside a behavior pull request.

A contributor without the installed toolchain can submit pull requests and use exact-head CI as verification. Do not claim local checks.

## Measurements and limits

PR bodies own exact-head checks, observable job durations, and failing-first evidence. Record the durations available and do not invent savings from removed commands.
