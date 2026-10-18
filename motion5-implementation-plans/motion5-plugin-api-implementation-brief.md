# Implementation brief: motion5 plugin structural API (decisions D1–D8)

Audience: a coding agent that implements this in the motion5 repo.
Branch base: `feat/skeldata-v5-phase-c`. C1 and C2 are done on that branch.
Suggested branch: `feat/plugin-structural-api`.
Source of truth for the reasons behind each choice: `motion5-plugin-api-decisions.md` (D1–D8).
This brief tells you how to implement them. If this brief and the decisions doc disagree, stop and
report. Do not pick one yourself.

---

## 0. Read this first

### Your job

Change the plugin API so that:

1. Stateless collect is just a function, `collect: (entry, ctx) => record`. It has no label, and every
   collect record goes into one published array named `collect`.
2. `derive` returns a tagged result: `derived`, `refused` or `none`.
3. Plugins get a new `validate` hook that checks requirement payloads. It never produces anything.
4. Plugin-level `capabilities: [...]` is deleted.
5. Capabilities are typed through an open `CapabilityMap` interface that plugins extend with
   `declare module`. `ctx.read("chain", source)` returns a typed payload.
6. `root` no longer requires a `frame` capability. Nothing provides that capability today, so the
   current code is a bug.
7. `root.derive` is deleted. Chain layout reads root policy through one helper module.

### Hard rules

- Do the steps in order. Run the check at the end of each step before you start the next one.
- Never use `any`, `@ts-ignore`, `@ts-expect-error` or `// eslint-disable` in `src`. In tests,
  `as unknown as PluginDefinition` is allowed only to test runtime guards against bad JS input.
- Do not touch the legacy compose plugins (`transform`, `fk`, `ik`, `rig`, and so on). Only `point.ts`,
  `root.ts`, `chain-layout.ts` and the new `root-policy.ts` change in `packages/plugins/src`.
- Do not touch `ports/plugin-capabilities.ts`, `CompiledEntryPlan.capabilities` or
  `registry.capabilityOf`. That is the internal ADR-136 chain port, and it stays until C6.
- Do not edit the plan pack under `motion5-implementation-plans/`. List it as a follow-up in your report.
- Do not reformat unrelated code. If `npm run format` changes files you did not touch, revert those
  changes and mention it in the report.
- Do not add new dependencies.
- Keep existing diagnostic rule ids and messages unless this brief gives a new message. Tests match them
  with regexes.

### Stop and report (do not improvise) if

- The baseline (Section 2) fails in a way you cannot explain.
- A step needs a file this brief does not mention, and the change is not a mechanical import or rename.
- The same type error survives 3 fix attempts.
- `packages/core/src/domain/plugins.ts` or `project-runtime.ts` would grow past 60,000 bytes.
- A test that this brief does not mention starts failing, and the reason is not one of the renames in
  this brief.

---

## 1. Repo guardrails (from AGENTS.md)

- Prettier settings: printWidth 100, double quotes, trailing commas. Run `npm run format` before the
  final gate.
- Comments are allowed only when a name cannot carry the meaning, and each one must be 250 characters
  or fewer. Do not write narration comments such as "// now we loop".
- Every file in `packages/core/src` must stay under 60 KB. A file over 30 KB must keep a sibling `.md`
  file. `domain/plugins.ts` (about 30.6 KB) has `domain/plugins.md`, and you must update it in Step 9.
- Each invariant has a single owner. Plugin definition shape checks live only in
  `domain/plugin-admission.ts`, and the execution plan trusts admitted definitions.
- Layer boundaries are enforced by `npm run test:boundaries`:
  - `contract/`, `ports/` and `adapters/` must not import from `domain/`.
  - `graph/` and `contract/` must not import `domain/plugins`.
  - `packages/plugins/src` may import only `@motion5/core`, `@motion5/core/plugin-api` or relative
    files inside `packages/plugins/src`.
  - `plugin-api.ts` contains only re-exports (ADR-133).
- Do not use markdown tables in any repo `.md` file. Use bullets.
- `docs/SESSION-STATUS.md` must be rewritten, not appended to. It keeps exactly one bullet under
  "Now" and one under "Next in line", and a byte-ceiling test checks its size.
- The whole repo typechecks as one tsconfig program, so a `declare module` augmentation in any test
  file is visible to every file. Section 10.2 explains what this means for tests.

---

## 2. Setup and baseline

```bash
git checkout feat/skeldata-v5-phase-c
git checkout -b feat/plugin-structural-api
npm ci
npm run typecheck
npm test
npm run test:boundaries
node scripts/read-budget-scan.mjs
```

Write down every failure from this baseline and give it a label like `BASELINE-1`. You do not fix
these. At the end, your report must show that you added no new failures.

### Write the D7 proof test first

Before you change any code, write the test from Section 10.4 (D7) and run it. It must FAIL on the
baseline, and one of its diagnostics should be `derivation-missing-capability`. Commit it alone with
the message `test: root bound to frame source is refused (D7 repro)`. If it passes on the baseline,
stop and report, because that means D7's premise is wrong.

---

## 3. Step 1: contract modules

### 3.1 New file `packages/core/src/contract/capability.ts`

