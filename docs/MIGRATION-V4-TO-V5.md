# Migration: authored schema v4 to v5

Schema v5 is a deliberate breaking authored-contract release. It keeps the motion meaning and runtime graph model, but makes free-track ownership explicit and reserves the qualified-id namespace.

## What changes

### 1. Bump the version

```diff
- schemaVersion: 4
+ schemaVersion: 5
```

### 2. Rename top-level `tracks` to `freeTracks`

In v4, a top-level `tracks` array contains tracks that belong to no motion. In v5, rename that property:

```diff
 {
-  schemaVersion: 4,
-  tracks: [cursorTrack],
+  schemaVersion: 5,
+  freeTracks: [cursorTrack],
 }
```

Do not rename `tracks` inside a motion. Motion-owned tracks remain under `motion.tracks`.

### 3. Update free-track references

Free tracks use the qualified `~/trackId` namespace in graph edges and runtime APIs. If a v4 edge referenced a top-level track by a bare id, make the namespace explicit:

```diff
- { source: "cursor", role: "input", target: "pointer" }
+ { source: "~/cursor", role: "input", target: "pointer" }
```

The same rule applies to programmatic lookup and adoption: use `~/cursor`, not the ambiguous bare `cursor`.

### 4. Add or validate perspective

`perspective` is optional project metadata for the renderer's 3D stage. Add a positive CSS-pixel number when the project animates `z`, `rotationX`, `rotationY`, or non-zero path-point `z` values:

```js
{ schemaVersion: 5, perspective: 1200, motions: [...] }
```

Missing perspective produces a warning, not a load failure. A present value must be finite and greater than zero.

## Compatibility policy

motion5 does not accept v4 as an alias and does not silently reinterpret top-level `tracks`. This avoids two authored dialects for one runtime contract. Build an explicit migration step at your project boundary, then pass only v5 data to motion5.

A mechanical migration is safe when the input is known to use top-level `tracks` only for free tracks:

```js
export function migrateV4ToV5(project) {
  if (!project || project.schemaVersion !== 4) return project;
  const { tracks: freeTracks = [], ...rest } = project;
  return { ...rest, schemaVersion: 5, freeTracks };
}
```

Before using it, verify that `tracks` is not a legacy field with another meaning and validate duplicate ids, qualified references, reserved ids, and perspective requirements. Migration must be performed before loading, not inside the runtime.

## Migration checklist

- [ ] Change `schemaVersion` from `4` to `5`.
- [ ] Rename only the project-level `tracks` to `freeTracks`.
- [ ] Qualify free-track references as `~/trackId`.
- [ ] Add `perspective` for 3D scenes, or accept the warning.
- [ ] Reject ids containing `/` and motion id `~`.
- [ ] Run the v5 validator and inspect warnings.
- [ ] Store the migrated document as v5; do not keep a runtime alias.
