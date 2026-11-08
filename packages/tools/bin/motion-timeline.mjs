import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { registerSourceLoader } from "../../../scripts/source-loader.mjs";

registerSourceLoader();
const { loadBuiltinCatalog } = await import("../src/engine/catalog.ts");
const { renderTimeline, timelineOf } = await import("../src/engine/timeline.ts");
const { readSceneModule, sceneTimeline } = await import("../src/scene/scene.ts");

const [file, ...rest] = process.argv.slice(2);
if (file === undefined || rest.length > 0) {
  console.log("usage: motion:timeline <project.json | scene.ts>");
  process.exitCode = 1;
} else if (/\.tsx?$/.test(file)) {
  const module = readSceneModule(await import(pathToFileURL(resolve(file)).href));
  if ("reason" in module) {
    console.log(module.reason);
    process.exitCode = 1;
  } else console.log(renderTimeline(sceneTimeline(module)));
} else {
  const timeline = timelineOf(JSON.parse(readFileSync(file, "utf8")), await loadBuiltinCatalog());
  console.log(renderTimeline(timeline));
  if (timeline.kind !== "timeline") process.exitCode = 1;
}