```ts
/** Open registry of structural capabilities. Plugins add entries with `declare module "@motion5/core/plugin-api"`. */
export interface CapabilityMap {}

export type CapabilityName = keyof CapabilityMap;

export function isCapabilityToken(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "" && !value.includes(":");
}
```

### 3.2 New file `packages/core/src/contract/collect.ts`

This file has no imports.

```ts
/** The single published output carrying collect records. */
export const COLLECT_OUTPUT = "collect";

/** One collect record. Core stamps `id = entryId`; a producer must not supply `id`. */
export type CollectRecord = Readonly<Record<string, unknown>> & { readonly id?: never };
```

### 3.3 Rewrite `packages/core/src/contract/derivation.ts`

Keep `DerivationBinding` and `DerivationTrackInventory` unchanged. Keep the existing import lines for
`Diagnostic`, `AuthoredEntryId` and `PluginName`, using whatever paths the file already has. Then:

- Remove `PluginDerivationHook`, `DerivationHookResult`, `DerivationContext`, `readDescriptor` /
  `tryReadDescriptor` and `DerivationUndeclaredSourceError`.
- Drop the `diagnostics` field from `StructuralDescriptor`.
- In `DerivationEntryInventoryItem`, change `collect` to `readonly collect?: true;`.
- Add the following code:

```ts
import type { CapabilityMap } from "./capability";

export interface StructuralDescriptor<T = unknown> {
  readonly capability: string;
  readonly source: string;
  readonly payload: T;
}

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

export interface RequirementContextOf<M> {
  readonly trackId: string;
  readonly entries: readonly DerivationEntryInventoryItem[];
  read<K extends keyof M>(capability: K, source: string): M[K];
}

export interface DeriveContextOf<M> extends RequirementContextOf<M> {
  readonly inventory: DerivationTrackInventory;
}

export type DeriveResult = DeriveResultOf<CapabilityMap>;
export type RequirementContext = RequirementContextOf<CapabilityMap>;
export type DeriveContext = DeriveContextOf<CapabilityMap>;
export type ErasedDeriveResult = DeriveResultOf<Record<string, unknown>>;

export class CapabilityReadError extends Error {
  readonly ruleId = "derivation-undeclared-source";

  constructor(
    readonly trackId: string,
    readonly source: string,
    readonly capability: string,
  ) {
    super(
      `Track "${trackId}" read capability "${capability}" from "${source}" without a slot declaring it.`,
    );
    this.name = "CapabilityReadError";
  }
}
```

Notes:

- `contract/derivation.ts` imports `contract/capability.ts`. That is contract importing contract, which
  is allowed and creates no cycle.
- `RequirementContext` is passed to `validate`. `DeriveContext` is passed to `derive`.

Check: `npm run typecheck`. It is expected to fail in files that use the removed names. Write down
which files fail, because they are the ones the next steps fix.

---

## 4. Step 2: `packages/core/src/plugin-api.ts` exports

This file stays re-export-only.

1. Delete the line that re-exports `PluginCapability, PluginCapabilities`.
2. Replace the derivation re-export block with:

```ts
export type { CapabilityMap, CapabilityName } from "./contract/capability";
export { COLLECT_OUTPUT } from "./contract/collect";
export type { CollectRecord } from "./contract/collect";
export type {
  DerivationBinding,
  DerivationEntryInventoryItem,
  DerivationTrackInventory,
  DeriveContext,
  DeriveResult,
  RequirementContext,
} from "./contract/derivation";
```

3. In the `./domain/plugins` re-export block, add `CollectRun`, `FoldClaim`, `StatelessFold`,
   `StatelessPluginDefinition` and `StatefulPluginDefinition`. Keep `PluginDefinition`.
4. Do NOT export `StructuralDescriptor`, `DeriveResultOf`, `ErasedDeriveResult` or
   `CapabilityReadError` from plugin-api.

The augmentation `declare module "@motion5/core/plugin-api" { interface CapabilityMap {...} }` works
through the named `export type { CapabilityMap }` re-export. This was verified with TypeScript 5.8.

If `packages/core/src/index.ts` re-exports any removed name, delete it from there too. The index exports
are allow-listed by a test, so update that allow-list in the same commit.

---

## 5. Step 3: `packages/core/src/domain/plugins.ts` types

Replace `PluginCollectOperation`, `PluginFoldOperation` and the current `PluginDefinition` interface with
the code below. `PluginDefinitionBase` must include every existing field of today's `PluginDefinition`
EXCEPT `collect`, `fold`, `createEvaluator`, `capabilities` and the old `derive`.

