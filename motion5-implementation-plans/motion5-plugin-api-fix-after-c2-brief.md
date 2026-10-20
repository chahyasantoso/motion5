# Fix brief: plugin structural API follow-up (branch `feat/plugin-structural-api`)

Audience: Gemini Flash (implementer). Reviewer: Claude. Work on the existing branch
`feat/plugin-structural-api` (HEAD `93584f2`). Do not create a new branch. Do not rebase or amend
existing commits; add new commits.

Background: the branch implemented decisions D1–D8
(`motion5-implementation-plans/motion5-plugin-api-decisions.md`). Review found one real bug, three
follow-ups, and the architect added one design simplification (F5). This brief covers all of them. If
this brief and the decisions doc disagree, this brief wins for items F1–F5 only. If anything is unclear, stop and report. Do not guess.

---

## 0. Decisions (already made by the architect, do not reopen)

- F1 The duplicate-root rule goes back to the `root` plugin. `root.derive` is restored but checks
  ONLY duplicate roots. A track with only root entries is a legal generic track: it gets no `chain`
  capability, and any consumer that requires one (FK, IK) is refused by core with
  `derivation-missing-capability`. There is no eager "root-only" error any more. D8 in the decisions
  doc is revised accordingly.
- F2 Plugins build derive results with three exported constructors: `derived`, `refused`, `none`.
  Object literals with `status: ...` are no longer written by hand in `src`.
- F3 ADR-142 is rewritten so its D1–D8 numbering matches the decisions doc, and it records F1, F2
  and F5.
- F5 One execution model. Plugin definitions always carry `collect` and `fold` as real functions. A
  plugin is stateful when it declares `init` (initial state) and `prepare` (shared work, returns the
  next state). There is no `createEvaluator`, no evaluator object and no `collect: true` or
  `fold: { outputs }` claims. D1 in the decisions doc is revised accordingly. State is still staged
  and committed atomically exactly as before.
- F4 No change: a refused track still makes downstream plugins report
  `derivation-missing-capability`. This is accepted. Do not add skipping logic.

---

## 1. Hard rules

- Never use `any`, `@ts-ignore`, `@ts-expect-error` or `eslint-disable` in `src`. In tests,
  `@ts-expect-error` is allowed only where this brief names it (Section 4, test C). In tests,
  `as unknown as PluginDefinition` is allowed only to feed deliberately bad JS input to admission.
  The only allowed cast in `src` for F5 is the one inside `defineStatefulPlugin`.
- Do not touch the legacy compose plugins (`transform`, `fk`, `ik`, `rig`, ...).
- Do not touch `ports/plugin-capabilities.ts`, `CompiledEntryPlan.capabilities`,
  `registry.capabilityOf`.
- Do not edit plan-pack files other than `motion5-plugin-api-decisions.md` (Section 6). In particular
  do NOT edit `cache-contract.md`; the architect updates it. Record it as a follow-up.
- Keep every existing diagnostic rule id and message, unless this brief gives a new one.
- Comments only when a name cannot carry the meaning, max 250 characters each.
- Prettier: printWidth 100, double quotes, trailing commas. Run `npm run format`, but if it changes
  files you did not touch, revert those and say so in the report.
- No markdown tables in repo `.md` files. Use bullets.
- `plugin-api.ts` stays re-export-only (ADR-133).
- `contract/` must not import from `domain/`.
- No new dependencies.

Stop and report (do not improvise) if:

- A step needs a file this brief does not mention and the change is not a mechanical import/rename.
- The same type error survives 3 fix attempts.
- A test not named in this brief starts failing.

---

## 2. Baseline (do this first)

```bash
git checkout feat/plugin-structural-api
npm ci
npm run typecheck 2>&1 | grep "error TS" | sort > /tmp/ts-before.txt
npm test 2>&1 | grep -E "^ (FAIL|❯)" | sed -E 's/ [0-9]+ms$//; s/ >.*//' | sort -u > /tmp/fail-before.txt
wc -l /tmp/ts-before.txt /tmp/fail-before.txt
```

Known state on the reviewer's machine: about 140 pre-existing type errors and 423 pre-existing failing
tests (114 files), mostly legacy plugin/runtime suites. They exist on the base branch too. You do not
fix them. Your gate (Section 7) is: the sets after your change equal the sets before, plus all tests
named in this brief pass.

Targeted suites that must pass before and after:

```bash
npx vitest run packages/plugins/test/unit/chain-layout-c2.test.ts \
  packages/plugins/test/unit/root-duplicate-d8.test.ts \
  packages/plugins/test/unit/root-frame-d7.test.ts \
  packages/plugins/test/unit/loader.test.ts \
  packages/core/test/contract/structural-derivation-c1.test.ts \
  packages/core/test/contract/execution-plan-b2.test.ts \
  packages/core/test/contract/operations-b6.test.ts \
  packages/core/test/contract/staged-state-b7.test.ts
```

