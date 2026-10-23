# Motion v5 Refactor Guide: Identified Table Tracks and Explicit Plugins

**Status:** Recommended implementation specification, not an implementation report.
**Prepared:** 2026-10-23. Revision 3. Consolidates `motion5-v5-refactor-guide.md` and its addendum, then applies the later design decisions: scalar-only cells, named outputs, and a table-or-record shape (`ValueSpec`) that is real on both input and output. Where the sources disagreed, this document states the resolved rule (Appendix A).
**Destination:** The existing `motion5` repository.
**Version policy:** **Keep this v5. Do not create v6.**

> Motion v5 is unreleased. The owner confirms there are no external consumers; only first-party demos and integrations need updating. Breaking changes are acceptable. This replaces the current v5 design before release. It is not a compatibility migration between released versions.

Formatting note: this file contains no markdown tables on purpose. `AGENTS.md` forbids authoring them in this repository, because Prettier rewrites their alignment and breaks `format:check`.

## Contents

1. Executive decision
2. What exists in the snapshot
3. Target architecture and ownership
4. Authored track contract
5. Rows, records, cells, and interpolation
6. Value specs: ownership, inference, slots, static fields
7. Plugin contract and outputs
8. Complete vertical-slice example
9. Dependencies and graph semantics
10. Evaluation, publication, and failures
11. Compilation and interpolation implementation
12. Authoring edits, live values, and runners
13. Plugin registry and loading
14. Built-in plugins and the solver migration
15. DOM, React, Three.js, and demo migration
16. Test migration strategy
17. Plugin caches (last, measured-need only)
18. Repository change map
19. Implementation phases and exit gates
20. Acceptance-test matrix
21. Validation commands and evidence
22. Documentation, repository process, and cleanup
23. Token-efficient AI implementation workflow
24. Decisions and deliberately deferred features
25. Definition of done
26. Brief for an AI implementor

- Appendix A: What changed relative to the source documents
- Appendix B: Proposed rule ids

## 1. Executive decision

### 1.1 Replace the core model inside the current repository

Implement one coherent new v5 track and plugin model in the existing workspace. Do not force it through the old grouped-keyframe abstractions to minimize the diff. Reuse infrastructure and mathematical routines where their behavior still fits.

- Replace conflicting authoring, compilation, plugin, and publication contracts.
- Retain clock, scheduling, graph-ordering, lifecycle, immutable-value, transaction, test, and tooling infrastructure after checking its assumptions.
- Update all demos and first-party integrations to the new API.
- Remove the superseded engine path. Do not maintain two public engines.
- Do not create a new repository unless inspection reveals a separate reason to do so.

The token advantage comes from a clear contract, reusable tested behavior, and bounded tasks, not from the repository boundary. No numerical saving is claimed.

### 1.2 Version policy is a requirement

Keep the project identity `motion5`, the scope `@motion5/*`, `schemaVersion: 5`, `AUTHORED_SCHEMA_VERSION = 5`, and the current private `0.0.0` package status unless a separate task changes them.

Do not introduce `schemaVersion: 6`, `v6.ts`, `@motion6/*`, or a major release. Do not accept both the old and new v5 track shapes. Do not add a legacy parser, automatic converter, compatibility wrapper, or permanent parallel runtime. Do not add publishing, release automation, or consumer migration tooling.

Two historical layouts will both be called v5: the superseded unreleased snapshot and this design. Resolve this through current documentation and a clear rejection of the old layout. A document with `schemaVersion: 5` and `keyframes` must fail with a useful diagnostic, never load as an empty track.

### 1.3 Core contract

> A track authors `values`, either a table of identified rows or a flat record, whose cells are scalars or stop sequences. The engine evaluates each cell without changing row identity or order, resolves the named outputs of upstream nodes, and invokes one optional, explicitly selected plugin. The plugin validates the resolved input and returns a set of named outputs, each a table or a flat record, as declared in its `outputs`. A track without a plugin publishes its evaluated `values`, in the shape it was authored, as the output named `values`. Plugins stay deterministic. Evaluation correctness never depends on cache history.

