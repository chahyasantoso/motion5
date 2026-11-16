# Writing a move

Read this when no catalogued move, modified or combined, gives the motion your three lines name. The loop is in [the
agent guide](../../stage/docs/stage.md).

Write one when the motion in your three lines has a name and no catalogued move, modified or combined, gives it.
`keyframes` and `mix` in a scene are for a value this piece alone needs; a tick, a flip, a wave or any motion you
can name goes in its brief's `src/moves`, where the next piece of that brief finds it.
Glue that only this piece needs stays in the scene as a `mix`.

1. `npx gerak new-move <id> --in <brief>` writes `<pieces>/<brief>/src/moves/<id>.ts`, a declaration the gate refuses.
2. Fill it in: the `role`, a `description` the next agent will choose it by, each option with its range and a
   description, an `example`, and `run`, which answers a pose from the options and `progress` alone. Make an option of
   what another brief would change, not of this piece's numbers. [`defineMove`](./reference/README.md)
   lists the roles and what each must hold.
3. **Build `run` from the parts your design named,** imported from `@gerak/moves`: an `envelope` (`taper`, `decay`,
   `attack`, `arch`) times an `oscillation` (`wave`) for anything that swings and dies away, a `path` (`ballistic`,
   `along`) for travel, an `ease` for timing, a `coupling` (`squashed`) for a squash tied to the motion. Never call
   `Math.sin`, `Math.cos` or `Math.exp` in a move: a repo test refuses it, and the parts say the same thing by name.
   A move earns its place where parts are coupled inside one progress, the squash because of the landing and at the
   landing; parts that only run side by side are composition, in the scene.
4. `npx gerak moves --check` until it prints no finding. It samples the move and refuses one that breaks its
   role's rest, jumps between frames, lacks a description, or moves nearly as an existing move does: "close to
   `jolt` (showreel): import it instead, or change what makes yours differ".
5. Import it into the scene from `./moves/<id>` and use it like a built-in. Name it in your report. A move outside
   `@gerak/moves` imports only `@gerak/moves`, so it can travel to another brief or project as it is.
6. A move used by pieces from two briefs (two folders under `apps/pieces`) is listed by
   `gerak moves --candidates`, and `gerak promote <id>` moves it into the library; a person decides when.
