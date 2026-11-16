import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SELF = "@gerak/tools";

/** The commands this package runs itself: each name's script in this folder and a one-line summary. */
export const COMMANDS = Object.freeze({
  check: { file: "motion-check.mjs", summary: "judge a page's motion against its limits" },
  compare: { file: "motion-compare.mjs", summary: "compare a page's frame with a reference SVG" },
  fps: { file: "motion-fps.mjs", summary: "measure a page's frame rate" },
  frames: { file: "motion-frames.mjs", summary: "capture a page's frames, crops and onion skins" },
  "import-svg": {
    file: "motion-import-svg.mjs",
    summary: "turn an SVG file into a piece or add it to one",
  },
  init: {
    file: "motion-init.mjs",
    summary: "set up a project: pieces folder, pages, skill and AGENTS.md",
  },
  joints: { file: "motion-joints.mjs", summary: "list the joints of a glTF model" },
  live: { file: "motion-live.mjs", summary: "serve a scene in the live editor" },
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

/** Every command `gerak` runs, name to `{ url, summary, from }`: this package's, then each installed package's declared list. A name declared twice is an error naming both. */
export async function listCommands(options = {}) {
  const own = Object.entries(COMMANDS).map(([name, { file, summary }]) => [
    name,
    { url: new URL(file, import.meta.url).href, summary, from: SELF },
  ]);
  const declared = [];
  const { tool } = await import("./load.mjs");
  const { installedPackages } = await import(tool("scene/installed"));
  for (const { name: from, folder, commands } of installedPackages(options.starts)) {
    if (from === SELF || commands === undefined) continue;
    const module = pathToFileURL(resolve(folder, commands));
    const listed = (await import(module.href)).COMMANDS;
    for (const [name, { file, summary }] of Object.entries(listed))
      declared.push([name, { url: new URL(file, module).href, summary, from }]);
  }
  const all = new Map();
  for (const [name, command] of [...own, ...declared]) {
    const held = all.get(name);
    if (held !== undefined)
      throw new Error(
        `The command "${name}" is declared by both ${held.from} and ${command.from}.`,
      );
    all.set(name, command);
  }
  return Object.freeze(Object.fromEntries(all));
}
