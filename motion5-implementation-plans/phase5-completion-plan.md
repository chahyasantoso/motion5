# Phase 5 Completion Plan: Identified Plugins and Explicit Solver Graph

**Status:** Superseding implementation plan. This file is the execution authority for the remainder
of Phase 5.

**Prepared:** 2026-10-25, Asia/Jakarta.

**Branch:** `refactor/v5-identified-tables`.

**Supersedes for execution:**

- `phase5-domain-plugins-solver-graph-plan.md`;
- `phase5-domain-plugins-solver-graph-plan-addendum-1.md`;
- `phase5-domain-plugins-solver-graph-plan-summary.md`;
- `phase5-implementer-prompt.md`.

The superseded documents remain historical planning records. Do not edit them, delete them, or use
their legacy-freeze stop rule after this document is accepted. This document does not claim that any
slice has landed. Reality remains in `docs/SESSION-STATUS.md` and in verified commits.

## 1. Executive decision

Phase 5 will keep the existing public plugin names and cut those names over to the identified-table
contract one plugin at a time. The current package surface is not an accidental implementation
detail: `packages/plugins/package.json`, `public-subpaths.test.ts`, the apps, and the Three package
already treat `@motion5/plugins/transform`, `fk`, `ik`, `transform3d`, `fk3d`, `ik3d`, and `rig` as
declared package entrypoints. Removing or repurposing those paths as a temporary step would create a
false package contract and is the blocker that stopped the earlier plan.

The corrected migration is:

- `@motion5/plugins/<name>` is the stable public path and contains the v5 definition after that
  plugin's cutover slice;
- the grouped implementation is moved to `packages/plugins/src/legacy/<name>.ts` in the same slice
  that installs the v5 implementation at the public path;
- repository-only grouped consumers use explicitly declared internal paths
  `@motion5/plugins/internal/legacy/<name>` until Phase 7 removes them;
- `PluginRegistry` and its grouped loader remain legacy-only during Phase 5;
- `PluginCatalog` and the identified catalog are v5-only during Phase 5;
- no Engine instance, test, app, catalog or loader mixes the two contracts;
- Phase 7 deletes the internal legacy paths and the grouped registry only after a zero-consumer scan.

This preserves the package contract, keeps every intermediate commit buildable, avoids a public
compatibility alias, and gives each plugin one source implementation per contract. It also makes the
earlier stop condition useful: a public grouped plugin is allowed only until its own cutover slice,
never after that slice and never at Phase 5 completion.

## 2. Why the previous plan stopped

The earlier Addendum A3 required all grouped definitions to move under `legacy/` before any v5 file
was created. That would have left the seven declared public subpaths either missing or pointing at a
temporary re-export. Both outcomes are wrong:

- a missing declared entry breaks installed-package behavior and the package-surface test;
- a re-export or fallback creates a compatibility bridge and gives one public name two possible
  contracts;
- changing every app and test before a v5 replacement exists widens a mechanical migration across
  unrelated behavior and leaves no useful per-plugin boundary.

The corrected rule is per-plugin cutover. The move of the grouped file, the internal legacy entry,
the v5 replacement at the public path, the identified catalog entry, and the affected import/test
classification are one vertical slice. There is never a gap at the public path and never a public
alias to a legacy implementation after the slice.

## 3. Invariants and ownership

### 3.1 Contract invariant

A v5 track has `input.values` as either an identified table or a flat record, optional
`input.requires`, and at most one explicit plugin. A v5 plugin declares `id`, `inputs`, `outputs`,
optional `validate`, and `transform`. It returns complete named outputs. A no-plugin source publishes
its evaluated local values as output `values`.

The ready patch owns `outputs`, never the old flat `values` payload. A plugin output is either a
table of `{ id, cells }` rows or a flat scalar record. There is no implicit merge, grouped keyframe
reader, output alias, or hidden publisher-member read.

### 3.2 Ownership invariant

- `packages/core/src/contract` owns authored grammar, `ValueSpec`, diagnostics and closed rule ids.
- `packages/core/src/domain/plugin-catalog.ts` owns v5 admission and the stored immutable plugin
  definition.
- `packages/plugins/src/<name>.ts` owns one migrated plugin boundary and its declared schemas.
- Existing pure solver helpers own numerical algorithms; Phase 5 must not rewrite their math.
- `packages/core/src/graph` owns named dependency resolution, map binding edges, compatibility and
  cycle checks. A plugin never resolves ids or reads graph state.
