# ADR-008: Gates measure behavior, not prose

**Status:** Accepted, 2026-08-10

**Context.** Comment ratios, source-text greps, and non-shrinking file allowlists can be green while runtime wrong, and can block legitimate deletion.

**Decision.** Gates measure executable behavior, API shape, import boundaries, packaging, performance budgets, or mechanical formatting. They do not use comments or file counts as behavioral evidence.

**Consequences.** Review must explain architecture, tests prove behavior. Banned symbol scan may enforce boundary, cannot replace integration test.

**Amended, 2026-09-03 (issue #267).** Byte budget on source file belongs to allowed family above, not exception; amendment recorded here because context names non-shrinking file allowlist as one thing this record refuses. Neither hazard reaches read budget. It cannot be green while runtime wrong, because it makes no claim about runtime at all; cannot block legitimate deletion, because every deletion moves file way budget wants. What it measures is not proxy for correctness: toolchain precondition anchor-based edit already depends on → beside import boundaries and mechanical formatting rather than comment ratio. Measured evidence: `packages/core/src/runtime/project-runtime.ts` truncates on single contents read, so implementor with no local checkout can edit method by anchor without ever seeing invariant written earlier in same file.

**The warning about allowlists is kept rather than argued with, and answered with a ratchet rather than a date.** Waiver in `scripts/read-budget-scan.mjs` carries file's exact current size as ceiling it may not exceed → list can only shrink, and slice that splits file lowers number in same commit. Bare path with no ceiling is gate this record was right to refuse. Removal date written into first draft of that waiver then taken back out; reasoning worth keeping: date does not shrink file, fails build on morning nobody picked, satisfied by editing date → reports calendar rather than tree. What date guards against is waiver that stalls, and this record does not claim ratchet prevents that. It prevents file getting worse while it stalls, part check can honestly see; waiver deleted by commit that brings file under budget. Comment ratio stays refused outright, not what this measures: 43 percent of that file being comment is symptom, and percentage adopted as target is met by deleting whichever comments easiest rather than whichever redundant.
