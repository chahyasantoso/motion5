import { readFileSync } from "node:fs";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { loadBuiltinCatalog } = await import("../src/engine/catalog.ts");
const { renderTimeline, timelineOf } = await import("../src/engine/timeline.ts");

const [file, ...rest] = process.argv.slice(2);
if (file === undefined || rest.length > 0) {
  console.log("usage: motion:timeline <project.json>");
  process.exitCode = 1;
} else {
  const timeline = timelineOf(JSON.parse(readFileSync(file, "utf8")), await loadBuiltinCatalog());
  console.log(renderTimeline(timeline));
  if (timeline.kind !== "timeline") process.exitCode = 1;
}