---

## 3. F2 first: derive result constructors

Do F2 before F1, because F1 uses them.

### 3.1 `packages/core/src/contract/derivation.ts`

Add (below `DeriveResult`):

```ts
export function derived<K extends keyof CapabilityMap>(
  capability: K,
  payload: CapabilityMap[K],
): DeriveResult {
  return Object.freeze({ status: "derived", capability, payload }) as DeriveResult;
}

export function refused(diagnostics: readonly [Diagnostic, ...Diagnostic[]]): DeriveResult {
  return Object.freeze({ status: "refused", diagnostics });
}

export const none: DeriveResult = Object.freeze({ status: "none" });
```

Notes:

- First try `derived` WITHOUT the `as DeriveResult` cast. If TypeScript rejects it (generic `K` does not
  narrow into the distributive union), keep the single cast and add one comment of at most 250
  characters saying why (generic key to mapped union). This is the only allowed cast in this file.
- `Object.freeze` results of `refused`/`none` must type-check without casts. If `none` needs one,
  stop and report.
- Do not export `ErasedDeriveResult`, `DeriveResultOf` or `CapabilityReadError` anywhere new.

### 3.2 `packages/core/src/plugin-api.ts`

Add one value re-export, keeping the file re-export-only:

```ts
export { derived, none, refused } from "./contract/derivation";
```

If a test allow-lists the public declaration surface of `plugin-api` or `index.ts`
(`public-declaration-surface`, `entrypoint` or similar), update that allow-list to include exactly
these three names, in the same commit.

### 3.3 Use the constructors

Replace every hand-written `{ status: "derived" | "refused" | "none", ... }` that is a plugin derive
result, in `src` and in tests:

- `packages/plugins/src/chain-layout.ts` (4 places): use `derived("chain", payload)`, `none`,
  `refused([...])`. Delete the outer `Object.freeze` around the derived result.
- `packages/core/test/contract/structural-derivation-c1.test.ts` (13 places) and
  `packages/plugins/test/unit/chain-layout-c2.test.ts` (2 places): use the constructors.
- LEAVE ALONE: `packages/plugins/src/root-policy.ts`. Its `{ status: "ok" | "refused" }` is
  `RootPolicyResult`, a different type.
- LEAVE ALONE: the malformed-result test (`{ status: "weird" } as unknown as DeriveResult`). It must
  stay a raw object, because it tests the runtime guard.
- LEAVE ALONE: `contract/derivation.ts` type definitions and `structural-derivation.ts` (it consumes
  results, it does not build them).

Check: `npm run typecheck` — error set equals `/tmp/ts-before.txt` (no new errors). Then run the
targeted suites. Commit: `feat(core): derived/refused/none constructors for DeriveResult`.

---

## 4. F1: restore root ownership of root rules

### 4.1 Rule ownership after this change

- `root` owns: at most one root entry per track. Nothing else.
- `point` (chain layout) owns: the chain payload. It only READS the root policy.
- Core stays generic and knows nothing about root.

### 4.2 `packages/plugins/src/root.ts`

Add `derive` back. Keep `requirements`, `fold` and the `satisfies StatelessPluginDefinition` exactly
as they are now.

```ts
import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { diagnostic, none, refused } from "@motion5/core/plugin-api";
import { readFrame } from "./frame";
import { readRootPolicy } from "./root-policy";

// inside the frozen object:
derive: (context) => {
  const policy = readRootPolicy(context.inventory);
  return policy.status === "refused" ? refused(policy.diagnostics) : none;
},
```

Import only `none` and `refused` from `plugin-api` here (drop `diagnostic` if unused).

The duplicate-root message text must stay identical to what `readRootPolicy` emits today
(`Duplicate root entries on chain track "<id>". At most one root entry permitted.`). Do not add a
root-only rule. The base branch's "Root-only track ... is invalid" refusal is intentionally REMOVED:
a root-only track is legal and simply has no `chain` capability (see F1 in Section 0).

### 4.3 `packages/plugins/src/chain-layout.ts`

- `readRootPolicy(...)` returning `refused` now returns `none` (the `root` plugin reports it, so the
  error must not appear twice). Add one comment (max 250 chars): `root` reports duplicate roots, so
  chain layout stays silent here.
- Delete the whole "no point entries" block that returned the `Root-only track ... chain source
requires at least one point entry` diagnostic. When there are no point entries, return `none`
  (no points means no chain; consumers that need a chain are refused by core).
- Everything else unchanged: payload shape, `layoutIdentity` strings, `rootPolicyToken` use.

Resulting top of the function:

```ts
export function deriveChainLayout(inventory: DerivationTrackInventory): DeriveResult {
  const trackId = inventory.trackId ?? "track";
  if (inventory.entries.length === 0) return none;
  for (const entry of inventory.entries) {
    if (entry.plugin !== "point" && entry.plugin !== "root") return none;
  }
  const root = readRootPolicy(inventory);
  if (root.status === "refused") return none; // + comment
  const pointEntries = inventory.entries.filter((e) => e.plugin === "point");
  if (pointEntries.length === 0) return none;
  // ... build payload, then:
  return derived("chain", payload);
}
```

### 4.4 `packages/plugins/src/root-policy.ts`

No change, except: if a comment or name still says the policy is "chain track" specific in a message,
keep the message text unchanged (tests match it by regex).

### 4.5 Tests

A) Retarget the two existing tests in `chain-layout-c2.test.ts` (around lines 155 and 170):

- "fails derivation when duplicate root entries are present" must now go through the real hook of the
  owning plugin: call `rootPlugin.derive!(context)` with the same inventory context the file already
  builds, or run `deriveStructuralDescriptors` as the D8 test does. Assert `status: "refused"` (or
  outcome `refused`) and `/Duplicate root entries/`.
- "fails derivation for root-only tracks without points": DELETE it (the rule no longer exists) and
  replace it with: `deriveChainLayout` on an inventory with only root entries returns `none`.
- Add: `deriveChainLayout` with two roots plus one point returns `none`.

B) New file `packages/plugins/test/unit/root-rules-f1.test.ts`. Use the harness style of
`root-duplicate-d8.test.ts` (`PluginRegistry`, `compileExecutionPlan(..., { trackId: "arm" })`,
`deriveStructuralDescriptors`). Cases, each asserting `outcome.kind === "refused"` and the exact
count of matching diagnostics:

1. root only (one `root` entry): this one is ACCEPTED, not refused. Assert `outcome.kind ===
"accepted"`, zero diagnostics, and no `chain` descriptor for track `arm`.
   Also add a second track `consumer` with a toy plugin whose slot requires `capability: "chain"`
   bound to `arm` (copy the consumer toy pattern from `structural-derivation-c1.test.ts`; the toy
   declares its capability name through a test-local `declare module` only if `chain` is not already
   in the program, which it is once `chain-layout.ts` is imported, so just import it). Assert
   `outcome.kind === "refused"` with exactly 1 `derivation-missing-capability` diagnostic.
2. two roots, no point: refused, exactly 1 diagnostic matching `/Duplicate root entries/`.
3. two roots + one point + one toy fold plugin entry (a plugin that is neither point nor root; copy the
   `frame-src` toy from `root-frame-d7.test.ts`): exactly 1 diagnostic matching
   `/Duplicate root entries/`, and no `chain` descriptor.
4. one root + one point (valid): `outcome.kind === "accepted"`, one `chain` descriptor, `rootPolicy.kind`
   is `"unbound"` (no frame binding).
5. Keep `root-duplicate-d8.test.ts` as it is. It must still pass (two roots + one point gives exactly
   one duplicate diagnostic).

C) New file `packages/core/test/contract/derive-constructors.test.ts`:

- `derived("box", payload)` returns `{ status: "derived", capability: "box", payload }` and is frozen.
  Use a test-local `declare module "../../src/contract/capability" { interface CapabilityMap { box: ... } }`
  only if the C1 test does not already declare `box` in the same program. If `box` is already declared
  by `structural-derivation-c1.test.ts`, do not redeclare it with a different type: a duplicate key with
  a different type is a compile error. Reuse the same shape.
- `refused([d])` returns `{ status: "refused", diagnostics: [d] }` and is frozen.
- `none` equals `{ status: "none" }` and is frozen.
- One `// @ts-expect-error` is allowed on a `refused([])` call to prove an empty tuple is rejected at
  compile time. It is the only allowed use.

Check: targeted suites pass; `npm run typecheck` error set equals `/tmp/ts-before.txt`.
Commit: `fix(plugins): restore root-owned duplicate-root rule, drop eager root-only error (D8 revised)`.

---

## 4A. F5: one execution model (stateful = `init` + `prepare`, no evaluator factory)

Do F5 after F1 and F2. It is the largest change. Work in the sub-steps below and run the check at the
end of each one.

### 4A.1 Target shape (what plugin authors write after F5)

Stateless (unchanged for authors):

```ts
{ name, keys,
  collect?: (entry, ctx) => record,
  fold?: { outputs, run: (entry, prior, ctx) => delta } }
```

Stateful (the presence of `init` makes a plugin stateful):

```ts
defineStatefulPlugin<State, Prepared>({
  name, keys,
  init: (ctx, services) => State,                                  // once per entry instance
  prepare: (entry, state, services) => ({ prepared, state }),      // once per evaluation
  dispose?: (state) => void,
  collect?: (prepared, ctx) => record,
  fold?: { outputs, run: (prepared, prior, ctx) => ({ delta, state? }) },
})
```

