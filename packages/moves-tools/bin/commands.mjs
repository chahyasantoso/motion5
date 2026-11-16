/** The commands the library adds to `gerak`: each name's script in this folder and a one-line summary. */
export const COMMANDS = Object.freeze({
  moves: { file: "motion-moves.mjs", summary: "find moves, read their cards and the anatomy" },
  "new-move": { file: "motion-new-move.mjs", summary: "scaffold a move into a brief" },
  promote: { file: "motion-promote.mjs", summary: "promote a piece's move into the shared moves" },
  style: { file: "motion-style.mjs", summary: "measure or check a brief against its style" },
});
