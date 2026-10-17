# CI workflow

Seven required check contexts run on every pull request against the PR head (not a merge commit):
`quality`, `integration`, `end-to-end`, `boundaries`, `read-budget`, `build`, and `performance`.

## What each job does

`quality (node 24.21.0)` — single full-suite execution owner. Runs typechecking, formatting check,
test discovery, and the full suite in sequence. A failure in one step does not suppress the rest, but the
job stays failed. Cancellation is not a passing result.

`integration (node 24.21.0)` and `end-to-end (node 24.21.0)` — download the quality artifact from this
same run and verify its identity, discovery parity, and passed results. They never re-run the suite.
They require successful quality completion; a red quality job cannot yield green compatibility contexts.

`boundaries (node 24.21.0)` — runs `node scripts/boundary-scan.mjs` against the repository.

`read-budget (node 24.21.0)` — runs `node scripts/read-budget-scan.mjs`. No file under
`packages/core/src` may exceed 60,000 bytes; sources over 30,000 bytes require a sibling `x.md`.

`build (node 24.21.0)` — compiles declaration output and checks `dist/index.js` and `dist/index.d.ts`.

`performance (node 24.21.0)` — runs the benchmark and uploads its report. Structural budget failures
exit nonzero; `continue-on-error` is not used.

## Evidence and citing runs

Cite the original Actions run id as primary evidence. The trusted reporter retains `receipt.json` and
bounded diagnostics under `ci-logs/receipts/<kind>/<run-id>/<attempt>/`. Legacy runs may use
`logs/<run-id>/`. Read the actual deployed reporter before assuming a format exists.

Formatting is read-only in CI. No job repairs the contributor branch. For manual repair use
[FORMATTING.md](./FORMATTING.md).

## API-only contributors

State "not run locally, verified by linked CI on this exact SHA." Do not claim local checks for remote
runs. See [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) and [AI-CHECKPOINT-WORKFLOW.md](./AI-CHECKPOINT-WORKFLOW.md)
for the bounded transport protocols.