Removed completely: `createEvaluator`, `EvaluatorFactory`, `StatefulEvaluator`,
`StatefulEvaluatorSpec`, `defineStatefulEvaluator`, `FoldClaim`, the claims `collect: true` and
`fold: { outputs }` without `run`, the evaluator-versus-claim mismatch checks, and the `evaluators` map
in track-operation options and results.

Kept: staged state commit (`committedStates` in, `proposedStates` out, swapped only on acceptance),
`EvaluatorServices` and the cache providers, `fold.outputs`, the single `collect` output, and the
internal `ExecutionStrategy` union (kinds `"stateless"` and `"stateful"`, consumed exhaustively with
`unreachable`). Plugin authors never write the strategy; core derives it from the definition.

### 4A.2 Behavior contract (must equal the old evaluator path)

For each stateful entry on each evaluation, in this order:

1. `committed = committedStates.get(compilerKey) ?? committedStates.get(entryId)`. If it is
   `undefined`, call `init(entryContext, services)` and use the result. `init` returning `undefined`
   throws `TypeError` (`Plugin "<name>" init must return a defined state.`).
2. `prepare(local, state, services)` runs once. The result must be a plain record with an own
   `prepared` property, otherwise `CompositionOutputError`
   (`Prepare for entry "<id>" must return { prepared, state }.`).
3. If `collect` is declared: `collect(prepared, local.context)`, then the existing
   `executeCollectOperation`.
4. If `fold` is declared: `fold.run(prepared, currentFold, local.context)`. The result must be a plain
   record with an own `delta`, otherwise `CompositionOutputError`
   (`Fold for entry "<id>" must return { delta, state? }.`). If `result.state !== undefined` it becomes
   the final state; otherwise `prepare`'s state is final. Then the existing `executeFoldOperation`.
5. `proposedStates.set(entry.compilerKey, finalState)`.

`services` is computed exactly as today:
`{ cache: services?.cache ?? DEFAULT_CACHE_PROVIDER, ...(services ?? {}) }`.
`collect`/`fold`/`prepare` never run more than once per evaluation. Nothing in core calls `dispose`
(it is not wired today either).

### 4A.3 Sub-step A: type spike (do this before touching anything else)

1. In `packages/core/src/domain/plugins.ts` replace `FoldClaim` and the stateful interface with the
   types below. Delete `FoldClaim`. `StatelessFold` becomes a standalone interface
   `{ outputs; run }`. Remove the `EvaluatorFactory` import.

```ts
export interface StatefulFold<P = unknown, S = unknown> {
  readonly outputs: readonly string[];
  readonly run: (
    prepared: P,
    prior: Readonly<Record<string, unknown>>,
    ctx: LocalEvaluationContext,
  ) => { readonly delta: Readonly<Record<string, unknown>>; readonly state?: S };
}

export interface StatelessPluginDefinition extends PluginDefinitionBase {
  readonly init?: never;
  readonly prepare?: never;
  readonly dispose?: never;
  readonly collect?: CollectRun;
  readonly fold?: StatelessFold;
}

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

export type PluginDefinition = StatelessPluginDefinition | StatefulPluginDefinition;
```

2. New file `packages/core/src/domain/stateful-plugin.ts` (keeps `plugins.ts` small):

```ts
import type { PluginDefinition, StatefulPluginDefinition } from "./plugins";

export function defineStatefulPlugin<S, P>(
  definition: StatefulPluginDefinition<S, P>,
): PluginDefinition {
  // one cast: S and P are erased at the registry boundary; typed callbacks stay typed for authors
  return Object.freeze(definition) as unknown as PluginDefinition;
}
```

This is the ONLY allowed cast for F5. No `any`.

3. Scratch check: write a temporary test file that ports B7-14 (text measure with cache table) to
   `defineStatefulPlugin<PluginState, Prepared>({...})` and run `npx tsc --noEmit -p <repo tsconfig>`
   (or `npm run typecheck`). It must compile with typed `state` and `prepared` inside the callbacks.
   STOP AND REPORT if it needs `any` or a second cast. Delete the scratch file before committing.

Check: no new type errors outside the files this sub-step names (expect errors in admission,
execution-plan, track-operations, cache, plugin-api and the factory-based tests).

### 4A.4 Sub-step B: admission (`plugin-admission.ts`)

Replace the whole `createEvaluator` / claims block (the one that currently starts with
`if (source.createEvaluator !== undefined)`) with:

```ts
if ("createEvaluator" in source) {
  throw new TypeError(
    `Plugin "${source.name}" createEvaluator was removed; declare init and prepare instead.`,
  );
}
if (source.init !== undefined) {
  if (typeof source.init !== "function")
    throw new TypeError(`Plugin "${source.name}" init must be a function when provided.`);
  if (typeof source.prepare !== "function")
    throw new TypeError(`Plugin "${source.name}" with init must declare prepare as a function.`);
  if (source.dispose !== undefined && typeof source.dispose !== "function")
    throw new TypeError(`Plugin "${source.name}" dispose must be a function when provided.`);
} else if (source.prepare !== undefined || source.dispose !== undefined) {
  throw new TypeError(`Plugin "${source.name}" declares prepare or dispose without init.`);
}
if (source.collect !== undefined && typeof source.collect !== "function")
  throw new TypeError(`Plugin "${source.name}" collect must be a function.`);
if (source.fold !== undefined && typeof source.fold.run !== "function")
  throw new TypeError(`Plugin "${source.name}" fold run must be a function.`);
```

- Keep the existing `fold.outputs` checks and the reserved `collect` name check as they are.
- Delete: the "must claim collect as true" check and the "factory and stateless run callbacks" check.
- Keep the first "must declare collect, fold, or both operations." condition exactly as it is.
- If the admitted copy of the definition is rebuilt field by field, add `init`, `prepare`, `dispose`
  to what is copied and remove `createEvaluator`.
- Admission stays the only owner of definition-shape checks.

### 4A.5 Sub-step C: execution plan (`execution-plan.ts`)

1. Delete `StatefulEvaluator`, `EvaluatorFactory` and `createEntryEvaluator`. Keep `EvaluatorContext`,
   `LocalEvaluation`, `LocalEvaluationContext`.
2. Add and export:

```ts
export function entryEvaluatorContext(plan: CompiledEntryPlan): EvaluatorContext {
  return Object.freeze({
    ...(plan.lifecycle.trackId !== undefined ? { trackId: plan.lifecycle.trackId } : {}),
    entryId: plan.lifecycle.entryId,
    compilerKey: plan.lifecycle.compilerKey,
    generation: plan.lifecycle.generation,
    plugin: plan.lifecycle.pluginName,
  });
}
```

(the same object `createEntryEvaluator` built before). 3. `ExecutionStrategy`:

```ts
export type ExecutionStrategy =
  | {
      readonly kind: "stateless";
      readonly collect?: CollectRun;
      readonly fold?: StatelessFold["run"];
    }
  | {
      readonly kind: "stateful";
      readonly init: StatefulPluginDefinition["init"];
      readonly prepare: StatefulPluginDefinition["prepare"];
      readonly dispose?: StatefulPluginDefinition["dispose"];
      readonly collect?: StatefulPluginDefinition["collect"];
      readonly fold?: StatefulFold["run"];
    };
```

4. `executionStrategyOf(plugin)`: if `plugin.init !== undefined` (this narrows to the stateful
   definition) return a frozen `stateful` strategy copying `init`, `prepare`, and the optional
   `dispose`, `collect`, `fold.run`; otherwise the frozen `stateless` strategy as today.
5. `operations.collect` is `true` iff `typeof plugin.collect === "function"`. `operations.fold` is built
   from `plugin.fold.outputs` as today. Both are static facts now, read straight from the definition.
6. `assertExecutionStrategy` returns `"stateless" | "stateful"`.

### 4A.6 Sub-step D: track operations (`track-operations.ts`)

1. Remove the `evaluators` field from `ExecuteTrackOperationsOptions`, `TrackOperationsResult`,
   `TrackEvaluationBatchResult` and every other place (`grep -n evaluators`). Remove the
   `activeEvaluators` map and the `createEntryEvaluator` and `StatefulEvaluator` imports.
2. Replace the `case "factory"` body with the 4A.2 sequence for `case "stateful"`. Keep the
   `case "stateless"` body unchanged. Keep `default: unreachable(strategy)`.
3. Keep `isPlainRecord` and `CompositionOutputError` use for the result-shape checks.

### 4A.7 Sub-step E: cache module and public API

1. `cache.ts`: delete `StatefulEvaluatorSpec` and `defineStatefulEvaluator` and the now-unused
   `LocalEvaluation` import. Keep everything else (snapshots, providers, `EvaluatorServices`).
2. `plugin-api.ts` (still re-exports only): remove `EvaluatorFactory`, `StatefulEvaluatorSpec`,
   `defineStatefulEvaluator`, `FoldClaim`. Add `defineStatefulPlugin`, `StatefulFold`. If `CollectRun`,
   `StatefulPluginDefinition` or `defineStatefulPlugin` reference `EvaluatorContext`, `LocalEvaluation`
   or `LocalEvaluationContext`, export those types from `plugin-api` too (the public declaration
   surface test tells you). Update the public-surface allow-list test for exactly these changes.

Check: `npm run typecheck` shows no new errors in `src`. Remaining errors must be only in the tests of
sub-step F.

### 4A.8 Sub-step F: port the tests (intent must be preserved)