```ts
import type { CollectRecord } from "../contract/collect";
import type { CapabilityName } from "../contract/capability";
import type { DeriveContext, DeriveResult, RequirementContext } from "../contract/derivation";
import type { EvaluatorFactory, LocalEvaluation, LocalEvaluationContext } from "./execution-plan";

export type CollectRun = (entry: LocalEvaluation, ctx: LocalEvaluationContext) => CollectRecord;

export interface FoldClaim {
  readonly outputs: readonly string[];
}

export interface StatelessFold extends FoldClaim {
  readonly run: (
    entry: LocalEvaluation,
    prior: Readonly<Record<string, unknown>>,
    ctx: LocalEvaluationContext,
  ) => Readonly<Record<string, unknown>>;
}

interface PluginDefinitionBase {
  // ...every existing field except collect, fold, createEvaluator, capabilities, derive...
  readonly validate?: (ctx: RequirementContext) => readonly Diagnostic[];
  readonly derive?: (ctx: DeriveContext) => DeriveResult;
}

export interface StatelessPluginDefinition extends PluginDefinitionBase {
  readonly createEvaluator?: never;
  readonly collect?: CollectRun;
  readonly fold?: StatelessFold;
}

export interface StatefulPluginDefinition extends PluginDefinitionBase {
  readonly createEvaluator: EvaluatorFactory;
  readonly collect?: true;
  readonly fold?: FoldClaim;
}

export type PluginDefinition = StatelessPluginDefinition | StatefulPluginDefinition;
```

In `PluginRequirement`, change the field to `readonly capability?: CapabilityName;`.

Notes:

- `plugins.ts` already imports from `./execution-plan`, so adding type imports in that direction is
  fine. Use `import type`.
- The call site is `strategy.fold(local, currentFold, local.context)`, and `StatelessFold.run` matches
  it. If the call site differs, change the type to match the call site and mention it in the report.
- Narrow the union with `plugin.createEvaluator !== undefined` (the stateful branch). For a property
  that exists on only one fold variant, use `"run" in plugin.fold`.
- When `domain/plugins.ts` changes, update `domain/plugins.md` in Step 9. The file must stay under
  60 KB, so check it with `wc -c`.

Check: `npm run typecheck`. Errors in admission, execution-plan, track-operations, structural-derivation,
plugins and tests are expected at this point.

---

## 6. Step 4: `packages/core/src/domain/plugin-admission.ts`

Admission is the only owner of definition-shape checks. Keep the file's existing error style, which is
`throw new TypeError(...)`.

### 6.1 Replace the collect/fold block (currently about lines 90–130)

Use this structure. Keep the existing messages for checks that already existed.

```ts
if (source.collect === undefined && source.fold === undefined && source.compose === undefined) {
  // keep the existing "must declare collect, fold, or both operations." condition and message as-is
}

if (source.createEvaluator !== undefined) {
  if (typeof source.createEvaluator !== "function") {
    throw new TypeError(
      `Plugin "${source.name}" createEvaluator must be a function when provided.`,
    );
  }
  if (source.collect !== undefined && source.collect !== true) {
    throw new TypeError(`Plugin "${source.name}" with createEvaluator must claim collect as true.`);
  }
  if (source.fold !== undefined && "run" in source.fold) {
    throw new TypeError(
      `Plugin "${source.name}" declares both an evaluator factory and stateless run callbacks.`,
    );
  }
} else {
  if (source.collect !== undefined && typeof source.collect !== "function") {
    throw new TypeError(`Plugin "${source.name}" collect must be a function.`);
  }
  if (source.fold !== undefined && typeof source.fold.run !== "function") {
    throw new TypeError(`Plugin "${source.name}" fold run must be a function.`);
  }
}

if (source.fold !== undefined) {
  // keep existing fold.outputs checks (array, non-empty strings, no duplicates, no "id")
  if (source.fold.outputs.includes(COLLECT_OUTPUT)) {
    throw new TypeError(
      `Plugin "${source.name}" fold output cannot use reserved name "${COLLECT_OUTPUT}".`,
    );
  }
}

if (source.validate !== undefined && typeof source.validate !== "function") {
  throw new TypeError(`Plugin "${source.name}" validate must be a function when provided.`);
}
```

Important: keep the first condition exactly as it is in the file today. Do not change which plugins
count as "has an operation". The comment in the snippet is only a placeholder.

### 6.2 Delete

- All collect checks for `collect.output`: non-empty, reserved `"id"`, and the object shape.
- The whole `source.capabilities` block (about lines 175–185) and the code that freezes it.
- Anything that copies `capabilities` into the admitted definition.

### 6.3 Requirement capability (about line 199)

Replace the inline string check with the shared guard. Keep the existing message.

```ts
import { isCapabilityToken } from "../contract/capability";
// ...
if (req?.capability !== undefined && !isCapabilityToken(req.capability)) {
  throw new TypeError(/* existing message */);
}
```

### 6.4 Move B2 message checks

If `execution-plan.ts` has checks that duplicate the ones above (factory vs run, collect without run,
fold without run), delete them in Step 5. Tests that asserted the execution-plan messages must now
assert the admission messages. Section 10.1 covers this.

Check: `npx vitest run packages/core/test/contract -t "admission"`. Type errors elsewhere are still
expected at this point.

---

## 7. Step 5: execution plan and track operations

### 7.1 `packages/core/src/domain/execution-plan.ts`

1. Change `ExecutionStrategy` to:

```ts
export type ExecutionStrategy =
  | {
      readonly kind: "stateless";
      readonly collect?: CollectRun;
      readonly fold?: StatelessFold["run"];
    }
  | {
      readonly kind: "factory";
      readonly createEvaluator: EvaluatorFactory;
    };
```

2. Delete `CompiledCollectOperation`. Change `CompiledEntryOperations` to:

```ts
export interface CompiledEntryOperations {
  readonly collect?: true;
  readonly fold?: CompiledFoldOperation;
}
```

3. In `TrackExecutionPlan`, replace `readonly collectOutputs: readonly string[];` with
   `readonly collects: boolean;`.
4. Replace `validateAndDetermineExecutionStrategy` (about line 490) with this. It trusts admission and
   does no shape checks:

```ts
function executionStrategyOf(plugin: PluginDefinition): ExecutionStrategy {
  if (plugin.createEvaluator !== undefined) {
    return Object.freeze({ kind: "factory", createEvaluator: plugin.createEvaluator });
  }
  return Object.freeze({
    kind: "stateless",
    ...(plugin.collect !== undefined ? { collect: plugin.collect } : {}),
    ...(plugin.fold !== undefined ? { fold: plugin.fold.run } : {}),
  });
}
```

Update its call sites to use the new name.

5. In `compileTrackExecutionPlan`:

- Delete the `plugin.collect?.output === "id"` check (about line 579).
- Where operations are built (about line 626), use
  `...(plugin.collect !== undefined ? { collect: true as const } : {})`.
- In the cross-entry block (about lines 661–700), delete `collectOutputs`, `collectSet` and the
  "Cross-operation conflict" check. Admission now owns that through the reserved `collect` name.
  Compute `const collects = entries.some((entry) => entry.operations.collect === true);`.
- Serializer consensus: where the code listed `entryPlan.operations.collect.output`, use
  `COLLECT_OUTPUT` when `entryPlan.operations.collect === true`.
- Change `publishedOutputs` to:
  `Object.freeze([...new Set([...(collects ? [COLLECT_OUTPUT] : []), ...foldOutputs])].sort())`.
- In the returned plan, replace `collectOutputs: ...` with `collects`.

6. In `createEntryEvaluator` (or wherever the factory evaluator is created), add the reverse claim
   check. If the evaluator has a `collect` method, the entry must claim collect, and the other way
   round. Do the same for `fold`:

```ts
const claimsCollect = entry.operations.collect === true;
if (claimsCollect !== (typeof evaluator.collect === "function")) {
  throw new TypeError(
    `Evaluator for entry "${entry.entryId}" collect method does not match its collect claim.`,
  );
}
```

Keep the existing call-site guards in track-operations.

### 7.2 `packages/core/src/domain/track-operations.ts`

1. `executeCollectOperation` loses its output-name parameter and pushes into a single buffer:

```ts
function executeCollectOperation(
  entryId: AuthoredEntryId,
  rawRecord: unknown,
  collected: Array<Readonly<Record<string, unknown>>>,
): void {
  // keep the existing isPlainRecord check and the "cannot supply its own id" check
  collected.push(Object.freeze({ ...rawRecord, id: entryId }));
}
```

2. Replace the collections map (about line 165) with
   `const collected: Array<Readonly<Record<string, unknown>>> = [];`.
3. At the stateless and factory call sites (about lines 180 and 226), change
   `if (entry.operations.collect)` to `if (entry.operations.collect === true)` and call
   `executeCollectOperation(entry.entryId, collectRecord, collected)`.
4. At publish time (about line 268):

```ts
if (plan.collects) {
  stagedPublished[COLLECT_OUTPUT] = Object.freeze(collected);
}
```

Check: `npm run typecheck`. Only structural-derivation, the plugins and tests should still fail.

---

## 8. Step 6: rewrite `packages/core/src/domain/structural-derivation.ts`

Keep the exported names and shapes of `StructuralDerivationOptions`, `StructuralDerivationOutcome` and
`deriveStructuralDescriptors`. The store type stays
`Map<string, readonly StructuralDescriptor[]>`, so `project-runtime.ts` and `project-handles.ts` should
need no change. If they do need a change, keep it to a mechanical one.

### 8.1 Flow per track, in graph order

For each plugin group on the track:

1. Check that every slot's required capability is present. If one is missing, add
   `derivation-missing-capability` and skip this plugin group.
2. If the plugin has neither `validate` nor `derive`, skip it.
3. Build the requirement context.
4. If `validate` exists, run it. If it returns any error-severity diagnostic or throws, skip `derive`.
5. If `derive` exists, increment the counter `${trackId}:${pluginName}` and run `derive`.
6. Settle the result.

After all tracks, the outcome is `"refused"` if any plugin refused or any diagnostic has error severity.
Otherwise it is `"accepted"`.

### 8.2 Code skeleton

