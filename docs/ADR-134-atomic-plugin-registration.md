# ADR-134: Plugin batches are admitted entirely or not at all

**Status:** Accepted, 2026-10-04

## Context

Composition roots register several plugins into the registry an Engine holds by reference. A loop
over `register` publishes a prefix when a later definition fails. Recovering at the caller would
require every caller to know every registry index and reverse its writes.

Admission also read caller properties repeatedly, then stored an own-property spread. A changing
getter could supply one keys array to validation and another to storage. A class prototype method
could pass the compose guard but disappear from that spread. Those are validation/storage
disagreements, not reasons to add another public registration mechanism.

## Decision

`PluginRegistry.registerAll` admits an array entirely before storing any member. `register` delegates
to a one-member batch. `plugin-admission.ts` owns validation and the frozen definition snapshot;
the registry supplies the names and input owners already registered or admitted earlier in the
batch. Only name/input collisions read staged state. Registration order is assigned during commit.

Every definition is copied once from own enumerable properties, and all checks read that snapshot.
Non-objects are refused before spreading. A prototype-only compose method is refused with the
existing compose TypeError; an own compose field remains valid. Array metadata is copied and frozen.
Requirement freezing retains the existing nested-object behavior. Shared `isRecord` and `deepFreeze`
helpers move to admission and are imported by composition, with no additional copy or runtime cycle.

Existing guards keep their order and messages. Duplicate keys and requirement slots remain legal.
Two distinct definitions owning the same input are refused; repeated input entries within one
definition retain their previous acceptance. Output collisions remain resolution-time diagnostics.
An empty array is a no-op. Non-arrays throw `TypeError("Plugin definitions must be an array.")`.

Admission invokes no plugin hooks, but own getters and metadata proxies can run arbitrary code.
Nested registration on the same registry during admission is therefore refused with
`TypeError("Plugin registration is already in progress.")`; a `finally` resets the guard after
success or refusal. Without this guard a getter could publish a nested registration before its
outer batch failed. The commit phase reads only admitted objects and performs map/array writes.

The existing stage union still uses the exhaustive `stageRank` switch. A batch has one shape and
synchronous exceptions, so it needs no new union or asynchronous failure type.

## Alternatives rejected

**Loop and unregister on failure.** Requires an inverse for every registry index and publishes
partial state before rollback. The published registry is held by reference.

**Swap a fresh registry.** Breaks the Engine's retained registry identity and duplicates its state.

**Keep separate single and batch validation.** Two owners would drift in guard order, diagnostics,
snapshot reads and freeze behavior.

**Ignore reentrant getters.** A user callback can register into the same registry while admission
is underway, defeating the all-or-nothing invariant before the store phase starts.

## Consequences

Composition roots use one batch in historical order. No plugin implementation or graph behavior
changes. Validation is linear in the batch's metadata plus constant-time name/input lookups;
staging costs one entry per definition and one owner per declared input.

Top-level getter reads now occur once while constructing the snapshot. A throwing getter propagates
before insertion; its own external side effects are not transactional. Requirements are stored as a
frozen copy, so admission no longer freezes caller-owned nested objects. Non-string `keys`,
`inputs` or `outputs` entries are refused by name instead of failing inside the colon check. No impossible guarantee about memory
exhaustion or modified host built-ins is made.

## Evidence

`plugin-register-all.test.ts` covers TH-205 through TH-214: malformed members anywhere, in-batch
name/input collisions, existing collisions, input order, empty/non-array demand, one keys read,
prototype-only compose refusal, non-string metadata entries and
requirement copying. Additional cases pin own compose fields, frozen metadata,
unchanged output-collision timing, getter failure, reentrancy and exact guard messages.

Failing-first assertion reports and exact local checkpoint identities belong in the owning handover
and, after publication, its pull request. Supplemental sandbox verification is not exact-head
Node 24 CI, which remains required before merge.