Files: `packages/core/test/contract/execution-plan-b2.test.ts`, `operations-b6.test.ts`,
`staged-state-b7.test.ts`, and any other test that mentions the removed names
(`grep -rlE "createEvaluator|defineStatefulEvaluator|StatefulEvaluator|EvaluatorFactory" packages`).
Rewrite each factory-based plugin with `defineStatefulPlugin` and keep every assertion about behavior.

- B2 strategy test (around lines 212 to 270): kinds are `"stateless"` and `"stateful"`; `init`
  receives the context (`plugin`, `entryId`, ...) and the services, once per entry instance
  (`executeTrackOperations` once gives count 1 per entry). DELETE the assertion that
  `createEntryEvaluator` refuses a stateless entry (the function no longer exists).
- B2 "refuses mixed execution definitions" test (around line 274): becomes admission tests, all
  asserted through `PluginRegistry.register` with `as unknown as PluginDefinition` for bad JS input:
  `createEvaluator` present is refused with the new message; `init` without `prepare` is refused;
  `prepare` or `dispose` without `init` is refused. Keep the second half (two entries of one stateful
  plugin get separate state): `init` is called once for each of two entries.
- B6-13: shared prepared data between `collect` and `fold`.
- B7-14 (cache table), B7-15 (stateless unchanged), B7-16 (collect-only, fold-only, both),
  B7-17 (fold-dependent cache keys), B7-18 (isolation across entries), B7-19 (abort preserves committed
  state), B7-20 (retry matches cold), B7-22 (provider equivalence): same inputs, same expected outputs.
  B7-17 currently keeps a mutable closure variable (`currentCommitted`). Replace it by carrying the
  state through `prepared` (prepared includes `state`), which is the rule in the cache contract.
- B7-21 (disposal): run `executeTrackOperations`, read
  `res.proposedStates.get(compilerKey)`, call `plugin.dispose!(thatState)` and assert it received that
  exact state object. Rename it `B7-21: dispose receives the entry state`.
- B7-23 (was `defineStatefulEvaluator` validation): replace by admission checks on `init`, `prepare`,
  `dispose`, `collect`, `fold.run` shapes (bad JS input via `as unknown as PluginDefinition`).
- New tests (put them in `staged-state-b7.test.ts` as B7-24 to B7-26):
  - B7-24: `init` returning `undefined` throws `TypeError` with the message in 4A.2.
  - B7-25: a `fold` result with no `state` keeps `prepare`'s state; a `fold` result with `state`
    overrides it. Assert through `proposedStates`.
  - B7-26: a second evaluation with `committedStates` supplied does NOT call `init` again.

Check: the three contract suites pass, `npm run typecheck` error set equals `/tmp/ts-before.txt`.
Commit: `refactor(core): one execution model, stateful plugins declare init and prepare`.

---

## 5. F3: rewrite ADR-142

Replace the body of `docs/ADR-142-plugin-structural-api.md` with the text below. Keep the filename.
It must stay under 4 KB, use bullets and prose only (no tables), and keep the `**Status:**` line.
Source of D-numbers: `motion5-implementation-plans/motion5-plugin-api-decisions.md`.

```md
# ADR-142: Plugin structural API

**Status:** Accepted, 2026-10-18

## Context

Phase C structural derivation shipped with untyped descriptor payloads, a collect output every
plugin had to name, two execution models (callbacks, or an evaluator factory with claims that
duplicated them), plugin-level `capabilities[]` nothing read, one hook that both validated and
produced layouts, and a `root` requirement for a `frame` capability no plugin provides. Reasons:
`motion5-implementation-plans/motion5-plugin-api-decisions.md`.

## Decision

- **D1 Collect and execution:** collect has no label; records go to the reserved output `collect`
  and fold outputs may not use that name. `collect` and `fold` are always functions on the
  definition. A plugin is stateful when it declares `init` and `prepare`; there is no evaluator
  factory and there are no claims. State is staged and committed atomically as before.
- **D2 Derive result:** `derive` returns `derived`, `refused` or `none`, built with the constructors
  of the same names and settled by one exhaustive switch. One payload per plugin per track and per
  capability per source. A refused track makes downstream bindings report
  `derivation-missing-capability`.
- **D3 Validate:** `validate` reads only payloads of sources bound through the plugin's own
  capability slots. Order: capability presence, `validate`, then `derive` (skipped on error).
- **D4 Capability list removed:** `PluginDefinition.capabilities[]` and its exports are deleted.
- **D5 Capability map:** `CapabilityMap` is open, re-exported from `plugin-api`, extended with
  `declare module "@motion5/core/plugin-api"`. `ctx.read(name, source)` is typed.
- **D6 Slot capability is the permission:** a slot's `capability` is both the presence check and the
  right to read it.
- **D7 Root frame:** `root` no longer requires the `frame` capability. Frame is a runtime value.
- **D8 Root rules stay with `root`:** `root.derive` refuses duplicate roots; chain layout reads the
  policy through `readRootPolicy` and stays silent when refused. A root-only track is a legal generic
  track without `chain`; FK and IK bound to it get `derivation-missing-capability`.

## Alternatives rejected

- Several collect outputs, per-plugin capability manifests, diagnostics inside descriptors.
- Root rules inside chain layout: they never run without a point entry.
- An eager root-only error: the capability model already refuses the consumers.
- Keeping the evaluator factory with claims: two declarations of one fact.

## Consequences

- One collect array per track; C5 reads it through the source capability.
- Join (C3) reuses `readRootPolicy` and adds `joined` to `CapabilityMap`.
- `cache-contract.md` section 4 is updated by the architect; `dispose` is not yet wired.

## Evidence

- `root-frame-d7.test.ts`, `root-duplicate-d8.test.ts`, `root-rules-f1.test.ts`.
- `structural-derivation-c1.test.ts`, `staged-state-b7.test.ts` (B7-14 to B7-26).
```

