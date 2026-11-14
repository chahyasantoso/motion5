---
name: make-motion
description: Make, change or polish an animation or motion piece for a web page with gerak — anything that drops, bounces, reaches, wipes, draws on, or moves a rig, letters or shapes over time. Use it whenever a brief asks for motion, an animated title, a kinetic word, or an animated character in this repository.
---

# Make motion

A piece starts from its brief, not from a piece that already exists.

1. Read [`docs/guide/agent-motion.md`](../../../docs/guide/agent-motion.md) and follow its loop. It is short. A
   piece is one stage module: `npm run motion:new -- <name>` writes `apps/pieces/<name>/src/<name>.ts` with its cast, its
   story and its skin, and `stage.html?piece=<name>` shows it.
2. Before any code, name the obvious answer to the brief, write three ideas that differ from it in what moves and
   how, and pick one that is not the obvious one. Then write that idea and its character in three lines. Choose the
   look for this brief yourself.
3. Choose moves from the catalog, `npm run motion:moves`, and compose them with the modifiers and `combine`. Where
   nothing fits, write a move with `npm run motion:new -- --move <id>` and pass it through
   `npm run motion:moves -- --check`.
   `npm run motion:moves -- --parts` lists the building blocks a move is made from: time, eases, blends, paths,
   follow-through, events, randomness.
4. Do not open any other piece in `apps/pieces/*/src`, whether a stage module, a scene file or a component. They are
   tests of the runtime, and a piece begun from one comes out as its copy.
5. Read a part the guide's table lists (events, physics, rigs, 3D, layout, artwork, live inputs and more) only
   when the brief needs it.
6. Find any function or command by searching [the reference](../../../docs/guide/agent-reference.md) for its name;
   do not read the reference whole, and do not read package source.
7. Review with `motion:review`; dig with the other tools only into what a review showed. Read the sheet before
   calling the piece finished.
8. Change only your piece's files and the moves you wrote, and commit nothing unless asked.

## Report

- The obvious answer you named, the ideas you dropped, your three lines, and whether the finished piece shows them.
- Each move you used, and each move you wrote: its id, its role and why no catalogued move would do. Name any
  motion you built from `keyframes` in the scene and say why it is not a move.
- Any package source you opened, which file and why: that is a gap in the reference.
- What you did not see at full speed.
