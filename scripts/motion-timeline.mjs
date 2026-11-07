import { readFileSync } from "node:fs";
import { registerSourceLoader } from "./source-loader.mjs";

registerSourceLoader();
const { loadBuiltinCatalog } = await import("./motion-tools/catalog.ts");
const { renderTimeline, timelineOf } = await import("./motion-tools/timeline.ts");

const [file, ...rest] = process.argv.slice(2);
if (file === undefined || rest.length > 0) {
  console.log("usage: motion:timeline <project.json>");
  process.exitCode = 1;
} else {
  const timeline = timelineOf(JSON.parse(readFileSync(file, "utf8")), await loadBuiltinCatalog());
  console.log(renderTimeline(timeline));
  if (timeline.kind !== "timeline") process.exitCode = 1;
}
