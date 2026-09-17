# ADR-027: Graph validation remains deletion enforcement

**Status:** Accepted, 2026-08-17

**Decision.** `dependantsOf` is a read-only query over committed GraphIR for editor preflight. It never replaces candidate graph validation, which remains the sole enforcement for rejecting source deletion with live dependants. No cascade deletion.
