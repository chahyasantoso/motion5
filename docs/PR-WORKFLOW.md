# Pull request workflow

Pull requests are the unit of architectural change. Completion requires clear ownership, evidence, public surface, docs, and deletions, not a claim that code worked locally.

## Branches and commits

Use `feat/`, `fix/`, `test/`, `docs/`, `perf/`, or `chore/`, with the issue or plan id when applicable. Avoid long-lived integration branches. Use imperative conventional commits with a module scope.

```text
feat(graph): add transactional edge replacement
test(migration): cover free-track conversion
docs(architecture): define blocked publication
chore: apply prettier
```

Touched-file normalization may accompany its requested change. Unrelated formatting stays in a separate mechanical commit. [FORMATTING.md](./FORMATTING.md) owns that distinction.

## Pull request body

Every PR names its invariant, failing-first test, single owner, changed public schema or exports, deletions, and status rewrite. State which checks were requested, which executed, and which passed. API-only contributors may say "not run locally, verified by linked CI on this exact SHA"; never check a local-execution box for a remote run.

Record the exact tested SHA and run link. A green submission commit is not evidence for a later generated commit. Keep implementation written, PR CI verified, merged, and activated with live evidence distinct. A default-branch reporter or new trusted runner is not deployed by a passing implementation PR.

## Sizing and review

Target fewer than twenty semantic files and one meaningful invariant. More than twenty-five commits or a second revert means recut the slice. Review duplicate ownership, validity of tests, runtime flags or aliases, public exports, hidden behavior in formatting, credential boundaries, and documentation drift.

Semantic files are distinct paths in the PR diff, excluding lockfiles, generated build output, and files touched only by a formatting commit. State the measured count once in the PR body, not in another status matrix.

## Merge and revert

Squash merge into protected `main` only after required checks are green. Never weaken a test or bypass branch protection. Revert quickly when ownership or evidence breaks; after a second revert, redesign the slice. An implementation request is not authorization for an autonomous merge.

## API-only contributions and privileged work

[API-CAPABILITIES.md](./API-CAPABILITIES.md) distinguishes repository API operations, human-dispatch-only routes, and capabilities that require activation. [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) owns request schema, immutable inputs, bounded edits, isolated preparation, and publication recovery.

Use one request-only commit with refreshed head and original blob preconditions. Do not advance the branch while publication is pending. Read the durable receipt, then inspect all required CI on the exact published commit. A preview consumes only its request and reports the proposed transformation separately. Targeted validation cannot authorize merging.

Do not create temporary privileged workflows to work around a missing dispatch method. A PAT is not permission to execute candidate-owned scripts with write credentials. Workflow changes must be authored directly for review because request operations prohibit `.github/workflows/`. Reviewed runner changes need a reviewed immutable pin and live activation evidence; never point the pin at unreviewed code to bootstrap a demonstration.

**Format manually** remains the deliberate human-dispatch escape hatch for mechanical repair, not a behavior-change runner. Keep historical maintenance workflows until usage review and a validated replacement justify a separately confirmed retirement.

## Durable evidence

The trusted reporter retains `receipt.json` and bounded diagnostic chunks under `ci-logs/receipts/<kind>/<run-id>/<attempt>/`. For preview and validation, inspect `operation.json` and its listed diff chunks in the same evidence directory. These records belong to operations, not project status. Legacy runs may instead have `logs/<run-id>/`; read the actual deployed reporter before assuming which format exists.

Cite the original Actions run as primary evidence and the readable retained diagnostic when it explains a failure. Request application, confirmed publication, and CI success are separate facts. Recovery must reconcile retained commit identity rather than replaying uncertain work. Never use `ci-logs` as a development branch.

## Evidence case ids

A cited case id names exactly one test in the suite. Use a flat series per plan, never restart it per file. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` enforces uniqueness and refuses unregistered series-shaped titles. Plain descriptive test names need no new series.

A plan slice prefix containing a digit, such as `T4-3`, and architecture invariant `I-n` are not evidence-id series. An invariant may be cited by multiple tests. See issue #289.

## Status discipline

[SESSION-STATUS.md](./SESSION-STATUS.md) is the sole project-status owner. Rewrite the entry your slice makes stale rather than appending a parallel history. Its four sections remain **Now**, **Next in line**, **Open, and not scheduled**, and **Where the rest of it lives**; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and byte ceiling.

A standing rule belongs in [GUARDRAILS.md](./GUARDRAILS.md), caller cost in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md), and slice narrative and run ids in the PR or ADR. Do not create another completion matrix or handoff status database.