- `packages/core/src/runtime` owns same-batch evaluation, publication and lifecycle.
- `packages/plugins/src/legacy/<name>.ts` owns the frozen grouped implementation until Phase 7. It
  is not imported by a v5 plugin and is not a second v5 path.
- `packages/plugins/src/identified-catalog.ts` owns the v5 built-in catalog. The legacy
  `catalog.ts` owns only grouped demand until Phase 7.
- Adapters and apps select rows and named outputs. They never collapse a table to its first row.

One owner is preferred over a generic framework. Add a shared helper only when a second real consumer
needs the exact contract or when it is the only owner of a boundary. Closed outcomes use a
discriminated union and an exhaustive `switch` ending in `unreachable`; predicate chains and
unwritten ternary fallbacks are not acceptable for `SolveQuality`, row lookup, plugin load failure,
value kind, binding mode or publication status.

## 4. Public and internal package surface

### 4.1 Public paths

Keep these exact declared paths and names:

- `@motion5/plugins/transform`;
- `@motion5/plugins/transform3d`;
- `@motion5/plugins/fk`;
- `@motion5/plugins/fk3d`;
- `@motion5/plugins/ik`;
- `@motion5/plugins/ik3d`;
- `@motion5/plugins/rig`.

Each path exports exactly one v5 plugin after its cutover. Its public value is named
`<path>Plugin`, with `id: <path>`. No public path exports both grouped and identified definitions.

### 4.2 Transitional internal paths

Because the repository is private and legacy-mode apps/tests still need the grouped implementation,
declare these explicit, non-public repository paths in `packages/plugins/package.json`:

- `@motion5/plugins/internal/legacy/transform`;
- `@motion5/plugins/internal/legacy/transform3d`;
- `@motion5/plugins/internal/legacy/fk`;
- `@motion5/plugins/internal/legacy/fk3d`;
- `@motion5/plugins/internal/legacy/ik`;
- `@motion5/plugins/internal/legacy/ik3d`;
- `@motion5/plugins/internal/legacy/rig`.

They export only `legacy<Name>Plugin`. They are implementation support for the unreleased repository,
not documented consumer API. The public-subpaths test must maintain two explicit lists: supported
public subpaths and temporary internal legacy subpaths. It must assert that internal paths are not in
the public list and that Phase 7 removes every internal path.

Do not add a wildcard export. Do not add a root barrel that eagerly loads the v5 plugins. Do not add
an alias from a public path to a legacy path. The internal entry is a declared package boundary, so
type resolution, Vite resolution and the boundary scanner all agree while it exists.

### 4.3 Catalogs and loaders

Keep the current grouped `catalog.ts` and `loader.ts` for legacy consumers during Phase 5, changing
only their imports as individual grouped files move under `legacy/`. They must never load a v5
definition.

Add `identified-catalog.ts` with literal v5 descriptors or definitions in the existing historical
order. It may use literal dynamic imports, but every import target is source-controlled and listed
explicitly. It must register only `PluginDefinition` values accepted by core's `PluginCatalog`.

Add a small identified loader only if the current loader cannot consume v5 demand without weakening
its types. Its demand union must be distinct from the grouped loader's demand union. The identified
loader discovers `track.plugin`, never keyframe group names, plans approved names before importing,
loads missing definitions, and calls `PluginCatalog.registerAll` once. Its failure union is closed and
read exhaustively. Do not broaden the legacy loader into a union of two incompatible contracts.

## 5. Work order

The work is one vertical slice per commit. A slice may touch its named tests, `test/pending.json`,
the package-surface fixtures required by the boundary change, and the focused documentation record.
It may not edit the superseded plans. Before each slice, run the preceding slice's exit gates and the
repository's formatting, typecheck and boundary gates. If the slice changes `packages/core/src`, run
the read-budget gate too.

### Slice A — establish the contract boundary

**Goal:** Make the public/internal split possible without changing runtime behavior.

**Owner:** package surface and catalog boundary.

**Changes:**

- add explicit internal legacy exports to `packages/plugins/package.json`;
- add source aliases automatically through the manifest reader; do not hard-code aliases;
- add or update the public-subpaths test to distinguish public definition paths from internal legacy
  paths and to verify exact export names;
- add `identified-catalog.ts` with no unmigrated grouped definitions;
- add the identified catalog's focused admission/registration test using only `PluginCatalog`;
- add the new ADR required by the guide, recording the per-plugin public cutover and internal legacy
  boundary;
