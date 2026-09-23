# ADR-105: Adapters consume the authored contract, not domain

**Status:** Proposed in PR #480, 2026-09-23. Closes #474 when merged.

## Invariant

No adapter imports a domain module. The authored-leaf contract owns one keyframe compiler;
domain-side diagnostics and GSAP consume the same implementation. The interpolator port still
receives authored leaves, and patch overlays keep their existing rebase semantics.

## Measurement and decision

Three imports crossed the boundary: GSAP called `domain/keyframe-compiler`, while DOM and the
adapter barrel imported `RenderMetadata` from `domain/plugins`. The initial prepared design
introduced a compiled-keyframes port and made Track compile candidate records. It was withdrawn:
the fake and direct interpolator clients accept authored leaves, and pushing compiler output through
the port would change that contract and its tests.

The compiler now lives in `contract/keyframe-compiler.ts` beside its leaf-shape owner,
`contract/authored-leaf.ts`. `domain/keyframe-compiler.ts` re-exports it to preserve imports for
domain readers and tests without duplicating compilation. GSAP imports the contract implementation
directly. `RenderMetadata` and `OutputSerializer` live in `ports/render-metadata.ts`; `ResolvedPlugins`
extends that port interface, and adapters plus the internal entry use the same type. The domain
module no longer exports `RenderMetadata`, avoiding two declaration paths.

The existing authored-input interpolator port, fake, Track patch forwarding, and GSAP patch
comparison remain unchanged. The boundary scanner applies the broad `domain/` import rule equally
to `contract/`, `ports/`, and `adapters/`, with no special retired-sink rule. Adapters already import
contract modules, so ARCHITECTURE section 2 names that dependency explicitly.

## Evidence and remaining gate

The four static scanners pass on the prepared tree. `exactOptionalPropertyTypes` fixes were
reconstructed from the supplied diff, and the new optional-field probes check omission at runtime
and exactness under TypeScript. The sandbox has no npm installation or network package installer,
so `tsc`, Vitest, and required CI are not claimed here. Publication and CI on the exact published
commit remain the merge gate.
