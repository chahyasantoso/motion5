# Writing a move

Read this when no installed move, modified or combined, gives the motion your three lines name. The loop is in [the
agent guide](../../stage/docs/stage.md).

Write one when the motion in your three lines has a name and no installed move, modified or combined, gives it.
`keyframes` and `mix` in a scene are for a value this piece alone needs; a tick, a flip, a wave or any motion you
can name goes in its brief's `src/moves`, where the next piece of that brief finds it.
Glue that only this piece needs stays in the scene as a `mix`.

1. Write it as a plain function: an exported options interface with each field documented by its unit and default, and
   `export function name(options): (time: Time) => Pose2d`, which answers a pose from the options and `progress`
   alone. Make an option of what another brief would change, not of this piece's numbers.
2. **Build the returned function from the parts your design named,** imported from `@gerak/core` (`taper`, `decay`, `attack`, `arch`,
   `wave`, `ballistic`, `along`, `ease`, `smear`, `trail`) and `@gerak/moves` (`squashed`, ...): an `envelope` times
   an `oscillation` for anything that swings and dies away, a `path` for travel, an `ease` for timing, a `coupling`
   for a squash tied to the motion. Never call
   `Math.sin`, `Math.cos` or `Math.exp` in a move: a repo test refuses it, and the parts say the same thing by name.
   A move earns its place where parts are coupled inside one progress, the squash because of the landing and at the
   landing; parts that only run side by side are composition, in the scene.
3. Import it into the scene from `./moves/<id>` and use it like a built-in. Name it in your report. A move outside
   `@gerak/moves` imports only `@gerak/core`, `@gerak/moves` and its own `src/parts/`, so it can travel to another brief or project as it is.
