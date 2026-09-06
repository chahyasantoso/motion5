# CI workflow

CI validates every pull request and the push branches named in [ci.yml](../.github/workflows/ci.yml). It checks the exact PR head rather than claiming to test its merge with the base. Ordinary CI has read-only repository permissions, disables persisted checkout credentials, installs with `npm ci --ignore-scripts --no-audit --no-fund`, and never repairs or publishes contributor changes.

## Invariant and ownership

Removing duplicate execution must not remove assertions or turn missing evidence green. [ci-evidence.mjs](../scripts/ci-evidence.mjs) owns installed-Vitest discovery parity and consumption of the single full-suite result. The workflow owns scheduling, credentials, and dependencies. No runtime or test-discovery configuration is changed.

The seven existing check names remain intact because branch-protection configuration is not available through the implementation connection. A YAML check name is not proof that repository settings require it. Exceptional push triggers remain unchanged until their consumers can be verified; no event deduplication is claimed.

## Quality and independent evidence

`quality (node 24)` is the single full-suite execution owner. Typechecking, read-only formatting, discovery, and full-suite execution each run after a successful install even when an earlier check fails. Failures are not marked continue-on-error: the job remains failed. Cancellation does not become a successful result.

Discovery invokes the installed Vitest CLI with the repository configuration for the whole suite, the integration filter, and the end-to-end filter. These commands collect tests without executing test bodies. Their machine-readable inventories must be nonempty. Each filtered inventory must equal its projection from the full inventory, including duplicate-name multiplicity.

The full suite runs once with the normal console reporter and a small evidence reporter. Verification matches every discovered runnable test to a passed execution result. It checks successful completion, module results, unhandled errors, immutable head, run ID, attempt, Node version, and a digest of the lockfile, Vitest configuration, and evidence implementation. A missing result or dynamically skipped expected test fails verification. Pre-existing statically skipped tests are not presented as executed assertions; integration and end-to-end evidence additionally refuses skipped results within its scope.

Evidence is uploaded under `ci-evidence-<run-id>-<attempt>` for 14 days. Inventories and execution results remain separate. Outputs live outside the checkout, so generated evidence cannot cause formatting drift. This artifact is read-only CI evidence, not authority for a privileged publisher.

## Compatibility check names, not duplicate test runs

`integration (node 24)` and `end-to-end (node 24)` always evaluate their dependency result. They require successful quality completion, download the artifact from this same run and attempt, and independently verify its identity, discovery parity, and corresponding passed results. Absent artifacts, failed or cancelled producers, skipped evidence, and mismatched identities cannot produce a green placeholder. Neither job installs dependencies or executes the suite again.

These contexts intentionally depend on all quality evidence, including formatting and typechecking. Behavioral evidence is still collected when either fails, but a red quality job does not yield green compatibility contexts.

## Distinct assertions retained

`boundaries (node 24)` runs `node scripts/boundary-scan.mjs` against the actual repository. `read-budget (node 24)` runs `node scripts/read-budget-scan.mjs` against the actual core source and sister documents. Their scanner unit tests remain in the single full suite instead of running twice. The existing convenience package scripts still run scans plus their self-tests for manual use.

`build (node 24)` compiles declaration output and checks both `packages/core/dist/index.js` and `packages/core/dist/index.d.ts`. These assertions are unchanged.

`performance (node 24)` runs the existing benchmark and uploads its report. The benchmark exits nonzero when its structural budgets fail, and the workflow does not use continue-on-error. The advisory label and 2026-08-17 expiry in historical budget metadata are not a current exemption from failure. This slice preserves behavior and does not claim to have inspected or changed branch protection, recalibrated the benchmark, or promoted the synthetic measurement into runtime performance evidence.

## Formatting and API-only contributions

Formatting is read-only in CI. [FORMATTING.md](./FORMATTING.md) owns the pinned formatter and manual repair contract. Touched-file normalization in the gated AI-edit route is described in [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md); its availability depends on actual activation, not on a passing PR.

A contributor without the installed repository toolchain can submit direct API edits and use exact-head CI as verification. Do not claim local checks. The manual formatter requires workflow dispatch, which is not exposed by every connection. No temporary privileged formatter is introduced here.

## Reporting and deployment

The slice 2 reporting implementation retains run-and-attempt receipts and bounded diagnostics on `ci-logs`, with bot-owned SHA-aware comments. [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) owns its activation requirements. A workflow_run reporter is read from the default branch: an implementation PR or integration-branch merge does not deploy it.

Until that rollout, the default branch can still use the legacy failed-log archive at `logs/<run-id>/failed-jobs.log`. Cite the original Actions run as primary evidence and read the actual deployed workflow before assuming a receipt exists. Never use `ci-logs` as a development branch.

## Measurements and limits

PR bodies own exact-head checks, observable job durations, and failing-first evidence. Discovery adds collection work and compatibility checks add artifact transfer and scheduling. One execution owner does not by itself prove lower total job-minutes or faster feedback. Record available durations and do not invent savings from removed commands.

Recovery audit remains a separate manual workflow with distinct mutation and acceptance evidence. Its work is not described as ordinary PR overhead and is not removed here. Default-branch reporting, live activation exercises, and branch-protection review remain separate gates.
