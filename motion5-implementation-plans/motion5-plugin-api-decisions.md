# Motion5 — Plugin API decisions (collect / derive / validate / CapabilityMap)

- **Baseline:** `motion5-feat-skeldata-v5-phase-c` snapshot (C1 and C2 done), plan pack `motion5-implementation-plans`.
- **Scope:** the five requested changes, plus three follow-on decisions they force (D6–D8).
- **Status:** these are design decisions only. No repo code was changed. The type-level claims marked **\[verified\]** were checked in a scratch TypeScript **5.8.3** project, the same version the repo pins. The repo's own build and tests were not run.

---

## Summary

| \#  | Decision                                                                                                                                                                                                                                                                                                               | Main reason                                                                                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | `collect` has no label. It is a function on stateless plugins and the literal claim `true` on factory-backed plugins. Records are always published under the reserved output `COLLECT_OUTPUT = "collect"`.                                                                                                             | A fixed name removes routing configuration. The plugin-definition union keeps the "exactly one execution owner" rule enforced at compile time.                                                                                                 |
| D2  | `derive?: (ctx: DeriveContext) => DeriveResult`. `DeriveResult` is a three-way union: `derived` (carrying `capability` + `payload`), `refused`, and `none`. Core switches on it exhaustively. A plugin produces at most one payload per track, and a source holds at most one payload per capability.                  | Once `capabilities[]` is gone, the capability name has to travel with the payload. The mapped union ties the name and payload type together. One payload per source makes reads unambiguous.                                                   |
| D3  | The hook is named `validate` (not `verify`): `validate?: (ctx: RequirementContext) => readonly Diagnostic[]`. It sees only sources bound through the plugin's own capability slots. Run order: capability presence → `validate` → `derive`.                                                                            | Matches your example and the repo's vocabulary (`validateKeyframes`, `validate-v5`). It is the narrowest useful context. A plugin with only `validate` (IK, FK) works without a dummy `derive`.                                                |
| D4  | Delete `PluginDefinition.capabilities?: string[]` and its admission check. Drop the unrelated `PluginCapability`/`PluginCapabilities` re-export from `plugin-api.ts` now.                                                                                                                                              | The field was dead (derivation never read it). The old ADR-136 names would be confused with `CapabilityMap`.                                                                                                                                   |
| D5  | `CapabilityMap` is declared in `core/src/contract/capability.ts` and **re-exported** from `plugin-api.ts`. `chain-layout.ts` adds `chain: ChainPayload` with `declare module "@motion5/core/plugin-api"`. `ctx.read<K>(name, source): CapabilityMap[K]`. Core works on an erased view and widens in exactly one place. | Augmenting through a re-export works **\[verified\]**. This keeps `plugin-api.ts` re-export-only (ADR-133) and avoids a domain → facade import cycle.                                                                                          |
| D6  | `PluginRequirement.capability?: CapabilityName`. A slot's capability declaration is both the presence check and the read permission.                                                                                                                                                                                   | One declaration drives both checks (DRY). `read` cannot fail for a well-formed plugin.                                                                                                                                                         |
| D7  | Remove `capability: "frame"` from `root`. Frame stays a runtime value contract (`readFrame` / C5).                                                                                                                                                                                                                     | No plugin derives `frame`, so the current check should refuse every root bound to a transform track. That was found by reading the code; it was not run. With only `chain` in the map, the line no longer compiles, which is the right result. |
| D8  | `root.derive` is deleted. Root composition (count, policy) belongs to the plugin that derives the source's layout, through one shared helper `readRootPolicy(inventory)`.                                                                                                                                              | Fixes the double-reported duplicate root. C3 reuses the same helper.                                                                                                                                                                           |

---

## D1 — `collect` with no label

### Decision

`collect` has no label. Records go to the reserved output `COLLECT_OUTPUT = "collect"`, and a fold output may not use that name. `collect` and `fold` are always functions on the definition. A plugin is stateful when it declares `init` (initial state) and `prepare` (shared work, returns the next state). State is staged and committed atomically exactly as before.