The model is symmetric. A table-or-record value (`ValueSpec`) is a real kind on both sides. A node takes `values` (its own authored table or record) and `requires` (named slots filled by other nodes' outputs), and publishes named outputs. What a node publishes is what another node's `requires` slot receives.

Rows are simultaneous records of one table. Animation happens inside cells, never across rows.

## 2. What exists in the snapshot

These observations come from targeted source reads of the cloned repository. They are not a complete audit. No installation, test suite, build, or benchmark was run while preparing this guide.

- `packages/core/src/contract/v5.ts`: tracks have `id`, optional `duration`, plugin-grouped `keyframes`, and `observes`. Replace the authored shape. Keep v5 identity and scheduling fields.
- `contract/keyframe-shape.ts`: reads plugin-named groups and their requirement bindings. Replace with one track-input and binding reader.
- `domain/keyframe-groups.ts`: flattens grouped values into unprefixed properties. Remove that flattening. A record `values` is the surviving flat form, and it is owned by one plugin or by no plugin, never by a group name.
- `contract/keyframe-compiler.ts`: compiles flat properties and normalized `p` positions into percent keyframes. Reuse suitable leaf logic. Change table and record compilation and identity.
- `domain/plugins.ts` (about 28.9 KB, close to the 30 KB sibling-doc threshold) and `plugin-admission.ts`: the registry resolves multiple plugins. Definitions use `name`, claims and keys, stages, priorities, `contribute`, `compose`, and output-name lists. Replace with explicit single-plugin selection and `ValueSpec` contracts.
- `domain/track.ts`: interpolates a record, then runs multiple composers. Evaluate a table or record and run at most one transform.
- `domain/values.ts`: recursive immutable renderer-neutral values (finite numbers, strings, booleans, arrays, records; no `null`). Reuse its finiteness and freezing logic. The new cell boundary is narrower: scalars only.
- `contract/v5.ts` and `runtime/patch-registry.ts`: ready patches carry a flat `values` record. Blocked, error and destroyed patches have separate shapes. Replace the ready payload with a named-outputs map. Keep the status separation and batching.
- `graph/ir.ts`: ordinary bindings coexist with solver-specific derivation and member-rest handling. Port ordinary edges first. Redesign solver wiring explicitly.
- `packages/plugins/src/loader.ts`: demand is discovered from grouped keyframe names. Discover it from `track.plugin`.
- `packages/plugins/src/rig.ts`: publishes `pose` and `controls` records keyed by member, fed by dictionary bindings. Becomes tables with one row per member.
- `packages/plugins/src/ik.ts`, `ik3d.ts`, `ik-result.ts`: publish `rotations` (or `rotations3d`) as a record keyed by qualified node id, plus an opt-in `inspection` record (`kind`, `residual`, `iterations`, `atBound`, `residuals`). FK members read `solver.rotations[nodeId]`. See section 14.
- `packages/plugins/src/runner.ts`: stateful work is separate. Live writes are flat today. Make them shape-aware.
- DOM, React and Three integrations consume record-oriented ready patches. Introduce explicit row selection and named-output reads.

Measured coupling to the old shape: 31 source files across core, plugins, react and three touch keyframes. 124 of 382 test files author `keyframes:` directly and 169 touch `compose`, `PluginDefinition` or `requires`. Section 16 exists because of that number.

The workspace contains `packages/core`, `packages/plugins`, `packages/react`, `packages/three`, and the demos `apps/react-demo`, `apps/ik-playground`, `apps/pose-gap-filler`.

## 3. Target architecture and ownership

### 3.1 Keep authored, evaluated, and published data distinct

- Authored input: scalar cells and cell stop sequences, in a table of identified rows or a record, plus source references. Owner: track definition and authoring editor.
- Compiled input: validated cell plans, the compiled source contract, resolved dependency identities. Owner: compiler and graph builder.
- Evaluated local values: an immutable table of scalar rows or an immutable flat record of scalars, at the track's current progress. Owner: track evaluator.
- Resolved input: the evaluated local values plus the named outputs of each bound dependency. Owner: graph evaluator.
- Published outputs: validated plugin outputs, or for a no-plugin track the single output `values`. Owner: publisher.
- Render selection: a chosen row, keyed set of rows, a record, or an application projection. Owner: consumer or adapter.

Plugins must not resolve track ids, evaluate stop arrays, traverse graph internals, or mutate published data. Adapters must not run plugins or interpret authored stops.

### 3.2 One owner for each decision

- Engine validation owns authored syntax, the row envelope, the scalar cell boundary, and the check that authored `values` has the shape the track's contract expects.
- Plugin input specs own accepted structure. Optional plugin `validate` owns semantic constraints specs cannot express.
- Graph building owns reference resolution, edges, slot compatibility checks, and cycle detection.
- Scheduling owns when and at what progress a node is evaluated.
- `transform` owns output content, row cardinality, and output row ids.
- The plugin `outputs` declaration owns the promised output structure.
- Publication owns immutable patches, revision metadata, and subscriber ordering.
- Adapters own how rows correspond to rendering targets.

Avoid a new monolithic module that duplicates these responsibilities. Two owners for one question is the defect this project cares about most.

## 4. Authored track contract

This is proposed API, not code in the snapshot. Existing motion and project scheduling types remain around it.

```ts
type Scalar = number | string | boolean; // numbers are finite, enforced at the boundary

// Evaluated, dependency, output, live and published tables use this envelope.
interface Row {
  readonly id: string;
  readonly cells: Readonly<Record<string, Scalar>>;
}
type Table = readonly Row[];
type FlatRecord = Readonly<Record<string, Scalar>>;
type Value = Table | FlatRecord; // a table is an array, a record is a plain object

interface Stop {
  readonly p: number;
  readonly v: Scalar;
  readonly ease?: string;
}
type AuthoredCell = Scalar | readonly Stop[]; // a bare array is always a stop sequence

interface AuthoredRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, AuthoredCell>>;
}
type AuthoredRecord = Readonly<Record<string, AuthoredCell>>;
type AuthoredValues = readonly AuthoredRow[] | AuthoredRecord;

type SourceBinding = string | Readonly<Record<string, string>>;

interface TrackInput {
  readonly values?: AuthoredValues;
  readonly requires?: Readonly<Record<string, SourceBinding>>;
  readonly schema?: ValueSpec; // no-plugin sources only
}

interface TrackDefinition {
  readonly id: string;
  readonly plugin?: string;
  readonly input?: TrackInput;
  readonly duration?: number;
}
```

Use existing project and motion wrappers, id qualification, and duration semantics unless tests establish a reason to change them. Add no speculative fields: no priorities, execution phases, plugin arrays, or unused metadata.

### 4.1 Defaults and invalid combinations

- `input` omitted: no local values, bindings none.
- `input.values` omitted: for a no-plugin track, an empty table. For a plugin track, the empty form of the plugin's declared kind, an empty table or an empty record. The plugin's spec may then reject it (for example by a required field or `minRows`).
- `input.values: []`: valid empty table. A plugin may reject it by spec.
- A table row with `cells: {}`: one row with no columns. Distinct from an empty table.
- `input.values: {}`: an empty record, distinct from an empty table.
- Plugin omitted: no-plugin track. Publish the evaluated local `values`, in the shape it was authored, as the output `values`.
- Nonempty `requires` without a plugin: reject. Nothing owns how those inputs affect output.
- `input.schema` on a plugin track: reject. The plugin already owns that contract.
- Unknown `plugin`: refuse loading. Never fall back to no-plugin behavior.
- Empty plugin id, malformed row or cell: reject with a precise authored path.
- Old `keyframes` or `observes` fields: reject explicitly. Never ignore them.
- Unknown authored structural fields: reject rather than silently discard.
- A cell that is an object, `null`, or anything other than a scalar or a stop array: reject. Structured static values are not an authored form.

### 4.2 The shape of `values`

`values` is a table (array of identified rows) or a record (plain object of cells). They are two real kinds, not two spellings of one: a record has no row and no id, and the plugin reads `values.dx`, not `values[0].cells.dx`.

- Plugin track: the selected plugin's `inputs.values.kind` decides which shape is valid. An array where a record is declared, or a plain object where a table is declared, is refused as `values-shape-invalid` with both shapes named in the message.
- No-plugin track: the authored form decides. An array is a table and a plain object is a record. With `input.schema`, the declared kind must match.
- The two are told apart by `Array.isArray` at the top level only, so there is no ambiguity inside a cell.
- There is no normalization of one shape into the other, no reserved row id, and no implicit row.
- A live write must match the track's committed shape (section 12.1). Changing the shape is an authored transaction.

## 5. Rows, records, cells, and interpolation

### 5.1 Row envelope and identity

Every row of a table has `id` and `cells`. Column specs validate `cells` only. The engine validates the envelope independently, so a column restriction never rejects the envelope's own `id` or `cells` properties.

```ts
{ id: "point-a", cells: { id: "external-record-123", x: 10, y: 20 } }
```

Three different identifiers coexist here. `row.id` identifies the row within its table. `row.cells.id` is ordinary application data. The track `id` identifies the dataflow node. A record has no row id.

Identity rules for tables:

- Authored row id: a nonempty string. Do not invent implicit ids.
- Uniqueness: within each table. Different tables may share ids.
- Repeated evaluation: the same logical record keeps its id across progress changes.
- Reordering and filtering preserve the ids of retained records.
- One-to-one transformation preserves source ids unless it explicitly creates different entities.
- Expansion derives deterministic, distinct child ids from source identity and child identity.
- Aggregation gives the aggregate a deterministic identity, such as a named summary row.
- Duplicate ids in plugin output: reject the output table. Never keep the first or last silently.
- The same id after replacement is not proof the cells are unchanged.
- Never use array index, random ids, timestamps, or a mutable counter as persistent identity. Index remains fine for diagnostics.
- Compound ids use one central helper with an unambiguous encoding, for example `JSON.stringify([parentId, childId])`. Blind separator concatenation can collide when user ids contain the separator.
- Reject row ids, column names, record field names and output names that are `__proto__`, `constructor` or `prototype`, and use own-property reads.

Row ids enable stable selection and keyed caches. They never create automatic joins. If two dependency tables both contain `point-a`, they are still passed separately and the plugin decides what that means.

### 5.2 Required row preservation

```ts
values: [
  {
    id: "a",
    cells: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
      y: 20,
    },
  },
  { id: "b", cells: { x: 200, y: 40 } },
];
```

At linear progress `0.5` the evaluated local table is:

```ts
[
  { id: "a", cells: { x: 50, y: 20 } },
  { id: "b", cells: { x: 200, y: 40 } },
];
```

The engine preserves row id, row count, row order, column membership, and the association between cells in one row. Repeated column names in different rows never collide. Rows may be heterogeneous. A plugin spec can demand a homogeneous shape. Row ids are metadata and cannot be animated. A column named `id` inside `cells` may be animated if its spec permits.

The plugin may map, filter, sort, expand, or aggregate rows. It is not required to preserve any of the above.

### 5.3 Records

An authored record has the same cell grammar as a row's `cells`: each field is a scalar or a stop sequence, animated independently.

```ts
values: { dx: 10, dy: [{ p: 0, v: 0 }, { p: 1, v: 5 }] }   // at 0.5: { dx: 10, dy: 2.5 }
```

All cell rules in 5.4 apply to record fields. A record's evaluated form is a frozen flat record of scalars. Field names follow the same reserved-name rule as columns.

### 5.4 Cell rules

- Static scalar cells remain unchanged.
- Numbers are finite everywhere: authored cells, stop values, outputs.
- Stop positions are finite numbers in `[0, 1]`, strictly increasing, no duplicates.
- A stop sequence has at least one stop. One stop is a constant animation. A bare empty array is invalid.
- Hold the first value before the first stop and the last value after the last stop.
- Default numeric interpolation is linear. An `ease` applies to the interval ending at the stop that carries it. The first stop's `ease` has no interval and is refused.
- Resolve easing through an approved interpolation adapter. Reject unsupported names instead of passing arbitrary engine variables through.
- Numeric sequences interpolate continuously. String and boolean sequences are discrete: the last reached stop, or the first stop before it is reached.
- Reject mixed scalar kinds in one sequence, and `ease` on discrete sequences.
- There are no structured cell values, so there is no structured interpolation and no literal wrapper. Variable-length or keyed data is expressed as more rows or more columns.

Audit existing fixtures for deliberate behavior before tightening the current broad stop and easing types. If a demo needs string interpolation, add an explicit supported mode and tests, never accidental coercion by the GSAP backend.

### 5.5 Evaluate first, transform second

A nonlinear transform gives different results if you interpolate then transform, versus transform endpoints then interpolate. Only the first is the runtime contract. `transform` receives already evaluated input. Never move its work into endpoint preparation without proving equivalence for that specific operation.

## 6. Value specs: ownership, inference, slots, static fields

### 6.1 Who declares which contract

- No-plugin source without a declaration: the output contract is inferred from authored `values` (section 6.4). Its single output is `values`, in the authored shape.
- No-plugin source with `input.schema`: the declared `ValueSpec`, validated against authored data. The output contract is the same with authored-only flags removed.
- Plugin track: the selected plugin's `inputs.values` spec for local input, and its `outputs`.

A plugin's local parameter shape cannot stand in for its output shape. A producer's outputs cannot stand in for what the consumer accepts. Track authors never redeclare plugin contracts. Selecting the plugin selects its contracts.

### 6.2 One flat spec vocabulary

Use `kind` consistently. Do not accept `type` as an alias. One spec, `ValueSpec`, describes a table or a record, and it is used for `inputs.values`, for slot-declared outputs and for plugin `outputs`. There are no nested descriptors, because there are no nested values.

```ts
interface FieldSpec {
  readonly kind: "number" | "string" | "boolean";
  readonly optional?: true;
  readonly enum?: readonly string[]; // string fields only
  readonly min?: number; // number fields only
  readonly max?: number;
  readonly static?: true; // local authored input only, see 6.3
}

interface TableSchema {
  readonly row: {
    readonly fields: Readonly<Record<string, FieldSpec>>;
    readonly additionalProperties?: boolean;
  };
  readonly minRows?: number;
  readonly maxRows?: number;
}

type ValueSpec =
  | { readonly kind: "table"; readonly schema: TableSchema; readonly optional?: true }
  | {
      readonly kind: "record";
      readonly fields: Readonly<Record<string, FieldSpec>>;
      readonly additionalProperties?: boolean;
      readonly optional?: true;
    };
```

`row.fields` apply to `row.cells`. `optional` on a `ValueSpec` is meaningful only for outputs and slot-declared outputs. It is refused on `inputs.values`. Extra-field policy defaults:

- Plugin local `values` and plugin outputs (tables and records): reject extra fields.
- Slot-declared outputs: allow extra fields. The consumer reads what it declares. Closed slots would make an inferred source with a spare column (for example `color`) incompatible with a point consumer for no real reason.

Keep the vocabulary small. Do not build a general schema language, dynamic output inference, or a compatibility theorem prover. Choose one runtime representation. Reuse an existing dependency only if it fits. Do not maintain parallel handwritten and spec-generated validators for the same rule. Put the types in one schema module.

```ts
const pointInput: TableSchema = {
  row: { fields: { x: { kind: "number" }, y: { kind: "number" } }, additionalProperties: true },
};
const pointOutput: TableSchema = {
  row: { fields: { x: { kind: "number" }, y: { kind: "number" } }, additionalProperties: false },
};
```

### 6.3 Static authored fields

`static: true` forbids authored stop sequences in that local input column or record field. It does not mean the value never changes.

- Static number field: accepts `10`. Rejects `true`, and rejects `[{ p: 0, v: 10 }]` even with one stop.
- Static boolean field: accepts `true`. Rejects any stop sequence and wrong kinds.

Allowed in plugin `inputs.values` (table columns or record fields) and in a no-plugin source's `input.schema`. Not allowed in plugin `outputs`, slot-declared outputs, or row envelope metadata. Strip it before exposing a source's output contract.

`static` is not a temporal promise. A static cell can change through an authored edit or a validated live replacement. Do not use it as proof of cache validity, infer it from current values, use it to reject a dynamic upstream dependency, or make booleans static by default. If a plugin needs truly immutable initialization, add a separately named lifecycle concept.

### 6.4 Source inference

For a source without `input.schema`, inspect the complete authored `values` during preparation and produce a stable compiled contract for its `values` output. Never infer from only the first row, only the first stop, the current frame, a consumer's expectations, or a last successful output.

- Authored array: a table contract. Authored plain object: a record contract.
- Finite numeric literal or numeric stops: number. Check every stop. Do not infer an observed range.
- String or boolean literal or stops: that scalar kind.
- Table column present in every row: required. Absent from some rows: optional, no implicit default. Every field of a record is required.
- Conflicting scalar kinds in one column (across rows or stops) or one field: refuse, with paths.
- Empty source table or empty record: no evidence for column kinds. It is not compatible with every typed consumer.

An inferred contract names exactly the observed columns or fields. Treat it as closed for compatibility, because live writes may not change it.

Never infer from a sample: `static`, `minRows`/`maxRows`, numeric bounds, string enums, or stable domain identity from a column name. The current row count is not a lifetime promise.

Optional source declaration:

```ts
{ id: "points", input: { schema: { kind: "table", schema: pointOutput }, values: [] } }
```

It is a complete contract, not a partial merge with inferred fields. Validate authored values against it, including every stop value and authored restriction. Declaration never bypasses validation or generates missing columns. An empty table can declare its columns without fabricating a row. Declare one for empty sources, intentional optional columns and live-fed sources. For a source intended for live writes, declare the spec up front so the first write never decides the graph contract.

Stability: the compiled contract is stable until a successful authored transaction replaces it. Progress changes, cache resets and live writes never re-infer it. A live write with a string `x` against an inferred numeric `x`, or a table write to a record source, is refused. An authored edit without declaration re-infers and rechecks affected consumers transactionally. A failed edit keeps the previous committed graph and contract.

### 6.5 Load-time slot compatibility

A consumer's slot declares which outputs of the bound node it reads and the `ValueSpec` it needs for each (section 7). Add one small structural checker from each producer's declared outputs to each bound consumer slot. Producers are inferred or declared source contracts and plugin `outputs`. For map bindings, check each member separately. For each output the slot declares, require that the producer has an output of that name and the same kind (table or record), then compare column or field existence, scalar kind and required versus optional presence. An optional slot output may be absent from the producer.

Three internal outcomes:

- Compatible: the supported structural checks pass.
- Incompatible: a known contradiction exists, such as a missing required output, a table-versus-record mismatch, or a column of the wrong scalar kind. Reject.
- Unproven: evidence is insufficient (for example a required column's kind in an empty undeclared source). Reject unproven core requirements. Never treat unknown as `any`.

Everything else (ranges, row counts, semantic relationships) is left to runtime validation. Passing the structural check is not a proof of all constraints. An inferred numeric `x` does not prove `x >= 0`, and an unconstrained row count does not satisfy an exact-one-row requirement.

Runtime validation stays mandatory: evaluated local input, actual dependency outputs, custom validation, plugin outputs and output row ids. Easing can overshoot ranges, dependencies and live writes can change row counts, and a plugin can have a bug. Recheck affected edges after plugin replacement, source-spec change or binding edits. Never rebuild unrelated contracts per frame. Because the kind of every slot and output is declared, runtime readers never need a kind check.

## 7. Plugin contract and outputs

A node publishes a set of named outputs. Each output is a table of identified rows or a flat record of scalars, as its `ValueSpec` declares.

```ts
type Outputs = Readonly<Record<string, Value>>;

interface DependencySpec {
  // The outputs of the bound node this slot reads, and the shape needed for each.
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly optional?: true;
  readonly binding?: "single" | "map"; // default "single"
}

interface ResolvedInput {
  // A Table or a FlatRecord, as declared by inputs.values.kind. Typed from the declaration.
  readonly values: Value;
  // single slot: the bound node's Outputs. map slot: member key to that member's Outputs.
  readonly requires: Readonly<Record<string, Outputs | Readonly<Record<string, Outputs>>>>;
}

interface EvaluationContext {
  readonly nodeId: string;
  readonly progress: number;
}

interface PluginDefinition {
  readonly id: string;
  readonly inputs: {
    readonly values: ValueSpec;
    readonly requires?: Readonly<Record<string, DependencySpec>>;
  };
  readonly outputs: Readonly<Record<string, ValueSpec>>;
  readonly validate?: (input: ResolvedInput, context: EvaluationContext) => readonly Diagnostic[];
  readonly transform: (input: ResolvedInput, context: EvaluationContext) => Outputs;
}
```

This is the desired surface, not a drop-in file. Derive the exact `ResolvedInput` and `Outputs` types from the admitted declaration centrally, so a plugin declared with a record `inputs.values` reads `values.dx` with a number type, and one declared with a table reads rows. No unchecked casts spread through plugins.

Conventions:

- A plugin's main output is named `values`, so a chain such as `points → translate → rotate` reads `requires.data.values` uniformly. It is a table or a record, as the plugin declares.
- A plugin with several outputs of equal standing names them by meaning, for example `pose` and `controls`.
- Secondary or diagnostic data uses its own name, for example `inspect`.
- A record is flat. No nested records or arrays in v1.

The plugin is synchronous and deterministic for the same declared input and context. No I/O, hidden graph reads, host objects in output, promises, or input mutation. History-dependent state belongs in runners (sections 12 and 17).

The track still only supplies values and bindings. Plugin `inputs.values` describes evaluated cells, never stop syntax. Plugins never understand stops.

Validation boundaries:

- Authored parsing: track and input shape, the table-or-record shape against the declared kind, row envelope, cell forms, stop positions, unsupported fields, the static-field rule.
- Plugin admission: unique id, valid specs, unique output names, `optional` absent from `inputs.values`, callable hooks, valid dependency declarations.
- Graph preparation: selected plugin exists, slot names and binding modes match, required slots bound, sources resolve, no cycles, slot compatibility (section 6.5).
- Runtime input: the evaluated local values and every bound dependency output satisfy the plugin's declared input and slot shapes.
- Custom validation: semantic relationships not already expressed structurally.
- Runtime output: every returned output is declared and matches its spec including its kind, every required output is present, tables have unique row ids, records are flat scalars, and the whole set is immutable and renderer-neutral. An undeclared output name is an error, as is a missing required output.

Do cheap checks early, and validate static inputs at preparation where possible. Cache successful checks by safe immutable identity only after correctness is established.

Custom `validate`: an empty list means valid. Error-severity diagnostics stop the transform. Warnings do not. A thrown exception becomes a node error with context, never a successful empty result. Examples: a polygon must not self-intersect, referenced member ids must exist in a supplied topology, a rig's root must belong to its members. Validation never coerces values, adds defaults, drops columns, or reorders rows.

`transform` returns the complete set of outputs. No implicit merging of local values, dependency data, previous output, or authored keys. `outputs` describes the set. It is not another transform. A plugin that allows extra columns must deliberately carry them through if they should survive.

## 8. Complete vertical-slice example

This is the first behavior to implement and test.

```ts
const project = {
  schemaVersion: 5,
  motions: [
    {
      id: "demo",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "points",
          input: {
            values: [
              {
                id: "point-a",
                cells: {
                  x: [
                    { p: 0, v: 0 },
                    { p: 1, v: 100 },
                  ],
                  y: 20,
                },
              },
              { id: "point-b", cells: { x: 200, y: 40 } },
            ],
          },
        },
        {
          id: "shifted-points",
          plugin: "translate",
          input: {
            values: { dx: 10, dy: 5 }, // a record: translate declares a record input
            requires: { data: "points" },
          },
        },
      ],
    },
  ],
};

const translatePlugin = {
  id: "translate",
  inputs: {
    values: {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number" } },
    },
    requires: {
      data: { outputs: { values: { kind: "table", schema: pointInput } } },
    },
  },
  outputs: { values: { kind: "table", schema: pointOutput } },
  transform({ values, requires }) {
    return {
      values: requires.data.values.map((row) => ({
        id: row.id,
        cells: { x: row.cells.x + values.dx, y: row.cells.y + values.dy },
      })),
    };
  },
};
```

Use the existing same-motion reference resolver for `points`. No source schema is needed: the authored source infers required numeric `x` and `y`, and its single output is `values`, a table.

At progress `0.5`:

- `points` publishes `{ values: [{ id: "point-a", cells: { x: 50, y: 20 } }, { id: "point-b", cells: { x: 200, y: 40 } }] }`.
- `shifted-points` receives that output separately from its own record and publishes `{ values: [{ id: "point-a", cells: { x: 60, y: 25 } }, { id: "point-b", cells: { x: 210, y: 45 } }] }`.
- Source ids are preserved.
- The output contains no `dx`, `dy`, plugin names, stop objects, or internal compiler addresses.
- Changing `dx` to `20`, or changing the upstream source, recomputes the output. An invalid upstream output prevents the transform and produces no partial output.

Load-time failures this slice must demonstrate: `requires: { dta: "points" }` is an unknown slot, and a source whose `x` is a string is `slot-incompatible` at load. A shifted track authored with a table `values: [...]` where `translate` declares a record is `values-shape-invalid`. A plugin local field given as stops where the spec says `static: true` is refused before transformation. A transform that returns an undeclared output name, or a `values` table with a string `x`, is refused at publish.

## 9. Dependencies and graph semantics

### 9.1 Ordinary bindings resolve published outputs

`input.requires.data: "points"` binds the source node to the plugin's `data` slot. The slot receives that node's published outputs, restricted to the outputs the slot declares. It never exposes authored stops, the source's local input, or private runtime state. Each bound source contributes one edge from source to consumer. The edge is node-level, whatever outputs the slot reads. Preserve existing id validation, qualification, deterministic ordering and cycle detection.

Never concatenate, zip, join, flatten, rename or broadcast dependency rows automatically.

### 9.2 Keyed dependency families

Rigs and solver goals need dictionary bindings. Retain them explicitly:

```ts
input: { requires: { bones: { upperArm: "upper-arm", forearm: "forearm" } } }
```

The plugin declares `bones` with `binding: "map"`. Resolution yields `requires.bones.upperArm` and `requires.bones.forearm`, each that member's outputs.

- The slot's declared outputs apply to each member.
- One graph edge per member binding. Edge identity carries slot and member key as separate fields, never a separator-encoded string.
- A map supplied to a single slot, and a string supplied to a map slot, are both rejected.
- Member keys are labels, never row keys or automatic joins.
- Deterministic diagnostic ordering for members uses code-unit order. A plugin must not infer domain order from object enumeration.
- A required map slot must be present. An empty bound map is structurally allowed. A plugin that needs a member rejects it in `validate`.

### 9.3 Optional slots and unavailable sources

- Required slot omitted: preparation error.
- Optional slot omitted: the key is absent in resolved input and the plugin decides its default.
- A bound source id missing from the authored graph: preparation error, even for an optional slot. A typo is not an absent binding.
- A bound source that exists but is not ready (membership or evaluation status): the consumer is blocked, even for an optional slot. Optional means optional to bind, not optional to obey once bound.
- A bound ready node whose output table is empty is data, not an unavailable source. Validate it against the slot declaration.
- An optional output (one the producer declares `optional`) that is absent from a ready node is absent in the slot, not an error.

During removal or edit transactions, refuse dangling references or rebind dependants in the same transaction. Never turn a bound slot into an unbound one silently.

### 9.4 One plugin per track

Compose with explicit chains: `source → translate → rotate → rendering`. No plugin arrays, priority sorting, inference from columns, or hidden stage order. One plugin may still take several named dependencies.

### 9.5 Remove automatic `observes` merging

The current `observes` output-edge behavior is record-oriented, and there is no unambiguous equivalent for tables. Remove the authored field and the merge. Rewrite meaningful demo composition as an explicit dependency and plugin operation. A notification-only relationship belongs in subscription infrastructure. Never reinterpret `observes` as concatenation, a row-zero merge, or an input binding.

## 10. Evaluation, publication, and failures

### 10.1 Evaluation order

For every affected node, in deterministic topological order:

1. Determine readiness under the existing membership and lifecycle policy.
2. Evaluate local cells at the node's scheduled progress, including any active live replacement. The result is a table or a record, as the track's contract declares.
3. Resolve dependency outputs from the current evaluation's candidate state.
4. If a bound dependency is unavailable, produce a blocked status and skip transformation.
5. With a plugin: validate evaluated input, run optional semantic validation, run `transform`, validate the output set including its kinds and unique row ids per table.
6. Without a plugin: the evaluated local values are published as the output `values`, in the shape they were authored.
7. Create an immutable ready result.
8. Stage results and source-revision metadata.
9. Commit the batch before notifying observers.

A downstream node sees an upstream result produced earlier in the same batch, not the previous public revision. If a dependency is unchanged in this flush, use its latest valid committed state under the existing readiness rules.

Local values and dependencies can have different motion progress. Do not resample dependencies at the consumer's progress. A dependency contributes its scheduled published result. Preserve existing cross-motion clock semantics.

### 10.2 Patch payloads

Keep the existing status vocabulary. The ready payload field is renamed from `values` to `outputs`, because it now holds the named-outputs map and `patch.values.values` would mislead. Do not publish both `values` and `outputs`.

```ts
type PatchPayload =
  | { status: "ready"; outputs: Outputs }
  | { status: "blocked"; diagnostics: readonly Diagnostic[] }
  | { status: "error"; diagnostics: readonly Diagnostic[] }
  | { status: "destroyed" };
```

The main output is `patch.outputs.values`. Preserve progress, revisions, source revisions, diagnostics, batch identity and lifecycle semantics where appropriate. Update types and consumers together. Only ready patches own output data. A consumer may retain its last rendered result when blocked or in error, but that is not fresh dependency data. Never run downstream transforms against stale output while labeling them ready.

### 10.3 Failure behavior

- Invalid authored definition, plugin or graph: reject the preparation or edit. Preserve the previous committed project on a failed transactional replacement.
- Current dependency unavailable: block the consumer. Do not call its transform.
- Runtime input spec or semantic error: error on that node.
- `validate` or `transform` throws: error with plugin and node context.
- Promise or non-object returned: output error. There is no async evaluation path.
- Any output invalid, of the wrong kind, undeclared, or missing when required: error on the node. A node's outputs succeed or fail together. Publish no partial set.
- An independent graph branch that stays valid may publish in the same coherent batch.

Atomic publication means observers see a coherent batch. It does not mean one node error rolls back independent nodes. Graph-edit atomicity is separate from ordinary runtime node failure.

### 10.4 Diagnostics

Use the existing diagnostic and rule system. `RuleId` is a closed union, so extend it deliberately in `contract/rule-id.ts`. Plugins never mint rule ids. Plugin `validate` issues are wrapped under one core rule (Appendix B). Include rule id, severity, node id and plugin id where applicable, the authored or resolved path (output name, row id or index, column or field), the slot, member and source when relevant, and a concise expected-versus-received message. Example: `motions[0].tracks[1].input.values.dx: expected a finite number, received a string.`

### 10.5 Immutability and caching

Reuse the finiteness and freezing logic in `domain/values.ts`. Reject `null`, `undefined`, functions, promises, dates, DOM and Three instances, cycles, objects or arrays inside cells, and non-finite numbers. Optional fields are omitted, never `undefined`. Cap rows, columns, fields and output count per node so a faulty plugin cannot blow up the graph. Freeze or snapshot at ownership boundaries. Never retain mutable plugin output as published state. No-plugin tracks need no gratuitous deep copies.

Start without result caching (see section 17). When final-output memoization is later needed, its key must cover plugin identity, graph and binding revision, authored and live-input revision, local progress, and relevant dependency revisions. A transform may use context progress even when its local values are static. Never cache by local values or array reference alone.

## 11. Compilation and interpolation implementation

The existing interpolation port and GSAP adapter are record-oriented. Two acceptable choices: a shape-aware abstraction, or an internal flat backend with a collision-free cell-address table and explicit reconstruction.

Recommended: reuse the existing backend and isolate flattening as a private adapter detail. Assign an opaque slot id to each animated cell address and keep a lookup table. A table cell address is `(row id, column)` and a record cell address is `(field)`. Never encode identity with an unescaped string such as `row + "." + column`. A private plan may use row index internally. Reconstruction must restore the authored row id, and a structural replacement invalidates the old plan.

- Keep static values separate from animated slots.
- Preserve original column and field names including unusual characters.
- Reconstruct every row or record at evaluation. Never leak slot ids into plugin input or publication.
- Keep per-cell stops and easing independent. A flat compiler must not let one cell's easing overwrite another's.
- A flat internal buffer does not violate row preservation. Losing row identity, exposing flattened properties, or merging duplicate column names does.

Performance risk: tween count scales with animated cells times rows. Benchmark this in Phase 2, before the plugin work builds on it, using `performance/graph-benchmark.mjs` as the template.

Do not carry over the plugin `contribute` and prepare machinery. For each real use: ordinary cell evaluation goes in the generic compiler. Authored graph expansion becomes a focused authoring helper that emits ordinary tracks before loading. A runtime value operation belongs in `transform`. If nothing current needs it, remove it. Do not add a generic prepare hook until a concrete requirement shows the simpler boundaries cannot express it. Never move nonlinear runtime transformation into compilation.

## 12. Authoring edits, live values, and runners

### 12.1 Authored edit versus live write

- Authored edit: changes cells, stops, bindings, the selected plugin, or track structure, including changing a track's shape between table and record. Revalidate and rebuild the affected plan transactionally, including source-spec re-inference and slot rechecks.
- Live write: supplies complete evaluated local `values` for a track until released. It never modifies authored stops. It must match the track's committed shape and contract and never re-infers it.
- Plugin output is derived publication and cannot be overwritten by an input editor.

Minimal live contract: whole replacement of evaluated local values, applied before plugin input validation. Dependencies stay separately resolved.

- A table track is written with a table of `{ id, cells }` rows. A record track is written with a flat record of scalars. A write of the other shape is refused. No row is invented, renamed or merged.
- No replacement: evaluate authored input.
- `write`: replace the whole live value, including row count for a table.
- `hold`: retain the previous replacement, if any.
- `release`: remove it and resume authored evaluation at the current progress.

For a no-plugin track the live value becomes its published `values` output. For a plugin track it still passes through the plugin. A malformed live write is refused without changing the committed overlay. If valid local data becomes semantically invalid because a dependency changed later, surface the normal runtime node error. No partial update is ever committed. Partial (merge) record updates are not part of v1.

### 12.2 Keep mutation APIs small

Begin with validated track and input replacement and shape-aware live writes. Add cell-edit methods only where demos need them. A table cell address includes row id and column, a record cell address is the field, and a binding address includes slot and optional member key. Remove obsolete group-edit and claim-based APIs. Preserve stale-handle detection, transactional replacement, invalidation reach, rollback reporting and cleanup. A plugin change validates the existing values and bindings against the newly selected plugin.

### 12.3 Runners stay outside pure plugins

Adapt `packages/plugins/src/runner.ts` so write steps carry a `Table` or a `FlatRecord` matching the target track. Keep explicit attachment, disposal and failure ownership. A runner reads committed patches and submits live inputs through the existing controlled scheduling path. No recursive evaluation from subscriber callbacks. Runners narrow patch status before reading `outputs` and explicitly select any singleton row. Kalman and filter state and frame ingestion stay in their existing stateful owners, not in a global plugin definition.

## 13. Plugin registry and loading

- Registry identity becomes plugin `id`, with explicit duplicate-id handling.
- Admission validates definition and `ValueSpec` shape, unique output names, `optional` absent from `inputs.values`, and callable hooks.
- Registration stays atomic: one invalid definition never leaves a partially updated registry (ADR-134 behavior).
- The loader scans `track.plugin`, not column names or grouped keys. A no-plugin track creates no plugin demand.
- Keep the approved catalog and loading boundary. Never import arbitrary authored module URLs.
- Asynchronous module loading completes before synchronous graph evaluation and commit. A load failure leaves the committed project and registry intact.
- Remove multi-plugin stage and priority resolution and claim-collision logic once all users are migrated.
- Export through `@motion5/core/plugin-api` so plugins never import private engine internals.
- If `domain/plugins.ts` approaches the 30 KB read-budget threshold, split by responsibility (admission, spec, resolution) rather than adding a sibling doc to excuse the size.

## 14. Built-in plugins and the solver migration

### 14.1 Every member is a row

A table-track model does not turn every singleton track into a many-row batch, but every keyed record that exists today becomes a table with one row per member, and the row `id` is the member identity.

- Record-like transforms: a `values` table of rows, mapping rows where semantics are independent. A single-record parameter input is a record `values`. Pass-through sources need no plugin.
- FK and FK3D per bone: keep one bone per track, singleton in and out. Preserve the math. A bone's own parameters (`length`, `rotation`, `weight`, limits) are a record `values`, and its output is a `values` record of the composed frame, or a one-row table if the solver slot needs row identity (decide in Phase 5).
- IK and IK3D: explicit rest, configuration, target and root inputs. Output a `values` table with one row per member, plus an optional `inspect` record (14.2).
- Rig aggregation: keyed input outputs. Publish a `pose` table (one row per bone) and a `controls` table (one row per control), replacing the `pose` and `controls` records.
- Pose classification and retargeting: define accepted and returned shapes explicitly. A single result (for example `label` and `confidence`) is a record output. Keep state outside transforms.

Never use row index as persistent member identity. A separate `memberId` cell exists only when it refers to another entity or carries independent domain meaning. Avoid two copies of one identifier, and do not conflate graph node ids, row ids and rig member references.

### 14.2 How the current IK results map

Today `ik` publishes `{ ...authoredValues, rotations: { "arm/upper": 38.2, "arm/fore": -61.5 }, inspection: { kind, residual, iterations, atBound, residuals } }`, where `rotations` is keyed by qualified node id, and the `inspection` record is present only when the solver's `inspect` is exactly `true`. `ik3d` publishes `rotations3d`, an Euler triple per member, and the same `inspection`.

The new outputs:

```ts
// ik
outputs: {
  values: { kind: "table", schema: /* row: rotation; optional residual, atBound */ },
  inspect: { kind: "record", optional: true, fields: /* kind (enum), residual, iterations */ },
}

// returned, with inspect: true
{
  values: [
    { id: "arm/upper", cells: { rotation: 38.2 } },
    { id: "arm/fore", cells: { rotation: -61.5, residual: 0, atBound: false } },
  ],
  inspect: { kind: "reached", residual: 0, iterations: 0 },
}
```

- `rotations`: the `rotation` column, keyed by row id. For `ik3d`, the columns `rotation`, `rotationX` and `rotationY` carry the Euler triple.
- `residuals`, keyed by addressed leaf: a `residual` column on the leaf rows, omitted on other rows.
- `atBound`, a list of member ids: a boolean column per member row.
- Solve-level facts (`kind`, worst `residual`, `iterations`): the flat `inspect` record, present only when opted in.
- `inspect` becomes a static boolean field in the solver's local record `inputs.values`. The plugin no longer echoes its authored keys (`flip`, `inspect`) into its output.
- `SolveQuality` stays a discriminated union with an exhaustive switch inside the solver. Only the published projection is flat, so keep the exhaustive reading where the result is produced.
- FK members bind the solver with a slot that declares `values` as a table with a `rotation` column. A member finds its own row by id. Verify in Phase 5 which id the solver rows carry: today the keys are qualified node ids (`"arm/upper"`), although ADR-014 says qualified ids stay internal. Decide once whether row ids are qualified ids or member keys, and apply it to FK, IK, rig and the demos.

### 14.3 Critical solver dependency hazard

The snapshot's graph code derives solver members and can read member rest or interpolated data separately from final member output. A naive conversion creates a cycle: `solver → posed bone output → solver`. A solver's member input must not depend on a final output that itself depends on the solver.

### 14.4 Explicit decomposition

Separate rest and configuration data from solved world frames:

```text
animated rest/config tracks ──┐
root and target tracks ───────┼──> solver ──> FK/world-frame tracks ──> rig
explicit topology data ──────┘              ↑
                         rest/config ──────┘
```

- Rest and config tracks publish evaluated local parameters without reading posed outputs.
- Topology and member identity are explicit data.
- The solver consumes rest/config outputs, root and goals.
- FK and world-frame tracks consume their rest/config, the parent world frame, and the solver output, following the actual acyclic hierarchy.
- Each authored value has one owner. Helpers must not duplicate animated authored data into two independently editable copies.

A focused rig and solver authoring helper in the plugins package may expand a higher-level rig description into ordinary tracks of this same contract. It must not create a second runtime or a parser for the old grouped tracks.

### 14.5 Solver checkpoint before broad migration

First demonstrate a representative 2D chain and a 3D chain on the explicit graph. Verify: no cycle or hidden read of private track state; rest data changes reach the solver and downstream frames; goal and root data drive the expected solve; multiple goals and keyed members stay distinct; the per-member rows and the `inspect` record carry what `rotations` and `inspection` carried; constraints, weights, rest orientation and pivot offsets survive where current tests cover them; existing numerical fixtures pass with deliberately reviewed tolerances.

Reuse the numerical algorithms and their tests. Change transport and wrappers, not the solver math and architecture at the same time. If a current solver fixture cannot be represented, stop that unit and document the specific dependency conflict. Never smuggle the old private member-read mechanism into ordinary `requires`, and never silently drop solver behavior.

## 15. DOM, React, Three.js, and demo migration

No silent first-row adaptation. Provide a shared singleton selector that requires exactly one row of a named table output and returns the identified row. Empty and multi-row tables are never collapsed silently. A record output is read directly by field. For many rows, require an explicit selection policy: row id lookup (preferred), positional index only for intentionally positional data, one target per row in a table-aware renderer, or a deliberate projection. Domain-key selection by a cell may remain only when the application needs it, and it defines its own duplicate-key behavior separately from envelope uniqueness. Every selector defines missing-row, missing-output and wrong-kind behavior.

- React hooks and stores expose the new patch and outputs types. Helpers narrow status before reading `outputs`, and name the output they read.
- Blocked and error may retain the last rendering under the existing policy, without presenting it as current output.
- Destroyed patches trigger detach and removal. DOM property removal and diffing stay correct for the selected row.
- Three.js instances stay outside renderer-neutral outputs. Adapters construct and apply host objects.
- Update serializer and render-metadata handling as needed. Do not bake DOM or Three serialization into the core transform contract.

Migrate generators, not only literals: `apps/react-demo/src/full-body-project.ts` and inspector UI, track factories and scenes in `apps/ik-playground` (including `SolverPanel`, which reads `rotations` and `inspection` today), sources, rig wiring, runners and view adapters in `apps/pose-gap-filler`, `packages/three/src/skeleton-tracks.ts` and skeleton drivers, plus test factories, benchmark fixtures, catalog examples and doc snippets. A demo that builds is not proof it animates correctly. Smoke-test seeks, clock updates, rendering, source changes, errors and disposal in each app.

## 16. Test migration strategy

The repository has 124 test files that author `keyframes:` literally, so a naive port edits a hundred files by hand and bakes the new shape into each one.

1. Before touching any engine code, add one set of test builders in a shared support module: `table(...)`, `row(id, cells)`, `record(...)`, `track({ id, plugin, values, requires })`, `project(tracks)`, and an `outputOf(patch, name)` reader. All new and ported tests construct tracks and read outputs through these. A later shape change then edits one file.
2. Classify the existing tests once, in Phase 0, into four groups and record the count of each: tests of behavior unrelated to the shape (scheduler, triggers, publish ordering, blocked and error propagation, freezing, cycles); tests of the old shape that encode a rule still needed; tests that exist only because of old machinery (claims, stages, priority, group flattening, `observes` merging); and numerical and solver fixtures.
3. Group 1 is ported by switching its fixtures to the builders. Do not rewrite its assertions.
4. Group 2 is rewritten against tables and records. Each rewritten test names the old rule it carries over.
5. Group 3 is deleted together with the machinery it covers, in the same slice as the deletion, with the deletion listed in the pull request body. Never delete a failing suite merely to get green.
6. Group 4 keeps its fixtures and assertions. Only the transport wrappers change, for example reading `rotation` from member rows instead of `rotations[id]`.
7. Golden fixtures (`packages/core/test/fixtures/v5-contract.ts`, `golden-roundtrip.test.ts`, `pose-gap-filler` fixtures) are regenerated by one reviewed script, and the diff is read, not trusted.
8. Land the builders and a failing acceptance suite for the vertical slice first. This keeps later slices vertical, and red tests are recorded as staged, not reported as done.

## 17. Plugin caches (last, measured-need only)

Plugin transforms stay deterministic. A cache is a disposable optimization: deleting it and recomputing must not change the correct output for the same request. If earlier requests influence the correct result, the plugin is history-dependent, needs a separate contract, and does not belong in a cache.

Cache examples: a parsed path for a given path string, a prepared topology index for a topology revision, a lookup table derived from configuration. Not caches: a previous position used to integrate the next one, a smoothed value derived from the previous output.

Required determinism: with the same definition, resolved input and context, evaluation order `0.2 → 0.8`, `0.8 → 0.2 → 0.8`, a fresh engine evaluating `0.8` directly, and evaluation at `0.8` after cache eviction must all agree.

**Do not implement the hooks below until a migrated plugin shows a measured preparation cost.** Simple plugins such as `translate` need none. Add them in the last implementation step, after identity, specs, graph and demos are working.

```ts
interface PluginDefinition<Cache = undefined> {
  // existing id, inputs, outputs, validate remain
  createCache?: () => Cache;
  transform: (input: ResolvedInput, context: EvaluationContext<Cache>) => Outputs;
  disposeCache?: (cache: Cache) => void;
}
interface EvaluationContext<Cache = undefined> {
  readonly nodeId: string;
  readonly progress: number;
  readonly cache: Cache;
}
```

Constraints: hooks are synchronous. `createCache` creates empty private storage and reads no graph. `validate` never depends on cache contents. A cache is not authored data, published data, serialized state, or a dependency output, and it exposes no editing API. Allocate one cache per track runtime instance and selected plugin inside one engine instance. Never place a mutable cache on a globally registered plugin definition. Cloned or preview engines get independent caches.

Lifecycle: create lazily before the first transform. Reset conservatively for the affected track on an authored or binding change. Dispose the old cache and create a new one on plugin replacement. Dispose exactly once on track removal or graph destruction. A failed project transaction disposes candidate caches and keeps committed ones. Never reset every cache in the engine for one unrelated change.

Keys must cover every value that affects the cached computation: the actual parse input for a parsed path, topology data or revision for a prepared topology, row id plus the relevant cell values for per-row work. Row id alone, track id alone, or progress alone never proves unchanged input. Keep engine-level memoization (skip a whole transform on known unchanged inputs) distinct from plugin-private preparation caches, and never skip a transform only because local values are unchanged. Bound memory: prefer last-input caches, prune removed rows, never retain a result per progress sample.

Failures: `createCache` throwing is a node error. A throwing transform or failed output validation discards that node's cache. A throwing `disposeCache` reports a cleanup diagnostic and continues the remaining cleanup. Never retry a failed transform repeatedly within one flush.

Stateful plugins are deferred. A transform that integrates over history needs answers for forward and backward seek, repeated time, changed targets mid-timeline, different sampling intervals, restart and loop, and out-of-order evaluation. A generic mutable `state` object answers none of these. Keep live sequential state in runners that submit ordinary live values. Do not add `step`, `snapshot` or `restore` hooks now. If a simulation plugin is later justified, first choose its mode (closed-form, deterministic replay, checkpointed replay, forward-only) and specify state ownership, clock rules, reset and checkpoint invalidation.

## 18. Repository change map

Paths exist in the inspected snapshot. This is an ownership map, not an instruction to rewrite every file.

- `contract/v5.ts`: replace track, group and plugin-facing types and the ready patch payload with table, record and outputs contracts. Keep schema 5.
- `contract/validate-v5.ts`, `src/validate-v5.ts`: new authored validation. Explicit old-shape refusal.
- `contract/authored-leaf.ts`: one owner of scalar and stops classification.
- `contract/keyframe-shape.ts`, `domain/keyframe-groups.ts`: remove grouped readers and flattening.
- `contract/keyframe-compiler.ts`: table and record cell compilation, or extracted reusable interpolation helpers.
- `contract/rule-id.ts`, `contract/rule.ts`, `contract/diagnostics.ts`: extend the closed rule set (Appendix B).
- `domain/plugins.ts`, `domain/plugin-admission.ts`: single-plugin definitions, `ValueSpec` and outputs validation, admission. Split by responsibility.
- `domain/track.ts`: table and record evaluation, optional single transform, immutable outputs.
- `domain/values.ts`: reuse finiteness and freezing. Add table, row and flat-record boundary helpers. The accepted cell set narrows to scalars.
- `domain/authoring/keyframes.ts`, `domain/authoring/recompile.ts`: replace group and property edits with row, cell, field and input operations.
- `graph/ir.ts`, `graph/binding.ts`, `graph/references.ts`: named-slot edges, slot compatibility against outputs, no output merging, explicit solver policy.
- `graph/ids.ts`, `graph/order.ts`, graph builders: reuse suitable logic. Update edge payloads and incremental invalidation.
- `ports/interpolator.ts`, `adapters/interpolator/gsap.ts`: isolate table and record to backend mapping. Preserve disposal.
- `runtime/graph-runtime.ts`, `graph-runtime-state.ts`, `graph-publisher.ts`: outputs state, candidate results, readiness, same-batch reads.
- `runtime/patch-registry.ts`, publication modules: outputs-aware ready publication.
- `runtime/project-runtime.ts`, `commit-plan.ts`, `run-plan.ts`: transactional replacement, invalidation, rollback, cleanup.
- `runtime/authored-values.ts`, `value-state.ts`, `authoring-edit.ts`: authored versus live distinction, shape-matched live writes.
- `contract/track-handle.ts`, `schema-transaction.ts`, `value-transaction.ts`: input edit APIs, atomicity, stale-handle checks.
- `src/engine.ts`, `src/index.ts`, `src/plugin-api.ts`, `src/internal.ts`: coherent exports. Remove grouped and composer types.
- `packages/plugins/src/loader.ts`, `catalog.ts`, built-in plugins (`ik*`, `fk*`, `rig`, `transform*`, `pose-classify`), `runner.ts`: explicit demand, outputs and `ValueSpec` contracts, shape-aware writes. Keep the algorithms.
- Core DOM adapter, `packages/react/src/*`, `packages/three/src/*`: row selection and outputs patch types.
- Tests, performance scripts, demos: new shape through the builders (section 16).

Proposed new responsibilities: `value-spec`, `authored-cell`, `track-input`, `value-compiler`, `outputs-validator`. These are suggestions, not existing files. Prefer an existing sensible owner over a new module per type.

## 19. Implementation phases and exit gates

Work in bounded units. A short-lived private branch or temporary internal staging module is acceptable. Two permanently supported engines are not.

**Phase 0: Inventory and baseline.** Read manifests, authored types, one source track, one plugin, publication contracts and representative tests. Capture baseline checks and existing failures, and the solver and performance fixtures. Inventory plugins, generated tracks, demos, contribution hooks, `observes` uses and live-write APIs. Classify the tests (section 16). Record the v5 and no-consumer policy. Exit: a compact impacted-module map, a test classification count, and baseline evidence. Pre-existing failures are distinguished from regressions. No broad rewrite has started.

**Phase 1: Contracts and failing acceptance tests.** Define authored, evaluated and published types, the row envelope, scalar cells, `ValueSpec` with `kind` descriptors, `static`, binding modes and failure rules. Add the test builders and the vertical-slice acceptance suite, including old-shape refusal, flat-row refusal, structured-cell refusal, `type`-alias refusal and `values-shape-invalid`. Exit: tests encode the contract and the type direction is settled. Staged failures are recorded as staged.

**Phase 2: Cell compiler, identity track, inference.** Parse and validate scalar and stop cells for tables and records. Compile and evaluate without row, column or field collisions. Infer and validate source contracts. Publish a no-plugin track as the output `values` through the real ready-patch path. Run the interpolation benchmark. Exit: multiple simultaneous rows, records, empty values and progress changes behave correctly. Slot ids never leak. Inference follows section 6.4. Performance is measured against the benchmark baseline.

**Phase 3: One plugin and one dependency.** Plugin admission, input specs and outputs, optional validation, single-plugin execution, single and keyed bindings, the load-time slot checker. Exercise `points → translate` (a record parameter and a table dependency) through the real graph and publisher. Exit: same-batch freshness, invalid input and output handling, undeclared, missing and wrong-kind output handling, optional-slot behavior, unknown-slot and incompatible-slot refusal, cycle rejection and branch isolation pass.

**Phase 4: Transactions, scheduling, live values.** Authored edits (including spec re-inference), shape-matched live writes, runners, handles, incremental invalidation, cleanup. Preserve membership, trigger and clock ownership, lifecycle and rollback. Verify time, manual and scroll paths and the loop behavior that actual tests cover. Exit: failed edits keep the old working graph, live write, hold and release are deterministic and shape-checked, and repeated replacement or destroy leaks no timeline or subscription.

**Phase 5: Domain plugins and solver graph.** Simple plugins first. Prove the explicit 2D and 3D solver decomposition (section 14.5) before migrating all rigs, including the `values` rows and `inspect` record of `ik` and `ik3d` and the `pose` and `controls` tables of `rig`. Decide the row-id convention (14.2) and the FK output shape (14.1). Then keyed dependencies, retargeting, classification and the outputs the demos need. Exit: domain behavior is expressed with tables, flat records and declared dependencies. Numerical regression tests remain meaningful and pass.

**Phase 6: Adapters and demos.** Update DOM, React and Three consumers and generated tracks. Replace all grouped keyframes and implicit output merging in demos. Add singleton, row-id and named-output selectors at render boundaries, and update the `SolverPanel`. Exit: all three apps build, automated and manual behavior checks pass, and no demo uses the old APIs.

**Phase 7: Remove superseded paths and finalize authority.** Remove grouped readers, claim, stage and priority machinery, old merges, unused contribution paths and old-shape compatibility remnants. Reconcile documentation, exports, scans, test names, scripts and fixtures. Run the full checks and performance comparisons. Exit: one supported v5 contract remains and every item in section 25 has evidence.

**Phase 8 (conditional): Plugin caches.** Only if a plugin shows a measured preparation cost. Implement section 17. Exit: cache isolation, eviction equivalence and cleanup tests pass, a concrete reuse test observes avoided work, and any performance claim has a separate benchmark.

## 20. Acceptance-test matrix

Implement these as behavior tests, not source-string snapshots, wherever possible.

**Version and shape**

- New shape accepted at schema 5. The schema constant stays 5. Old grouped shape at schema 5 is refused. No v6 aliases. Old flat-record rows (without the envelope), `type` descriptors and object or array-literal cells are refused.

**Table and record values**

- `values` as an array is a table and as a plain object is a record. A plugin declaring a record refuses an array, and one declaring a table refuses an object, as `values-shape-invalid`.
- No-plugin tracks keep their authored shape: a record source publishes a record `values`, a table source a table.
- Omitted `values`: an empty table for a no-plugin track, and the declared kind's empty form for a plugin. `{}` and `[]` are distinct.
- Record fields animate independently with the same cell rules as table cells. A record has no row id and no implicit row.
- A record spec refuses `optional` on `inputs.values` at admission.

**Rows and cells**

- Authored, evaluated, dependency, output and live tables all use `{ id, cells }`.
- Envelope `id` and a cell named `id` coexist without collision.
- Empty or non-string row ids fail. Duplicate ids in one table fail. Equal ids in different tables are allowed. `__proto__`, `constructor` and `prototype` names are refused for rows, columns, record fields and outputs.
- Missing input, empty table, row with empty cells, heterogeneous rows, finite scalars, empty or malformed stop arrays, an empty bare array refused.
- Cell evaluation preserves row ids and order. The same column in several rows, and unusual column names, never collide.

**Interpolation**

- Progress 0, 0.5, 1. First and last hold. Single stop. Duplicate and out-of-range positions. Easing on the correct interval. First-stop easing refused. Independent cell intervals. Discrete cells. Mixed kinds refused.

**Inference, declarations, static**

- Numeric source cells infer required numeric columns from all rows, and a record source infers required numeric fields. Every stop is inspected, so a later conflicting stop is caught.
- Missing columns become optional and fail consumers that require them.
- Inference does not manufacture `static`, enums, bounds or row-count promises.
- An empty undeclared source cannot satisfy an unproven required typed slot. An empty declared source can establish kinds, and runtime cardinality still applies.
- Conflicting inferred kinds are refused with paths.
- Explicit source declarations are validated, not trusted. `input.schema` on a plugin track is refused, and its kind must match the authored shape.
- Source spec edits recheck bindings transactionally. Failed edits keep the old graph. Live writes obey the committed contract and shape.
- Static fields accept matching scalars, reject any stop sequence including one stop, and may be omitted when optional. Nonstatic booleans accept discrete stops. Source output contracts omit `static`.

**Plugin selection, validation, transformation**

- No-plugin publication as the output `values`. Explicit known plugin. Unknown or empty id. No inference from columns. No plugin chain inside one track. `requires` without a plugin refused.
- Local input and dependency outputs are checked separately. Row-count bounds, required and optional columns and fields, extra-field policy (open slots, closed outputs), enums and bounds, no coercion.
- Warning permits transform. Error skips it. A throwing validator becomes an error.
- Map, filter to empty, expansion with deterministic unique ids, aggregation, exact returned output, no implicit preservation of authored keys or input columns.

**Outputs**

- A table output and a flat record output in one node. A record with a nested object or array is refused.
- An output of the wrong kind (a record where a table is declared) is refused.
- An undeclared output name is an error. A missing required output is an error. A missing optional output is accepted and absent.
- Duplicate row ids in an output table produce a node error, not a partial ready set. A failing output fails the whole node.
- Output safety: non-object return, malformed row, unexpected column, invalid scalar, promise, host object, cycle, mutation attempt.

**Bindings and graph**

- Single and map slots. Slot and member isolation. Missing slot, missing source, unknown slot, mode mismatch. Required and optional behavior. Empty ready table.
- Load-time slot checks: inferred numeric source passes a matching `values` slot, string `x` fails numeric `x`, an optional producer field fails a required consumer field, a slot naming an output the producer lacks fails, a table-versus-record mismatch fails, map members are checked independently, diagnostics distinguish a known mismatch from unproven evidence, and structural success never disables runtime checks.
- Duplicate ids, qualification, cycles, diamonds, source declared later, deterministic topological order, cross-motion scheduling. The edge is per node regardless of how many outputs a slot reads.

**Publication and failures**

- Ready owns `outputs`. Refusals own no stale data. Same-batch freshness. Source revisions. No subscriber sees a partial flush. A change in any output, including only the `inspect` record, makes a new revision.
- An invalid source blocks its consumer, an independent branch still publishes, recovery yields ready output again.

**Mutations, live values, lifecycle, loading**

- Track, plugin, input and binding replacement, including a shape change. Invalid edit rollback. Changed row counts. Stale handles. Removal with dependants. Plugin replacement rechecks edges.
- Whole-value write for tables and for records, repeated replacement, hold, release at the current progress, validation refusal, authored data unchanged. A record written to a table track, and the reverse, is refused. A write never renames a row.
- Mount and unmount gating. Destroy produces a terminal patch. Subscription and timeline disposal. Repeated replacement. Reentrant subscriber handling.
- Explicit plugin demand. No demand without a plugin. Atomic registration. Async load refusal. No partial commit.

**Adapters, solvers, demos**

- Singleton enforcement for a named table output. Direct field reads for a record output. Row-id selection with missing-row, missing-output and wrong-kind behavior. Duplicate domain-key behavior. DOM property removal. Three frame application. React store disposal. Runners write shape-matched values.
- Acyclic rest and solved split. Animated rest updates. Multi-goal labels. One solver row per member with `rotation`, optional `residual` and `atBound`. `inspect` present only when opted in. Constraints, pivots, orientation. Numerical fixtures.
- Rig publishes `pose` and `controls` tables with one row per member.
- Each demo builds and exercises updates, rendering, seeks and cleanup with no legacy APIs.

**Caches (Phase 8 only)**

- Plugins without hooks work. Two tracks and two engines get separate caches. Eviction and recreation leave correct output unchanged. Evaluation order `0.8 → 0.2 → 0.8` matches a fresh direct evaluation. Row id reuse with changed cells does not reuse stale preparation. Dependency and progress changes invalidate correctly. Removed rows do not leave unbounded entries. Replacement and destruction dispose exactly once. Failed candidate transactions dispose candidate caches. Creation, transform and output failures report errors. Cache internals never appear in serialization or published output.

Replace superseded tests' expectations explicitly. Do not delete failing suites, reduce coverage, or weaken boundaries to pass the build.

## 21. Validation commands and evidence

These scripts exist in the inspected workspace. Run them with the supported Node version (`>=24`).

```bash
npm ci
npm run scan:raw-templates
npm run format:check
npm run typecheck
npm run test:contract
npm run test:integration
npm run test:boundaries
npm run test:read-budget
npm test
npm run check

npm run build --workspace=@motion5/react-demo
npm run build --workspace=@motion5/ik-playground
npm run build --workspace=@motion5/pose-gap-filler

npm run benchmark
npm run bench:ik
```

- `npm run check` covers raw-template scanning, format check, typecheck and the test suite. It does not run the boundary, read-budget or benchmark commands.
- Keep formatting-only changes in separate commits from behavior (`AGENTS.md`).
- Inspect the purpose of `test:migration` and the v4 migration exports. Remove obsolete migration surfaces if unused, or document the narrow reason they remain. Never add an old-v5-to-new-v5 converter.
- If manifests change, regenerate the lockfile with the existing npm workflow.
- Compare like-for-like benchmark workloads. More rows mean more work. Never claim a speedup by shrinking entities or graph coverage.
- Do not change scan rules to bypass failures. Update them only when the contract genuinely changes a boundary.
- A missing environment or failed command is a blocker or failure, never a pass.

Record each command, exit result, relevant output and the source revision tested. None of these commands were executed while preparing this guide.

## 22. Documentation, repository process, and cleanup

Follow `AGENTS.md`; it is the authority on process and this guide does not override it.

- Add one ADR for the identified-table, table-or-record and explicit-plugin redesign. The repository already has ADR-001 through ADR-141, so use the next free number and the existing record format. Mark conflicting records as superseded for the current design and keep them as history: at minimum the grouped-only keyframe decisions ADR-041, ADR-043, ADR-044, ADR-049, ADR-050, ADR-057 and ADR-121, the solver output records (ADR-109 and ADR-110 inspection shape), plus the plugin stage, priority and claim machinery. ADR-002 and ADR-011 still hold (schema 5 is the contract) and gain a note about the two v5 layouts.
- Rewrite `docs/SESSION-STATUS.md` rather than appending. Verify any "merged" claim before writing it.
- Record rules you earn in `docs/GUARDRAILS.md`, and run evidence in the pull request body, not the status file.
- Update `README.md`, `docs/AUTHORED-SCHEMA.md`, `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/TRD.md` where the model changes, `docs/IMPLEMENTATION-PLAN.md`, `docs/guide/*` examples (including the IK guide examples) and plugin-authoring guidance, module docs and exported types. Update acceptance mappings and boundary fixtures where their assertions change.
- Respect the read budget: no file under `packages/core/src` over 60,000 bytes, and a source over 30,000 bytes keeps its reasoning in a sibling `.md`.
- Author no markdown tables. Prettier is pinned, `printWidth` is 100, and prose is not rewrapped.
- Audit documentation against actual code and tests. For example, the README's remaining-work text discusses rejected loop behavior while trigger types expose `repeat` and `yoyo`. Do not use an old prose checklist as a substitute for verifying behavior.
- Search for old concepts and classify each match: `keyframes.<plugin>`, `AuthoredPluginGroup`, grouped `requires`, `claimsKey`, `compose`, `contribute`, `stage`, `priority`, `rotations`, `inspection`, record-oriented patch assumptions, `observes` merging, flat live-value writes, grouped-key loader discovery. Historical ADRs, generic interpolation terminology and mathematical composition names may stay. Review semantic use. No blind global replace.
- Do not write a second long-lived migration narrative. The authored-schema guide describes one v5 shape, and history goes in a concise supersession note.

## 23. Token-efficient AI implementation workflow

Give each implementor: the relevant guide section, one current status note with decisions and blockers, the specific code, type and test owners, an executable acceptance target, and explicit non-goals and unchanged invariants. Do not attach the whole history, every ADR, or the whole repository.

Prefer bounded vertical tasks that produce observable behavior with types and tests: identity evaluation through real publication, one plugin with specs and outputs, one source-to-consumer dependency through a same-batch flush, a live write and release through the real handle path, one DOM binding with singleton enforcement. Avoid "refactor all the runtime files".

Parallelize only independent ownership after contracts stabilize: DOM and React versus Three adapter migration, simple plugin ports versus documentation examples, independent numerical fixture checks. Never parallelize shared contract design, shared graph, runtime or publication types without a frozen interface, or plugin ports before slot, outputs and solver transport is decided. Use one integration owner and pass a short changed-interface summary between tasks.

Use the repository's reviewed transports for multi-file work. One slice goes through an AI edit request. A stack goes through an AI checkpoint (`docs/AUTOMATION-TRANSPORT-CHOICE.md` owns the choice). Hand finished work to an independent quality pass that reads the whole change and reports as a pull request comment. Write a checkpoint comment as you go, naming the head read, the slice and step, what is published versus prepared, the evidence, the decisions and withdrawals, and the single next action.

Task handoff template:

```text
Goal:
Relevant contract sections:
Current source revision:
Files/modules to inspect first:
Allowed change scope:
Behavioral acceptance tests:
Commands to run:
Invariants not to change:
Known baseline failures:
Non-goals:
Completion evidence required:
```

Keep progress notes factual. Do not mark a phase complete because code was written if its exit gate has not passed. Avoid these detours: a v6 rename, a compatibility layer, new repository scaffolding, a broad solver math rewrite, schema metaprogramming, a formatting sweep mixed with behavior, preserving dead abstractions, and declaring a large first patch done before integration tests and demos run.

## 24. Decisions and deliberately deferred features

Owner-confirmed constraints:

- A track is authored as `values`, a table of identified rows or a flat record. Rows are simultaneous records of one table, identified from day one.
- One optional explicit plugin transforms resolved input into published outputs.
- Each solver or rig member is its own row.
- A node publishes named outputs, each a table or a record. The default output is named `values`.
- Table-or-record (`ValueSpec`) is a real kind on both input and output, not sugar.
- Breaking changes are acceptable. The project is unreleased with no external consumers. Keep v5.

Decisions adopted by this guide, as implementation defaults unless a documented repository requirement justifies a revision:

- Existing repository, replacement core, no legacy compatibility.
- One plugin per track. Explicit chains for several transformations.
- Row envelope `{ id, cells }` for tables. Required nonempty unique ids. Specs describe `cells` and record fields.
- Scalar-only cells. Authored cells are a scalar or a stop array. No literal wrapper, no nested values.
- One `ValueSpec` for `inputs.values`, slot-declared outputs and plugin `outputs`. No normalization between table and record, no reserved row id, no bare-array return shorthand, no declaration helpers.
- Source tracks infer a contract for their `values` output, with an optional complete `input.schema`.
- Outputs are tables or flat records of scalars. A flat record carries table-level facts (the `inspect` record). A per-entity fact is a column.
- A slot receives the bound node's outputs, restricted to the outputs it declares. The graph edge stays node-level.
- A node's outputs succeed or fail together.
- The ready patch field is `outputs`. The main output is `outputs.values`.
- `kind` descriptors only, one flat vocabulary. `static` only in local authored input. Slot declarations default open, plugin inputs and outputs default closed.
- Small load-time slot checker comparing kinds and fields, with runtime validation authoritative.
- Required-by-default slots. Optional-to-bind does not mean ignore bound failures.
- No-plugin tracks publish their evaluated `values` in the authored shape. Nonempty `requires` without a plugin is rejected.
- Live writes replace the whole local value and must match the track's shape. No renaming, no merge.
- Explicit adapter row selection, preferring row id.
- No automatic `observes` merge.
- Solver rest and config data separated from solved world frames.
- Deterministic plugins. Caches are a conditional last phase.

Deferred until a concrete need appears: multiple plugins per track, binding to one named output of a node (`"solve.values"` style) instead of the whole node, nested or array-valued record outputs and structured cells, merge-style partial record writes, dynamic output specs and general spec assignability, structured-value interpolation, joins, broadcasting or inferred row matching, feedback and cyclic graphs, async or effectful transforms, remote plugin loading, a generic prepare phase, stateful simulation plugins and their step, snapshot and restore hooks, release or publishing changes, and compatibility migration tools.

## 25. Definition of done

Contract

- [ ] The project remains motion5, schema 5, private `0.0.0` packages.
- [ ] One documented authored track format: `id`, optional `plugin`, `input.values` as a table of identified scalar rows or a record, `input.requires`, optional source-only `input.schema`, and scheduling fields.
- [ ] Old grouped authoring, flat rows, structured cells and `type` descriptors are rejected, not ignored or translated.
- [ ] Rows, row ids, records, animated cells, inference and `static` have precise tested semantics.
- [ ] Plugins declare input specs and named outputs (tables or flat records) and own complete transformations.

Engine

- [ ] No-plugin tracks publish their immutable evaluated values as the output `values`, in the authored shape.
- [ ] Dependency outputs stay separate from local values.
- [ ] Same-batch downstream evaluation uses current candidate results.
- [ ] Failures, blocked propagation, revisions, batching, lifecycle and rollback are correct.
- [ ] Authored edits and shape-matched live replacement are distinct and tested.
- [ ] Load-time slot checks exist and runtime validation remains authoritative.
- [ ] One execution path remains. Stage, group and merge machinery is removed.

Integrations

- [ ] Required built-in plugins and keyed families are ported, with one row per member for `ik`, `ik3d` and `rig`.
- [ ] Representative 2D/3D solver graphs are explicit and acyclic. Numerical behavior is verified.
- [ ] DOM, React and Three row and output selection is explicit and safe.
- [ ] Generated tracks, runners, inspectors, benchmarks and all three demos use the new shape.

Verification and authority

- [ ] Format, type, unit, contract, integration, boundary and read-budget checks pass, with baseline failures distinguished.
- [ ] All demo builds and agreed smoke tests pass.
- [ ] Performance is measured on representative unchanged workloads. Regressions are explained or fixed.
- [ ] Test migration followed section 16 and no suite was deleted without its machinery.
- [ ] Documentation, status, examples, exports and the new ADR agree, and conflicting ADRs are marked superseded.
- [ ] No v6 renaming, release work, compatibility framework or simulation framework slipped into scope.

## 26. Brief for an AI implementor

> Refactor the existing motion5 repository to the identified-table and explicit-plugin architecture in this guide. This is an unreleased redesign of **v5**, not v6. Keep `schemaVersion: 5`, `AUTHORED_SCHEMA_VERSION = 5`, the `motion5` and `@motion5/*` names, and the private `0.0.0` package policy. There are no external consumers, so update demos directly. Add no legacy parsers, compatibility wrappers, migration converters, or second supported engine. Follow `AGENTS.md` for process.
>
> A track authors `input.values` as a table of identified rows `{ id, cells }` or as a flat record. Cells are scalars or stop arrays only. Table-or-record is a real kind (`ValueSpec`) on both input and output, with no normalization between the two. Dependencies go under `input.requires`. The engine evaluates cells and resolves the named outputs of upstream nodes. One optional explicit plugin validates the evaluated input, transforms it, and returns named outputs, each a table or a flat record as declared in its `outputs`. A no-plugin track publishes its evaluated `values`, in the authored shape, as the output `values`. The ready patch carries `outputs`. Preserve rows during evaluation. Plugins explicitly handle row ids when they filter, expand, aggregate or combine. Never implicitly merge tables or pick row zero in adapters.
>
> Specs use one flat `kind` vocabulary and describe `cells` and record fields, never stop syntax. A source track gets a contract inferred from all its rows, fields and stops, unless it supplies a complete `input.schema`. Empty or ambiguous evidence is not `any`. A slot declares the outputs it reads from the bound node and their `ValueSpec`s. Add a small load-time producer-to-slot structural check that compares kinds, keep runtime input and output validation authoritative, and revalidate affected edges transactionally after structural changes. Live writes replace the whole local value, match the track's shape, and obey the committed contract. `static: true` exists only in local authored input and forbids stop sequences.
>
> Every solver and rig member is its own row. `ik` publishes `values` (one row per member) and an optional flat `inspect` record. Start with the test builders and the source-to-translate vertical slice, then extend through the phases and exit gates. Handle solver rest-versus-solved dependencies as a separate explicit checkpoint, with no cycles or hidden private reads. Treat plugin caches as a conditional last phase, and keep history-dependent state in runners. Report failures honestly, remove superseded code before declaring completion, and base completion on verified behavior and recorded check results.

## Appendix A: What changed relative to the source documents

Conflicts between the original guide and its addendum, resolved in favor of the addendum as it stated: the `{ id, cells }` row envelope, `kind` descriptors, source inference with an optional `input.schema`, a small load-time slot checker (replacing "defer all compatibility analysis"), `static: true` on local columns, row-id-first selection in adapters, live values with envelopes.

Improvements made in the first consolidation:

1. Test migration strategy added (section 16). Neither source addressed the 124 test files coupled to the old shape.
2. Slot-declared outputs default to an open extra-field policy. The sources used one closed table for both a producer's output and a consumer's slot.
3. Plugin caches moved to a conditional last phase.
4. Repository process aligned with `AGENTS.md` (ADR numbering after ADR-141, status file rewritten not appended, no markdown tables, read budget, AI edit and checkpoint transports, ADRs to supersede named).
5. Early performance gate on tween count.
6. Reserved-name and size guards, and a collision-safe compound-id helper.
7. Proposed rule ids listed (Appendix B).
8. Markdown tables replaced with lists.

Decisions made in the later design review:

1. **Cells are scalar-only.** The `{ literal: ... }` wrapper, structured static cells, nested descriptors, recursive inference, empty-array inference and depth caps are removed. A bare authored array is always a stop sequence. Structured data is expressed as rows and columns.
2. **Named outputs replace "one table".** A node publishes a set of named outputs, each a table or a flat record of scalars. This resolves the IK shape (per-member rows plus an `inspect` record) without table meta and without a second output port. Table meta, a reserved summary row and repeating solve-level columns on every row were considered and rejected.
3. **Slots read outputs.** A slot receives the bound node's outputs, restricted to those it declares. The graph edge stays node-level, so ordering, cycle detection, invalidation and keyed bindings are unchanged. Binding to a single output is deferred.
4. **The default output is named `values`,** mirroring the input `values`.
5. **The patch field is renamed `outputs`.** With named outputs, keeping `values` would give `patch.values.values`.
6. **Solver and rig outputs are one row per member.** `rotations`, `rotations3d`, `pose` and `controls` records become tables. `inspection` becomes the flat `inspect` record plus per-row `residual` and `atBound` columns. The row-id convention (qualified id versus member key) is an explicit Phase 5 decision.
7. **Table-or-record is a real kind on both input and output.** One `ValueSpec` serves `inputs.values`, slot-declared outputs and plugin `outputs`. A record input is read as `values.dx`, not as a one-row table, so there is no reserved row id and no normalization step. The earlier shorthand ideas were considered and rejected: a record input that normalizes to a row with a reserved id, a bare-array return from `transform`, a `tableOutputs` declaration helper, a `table:` slot form, and published-shape helpers. Live writes match the track's shape and never rename a row, so the id-renaming hazard is gone. `values` is a table or a record by declaration, so a no-plugin record source publishes a record `values`.

Not changed, but worth a decision from you: the guide keeps the work in this repository, as you chose. The earlier risk (a long red period while about 124 test files and 31 source files change shape) is handled by sections 16 and 19, not removed. Treat a short-lived branch as mandatory, not optional.

## Appendix B: Proposed rule ids

Proposed, for the closed `RuleId` union. Names are suggestions. Reuse an existing id where one already covers the case, for example `composition-output-shape`.

- `track-legacy-field`: old `keyframes` or `observes` present.
- `track-field-unknown`: unknown authored structural field.
- `spec-field-unknown`: unknown structural field inside a `ValueSpec`, such as the retired `type` alias.
- `values-shape-invalid`: authored `values` is a table where a record is declared, or the reverse.
- `row-id-invalid`, `row-id-duplicate`, `name-reserved`: bad row id, duplicate id, or a reserved row, column, field or output name.
- `cell-form-invalid`, `cell-stops-invalid`, `cell-kind-conflict`: bad cell, malformed stops, conflicting scalar kinds.
- `static-field-stops`: stop sequence in a `static: true` column or field.
- `plugin-unknown`, `plugin-requires-without-plugin`, `input-schema-on-plugin-track`.
- `slot-unknown`, `slot-required-missing`, `slot-binding-mode`, `slot-incompatible`, `slot-unproven`.
- `plugin-input-invalid`: runtime input fails the plugin's input spec.
- `plugin-validation-failed`, `plugin-validation-warning`: wrappers for error- and warning-severity issues returned by a plugin's `validate`. Two ids because a rule fixes its severity once.
- `output-undeclared`, `output-missing`, `output-invalid`, `output-row-id-duplicate`: the returned set disagrees with the plugin's `outputs`, including a wrong kind.
- `live-values-invalid`: a live write violates the committed contract or shape.
