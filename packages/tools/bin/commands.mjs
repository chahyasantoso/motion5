/** The commands this package runs itself: each name's script in this folder and a one-line summary. */
export const COMMANDS = Object.freeze({
  beats: {
    file: "motion-beats.mjs",
    summary: "extract beat and level cues from an audio file",
  },
  check: { file: "motion-check.mjs", summary: "judge a page's motion against its limits" },
  compare: { file: "motion-compare.mjs", summary: "compare a page's frame with a reference SVG" },
  cues: {
    file: "motion-cues.mjs",
    summary: "turn subtitles or a Whisper transcript into word cues",
  },
  fps: { file: "motion-fps.mjs", summary: "measure a page's frame rate" },
  frames: { file: "motion-frames.mjs", summary: "capture a page's frames, crops and onion skins" },
  init: {
    file: "motion-init.mjs",
    summary: "set up a project: pieces folder, pages, skill and AGENTS.md",
  },
  joints: { file: "motion-joints.mjs", summary: "list the joints of a glTF model" },
  live: { file: "motion-live.mjs", summary: "serve a scene in the live editor" },
  measure: {
    file: "motion-measure.mjs",
    summary: "measure a page's cast into the cache the scene tools read",
  },
  new: { file: "motion-new.mjs", summary: "scaffold a piece" },
  points: { file: "motion-points.mjs", summary: "resample a point list at an even spacing" },
  probe: { file: "motion-probe.mjs", summary: "measure elements of a page at given times" },
  read: { file: "motion-read.mjs", summary: "read the motion a page gives its elements" },
  render: { file: "motion-render.mjs", summary: "render a page to mp4 or gif" },
  review: {
    file: "motion-review.mjs",
    summary: "review a page or a scene file for motion defects",
  },
  sample: { file: "motion-sample.mjs", summary: "sample a scene file at given times or progress" },
  timeline: { file: "motion-timeline.mjs", summary: "draw a scene file's timeline" },
});
