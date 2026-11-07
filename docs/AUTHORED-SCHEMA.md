# Authored schema v5

This document is the normative input contract. The runtime accepts v5 only. It does not accept v4,
grouped `keyframes`, `observes`, or any silently migrated input.

## Minimal project

```js
{
  schemaVersion: 5,
  motions: [],
  freeTracks: [],
}
```

## Complete example

```js
const project = {
  schemaVersion: 5,
  projectId: "landing",
  perspective: 1200,
  motions: [
    {
      id: "hero",
      trigger: { type: "time", duration: 1000, repeat: -1 },
      tracks: [
        {
          id: "card",
          output: { model: "Card" },
          input: {
            values: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 200 },
              ],
              opacity: 1,
            },
          },
        },
      ],
    },
  ],
  freeTracks: [
    {
      id: "cursor",
      output: { model: "Camera" },
      input: { values: { x: 40 } },
    },
  ],
};
```

## Project

- `schemaVersion` must be `5`.
- `projectId` is optional and is not a runtime identity.
- `perspective` is required when any track carries 3D data.
- `motions` is the ordered list of Motions; `freeTracks` is the optional list of tracks no Motion
  owns.

## Motion and triggers

A Motion carries `id`, `trigger`, `tracks`, and an optional `stagger`. A stagger is a finite,
non-negative number: each track starts that many track lengths after the one before it, so `1` runs
them one after another. Every track reaches `1` at the end of the Motion, whatever the stagger.

A trigger is one of these closed shapes:

```js
{ type: "manual" }
{ type: "scroll", source?: "scroll-key" }
{ type: "time", duration: 1000, autoplay?: true, repeat?: -1, yoyo?: true }
```

`duration` is milliseconds and must be finite and greater than zero. `repeat` counts passes after the
initial one: `0` is one pass, `-1` is infinite, and any other negative or non-integer value is
refused. `yoyo` requires a repeat that actually repeats.

## Track

```js
{
  id: "arm",
  output: { plugin: "ik" },
  input: {
    param: { flip: false },
    requires: { chain: "body", goals: "targets", base: "root" },
  },
  duration: 600,
}
```

- `id` is a non-empty unqualified id: no `/` and no `:`.
- `output` is exactly one of `{ model: "<PascalCase>" }` for a source track or
  `{ plugin: "<camelCase>" }` for a computed track. A track without `output`, or with both or
  neither key, is refused.
- `input.values` is optional and is the track's local authored value. A source track publishes the
  evaluated value; a computed track passes it to the plugin as `values`. It is refused on a computed
  track whose plugin declares no `inputs.values`.
- `input.param` is optional and carries the plugin's parameters. It is refused on a model output
  and on a plugin that declares no `inputs.param`.
- `input.requires` is optional, computed tracks only, and binds declared plugin slots to source node
  ids. One slot takes one source id; a map-valued slot takes `{ memberKey: "sourceId" }`.
- `duration` is optional; absent means the source-derived duration.

The retired `type` field is refused as `type-field-retired`, and `input.schema` as
`input-schema-retired`. Grouped `keyframes` and `observes` are refused as `track-legacy-field`.
There is no flat, ungrouped property form.

## Values: a table or a record

`input.values` has exactly two shapes, discriminated by its top-level form.

A table is an array of identified rows. `id` is the row envelope and must be a non-empty string,
unique in the table. `cells` is a flat record of scalar or authored cell values. `cells.id` is
ordinary data, not identity.

```js
values: [
  { id: "hip", cells: { length: 40, rotation: 10, weight: 1 } },
  { id: "knee", cells: { parentId: "hip", length: 38, rotation: 0 } },
];
```

A record is a flat map of fields.

```js
values: { x: 20, y: 40, opacity: 0.5 };
```

A field or cell is a scalar (`number`, `string`, `boolean`) or a non-empty stop sequence in authored
input. Evaluated values are renderer-neutral scalars only: finite numbers, strings and booleans.
An empty table and an empty record are valid. A hole, malformed row, duplicate envelope id or
structured cell value refuses the whole document rather than part of it.