```ts
export interface StatefulPluginDefinition<S = unknown, P = unknown> extends PluginDefinitionBase {
  readonly init: (ctx: EvaluatorContext, services: EvaluatorServices) => S;
  readonly prepare: (
    entry: LocalEvaluation,
    state: S,
    services: EvaluatorServices,
  ) => { readonly prepared: P; readonly state: S };
  readonly dispose?: (state: S) => void;
  readonly collect?: (prepared: P, ctx: LocalEvaluationContext) => CollectRecord;
  readonly fold?: StatefulFold<P, S>;
}
```

- Admission owns the shape checks: `init` requires `prepare`; `prepare` or `dispose` without `init` is refused; `collect` and `fold.run` must be functions; `createEvaluator` is refused.
- Core derives one `ExecutionStrategy` union with kinds `stateless` and `stateful`, read exhaustively with `unreachable`.
- `init` runs once per entry instance when no committed state exists; `prepare`, `collect` and `fold.run` run at most once per evaluation.
- The earlier factory-claims text (`createEvaluator`, `collect: true`) is superseded.

---

## D2 — `derive` returns `DeriveResult`

### Decision

```ts
// core/src/contract/derivation.ts  (generic, no knowledge of the map)
export type DeriveResultOf<M> =
  | {
      readonly [K in keyof M]: {
        readonly status: "derived";
        readonly capability: K;
        readonly payload: M[K];
      };
    }[keyof M]
  | { readonly status: "refused"; readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]] }
  | { readonly status: "none" };

/** Core's erased runtime view. */
export type ErasedDeriveResult = DeriveResultOf<Record<string, unknown>>;

// Bound alias in the same contract module (imports CapabilityMap from ./capability);
// re-exported through plugin-api.ts. Core logic itself only uses the erased view.
export type DeriveResult = DeriveResultOf<CapabilityMap>;
```

Core settles every result in one exhaustive switch:

```ts
const erase = (result: DeriveResult): ErasedDeriveResult => result; // the only widening point

function settle(result: ErasedDeriveResult, track: TrackSettlement): void {
  switch (result.status) {
    case "derived":
      if (!isCapabilityToken(result.capability)) return track.fail("composition-failure");
      if (track.produced.has(result.capability))
        return track.fail("derivation-ambiguous-capability");
      track.produced.set(result.capability, deepFreeze(result.payload));
      return;
    case "refused":
      track.refuse(result.diagnostics);
      return;
    case "none":
      return;
    default:
      return unreachable(result); // a malformed result from a JS plugin throws → derivation-failure
  }
}
```

### Rules

1. **One payload per plugin per track.** No arrays, single descriptors, or `{descriptors, diagnostics}` bags.
2. **One payload per capability per source.** A second producer of the same capability on a track is refused at the producer (`derivation-ambiguous-capability`), not discovered later by a reader.
3. **`refused` always refuses the candidate.** The status decides, not diagnostic severity. Downstream plugins then report `derivation-missing-capability` for their bindings to that source.
4. **No warnings on success** (`derived` has no diagnostics). Nothing needs it today, and it can be added later as an optional field without breaking anything.
5. The internal store becomes `Map<source, ReadonlyMap<CapabilityName, unknown>>`. `StructuralDescriptor` either stays core-internal (if `TrackExecutionPlan.descriptors` still needs it) or is removed. It is not exported from `plugin-api.ts`.
6. Plugins build results with the constructors `derived`, `refused` and `none`; a refused track makes downstream bindings report `derivation-missing-capability` (accepted).

### Reasons

- **Correct:** the mapped (distributive) union ties `capability` to `payload`. `{capability:"chain", payload:{nope:1}}`, an unknown capability, and `refused` with an empty array are all compile errors **\[verified\]**. A plain `DeriveResult<P>` could not say which capability `P` is.
- **Exhaustive:** three states with distinct meaning ("mine and valid", "mine and invalid", "not mine"). Adding a fourth breaks every `switch` at compile time.
- **Simple:** about 35 lines of `normalizeHookResult` shape-sniffing (`Array.isArray`, `"capability" in`, `"descriptors" in`) are replaced by one switch. Producer-side uniqueness lets `read` drop its "ambiguous" branch completely.

