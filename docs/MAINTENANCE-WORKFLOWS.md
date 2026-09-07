# Maintenance workflows and retirement gates

Capability inventory and consolidation contract for issue #328, slice 5. No supported maintenance capability may disappear without evidence of a working replacement. This document owns capability distinctions and retirement prerequisites, not project status or an operation history. [SESSION-STATUS.md](./SESSION-STATUS.md) owns shipped state; the implementation PR owns reviewed snapshots, exact-SHA CI, and outstanding evidence.

The definitions below were inspected at main snapshot `d60892834fd8cfaab0974babbe5741949b50fa1f`; they are unchanged in the dependency fix PR #336. File contents establish behavior, not usage. The current implementation connection exposes repository and PR APIs, but not Actions dispatch, workflow-run history, repository variables, or branch-protection configuration. No run-history inventory or unused-workflow conclusion is implied. A lockfile or GSAP entry already existing is not retirement evidence.

## Route and trust boundaries

[API-CAPABILITIES.md](./API-CAPABILITIES.md) is the entry map. The [bounded request protocol](./AI-EDIT-WORKFLOW.md) supports apply, formatted preview, and targeted validation under its reviewed-runner gate. It does not execute npm installation, dependency maintenance, a codemod, or caller-supplied commands. An authored text patch is not a validated replacement for a generated lockfile or a migration workflow.

The historical workflows below are maintainer-dispatch routes. Inspect and select the intended same-repository branch explicitly; do not accept a main or historical branch default without review. Their presence is not a claim of current token scope, branch-protection permissions, safe dispatch on arbitrary code, or successful recent runs. They execute on the checked-out branch and do not inherit the isolated candidate/publisher guarantees merely because the newer AI-edit workflow exists.

A replacement must isolate uncredentialed computation from credentialed publication, use reviewed tools/configuration, validate inputs as data, bound outputs, preserve failure evidence, and prove CI on the exact generated head. Existing secrets do not authorize new operations. No temporary privileged automation is an acceptable workaround for a missing dispatch method.

## Lockfile bootstrap

Owner: [bootstrap-lockfile.yml](../.github/workflows/bootstrap-lockfile.yml), named **Bootstrap lockfile (manual)**.

- Capability: generate `package-lock.json` using Node 24 and npm. The comment describes a once-only absent-lockfile use, but no guard restricts execution to an absent file; an existing lockfile can also be regenerated.
- Inputs and output: a branch string, defaulting to `main`; the commit stages only `package-lock.json`. The existing branch manifests determine resolution.
- Verification: `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`, a nonempty-lockfile check, then `npm ci --ignore-scripts --no-audit --no-fund --dry-run`. The dry run is not the repository test suite or a full installation result. An unchanged staged lockfile exits without a commit.
- Publication: a normal push using the checkout's default token, in the same job as generation. It does not itself demonstrate follow-on required CI. Concurrent dispatches on a branch use cancel-in-progress.
- Supported route while replacement is unverified: reviewed maintainer dispatch, with explicit target branch and independently inspected generated-head checks. There is no activated request-protocol lockfile generator.
- Replacement prerequisite: an allowlisted bootstrap operation must work from an absent lockfile as well as handle existing/no-op cases, use immutable manifest inputs and a reviewed Node/npm toolchain, suppress lifecycle scripts, permit only the intended lockfile output, and independently validate publication. Its live evidence must show a usable generated lockfile and fresh full CI.
- Retirement prerequisite: review actual consumers and run history, validate that replacement including absent-lockfile behavior, then obtain separate confirmation to remove this workflow. A checked-in lockfile alone proves none of these.

## GSAP dependency and lockfile maintenance

Owner: [prepare-gsap-lockfile.yml](../.github/workflows/prepare-gsap-lockfile.yml), named **Prepare GSAP lockfile**.

- Capability: update the root `devDependencies.gsap` entry to an exact requested version and regenerate its lockfile. This is not the same output contract as bootstrap.
- Inputs: branch defaults to the historical `fix/B2-gsap-stop-compilation-repair`; `gsap_version` defaults to `3.15.0`. These are defaults, not proof that the branch exists or that usage ended. The version is a free-form workflow string even though its label says exact.
- Verification and outputs: Node 24 runs package-lock-only installation with `--ignore-scripts`, `--save-dev`, and `--save-exact`; checks compare manifest and resolved lockfile GSAP versions. Only `package.json` and `package-lock.json` are staged. No-change exits without publication. This does not run full required PR CI.
- Trust limitation: the version reaches a quoted npm argument through the environment, but the verification commands also interpolate it directly into JavaScript source. A replacement must validate an exact allowlisted version as data, not copy that interpolation. This is a source-review finding, not a reproduced exploit or a claim that the historical route was hardened here.
- Publication and supported route: the existing maintainer dispatch pushes with the checkout's default token. Review inputs, branch code, resulting manifests, and generated-head checks. The request protocol deliberately refuses dependency maintenance; a PAT does not change that.
- Replacement prerequisite: an independently reviewed dependency operation with bounded allowlisted package names and exact versions, immutable manifest/lockfile preconditions, disabled lifecycle scripts, an exact manifest-plus-lockfile output allow-list, isolated preparation, race-safe publication, no-op/refusal coverage, and confirmed follow-on CI. It must preserve GSAP's exact dev-dependency semantics, not merely generate some lockfile.
- Retirement prerequisite: usage review and live replacement evidence for an actual version update and a no-op, plus separate deletion confirmation. An existing GSAP version in `package.json` is not proof of replacement or disuse.

