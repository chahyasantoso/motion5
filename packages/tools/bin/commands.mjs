/** The commands `gerak` runs: each name's script in this folder and a one-line summary. */
export const COMMANDS = Object.freeze({
  check: { file: "motion-check.mjs", summary: "judge a page's motion against its limits" },
  compare: { file: "motion-compare.mjs", summary: "compare a page's frame with a reference SVG" },
  fps: { file: "motion-fps.mjs", summary: "measure a page's frame rate" },
  frames: { file: "motion-frames.mjs", summary: "capture a page's frames, crops and onion skins" },
  "import-svg": {
    file: "motion-import-svg.mjs",
    summary: "turn an SVG file into a piece or add it to one",
  },
  joints: { file: "motion-joints.mjs", summary: "list the joints of a glTF model" },
  live: { file: "motion-live.mjs", summary: "serve a scene in the live editor" },
  moves: { file: "motion-moves.mjs", summary: "find moves, read their cards and the anatomy" },
  new: { file: "motion-new.mjs", summary: "scaffold a piece or a move" },
  points: { file: "motion-points.mjs", summary: "resample a point list at an even spacing" },
  probe: { file: "motion-probe.mjs", summary: "measure elements of a page at given times" },
  promote: { file: "motion-promote.mjs", summary: "promote a piece's move into the shared moves" },
  read: { file: "motion-read.mjs", summary: "read the motion a page gives its elements" },
  render: { file: "motion-render.mjs", summary: "render a page to mp4 or gif" },
  review: {
    file: "motion-review.mjs",
    summary: "review a page or a scene file for motion defects",
  },
  sample: { file: "motion-sample.mjs", summary: "sample a scene file at given times or progress" },
  style: { file: "motion-style.mjs", summary: "measure or check a brief against its style" },
  timeline: { file: "motion-timeline.mjs", summary: "draw a scene file's timeline" },
});
