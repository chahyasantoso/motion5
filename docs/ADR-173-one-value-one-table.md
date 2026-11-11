# ADR-173: One value, and one table of its fields

**Status:** Accepted, 2026-11-11

## Context

A hand-made 15 second piece was rebuilt with gerak. A move answered a pose, a reveal or a drawn stroke, three kinds
with three renderers, and colour and blur were no kind at all, so thirty of seventy elements were handled outside the
moves. What a field is was stated in three places: two lists beside the pose, the blend and combine that walked them,
and the gate's own sets of names.

## Decision

- `VALUE_FIELDS` in `@gerak/moves` is the one table of a value's fields. Each row says the field's rest, how two
  answers for it combine (add, multiply or replace), whether its path must be smooth, and whether a reveal must end
  with it at its greatest. `combine`, `mixPose` and the gate read the table; nothing else states a rest or a rule.
- A pose may carry `custom`, a record of numbers a piece names itself. A custom number rests at 0 and adds. The pure
  layer combines, blends and checks it and does not know what it means.
- Each renderer says where a custom number goes. The DOM renderer writes it as the CSS custom property `--<name>`;
  the Three.js renderer hands it to a function the piece gives. The moves carry no renderer's vocabulary, and the
  library still knows no colour, so it carries no look.
- `Pose2d` keeps its name and is derived from the table. `Reveal` and `Drawn` and their renderers go when the one
  renderer lands; a field gets its row and its renderer in the same slice, so no field is ever in the table and
  unwritten.
- A built-in is for what an app cannot build: a field, a renderer's ability, a simulation. A move that can be made
  from the parts already there is written in the app's `src/moves` and moves into the package when a second piece
  uses it.
- A piece is one scene. A long piece is one scene function built from parts by `sequence`, each given a time that
  starts at 0. There is no second kind of thing called a multi-scene.

## Consequences

- A field added to the table is combined, blended and gated with no other change.
- `Pose3d` still carries its own lists for combining and blending; they move to the table with the one renderer.
- The gate cannot say what a custom number looks like. It holds it to rest and to a smooth path, as it does a
  position.
