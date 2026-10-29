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
      schema: { kind: "record", fields: { x: { kind: "number" } } },
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
non-negative number and applies to the Motion's tracks in order.

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
  plugin: "fk",
  input: {
    values: { length: 40, rotation: 10 },
    requires: { chain: "body", solved: "solver", base: "root" },
    schema: undefined,
  },
  duration: 600,
}
```

- `id` is a non-empty unqualified id: no `/` and no `:`.
- `plugin` is optional. It names one identified definition admitted in `PluginCatalog`.
- `input.values` is optional and is the track's local authored value.
- `input.requires` is optional and binds declared plugin slots to source node ids. One slot takes one
  source id; a map-valued slot takes `{ memberKey: "sourceId" }`.
- `input.schema` is source-only. A plugin track takes its input contract from the plugin.
- `duration` is optional; absent means the source-derived duration.

Grouped `keyframes` and `observes` are refused as `track-legacy-field`. There is no flat,
ungrouped property form.

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

A track without `plugin` may declare `input.schema`, a `ValueSpec` describing what it will publish.
Without a schema its contract is inferred from `input.values`.

```js
{
  id: "cursor",
  schema: {
    kind: "record",
    fields: { x: { kind: "number" }, visible: { kind: "boolean", optional: true } },
  },
  input: { values: { x: 10 } },
}
```

Tables use `{ kind: "table", schema: { row: { fields }, minRows?, maxRows? } }`. Records use
`{ kind: "record", fields, additionalProperties? }`. A field declares `kind`, optional `optional`,
`enum`, `min`, `max`, or source-only `static`.

## Plugins

A plugin definition has:

- `id`: the public name, matching its `@motion5/plugins/<id>` path.
- `inputs.values`: the local value spec.
- `inputs.requires`: optional slot declarations, each a dependency spec with declared output specs.
- `outputs`: the named outputs the plugin publishes.
- `validate`: optional diagnostics.
- `transform`: one transformation from resolved inputs to named outputs.

`PluginCatalog.registerAll` admits a batch atomically. `EngineOptions.plugins` accepts a
`PluginCatalog`.

The main output is `values`; a plugin may publish additional named outputs. A table output is a
table of rows; a record output is a flat scalar record. Consumers select a row explicitly through the
core selector; no consumer receives a first-row fallback.

## Validation and refusal

`validateV5(project)` answers either an accepted, frozen project or closed diagnostics. `Engine.load`
runs the same validation path. Duplicate motion ids, duplicate track ids, cycles, an unknown source,
an unbound required slot, an incompatible slot contract and a retired member all refuse the load
rather than loading partially.

There is no migration entry point. An authored v4 document or an authored grouped document must be
rewritten to this contract before it is loaded; retaining `migrateV4ToV5` was rejected because its
output was already refused under `track-legacy-field`.
