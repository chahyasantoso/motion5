# Archived documentation

Everything in this directory described work that has landed, been reverted, or been superseded. It is kept because the reasoning behind a decision outlives the plan that produced it, and deleting an audit only makes a later reader re-derive it.

Nothing here is authoritative. Three rules, and they are absolute:

1. `../SESSION-STATUS.md` is the only document allowed to claim what has landed. If a document here disagrees with it, the document here is history and the status file is right.
2. Do not update these documents. A record worth correcting is worth promoting back out of the archive with its correction recorded live.
3. Do not cite one as the current contract in a pull request. Cite the live plan, the live ADR, or the status file.

Consumers want `../guide/README.md` instead. Nothing here is written for someone using motion5.

## What is here

**Recovery-era audits and reviews.** The Phase 3/4 consolidated audit and recovery plan, both phase implementation reviews, the dynamic graph audit and its status note, the P2 runtime smell audit, the post-E3 code review and its status note, and the stuck-elbow teardown bug analysis. These drove the work that restored the value pipeline.

**Completed implementation plans.** The runtime mutation model (W1-W5), motion track resolution (option C), the trigger drivers (T0-T5), and the T4/T5 trigger parity plan, each with its corrections document where one exists. Their decisions now live in the numbered ADRs and their status lives in the status file.

**Feasibility studies and briefs.** The attached-article feasibility study and its implementation brief, the trigger-article feasibility assessment, the motionpath-to-motion5 implementor brief, the walker demo plan, the trigger-driver exploration, and the custom IncrementalGraphBuilder note.

**Slice acceptance notes.** `S3` through `S6`, and everything under `progress/`. These were the per-slice handoff notes that predate one-status-file discipline, and they are the clearest illustration of why that rule exists: twenty-four files, several disagreeing about the same slice.

**Root leftovers.** `WAVE-PLAN.md`, `RECOVERY.md`, and `format-workflow-fix.patch`, an already-applied patch kept only as a record of the fix.

## What deliberately stayed live

The product and technical contracts (`PRD.md`, `TRD.md`, `ARCHITECTURE.md`, `AUTHORED-SCHEMA.md`, `MIGRATION-V4-TO-V5.md`), every decision record (`DECISIONS.md` and the numbered `ADR-*.md` files), the master `IMPLEMENTATION-PLAN.md` and the current `PHASE5-DETAILED-PLAN.md`, the process documents (`PR-WORKFLOW.md`, `CI-WORKFLOW.md`, `FORMATTING.md`, `TESTING-STRATEGY.md`), `BENCH-PHASE5.md` because Phase 5 is current, the guide, and the status file.

`acceptance-map.json` also stays where it is. `scripts/acceptance-scan.mjs` resolves `docs/acceptance-map.json` by path, so moving it breaks the acceptance gate.

## How this directory was formed

One mechanical commit of `git mv` renames plus this index. No document content was edited in the move, so `git log --follow` still reaches the full history of every file here.