```ts
type Settlement = "settled" | "refused";

const toErased = (result: DeriveResult): ErasedDeriveResult => result;
const readKey = (source: string, capability: string): string => `${source}\u0000${capability}`;

export function deriveStructuralDescriptors(
  options: StructuralDerivationOptions,
): StructuralDerivationOutcome {
  if (options.cycleDiagnostics !== undefined && options.cycleDiagnostics.length > 0) {
    // keep the existing early return for cycles
  }
  const store = new Map<string, readonly StructuralDescriptor[]>();
  const diagnostics: Diagnostic[] = [];
  let pluginRefused = false;

  for (const trackId of derivationOrder(options)) {
    const plan = options.plans.get(trackId);
    if (plan === undefined) continue;
    const inventory = buildDerivationInventory(plan);
    const produced: StructuralDescriptor[] = [];
    for (const [pluginName, entries] of groupEntriesByPlugin(plan)) {
      const plugin = entries[0]!.plugin;
      const missing = findMissingCapabilities(trackId, plugin, entries, store);
      diagnostics.push(...missing);
      if (missing.length > 0) continue;
      if (plugin.validate === undefined && plugin.derive === undefined) continue;
      const context = createRequirementContext(
        trackId,
        inventory.entries.filter((item) => item.plugin === pluginName),
        readableCapabilities(plugin, entries),
        store,
      );
      if (plugin.validate !== undefined) {
        if (!runValidate(plugin.validate, context, pluginName, diagnostics)) continue;
      }
      if (plugin.derive === undefined) continue;
      countDerivation(options.callCounter, trackId, pluginName);
      const derive = plugin.derive;
      const settlement = runHook(trackId, pluginName, diagnostics, () =>
        settleDeriveResult(
          toErased(derive(Object.freeze({ ...context, inventory }))),
          trackId,
          pluginName,
          produced,
          diagnostics,
        ),
      );
      if (settlement === "refused") pluginRefused = true;
    }
    store.set(trackId, Object.freeze(produced));
  }

  return {
    descriptors: store,
    diagnostics: Object.freeze(diagnostics),
    kind: pluginRefused || diagnostics.some(isError) ? "refused" : "accepted",
  };
}
```

### 8.3 Helpers to write (all private to this file)

`derivationOrder(options)`
: Move the existing order logic into this function as-is.

`groupEntriesByPlugin(plan)`
: Returns a `Map<string, CompiledEntryPlan[]>` keyed by `entry.plugin.name`. Keep the first-seen order
so plugin groups run in authored order.

`findMissingCapabilities(trackId, plugin, entries, store)`
: For each entry and each `binding` in `entry.bindings`, read
`plugin.requirements?.[binding.slot]?.capability`. If it is defined and
`store.get(binding.qualifiedSource)` has no descriptor with that capability, emit
`derivation-missing-capability` with the same path, message and args as the current code (about
lines 146–175). Delete the consumer-side `derivation-ambiguous-capability` branch, because ambiguity
is now refused at the producer.

`readableCapabilities(plugin, entries)`
: Returns a `Set<string>` of `readKey(binding.qualifiedSource, capability)` for every slot that
declares a capability. A slot's capability is both the presence check and the read permission.

`createRequirementContext(trackId, items, readable, store): RequirementContext`

```ts
function createRequirementContext(
  trackId: string,
  entries: readonly DerivationEntryInventoryItem[],
  readable: ReadonlySet<string>,
  store: ReadonlyMap<string, readonly StructuralDescriptor[]>,
): RequirementContext {
  const read = (capability: string, source: string): unknown => {
    if (!readable.has(readKey(source, capability))) {
      throw new CapabilityReadError(trackId, source, capability);
    }
    const found = store.get(source)?.find((d) => d.capability === capability);
    if (found === undefined) throw new CapabilityReadError(trackId, source, capability);
    return found.payload;
  };
  return Object.freeze({ trackId, entries, read }) as unknown as RequirementContext;
}
```

This is the only cast. It exists because core cannot know the augmented map.

`runHook<T>(trackId, pluginName, diagnostics, fn): T | undefined`
: Runs `fn` inside try/catch. A `CapabilityReadError` becomes a `derivation-undeclared-source`
diagnostic, keeping the existing message format if one exists. Any other throw becomes
`derivation-failure`. Return `undefined` when it threw. When the result is `undefined`, the
derivation call site treats it as `"refused"`: write `if (settlement !== "settled") pluginRefused =   true;`.

`runValidate(validate, context, pluginName, diagnostics): boolean`

```ts
const found = runHook(context.trackId, pluginName, diagnostics, () => validate(context));
if (found === undefined) return false;
diagnostics.push(...found);
return !found.some(isError);
```

`settleDeriveResult(result, trackId, pluginName, produced, diagnostics): Settlement`

```ts
switch (result.status) {
  case "none":
    return "settled";
  case "refused":
    if (result.diagnostics.length === 0) {
      diagnostics.push(/* derivation-failure: `Plugin "${pluginName}" refused without a diagnostic.` */);
    }
    diagnostics.push(...result.diagnostics);
    return "refused";
  case "derived": {
    if (!isCapabilityToken(result.capability)) {
      throw new TypeError(`Plugin "${pluginName}" derived an invalid capability token.`);
    }
    if (produced.some((d) => d.capability === result.capability)) {
      diagnostics.push(/* derivation-ambiguous-capability on `${trackId}`, args [trackId, result.capability] */);
      return "refused";
    }
    produced.push(
      Object.freeze({
        capability: result.capability,
        source: trackId,
        payload: deepFreeze(result.payload),
      }),
    );
    return "settled";
  }
  default:
    return unreachable(result);
}
```

The `"refused"` case checks `result.diagnostics.length === 0` because a JS plugin can break the
non-empty tuple type at runtime. A malformed result, such as an unknown status or a missing field,
makes `unreachable` or the `TypeError` throw inside `runHook`, so it becomes `derivation-failure`.

