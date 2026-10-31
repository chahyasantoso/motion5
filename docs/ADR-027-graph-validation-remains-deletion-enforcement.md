# ADR-027: Graph validation remains deletion enforcement

**Status:** Accepted, 2026-08-17

**Decision.** `dependantsOf` read-only query over committed GraphIR for editor preflight. Never replaces candidate graph validation, sole enforcement rejecting source deletion with live dependants. No cascade deletion.
