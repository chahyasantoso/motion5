# Writing a move

Read this when no catalogued move, modified or combined, gives the motion your three lines name. The loop is in [the
agent guide](./agent-motion.md).

Write one when the motion in your three lines has a name and no catalogued move, modified or combined, gives it.
`keyframes` and `mix` in a scene are for a value this piece alone needs; a tick, a flip, a wave or any motion you
can name goes in `src/moves`, where the next piece finds it.
Glue that only this piece needs stays in the scene as a `mix`.

1. `npm run motion:new -- --move <id>` writes `apps/pieces/src/moves/<id>.ts`, a declaration the gate refuses.
2. Fill it in: the `role`, a `description` the next agent will choose it by, each option with its range and a
   description, an `example`, and `run`, which answers a pose from the options and `progress` alone. Make an option of
   what another brief would change, not of this piece's numbers. [`defineMove`](./agent-reference.md#writing-a-move)
   lists the roles and what each must hold.
3. `npm run motion:moves -- --check` until it prints no finding. It samples the move and refuses one that breaks its
   role's rest, jumps between frames, or lacks a description.
4. Import it into the scene from `./moves/<id>` and use it like a built-in. Name it in your report.
5. Name the parts your move is built from in `recipe: ["span", "squashFromSpeed"]` (ids from `--parts`); the catalog
   shows it and the gate refuses an unknown id. A move used by pieces from two briefs is listed by `motion:moves -- --candidates`
   (a piece names its brief with `export const brief = "<name>"`; a piece with none is its own), and
   `motion:promote <id>` moves it into the library; a person decides when.