`buildDerivationInventory(plan)`
: Keep it, but set `collect: true` when `entry.operations.collect === true` instead of copying an output
name.

`countDerivation(counter, trackId, pluginName)`
: Same counter key as today, `${trackId}:${pluginName}`. Count only `derive` calls, not `validate`.

Imports come from `../contract/derivation`, `../contract/capability` and `../lang/exhaustive`
(`unreachable`). Keep `deepFreeze` and `diagnostic` from where the file imports them today. Delete the
old `readDescriptor` closure, the message-string error matching and every use of
`DerivationUndeclaredSourceError`.

### 8.4 Why `toErased`

A plain annotated assignment, `const r: ErasedDeriveResult = derive(...)`, narrows to
`refused | none` when `CapabilityMap` is empty, and the `"derived"` case then fails with TS2678.
Passing the result through the identity function `toErased` widens it correctly.

Check: `npm run typecheck`. Only plugins and tests should fail now.

---

## 9. Step 7: plugins (`packages/plugins/src`)

### 9.1 New file `root-policy.ts`

Move `ChainRootPolicy` out of `chain-layout.ts` into this file and rename it to `RootPolicy`. Keep the
three variants and their fields exactly as they are today (`origin`, `unbound`, `bound`).

```ts
import type {
  Diagnostic,
  DerivationTrackInventory,
  // plus the branded id types used by the variants today
} from "@motion5/core/plugin-api";
import {
  asRootBindingProvenance,
  diagnostic,
  encodeBindingTuple,
  unreachable,
} from "@motion5/core/plugin-api";

export type RootPolicy = /* the three variants, unchanged */;

export type RootPolicyResult =
  | { readonly status: "ok"; readonly policy: RootPolicy }
  | { readonly status: "refused"; readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]] };

export function readRootPolicy(inventory: DerivationTrackInventory): RootPolicyResult {
  const trackId = inventory.trackId ?? "track";
  const [rootEntry, duplicate] = inventory.entries.filter((entry) => entry.plugin === "root");
  if (duplicate !== undefined) {
    return {
      status: "refused",
      diagnostics: [/* the existing duplicate-root diagnostic, same rule id and message */],
    };
  }
  if (rootEntry === undefined) return { status: "ok", policy: ORIGIN };
  const frame = rootEntry.bindings.find((binding) => binding.slot === "frame");
  // build the unbound or bound policy exactly as chain-layout does today, with `as const`
}

export function rootPolicyToken(policy: RootPolicy): string {
  switch (policy.kind) {
    case "origin":
      return "origin";
    case "unbound":
      return `unbound(${policy.entryId})`;
    case "bound":
      return `bound(${policy.provenance})`;
    default:
      return unreachable(policy);
  }
}
```

The token strings must match what `chain-layout.ts` builds into `layoutIdentity` today. Copy them
from the current code; the strings above are only placeholders. If a test asserts `layoutIdentity`,
it must still pass unchanged.

### 9.2 `chain-layout.ts`

- Rename `ChainDescriptor` to `ChainPayload`. Its `rootPolicy` field is now typed `RootPolicy`.
- Add the augmentation:

```ts
declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    chain: ChainPayload;
  }
}
```

- `deriveChainLayout(inventory: DerivationTrackInventory): DeriveResult` works like this:
  - If the track is empty, or any entry is neither `point` nor `root`, return `{ status: "none" }`.
  - `const root = readRootPolicy(inventory); if (root.status === "refused") return root;`
  - If there are no point entries (root only), return `refused` with the existing root-only diagnostic.
  - Otherwise build the payload exactly as today and return
    `{ status: "derived", capability: "chain", payload }`.
- Delete the inline duplicate-root logic and the nested ternary for the policy token. Use
  `rootPolicyToken(root.policy)`.

### 9.3 `point.ts`

```ts
import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { deriveChainLayout } from "./chain-layout";

export const pointPlugin: PluginDefinition = Object.freeze({
  name: "point",
  keys: Object.freeze(["length", "x", "y"]),
  collect: (entry) => ({ ...entry.values }),
  derive: (context) => deriveChainLayout(context.inventory),
} satisfies StatelessPluginDefinition);
```

Keep the other fields the file has today (keys and so on). Delete `capabilities`. The old collect
spread the whole `LocalEvaluation`, which leaked `inputs` and `context` into published records. That
was a bug, and `entry.values` fixes it.

### 9.4 `root.ts`

```ts
export const rootPlugin: PluginDefinition = Object.freeze({
  name: "root",
  requirements: Object.freeze({ frame: Object.freeze({}) }),
  fold: {
    outputs: Object.freeze(["root"]),
    run: (entry) => ({ root: readFrame(entry) }),
  },
} satisfies StatelessPluginDefinition);
```

Keep the existing fold logic, and keep the frame read exactly as it is today. Delete `derive` and
delete `capability: "frame"`.

`satisfies StatelessPluginDefinition` gives the callback parameters their types. Without it you will get
implicit-any errors, because `Object.freeze` alone does not pass the union type to the callbacks.

Check: `npm run typecheck`. Only tests should fail now.

---

