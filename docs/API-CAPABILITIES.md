# API-only capability map

This is navigation and an activation contract, not a second status file. [SESSION-STATUS.md](./SESSION-STATUS.md) owns shipped state. The implementation PR owns exact-SHA results and outstanding live exercises. Read the actual immutable runner revision before using an operation.

## Supported through repository APIs

- Read complete files at an immutable SHA, create a branch, submit one request-only commit, open a PR, and read checks and comments. Availability is connection-specific; a missing Actions dispatch method is not a GitHub limitation.
- Apply a bounded edit through `.ai/edits/`: [request contract](./AI-EDIT-WORKFLOW.md), [low-level edit validator](../scripts/apply-ai-edit.mjs), [publication owner](../scripts/automation-publish.mjs), [adapter tests](../packages/core/test/unit/scripts/automation-adapters.test.ts). Requires the trusted runner pin, default-branch reporter, and publication credential.
- Inspect durable receipts and chunked diagnostics on `ci-logs`, keyed by run and attempt. [Reporter](../scripts/automation-report.mjs) owns verified destinations; [recovery tests](../packages/core/test/unit/scripts/automation-recovery.test.ts) cover interrupted reporting without replaying an edit.

## Operations requiring the slice 4 runner to be reviewed and activated

- `operation: "preview"`: same edits and blob preconditions as apply; format in the uncredentialed candidate job, retain a bounded final diff, byte measurements, planned creates/deletes, and applicable checks. Publish only request cleanup, never the proposed target files. `dry_run: true` maps to this operation after activation. An older pin still has the older dry-run contract.
- `operation: "validate"`: name 1 through 50 existing paths and `checks` from `format` and `read-budget`. No edits or caller-provided command strings. The result names the exact source SHA. These are targeted checks, not the full suite, full repository scans, or merge authorization.
- [Operation owner](../scripts/automation-operation.mjs), [preview regression](../packages/core/test/unit/scripts/automation-operation.test.ts), and [operation safety tests](../packages/core/test/unit/scripts/automation-operation-policy.test.ts) own this behavior. The publisher revalidates the schema, identities, complete measurements, and allowed output paths.

A passed implementation PR does not change `MOTION5_AUTOMATION_SHA`. After review and rollout, a maintainer must pin the reviewed immutable revision and exercise preview, validation, request cleanup, retained evidence, and follow-on CI. Never move the pin to unreviewed candidate code merely to demonstrate activation.

## Human-dispatch-only through the current connection

- **Format manually**, [format.yml](../.github/workflows/format.yml), is the deliberate mechanical repair escape hatch. [FORMATTING.md](./FORMATTING.md) owns its use.
- **Recovery audit**, [recovery-audit.yml](../.github/workflows/recovery-audit.yml), owns its additional mutation and acceptance evidence.
- Reporter recovery dispatch requires an exact run and attempt. Repository variables, token scope, branch protection, and dispatch are maintainer actions when the connection does not expose them. Never paste the PAT into a request or comment.

## Maintenance not activated

Dependency and general maintenance operations are refused, including when a PAT is configured. There is no arbitrary shell, npm argument, plugin, workflow-generation, or package-install request. The historical bootstrap-lockfile, GSAP maintenance, and authored-leaf migration routes are not retired by this slice; slice 5 must inventory their unique behavior and replacement evidence first.

A future dependency operation needs a reviewed schema with bounded allowlisted package names and exact versions, lifecycle scripts disabled, immutable manifest inputs, an exact manifest-plus-lockfile output allow-list, isolated preparation, independent publication validation, and confirmed CI on the generated commit. The trusted-runner activation gate and live evidence must both be satisfied before that operation can be enabled. A secret existing is not that evidence.

## Short round trip

1. Read a complete snapshot and source blob SHAs. Check this map against the pinned runner.
2. On an open same-repository PR, submit one request-only commit. Do not advance the branch while publication is pending.
3. Read `operation.json` and all listed diff chunks for a preview, or per-path check results for validation. Redacted diff bytes are explicitly labeled; do not apply retained redacted text as a patch.
4. Read the cleanup receipt. Refresh the head and blob preconditions, then submit a separate apply request if the preview is acceptable.
5. Read the exact published commit receipt and all required PR CI on that commit. Keep implementation, CI verification, merge, and activation as four separate facts.