Commit (together with Section 6): `docs: ADR-142 numbering matches decisions doc, record constructors, root ownership and execution model`.

---

## 6. Doc follow-ups (same commit as F3 or a separate `docs:` commit)

1. `motion5-implementation-plans/motion5-plugin-api-decisions.md` (the only plan-pack file you may
   edit):
   - D2: add one bullet saying plugins build results with the constructors `derived`, `refused`,
     `none`, and that a refused track makes downstream report `derivation-missing-capability`
     (accepted).
   - D8: replace the section body so it says `root.derive` is KEPT, owns only the duplicate-root
     refusal, chain layout returns `none` when the policy is refused, and a root-only track is a legal
     generic track with no chain (consumers get `derivation-missing-capability`). Delete the sentence
     that says `root.derive` is deleted.
   - D1: replace the whole section body (code blocks and rules) with a short version (at most 25
     lines, bullets and one code block) that matches F5: no label, reserved `collect` output, `collect`
     and `fold` always functions, stateful means `init` plus `prepare` (show the stateful shape from
     Section 4A.1), no evaluator factory, no claims, admission rules from 4A.4, and the one execution
     strategy union with kinds `stateless` and `stateful`. State that the old text (factory claims,
     `collect: true`) is superseded.
   - Do not touch other sections.
2. `docs/skeldata/STATUS.md` line 9 mentions `ChainRootPolicy`. Rename to `RootPolicy`. Add a short
   follow-ups bullet list (bullets, no tables) at the bottom of the file with exactly these items:
   - N1: `00-overview.md` line 105 still says "Root-only FK is valid, root-only IK is not". Correct
     it to "FK and IK both need a skeleton source with points; a root-only track has no skeleton
     capability". The architect edits the plan pack; you only record this bullet.
   - `join` capability `joined` and chain-or-joined slot union: C3/C4.
   - `plugin-capabilities.test.ts` ADR-136 parts stay until C6.
   - `cache-contract.md` section 4 and any D4/D5 plan text still describe the evaluator factory and
     claims; the architect updates them to `init`/`prepare`.
   - `dispose(state)` and `committedStates` are exercised only by tests; wire them into the runtime
     transaction when that slice lands.
3. `docs/SESSION-STATUS.md`: rewrite (do not append) the single "Now" bullet to: plugin structural API
   follow-up landed (root rules restored to `root`, derive result constructors, ADR-142 corrected).
   Keep exactly one bullet under "Now" and one under "Next in line". Run
   `npx vitest run packages/core/test/unit/scripts/session-status-shape.test.ts`.
4. `docs/skeldata/CONTRACT.md` T-INV-07 (around line 198): replace
   "Root-only IK refuses. Root-only FK is valid (composes root tip)." with
   "A root-only track has no skeleton capability, so IK and FK bound to it refuse." Also in Case 1 of
   section 5 (around line 361), keep the valid one-point FK example and change the invalid example
   wording to say it is refused because the root-only track has no `chain` capability. Keep the
   `ik-solver-no-solve-members` rule id if the file names it.
5. `docs/skeldata/CONTRACT.md` (around lines 340 to 356, "Factory-backed definition" and the
   execution-owner list): replace the factory-backed paragraph with: "Stateful definition: declares
   `init(context, services)` for initial state and `prepare(localEvaluation, state, services)`, which
   returns immutable prepared data and a state proposal. Optional `collect(prepared)` returns the
   single item. Optional `fold.run(prepared, priorFold)` returns `{ delta, state? }`; an absent state
   keeps `prepare`'s proposal. Core validates the candidate and commits opaque state with outputs
   atomically." In the owner list change "generic evaluator factory seams" to "stateful definition
   seams (`init`/`prepare`)". Keep the stateless paragraph as is.