- do not move a plugin or alter the Engine in this slice;
- do not un-pend behavior tests in this slice.

**Exit:** baseline remains green, public subpaths remain declared, internal paths are explicit and
not advertised as public, and a v5 catalog can register a minimal identified definition atomically.

### Slice B — migrate the 2D transform plugin

**Owner:** `packages/plugins/src/transform.ts`.

**Cutover:**

1. Move the grouped implementation to `packages/plugins/src/legacy/transform.ts`, rename its export
   to `legacyTransformPlugin`, and update only grouped consumers to the internal path.
2. Replace the public `transform.ts` with the v5 definition.
3. Register `transform` in `identified-catalog.ts`.
4. Add a v5-only unit test that registers only this plugin and verifies declared slots, source-row
   identity preservation, complete `values` output and rejection of undeclared output keys.

The v5 transform receives a numeric record and a `data` table dependency and returns exactly one
`values` table. It copies each source row id and computes only the declared frame cells. It does not
spread local values into output and does not return `positions`.

**Exit:** the public transform path is v5, legacy consumers use the internal path, and no test mixes
the two registries.

### Slice C — migrate the 3D transform plugin

Repeat Slice B for `transform3d`. Preserve row ids and the existing 3D frame math. The output is a
declared `values` table with only the declared 3D frame cells. Add a v5-only test; do not change FK3D,
IK3D or frame math here.

### Slice D — prove the explicit 2D solver graph

**Owner:** `ik.ts` plus the narrow projection adapters it directly owns.

Before editing, run the frozen grouped solver on the new proof inputs and record literal golden
values for rotations, residuals, `atBound`, quality kind and iteration count. Never derive those
constants from the new implementation.

**Graph contract:**

- `members` is a required map slot of rest/config records;
- `root` is a required single record slot;
- `goals` is a required map slot of goal records;
- rest records carry `memberId`, optional `parentId`, length, rest rotation, weight and constraints;
- goals carry explicit `goalId`, target `memberId`, target coordinates, influence/weight and
  existing constraint fields;
- binding labels are not row ids;
- `values` is a table whose row id is canonical unqualified `memberId`;
- the row carries `rotation`, with optional leaf `residual` and `atBound`;
- `inspect` is an optional flat record emitted only when local static `inspect === true`.

Use a local `MemberRowLookup` union with `found` and `missing` arms. Preserve the existing closed
`SolveQuality` union and read it with an exhaustive switch. Remove all reads of publisher members,
private graph state, `rotations` maps and grouped `compose` inputs from the migrated boundary.

**Exit:** the proof graph is acyclic, rest changes reach the solver, labels do not change row ids,
multiple goals remain distinct, the golden values match within `1e-6`, and the N=14/N=200 solver
call-count test proves one solver evaluation, N row lookups and zero rest recomputes after warm-up.

Un-pend only the 2D graph test that now passes. Do not un-pend FK-dependent suites yet.

### Slice E — prove the explicit 3D solver graph

Repeat Slice D for `ik3d`, adding explicit pole, orientation and joint slots. Preserve existing 3D
solver algorithms, pivot offsets, rest orientation, solved weights and constraint behavior. Publish
member rows with the 3D rotation columns and optional residual/bound cells, plus opt-in `inspect`.

The solver must not consume FK output. Use exhaustive quality and lookup switches. Extend deterministic
call-count coverage to 3D. The 2D and 3D proof suites are hard gates before FK or rig migration.

### Slice F — migrate 2D FK

**Owner:** `packages/plugins/src/fk.ts`.

Move grouped FK to its internal legacy path and replace the public module with v5 FK. Declare single
slots for the member rest record, parent world-frame row, and solver values table. Select exactly one
solver row by its `memberId` using `found | missing`; never use a binding label, `Object.values()[0]`,
track id, or array position.

Emit one `values` table row with `id: memberId` and the existing world-frame scalar cells. A missing
solver row is a node error. Preserve rest-weight, parent-frame and pivot behavior.

Run the existing 2D solver fixtures now that the real FK boundary exists. Compare numeric values to
the pre-migration fixtures within `1e-6`; keep IDs, booleans, quality and iteration fields exact.

### Slice G — migrate 3D FK