---

## D3 — `validate` (requirement payloads only)

### Decision

```ts
// core/src/contract/derivation.ts
export interface RequirementContextOf<M> {
  readonly trackId: string;
  /** This plugin's participating entries on this track, with their normalized bindings. */
  readonly entries: readonly DerivationEntryInventoryItem[];
  read<K extends keyof M>(capability: K, source: string): M[K];
}
export interface DeriveContextOf<M> extends RequirementContextOf<M> {
  /** Own-track structural inventory, for composition rules. */
  readonly inventory: DerivationTrackInventory;
}

// plugin-api.ts
export type RequirementContext = RequirementContextOf<CapabilityMap>;
export type DeriveContext = DeriveContextOf<CapabilityMap>;
```

### Run order (per track, in graph order; per plugin with participating entries)

```text
1. readable  = { (binding.source, requirements[binding.slot].capability) | entry ∈ entries, slot declares capability }
2. presence  : every readable pair exists in the store, otherwise derivation-missing-capability; skip 3–4 for this plugin
3. validate? : diagnostics appended; any error-severity result → skip 4 for this plugin
4. derive?   : settle(erase(plugin.derive({ ...ctx, inventory })))
```

### Reasons

- **Name:** your example uses `validate`, and the repo already uses that verb for "returns diagnostics". `verify` usually means a boolean or proof.
- **Narrow context (Interface Segregation):** `validate` gets no `inventory`, so it can only judge requirement payloads, which is the stated purpose. `DeriveContext extends RequirementContext`, so both share one builder (DRY).
- **Correct ordering:** derive never runs on inputs that validate rejected, and validate never runs on missing capabilities. Each hook can assume its preconditions instead of re-checking them.
- **Fits the next slices:**
  - C3: `join.validate` refuses a rooted imported chain via `ctx.read("chain", src).rootPolicy`.
  - C4: `ik.validate` checks for a non-root member and that targets cover the leaves.
  - IK and FK need `validate` only. Today core only runs plugins that have `derive`; the loop now includes `validate`-only plugins.
- **Severity rule:** one rule for the whole outcome (an error severity refuses), the same as the existing `hasErrors` rule.

---

## D4 — Remove plugin-level `capabilities[]`

### Decision

- Delete `PluginDefinition.capabilities`, the admission block in `plugin-admission.ts` (validation and freezing), and the field in `point.ts`.
- Remove `export type { PluginCapability, PluginCapabilities }` from `plugin-api.ts`. No plugin or app imports it. The internal ADR-136 port stays until C6 deletes it.

### Reasons

- The field was never read by derivation, so it was a second, unchecked declaration of what `derive` produces.
- With D2 the capability name lives in the result and is type-checked against the map. One source of truth.
- Leaving `PluginCapability` on the authoring surface next to `CapabilityMap` invites mistakes. The legacy solver-chain concept has nothing to do with structural capabilities.

---

## D5 — `CapabilityMap` and typed `ctx.read`

### Decision

```ts
// core/src/contract/capability.ts
/** Open registry of structural capabilities. Plugins add entries with `declare module "@motion5/core/plugin-api"`. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation anchor, intentionally empty
export interface CapabilityMap {}
export type CapabilityName = keyof CapabilityMap;

// core/src/plugin-api.ts  (stays re-export-only, ADR-133)
export type { CapabilityMap, CapabilityName } from "./contract/capability";
export type { DeriveResult, DeriveContext, RequirementContext } from "./contract/derivation";
// contract/derivation.ts imports CapabilityMap from contract/capability.ts (contract → contract, no cycle)
// and binds: DeriveResult = DeriveResultOf<CapabilityMap>, etc.

// packages/plugins/src/chain-layout.ts
export interface ChainPayload {
  /* was ChainDescriptorPayload; fields unchanged */
}
declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    chain: ChainPayload;
  }
}
```

The context is built once, in one place:

```ts
function requirementContext(
  trackId,
  entries,
  readable: ReadonlyMap<string, ReadonlySet<string>>,
  store,
): RequirementContext {
  const read = (capability: string, source: string): unknown => {
    if (readable.get(source)?.has(capability) !== true)
      throw new CapabilityReadError(trackId, source, capability);
    return store.get(source)!.get(capability); // presence guaranteed by step 2
  };
  // The one typed↔erased boundary for reads; payloads were frozen when settled.
  return Object.freeze({ trackId, entries, read }) as unknown as RequirementContext;
}
```

### Rules

1. Only `chain` is registered now.
2. `CapabilityReadError` is core-internal. The derivation loop catches it and reports the existing `derivation-undeclared-source` rule. This replaces today's `error.message.includes("Missing capability")` string matching.
3. `tryReadDescriptor` / `readDescriptor` are removed. Optional slots check `entries[i].bindings` before reading.
4. Core's own tests (the toy `box` / `consumer-view` capabilities) add those names to the map with `declare module` in the test file.

### Reasons

- **Verified mechanics \[verified\]:**
  - augmenting through the named re-export works on TS 5.8.3, exactly like declaring the interface in `plugin-api.ts` directly;
  - `ctx.read("frame", …)` is a compile error while `read("chain", …)` returns `ChainPayload`;
  - core compiles on its own with an empty map, provided it widens through `erase(...)`. A plain `const r: Erased = plugin.derive(ctx)` is narrowed by TypeScript back to `refused | none`, and `case "derived"` then fails with TS2678. That is why there is exactly one explicit widening function.
- **Clean architecture:** contract modules hold the generic `…Of<M>` types. The facade binds them to `CapabilityMap`. The domain never imports the facade, so there is no cycle, and ADR-133 holds.
- **Honest trust boundary:** `read` is a typed cast, not a runtime validator. Checking real published data stays C5's job. The cast lives in one function, not at every call site.

---

## D6 — Requirement capability is both the check and the permission

```ts
export interface PluginRequirement {
  readonly description?: string;
  readonly dict?: true;
  readonly capability?: CapabilityName; // was string
}
```

- **Rule:** a plugin may `read(cap, source)` only if `source` is bound through one of its participating entries' slots that declares `capability: cap`. Presence of every such pair is checked before any hook runs.
- **Reason:** one declaration replaces three mechanisms (the track-wide `declaredSources` set, the read-time missing check, and the read-time ambiguity check). It applies least privilege: `derive` can no longer read sources bound by _other_ plugins on the same track.
- **Future:** C4's `skeleton` slot must accept `chain` or `joined`. Extend it then as `capability?: CapabilityName | readonly [CapabilityName, ...CapabilityName[]]` with a `readAny`. Not now (YAGNI).

## D7 — `root` loses `capability: "frame"`

- **Decision:** `root.requirements = { frame: {} }`. The frame is validated at runtime by `readFrame` and the C5 reader.
- **Reason:** `frame` is a value, not structure, and nothing derives it. The current declaration should make every `root → transform` binding refuse during load-time derivation (found by reading the code, not by running it). With `capability: CapabilityName`, this can no longer type-check, which is the correct outcome.

## D8 — Root rules stay with `root`

```ts
// packages/plugins/src/root-policy.ts
export type RootPolicyResult =
  | { readonly status: "ok"; readonly policy: RootPolicy }
  | { readonly status: "refused"; readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]] };

export function readRootPolicy(inventory: DerivationTrackInventory): RootPolicyResult;
```

- **Decisions:**
  - `root.derive` is kept. It owns only the duplicate-root refusal and returns `refused` when the policy is refused, otherwise `none`.
  - `deriveChainLayout` (via `point.derive`) and later `deriveJoinedLayout` (via `join.derive`) read the policy through `readRootPolicy`; chain layout returns `none` when the policy is refused, so the duplicate-root error appears once.
  - A root-only track is a legal generic track with no `chain` capability. FK and IK bound to it get `derivation-missing-capability`.
- **Reasons:**
  - One owner for the duplicate-root rule, and no eager root-only error.
  - One helper serves chain and joined layouts (DRY).
  - A generic mixed track (root + transform) stays legal, as the plan requires.

---

## Change list

**Core**

