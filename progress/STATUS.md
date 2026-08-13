# Motion5 recovery status

This is the live recovery ledger. Plans and historical reviews are evidence, not current status.

Last reviewed: 2026-08-13

## Board

| ID | Slice | Status |
| --- | --- | --- |
| W0 | Rescue loop and audit baseline | Done |
| A1 | Final-value memo consistency | Done, gate open |
| A2 | Preserve subscriber errors | Done, gate open |
| A3 | Guard subscriber-triggered reentrancy | Done, gate open |
| B1 | Prepare-stage plugin contribution | Replaced by X-3 contract, audited |
| B2 | Real GSAP multi-stop compilation | Done, merged |
| C1 | React store resubscription | Done |
| C2 | React hook and public exports | Done, gate open |
| C3 | DOM metadata, serialization, and clear coverage | Done, audited |
| D1 | Discover consumer packages | Done |
| D2 | Planted boundary self-test | Done |
| D3 | Acceptance evidence gates | Done, gate open |
| E1 | Required declaration build | Done, gate open |
| E2 | Real end-to-end product path | Done |
| E3 | Mutation baseline and ratchet | Done, gate open |
| P0-1 | Clock and batch identity | Done |
| P0-2 | GSAP clock ownership | Done, merged |
| P0-3 | Absolute multi-property stop compilation | Done, merged |
| P0-3b | Authored-duration pinning | Done, merged |
| P0-4 | DOM transform rendering and removal | Done, audited |
| X-1 | Flat projected input observations | Done, merged |
| X-2 | Plugin metadata reaches DOM consumer | Done, audited |
| X-3 | Explicit per-key contribution contract | Done, merged and product-path verified |
| P1-5..P1-12 | Runtime and validation hardening | Done, merged |

## Verified X-2/X-3 evidence

- [PR #85](https://github.com/chahyasantoso/motion5/pull/85): explicit per-key contribution contract, deterministic collisions, malformed-output rejection, and separate tween-vars preparation.
- [PR #86](https://github.com/chahyasantoso/motion5/pull/86): `Engine.load()` product-path verification, proving invalid contributions fail before timeline creation.
- [PR #84](https://github.com/chahyasantoso/motion5/pull/84): shared paused GSAP percent-keyframe compiler and real multi-property timing coverage.
- `packages/core/src/adapters/dom.ts`: internal-key filtering, serializers, transform rendering, and omitted-key removal are wired at the consumer boundary.

## Remaining work

1. **Recovery audit:** rerun the full post-E3 review against the merged rescue head. Recheck every P0/P1/P2 finding and every governance gate; do not infer closure from filenames.
2. **Gate hardening:** close any evidence-only failures found by the audit, especially declaration consumer imports, acceptance execution evidence, failing-first truthfulness, mutation reporting, and branch-protection coverage.
3. **Rescue merge:** open rescue → main only after the audit is clean and all required checks are branch-protected.

No item is marked complete based solely on a green CI badge. The next implementation PR must cite an audit finding or a concrete gate gap.
