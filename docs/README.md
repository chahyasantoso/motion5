# motion5 documentation

This directory is the project's canonical working contract. It separates **what the code does now** from plans and historical recovery notes.

## Start here

1. [SESSION-STATUS.md](./SESSION-STATUS.md): the current implementation state and CI evidence.
2. [PUBLIC-API.md](./PUBLIC-API.md): the simple consumer guide for `@motion5/core`.
3. [ARCHITECTURE.md](./ARCHITECTURE.md): the current ownership model, graph lifecycle, mutation transactions, and boundaries.
4. [DECISIONS.md](./DECISIONS.md): accepted tradeoffs and decisions that should not be accidentally reversed.

## Current reality

W1 through W5 of the runtime mutation remediation are implemented. W5 is ready for review in [PR #113](https://github.com/chahyasantoso/motion5/pull/113), with all seven CI checks green in [run 31989827456](https://github.com/chahyasantoso/motion5/actions/runs/31989827456).

The current runtime supports one unified Track store for authored and runtime content, runtime Motion lifecycle, capability-based Track mutation, non-destructive Track replacement, observation editing, and dependant queries. Scroll/time trigger drivers remain separate work; core currently uses the manual trigger path.

## Product and authored contracts

- [PRD.md](./PRD.md): why and what motion5 should do.
- [TRD.md](./TRD.md): normative technical requirements and verification.
- [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md): schema v5 syntax, field semantics, ids, observations, diagnostics, and validation.
- [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md): explicit v4-to-v5 migration.

## Delivery and evidence

- [IMPLEMENTATION-PLAN-runtime-mutation-model.md](./IMPLEMENTATION-PLAN-runtime-mutation-model.md): executable W1-W5 implementation plan.
- [TESTING-STRATEGY.md](./TESTING-STRATEGY.md): test tiers and evidence rules.
- [CI-WORKFLOW.md](./CI-WORKFLOW.md): workflow jobs, artifacts, and gates.
- [PR-WORKFLOW.md](./PR-WORKFLOW.md): branch, commit, PR, review, and merge rules.
- [FORMATTING.md](./FORMATTING.md): formatting commands and workflow.

## Historical recovery references

The Phase 3-4 recovery documents explain repository lineage and earlier restoration work. They are historical context, not the current status:

- [PHASE-3-4-CONSOLIDATED-AUDIT.md](./PHASE-3-4-CONSOLIDATED-AUDIT.md)
- [PHASE-3-4-RECOVERY-PLAN.md](./PHASE-3-4-RECOVERY-PLAN.md)
- [IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md](./IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md)

## How the documents fit together

- **PRD:** why and what.
- **TRD:** what correct means in testable terms.
- **ARCHITECTURE:** who owns what and how the system works.
- **PUBLIC-API:** what consumers may call.
- **IMPLEMENTATION-PLAN:** the execution sequence.
- **SESSION-STATUS:** what is true today.
- **DECISIONS:** what not to re-litigate.

## Documentation rules

1. Reality belongs in `SESSION-STATUS.md`, and canonical current architecture/API docs must agree with it.
2. Intent documents must label themselves as intent when code does not exist yet.
3. Every new public behavior needs schema/type/API documentation and tests in the same change.
4. A decision reversal updates or supersedes the original record; contradictory active records are not left behind.
5. Delete documents that describe deleted code in the same change that deletes the code.
6. Do not copy documentation, tests, fixtures, or examples from the predecessor repository.