| File                              | Change                                                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contract/capability.ts` (new)    | `CapabilityMap`, `CapabilityName`.                                                                                                                                                                                                                      |
| `contract/collect.ts` (new)       | `COLLECT_OUTPUT`, `CollectRecord`, `CollectRun`.                                                                                                                                                                                                        |
| `contract/derivation.ts`          | `DeriveResultOf`, `RequirementContextOf`, `DeriveContextOf`, `ErasedDeriveResult`, internal `CapabilityReadError`. Remove `DerivationHookResult`, `PluginDerivationHook`, `readDescriptor`/`tryReadDescriptor`, and `StructuralDescriptor.diagnostics`. |
| `plugin-api.ts`                   | Re-export the new types and `COLLECT_OUTPUT`. Drop `DerivationContext`, `DerivationHookResult`, `PluginDerivationHook`, `StructuralDescriptor`, `DerivationUndeclaredSourceError`, `PluginCapability(ies)`.                                             |
| `domain/plugins.ts`               | `PluginDefinition` union (D1). `derive`/`validate` hooks. `PluginRequirement.capability: CapabilityName`. Remove `capabilities`, `PluginCollectOperation`, `PluginFoldOperation` (split into `FoldClaim` / `StatelessFold`).                            |
| `domain/plugin-admission.ts`      | Collect/fold variant checks. Reserved `COLLECT_OUTPUT` for fold. `validate` must be a function. Remove the `capabilities` block. Reuse `isCapabilityToken`.                                                                                             |
| `domain/execution-plan.ts`        | `operations.collect?: true`, `plan.collects`, `publishedOutputs` from `COLLECT_OUTPUT`. Strategy built from the narrowed union.                                                                                                                         |
| `domain/track-operations.ts`      | Single collect buffer. Factory collect-presence check.                                                                                                                                                                                                  |
| `domain/structural-derivation.ts` | Loop per D3. `settle` per D2. Store as `Map<source, Map<cap, payload>>`. Context per D5. Remove message-string error matching.                                                                                                                          |

**Plugins**

| File                   | Change                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chain-layout.ts`      | `ChainPayload`, `declare module` augmentation. `deriveChainLayout(ctx): DeriveResult` returns `none` for mixed tracks and `refused` for invalid ones. Remove `ChainDescriptor`. |
| `point.ts`             | `collect: (entry) => ({ ...entry.values })` (no `output`), no `capabilities`.                                                                                                   |
| `root.ts`              | `requirements.frame = {}`. Delete `derive`.                                                                                                                                     |
| `root-policy.ts` (new) | `readRootPolicy`.                                                                                                                                                               |

**Tests and fixtures to update**

- C1 suite (toy capabilities via test-local augmentation; one-payload rule; `refused` / `none` paths; `validate`-only plugin; undeclared-read).
- C2 suite (`DeriveResult` assertions, root ownership).
- B1, B2, B3 and B6 tests and the oracle fixtures that expect `points`.
- `plugins/test/unit/loader.test.ts`.
- `plugin-capabilities.test.ts`: only the `capabilities[]` parts. The ADR-136 parts stay until C6.

## Plan-pack edits

- **Overview §4:** "Stateless collect declares an output" becomes "collect publishes under the reserved `collect` output". Remove "collect+collect sharing an output". The overlap rule becomes "fold may not claim `collect`".
- **Overview §5 and the example:** `-> points` becomes `-> collect`. "join collects links" becomes "join collects (records under `collect`)".
- **C1:** record `DeriveResult` / `validate` / `CapabilityMap` as the API. Remove "capability tokens validated" for plugin-level declarations.
- **C3:** `join.validate` owns the rooted-import and non-chain refusals. `join.derive` owns joined topology through `readRootPolicy`. `CapabilityMap` gains `joined`.
- **C4:** IK and FK use `validate`. Note the D6 extension for "chain or joined".
- **C5:** replace "exactly one points or links container" with "read `collect`, interpret it via the source capability".
- **C6:** delete the internal `PluginCapability` port (its export is already gone after D4).
- **New ADR:** record D1–D8. The ADR-133 facade rule is unchanged (re-export-only holds).