## 10. Step 8: tests

### 10.1 Mechanical renames (B1, B2, B3, B4, B5, B6, B7, C1 contract tests and `loader.test.ts`)

Search: `grep -rn "collect: {" packages --include=*.ts`

- Stateless: `collect: { output: "x", run: fn }` becomes `collect: fn`.
- Stateful (has `createEvaluator`): `collect: { output: "x" }` becomes `collect: true`.
- Change any assertion on the old output name to `"collect"` (for example
  `published.points` → `published.collect`).
- `plan.collectOutputs` becomes `plan.collects`, and the assertion compares a boolean.
- If a track had two different collectors with different outputs, the expectation is now ONE array
  under `collect` that holds both kinds of records in entry order.
- Delete tests for a collect output named `"id"`. That case can no longer be expressed.
- Change the cross-operation conflict test to: a fold output named `"collect"` is refused at
  admission with the reserved-name message.
- Tests that asserted the factory/run/shape messages from execution-plan now assert the admission
  messages from Step 4, still using `as unknown as PluginDefinition`.
- In `loader.test.ts` (about line 594), update the point collect expectation. Records now contain only
  value fields plus `id`, not `values`, `inputs` or `context`.

### 10.2 C1 test (`structural-derivation-c1.test.ts`)

Add this at the top of the file:

```ts
declare module "../../src/contract/capability" {
  interface CapabilityMap {
    box: { readonly width: number; readonly height: number };
    "consumer-view": { readonly consumedFrom: string; readonly sourcePayload: unknown };
  }
}
```

- Delete `capabilities: [...]` from the toy plugins.
- The source plugin returns `{ status: "derived", capability: "box", payload: { ... } }`.
- The consumer plugin gets `requirements: { source: { capability: "box" } }` and reads with
  `ctx.read("box", binding.qualifiedSource)`. Find the binding with
  `ctx.entries.flatMap((e) => e.bindings).find((b) => b.slot === "source")`.
- Replace `DerivationContext`, `readDescriptor` and `DerivationUndeclaredSourceError` with the new API.
- The `derivationCount` assertions (about lines 354–375) keep their numbers.

Add these new tests. Use the same harness as the existing C1 tests (`order` and `plans`):

1. A validate-only plugin that returns an error diagnostic gives outcome `refused` and no descriptor.
2. If validate returns an error, derive is skipped and the derivation count for that plugin is 0.
3. `derive` returns `{ status: "refused", diagnostics: [d] }`. The outcome is `refused` and contains `d`.
4. `derive` returns `{ status: "none" }`. The outcome is accepted and there is no descriptor.
5. A malformed result, `{ status: "weird" } as unknown as DeriveResult`, gives `derivation-failure`.
6. `derive` throws, which gives `derivation-failure`.
7. Reading from a source whose slot did not declare that capability gives
   `derivation-undeclared-source`.
8. Two plugins on one track both derive `box`, which gives `derivation-ambiguous-capability` at the
   producer track.

Test augmentations are global because the repo is one tsconfig program. So with an augmented map, the
`"derived"` variant is a union over all capabilities. Narrow by `capability` before reading `payload`.

### 10.3 C2 test (`chain-layout-c2` test in `packages/plugins/test`)

- Change the imports: `ChainDescriptor` → `ChainPayload`, `ChainRootPolicy` → `RootPolicy` (from
  `../src/root-policy`).
- Add this helper:

```ts
function chainOf(result: DeriveResult): ChainPayload {
  if (result.status !== "derived" || result.capability !== "chain") {
    throw new Error(`expected a derived chain, got ${result.status}`);
  }
  return result.payload;
}
```

- Replace every `as ChainDescriptor` cast with `chainOf(...)`.
- Tests that expected `undefined` now expect `{ status: "none" }`.
- Duplicate-root and root-only tests now expect `status: "refused"` with the same message regexes.
- In the e2e test (about line 275), read the payload as `descriptors[0]!.payload` and narrow it with
  `descriptors[0]!.capability === "chain"` before you use it.

### 10.4 D7 test (written first, see Section 2)

Put it in the plugins test folder next to the C2 test. Build `plans` the same way the C1 tests do, using
these plugins:

- A toy fold plugin `frame-src` with `fold: { outputs: ["x"], run: () => ({ x: 0 }) }` on track `body`.
- `pointPlugin` and `rootPlugin` on track `arm`. The root entry binds `requires: { frame: <body> }`.
  Copy the binding syntax from an existing passing test that binds a slot to another track in the
  same motion.
- `order: ["body", "arm"]`.

Assertions:

- Baseline (before Step 7): `kind === "refused"` with `derivation-missing-capability`.
- After the change: `kind === "accepted"`, and the `arm` chain payload has
  `rootPolicy.kind === "bound"`.

### 10.5 D8 test

Use the same harness, with a track that has two root entries and one point entry. Assert that exactly
ONE diagnostic matches the duplicate-root regex. Before D8, both `root.derive` and `point.derive`
reported it.

### 10.6 Do not touch

- `plugin-capabilities.test.ts`, which tests the ADR-136 port.
- `boundary-scan.test.ts`, whose `capabilities` text is fixture data.

Check: `npm test`. Everything must be green except the `BASELINE-n` failures.

