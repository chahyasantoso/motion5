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
`contract/authored-leaf.ts`, and that module is its only import path. `engine.ts`, GSAP and the
tests all import `contract/keyframe-compiler` directly. A `domain/keyframe-compiler.ts` re-export
was first kept to spare those imports a rewrite and was deleted in the same PR: it was a second path
to one owner, and `LF-2` in `authored-leaf-reader.test.ts`, which requires every leaf read site to
reach the shared reader, correctly named the forwarding module as a site that never does. The read
site that test lists is now the contract compiler itself.
`RenderMetadata` and `OutputSerializer` live in `ports/render-metadata.ts`; `ResolvedPlugins`
extends that port interface, and adapters plus the internal entry use the same type. The domain
module no longer exports `RenderMetadata`, avoiding two declaration paths.

The existing authored-input interpolator port, fake, Track patch forwarding, and GSAP patch
comparison remain unchanged. The boundary scanner applies the broad `domain/` import rule equally
to `contract/`, `ports/`, and `adapters/`, with no special retired-sink rule. Adapters already import
contract modules, so ARCHITECTURE section 2 names that dependency explicitly.

## Evidence and remaining gate

The first publication, checkpoint `cp001`, left required CI red on exactly two tests and nothing
else: `LF-2` above, and a `boundary-scan.test.ts` case that still listed
`../domain/exhaustive-helpers` as clean. That specifier was a "longer name" beside the retired
`domain/exhaustive` sink under the old by-name rule; under the broad rule it is a domain submodule
and is refused, which the neighbouring case already asserts. The clean case now carries a longer
sibling directory, `../domain-helpers/exhaustive`, which is what the longer-name probe was for.
`typecheck` and `format:check` passed on that publication.

The four static scanners pass on the prepared tree. `exactOptionalPropertyTypes` fixes were
reconstructed from the supplied diff, and the new optional-field probes check omission at runtime
and exactness under TypeScript. The sandbox has no npm installation or network package installer,
so `tsc`, Vitest, and required CI are not claimed here. Publication and CI on the exact published
commit remain the merge gate.
