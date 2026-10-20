# A3 — Specify total numeric, solver and exact cache behavior

Status: implemented on branch `feat/plugin-structural-api`. Depends on: A1.

Evidence: `packages/core/src/contract/numerics.ts`, `packages/core/test/contract/numerics.test.ts`.

## Start here

Read `00-overview.md`, `cache-contract.md`, A1's contract, `packages/plugins/src/frame.ts`, `packages/plugins/src/fk.ts`, `packages/plugins/src/ik-member.ts`, `packages/plugins/src/ik-goal.ts`, `packages/plugins/src/ik-solve.ts`, and their numerical policy helpers. Inspect focused plugin tests, not legacy graph behavior as authority.

## Outcome and work

Pin exact reader/default/clamp rules: missing versus explicit zero versus malformed/non-finite. Offsets/rotation/length default zero, extent is nonnegative, blend weight defaults one and clamps [0,1]. Preserve degree units, shortest-arc blending, exact endpoints and the source helper's deterministic half-turn tie. Record that tie from source with a concrete example.

Specify pivot-then-extension in the rotated parent frame. External root comes from the completed skeleton source; compose its first point once to anchor IK's tip. The first point is authored/unsolved. Solved angles are LOCAL. Missing custom-solve members use authored values; foreign/non-finite rotations refuse at capability/publication boundaries.

Pin range/influence/paired-limit policies, dynamic inverted ranges, zero lengths, flip/bend, convergence tolerances, iteration caps, unreachable/coupled goals and opt-in inspection. Keep leaf goal influence distinct from FK blend weight and shape rejection distinct from runtime normalization. Retain deliberate total readers; do not choose radians or fallback goals silently.

Define a supported finite magnitude/range and deterministic overflow refusal. Finite inputs do not ensure finite arithmetic. No accepted frame, request/result or stored numeric cache field contains NaN/Infinity. Shared normalization builds the same immutable effective values used by key comparison and math, not a parallel cache-specific reader.

Pin exact in-memory scalar and frame equality to Object.is: +0 and -0 remain distinct, and arithmetic results are not rounded/canonicalized for caching. Apply the same equality to FK result interning and provider key tests. Serialization limitations must be documented without using serialized equality for caches. Epsilon belongs in justified independent numerical assertions, never in cache hit decisions.

Specify deterministic IK seed semantics. Audit which request fields retained strategies consume; complete canonical requests include actual root/member/goal/constraint/influence/options/seed inputs. A fixed policy is protected by solver-generation identity. Previous cached solutions are not new seeds. Cache complete validated result data and project inspection afterward; if diagnostics are conditional, that computation flag remains part of the request until full-result caching is available.

## Evidence and finish

Add hand-calculated zero/90-degree, translated/rotated root, nonzero pivot, zero/negative length, missing solve, weight endpoint and half-turn cases. Include +0/-0 exact-key and recomposed-frame cases; deliberate overflow cases; off/on inspection; cold/warm/direct/reverse-seek solve equivalence. State justified trig/iterative tolerances separately from identical-operation exact equality.

Done when D1/D4/D5 can implement without inventing numerical/cache policies. Run relevant existing math tests if available and report actual commands/results; this contract review does not establish new runtime implementation. Next: A4.
