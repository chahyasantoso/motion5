# S6: remove dead plugin `use`

`TrackDefinition.use` is removed from the public authored contract. Legacy `use` entries are rejected at load with `plugin-contribution-unsupported-entry`, and plugin resolution has one path: authored keyframes through `resolveForKeyframes()`.

Evidence: `packages/core/test/integration/plugin-use-contract.test.ts` proves rejection through `Engine.load()`; `packages/core/test/unit/domain/plugins.test.ts` proves the deleted resolver is not part of the registry contract.