6. `docs/skeldata/LIFECYCLE.md` step 4 (around line 22): change "Execute plugin evaluators via
   immutable `EvaluatorServices`" to "Execute plugin operations; stateful plugins receive immutable
   `EvaluatorServices` in `init` and `prepare`". Replace "`prepare(localEvaluation, committedState)`"
   with "`prepare(localEvaluation, state)`". Change nothing else there.
7. `packages/core/src/domain/plugins.md`: only if a paragraph there describes collect output names, plugin
   `capabilities`, or the evaluator factory (update it to `init`/`prepare`); otherwise leave unchanged and say so in the report.

---

## 7. Final gate

```bash
npm run format
npm run typecheck 2>&1 | grep "error TS" | sort > /tmp/ts-after.txt
diff /tmp/ts-before.txt /tmp/ts-after.txt            # must be empty
npm test 2>&1 | grep -E "^ (FAIL|❯)" | sed -E 's/ [0-9]+ms$//; s/ >.*//' | sort -u > /tmp/fail-after.txt
diff /tmp/fail-before.txt /tmp/fail-after.txt        # must be empty
npm run test:boundaries
node scripts/read-budget-scan.mjs
npx vitest run packages/plugins/test/unit/chain-layout-c2.test.ts \
  packages/plugins/test/unit/root-duplicate-d8.test.ts \
  packages/plugins/test/unit/root-frame-d7.test.ts \
  packages/plugins/test/unit/root-rules-f1.test.ts \
  packages/plugins/test/unit/loader.test.ts \
  packages/core/test/contract
wc -c packages/core/src/domain/plugins.ts packages/core/src/domain/track-operations.ts packages/core/src/domain/execution-plan.ts   # each under 60000
wc -c docs/ADR-142-plugin-structural-api.md          # under 4096
```

If a `contract` suite fails now but also failed in `/tmp/fail-before.txt`, that is pre-existing: list
it, do not fix it.

These must print NOTHING:

```bash
grep -rnE 'status: "(derived|refused|none)"' packages/plugins/src | grep -v root-policy.ts
grep -rnE "@ts-ignore|@ts-expect-error|: any\b|as any\b|eslint-disable" packages/core/src packages/plugins/src
grep -rn "ChainRootPolicy\|ChainDescriptor" packages docs
grep -rnE "defineStatefulEvaluator|StatefulEvaluatorSpec|EvaluatorFactory|FoldClaim|StatefulEvaluator\b|createEntryEvaluator|activeEvaluators" packages docs/skeldata
grep -rn "createEvaluator" packages docs/skeldata
```

Exceptions you may keep (and list in the report): the `status` literals in `root-policy.ts`
(`RootPolicyResult`), the contract type definitions in `contract/derivation.ts`, and for the LAST grep
only the admission refusal string `createEvaluator was removed` plus the tests that assert it. Hits
inside `docs/ADR-142-*` and the plan pack are fine (they are outside the searched paths).

Commits (4), in this order:

1. `feat(core): derived/refused/none constructors for DeriveResult`
2. `fix(plugins): restore root-owned duplicate-root rule, drop eager root-only error (D8 revised)`
3. `refactor(core): one execution model, stateful plugins declare init and prepare`
4. `docs: ADR-142 numbering matches decisions doc, record constructors, root ownership and execution model`

---

## 8. Notes

- N1: the base-branch `root.derive` refused any track with no `point`/`join` entry, including
  `root` plus another plugin. That eager rule is removed on purpose (architect decision): only
  duplicate roots are refused by `root`. Do not re-add a root-only check anywhere.
- F5 changes no observable behavior of outputs: B7-14 to B7-22 keep their inputs and expected
  outputs. If a ported test needs different expected values, stop and report; do not edit the
  expectation.
- Nothing calls `dispose` in core today and F5 does not add a caller.
- The `point` plugin still returns `none` for mixed tracks (root/point plus another plugin). That is
  intended.

## 9. Report template (paste filled in)

```text
Branch: feat/plugin-structural-api, new commits: <shas>
Baseline: ts errors <n>, failing test files <n> (saved /tmp/*-before.txt)
Gate: ts diff empty yes/no; failing-set diff empty yes/no; boundaries ok; read-budget ok
Targeted suites: pass/fail list
Constructor cast needed in derived(): yes/no (reason if yes)
Type spike (4A.3) compiled without any/second cast: yes/no
Ported tests: <B2, B6-13, B7-14..B7-23 status>; new tests B7-24..B7-26
File sizes: plugins.ts, track-operations.ts, execution-plan.ts <bytes>
Public-surface allow-list updated: yes/no (file)
New tests: <names>
Retargeted tests: <names>
Forbidden-pattern greps: all empty / list hits
ADR size: <bytes>
plugins.md changed: yes/no
Deviations from brief: <list or none>
Open questions: <list or none>
```