## Authored cells and stops

```js
{ p: 0.25, v: 40, ease: "power2.out" }
```

`p` is a finite progress in `[0, 1]`; `v` is a scalar; `ease` is optional. Stops must be ordered and
unique by position. A static scalar never enters the interpolator. The retired `{ stops: [...] }`
wrapper is refused as `property-stops-wrapper`.

## Sources

A source track names a registered model with `output: { model }`. The model supplies the value
spec and the optional `parse`; the engine publishes the evaluated local values and parses them at
commit. There is no authored schema to infer from.

```js
{
  id: "cursor",
  output: { model: "Camera" },
  input: { values: { x: 10 } },
}
```

Models are registered in the catalog's `models` list, or by a plugin declaration naming them. The
first-party models are exported as `builtinModels` from `@motion5/plugins/models`; hosts that author
`Body2d`, `Point2d`, `Goals2d` and their 3D counterparts register that list. A model carries `id`
(PascalCase, equal to its exported name), `spec`, and optional `parse`. Tables use
`{ kind: "table", schema: { row: { fields }, minRows?, maxRows? } }`. Records use
`{ kind: "record", fields, additionalProperties? }`. A field declares `kind`, optional `optional`,
`enum`, `min`, `max`, or source-only `static`. In code, `Spec` from `@motion5/core/plugin-api` builds the
same objects: `Spec.record({ x: Spec.number({ optional: true }) })`, `Spec.table(fields, { minRows: 2 })`.

## Plugins

A plugin definition has:

- `id`: the public name, matching its `@motion5/plugins/<id>` path.
- `inputs.param`: optional record spec for authored `input.param`.
- `inputs.values`: optional local value spec or model.
- `inputs.requires`: optional slot declarations, each a model, an optional model, or a shape spec.
- `outputs`: the named outputs the plugin publishes. The main one, `values`, must be a model
  (`plugin-values-model-required`); a secondary output may be a plain spec.
- `prepare`: optional commit-time check that returns `ok(state)` or `refused(issues)`.
- `transform`: required; one transformation from resolved inputs to named outputs.

`PluginCatalog.register` admits a batch atomically. `EngineOptions.plugins` accepts a
`PluginCatalog`. First-party kinematics publish models: `ik`/`ik3d` publish `Solved2d`/`Solved3d`,
`fk`/`fk3d` publish `Points2d`/`Points3d`, and their slots require `Body2d`/`Body3d`,
`Goals2d`/`Goals3d`, `Point2d`/`Point3d` and optionally the solved model. A model object carries
exactly `id`, `spec` and optional `parse`; any other member is refused at admission.

The main output is `values`; a plugin may publish additional named outputs. A table output is a
table of rows; a record output is a flat scalar record. Consumers select a row explicitly through the
core selector; no consumer receives a first-row fallback.

## Validation and refusal

`validateV5(project, catalog)` answers either an accepted, frozen project or closed diagnostics. `Engine.load`
runs the same validation path. Duplicate motion ids, duplicate track ids, cycles, an unknown source,
an unbound required slot, an incompatible slot contract and a retired member all refuse the load
rather than loading partially.

Track shape refusals are `output-missing` when no output is named, `output-invalid` when the output
is malformed or names both keys, `model-unknown` and `plugin-unknown` for unregistered names,
`type-field-retired` and `input-schema-retired` for the retired authored members, `param-not-allowed`
for a param on a model output or a plugin without `inputs.param`, `values-not-allowed` for values on a
plugin without `inputs.values`, and `requires-not-allowed` for bindings on a model output. An
unregistered plugin id is refused by the parser; a plugin without a `transform` is refused at
admission as `plugin-transform-missing`.

There is no migration entry point. An authored v4 document or an authored grouped document must be
rewritten to this contract before it is loaded; retaining `migrateV4ToV5` was rejected because its
output was already refused under `track-legacy-field`.