## Authored-leaf migration

Owners: [migrate-authored-leaf.yml](../.github/workflows/migrate-authored-leaf.yml), named **Migrate authored leaf**, and [migrate-authored-leaf.mjs](../scripts/migrate-authored-leaf.mjs), which owns the AST transform.

- Capability: replace single-property authored `stops` wrappers, optionally make eligible two-stop `hold` helpers static, and optionally repair authored path strings/member access. Type literals are not expression wrappers. Ambiguous or semantic-review cases are reported rather than treated as automatically equivalent.
- Scope: TypeScript/TSX under `packages` and `apps`, with generated/vendor/oracle directories excluded and the refusal integration fixture explicitly skipped. A replacement must preserve these exclusions and the human-review signals, not just count changed files.
- Inputs: `mode` is `report`, `direct-commit`, or `pull-request`, defaulting to report. `hold`, `paths`, and `run_checks` default to true. The selected workflow ref is the source branch; this route has no separate branch input.
- Report mode: emit the proposed transformation report without writing target files. It is a real capability, not equivalent to committing a codemod and reverting it.
- Write modes: execute the codemod with `--write`, run repository-wide formatting, and publish either onto the selected branch or onto a generated branch with a PR back to the selected ref. These modes stage `git add -A`; their output boundary is broader than the bounded API editor.
- Evidence and verification: the report is written to the job summary; report/typecheck/test logs are offered in an artifact with 30-day retention. The wrapper check is reported, not enforced as a failing workflow step. Optional typecheck and suite execution require detected drift and explicitly record exit codes without gating publication. A green migration workflow therefore does not imply a green suite or merge eligibility.
- Supported route: reviewed maintainer dispatch remains available; the script also documents local report, `--write`, and `--check` invocations for a contributor with the repository toolchain. This API-only connection cannot execute those local commands or dispatch the workflow. A future dependency operation cannot replace this codemod.
- Replacement prerequisite: preserve all three delivery modes, option semantics, transforms, exclusions, reports, no-op behavior, and truthful non-gating diagnostics. A reviewed isolated codemod route needs bounded paths/outputs, independent publication checks, retained readable evidence, semantic-review fixtures, and fresh required CI on the generated head. Code or test execution must never inherit publication credentials.
- Retirement prerequisite: confirm migration consumers and historical/ongoing branch needs, validate replacement report/commit/PR behavior, and obtain separately confirmed removal. A clean wrapper scan alone does not retire the delivery modes or prove they are unused.

## Manual formatting remains an escape hatch

Owner: [format.yml](../.github/workflows/format.yml), named **Format manually**; [FORMATTING.md](./FORMATTING.md) owns operational guidance.

It accepts an explicit same-repository branch, installs locked dependencies with lifecycle scripts disabled, runs repository-wide `npm run format`, and commits/pushes drift using the PAT-backed checkout. An already-formatted tree produces no commit. Its default branch is main; select the contributor branch deliberately. It is dispatch-only, not an automatic post-CI repair.

Bounded AI edits normalize only requested files, and targeted validation writes nothing. Neither is a drop-in replacement for this repository-wide mechanical repair route. Keep manual formatting as a deliberate escape hatch, with unrelated formatting separate from behavior changes. The historical workflow's token-bearing checkout and branch-controlled formatting command are not the new isolated runner boundary; review the branch and inspect fresh exact-head CI.

Recovery audit is also distinct from these maintenance routes. [CI-WORKFLOW.md](./CI-WORKFLOW.md) owns its separate mutation/acceptance evidence and ordinary CI requirements; consolidation does not remove those assertions.

## Evidence required before retirement

Retirement is a later, separately confirmed change, not a consequence of finishing this inventory. The maintainer and replacement implementor must supply:

1. A dated usage review for each named workflow: an explicitly agreed review window, complete accessible runs/attempts and branches, external/manual consumers, and a responsible maintainer's decision. Record missing or expired history rather than treating an empty response as proof of no use.
2. A capability-by-capability replacement comparison with linked immutable source and regression evidence. Cover unique input semantics, outputs, no-op/refusal behavior, failure reporting, and delivery modes listed above. No replacement may depend on arbitrary request commands or weaken assertions to appear equivalent.
3. Reviewed activation and live operation evidence: source/request/generated SHAs, run and attempt, exact changed paths, retained standalone evidence, and successful required CI on the generated head. A default-token push or created PR is not sufficient proof that another workflow ran.
4. Security and settings review: isolated computation/publication, bounded package/version or codemod inputs, disabled lifecycle scripts where relevant, output allow-lists, token scope, branch protections, and race/refusal/recovery behavior. Keep secrets out of source and evidence.
5. A dedicated retirement PR naming exact workflow paths, consumers migrated, evidence links, documentation replacements, and a rollback route, followed by explicit confirmation before deletion. Preserve manual formatting unless a separately reviewed decision changes that deliberate escape hatch.

When run history, usage, replacement parity, or activation cannot be verified, keep the workflow. Inventory and documentation can be complete while retirement remains pending. Issue #328 stays open for any unmet acceptance criteria; this inventory does not close its live refusal/recovery work, activate dependency maintenance, or deploy the cleanup reporter fix.