Repeat Slice F for `fk3d`. Declare rest, parent and solver slots, select the solver row by canonical
`memberId`, and emit one same-ID `values` row containing the existing 3D world-frame fields. Do not
change 3D orientation math or invent an ID conversion. Add the 3D FK call-count assertion: N FK
compositions after one warm-up change.

### Slice H — migrate rig aggregation

**Owner:** `packages/plugins/src/rig.ts`.

Move grouped rig to the internal legacy path and replace the public module with v5 rig. Declare
`bones` and `controls` as map slots. Consume dependency rows, not map labels, as identity:

- `pose` is a frame table keyed by source row id, which must be the canonical member id;
- `controls` is a point table keyed by source row id, which must be the control id;
- duplicate output ids fail output validation;
- no nested record maps escape the plugin;
- no graph scan, FK import, solver read or implicit first-row selection is added.

Add the rig aggregation call-count assertion: one aggregation call after a warm-up change. Port rig
tests and the dependent React/demo fixtures only after the solver and FK gates pass.

### Slice I — keyed consumers and classifier

**Owners:** `pose-classify.ts`, `labels.ts`, and the graph slot tests that prove map semantics.

Use declared map bindings for keyed members. Binding labels are lookup labels only; row identity
comes from `row.id`. The classifier consumes the declared rig output and publishes one flat
`values` record `{ label, confidence }`. The label reader narrows the named output before reading
the record field.

Use exhaustive switches for closed classifier outcomes where they already exist. Do not introduce a
generic retargeter. Reconfirm the absence of a concrete retarget plugin or caller only under
`packages/plugins/src` and `apps/pose-gap-filler/src`. The existing `retarget-motion-track` effect
and skeleton-capture comment are not domain retarget consumers. ADR-140 remains the authority that
retargeting is deferred.

### Slice J — migrate the pose-gap-filler writer

**Owner:** `apps/pose-gap-filler/src/rig/writer.ts`.

Read named outputs, select pose rows by `memberId`, assemble the complete local record/table for each
target track, and call `track.input.values.set(value)` once per changed track inside the existing
value batch. Remove per-field `setField` calls from this writer. Do not add a record-map shim, guessed
row order, or renderer logic to core.

Run the app fixtures for seeks, persistence, replay, lifecycle and cleanup. If a test still imports a
legacy plugin, move that import to the internal legacy path only when the test is explicitly testing
the legacy registry; otherwise port its authored project and registry to the v5 path.

### Slice K — Phase 5 closeout

This is a verification and deletion slice, not a new feature slice.

- port every remaining Phase 5 pending test to the v5 builders and identified catalog;
- remove old grouped expectations only where the test's behavior now has an identified-table owner;
- keep tests that specifically prove old-shape refusal and name them as refusal behavior;
- ensure all seven public plugin paths expose v5 definitions and no public module exposes `name`,
  `keys`, `stage` or `compose`;
- ensure `identified-catalog.ts` contains every Phase 5 built-in and no legacy definition;
- ensure legacy grouped files are reachable only through the internal legacy paths and the legacy
  catalog/loader;
- leave Phase 6 and Phase 7 pending entries untouched;
- update the authored-schema, architecture, README, plugin authoring guide and relevant examples in
  their own documentation commit or in this closeout only if the behavior change requires it;
- rewrite `docs/SESSION-STATUS.md` to state the verified landed state, not the plan history;
- add the final supersession markers to grouped-only ADRs named by the guide. Do not rewrite their
  historical reasoning.

## 6. Test allocation and pending ledger

The pending ledger remains the source of truth. Do not hand-edit it before the exact test passes.
Every Phase 5 path is removed exactly once, in the first slice where all of its registered plugin
dependencies have migrated. The dependency floors are:

- transform: Slice B;
- transform3d: Slice C;
- IK: Slice D;
- IK3D: Slice E;
- FK: Slice F;
- FK3D: Slice G;
- rig: Slice H;
- classifier and labels: Slice I;
- app writer: Slice J.

A test that registers multiple plugins is un-pended no earlier than the latest dependency floor. A
test that still exercises grouped behavior is not ported merely to reduce the ledger; it remains
pending until its behavior has a v5 owner or is explicitly classified as Phase 7 retirement.

The pending audit must prove all of the following after each slice:

- every Phase 5 path is present until its assigned slice;
- no Phase 5 path appears twice;
- no Phase 6 or Phase 7 path changes;
- no test file was deleted, skipped or weakened;
- the total passing test count never decreases.

New focused tests are required for the proof boundaries, but they do not replace existing suites:

- identified catalog registration and public/internal surface;
- v5 transform and transform3d contracts;
- explicit 2D and 3D solver graphs with literal pre-migration golden values;
- deterministic solver row lookup and call counts;
- FK missing-row refusal and one-row output;
- rig duplicate-row refusal and named table outputs;
- classifier flat record output and declared label read;
- writer whole-value batching.

## 7. Verification protocol

### Before every slice

Run these commands one at a time and stop on the first failure:

```text
npm run format:check
npm run typecheck
npm run test:boundaries
```

If a core source file changed, also run:

```text
npm run test:read-budget
```

For solver slices, run the legacy oracle or the existing pre-migration fixture before editing and
save literal expected values in the new test. The oracle is never regenerated from migrated code.

### After every slice

Run the exact focused Vitest paths for that slice, then:

```text
npm run typecheck
npm run format:check
npm run test:boundaries
npm run test:read-budget
npm test
```

Run the relevant app build only after its slice changes an app or package boundary. Do not run
`npm run bench:ik` during Phase 5; its known v4 grouped-fixture failure is a baseline issue, not
evidence for or against the identified plugin migration. Use deterministic solver call counts and
the committed baseline JSON as the Phase 5 performance evidence. Wall-clock measurements are
report-only.

### Phase 5 completion gate

Phase 5 is complete only when:

- all 73 Phase 5 pending entries are removed exactly once;
- the four Phase 6 and two Phase 7 entries are unchanged;
- all public plugin paths expose only identified definitions;
- all legacy grouped definitions are behind internal paths and are not loaded by v5 catalogs;
- no v5 plugin reads publisher state, graph internals, stop syntax or another plugin's private data;
- 2D and 3D solver graphs are acyclic and explicit;
- solver, FK and rig numerical fixtures pass the absolute `1e-6` gate;
- row identity, output names, optional inspection and duplicate handling are exact;
- the writer performs whole-value updates rather than per-field updates;
- format, typecheck, boundaries, read-budget, full suite and required app builds pass;
- documentation and status describe the code that landed, not an intended future state.

## 8. Explicit non-goals

- No schema version 6, package rename, v5 compatibility converter or old/new shape autodetection.
- No generic plugin base, schema conversion framework, branded string layer, second runtime or
  hidden compatibility flag.
- No rewrite of the IK, IK3D, FABRIK, frame, interpolation or numerical algorithms unless a focused
  transport defect is proved by a failing equivalence test.
- No automatic row joins, broadcasts, first-row adaptation, output merging or map-label identity.
- No general retarget algorithm. ADR-140 remains proposed and separate.
- No Phase 8 plugin cache hooks. Existing incremental cache behavior is preserved and tested.
- No adapter or renderer migration beyond what is required for the Phase 5 writer and named-output
  contract; renderer consumers remain Phase 6 unless an existing Phase 5 test directly owns them.
- No changes to the superseded plan files.

## 9. Required documentation after implementation

The implementation PR or a directly associated documentation commit must contain:

- the new ADR for the public cutover and internal legacy boundary;
- supersession markers on grouped-only decisions whose current claim is no longer true;
- updated `docs/AUTHORED-SCHEMA.md`, `docs/ARCHITECTURE.md`, plugin authoring guidance and examples;
- a rewritten `docs/SESSION-STATUS.md` with exactly one current Now entry and one Next in line entry;
- exact commit and test evidence in the PR body, including the known skipped `bench:ik` baseline;
- a deletion list naming the grouped readers, old output aliases, hidden solver-member path and any
  other machinery that Phase 5 actually retires.

## 10. Final decision record

The public path decision is the correction that makes this plan implementable:

- public plugin subpaths are retained and become v5 one at a time;
- grouped implementations move to explicit internal legacy subpaths in the same cutover commit;
- the legacy and identified catalogs are separate and never mixed;
- public package tests measure the declared package surface, while migration tests measure contract
  ownership and the absence of grouped fields after cutover;
- canonical solver and rig row identity is unqualified `memberId`, with `controlId` for controls;
- FK emits one identified `values` row; rig emits `pose` and `controls` tables;
- solver inspection is an opt-in `inspect` record;
- closed unions are read exhaustively and unknown states fail closed;
- retargeting is not invented without a concrete consumer and fixture.

This is the smallest architecture that preserves the already-declared package contract while
allowing the unreleased v5 redesign to finish without a bridge, alias, second public engine or
temporary missing entrypoint.
