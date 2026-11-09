# ADR-146: The render metadata channel is removed

**Status:** Accepted, 2026-11-06

**Supersedes:** the metadata channel in [ADR-073](./ADR-073-react-dom-patch-binding.md).

## Context

ADR-073 made `renderMetadata(nodeId)` part of the React DOM binding, so a plugin's serializing output
would not be written raw. It read from a `plugins` getter on the compiled track.

No producer remains. A plugin definition has no member that declares a serializer, and the track's
getter always answers `undefined`. Every `useDomPatch` source had to implement a read that never
returned data, and the DOM adapter carried a parameter that only a test filled.

## Decision

- Remove `ProjectHandle.renderMetadata`, `RenderMetadata`, `RenderMetadataSource`, `OutputSerializer`
  and the track getter.
- `createDomPatchAdapter` loses its `metadata` argument, and `useDomPatch` takes a plain `PatchSource`.
- The adapter stays the one owner of which published values are renderable: it still skips renderer
  artifacts and composite records.

## Consequences

- A published value reaches the DOM as published. A host that needs another form derives it through
  `useDerivedDomPatch` or a custom writer.
- If a plugin ever needs to declare how its output renders, that declaration comes back as a new
  decision with a real producer, not as this empty channel.
