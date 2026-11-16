---
name: make-motion
description: Make, change or polish an animation or motion piece for a web page with gerak — anything that drops, bounces, reaches, wipes, draws on, or moves a rig, letters or shapes over time. Use it whenever a brief asks for motion, an animated title, a kinetic word, or an animated character in this repository.
---

# Make motion

A piece starts from its brief, not from a piece that already exists.

1. Read [`core.md`](../../../packages/core/docs/core.md) and [`stage.md`](../../../packages/stage/docs/stage.md) whole, and follow
   the loop in `stage.md`. A piece is one stage module: `npx gerak new <name>` writes
   `<pieces>/<name>/src/<name>.ts` with its cast, its story and its skin, and `stage.html?piece=<name>` shows it.
2. Before any code, name the obvious answer to the brief, write three ideas that differ from it in what moves and
   how, and pick one that is not the obvious one. Then write that idea and its character in three lines. Choose the
   look for this brief yourself.
3. Read the primitives once with `npx gerak moves --anatomy` (fields by what they change, parts by kind,
   qualities). Write the piece's `design` (each member's fields with the quality they should have) before choosing
   any move, then ask `npx gerak moves --design <file> --target <member> --in <brief>`. Per line: use a move
   as it is, at the options its row names, combine moves in the scene, or write one from the parts you named with
   `npx gerak new-move <id> --in <brief>` and pass it through `npx gerak moves --check`.
4. Do not open any other piece in `<pieces>/*/src`, whether a stage module, a scene file or a component. They are
   tests of the runtime, and a piece begun from one comes out as its copy.
5. Read a page that `stage.md`'s table names (events, physics, rigs, 3D, layout, artwork, live inputs and more) only
   when the brief needs it; the pages of each installed package are listed in its `docs/README.md`.
6. Find any function or type by searching `docs/reference/` of the package that exports it, and any command in
   `docs/commands.md` of `@gerak/tools`, for its name; do not read package source.
7. Review with `gerak review`; dig with the other tools only into what a review showed. Read the sheet before
   calling the piece finished.
8. Change only your piece's files and the moves you wrote, and commit nothing unless asked.

## Report

- The obvious answer you named, the ideas you dropped, your three lines, and whether the finished piece shows them.
- Your design, each line's fields and parts by kind, and for each line which choice you made (use, adjust, combine
  or write) and why.
- Each move you used, and each move you wrote: its id, its role and why no catalogued move would do. Name any
  motion you built from `keyframes` in the scene and say why it is not a move.
- Any package source you opened, which file and why: that is a gap in the reference.
- What you did not see at full speed.