---

## 11. Step 9: docs

1. New file `docs/ADR-142-plugin-structural-api.md`. Follow the format of
   `docs/ADR-141-captured-skeletons-and-parent-space-driving.md`: a `# ADR-142: Plugin structural API`
   title, `**Status:** Accepted, 2026-10-18`, then `## Context`, `## Decision` and `## Consequences`
   sections. Use prose and bullets, no tables, and stay under about 4 KB. Cover D1–D8 in one or two
   sentences each and point to the decisions doc for the reasons.
2. `docs/SESSION-STATUS.md`: rewrite the single "Now" bullet so it describes this change, and keep
   exactly one bullet in "Now" and one in "Next in line". Run the byte-ceiling test.
3. `docs/skeldata/CONTRACT.md`: fix statements that are now false:

- Line 24, "validate declared plugin capabilities": drop the plugin capabilities part.
- O-INV-02: stateless collect is a pure function. Records go to the single `collect` output, and
  core stamps `id`.
- The collision invariant (about line 134): collect + fold collision becomes "fold may not use the
  reserved output name `collect`".
- Add one invariant for `validate` and the `DeriveResult` statuses if the file lists derivation
  invariants. Otherwise leave that part alone.

4. `packages/core/src/domain/plugins.md`: update any paragraph about collect output names or plugin
   capabilities.
5. `docs/skeldata/STATUS.md`: add ADR-142 to the evidence list.

Do not edit any other docs.

---

## 12. Final gate

```bash
npm run format
npm run check
npm run test:boundaries
node scripts/read-budget-scan.mjs
wc -c packages/core/src/domain/plugins.ts packages/core/src/domain/project-runtime.ts
```

Each of these must return NOTHING:

```bash
grep -rn "collect: {" packages --include=*.ts
grep -rn "collectOutputs" packages --include=*.ts
grep -rnE "DerivationHookResult|PluginDerivationHook|readDescriptor|tryReadDescriptor|DerivationUndeclaredSourceError|ChainDescriptor|ChainRootPolicy" packages
grep -rn 'capability: "frame"' packages
grep -rn "capabilities:" packages/plugins/src packages/core/test/contract
grep -rnE "@ts-ignore|@ts-expect-error|: any\b|as any\b" packages/core/src packages/plugins/src
```

Suggested commits. Each one should typecheck if possible; the final one must pass the full gate.

1. `test: root bound to frame source is refused (D7 repro)`
2. `feat(core): typed capability map, tagged derive results, validate hook, collect array`
3. `feat(plugins): root policy module, chain capability augmentation, fold-only root`
4. `test: migrate collect/derive tests to plugin structural API`
5. `docs: ADR-142 plugin structural API`

If formatting changes unrelated files, put those changes in a separate commit or revert them.

---

## 13. Report template (paste this filled in)

```text
Branch: feat/plugin-structural-api (from feat/skeldata-v5-phase-c @ <sha>)
Baseline failures: BASELINE-1 ..., or "none"
D7 repro failed on baseline: yes/no (diagnostic seen: ...)
Steps done: 1..9 (note any deviation and why)
Files changed: <list>
New files: contract/capability.ts, contract/collect.ts, plugins/src/root-policy.ts, docs/ADR-142-...
Sizes: plugins.ts <bytes>, project-runtime.ts <bytes>
Gate: format ok / check ok / boundaries ok / read-budget ok
Forbidden-pattern greps: all empty / list hits
New tests: <names>
Deleted tests: <names + reason>
Deviations from brief: <list or none>
Follow-ups: plan pack docs update (C3–C7 wording), C4 chain-or-joined capability union (deferred)
```

---

## 14. Troubleshooting FAQ

TS2678 `Type '"derived"' is not comparable to type '"refused" | "none"'` in core
: Pass the plugin result through `toErased(...)` before the switch. Do not annotate a local variable.

Implicit any on `entry` or `context` in `point.ts` or `root.ts`
: Put `satisfies StatelessPluginDefinition` on the object literal inside `Object.freeze(...)`.

`Property 'run' does not exist on type 'FoldClaim'`
: Narrow first with `plugin.createEvaluator === undefined`, or check `"run" in plugin.fold`.

`Property 'payload' is unknown` or not the expected type in tests
: Narrow with `result.status === "derived" && result.capability === "chain"`. Other test
augmentations make the derived variant a union.

`Cannot augment module '@motion5/core/plugin-api'`
: Check that `plugin-api.ts` has `export type { CapabilityMap, CapabilityName } from   "./contract/capability";` and that `CapabilityMap` is an `interface`, not a `type`.

Boundary test fails for `contract/derivation.ts`
: The file must import only `contract/*` files. Move any `domain` import out of it.

The public declaration surface test fails
: A removed or renamed name is still reachable from the `plugin-api` d.ts closure, or a new export
pulls in a core-internal file. Export only the names listed in Step 2.

A collect record is missing `id`, or contains `values` or `inputs`
: `point.collect` must spread `entry.values`. Core stamps `id` in `executeCollectOperation`.

Derivation count is off by one in the C1 tests
: Count only `derive` calls. Skip counting when `validate` fails or a capability is missing.
