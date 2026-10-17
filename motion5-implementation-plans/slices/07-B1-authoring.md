# B1 — Replace the authoring schema and admit operations

Status: not implemented. Depends on: A1, A2, A6.

## Start here

Read `00-overview.md`, prerequisite contract artifacts, `packages/core/src/contract/v5.ts`, `packages/core/src/contract/keyframe-shape.ts`, `packages/core/src/contract/validate-v5.ts`, `packages/core/src/domain/plugin-admission.ts`, `packages/core/src/domain/plugins.ts`, and `packages/plugins/src/loader.ts`.

## Outcome and work

Implement ONE parser for `keyframes: [{entryId:{plugin,values?,requires?}}]`. Preserve authored array order and diagnostic paths containing both current index and stable ID. Every entry is identified; remove singleton/collectable authoring modes. Empty/omitted values permit dependency-only operations. Generic empty tracks are legal, but sparse arrays and zero/multi-own-key maps are not.

Validate unknown input as unknown. The shape reader owns container/section/leaf/binding syntax without importing concrete plugins. Registry resolution separately rejects unknown definitions, unsupported leaves/slots, invalid plugin config, and declared requiredness/cardinality. Do not cast unvalidated JSON into trusted records. Distinguish schema, registration, and binding diagnostics.

Admit valid collect-only, fold-only, and both-operation definitions; reject neither, malformed descriptors/callbacks, invalid outputs, and duplicate descriptor keys. Remove admission dependence on compose/stage/priority/top-level outputs; preserve entry-local contributor validation. Audit legacy inputs/input-owner metadata for a legitimate retained owner. Loader demand discovery deduplicates definitions while preserving every instance.

Reject object-form groups AND flat `{plugin,id}` array entries clearly; do not normalize them. Enforce all-ID track uniqueness and codec delimiter rules. Requirement dict detection/validation is generic, not tied to the word targets.

## Evidence and finish

Run focused parser/admission/loader tests and typecheck changed public types. Cases: repeated transform/point names; duplicate outer IDs; inner id; unknown plugin/section/leaf/slot; malformed own-key map; dependency-only root/FK; both operations; missing required scalar/dict; prototype-looking permitted names; retired syntax refusal. Loader loads one definition for three entries.

Done when a single trusted ordered entry representation exits this boundary. Repository-wide cutover may remain incomplete; record actual commands/failures and changed public exports, never add compatibility to mask them. Next: B2.
