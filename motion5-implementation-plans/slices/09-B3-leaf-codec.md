# B3 — Implement the private entry/leaf codec

Status: not implemented. Depends on: B2, A2.

## Start here

Read `00-overview.md`, the compiled B2 plan, `packages/core/src/contract/keyframe-compiler.ts`, `packages/core/src/domain/track.ts`, `packages/core/src/adapters/interpolator/gsap.ts`, and the relevant percent-map/static-value helpers they use.

## Outcome and work

Create one pure collision-free encoder/reverse index for `(compiled entry identity, leaf path)`. All entries use the same identity scheme: there is NO s/c singleton tag split. If retaining the flat interpolation port, opaque internal property keys are sufficient; the public API never parses them. Validate delimiter policy once at authoring/admission boundaries; do not scatter split/concatenation logic.

Route authored scalar/stop leaves, percent maps, contributed internal leaves, live overlays, and recompile reconstruction through the same address owner. Static leaves stay static, not fabricated two-stop holds. Decode evaluated values into one local bag per entry before collect/fold. Preserve missing versus zero and same-named leaves on different entries.

Retain one track timeline/progress. No entry-local graph vertices or independent timelines. Keep addresses private from diagnostics intended for authors, public values, serializer metadata, adapters, and public writes. Diagnostics report authored entry/path instead.

On recompilation, replace the codec/index with its matching timeline/static store atomically. A stale index must not decode a new generation's backing object. Handles and overlays use the compiled address plan, not an array offset or handwritten encoded string.

## Evidence and finish

Run codec round-trip/injectivity generated tests over allowed IDs/leaves, adversarial tuple pairs, equal entry/leaf/plugin strings, prototype-looking names, and rejected delimiters. Test two independent rotation/x leaves, static zero, percent maps, contributed keys, and a recompile after reorder/removal. Assert no opaque keys escape a synthetic public result.

Done when every property path has one codec and arbitrary valid entry combinations cannot alias. Record actual source/test paths and command results; leave operation execution to B6. Next: B4.
