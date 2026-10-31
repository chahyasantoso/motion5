# ADR-134: Plugin batches are admitted entirely or not at all

**Status:** Accepted, 2026-10-04

## Context

Composition roots register several plugins into registry Engine holds by reference. Loop over `register` publishes prefix when later definition fails. Caller-side recovery would make every caller know every registry index, reverse its writes.

Admission also read caller properties repeatedly, then stored own-property spread. Getter could supply one keys array to validation, another to storage. Class prototype method could pass compose guard, vanish from spread. Validation/storage disagreements, not reason to add another public registration mechanism.

## Decision

`PluginRegistry.registerAll` admits array entirely before storing any member. `register` delegates to one-member batch. `plugin-admission.ts` owns validation + frozen definition snapshot; registry supplies names + input owners already registered or admitted earlier in batch. Only name/input collisions read staged state. Registration order assigned at commit.

Every definition copied once from own enumerable properties; all checks read that snapshot. Non-objects refused before spreading. Prototype-only compose method refused with existing compose TypeError; own compose field stays valid. Array metadata copied + frozen. Requirement freezing keeps existing nested-object behavior. Shared `isRecord` + `deepFreeze` helpers move to admission, imported by composition, no extra copy or runtime cycle.

Existing guards keep order + messages. Duplicate keys + requirement slots stay legal. Two distinct definitions owning same input refused; repeated input entries within one definition keep previous acceptance. Output collisions stay resolution-time diagnostics. Empty array no-op. Non-arrays throw `TypeError("Plugin definitions must be an array.")`.

Admission invokes no plugin hooks, but own getters + metadata proxies can run arbitrary code. Nested registration on same registry during admission refused with `TypeError("Plugin registration is already in progress.")`; `finally` resets guard after success or refusal. Without guard, getter could publish nested registration before outer batch failed. Commit phase reads only admitted objects, performs map/array writes.

Existing stage union still uses exhaustive `stageRank` switch. Batch has one shape + synchronous exceptions → needs no new union or asynchronous failure type.

## Alternatives rejected

**Loop and unregister on failure.** Needs inverse for every registry index; publishes partial state before rollback. Published registry held by reference.

**Swap a fresh registry.** Breaks Engine's retained registry identity; duplicates state.

**Keep separate single and batch validation.** Two owners drift in guard order, diagnostics, snapshot reads, freeze behavior.

**Ignore reentrant getters.** User callback can register into same registry mid-admission, defeating all-or-nothing invariant before store phase starts.

## Consequences

Composition roots use one batch in historical order. No plugin implementation or graph behavior changes. Validation linear in batch metadata + constant-time name/input lookups; staging costs one entry per definition + one owner per declared input.

Top-level getter reads now happen once while constructing snapshot. Throwing getter propagates before insertion; own external side effects not transactional. Requirements stored as frozen copy → admission no longer freezes caller-owned nested objects. Non-string `keys`, `inputs`, `outputs` entries refused by name, not failing inside colon check. No impossible guarantee about memory exhaustion or modified host built-ins.

## Evidence

`plugin-register-all.test.ts` covers TH-205 through TH-214: malformed members anywhere, in-batch name/input collisions, existing collisions, input order, empty/non-array demand, one keys read, prototype-only compose refusal, non-string metadata entries, requirement copying. Extra cases pin own compose fields, frozen metadata, unchanged output-collision timing, getter failure, reentrancy, exact guard messages.

Failing-first assertion reports + exact local checkpoint identities belong in owning handover and, after publication, its pull request. Supplemental sandbox verification is not exact-head Node 24 CI, still required before merge.
