# E4 — Add explicit pose-member render bindings

Status: not implemented. Depends on: A2, B6, D7.

## Start here

Read `00-overview.md`, `packages/core/src/adapters/dom.ts`, adapter public contracts reached from it, and existing target/filter/writer tests in `packages/core/test`. Inspect final poses output, not authored point records.

## Outcome and work

Extend target resolution with an explicit track/member/target binding descriptor, retaining scalar-frame binding as a separate supported case. Use a real internal binding union, `{ kind: "scalar"; track } | { kind: "member"; track; member }`, read by exhaustive switches.

Put everything that does not touch the DOM in one renderer-neutral binding module that both this adapter and G6's Three `Object3D` adapter use: binding identity, explicit member selection from `poses`, the competing-owner refusal and (with E5/E6) per-binding revision baselines and generation tokens. The DOM adapter keeps only element resolution, the renderable field filter, serialization and the writer. Place the module where the dependency rules allow both adapters to import it (ADR-105: adapters do not depend on domain); `@motion5/three` already imports `@motion5/core/internal`. Do not copy this logic into the Three adapter later. Member selection is explicit `poses[id]`; do not guess any nested record is renderable or add selector graph tracks per point.

Feed resolved tip frames into the existing renderable filtering, serialization, dirty-field diff, and writer. One owner performs writes for scalar and member bindings. Nested points, links, root frames, rotations, poses, and inspection are data, never arbitrary properties/styles. A scalar source frame still renders only its declared scalar fields.

Initially reject multiple bindings competing for the same transform fields on one target, including scalar-versus-member competition. Do not invent implicit transform multiplication or last-writer target ownership. Keep structured track/member/target identity separate from array positions and raw concatenated strings.

Bind to available members under the documented precommit/adapter-resolution lifecycle; missing/removed member transitions are explicit, not fallback to another member. No target operations are needed for skeleton derivation or solver evaluation. Adapter intent remains outside graph scheduling.

## Evidence and finish

Run adapter tests with synthetic final poses AND one real D7 pipeline: scalar rendering unchanged; explicit member resolves correct tip; absent member handled under policy; nested data filtered; competing target owners refused; special point IDs safe; same IDs in different pose tracks independent. Verify no graph vertex is created for a render binding.

Done when rendering ownership/selection is explicit while reusing the existing writer path, and binding identity, member selection and ownership live in the renderer-neutral module with no DOM import. Record actual adapter API/signature changes, tests/commands/results, and cleanup/revision work deferred to E5/E6. Next: E5.
